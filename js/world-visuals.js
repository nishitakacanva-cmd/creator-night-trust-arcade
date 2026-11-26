/* Trust Arcade v3 — 3D Exhibition Gallery Lightboxes & Quick Zone Jump Bar */
(function () {
  const GALLERY_PRINTS = [
    { zone: 'fashion', file: 'assets/gemini/fashion_jacket_hero.webp', w: 1.5, h: 1.5, pos: [-2.1, 1.55, -2.5], rotY: 0.35 },
    { zone: 'beauty', file: 'assets/gemini/beauty_serum_hero.webp', w: 1.35, h: 1.35, pos: [2.1, 1.5, -2.4], rotY: -0.35 },
    { zone: 'food', file: 'assets/gemini/food_dish_a.webp', w: 1.3, h: 1.3, pos: [-2.1, 1.5, -2.4], rotY: 0.35 },
    { zone: 'fitness', file: 'assets/gemini/fitness_product_hero.webp', w: 1.35, h: 1.35, pos: [2.2, 1.5, -2.3], rotY: -0.35 },
    { zone: 'travel', file: 'assets/gemini/travel_full_context.webp', w: 3.4, h: 1.9, pos: [0, 1.85, -3.45], rotY: 0 },
    { zone: 'education', file: 'assets/gemini/education_evidence_objects.webp', w: 1.8, h: 1.35, pos: [2.0, 1.55, -2.4], rotY: -0.35 },
  ];

  function mountGalleryLightboxes(THREE, REFS) {
    if (!THREE || !REFS || !REFS.pav) return;
    const loader = new THREE.TextureLoader();

    for (const item of GALLERY_PRINTS) {
      const pav = REFS.pav[item.zone];
      if (!pav || !pav.group) continue;

      loader.load(item.file, tex => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const frameGroup = new THREE.Group();
        frameGroup.position.set(item.pos[0], item.pos[1], item.pos[2]);
        frameGroup.rotation.y = item.rotY;

        // Sleek brushed obsidian backing frame
        const backMat = new THREE.MeshStandardMaterial({ color: 0x171421, roughness: 0.45, metalness: 0.35 });
        const back = new THREE.Mesh(new THREE.BoxGeometry(item.w + 0.14, item.h + 0.14, 0.06), backMat);
        frameGroup.add(back);

        // Illuminated art print face
        const faceMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
        const face = new THREE.Mesh(new THREE.PlaneGeometry(item.w, item.h), faceMat);
        face.position.z = 0.036;
        frameGroup.add(face);

        // Subtle warm Instagram-coral top accent strip
        const stripMat = new THREE.MeshBasicMaterial({ color: 0xE1306C });
        const strip = new THREE.Mesh(new THREE.BoxGeometry(item.w + 0.14, 0.03, 0.07), stripMat);
        strip.position.y = (item.h + 0.14) / 2 + 0.015;
        frameGroup.add(strip);

        frameGroup.name = 'gallery_lightbox_' + item.zone;
        pav.group.add(frameGroup);
      });
    }
  }

  // Quick 1-click Zone Jump Bar (makes exploring during demos effortless)
  function mountQuickNav() {
    if (document.getElementById('quickZoneNav')) return;
    const zones = [
      { id: 'fashion', label: 'Fashion' },
      { id: 'beauty', label: 'Beauty' },
      { id: 'food', label: 'Food' },
      { id: 'fitness', label: 'Fitness' },
      { id: 'travel', label: 'Travel' },
      { id: 'education', label: 'Education' },
      { id: 'stage', label: 'Stage' },
      { id: 'market', label: 'Brand market' },
      { id: 'photo', label: 'Photo studio' },
      { id: 'wall', label: 'Trust wall' },
      { id: 'chai', label: 'Caffeine' },
      { id: 'freebies', label: 'Freebies' },
    ];
    const nav = document.createElement('div');
    nav.id = 'quickZoneNav';
    nav.style.cssText = [
      'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);z-index:40;',
      'display:flex;gap:6px;padding:6px 8px;border-radius:999px;',
      'background:rgba(16,13,24,0.82);border:1px solid rgba(255,255,255,0.14);',
      'backdrop-filter:blur(14px);box-shadow:0 10px 28px rgba(0,0,0,0.35);',
      'max-width:94vw;overflow-x:auto;'
    ].join('');
    zones.forEach(z => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = z.label;
      b.style.cssText = [
        'padding:6px 11px;border-radius:999px;border:none;background:rgba(255,255,255,0.08);',
        'color:#FAF7F4;font-family:Poppins,sans-serif;font-size:11.5px;font-weight:600;',
        'cursor:pointer;white-space:nowrap;transition:background 0.15s ease;'
      ].join('');
      b.onmouseenter = () => { b.style.background = 'rgba(225,48,108,0.85)'; };
      b.onmouseleave = () => { b.style.background = 'rgba(255,255,255,0.08)'; };
      b.onclick = () => {
        if (window.TrustArcadeBridge && window.TrustArcadeBridge.jumpToZone) {
          window.TrustArcadeBridge.jumpToZone(z.id);
        }
      };
      nav.appendChild(b);
    });
    document.body.appendChild(nav);
  }

  window.TrustWorldVisuals = { mountGalleryLightboxes, mountQuickNav };
  document.addEventListener('DOMContentLoaded', mountQuickNav);
})();
