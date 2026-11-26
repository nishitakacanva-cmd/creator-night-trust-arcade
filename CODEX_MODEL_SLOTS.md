# Codex Handoff — 3D Model Slots, PBR Polish & Visual Verification

## What Is Already Completed & Verified in This Repo (v3)
You do **not** need to redo any of the following — they are already wired and tested:
1. **All 12 Core Gemini Assets (`assets/gemini/F01`–`R02`)** are installed, paired for continuity (`F02` matches `F01`, `D02`/`D03` match `D01`, `R02` matches `R01`), and processed with real RGBA alpha transparency on the 9 cutouts.
2. **7 Tactile Visual Consumer Psychology Labs (`js/trust-labs.js` + `css/editorial-hud.css`)** are wired to all 12 PNGs, replacing quiz fatigue with interactive visual labs (Fashion post builder + `F02` seam zoom, Food blind tasting -> sponsor reveal, Beauty lighting toggle vs. 21-day use diary, Fitness claim-scope load/unload/reset, Travel continuous crop-widening slider on `T01`, Education source-independence trail, Main Stage bottle trust-repair timeline without the 8-minute wait) plus a personal **Field-Note Takeaway** in Passport & Exit.
3. **Critical Engineering Bugs Fixed in `index.html`:**
   - **Fitness Unload Trap & Busy Guard:** Bar plates are now clickable to unload, `lift()` has an async busy guard, and a `Reset` button clears the bar.
   - **MediaRecorder Cleanup:** Wrapped in `try/finally` so avatar posing, camera layers, and stream tracks always clean up on failure.
   - **Modal / Wheel / Inertia Freeze & Travel Race Guard:** Opening any modal or Visual Lab zeros velocity, scroll inertia, and look queue; `fastTravel()` has a re-entry guard.
   - **Accessible Viewport Zoom & Calm Editorial HUD:** Removed `maximum-scale=1, user-scalable=no`, hid the debug `L` button from default visitor view, and widened pavilion approach zone bounds by 2.4 m so the HUD zone badge updates immediately on arrival.

## What Codex Should Do Next (3D Models + Live Browser Visual Check)
1. **Download & Compress Curated CC0 `.glb` Models:**
   - Source lightweight CC0 models from [Poly Haven](https://polyhaven.com/), [ambientCG](https://ambientcg.com/), [Kenney Furniture Kit](https://kenney.nl/assets/furniture-kit), or [Poly Pizza](https://poly.pizza/) for the 6 slots listed in `assets/curated/MODEL_SLOTS.json` (plus optional contemporary studio camera for Photobooth and Indian chai kettle/kulhad set for Chai Corner).
   - Run `gltf-transform optimize` (resize textures to <=1024px WebP, Draco/Meshopt compression) and validate each file with `glTF-Validator`.
   - Drop each compressed `.glb` into `assets/curated/` and flip `"enabled": true` in `assets/curated/MODEL_SLOTS.json`. `js/model-slots.js` automatically loads them, normalizes human-scale height, grounds their pivot at `y = 0`, and attaches them to the right pavilion!
2. **Replace Primitive Geometry Where Curated Models Take Over:**
   - Once a curated `.glb` is enabled for a pavilion, hide or remove the matching crude placeholder primitives inside `buildPavDecor()` in `index.html` (e.g., flat `BoxGeometry` clothes in Fashion, 16 `CylinderGeometry` tubes in Beauty, hollow-cone dosa in Food, antique bellows camera in Photobooth).
3. **Run Live Playwright Visual & Accessibility Audit:**
   - Start a local static server (`npx serve .` or `python3 -m http.server 8080`).
   - Capture arrival, interaction, and Visual Lab screenshots for every major zone at desktop (`1440x900`) and mobile (`390x844`) viewports, check zero console errors, verify no support poles/NPCs block arrival sightlines, and commit/push to GitHub Pages.
