# Creator Night visual and interaction audit

| Area | What the visitor encountered | Change |
|---|---|---|
| Entry and atmosphere | The procedural horizon gave few cues about the time of day. The admission form was disconnected from the festival artwork. | Added a colour-graded photographic dusk sky, reflections from the same capture, a warmer directional key and a branded admission pass. |
| Six pavilions | Freestanding prints appeared suspended. Visitors could see the exhibit but needed a separate HUD control to inspect it. | Grounded the gallery prints on brass supports and weighted feet. The print and mentor both open the corresponding Visual Lab on desktop and mobile. Added lighting tracks, recessed edge lights and threshold details. |
| Travel | A cartoon covered the supplied resort photograph. Replacing the slider on every input interrupted drags and keyboard focus. | The entrance now crops the same photo used in the lab. The window has depth and the slider stays mounted from 45% through 100%. |
| Education | Solid bookcases concealed the spines. | Built open timber shelves, adjusted book spacing and used a warmer binding palette. |
| Trust Maze | Walking into the wrong lane repeatedly deducted trust. | Visitors choose by activating a sign. A different choice can be tried immediately. Correct choices earn credit once. |
| People and proximity | Mentors repeated their greetings on every return. Passing through another avatar could fill the camera with its head. | Mentors greet once per visit, then respond on demand. Nearby people ease aside and disappear at extremely close range. Off-screen distance tiers reduce animation work. |
| Creator market | Every category displayed the same four jars. The nearby market button always opened Kay Beauty. | Added category-specific merchandise, fluted timber fronts, striped awnings and counter-edge lighting. The nearest stall determines the action. Hiding the Gifted tag explains why collection is unavailable. |
| Map and controls | The market, wall and exit lounge were absent from the map list. Phone visitors saw duplicate controls. | All three appear as destinations. The jump bar highlights the current zone and switches language. On phones, the map and passport use the top controls, leaving space for the joystick and run button. |
| Photo studio | Balloons competed with the print station. The pose buttons supplied no camera preview. | Added a print drying rail, a still preview taken through the booth camera, a countdown driven by the shutter, and a square photograph in a downloadable 1080 × 1440 print. |
| Main stage | The DJ kept dancing during spoken segments. | The DJ responds to actual music playback and returns to idle on pause. The supplied Bollywood track remains the party track. |
| Learning and passport | Opening Fashion recorded a finding before the visitor had made a choice. Completing a visual activity gave no pavilion passport credit. | Visitor decisions record field notes and earn the corresponding stamp. Food choices are native keyboard-accessible buttons. Hindi lab titles, activity instructions and launch controls are available for all seven labs. Some evidence labels and research text are still English. |
| Delivery | The main festival decoded 35 base64 text files in the browser and depended on external servers for its engine and fonts. | Delivered the existing compressed geometry and animation as binary GLBs. Served Three.js r170 and the English/Hindi fonts from the site. Kept the 12 curated hero models and their source credits. |

## Measured rendering cost

At the same desktop entry viewpoint, the earlier build submitted 826 / 817 / 793 draw calls on High / Medium / Perf. The first v3.2 desktop pass submitted 698 / 677 / 653. Triangles changed from 571,967 / 548,555 / 523,564 to 539,953 / 430,765 / 405,774. Counts include extra render passes. The renderer reported 274 allocated textures before and 241 after. Texture counts are not GPU memory measurements in bytes.

A five-frame synchronized readback sample returned 7.7 / 14.0 / 24.5 FPS before and 10.4 / 10.2 / 17.5 FPS after. The two headless browser processes shared this computer. That overhead and the short sample make these timings unsuitable for predicting visitor FPS. The portrait browser sample returned 21.3 / 43.2 / 72.9 FPS. No sustained 60 FPS or physical-device result is claimed.

The older hosted entry reached readiness in 20.5 seconds and the local v3.2 entry in 15.7 seconds in these runs. Network origin and cache conditions differed. The binary conversion removes approximately 25% of the uncompressed model payload and avoids base64 decoding at startup.

## Exit and Trust Wall corrections

Moved the prize counter and exit-survey kiosk from the arrival forecourt to a dedicated deck beside the Creator Lounge, past the market. The site map, walking path, quick travel, interaction radius and colliders use the new position. The Capsule Club cabinet has enamel housing, a brass three-jaw claw, joystick, delivery chute and two-piece capsules. Its game lifts the selected capsule and records the prize in the session bag.

Rebuilt the Trust Wall lettering. Each sheet resets its canvas alignment, measures and wraps the handwriting within its margins, reserves a separate footer, and fits long messages and single unbroken words. The grid responds to the number of posted notes. The editable note list preserves the full text.

## v3.3 creator rides and interaction fixes

Added Collab Claw, Trust Fall, Claim Dunk and a rideable Hype Coaster using the supplied render/poster pack. The Collab Claw grabs and delivers a capsule, reveals a collaboration dilemma and records the visitor's decision in Field Notes. Claim Dunk classifies four evidence statements with a visible ball flight. Trust Fall contrasts evidence-supported and unsupported claims over a cushioned pad. The coaster offers one 20-second camera loop, an immediate exit and a still alternative.

The ride locations follow the existing world geometry. The tower is at (-17, -28.6), the ball arena occupies the audience lawn at (0, -16), and the coaster's front span rises above the stage roof. The entry claw stays at (10.5, 29). The supplied master-map image remains a concept illustration. Actual navigation pins and quick travel use the implemented positions. The show schedule, sound desk and stage arrival were moved to keep access clear.

Moved pavilion artwork to side walls, moved the Travel postcard to the rear, and brought the operating screens forward. Desktop and phone visitors can open the illustrated lab by clicking its physical screen. Headset canvas button handling is retained. Mentors greet once and stand beside the activity sightlines.

Added first/third-person switching with a camera boom that shortens near fixtures, upright held cups, physical player avoidance around people, ring-light phone rigs and six creators filming/dancing. The heart and all six pavilions have portrait spots and a framed downloadable photo. Completing the supported evidence activity unlocks the corresponding virtual pavilion sample.

Caffeine Corner now has matcha, coffee and chai ordering, sweetness selection, a finite demo wallet and a held drink in both views. Payments and merchandise are simulated. Timber slat benches replace the old bench model, with an additional sofa at the cafe.

Panel captions require Listen to panel near the stage. Visitors can stop listening and select a prepared question for a scripted answer. The panelists use the existing talking and seated speaking animations. Fireworks now burst on visible stage flanks and have a dedicated viewing action.

Six reference-led illustrated creator cutouts now appear in the picker, visitor avatar, reel crew and photo captures. These are camera-facing 2D artworks in the 3D scene. Other visitors, mentors and panelists retain their licensed rigged Rocketbox characters.

Repeated balls and capsules use InstancedMesh. Static ride parts are merged by material. Animated ride cameras render continuously, while ordinary modal backgrounds keep the lower redraw cadence. A real-device sustained FPS measurement remains outstanding.


## v3.3.2 artwork, collection and physical activities

Installed all eight user-supplied artworks as optimized WebP files. The partner wall, photo backdrop, passport, sample bag, maze arch, exit header, Trust Wall and activity header use this pack. The partner image preserves its aspect ratio. Lab content keeps its light paper surface for legibility.

Added a visual bag with session sample rewards, equippable products, a held shopping bag and a selfie action. Portrait capture temporarily removes bystanders and restores them immediately afterward. Fitness has visible load, unload, lift and reset controls attached to the physical activity. Market fronts and attendants face the stage. Panel prompts are restricted to the stage audience strip.

The first-person shopping bag now hides in the same frame as a view change. Mobile controls wrap into a fixed grid and the fitness panel uses an opaque surface. Distant buildings receive atmospheric haze instead of appearing as noisy black silhouettes. Main artwork and curated models finish loading before entry is offered. Character atlases were reduced from 2,450,407 bytes of PNG to 370,584 bytes of WebP while preserving alpha transparency.
