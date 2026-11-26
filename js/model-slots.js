/* Trust Arcade v3 — Codex Curated CC0 .GLB Drop-In Slot Loader */
/* Codex: drop compressed CC0 .glb models into assets/curated/ and set enabled: true in assets/curated/MODEL_SLOTS.json */
(function () {
  const SLOTS_MANIFEST_URL = 'assets/curated/MODEL_SLOTS.json';

  async function tryLoadCuratedSlots(THREE, gltfLoader, REFS, realtimeMaterial = m => m) {
    if (!gltfLoader || !REFS || !REFS.pav) return { loaded: 0, skipped: 0 };
    let manifest;
    try {
      const res = await fetch(SLOTS_MANIFEST_URL, { cache: 'no-store' });
      if (!res.ok) return { loaded: 0, skipped: 0 };
      manifest = await res.json();
    } catch (_) {
      return { loaded: 0, skipped: 0 };
    }

    let loaded = 0, skipped = 0; const failures = [];
    const slots = Array.isArray(manifest.slots) ? manifest.slots : [];

    for (const slot of slots) {
      if (!slot.enabled || !slot.file) { skipped++; continue; }
      const targetParent = REFS.pav[slot.zone]?.group || (slot.zone === 'photo' ? REFS.booth : slot.zone === 'chai' ? REFS.chai : null);
      if (!targetParent) { skipped++; continue; }

      try {
        const gltf = await new Promise((resolve, reject) => {
          gltfLoader.load(slot.file, resolve, undefined, reject);
        });
        const root = gltf.scene || gltf.scenes[0];
        if (!root) continue;

        // Normalize bounding height to target human scale (in meters)
        const box = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3();
        box.getSize(size);
        if (slot.targetHeightMeters && size.y > 0.001) {
          const s = slot.targetHeightMeters / size.y;
          root.scale.setScalar(s);
        }
        if (typeof slot.rotY === 'number') root.rotation.y = slot.rotY;
        // Centre the rotated footprint as well as grounding the feet.
        const box2 = new THREE.Box3().setFromObject(root);
        const center = box2.getCenter(new THREE.Vector3());
        root.position.set(
          (slot.localPos ? slot.localPos[0] : 0) - center.x,
          (slot.localPos ? slot.localPos[1] : 0) - box2.min.y,
          (slot.localPos ? slot.localPos[2] : 0) - center.z
        );
        if (typeof slot.rotY === 'number') root.rotation.y = slot.rotY;

        root.traverse(obj => {
          if (obj.isMesh) {
            obj.material = Array.isArray(obj.material) ? obj.material.map(realtimeMaterial) : realtimeMaterial(obj.material); obj.castShadow = !!slot.castShadow;
            obj.receiveShadow = true;
          }
        });
        root.name = 'curated_' + slot.id;
        targetParent.add(root);
        if (slot.id === 'chai_kettle' && REFS.kettle) REFS.kettle.visible = false;
        loaded++;
      } catch (err) {
        console.warn('[TrustModelSlots] Optional curated GLB skipped:', slot.id, err?.message || err);
        skipped++;
        failures.push({ id: slot.id, message: err?.message || String(err) });
      }
    }
    return { loaded, skipped, failures };
  }

  window.TrustModelSlots = { tryLoadCuratedSlots };
})();

