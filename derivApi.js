class DerivAPIConnector {
    constructor(clientId = "34ZfveN7Be9dqW8mOCJAe") {
        this.clientId = clientId;
        this.publicAppId = "1089";
        this.ws = null;
        this.publicWs = null;
        this.isConnected = false;
        this.isAuthorized = false;
        this.liveWsReceiving = {};
        this.accessToken = localStorage.getItem("elhadart_oauth_token") || null;
        this.accounts = [];
        this.selectedAccountId = localStorage.getItem("elhadart_selected_acct") || null;
        this.subscribers = {};
        this.multiSubscribers = {};
        this.fallbackInterval = null;
        this.simPrices = {};
        this.simPips = {};
        this.onBalanceUpdate = null;
        this.onAccountsLoaded = null;
        this.onContractPurchased = null;
    }

    generateCodeVerifier() {
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        return btoa(String.fromCharCode(...array))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    async generateCodeChallenge(verifier) {
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    getCleanRedirectUri() {
        return window.location.origin + window.location.pathname;
    }

    async startOAuthLogin(affiliateToken = "3A2CFHPG722B") {
        const verifier = this.generateCodeVerifier();
        const challenge = await this.generateCodeChallenge(verifier);
        sessionStorage.setItem("deriv_pkce_verifier", verifier);

        const redirectUri = this.getCleanRedirectUri();
        const authUrl = new URL("https://auth.deriv.com/oauth2/auth");
        authUrl.searchParams.set("response_type", "code");
        authUrl.searchParams.set("client_id", this.clientId);
        authUrl.searchParams.set("redirect_uri", redirectUri);
        authUrl.searchParams.set("scope", "read trade");
        authUrl.searchParams.set("code_challenge", challenge);
        authUrl.searchParams.set("code_challenge_method", "S256");
        if (affiliateToken) {
            authUrl.searchParams.set("affiliate_token", affiliateToken);
        }
        window.location.href = authUrl.toString();
    }

    async handleOAuthCallback() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const verifier = sessionStorage.getItem("deriv_pkce_verifier");

        if (code && verifier) {
            const redirectUri = this.getCleanRedirectUri();
            try {
                const body = new URLSearchParams({
                    grant_type: "authorization_code",
                    client_id: this.clientId,
                    code: code,
                    redirect_uri: redirectUri,
                    code_verifier: verifier
                });

                const res = await fetch("https://auth.deriv.com/oauth2/token", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: body.toString()
                });

                const tokenData = await res.json();
                if (tokenData.access_token) {
                    this.accessToken = tokenData.access_token;
                    localStorage.setItem("elhadart_oauth_token", this.accessToken);
                    sessionStorage.removeItem("deriv_pkce_verifier");
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            } catch (e) {
                console.error("OAuth Token Exchange Error:", e);
            }
        }

        if (this.accessToken) {
            await this.fetchUserAccounts();
        }
    }

    async fetchUserAccounts() {
        if (!this.accessToken) return [];
        try {
            const res = await fetch("https://api.deriv.com/trading/v1/options/accounts", {
                method: "GET",
                headers: { "Authorization": `Bearer ${this.accessToken}` }
            });
            if (res.status === 401) {
                this.accessToken = null;
                localStorage.removeItem("elhadart_oauth_token");
                return [];
            }
            const data = await res.json();
            const rawList = Array.isArray(data) ? data : (data.accounts || data.data || []);
            this.accounts = rawList.map(acc => {
                const id = acc.account_id || acc.id || acc.loginid || String(acc);
                const isVirtual = acc.account_type === "demo" || acc.is_virtual === true || String(id).startsWith("VRTC");
                return {
                    account: id,
                    currency: acc.currency || "USD",
                    balance: acc.balance ?? null,
                    isVirtual: isVirtual
                };
            });

            if (this.accounts.length > 0 && (!this.selectedAccountId || !this.accounts.some(a => a.account === this.selectedAccountId))) {
                const demo = this.accounts.find(a => a.isVirtual) || this.accounts[0];
                this.selectedAccountId = demo.account;
                localStorage.setItem("elhadart_selected_acct", this.selectedAccountId);
            }
            if (this.onAccountsLoaded) {
                this.onAccountsLoaded(this.accounts, this.selectedAccountId);
            }
            return this.accounts;
        } catch (e) {
            console.error("Fetch Accounts Error:", e);
            return [];
        }
    }

    async connectAuthenticatedWebSocket(accountId) {
        if (!this.accessToken || !accountId) return false;
        this.selectedAccountId = accountId;
        localStorage.setItem("elhadart_selected_acct", accountId);

        try {
            const res = await fetch(`https://api.deriv.com/trading/v1/options/accounts/${encodeURIComponent(accountId)}/otp`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            const otpData = await res.json();
            const otpWsUrl = otpData.url || otpData.websocket_url || otpData.ws_url || otpData.otp_url;

            if (!otpWsUrl) return false;

            if (this.ws) {
                try { this.ws.close(); } catch (e) {}
            }

            this.ws = new WebSocket(otpWsUrl);
            this.ws.onopen = () => {
                this.isConnected = true;
                this.isAuthorized = true;
                this.ws.send(JSON.stringify({ balance: 1, subscribe: 1 }));
                if (this.onBalanceUpdate) {
                    const matched = this.accounts.find(a => a.account === accountId);
                    this.onBalanceUpdate({
                        balance: matched && matched.balance !== null ? matched.balance : 1000,
                        loginid: accountId
                    });
                }
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.msg_type === 'balance' && data.balance && this.onBalanceUpdate) {
                        this.onBalanceUpdate({ balance: data.balance.balance, loginid: accountId });
                    } else if (data.msg_type === 'buy' && data.buy && this.onContractPurchased) {
                        this.onContractPurchased(data.buy);
                    }
                } catch (err) {}
            };

            this.ws.onclose = () => {
                this.isAuthorized = false;
            };
            return true;
        } catch (e) {
            console.error("OTP WebSocket Connection Error:", e);
            return false;
        }
    }

    async connect(assetList = []) {
        this.startHybridFallback(assetList);
        await this.handleOAuthCallback();

        if (this.accessToken && this.selectedAccountId) {
            await this.connectAuthenticatedWebSocket(this.selectedAccountId);
        }

        return new Promise((resolve) => {
            try {
                this.publicWs = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${this.publicAppId}`);
            } catch (e) {
                resolve(true);
                return;
            }

            this.publicWs.onopen = () => {
                Object.keys(this.multiSubscribers).forEach((sym, i) => {
                    setTimeout(() => {
                        if (this.publicWs.readyState === WebSocket.OPEN) {
                            this.publicWs.send(JSON.stringify({ ticks: sym, subscribe: 1 }));
                        }
                    }, i * 30);
                });
            };

            this.publicWs.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.msg_type === 'tick' && data.tick) {
                        this.liveWsReceiving[data.tick.symbol] = Date.now();
                        this.processTick(data.tick);
                    }
                } catch (err) {}
            };

            resolve(true);
        });
    }

    async switchAccountMode(mode) {
        if (this.accounts.length === 0) return null;
        const target = mode === 'real'
            ? this.accounts.find(a => !a.isVirtual)
            : this.accounts.find(a => a.isVirtual);
        if (target) {
            await this.connectAuthenticatedWebSocket(target.account);
            return target;
        }
        return null;
    }

    buyContract({ symbol, contractType, barrier, stake, duration = 3, currency = "USD" }) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.isAuthorized) return false;
        const parameters = {
            amount: Number(stake),
            basis: "stake",
            contract_type: contractType,
            barrier: String(barrier),
            currency: currency,
            duration: Number(duration),
            duration_unit: "t",
            symbol: symbol
        };
        this.ws.send(JSON.stringify({ buy: 1, price: Number(stake), parameters: parameters }));
        return true;
    }

    startHybridFallback(assetList = []) {
        if (this.fallbackInterval) return;
        assetList.forEach(a => {
            this.simPrices[a.symbol] = a.base;
            this.simPips[a.symbol] = a.pip;
        });

        this.fallbackInterval = setInterval(() => {
            const now = Date.now();
            Object.keys(this.simPrices).forEach(sym => {
                if (this.liveWsReceiving[sym] && (now - this.liveWsReceiving[sym] < 2200)) return;
                const pip = this.simPips[sym] || 2;
                const volatilityFactor = pip === 3 ? 0.018 : 0.30;
                const step = (Math.random() - 0.48) * volatilityFactor;
                this.simPrices[sym] = Number(Math.max(0.01, this.simPrices[sym] + step).toFixed(pip));
                this.processTick({
                    symbol: sym,
                    quote: this.simPrices[sym],
                    epoch: Math.floor(now / 1000),
                    pip_size: pip
                });
            });
        }, 250);
    }

    processTick(tick) {
        if (this.subscribers[tick.symbol]) this.subscribers[tick.symbol](tick);
        if (this.multiSubscribers[tick.symbol]) this.multiSubscribers[tick.symbol](tick);
    }

    subscribeTicks(symbol, cb) {
        this.subscribers[symbol] = cb;
        if (this.publicWs && this.publicWs.readyState === WebSocket.OPEN) {
            this.publicWs.send(JSON.stringify({ ticks: symbol, subscribe: 1 }));
        }
    }

    subscribeMultipleTicks(arr, cb) {
        arr.forEach((sym, i) => {
            this.multiSubscribers[sym] = cb;
            if (this.publicWs && this.publicWs.readyState === WebSocket.OPEN) {
                setTimeout(() => { this.publicWs.send(JSON.stringify({ ticks: sym, subscribe: 1 })); }, i * 30);
            }
        });
    }
}
