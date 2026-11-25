class TerminalAudioEngine {
    constructor() { this.ctx = null; this.enabled = true; }
    init() {
        if (!this.ctx) { const AC = window.AudioContext || window.webkitAudioContext; this.ctx = new AC(); }
        if (this.ctx.state === 'suspended') this.ctx.resume();
    }
    playChime() {
        if (!this.enabled) return;
        this.init();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.frequency.setValueAtTime(523.25, t);
        osc.frequency.exponentialRampToValueAtTime(1046.50, t + 0.3);
        g.gain.setValueAtTime(0.001, t);
        g.gain.exponentialRampToValueAtTime(0.2, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(g); g.connect(this.ctx.destination);
        osc.start(t); osc.stop(t + 0.4);
    }
}

const terminalAudio = new TerminalAudioEngine();

function toggleTerminalAudio() {
    terminalAudio.enabled = !terminalAudio.enabled;
    const icon = document.getElementById('audio-status-icon');
    const txt = document.getElementById('audio-status-text');
    if (icon && txt) {
        icon.innerText = terminalAudio.enabled ? '🔊' : '🔇';
        txt.innerText = terminalAudio.enabled ? 'SFX' : 'MUTED';
    }
}

function triggerProfitAlert(boatName, amt) {
    terminalAudio.playChime();
    const banner = document.getElementById('profit-toast-banner');
    const details = document.getElementById('profit-toast-details');
    if (banner && details) {
        details.innerText = `Over/Under A+ update (${boatName}) — ELHADARTGLOBALFX`;
        banner.classList.remove('translate-x-full', 'opacity-0');
        banner.classList.add('translate-x-0', 'opacity-100');
        setTimeout(() => {
            banner.classList.remove('translate-x-0', 'opacity-100');
            banner.classList.add('translate-x-full', 'opacity-0');
        }, 4500);
    }
}

const aiBoatsDirectory = {
    1: { name: "Boat 1: Over 2 Surge", option: "OVER 2" },
    2: { name: "Boat 2: Under 7 Surge", option: "UNDER 7" },
    3: { name: "Boat 3: Over 3 Momentum", option: "OVER 3" },
    4: { name: "Boat 4: Under 6 Momentum", option: "UNDER 6" },
    5: { name: "Boat 5: Over 4 Precision", option: "OVER 4" },
    6: { name: "Boat 6: Under 5 Precision", option: "UNDER 5" },
    7: { name: "Boat 7: Over 5 High-Yield", option: "OVER 5" },
    8: { name: "Boat 8: Under 4 High-Yield", option: "UNDER 4" },
    9: { name: "Boat 9: Auto Best Barrier", option: "OVER 2–5 / UNDER 7–4" }
};

let currentActiveBoat = 1;

function highlightActiveBoat(id) {
    currentActiveBoat = Number(id);
    for (let i = 1; i <= 9; i++) {
        const btn = document.getElementById(`boat-${i}`);
        if (btn) {
            btn.className = i === currentActiveBoat
                ? "p-2 rounded-xl border bg-emerald-950 border-fxgreen text-left shadow-[0_0_12px_rgba(0,255,136,0.4)] transition animate-pulse"
                : "p-2 rounded-xl border bg-slate-900 border-slate-800 text-left hover:border-fxgreen transition";
        }
    }
    const badge = document.getElementById('active-boat-badge');
    if (badge) badge.innerText = `BOAT ${currentActiveBoat} ARMED`;
}

function selectBoat(id) {
    highlightActiveBoat(id);
    const badge = document.getElementById('active-boat-badge');
    if (badge) badge.innerText = `BOAT ${id} RUNNING`;
    if (typeof startBoatAutomation === 'function') {
        startBoatAutomation(id);
    }
}
