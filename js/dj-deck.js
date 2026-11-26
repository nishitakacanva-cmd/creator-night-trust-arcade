/* Trust Arcade v3 — Bollywood Party DJ Deck (Synced to Stage DJ Segment + Manual HUD Control) */
(function () {
  const MIX_PATH = 'assets/audio/bollywood_dj_mix.mp3?v=20261126-user';
  const CUES = [
    { label: 'Start the mashup · 0:00', time: 0 },
    { label: 'Jump to 1:00', time: 60 },
    { label: 'Jump to 2:00', time: 120 },
  ];

  let audio = null;
  let playing = false;
  let playbackRequest = 0;
  let targetVol = 0.62;
  let fadeTimer = null;

  function ensureAudio() {
    if (!audio) {
      audio = new Audio(MIX_PATH);
      audio.loop = true;
      audio.preload = 'metadata';
      audio.volume = 0;
    }
    return audio;
  }

  function fadeTo(destVol, onDone) {
    if (fadeTimer) { clearInterval(fadeTimer); fadeTimer = null; }
    const a = ensureAudio();
    const startVol = a.volume;
    const steps = 16;
    let i = 0;
    fadeTimer = setInterval(() => {
      i++;
      const k = i / steps;
      a.volume = Math.max(0, Math.min(1, startVol + (destVol - startVol) * k));
      if (i >= steps) {
        clearInterval(fadeTimer);
        fadeTimer = null;
        if (onDone) onDone();
      }
    }, 45);
  }

  function updateUI() {
    const btn = document.getElementById('djPlayBtn');
    const pill = document.getElementById('btnDJ');
    if (btn) btn.textContent = playing ? 'Pause Bollywood Mix' : 'Play Bollywood Mix';
    if (pill) {
      pill.style.borderColor = playing ? '#E1306C' : '';
      pill.textContent = playing ? 'DJ ON' : 'DJ';
    }
  }

  function setPlaying(on, isManual = true) {
    const request = ++playbackRequest;
    const a = ensureAudio();
    if (on) {
      playing = true;
      updateUI();
      a.play().then(() => {
        if (request === playbackRequest) { fadeTo(targetVol);window.dispatchEvent(new Event('festival-music-change')); }
      }).catch(() => {
        if (request !== playbackRequest) return;
        playing = false;
        updateUI();
      });
    } else {
      playing = false;
      updateUI();
      window.dispatchEvent(new Event('festival-music-change'));
      fadeTo(0, () => { try { a.pause(); } catch (_) {} });
    }
  }

  function jumpToCue(sec) {
    const a = ensureAudio();
    try { a.currentTime = sec; } catch (_) {}
    setPlaying(true, true);
  }

  function onShowSegment(segId, soundOn) {
    if (!soundOn) {
      if (playing) setPlaying(false, false);
      return;
    }
    const isParty = segId === 'dj';
    if (isParty) {
      if (!playing) {
        setPlaying(true, false);
      }
    } else if (playing) {
      setPlaying(false, false);
    }
  }

  function setVolume(v) {
    targetVol = Math.max(0, Math.min(1, v));
    if (audio && playing) audio.volume = targetVol;
  }

  function mountUI() {
    if (document.getElementById('djDrawer')) return;

    const hudTR = document.getElementById('hudTR');
    if (hudTR && !document.getElementById('btnDJ')) {
      const btn = document.createElement('button');
      btn.id = 'btnDJ';
      btn.className = 'ib';
      btn.title = '2000s Bollywood Party DJ Deck';
      btn.style.cssText = 'width:auto;padding:0 10px;font-size:11px;font-weight:700;letter-spacing:.04em';
      btn.textContent = 'DJ';
      hudTR.insertBefore(btn, hudTR.firstChild);
      btn.addEventListener('click', () => {
        const d = document.getElementById('djDrawer');
        if (d) d.classList.toggle('hidden');
      });
    }

    const drawer = document.createElement('div');
    drawer.id = 'djDrawer';
    drawer.className = 'hidden';
    drawer.style.cssText = [
      'position:fixed;top:64px;right:18px;z-index:80;width:280px;padding:14px 16px;',
      'border-radius:16px;background:rgba(16,13,24,0.94);color:#FAF7F4;',
      'border:1px solid rgba(255,255,255,0.16);backdrop-filter:blur(16px);',
      'box-shadow:0 18px 46px rgba(0,0,0,0.48);font-family:Poppins,sans-serif;font-size:12.5px;'
    ].join('');
    drawer.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span style="font-weight:800;font-size:11px;letter-spacing:.1em;color:#FCAF45;text-transform:uppercase">Creator Night DJ Party</span>
        <button type="button" id="djClose" style="background:none;border:none;color:#fff;cursor:pointer;font-size:14px">✕</button>
      </div>
      <div id="djTrackName" style="font-size:12px;color:rgba(250,247,244,0.88);margin-bottom:10px">2000s Bollywood Party Mashup (Auto-syncs with Stage DJ)</div>
      <div style="display:flex;gap:8px;margin-bottom:10px">
        <button type="button" id="djPlayBtn" style="flex:1;padding:9px 10px;border-radius:10px;border:none;background:linear-gradient(135deg,#833AB4,#E1306C,#F77737);color:#fff;font-weight:700;cursor:pointer;font-size:12px">Play Bollywood Mix</button>
      </div>
      <div style="font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;color:rgba(250,247,244,0.58);margin-bottom:6px">Jump to Drop</div>
      <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:10px">
        ${CUES.map(c => `<button type="button" data-cue="${c.time}" style="text-align:left;padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.06);color:#FAF7F4;cursor:pointer;font-size:11.5px;font-family:inherit">▶ ${c.label}</button>`).join('')}
      </div>
      <label style="display:block;font-size:11px;color:rgba(250,247,244,0.72)">
        Party Volume
        <input type="range" id="djVol" min="0" max="100" value="62" style="width:100%;accent-color:#E1306C;margin-top:4px">
      </label>
    `;
    document.body.appendChild(drawer);

    drawer.querySelector('#djClose').onclick = () => drawer.classList.add('hidden');
    drawer.querySelector('#djPlayBtn').onclick = () => setPlaying(!playing, true);
    drawer.querySelector('#djVol').oninput = e => setVolume(Number(e.target.value) / 100);
    drawer.querySelectorAll('[data-cue]').forEach(b => {
      b.onclick = () => jumpToCue(Number(b.dataset.cue));
    });
  }

  window.TrustDJ = { get playing(){return playing && !!audio && !audio.paused}, setPlaying, setVolume, onShowSegment, jumpToCue, mountUI };
  document.addEventListener('DOMContentLoaded', mountUI);
})();
