const DERIV_APP_ID = "34ZfveN7Be9dqW8mOCJAe";
const AFFILIATE_TOKEN = "3A2CFHPG722B";

const DEFAULT_MINUTE_TIMEFRAMES = ['1', '2', '3', '5', '10', '15', '30'];
const DEFAULT_SHIFT_SECONDS = 8;
const MAX_RUNS_CAP = 6;
const DEFAULT_RUNS_TARGET = 6;

// Strictly synthetic indices only: Volatility, Volatility 1s, and Jump
const exhaustiveAssets = [
    { symbol: 'R_10',     name: 'Volatility 10',      market: 'volatility',    pip: 3, base: 6321.450, tv: 'FX:EURUSD', initialAdx: 27.4, initialWick: 0.16, defaultFeeder: 8, playbook: 'Over 2 Low-Noise' },
    { symbol: 'R_25',     name: 'Volatility 25',      market: 'volatility',    pip: 3, base: 3120.100, tv: 'FX:GBPUSD', initialAdx: 25.6, initialWick: 0.19, defaultFeeder: 2, playbook: 'Under 7 Low-Noise' },
    { symbol: 'R_50',     name: 'Volatility 50',      market: 'volatility',    pip: 3, base: 2450.750, tv: 'FX:USDJPY', initialAdx: 23.5, initialWick: 0.23, defaultFeeder: 7, playbook: 'Over 3 Momentum' },
    { symbol: 'R_75',     name: 'Volatility 75',      market: 'volatility',    pip: 3, base: 8940.200, tv: 'FX:AUDUSD', initialAdx: 26.2, initialWick: 0.18, defaultFeeder: 1, playbook: 'Under 6 Momentum' },
    { symbol: 'R_100',    name: 'Volatility 100',     market: 'volatility',    pip: 3, base: 4120.900, tv: 'FX:USDCAD', initialAdx: 22.7, initialWick: 0.25, defaultFeeder: 8, playbook: 'Over 4 Precision' },
    { symbol: '1HZ10V',   name: 'Volatility 10 (1s)', market: 'volatility_1s', pip: 2, base: 9452.18,  tv: 'FX:EURUSD', initialAdx: 28.1, initialWick: 0.15, defaultFeeder: 0, playbook: 'Under 5 Precision' },
    { symbol: '1HZ25V',   name: 'Volatility 25 (1s)', market: 'volatility_1s', pip: 2, base: 5320.45,  tv: 'FX:GBPUSD', initialAdx: 24.8, initialWick: 0.21, defaultFeeder: 9, playbook: 'Over 5 High-Yield' },
    { symbol: '1HZ50V',   name: 'Volatility 50 (1s)', market: 'volatility_1s', pip: 2, base: 48912.34, tv: 'FX:USDJPY', initialAdx: 21.9, initialWick: 0.27, defaultFeeder: 3, playbook: 'Under 4 High-Yield' },
    { symbol: '1HZ75V',   name: 'Volatility 75 (1s)', market: 'volatility_1s', pip: 2, base: 12450.80, tv: 'FX:AUDUSD', initialAdx: 26.7, initialWick: 0.17, defaultFeeder: 6, playbook: 'Over 2 Low-Noise' },
    { symbol: '1HZ100V',  name: 'Volatility 100 (1s)',market: 'volatility_1s', pip: 2, base: 1428.64,  tv: 'FX:USDCHF', initialAdx: 23.0, initialWick: 0.22, defaultFeeder: 4, playbook: 'Under 7 Low-Noise' },
    { symbol: 'JD10',     name: 'Jump 10 Index',      market: 'jump',          pip: 2, base: 1240.50,  tv: 'FX:EURGBP', initialAdx: 25.3, initialWick: 0.19, defaultFeeder: 8, playbook: 'Over 3 Momentum' },
    { symbol: 'JD25',     name: 'Jump 25 Index',      market: 'jump',          pip: 2, base: 2150.80,  tv: 'FX:NZDUSD', initialAdx: 17.2, initialWick: 0.56, defaultFeeder: 5, playbook: 'Noisy Range' },
    { symbol: 'JD50',     name: 'Jump 50 Index',      market: 'jump',          pip: 2, base: 3420.10,  tv: 'FX:AUDJPY', initialAdx: 24.1, initialWick: 0.20, defaultFeeder: 2, playbook: 'Under 6 Momentum' },
    { symbol: 'JD75',     name: 'Jump 75 Index',      market: 'jump',          pip: 2, base: 5120.40,  tv: 'FX:GBPJPY', initialAdx: 16.9, initialWick: 0.59, defaultFeeder: 7, playbook: 'Noisy Spike' },
    { symbol: 'JD100',    name: 'Jump 100 Index',     market: 'jump',          pip: 2, base: 8940.20,  tv: 'FX:EURUSD', initialAdx: 23.6, initialWick: 0.24, defaultFeeder: 9, playbook: 'Over 4 Precision' }
];

// Requested Over/Under barrier contracts:
// Over 2, Over 3, Over 4, Over 5 and Under 7, Under 6, Under 5, Under 4
const OVER_UNDER_SETUPS = [
    { key: 'OVER_2',  side: 'over',  barrier: 2, name: 'OVER 2 (DIGITOVER)',  shortName: 'OVER 2',  api: 'DIGITOVER',  payoutMult: 0.35, boatId: 1 },
    { key: 'OVER_3',  side: 'over',  barrier: 3, name: 'OVER 3 (DIGITOVER)',  shortName: 'OVER 3',  api: 'DIGITOVER',  payoutMult: 0.55, boatId: 3 },
    { key: 'OVER_4',  side: 'over',  barrier: 4, name: 'OVER 4 (DIGITOVER)',  shortName: 'OVER 4',  api: 'DIGITOVER',  payoutMult: 0.85, boatId: 5 },
    { key: 'OVER_5',  side: 'over',  barrier: 5, name: 'OVER 5 (DIGITOVER)',  shortName: 'OVER 5',  api: 'DIGITOVER',  payoutMult: 1.30, boatId: 7 },
    { key: 'UNDER_7', side: 'under', barrier: 7, name: 'UNDER 7 (DIGITUNDER)', shortName: 'UNDER 7', api: 'DIGITUNDER', payoutMult: 0.35, boatId: 2 },
    { key: 'UNDER_6', side: 'under', barrier: 6, name: 'UNDER 6 (DIGITUNDER)', shortName: 'UNDER 6', api: 'DIGITUNDER', payoutMult: 0.55, boatId: 4 },
    { key: 'UNDER_5', side: 'under', barrier: 5, name: 'UNDER 5 (DIGITUNDER)', shortName: 'UNDER 5', api: 'DIGITUNDER', payoutMult: 0.85, boatId: 6 },
    { key: 'UNDER_4', side: 'under', barrier: 4, name: 'UNDER 4 (DIGITUNDER)', shortName: 'UNDER 4', api: 'DIGITUNDER', payoutMult: 1.30, boatId: 8 }
];

let currentCategory = 'all';
let currentParityFilter = 'all';
let selectedBarrierMode = 'AUTO';
let rotationCursor = 0;
let currentSymbol = exhaustiveAssets[0].symbol;
let activeCandleTf = '5';
let rotationIntervalSec = DEFAULT_SHIFT_SECONDS;
let shiftTimer = null;
let shiftCountdown = DEFAULT_SHIFT_SECONDS;
let cooldownUntil = 0;
let marketDataStore = {};
let activeAccountMode = 'demo';
let simulatedBalance = 1000.00;
let sessionNetPnl = 0;
let sessionWins = 0;
let sessionLosses = 0;
let consecutiveLosses = 0;
let lastExecutionTimestamp = 0;
let activeAutomationMode = null;

function extractPipLastDigit(quote, pipSize = 2) {
    const formatted = Number(quote).toFixed(pipSize);
    const ch = formatted.charAt(formatted.length - 1);
    return /\d/.test(ch) ? Number(ch) : 0;
}

function getSelectedRunsTarget() {
    const val = parseInt(document.getElementById('runs-target-input')?.value, 10);
    if (!isNaN(val) && val >= 1 && val <= MAX_RUNS_CAP) return val;
    return DEFAULT_RUNS_TARGET;
}

function getSelectedTickHold() {
    const val = parseInt(document.getElementById('tick-hold-input')?.value, 10);
    if (!isNaN(val) && val >= 1 && val <= 10) return val;
    return 3;
}

function updateTickHoldOverride() {
    const ticks = getSelectedTickHold();
    Object.values(marketDataStore).forEach(st => {
        st.ticks = ticks;
        st.strategy.ticks = ticks;
    });
    updateSignalUI(currentSymbol);
    renderScanner();
}

function updateRunsTargetOverride() {
    const st = marketDataStore[currentSymbol];
    if (st) {
        st.runsTarget = getSelectedRunsTarget();
        st.runsCompleted = 0;
        updateSignalUI(currentSymbol);
    }
}

function updateRotationIntervalFromInput() {
    const val = parseInt(document.getElementById('loss-cooldown-sec')?.value, 10);
    rotationIntervalSec = (!isNaN(val) && val >= 4 && val <= 30) ? val : DEFAULT_SHIFT_SECONDS;
    shiftCountdown = Math.min(shiftCountdown, rotationIntervalSec);
    const pill = document.getElementById('shift-countdown-pill');
    if (pill) pill.innerText = `${shiftCountdown}s`;
}

function isDigitInBarrierZone(digit, setup) {
    if (setup.side === 'over') return digit > setup.barrier;
    return digit < setup.barrier;
}

function chooseBestBarrierSetup(digits, sideFilter = 'all', explicitKey = 'AUTO') {
    if (explicitKey && explicitKey !== 'AUTO') {
        const found = OVER_UNDER_SETUPS.find(s => s.key === explicitKey);
        if (found) return found;
    }

    const candidates = OVER_UNDER_SETUPS.filter(s => sideFilter === 'all' || s.side === sideFilter);
    const pool = candidates.length > 0 ? candidates : OVER_UNDER_SETUPS;

    if (!digits || digits.length === 0) return pool[0];

    let bestSetup = pool[0];
    let bestScore = -Infinity;

    pool.forEach(s => {
        const hits = digits.filter(d => isDigitInBarrierZone(d, s)).length;
        const zoneFitPct = hits / digits.length;
        // Favor high zone hit rate while rewarding cleaner multi-digit coverage
        const score = (zoneFitPct * 100) + (s.side === 'over' ? (5 - s.barrier) * 1.2 : (s.barrier - 4) * 1.2);
        if (score > bestScore) {
            bestScore = score;
            bestSetup = s;
        }
    });

    return bestSetup;
}

function computeMomentumNoiseAndFeeder(prices, fallbackAdx = 25, fallbackWick = 0.18, setup = OVER_UNDER_SETUPS[0], pipSize = 2, fallbackFeeder = 8) {
    const recent = (prices && prices.length > 0) ? prices.slice(-30) : [0];
    const digits = recent.map(q => extractPipLastDigit(q, pipSize));

    if (recent.length < 4) {
        return {
            adx: fallbackAdx,
            rsi: setup.side === 'over' ? 58.0 : 42.0,
            zoneFitPct: 72,
            noiseRatio: fallbackWick,
            feederDigit: fallbackFeeder
        };
    }

    let gains = 0;
    let losses = 0;
    let totalRange = 0;
    const netMove = Math.abs(recent[recent.length - 1] - recent[0]);

    for (let i = 1; i < recent.length; i++) {
        const diff = recent[i] - recent[i - 1];
        totalRange += Math.abs(diff);
        if (diff > 0) gains += diff;
        else if (diff < 0) losses += Math.abs(diff);
    }

    const rs = losses === 0 ? 10 : gains / losses;
    const rsi = Number((100 - (100 / (1 + rs))).toFixed(1));
    const adx = Number(Math.min(45, Math.max(15.0, 19.5 + Math.abs(rsi - 50) * 0.85)).toFixed(1));

    const zoneHits = digits.filter(d => isDigitInBarrierZone(d, setup)).length;
    const zoneFitPct = Math.round((zoneHits / digits.length) * 100);

    const rawNoise = totalRange > 0 ? Math.max(0.08, Math.min(0.65, 1 - (netMove / (totalRange + 1e-9)) * 0.65)) : fallbackWick;
    const noiseRatio = Number(((rawNoise + fallbackWick) / 2).toFixed(2));

    // Pick firm feeder digit inside the winning Over/Under barrier zone with strongest rolling count
    const counts = Array(10).fill(0);
    digits.forEach(d => counts[d]++);

    let bestDigit = fallbackFeeder;
    let bestScore = -Infinity;
    for (let d = 0; d < 10; d++) {
        const inZone = isDigitInBarrierZone(d, setup);
        const score = (counts[d] / digits.length) * 1.5 + (inZone ? 0.25 : 0);
        if (score > bestScore) {
            bestScore = score;
            bestDigit = d;
        }
    }

    return {
        adx,
        rsi,
        zoneFitPct,
        noiseRatio,
        feederDigit: bestDigit
    };
}

function getMarketTypeLabel(marketKey) {
    if (marketKey === 'volatility_1s') return 'Vol 1s';
    if (marketKey === 'jump') return 'Jump';
    return 'Volatility';
}

exhaustiveAssets.forEach((a, idx) => {
    const tf = DEFAULT_MINUTE_TIMEFRAMES[idx % DEFAULT_MINUTE_TIMEFRAMES.length];
    const strat = OVER_UNDER_SETUPS[idx % OVER_UNDER_SETUPS.length];
    const ticks = getSelectedTickHold();
    const initCalc = computeMomentumNoiseAndFeeder([a.base], a.initialAdx, a.initialWick, strat, a.pip, a.defaultFeeder);

    marketDataStore[a.symbol] = {
        name: a.name,
        market: a.market,
        pip: a.pip,
        price: a.base.toFixed(a.pip),
        feederDigit: initCalc.feederDigit,
        lockedSetupKey: strat.key,
        priceHistory: [a.base],
        timeframe: tf,
        ticks: ticks,
        runsTarget: DEFAULT_RUNS_TARGET,
        runsCompleted: 0,
        strategy: { ...strat, ticks: ticks },
        playbook: a.playbook,
        adx: a.initialAdx,
        rsi: strat.side === 'over' ? 58.0 : 42.0,
        zoneFitPct: 72,
        wickRatio: a.initialWick,
        lastTickDir: 'up'
    };
});

function evaluateOverUnderAPlus(st) {
    const minAdx = parseFloat(document.getElementById('filter-min-adx')?.value) || 18;
    const maxWick = parseFloat(document.getElementById('filter-max-wick')?.value) || 0.48;

    const adxOk = st.adx >= minAdx;
    const noiseOk = st.wickRatio <= maxWick;
    const cleanPlaybook = !/noisy/i.test(st.playbook);
    const zoneOk = st.zoneFitPct >= 45;

    const blockers = [];
    if (!cleanPlaybook) blockers.push(`Noisy regime (${st.playbook})`);
    if (!noiseOk) blockers.push(`Noise ${st.wickRatio.toFixed(2)} > ${maxWick}`);
    if (!adxOk) blockers.push(`Weak ADX ${st.adx} < ${minAdx}`);
    if (!zoneOk) blockers.push(`Low barrier fit ${st.zoneFitPct}%`);

    const isAPlus = cleanPlaybook && noiseOk && adxOk && zoneOk;
    const score = st.adx + (noiseOk ? 8 : 0) + (zoneOk ? 6 : 0) - (st.wickRatio * 22);

    return {
        isAPlus,
        score,
        gradeLabel: isAPlus ? `A+ ${st.strategy.shortName}` : 'NULL SIGNAL',
        statusText: isAPlus
            ? `A+ ALIGNED: ${st.strategy.name} | Feeder ${st.feederDigit} | Fit ${st.zoneFitPct}% • ADX ${st.adx} • Noise ${st.wickRatio.toFixed(2)}`
            : `NULL SIGNAL (${blockers.slice(0, 2).join(' | ')})`
    };
}

function updateBarrierOverride() {
    selectedBarrierMode = document.getElementById('barrier-select-input')?.value || 'AUTO';
    Object.values(marketDataStore).forEach(st => {
        const digits = st.priceHistory.map(q => extractPipLastDigit(q, st.pip));
        const nextSetup = chooseBestBarrierSetup(digits, currentParityFilter, selectedBarrierMode);
        st.strategy = { ...nextSetup, ticks: getSelectedTickHold() };
        st.lockedSetupKey = nextSetup.key;
        const calc = computeMomentumNoiseAndFeeder(st.priceHistory, st.adx, st.wickRatio, st.strategy, st.pip, st.feederDigit);
        st.feederDigit = calc.feederDigit;
        st.zoneFitPct = calc.zoneFitPct;
    });
    updateSignalUI(currentSymbol);
    renderScanner();
}

function refreshAllFilterStatuses() {
    updateSignalUI(currentSymbol);
    renderScanner();
}

function logTransaction(msg, isHighlight = false) {
    const logContainer = document.getElementById('live-transaction-log');
    if (!logContainer) return;
    if (logContainer.querySelector('.italic')) logContainer.innerHTML = '';

    const time = new Date().toLocaleTimeString();
    const row = document.createElement('div');
    row.className = isHighlight
        ? 'p-1.5 rounded bg-emerald-950/80 border border-fxgreen text-fxgreen font-bold'
        : 'p-1 rounded bg-slate-950 border border-slate-800/80 text-slate-300';
    row.innerText = `[${time}] ${msg}`;
    logContainer.prepend(row);
    if (logContainer.children.length > 25) logContainer.lastChild.remove();
}

function dismissSplash() {
    const s = document.getElementById('splash-screen');
    if (s) { s.style.opacity = '0'; setTimeout(() => s.style.display = 'none', 300); }
}

function authDeriv() {
    if (window.derivApiInstance) {
        window.derivApiInstance.startOAuthLogin(AFFILIATE_TOKEN);
    }
}

function openDerivCashier(action) {
    const cashierUrl = action === 'withdraw'
        ? 'https://app.deriv.com/account/cashier/withdrawal'
        : 'https://app.deriv.com/account/cashier/deposit';
    window.open(cashierUrl, '_blank');
}

async function handleAccountSelect(accountId) {
    if (window.derivApiInstance && accountId) {
        const ok = await window.derivApiInstance.connectAuthenticatedWebSocket(accountId);
        if (ok) {
            const acc = window.derivApiInstance.accounts.find(a => a.account === accountId);
            const mode = acc && !acc.isVirtual ? 'real' : 'demo';
            activeAccountMode = mode;
            document.getElementById('btn-demo').className = mode === 'demo' ? "px-3 py-1 rounded-lg font-bold bg-emerald-600 text-white transition" : "px-3 py-1 rounded-lg font-semibold text-slate-400";
            document.getElementById('btn-real').className = mode === 'real' ? "px-3 py-1 rounded-lg font-bold bg-gold text-slate-950 transition" : "px-3 py-1 rounded-lg font-semibold text-slate-400";
            document.getElementById('account-id-label').innerText = mode === 'real' ? 'Real Balance' : 'Demo Balance';
            logTransaction(`Connected OTP WebSocket to ${accountId}`, true);
        }
    }
}

async function setMode(mode) {
    activeAccountMode = mode;
    document.getElementById('btn-demo').className = mode === 'demo' ? "px-3 py-1 rounded-lg font-bold bg-emerald-600 text-white transition" : "px-3 py-1 rounded-lg font-semibold text-slate-400";
    document.getElementById('btn-real').className = mode === 'real' ? "px-3 py-1 rounded-lg font-bold bg-gold text-slate-950 transition" : "px-3 py-1 rounded-lg font-semibold text-slate-400";
    document.getElementById('account-id-label').innerText = mode === 'real' ? 'Real Balance' : 'Demo Balance';

    if (window.derivApiInstance) {
        const switched = await window.derivApiInstance.switchAccountMode(mode);
        if (switched) {
            const sel = document.getElementById('account-selector');
            if (sel) sel.value = switched.account;
            logTransaction(`Switched to ${mode.toUpperCase()} Account (${switched.account})`, true);
        }
    }
}

function switchParityFilter(filterKey) {
    currentParityFilter = filterKey;
    ['all', 'over', 'under', 'aplus'].forEach(k => {
        const btn = document.getElementById(`pf-${k}`);
        if (btn) {
            btn.className = k === filterKey
                ? "bg-cyan-600 text-white font-bold py-1 px-1 rounded"
                : "bg-slate-900 text-slate-300 py-1 px-1 rounded border border-slate-800";
        }
    });
    updateBarrierOverride();
}

function switchCategory(cat) {
    currentCategory = cat;
    ['all', 'volatility', 'volatility_1s', 'jump'].forEach(c => {
        const btn = document.getElementById(`cat-${c}`);
        if (btn) {
            btn.className = c === cat
                ? "bg-emerald-600 text-white font-bold py-1.5 px-1 rounded-lg transition"
                : "bg-slate-900 text-slate-300 py-1.5 px-1 rounded-lg transition border border-slate-800";
        }
    });
    renderScanner();
}

function changeChartTimeframe(tf, syncState = true) {
    activeCandleTf = String(tf);
    document.querySelectorAll('.tf-btn').forEach(btn => {
        btn.className = btn.dataset.tf === activeCandleTf
            ? "tf-btn px-2 py-1 rounded bg-emerald-600 text-white font-bold"
            : "tf-btn px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300";
    });
    if (syncState && marketDataStore[currentSymbol]) {
        marketDataStore[currentSymbol].timeframe = activeCandleTf;
        updateSignalUI(currentSymbol);
    }
    initTradingView(currentSymbol, activeCandleTf);
}

function toggleChartFullscreen() {
    const w = document.getElementById('chart-card-wrapper');
    w.classList.toggle('fixed'); w.classList.toggle('inset-4'); w.classList.toggle('z-50');
}

function initTradingView(sym, tf = '5') {
    const c = document.getElementById('tradingview_advanced_chart');
    if (!c || typeof TradingView === 'undefined') return;
    c.innerHTML = '';
    const assetObj = exhaustiveAssets.find(a => a.symbol === sym);
    const tvSym = (assetObj && assetObj.tv) ? assetObj.tv : "FX:EURUSD";

    new TradingView.widget({
        width: "100%",
        height: "100%",
        symbol: tvSym,
        interval: tf,
        timezone: "Africa/Nairobi",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#030712",
        studies: ["STD;EMA", "STD;RSI", "STD;Directional_Movement"],
        container_id: "tradingview_advanced_chart"
    });
}

function buildCommandString(sym, st, gate) {
    const runsCap = getSelectedRunsTarget();
    const marketLabel = gate.isAPlus ? sym : 'NULL_SIGNAL';
    return `OU_APLUS(Market=${marketLabel}, Contract=${st.strategy.shortName}, FeederDigit=${st.feederDigit}, TF=${st.timeframe}m, Ticks=${st.ticks}t, MaxRuns=${runsCap}, Grade=${gate.gradeLabel})`;
}

function updatePnlDisplay() {
    const badge = document.getElementById('pnl-summary-badge');
    const scoreEl = document.getElementById('metric-score');
    const streakEl = document.getElementById('noise-readout');

    if (badge) {
        const sign = sessionNetPnl >= 0 ? '+' : '';
        badge.innerText = `NET P&L: ${sign}$${sessionNetPnl.toFixed(2)}`;
        badge.className = sessionNetPnl >= 0
            ? "text-[10px] font-bold text-slate-950 bg-fxgreen px-2.5 py-1 rounded"
            : "text-[10px] font-bold text-white bg-rose-600 px-2.5 py-1 rounded";
    }
    if (scoreEl) scoreEl.innerText = `${sessionWins}W / ${sessionLosses}L`;
    if (streakEl) streakEl.innerText = `${consecutiveLosses}/2`;
}

function updateSignalUI(sym) {
    const st = marketDataStore[sym];
    if (!st) return;

    const runsCap = getSelectedRunsTarget();
    st.runsTarget = runsCap;
    const gate = evaluateOverUnderAPlus(st);
    const cmdStr = buildCommandString(sym, st, gate);

    if (typeof highlightActiveBoat === 'function') {
        highlightActiveBoat(st.strategy.boatId);
    }

    const filterBadge = document.getElementById('side-signal-live-badge');
    if (filterBadge) {
        filterBadge.innerText = gate.isAPlus ? 'A+ SIGNAL' : 'NULL SIGNAL';
        filterBadge.className = gate.isAPlus
            ? 'text-[9px] font-black bg-fxgreen text-slate-950 px-2 py-0.5 rounded'
            : 'text-[9px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded';
    }

    document.getElementById('chart-title-label').innerText = `${st.name} (${sym}) • ${st.timeframe}m • ${st.strategy.name} • Feeder ${st.feederDigit}`;
    document.getElementById('live-tick-symbol-tag').innerText = sym;
    document.getElementById('live-feeder-badge').innerText = st.feederDigit;
    document.getElementById('adaptive-shift-status').innerText = gate.isAPlus
        ? `A+ Locked -> ${st.name} | ${st.strategy.name} | Feeder ${st.feederDigit} | TF ${st.timeframe}m • ${st.ticks} Ticks • Max ${runsCap} Runs`
        : `NULL SIGNAL (${gate.statusText}) — Shifting Timeframes & Synthetic Assets...`;

    document.getElementById('side-sig-asset').innerText = gate.isAPlus ? `${sym} (${getMarketTypeLabel(st.market)})` : 'NULL SIGNAL';
    document.getElementById('side-sig-contract').innerText = gate.isAPlus ? st.strategy.name : 'NULL SIGNAL';
    document.getElementById('side-sig-feeder').innerText = st.feederDigit;
    document.getElementById('side-sig-candle').innerText = `${st.timeframe}m Candle`;
    document.getElementById('side-sig-ticks').innerText = `${st.ticks} Ticks`;
    document.getElementById('side-sig-runs').innerText = `${st.runsCompleted} / ${runsCap} Runs`;
    document.getElementById('side-sig-boat').innerText = aiBoatsDirectory[st.strategy.boatId].name;
    document.getElementById('side-sig-command').innerText = cmdStr;

    const expBox = document.getElementById('expectancy-warning-box');
    const expBe = document.getElementById('exp-breakeven-rate');
    const expText = document.getElementById('exp-asymmetry-text');
    const expVerdict = document.getElementById('exp-filter-verdict');

    if (expBe && expText && expVerdict && expBox) {
        expBe.innerText = `${st.strategy.shortName} (${st.zoneFitPct}% FIT)`;
        expText.innerText = gate.statusText;
        expVerdict.innerText = gate.isAPlus
            ? `Feeder Digit ${st.feederDigit} Locked • Max ${runsCap} Runs • Profit Lock Active`
            : `NULL SIGNAL — Noise or Fading Momentum Detected, Shifting TF & Asset`;
        expVerdict.className = gate.isAPlus ? 'text-[9px] font-bold text-fxgreen' : 'text-[9px] font-bold text-amber-300';
        expBox.className = gate.isAPlus
            ? 'bg-emerald-950/50 border border-fxgreen/50 rounded-xl p-2.5 space-y-1 text-[10px]'
            : 'bg-amber-950/60 border border-amber-500/60 rounded-xl p-2.5 space-y-1 text-[10px]';
    }

    document.getElementById('man-asset').innerText = `${sym} • Digit ${st.feederDigit}`;
    document.getElementById('man-strat').innerText = gate.isAPlus ? st.strategy.name : 'NULL SIGNAL';
    document.getElementById('man-trigger').innerText = `${st.timeframe}m • ${st.ticks} Ticks • Max ${runsCap} Runs`;

    document.getElementById('stable-entry-digit-display').innerText = st.feederDigit;
    document.getElementById('momentum-readout').innerText = `${st.timeframe}m / ${st.ticks}t`;
    document.getElementById('streak-lock-badge').innerText = `RUNS: ${st.runsCompleted}/${runsCap}`;

    document.getElementById('metric-adx').innerText = st.adx;
    document.getElementById('metric-rsi').innerText = st.rsi;
    document.getElementById('metric-ema').innerText = `${st.zoneFitPct}% FIT`;
    document.getElementById('metric-wick').innerText = st.wickRatio.toFixed(2);
    document.getElementById('metric-ou-rate').innerText = gate.gradeLabel;

    updatePnlDisplay();
}

function findNextApprovedOverUnderSetup(candidates) {
    for (let i = 0; i < candidates.length; i++) {
        const asset = candidates[i];
        const st = marketDataStore[asset.symbol];
        if (!st) continue;

        const digits = st.priceHistory.map(q => extractPipLastDigit(q, st.pip));
        const chosenSetup = chooseBestBarrierSetup(digits, currentParityFilter, selectedBarrierMode);

        for (let tIdx = 0; tIdx < DEFAULT_MINUTE_TIMEFRAMES.length; tIdx++) {
            const tf = DEFAULT_MINUTE_TIMEFRAMES[(tIdx + i) % DEFAULT_MINUTE_TIMEFRAMES.length];
            const prevTf = st.timeframe;
            const prevStrat = { ...st.strategy };
            st.timeframe = tf;
            st.strategy = { ...chosenSetup, ticks: getSelectedTickHold() };
            const gate = evaluateOverUnderAPlus(st);
            if (gate.isAPlus) {
                return { asset, timeframe: tf, strategy: chosenSetup };
            }
            st.timeframe = prevTf;
            st.strategy = prevStrat;
        }
    }
    return null;
}

function selectSymbol(sym, name, rotateStrategy = true) {
    currentSymbol = sym;
    shiftCountdown = rotationIntervalSec;
    const st = marketDataStore[sym];
    if (!st) return;

    st.runsCompleted = 0;
    const tickHold = getSelectedTickHold();
    if (rotateStrategy) {
        const digits = st.priceHistory.map(q => extractPipLastDigit(q, st.pip));
        const nextStrat = chooseBestBarrierSetup(digits, currentParityFilter, selectedBarrierMode);
        st.strategy = { ...nextStrat, ticks: tickHold };
        st.ticks = tickHold;
        st.runsTarget = getSelectedRunsTarget();
        const calc = computeMomentumNoiseAndFeeder(st.priceHistory, st.adx, st.wickRatio, st.strategy, st.pip, st.feederDigit);
        st.feederDigit = calc.feederDigit;
        st.zoneFitPct = calc.zoneFitPct;
        st.lockedSetupKey = st.strategy.key;
    } else {
        st.ticks = tickHold;
        st.strategy.ticks = tickHold;
        st.runsTarget = getSelectedRunsTarget();
    }

    activeCandleTf = st.timeframe;
    changeChartTimeframe(activeCandleTf, false);
    updateSignalUI(sym);

    const gate = evaluateOverUnderAPlus(st);
    logTransaction(
        gate.isAPlus
            ? `A+ Signal -> ${name} (${sym}) | ${st.strategy.name} | Feeder ${st.feederDigit} | ${st.timeframe}m • ${st.ticks} Ticks • Max ${st.runsTarget} Runs`
            : `Shifted -> ${name} (${sym}) [${st.timeframe}m] — ${gate.statusText}`,
        gate.isAPlus
    );

    if (window.derivApiInstance) {
        window.derivApiInstance.subscribeTicks(sym, handleTick);
    }
    renderScanner();
}

function pickNextRotatedAsset() {
    const pool = currentCategory === 'all'
        ? exhaustiveAssets
        : exhaustiveAssets.filter(a => a.market === currentCategory);
    if (pool.length === 0) return exhaustiveAssets[0];

    const ordered = [];
    for (let i = 1; i <= pool.length; i++) {
        ordered.push(pool[(rotationCursor + i) % pool.length]);
    }

    const approved = findNextApprovedOverUnderSetup(ordered);
    if (approved) {
        rotationCursor = pool.findIndex(a => a.symbol === approved.asset.symbol);
        const mSt = marketDataStore[approved.asset.symbol];
        mSt.timeframe = approved.timeframe;
        mSt.strategy = { ...approved.strategy, ticks: getSelectedTickHold() };
        const calc = computeMomentumNoiseAndFeeder(mSt.priceHistory, mSt.adx, mSt.wickRatio, mSt.strategy, mSt.pip, mSt.feederDigit);
        mSt.feederDigit = calc.feederDigit;
        mSt.zoneFitPct = calc.zoneFitPct;
        mSt.lockedSetupKey = mSt.strategy.key;
        return approved.asset;
    }

    rotationCursor = (rotationCursor + 1) % pool.length;
    const nextAsset = pool[rotationCursor];
    const nextSt = marketDataStore[nextAsset.symbol];
    const tfIdx = DEFAULT_MINUTE_TIMEFRAMES.indexOf(nextSt.timeframe);
    nextSt.timeframe = DEFAULT_MINUTE_TIMEFRAMES[(tfIdx + 1) % DEFAULT_MINUTE_TIMEFRAMES.length];
    return nextAsset;
}

function forceNextMarketShift() {
    const nextAsset = pickNextRotatedAsset();
    if (nextAsset) {
        selectSymbol(nextAsset.symbol, nextAsset.name, true);
    }
}

function startActiveRotationLoop() {
    if (shiftTimer) clearInterval(shiftTimer);
    updateRotationIntervalFromInput();
    shiftCountdown = rotationIntervalSec;

    shiftTimer = setInterval(() => {
        shiftCountdown--;
        const pill = document.getElementById('shift-countdown-pill');
        if (pill) pill.innerText = `${Math.max(1, shiftCountdown)}s`;

        if (shiftCountdown <= 0) {
            shiftCountdown = rotationIntervalSec;
            forceNextMarketShift();
        }
    }, 1000);
}

function renderScanner() {
    const list = document.getElementById('scanner-market-list');
    if (!list) return;
    list.innerHTML = '';

    const aPlusFirst = document.getElementById('high-hit-bias-toggle')?.checked;
    let filtered = currentCategory === 'all'
        ? exhaustiveAssets
        : exhaustiveAssets.filter(a => a.market === currentCategory);

    if (currentParityFilter === 'over') {
        filtered = filtered.filter(a => marketDataStore[a.symbol].strategy.side === 'over');
    } else if (currentParityFilter === 'under') {
        filtered = filtered.filter(a => marketDataStore[a.symbol].strategy.side === 'under');
    } else if (currentParityFilter === 'aplus') {
        filtered = filtered.filter(a => evaluateOverUnderAPlus(marketDataStore[a.symbol]).isAPlus);
    }

    if (filtered.length === 0) {
        list.innerHTML = `<div class="text-amber-300 text-center py-4 bg-amber-950/30 rounded-xl border border-amber-500/40">NULL SIGNAL — No synthetic market passes this Over/Under A+ filter right now.</div>`;
        return;
    }

    const sorted = [...filtered].sort((a, b) => {
        const gateA = evaluateOverUnderAPlus(marketDataStore[a.symbol]);
        const gateB = evaluateOverUnderAPlus(marketDataStore[b.symbol]);
        const flagA = gateA.isAPlus ? 1 : 0;
        const flagB = gateB.isAPlus ? 1 : 0;
        if (aPlusFirst && flagB !== flagA) return flagB - flagA;
        return gateB.score - gateA.score;
    });

    sorted.forEach(m => {
        const st = marketDataStore[m.symbol];
        const gate = evaluateOverUnderAPlus(st);
        const runsCap = getSelectedRunsTarget();
        const isSel = m.symbol === currentSymbol;
        const tickColor = st.lastTickDir === 'up' ? 'tick-up' : 'tick-down';

        const div = document.createElement('div');
        div.onclick = () => selectSymbol(m.symbol, m.name, true);
        div.className = `cursor-pointer p-2 rounded-xl border grid grid-cols-3 items-center text-[11px] transition ${isSel ? 'bg-emerald-950/70 border-fxgreen shadow-[0_0_10px_rgba(0,255,136,0.3)]' : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850'}`;
        div.innerHTML = `
            <div><div class="font-bold text-white truncate">${m.name}</div><div class="text-[9px] text-cyan-400">${st.timeframe}m • ${st.ticks}t • ADX ${st.adx}</div></div>
            <div class="text-right"><div class="font-bold font-mono ${tickColor}" id="price-${m.symbol}">${st.price}</div><div class="text-[9px] text-gold truncate">${gate.isAPlus ? st.strategy.shortName : 'NULL'} (${st.zoneFitPct}%)</div></div>
            <div class="text-right font-mono"><div class="${gate.isAPlus ? 'text-fxgreen' : 'text-amber-300'} font-bold text-[10px]">D:${st.feederDigit} • ${runsCap}R</div><div class="text-[9px] text-slate-400">${isSel ? 'ACTIVE' : 'QUEUED'}</div></div>
        `;
        list.appendChild(div);
    });
}

function haltWithGuardrail(reason) {
    activeAutomationMode = null;
    document.getElementById('tx-status-pill').innerText = `🛑 Guardrail Halt & Shift: ${reason}`;
    logTransaction(`GUARDRAIL HALT (${reason}) — Shifting to Next Over/Under A+ Setup — ELHADARTGLOBALFX`, true);
    if (typeof triggerProfitAlert === 'function') {
        triggerProfitAlert(reason, sessionNetPnl);
    }
    forceNextMarketShift();
}

function settleSimulatedOutcome(stake, strategy, isAPlus) {
    const winProb = isAPlus ? 0.61 : 0.45;
    const isWin = Math.random() < winProb;

    if (isWin) {
        const profit = Number((stake * strategy.payoutMult).toFixed(2));
        sessionWins++;
        consecutiveLosses = 0;
        sessionNetPnl = Number((sessionNetPnl + profit).toFixed(2));
        simulatedBalance = Number((simulatedBalance + profit).toFixed(2));
        return { isWin: true, delta: profit };
    } else {
        const loss = Number(stake.toFixed(2));
        sessionLosses++;
        consecutiveLosses++;
        sessionNetPnl = Number((sessionNetPnl - loss).toFixed(2));
        simulatedBalance = Number(Math.max(0, simulatedBalance - loss).toFixed(2));
        return { isWin: false, delta: -loss };
    }
}

function handleTick(tick) {
    const sym = tick.symbol;
    const q = Number(tick.quote);
    if (isNaN(q)) return;

    const st = marketDataStore[sym];
    if (!st) return;

    const prevPrice = parseFloat(st.price);
    const pipSize = tick.pip_size || st.pip || 2;
    st.price = q.toFixed(pipSize);
    st.lastTickDir = q >= prevPrice ? 'up' : 'down';

    st.priceHistory.push(q);
    if (st.priceHistory.length > 35) st.priceHistory.shift();

    const calc = computeMomentumNoiseAndFeeder(st.priceHistory, st.adx, st.wickRatio, st.strategy, pipSize, st.feederDigit);
    st.adx = calc.adx;
    st.rsi = calc.rsi;
    st.zoneFitPct = calc.zoneFitPct;

    const prevNoise = st.wickRatio;
    st.wickRatio = calc.noiseRatio;

    const maxWick = parseFloat(document.getElementById('filter-max-wick')?.value) || 0.48;
    const noiseDisruption = st.wickRatio > (maxWick + 0.12) && prevNoise <= (maxWick + 0.12);
    const momentumFaded = st.adx < 16.5;

    // Feeder digit stays firm without twinkling unless noise disrupts or momentum fades
    if (noiseDisruption || momentumFaded) {
        st.feederDigit = calc.feederDigit;
        if (sym === currentSymbol) {
            logTransaction(
                noiseDisruption
                    ? `Noise disruption (${st.wickRatio.toFixed(2)}) on ${sym} — Updated firm feeder digit to ${st.feederDigit}`
                    : `Fading momentum (ADX ${st.adx}) on ${sym} — Updated firm feeder digit to ${st.feederDigit}`,
                true
            );
        }
    }

    const priceEl = document.getElementById(`price-${sym}`);
    if (priceEl) {
        priceEl.innerText = st.price;
        priceEl.className = `font-bold font-mono ${st.lastTickDir === 'up' ? 'tick-up' : 'tick-down'}`;
    }

    if (sym === currentSymbol) {
        const bigQuoteEl = document.getElementById('live-big-quote');
        const feederBadgeEl = document.getElementById('live-feeder-badge');
        if (bigQuoteEl) {
            bigQuoteEl.innerText = st.price;
            bigQuoteEl.className = st.lastTickDir === 'up' ? 'text-fxgreen font-black' : 'text-rose-400 font-black';
        }
        if (feederBadgeEl) feederBadgeEl.innerText = st.feederDigit;

        document.getElementById('metric-adx').innerText = st.adx;
        document.getElementById('metric-rsi').innerText = st.rsi;
        document.getElementById('metric-ema').innerText = `${st.zoneFitPct}% FIT`;
        document.getElementById('metric-wick').innerText = st.wickRatio.toFixed(2);
        document.getElementById('side-sig-feeder').innerText = st.feederDigit;
        document.getElementById('stable-entry-digit-display').innerText = st.feederDigit;
        document.getElementById('man-asset').innerText = `${sym} • Digit ${st.feederDigit}`;

        const now = Date.now();
        const maxStreak = 2;
        const profitTarget = parseFloat(document.getElementById('session-profit-target')?.value) || 4.00;
        const maxStopLoss = parseFloat(document.getElementById('session-stop-loss')?.value) || 3.00;
        const runsCap = getSelectedRunsTarget();
        st.runsTarget = runsCap;
        const gate = evaluateOverUnderAPlus(st);

        if (activeAutomationMode && now >= cooldownUntil && (now - lastExecutionTimestamp > 1000)) {
            if (!gate.isAPlus) {
                logTransaction(`Noise or fading momentum on ${sym} (${gate.statusText}) — Shifting TF & asset...`, true);
                forceNextMarketShift();
                return;
            }

            lastExecutionTimestamp = now;
            st.runsCompleted++;

            const stake = activeAutomationMode === 'BULK'
                ? (parseFloat(document.getElementById('bulk-stake').value) || 1.00)
                : (parseFloat(document.getElementById('manual-stake').value) || 1.00);

            const executorName = activeAutomationMode === 'BOAT'
                ? aiBoatsDirectory[currentActiveBoat].name
                : `${activeAutomationMode} O/U`;

            const tickDuration = getSelectedTickHold();
            st.ticks = tickDuration;

            if (!window.derivApiInstance || !window.derivApiInstance.isAuthorized) {
                const outcome = settleSimulatedOutcome(stake, st.strategy, gate.isAPlus);
                document.getElementById('account-balance').innerText = `$${simulatedBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
                const tag = outcome.isWin ? `WIN +$${outcome.delta.toFixed(2)}` : `LOSS -$${Math.abs(outcome.delta).toFixed(2)}`;
                logTransaction(`Run ${st.runsCompleted}/${runsCap} | ${executorName} | ${sym} ${st.strategy.shortName} (Feeder ${st.feederDigit}, ${tickDuration}t) | ${tag}`, !outcome.isWin);

                if (sessionNetPnl >= profitTarget) {
                    haltWithGuardrail(`Profit Lock Target (+$${profitTarget.toFixed(2)}) Reached`);
                    return;
                }

                if (!outcome.isWin) {
                    cooldownUntil = now + 2000;
                    if (consecutiveLosses >= maxStreak) {
                        haltWithGuardrail(`Max Loss Streak (${maxStreak}) Hit`);
                        return;
                    }
                    if (sessionNetPnl <= -Math.abs(maxStopLoss)) {
                        haltWithGuardrail(`Session Stop-Loss (-$${Math.abs(maxStopLoss).toFixed(2)}) Hit`);
                        return;
                    }
                }
            } else {
                window.derivApiInstance.buyContract({
                    symbol: sym,
                    contractType: st.strategy.api,
                    barrier: st.strategy.barrier,
                    stake: stake,
                    duration: tickDuration
                });
                logTransaction(`Run ${st.runsCompleted}/${runsCap} | ${executorName} | ${st.strategy.shortName} sent on ${sym} (${tickDuration}t, Feeder ${st.feederDigit}, flat $${stake.toFixed(2)})`);
            }

            updateSignalUI(sym);

            if (activeAutomationMode && st.runsCompleted >= runsCap) {
                const prevMode = activeAutomationMode;
                st.runsCompleted = 0;
                if (prevMode === 'BULK') {
                    logTransaction(`${runsCap}-run cap completed on ${sym} — Shifting to next Over/Under A+ setup...`, true);
                    forceNextMarketShift();
                } else {
                    activeAutomationMode = null;
                    document.getElementById('tx-status-pill').innerText = `${runsCap} Runs Completed • Over/Under A+ Scanner Ready`;
                    logTransaction(`${runsCap}-run cycle completed (${executorName}) on ${sym} — Shifting to next Over/Under A+ setup...`, true);
                    forceNextMarketShift();
                }
            }
        }
    }
}

function executeAutomatedManualTrade() {
    const st = marketDataStore[currentSymbol];
    st.runsCompleted = 0;
    st.runsTarget = getSelectedRunsTarget();
    st.ticks = getSelectedTickHold();
    consecutiveLosses = 0;
    cooldownUntil = 0;
    activeAutomationMode = 'MANUAL';
    document.getElementById('tx-status-pill').innerText = `🟢 Manual (${currentSymbol} • ${st.strategy.shortName} • Feeder ${st.feederDigit} • Max ${st.runsTarget} Runs)...`;
    logTransaction(`Started Max ${st.runsTarget}-Run Manual Over/Under Setup on ${currentSymbol} | ${st.strategy.name} | Feeder ${st.feederDigit} | ${st.timeframe}m • ${st.ticks} Ticks`, true);
}

function executeAutomatedBulkTrade() {
    const count = parseInt(document.getElementById('bulk-count').value, 10) || 5;
    const pool = currentCategory === 'all'
        ? exhaustiveAssets
        : exhaustiveAssets.filter(a => a.market === currentCategory);
    const basket = pool.slice(0, count);

    if (basket.length === 0) return;

    selectSymbol(basket[0].symbol, basket[0].name, false);
    marketDataStore[currentSymbol].runsCompleted = 0;
    consecutiveLosses = 0;
    cooldownUntil = 0;
    activeAutomationMode = 'BULK';
    document.getElementById('tx-status-pill').innerText = `🟢 Bulk Over/Under Rotating (${basket.map(a => a.symbol).join(', ')})...`;
    logTransaction(`Armed Bulk Over/Under A+ Basket (${basket.length} markets): ${basket.map(a => a.symbol).join(', ')}`, true);
}

function startBoatAutomation(boatId) {
    const st = marketDataStore[currentSymbol];
    const boatToSetupMap = {
        1: 'OVER_2',
        2: 'UNDER_7',
        3: 'OVER_3',
        4: 'UNDER_6',
        5: 'OVER_4',
        6: 'UNDER_5',
        7: 'OVER_5',
        8: 'UNDER_4'
    };

    const digits = st.priceHistory.map(q => extractPipLastDigit(q, st.pip));
    const setupKey = boatToSetupMap[Number(boatId)];
    const matchedSetup = setupKey
        ? (OVER_UNDER_SETUPS.find(s => s.key === setupKey) || OVER_UNDER_SETUPS[0])
        : chooseBestBarrierSetup(digits, currentParityFilter, selectedBarrierMode);

    const tickHold = getSelectedTickHold();
    st.strategy = { ...matchedSetup, ticks: tickHold, boatId: Number(boatId) };
    st.ticks = tickHold;
    st.runsTarget = getSelectedRunsTarget();
    st.runsCompleted = 0;
    consecutiveLosses = 0;
    cooldownUntil = 0;

    const calc = computeMomentumNoiseAndFeeder(st.priceHistory, st.adx, st.wickRatio, st.strategy, st.pip, st.feederDigit);
    st.feederDigit = calc.feederDigit;
    st.zoneFitPct = calc.zoneFitPct;
    st.lockedSetupKey = st.strategy.key;

    activeAutomationMode = 'BOAT';
    updateSignalUI(currentSymbol);
    document.getElementById('tx-status-pill').innerText = `🟢 ${aiBoatsDirectory[boatId].name} (Feeder ${st.feederDigit} • Max ${st.runsTarget} Runs)...`;
    logTransaction(`Running ${aiBoatsDirectory[boatId].name} on ${currentSymbol} | ${st.strategy.name} | Feeder ${st.feederDigit} (${st.ticks} Ticks) | Max ${st.runsTarget} Runs`, true);
}

function stopAllAutomation() {
    activeAutomationMode = null;
    if (marketDataStore[currentSymbol]) {
        marketDataStore[currentSymbol].runsCompleted = 0;
        updateSignalUI(currentSymbol);
    }
    document.getElementById('tx-status-pill').innerText = "🛑 Active Runs Stopped • Over/Under A+ Scanner Running";
    logTransaction("Active trade runs stopped. Over/Under A+ scanner and market/timeframe shift remain active.", true);
}

function copySideSignalSettings() {
    const st = marketDataStore[currentSymbol];
    const runsCap = getSelectedRunsTarget();
    const gate = evaluateOverUnderAPlus(st);
    const cmd = buildCommandString(currentSymbol, st, gate);
    const summary = `ELHADART OVER / UNDER A+ SIGNAL\nMarket: ${st.name} (${currentSymbol})\nContract: ${st.strategy.name} | Firm Feeder Digit: ${st.feederDigit}\nPlaybook: ${st.playbook} | Grade: ${gate.gradeLabel}\nCandle TF: ${st.timeframe}m | Ticks/Run: ${st.ticks}t | Max Runs: ${runsCap}\nIndicators: ADX ${st.adx} | RSI ${st.rsi} | Barrier Fit ${st.zoneFitPct}% | Noise ${st.wickRatio.toFixed(2)}\nCommand: ${cmd}`;
    navigator.clipboard?.writeText(summary);
    alert(`📋 Copied Over / Under A+ Signal:\n\n${summary}`);
}

function bootPlatform() {
    let totalSeconds = 90;
    const pBar = document.getElementById('splash-progress-bar');
    const cTxt = document.getElementById('splash-countdown-text');

    const countdownInterval = setInterval(() => {
        totalSeconds--;
        const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');
        if (cTxt) cTxt.innerText = `Loading Over / Under A+ Scanner: ${mins}:${secs} (Live Synthetic Ticks Active)`;
        if (pBar) pBar.style.width = `${((90 - totalSeconds) / 90) * 100}%`;

        if (totalSeconds <= 0) {
            clearInterval(countdownInterval);
            dismissSplash();
        }
    }, 1000);

    document.getElementById('header-asset-count').innerText = `${exhaustiveAssets.length} Synthetic Markets • O2/O3/O4/O5 & U7/U6/U5/U4 • Firm Feeder Digit • Max 6 Runs`;
    selectSymbol(exhaustiveAssets[0].symbol, exhaustiveAssets[0].name, false);
    renderScanner();
    startActiveRotationLoop();

    if (typeof DerivAPIConnector !== 'undefined') {
        const api = new DerivAPIConnector(DERIV_APP_ID);
        window.derivApiInstance = api;
        api.onAccountsLoaded = (accounts, selectedId) => {
            const sel = document.getElementById('account-selector');
            if (sel && accounts.length > 0) {
                sel.innerHTML = accounts.map(a => `<option value="${a.account}" ${a.account === selectedId ? 'selected' : ''}>${a.account} (${a.isVirtual ? 'Demo' : 'Real'})</option>`).join('');
                sel.classList.remove('hidden');
            }
        };
        api.onBalanceUpdate = (b) => {
            document.getElementById('account-balance').innerText = `$${Number(b.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
            const badge = document.getElementById('oauth-connection-badge');
            if (badge && b.loginid) {
                badge.innerText = `🟢 Connected (${b.loginid})`;
                badge.className = "text-[10px] font-mono font-bold text-fxgreen bg-emerald-950 px-2.5 py-1 rounded border border-fxgreen/40";
            }
        };
        api.onContractPurchased = (buyData) => {
            logTransaction(`Deriv Over/Under #${buyData.contract_id} Executed | Payout: $${buyData.payout}`);
        };
        api.connect(exhaustiveAssets).then(() => {
            api.subscribeTicks(currentSymbol, handleTick);
            api.subscribeMultipleTicks(exhaustiveAssets.map(a => a.symbol), handleTick);
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootPlatform);
} else {
    bootPlatform();
}
