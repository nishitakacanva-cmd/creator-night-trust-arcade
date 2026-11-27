# Creator Night browser verification

Playwright exercised the festival in Chromium at 1440 × 900 and 390 × 844. The phone check uses touch and mobile viewport emulation.

- Captured 17 destinations, all seven Visual Labs, admission, the Story preview, pinned note, claw result, drink selection, photo print, Hindi Travel lab, map and passport at both sizes.
- Both browser runs loaded 12 curated models, 11 festival banners and 10 stall/menu graphics. The runs recorded zero uncaught page errors, console errors, failed requests or HTTP error responses. The document fit both viewport widths.
- Confirmed the Travel slider keeps focus through the full range, a Travel decision earns passport credit, Fitness claims load/unload/reset, removing Gifted disables sample collection, a note is stored in the current browser, the claw returns an item, a drink can be selected, and the photographer produces a 1080 × 1440 print.
- axe-core reported zero WCAG A/AA violations in the sampled Travel dialog on both layouts. Other views and assistive technologies need separate accessibility testing.
- Khronos glTF-Validator checked all 47 shipped binary GLBs. Corrected a WebP texture binding on the plant and an unavailable second UV channel on the chair. Final validation returned zero errors. The validator also emitted 128 warnings across the files.

## Repeat the browser check

Serve the repository over HTTP. Install Playwright and axe-core in the test environment and install Playwright Chromium. Run the following from the repository root, substituting the local or hosted site URL as needed.

```sh
node scripts/verify-festival.cjs desktop http://localhost:8080/
node scripts/verify-festival.cjs mobile http://localhost:8080/
```

The test writes screenshots and JSON under the ignored output/playwright/polish directory. QA_OUTPUT changes the destination, CHROME_PATH selects a system Chromium executable, and AXE_PATH selects a local axe-core script. Frame stepping makes interaction captures repeatable. The separately timed readback samples in the JSON do not measure steady-state real-device FPS.

## v3.3 ride pass

The ride checks capture all four attractions in world and interaction states, the Collab Claw decision, Claim Dunk response, moving tower/coaster camera and Escape return. They also capture all six pavilion sightlines, the Travel screen at close range, merchandise, third-person view and all four ride dialogs at phone width.

Additional checks cover a ₹30 demo chai order and resulting wallet balance, cup orientation, the heart portrait, opt-in captions and a panel answer, the fireworks viewing action, and the three maze choices with forward progression. See scripts/verify-rides.cjs for the repeatable checks. The screenshot captures use a headless Chromium browser. Physical phones and headsets remain unverified.


## v3.3.2 collection and supplied-art verification

The additional Chromium pass covers the six illustrated picker options, selected character state, third-person artwork and held bag, market collection, inventory image loading, equipping a sample, selfie capture, physical plate selection/lift/reset, Trust Wall submission, upright chai, stage Q&A, and mobile bag/fitness layouts at 390 x 844. The final local run reported no page errors, no HTTP failures and no failed engine assets. Desktop captures use 1440 x 900. These checks do not guarantee performance on every device.

Run `node scripts/verify-collection.cjs http://localhost:8130/` with Playwright available and CHROME_PATH set if needed. The same script accepts the hosted GitHub Pages URL.
