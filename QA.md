# v3.1 verification · 26 November 2026

## Models and artwork

All 12 installed GLBs passed glTF-Validator with zero errors. Non-error extension/unused-data warnings are recorded in `assets/curated/MODEL_PROVENANCE.json`. Meshopt compression, simplification and WebP textures of at most 1024px reduced the added models to 5,882,896 bytes combined. Model sources explicitly publish CC0 licences; sources, triangle counts and individual sizes are in the attribution file.

All 12 original Gemini PNGs are retained. The nine transparent cutouts retain alpha in their WebP delivery copies. The 21 supplied banner/stall JPGs are retained as well. Across 33 images, delivered WebP copies total 2,817,288 bytes versus 16,939,973 source bytes: 83.4% smaller. Texture copies preserve image aspect ratios. The supplied brand manifest maps all nine market stalls and the Caffeine Corner menu.

## Browser and interactions

Playwright screenshots cover arrival and interaction states for Entry, Trust Maze, Fashion, Beauty, Food, Fitness, Travel, Education, Main Stage, Photobooth and Caffeine Corner, plus the new market, trust wall and freebie lounge. Both 1440×900 and 390×844 layouts were captured and visually reviewed. These are browser viewport checks; they are not physical phone tests.

Verified: 12/12 curated models load, all six gallery lightboxes mount, seven Visual Labs open, desktop pointer remains unlocked after dragging, desktop crosshair is hidden, 1080×1440 photo output loads, gifted-story preview blocks collection when the disclosure is removed, sample collection works, a trust note persists locally, caffeine selection works, and the claw returns a demo item. The DJ MP3 played with advancing playback time and no media error. Browser capture run reported no JavaScript or console errors.

axe-core WCAG A/AA checks returned no violations in the sampled desktop world/wall and mobile world, fashion lab, photo print and trust wall states. This automated result does not replace a full assistive-technology audit.

## Performance

Balanced graphics defaults to bounded nearby lights, with existing HIGH/MED/PERF controls retained. Character animation and shadows are throttled; avatar render distance is bounded because the original rigs disable mesh frustum culling. Removed antique camera/corset assets are no longer downloaded at startup. Optional model and gallery mounting now starts after world readiness rather than a race-prone timer.

Automated captures use deterministic frame stepping and software WebGL, so their displayed FPS is not a real-device benchmark. Software renderer warnings about readback and parallel shader compilation were observed. No universal FPS or load-time guarantee is claimed. Physical phone, Quest headset, actual Instagram posting, and shared/public note storage were not tested or implemented.

## Publishing

Implementation is retained on `upgrade/v3-visuals` and published to `main`. GitHub Actions deploys the static Pages site. Hosted verification checks model/art loading and physical scene captures; see the deployment run in the repository Actions tab.
