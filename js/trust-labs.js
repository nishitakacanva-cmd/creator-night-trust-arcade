/* Trust Arcade v3 — Tactile Visual Consumer Psychology Labs (Wired to assets/gemini/ F01–R02) */
(function () {
  const ASSET_BASE = 'assets/gemini/';
  const NOTES_KEY = 'trust_arcade_v3_field_notes';

  const ZONE_LAB_META = {
    fashion: { kicker: 'FASHION ATELIER · SOURCE CREDIBILITY', title: 'Inspect the Gifted Jacket', btn: 'Inspect Jacket & Edit Post' },
    food: { kicker: 'FOOD TASTING ROOM · FRAMING & CONTEXT', title: 'Taste First, Reveal Context Second', btn: 'Open Tasting Table' },
    beauty: { kicker: 'BEAUTY STUDIO · PRESENTATION VS EVIDENCE', title: 'Separate Studio Polish From Proof', btn: 'Inspect Serum & Use Diary' },
    fitness: { kicker: 'FITNESS LAB · CLAIM SCOPE & RISK', title: 'Match Claim Wording to Evidence', btn: 'Inspect Claims & Support' },
    travel: { kicker: 'TRAVEL PORTAL · SELECTIVE ATTENTION', title: 'Widen the Postcard Crop', btn: 'Widen Resort Frame' },
    education: { kicker: 'EDUCATION WORKBENCH · SOURCE INDEPENDENCE', title: 'Trace the Evidence Trail', btn: 'Open Evidence Workbench' },
    stage: { kicker: 'MAIN STAGE · TRUST REPAIR FINALE', title: 'Attach a Visible Correction', btn: 'Open Trust Repair Case' },
    lawn: { kicker: 'MAIN STAGE · TRUST REPAIR FINALE', title: 'Attach a Visible Correction', btn: 'Open Trust Repair Case' },
  };

  function loadNotes() {
    try {
      return JSON.parse(sessionStorage.getItem(NOTES_KEY) || '{}');
    } catch (_) {
      return {};
    }
  }
  function saveNote(zone, summary) {
    const notes = loadNotes();
    notes[zone] = { summary, at: new Date().toISOString() };
    try { sessionStorage.setItem(NOTES_KEY, JSON.stringify(notes)); } catch (_) {}
    renderFieldNotesHook();
  }

  // Per-lab interactive state
  const LAB_STATE = {
    fashion: { view: 'hero', disclose: true, condition: false, limitation: false },
    food: { lifted: [true, false, false], initialPick: null, revealed: false, finalAction: null },
    beauty: { glow: true, tab: 'bottle', decision: null },
    fitness: { claims: ['personal'], resetCount: 0 },
    travel: { cropPct: 45, decision: null },
    education: { selectedSources: ['creator'], checkedIndependence: false, decision: null },
    stage: { step: 0 },
  };

  let lastFocusEl = null;
  let activeZone = null;

  function ensureDOM() {
    if (!document.getElementById('labLaunchBar')) {
      const bar = document.createElement('div');
      bar.id = 'labLaunchBar';
      bar.className = 'hidden';
      bar.innerHTML = `<button type="button" class="lab-launch-btn" id="labLaunchBtn"><span class="lab-launch-dot"></span><span id="labLaunchText">Inspect Lab</span></button>`;
      document.body.appendChild(bar);
      bar.querySelector('#labLaunchBtn').addEventListener('click', () => {
        if (activeZone && ZONE_LAB_META[activeZone]) openLab(activeZone);
      });
    }
    if (!document.getElementById('dlgLab')) {
      const modal = document.createElement('div');
      modal.id = 'dlgLab';
      modal.className = 'modal hidden';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'labTitle');
      modal.innerHTML = `
        <div class="lab-shell">
          <div class="lab-topbar"></div>
          <div class="lab-header">
            <div>
              <div class="lab-kicker" id="labKicker"></div>
              <h2 class="lab-title" id="labTitle"></h2>
              <p class="lab-subtitle" id="labSubtitle"></p>
            </div>
            <button type="button" class="lab-close" id="labCloseBtn" aria-label="Close visual lab">✕</button>
          </div>
          <div class="lab-body" id="labBody"></div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector('#labCloseBtn').addEventListener('click', closeLab);
      modal.addEventListener('click', e => { if (e.target === modal) closeLab(); });
      window.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
          e.preventDefault();
          closeLab();
        }
      });
    }
  }

  function openLab(zoneId) {
    ensureDOM();
    const key = zoneId === 'lawn' ? 'stage' : zoneId;
    const meta = ZONE_LAB_META[key];
    if (!meta) return;
    lastFocusEl = document.activeElement;
    if (window.TrustArcadeBridge && window.TrustArcadeBridge.onLabOpen) {
      window.TrustArcadeBridge.onLabOpen('dlgLab');
    }
    const modal = document.getElementById('dlgLab');
    modal.classList.remove('hidden');
    document.getElementById('labKicker').textContent = meta.kicker;
    document.getElementById('labTitle').textContent = meta.title;
    renderLabBody(key);
    const closeBtn = document.getElementById('labCloseBtn');
    if (closeBtn) closeBtn.focus();
  }

  function closeLab() {
    const modal = document.getElementById('dlgLab');
    if (modal) modal.classList.add('hidden');
    if (window.TrustArcadeBridge && window.TrustArcadeBridge.onLabClose) {
      window.TrustArcadeBridge.onLabClose('dlgLab');
    }
    if (lastFocusEl && typeof lastFocusEl.focus === 'function') {
      try { lastFocusEl.focus(); } catch (_) {}
    }
  }

  function renderLabBody(zone) {
    const body = document.getElementById('labBody');
    const sub = document.getElementById('labSubtitle');
    if (zone === 'fashion') return renderFashion(body, sub);
    if (zone === 'food') return renderFood(body, sub);
    if (zone === 'beauty') return renderBeauty(body, sub);
    if (zone === 'fitness') return renderFitness(body, sub);
    if (zone === 'travel') return renderTravel(body, sub);
    if (zone === 'education') return renderEducation(body, sub);
    if (zone === 'stage') return renderStageRepair(body, sub);
  }

  /* 1. FASHION (F01 + F02) */
  function renderFashion(body, sub) {
    const st = LAB_STATE.fashion;
    sub.textContent = 'Sponsorship does not make a recommendation useless. Edit what the audience actually gets to see.';
    const imgSrc = st.view === 'hero' ? ASSET_BASE + 'fashion_jacket_hero.webp' : ASSET_BASE + 'fashion_jacket_detail.webp';
    const postParts = ['"Wore this plum cotton-twill jacket on a humid Mumbai evening commute."'];
    if (st.condition) postParts.push('Tested across 3 washes and 2 rainy walks; heavy weave holds structure well.');
    if (st.limitation) postParts.push('Drawback: unlined inner cuff seam had one minor loose thread out of the box and runs warm above 30°C.');
    if (!st.condition && !st.limitation) postParts.push('Obsessed with the colour and fit! Link in bio.');

    saveNote('fashion', `Fashion: Built post with ${[st.disclose && 'gifted disclosure', st.condition && 'use conditions', st.limitation && 'inner-seam limitation'].filter(Boolean).join(', ') || 'basic hype only'}.`);

    body.innerHTML = `
      <div class="lab-stage-card">
        <div class="lab-img-frame ${st.view === 'detail' ? 'fullbleed' : ''}">
          <img src="${imgSrc}" alt="${st.view === 'hero' ? 'Plum cotton twill jacket' : 'Close-up of unlined inner cuff seam with minor loose thread'}">
        </div>
        <div class="lab-toggle-grid" style="margin-top:12px;margin-bottom:0">
          <button type="button" class="lab-pill ${st.view === 'hero' ? 'active' : ''}" data-fview="hero">Full Jacket (F01)</button>
          <button type="button" class="lab-pill ${st.view === 'detail' ? 'active' : ''}" data-fview="detail">Inspect Inner Seam (F02)</button>
        </div>
      </div>
      <div>
        <div class="lab-section-lbl">Edit Recommendation Elements</div>
        <div class="lab-toggle-grid">
          <button type="button" class="lab-pill ${st.disclose ? 'active' : ''}" data-ftog="disclose">Gifted Disclosure Tag</button>
          <button type="button" class="lab-pill ${st.condition ? 'active' : ''}" data-ftog="condition">+ Real Use Conditions</button>
          <button type="button" class="lab-pill ${st.limitation ? 'active' : ''}" data-ftog="limitation">+ Inner-Seam Drawback</button>
        </div>
        <div class="lab-preview-box">
          <div class="lab-badge-row">
            ${st.disclose ? '<span class="lab-tag sponsor">Gifted by Brand · Disclosed</span>' : '<span class="lab-tag">No Disclosure Shown</span>'}
            ${st.condition ? '<span class="lab-tag evidence">Real Use Context</span>' : ''}
            ${st.limitation ? '<span class="lab-tag limit">Honest Limitation</span>' : ''}
          </div>
          <div>${postParts.join(' ')}</div>
        </div>
        <div class="lab-psych-note">
          <b>Research link (EA1 pp. 17–20):</b> 71.6% of respondents value actual product use, and visible drawbacks help people judge fit for themselves. A gifted post can still be genuinely helpful when evidence and limits stay intact.
        </div>
      </div>
    `;
    body.querySelectorAll('[data-fview]').forEach(b => b.onclick = () => { st.view = b.dataset.fview; renderFashion(body, sub); });
    body.querySelectorAll('[data-ftog]').forEach(b => b.onclick = () => { st[b.dataset.ftog] = !st[b.dataset.ftog]; renderFashion(body, sub); });
  }

  /* 2. FOOD (D01 + D02 + D03) */
  function renderFood(body, sub) {
    const st = LAB_STATE.food;
    sub.textContent = 'Simulated digital tasting: inspect all three dishes and form a preference before seeing who sponsored a plate.';
    const dishes = [
      { id: 'A', name: 'Charred Paneer Tikka', img: 'food_dish_a.webp', note: 'Smoky char, bright mint-yogurt balance, pomegranate crunch.', sponsored: false },
      { id: 'B', name: 'Tamarind Cauliflower', img: 'food_dish_b.webp', note: 'Crisp glaze, sweet-tangy sesame finish, sharp pickled onion.', sponsored: true },
      { id: 'C', name: 'Smoky Mushroom Kulcha', img: 'food_dish_c.webp', note: 'Earthy roasted mushrooms, creamy garlic labneh, toasted cashew.', sponsored: false },
    ];
    body.innerHTML = `
      <div class="lab-stage-card">
        <div class="food-grid">
          ${dishes.map((d, idx) => `
            <div class="food-card ${st.initialPick === d.id ? 'selected' : ''}" data-pick="${d.id}" tabindex="0" role="button">
              <img src="${ASSET_BASE + d.img}" alt="${d.name}">
              <div style="font-size:12px;font-weight:700;margin-top:4px">Dish ${d.id}</div>
              <div style="font-size:11px;color:#544E63">${d.name}</div>
              ${st.revealed ? (d.sponsored ? '<span class="lab-tag sponsor" style="margin-top:6px">Paid Partner</span>' : '<span class="lab-tag" style="margin-top:6px">Unsponsored</span>') : ''}
            </div>
          `).join('')}
        </div>
        <p style="font-size:11.5px;color:#6B637A;margin:10px 0 0">Note: Digital tasting is simulated. Identical plates & lighting ensure presentation does not signal sponsorship.</p>
      </div>
      <div>
        <div class="lab-section-lbl">1. Your Pre-Reveal Preference</div>
        <div class="lab-preview-box">
          ${st.initialPick ? `<b>Initial pick: Dish ${st.initialPick}</b> — ${dishes.find(x => x.id === st.initialPick).note}` : 'Select Dish A, B, or C on the left based on the tasting notes before revealing commercial context.'}
        </div>
        <div class="lab-toggle-grid">
          <button type="button" class="lab-pill ${st.revealed ? 'active' : ''}" id="foodRevealBtn" ${!st.initialPick ? 'disabled style="opacity:.45;cursor:not-allowed"' : ''}>
            ${st.revealed ? 'Commercial Context Revealed' : 'Reveal Sponsor Relationship'}
          </button>
        </div>
        ${st.revealed ? `
          <div class="lab-section-lbl">2. After Seeing Context (No Single Right Answer)</div>
          <div class="lab-toggle-grid">
            ${['Keep my preference', 'Revise my pick', 'Compare independent reviews'].map(act => `
              <button type="button" class="lab-pill ${st.finalAction === act ? 'active' : ''}" data-fact="${act}">${act}</button>
            `).join('')}
          </div>
        ` : ''}
        <div class="lab-psych-note">
          <b>Research link (EA1 pp. 17–18):</b> Commercial framing changes how people read a recommendation, but neither keeping nor revising a choice is automatically right. Noticing the context keeps your decision yours.
        </div>
      </div>
    `;
    body.querySelectorAll('[data-pick]').forEach(el => el.onclick = () => {
      st.initialPick = el.dataset.pick;
      saveNote('food', `Food: Chose Dish ${st.initialPick} before sponsor reveal${st.finalAction ? `, then chose "${st.finalAction}"` : ''}.`);
      renderFood(body, sub);
    });
    const rev = body.querySelector('#foodRevealBtn');
    if (rev && st.initialPick) rev.onclick = () => { st.revealed = true; renderFood(body, sub); };
    body.querySelectorAll('[data-fact]').forEach(b => b.onclick = () => {
      st.finalAction = b.dataset.fact;
      saveNote('food', `Food: Picked Dish ${st.initialPick} pre-reveal; after sponsor reveal chose "${st.finalAction}".`);
      renderFood(body, sub);
    });
  }

  /* 3. BEAUTY (B01 + B02) */
  function renderBeauty(body, sub) {
    const st = LAB_STATE.beauty;
    sub.textContent = 'Toggle studio polish on the bottle, then inspect the dated use record separately. Notice what changes and what stays fixed.';
    const isBottle = st.tab === 'bottle';
    const filterCss = isBottle && st.glow ? 'brightness(1.1) contrast(1.06) saturate(1.18) drop-shadow(0 12px 24px rgba(225,48,108,0.28))' : 'none';
    body.innerHTML = `
      <div class="lab-stage-card">
        <div class="lab-img-frame ${isBottle && st.glow ? 'dark' : ''}">
          <img src="${ASSET_BASE + (isBottle ? 'beauty_serum_hero.webp' : 'beauty_use_record_objects.webp')}" style="filter:${filterCss}" alt="${isBottle ? 'Unbranded frosted amber serum bottle' : 'Open blank use diary beside amber serum bottle'}">
        </div>
        <div class="lab-toggle-grid" style="margin-top:12px;margin-bottom:0">
          <button type="button" class="lab-pill ${isBottle ? 'active' : ''}" data-btab="bottle">Serum Display (B01)</button>
          <button type="button" class="lab-pill ${!isBottle ? 'active' : ''}" data-btab="diary">21-Day Use Diary (B02)</button>
          ${isBottle ? `<button type="button" class="lab-pill ${st.glow ? 'active' : ''}" id="bGlowBtn">${st.glow ? 'Studio Glow: ON' : 'Flat Daylight: OFF'}</button>` : ''}
        </div>
      </div>
      <div>
        <div class="lab-section-lbl">Inspectable Evidence (Constant Regardless of Lighting)</div>
        <div class="lab-preview-box">
          <div class="lab-badge-row"><span class="lab-tag evidence">21-Day Log</span><span class="lab-tag limit">No Clinical Trial Claimed</span></div>
          <div><b>Day 1–7:</b> Light gel texture; mild stinging on dry patches.<br><b>Day 8–21:</b> Hydrated feel on oily T-zone; no visible change on deep marks.<br><b>Limit:</b> Single fictional user log—not a dermatological study or webcam skin trial.</div>
        </div>
        <div class="lab-section-lbl">Your Decision</div>
        <div class="lab-toggle-grid">
          ${['Consider patch-testing', 'Request independent reviews', 'Not for me'].map(dec => `
            <button type="button" class="lab-pill ${st.decision === dec ? 'active' : ''}" data-bdec="${dec}">${dec}</button>
          `).join('')}
        </div>
        <div class="lab-psych-note">
          <b>Research link (EA1 pp. 13–15):</b> Visual polish increases perceptual fluency, making a product feel effortless, but polish never upgrades the underlying evidence.
        </div>
      </div>
    `;
    body.querySelectorAll('[data-btab]').forEach(b => b.onclick = () => { st.tab = b.dataset.btab; renderBeauty(body, sub); });
    const gBtn = body.querySelector('#bGlowBtn');
    if (gBtn) gBtn.onclick = () => { st.glow = !st.glow; renderBeauty(body, sub); };
    body.querySelectorAll('[data-bdec]').forEach(b => b.onclick = () => {
      st.decision = b.dataset.bdec;
      saveNote('beauty', `Beauty: Inspected lighting vs. 21-day use log; decided "${st.decision}".`);
      renderBeauty(body, sub);
    });
  }

  /* 4. FITNESS (P01) */
  function renderFitness(body, sub) {
    const st = LAB_STATE.fitness;
    sub.textContent = 'Load, unload, or reset claims freely. Stronger, broader promises demand stronger evidence than personal stories.';
    const claims = [
      { id: 'personal', label: 'Personal experience: "Mixed well after my runs"', req: 'Supported by personal use log', heavy: false },
      { id: 'ingredient', label: 'Label fact: "20g plant protein per scoop (batch COA)"', req: 'Supported by verifiable lab report', heavy: false },
      { id: 'universal', label: 'Universal promise: "Guaranteed injury-free recovery for everyone"', req: 'UNSUPPORTED: Requires clinical evidence, not creator anecdote', heavy: true },
    ];
    const hasHeavy = st.claims.includes('universal');
    body.innerHTML = `
      <div class="lab-stage-card">
        <div class="lab-img-frame">
          <img src="${ASSET_BASE}fitness_product_hero.webp" alt="Unbranded nutrition tub and shaker with zero printed health claims">
        </div>
        <p style="font-size:11.5px;color:#6B637A;margin:10px 0 0">Notice: Packaging is intentionally blank—no implied medical validation.</p>
      </div>
      <div>
        <div class="lab-section-lbl">Load or Unload Claims (Click to Toggle)</div>
        <div class="lab-toggle-grid">
          ${claims.map(c => `
            <button type="button" class="lab-pill ${st.claims.includes(c.id) ? 'active' : ''}" data-fcl="${c.id}">${st.claims.includes(c.id) ? '✓ ' : '+ '}${c.label}</button>
          `).join('')}
        </div>
        <div class="lab-preview-box">
          <div class="lab-badge-row">
            <span class="lab-tag ${hasHeavy ? 'limit' : 'evidence'}">${hasHeavy ? 'Claim Exceeds Evidence' : 'Claim Matches Available Support'}</span>
          </div>
          ${st.claims.length ? st.claims.map(id => { const c = claims.find(x => x.id === id); return `<div style="margin-bottom:4px">• ${c.req}</div>`; }).join('') : 'No claims loaded. Select one or more above.'}
        </div>
        <div class="lab-toggle-grid">
          <button type="button" class="lab-pill" id="fitResetBtn">Reset All Claims</button>
        </div>
        <div class="lab-psych-note">
          <b>Research link (EA1 pp. 22–23):</b> As perceived health risk rises, personal familiarity is no longer enough—scope of wording must match diagnostic evidence.
        </div>
      </div>
    `;
    body.querySelectorAll('[data-fcl]').forEach(b => b.onclick = () => {
      const id = b.dataset.fcl;
      const idx = st.claims.indexOf(id);
      if (idx >= 0) st.claims.splice(idx, 1); else st.claims.push(id);
      saveNote('fitness', `Fitness: Matched ${st.claims.length} claim(s) (${st.claims.includes('universal') ? 'includes unsupported universal claim' : 'scoped to verifiable evidence'}).`);
      renderFitness(body, sub);
    });
    body.querySelector('#fitResetBtn').onclick = () => { st.claims = []; renderFitness(body, sub); };
  }

  /* 5. TRAVEL (T01 — Continuous Crop Widening) */
  function renderTravel(body, sub) {
    const st = LAB_STATE.travel;
    sub.textContent = 'Drag the slider to widen the exact same photograph. The pool view is real—what matters is what sat outside the frame.';
    // At 45% crop, scale image to ~220% aligned left; at 100%, show entire continuous frame
    const scalePct = Math.round(10000 / st.cropPct);
    body.innerHTML = `
      <div class="lab-stage-card">
        <div class="travel-crop-wrap">
          <img src="${ASSET_BASE}travel_full_context.webp" style="width:${scalePct}%;height:100%;object-fit:cover;object-position:left center" alt="Continuous resort scene widening from sunlit infinity pool to adjacent renovation scaffolding and service road">
        </div>
        <label style="display:block;font-size:12px;font-weight:700;margin-top:10px;color:#1D1A26">
          Visible Frame Width: ${st.cropPct}% ${st.cropPct <= 50 ? '(Postcard Crop)' : st.cropPct >= 95 ? '(Full Context Revealed)' : '(Widening Frame...)'}
          <input type="range" min="45" max="100" value="${st.cropPct}" class="travel-slider" id="travelRange">
        </label>
      </div>
      <div>
        <div class="lab-section-lbl">Context Outside the Reel</div>
        <div class="lab-preview-box">
          <div class="lab-badge-row">
            <span class="lab-tag">Golden-Hour Pool: Real</span>
            ${st.cropPct > 65 ? '<span class="lab-tag limit">East Wing Renovation Active</span><span class="lab-tag sponsor">Service Road Access</span>' : '<span class="lab-tag">Slide frame wider to inspect surroundings</span>'}
          </div>
          <div>${st.cropPct > 65 ? '<b>Current dates & terms:</b> East wing scaffolding active 9 AM–6 PM through next month. Cancellation window is 72 hours. Ask for recent guest photos before booking.' : 'A cropped frame can be 100% authentic and still omit noise, access, and seasonal renovation.'}</div>
        </div>
        <div class="lab-section-lbl">Your Next Step</div>
        <div class="lab-toggle-grid">
          ${['Ask for current-month guest photos', 'Compare cancellation terms', 'Pass on this property'].map(d => `
            <button type="button" class="lab-pill ${st.decision === d ? 'active' : ''}" data-tdec="${d}">${d}</button>
          `).join('')}
        </div>
        <div class="lab-psych-note">
          <b>Research link (EA1 pp. 10–12):</b> A creator reel is an effective starting point for discovery, not a complete check of current dates, noise, or refund terms.
        </div>
      </div>
    `;
    body.querySelector('#travelRange').oninput = e => {
      st.cropPct = Number(e.target.value);
      renderTravel(body, sub);
    };
    body.querySelectorAll('[data-tdec]').forEach(b => b.onclick = () => {
      st.decision = b.dataset.tdec;
      saveNote('travel', `Travel: Widened resort frame to ${st.cropPct}%; next step "${st.decision}".`);
      renderTravel(body, sub);
    });
  }

  /* 6. EDUCATION (E01 — Source Independence Trail) */
  function renderEducation(body, sub) {
    const st = LAB_STATE.education;
    sub.textContent = 'Three reposts can still be one single claim. Select sources to check which ones are genuinely independent.';
    const sources = [
      { id: 'creator', label: 'Original Creator Reel', kind: 'Origin #1 (Anecdote)', indep: true },
      { id: 'repost1', label: 'Viral Repost A (Quotes Reel)', kind: 'Echo of Origin #1', indep: false },
      { id: 'repost2', label: 'Viral Repost B (Quotes Reel)', kind: 'Echo of Origin #1', indep: false },
      { id: 'buyer', label: 'Unbiased Non-Creator Buyer Review', kind: 'Independent Origin #2', indep: true },
      { id: 'spec', label: 'Provider Syllabus / Fact Sheet', kind: 'Primary Spec Origin #3', indep: true },
    ];
    const picked = sources.filter(s => st.selectedSources.includes(s.id));
    const uniqueCount = new Set(picked.map(s => s.indep ? s.id : 'creator')).size;
    body.innerHTML = `
      <div class="lab-stage-card">
        <div class="lab-img-frame">
          <img src="${ASSET_BASE}education_evidence_objects.webp" alt="Top-down blank books, spiral notebook, phone, and index cards">
        </div>
        <div style="margin-top:10px;font-size:12px;color:#544E63">
          <b>Selected voices:</b> ${picked.length} · <b>Independent evidence origins:</b> ${uniqueCount}
        </div>
      </div>
      <div>
        <div class="lab-section-lbl">Assemble Your Source Trail</div>
        <div class="lab-toggle-grid">
          ${sources.map(s => `
            <button type="button" class="lab-pill ${st.selectedSources.includes(s.id) ? 'active' : ''}" data-esrc="${s.id}">${s.label}</button>
          `).join('')}
        </div>
        <div class="lab-preview-box">
          <div class="lab-badge-row">
            <span class="lab-tag ${uniqueCount >= 2 ? 'evidence' : 'limit'}">${uniqueCount} Independent Origin${uniqueCount === 1 ? '' : 's'}</span>
          </div>
          ${picked.map(s => `<div>• <b>${s.label}</b> — ${s.kind}</div>`).join('') || 'Select sources above to trace independence.'}
        </div>
        <div class="lab-toggle-grid">
          ${['Enough independent proof', 'Still uncertain — need syllabus check'].map(d => `
            <button type="button" class="lab-pill ${st.decision === d ? 'active' : ''}" data-edec="${d}">${d}</button>
          `).join('')}
        </div>
        <div class="lab-psych-note">
          <b>Research link (EA1 p. 12):</b> 111 of 172 respondents ranked unbiased non-creator reviews among their strongest decision influences. Counting reposts mistakes volume for independence.
        </div>
      </div>
    `;
    body.querySelectorAll('[data-esrc]').forEach(b => b.onclick = () => {
      const id = b.dataset.esrc;
      const i = st.selectedSources.indexOf(id);
      if (i >= 0) st.selectedSources.splice(i, 1); else st.selectedSources.push(id);
      renderEducation(body, sub);
    });
    body.querySelectorAll('[data-edec]').forEach(b => b.onclick = () => {
      st.decision = b.dataset.edec;
      saveNote('education', `Education: Traced ${picked.length} sources (${uniqueCount} independent); verdict "${st.decision}".`);
      renderEducation(body, sub);
    });
  }

  /* 7. MAIN STAGE — TRUST REPAIR (R01 + R02) */
  function renderStageRepair(body, sub) {
    const st = LAB_STATE.stage;
    sub.textContent = 'Walk through how visible accountability works when new evidence arrives after a recommendation is already live.';
    const steps = [
      { label: '1. Original Post', img: 'repair_bottle_hero.webp', opaque: false, tag: 'Initial Recommendation', text: '"Used this matte-coral insulated bottle all week at my desk—kept water cold for 12 hours and looked clean on camera."' },
      { label: '2. New Evidence', img: 'repair_bottle_leak_detail.webp', opaque: true, tag: 'New Issue Found', text: 'After carrying the bottle sideways in a backpack, water visibly leaked from the brushed steel lid seam onto notebooks.' },
      { label: '3. Acknowledge & Attach', img: 'repair_bottle_leak_detail.webp', opaque: true, tag: 'Visible Correction Attached', text: 'Pinned update on the original post: "Correction — holds temp upright, but lid seam leaks when tilted in a bag. Sharing this update so anyone buying for commuting knows the limit."' },
    ];
    const cur = steps[st.step];
    saveNote('stage', `Trust Repair: Reviewed step ${st.step + 1}/3 (${cur.label}) on the matte-coral bottle correction.`);
    body.innerHTML = `
      <div class="lab-stage-card">
        <div class="lab-img-frame ${cur.opaque ? 'fullbleed' : ''}">
          <img src="${ASSET_BASE + cur.img}" alt="${cur.label}">
        </div>
      </div>
      <div>
        <div class="lab-section-lbl">Trust Repair Sequence (No 8-Minute Wait)</div>
        <div class="lab-toggle-grid">
          ${steps.map((s, idx) => `<button type="button" class="lab-pill ${st.step === idx ? 'active' : ''}" data-rstep="${idx}">${s.label}</button>`).join('')}
        </div>
        <div class="lab-preview-box">
          <div class="lab-badge-row"><span class="lab-tag ${st.step === 1 ? 'limit' : st.step === 2 ? 'evidence' : ''}">${cur.tag}</span></div>
          <div>${cur.text}</div>
        </div>
        <div class="lab-psych-note">
          <b>Research link (EA1 p. 21):</b> Attaching a visible correction to the original post shows accountability—without claiming trust is automatically restored. Audiences decide how to use the updated limit.
        </div>
      </div>
    `;
    body.querySelectorAll('[data-rstep]').forEach(b => b.onclick = () => { st.step = Number(b.dataset.rstep); renderStageRepair(body, sub); });
  }

  function renderFieldNotesHook() {
    const notes = loadNotes();
    const entries = Object.values(notes);
    ['dlgPass', 'dlgEnd'].forEach(dlgId => {
      const dlg = document.getElementById(dlgId);
      if (!dlg) return;
      const card = dlg.querySelector('.card');
      if (!card) return;
      let box = card.querySelector('.field-notes-box');
      if (!box) {
        box = document.createElement('div');
        box.className = 'field-notes-box';
        const btnrow = card.querySelector('.btnrow');
        if (btnrow) card.insertBefore(box, btnrow); else card.appendChild(box);
      }
      if (!entries.length) {
        box.innerHTML = `<h4>Your Field-Note Takeaway</h4><div>Explore any learning pavilion and tap <b>Inspect Lab</b> to record your own evidence notes here.</div>`;
      } else {
        box.innerHTML = `<h4>Your Field-Note Takeaway (${entries.length} recorded)</h4><ul>${entries.map(e => `<li>${e.summary}</li>`).join('')}</ul>`;
      }
    });
  }

  function updateZoneTrigger(zoneId) {
    ensureDOM();
    activeZone = zoneId;
    const bar = document.getElementById('labLaunchBar');
    const txt = document.getElementById('labLaunchText');
    const meta = ZONE_LAB_META[zoneId];
    if (meta && !document.querySelector('.modal:not(.hidden)')) {
      txt.textContent = meta.btn;
      bar.classList.remove('hidden');
    } else {
      bar.classList.add('hidden');
    }
  }

  window.TrustLabs = { openLab, closeLab, updateZoneTrigger, renderFieldNotesHook };
  document.addEventListener('DOMContentLoaded', () => { ensureDOM(); renderFieldNotesHook(); });
})();
