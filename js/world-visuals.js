/* Trust Arcade v3 — 3D Exhibition Gallery Lightboxes & Quick Zone Jump Bar */
(function () {
  const GALLERY_PRINTS = [
    { zone: 'fashion', file: 'assets/gemini/fashion_jacket_hero.webp', w: 1.5, h: 1.5, pos: [-3.73, 2.0, -2.7], rotY: 1.570796 },
    { zone: 'beauty', file: 'assets/gemini/beauty_serum_hero.webp', w: 1.35, h: 1.35, pos: [3.73, 2.0, -2.7], rotY: -1.570796 },
    { zone: 'food', file: 'assets/gemini/food_dish_a.webp', w: 1.3, h: 1.3, pos: [-3.73, 2.0, -2.7], rotY: 1.570796 },
    { zone: 'fitness', file: 'assets/gemini/fitness_product_hero.webp', w: 1.35, h: 1.35, pos: [-3.73, 2.0, -2.7], rotY: 1.570796 },
    { zone: 'travel', file: 'assets/gemini/travel_full_context.webp', w: 3.4, h: 1.9, pos: [-3.73, 2.0, -2.7], rotY: 1.570796 },
    { zone: 'education', file: 'assets/gemini/education_evidence_objects.webp', w: 1.8, h: 1.35, pos: [-3.73, 2.0, -2.7], rotY: 1.570796 },
  ];

  function mountGalleryLightboxes(THREE, REFS, register) {
    if (!THREE || !REFS || !REFS.pav) return;
    const loader = new THREE.TextureLoader();
    const charcoal = new THREE.MeshStandardMaterial({color:0x2e2732, roughness:.45, metalness:.45});
    const brass = new THREE.MeshStandardMaterial({color:0xc3a078, roughness:.34, metalness:.74});
    const warm = new THREE.MeshBasicMaterial({color:0xffd9ad, toneMapped:false});
    const palettes = {fashion:0xe6c9c4, beauty:0xe9dbce, food:0xd6bda4, fitness:0xbcb7b1, education:0xdfcfae, travel:0xe1d0b8};

    for (const item of GALLERY_PRINTS) {
      const pav = REFS.pav[item.zone];
      if (!pav || !pav.group) continue;

      loader.load(item.file, tex => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const frameGroup = new THREE.Group();
        frameGroup.position.set(item.pos[0], item.pos[1], item.pos[2]);
        frameGroup.rotation.y = item.rotY;

        // Sleek brushed obsidian backing frame
        const backMat = new THREE.MeshStandardMaterial({color:palettes[item.zone],roughness:.8});
        const back = new THREE.Mesh(new THREE.BoxGeometry(item.w + 0.14, item.h + 0.14, 0.06), backMat);
        frameGroup.add(back);

        // Illuminated art print face
        const faceMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
        const face = new THREE.Mesh(new THREE.PlaneGeometry(item.w, item.h), faceMat);
        face.position.z = 0.036;
        frameGroup.add(face);

        // Subtle warm Instagram-coral top accent strip
        const stripMat = warm;
        const strip = new THREE.Mesh(new THREE.BoxGeometry(item.w + 0.14, 0.03, 0.07), stripMat);
        strip.position.y = (item.h + 0.14) / 2 + 0.015;
        frameGroup.add(strip);

        frameGroup.name = 'gallery_lightbox_' + item.zone;
        pav.group.add(frameGroup);
        register(face, item.zone);
      });
    }
  }

  const destinations = [
    ['fashion','Fashion','फ़ैशन'], ['beauty','Beauty','ब्यूटी'], ['food','Food','फ़ूड'],
    ['fitness','Fitness','फ़िटनेस'], ['travel','Travel','ट्रैवल'], ['education','Education','शिक्षा'],
    ['collab','Collab claw','क्लॉ'], ['fall','Trust Fall','ट्रस्ट फ़ॉल'], ['pit','Ball pit','बॉल पिट'], ['coaster','Coaster','कोस्टर'],
    ['stage','Stage','स्टेज'], ['market','Brand market','ब्रांड बाज़ार'], ['photo','Photo studio','फ़ोटो स्टूडियो'],
    ['wall','Trust wall','भरोसा दीवार'], ['chai','Caffeine','कैफ़ीन'], ['freebies','Freebies','सैंपल']
  ];
  function syncNav(zone, lang = document.documentElement.lang) {
    const nav = document.getElementById('quickZoneNav');
    if (!nav) return;
    nav.setAttribute('aria-label', lang === 'hi' ? 'सीधे यहाँ जाएँ' : 'Jump to a festival zone');
    destinations.forEach(([id,en,hi],i) => {
      const button = nav.children[i];
      button.textContent = lang === 'hi' ? hi : en;
      if (zone === id || (id === 'stage' && zone === 'lawn')) button.setAttribute('aria-current','location');
      else button.removeAttribute('aria-current');
    });
  }
  function mountQuickNav() {
    if (document.getElementById('quickZoneNav')) return;
    const nav = document.createElement('nav'); nav.id = 'quickZoneNav';
    for (const [id] of destinations) {
      const button = document.createElement('button');
      button.type = 'button'; button.dataset.zone = id;
      button.onclick = () => window.TrustArcadeBridge?.jumpToZone(id);
      nav.append(button);
    }
    document.body.append(nav); syncNav();
  }
  window.TrustWorldVisuals = { mountGalleryLightboxes, mountQuickNav, syncNav };
  document.addEventListener('DOMContentLoaded', mountQuickNav);
})();
