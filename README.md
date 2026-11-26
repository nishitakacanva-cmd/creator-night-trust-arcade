# Creator Night · Trust Arcade v3.1

[Open the experience](https://nishitakacanva-cmd.github.io/creator-night-trust-arcade/)

An unofficial Instagram-inspired student experience about credibility, sponsorship transparency, selective attention, evidence and trust repair. Brand stalls are educational concepts, not commercial partnerships. Samples are virtual; no Instagram login or real posting is involved.

## Explore

Drag to look, release and click people or objects. WASD/arrows move; Shift runs. Use the map or bottom navigation to jump between zones. Pointer lock is optional with `?pointerlock`; ordinary visitors never need Esc to switch between looking and clicking.

The seven supplied Visual Labs and Field Notes remain. Additions include twelve optimised CC0 models, PBR surfaces, supplied banner and stall artwork, a nine-brand market with attendants and gifted-story previews, a photographer and downloadable instant print, Caffeine Corner, a private Post-it wall, reel dancers and a phone-holding filmer, a DJ, and an exit lounge with capsule/claw interactions.

Market: Kay Beauty, Plum, Swiss Beauty, SNITCH, Mokobara, Paper Boat, Blue Tokai, Boldfit and upGrad. Story previews keep gift disclosures visible. A sample never requires a positive review or an actual post. Trust notes save in the current browser; example notes are labelled.

## Run and performance

Serve this directory with a static HTTP server, for example `python -m http.server 8080`. Pages deploys through `.github/workflows/deploy-pages.yml`. WebXR requires HTTPS and a supported headset.

Balanced graphics is the default; HIGH / MED / PERF remains available. Real-time lights are bounded and distant avatar/shadow updates are throttled. Compressed WebP copies deliver supplied art while original PNG/JPG files remain. Added GLBs use Meshopt compression and WebP textures of at most 1024px.

## Assets and verification

- [Model licences, triangle counts, sizes](assets/curated/MODEL_ATTRIBUTION.md)
- [Model validation](assets/curated/MODEL_PROVENANCE.json)
- [Installed models](assets/curated/MODEL_SLOTS.json)
- [Supplied brand manifest](assets/brands/BRAND_STALLS_MANIFEST.json)
- [Verification notes](QA.md)

Existing avatar, audio and prop licences remain with their asset directories. Three.js r170 loads from jsDelivr; Google Fonts have system fallbacks. Automated browser checks do not establish physical phone or headset performance.
