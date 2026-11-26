# Creator Night · Trust Arcade v2

An open-ground, night-time festival you can walk through in a browser, on a phone or in a WebXR headset. Creators learn what builds and what loses audience trust: a central Trust Maze, six niche pavilions with games, a main stage with a repeating show, a photobooth, a chai corner and a lounge.

This is an **unofficial, Instagram-inspired student concept**. It is not affiliated with, endorsed by or connected to Instagram or Meta, and it uses no Instagram logo or Instagram typeface. There is no account connection, no OAuth, no follower data and no real reward. The exhibit never asks for a password, never asks anyone to follow an account, and never gives the visitor a personal trust score.

---

## 1. Files

| Path | What it is |
|---|---|
| `index.html` | The whole app (HTML, CSS and one ES module, ~370 KB). three.js r170 loads from jsDelivr; Poppins and Mukta load from Google Fonts and fall back to system fonts. |
| `assets/avatars/` | 19 Rocketbox people and the Rocketbox MIT licence. |
| `assets/anims/` | Two shared animation sets (female and male rigs). |
| `assets/props/` | 16 furniture and set-dressing models from the Khronos glTF Sample Assets plus one bench (see credits). |
| `assets/env/`, `assets/tex/` | Night-sky HDRI, grass and the surface textures. |
| `assets/ui/` | Avatar portraits for the start card. |
| `assets/audio/` | Music, ambience and sound effects as MP3 (about 3.5 MB; see credits). |
| `arcade/index.html` | The v1 Trust Arcade, opened from the arcade tent on the ground. It has a button back to Creator Night. |

Models and the HDRI are stored as base64 text (`*.glb.txt`, `*.hdr.txt`) because the artifact host serves only web text and image types. They are ordinary GLB (meshopt-compressed, WebP textures) and Radiance HDR files once decoded: `base64 -d Avocado.glb.txt > Avocado.glb`. About 28 MB in total. Keep the folder structure as it is.

## 2. Run or deploy

Any static web host works. WebXR needs `https://` (or `http://localhost`); opening `index.html` as a `file://` will not work.

```bash
# from the folder that holds index.html
python3 -m http.server 8000
# open http://localhost:8000
```

For a headset, host the folder over https, open the link in the Meta Quest Browser and press **Enter VR**.

The published claude.ai page runs inside a sandboxed frame. Walking, games, the show and the photobooth work there, and saving a photo or a data export asks you to confirm the download. VR and the URL options below need a copy you host yourself.

## 3. What is on the ground

- **Arrival.** You start in the forecourt outside the entry arch and walk up the roped lane. Map and schedule totems stand inside the arch.
- **Trust Maze (centre).** Three choice gates on the main path, the Trust Plaza hub with its fountain, and one gate on each niche arm. A wrong lane ends at a dead-end board that explains why that choice loses trust.
- **Six niche pavilions**, each with its own game and mentor:
  - Fashion: *Runway Reality*, a gifted jacket, a runway walk and follower questions about disclosure.
  - Food: *Blind Taste Test*, where one of three dishes was sent by a paid sponsor.
  - Beauty: *Filter Mirror*, choosing the camera setting for a serum promo on a live filtered monitor.
  - Fitness: *Claim Lifting*, where you load only the claims you can back up before lifting the bar.
  - Travel: *Postcard vs Reality*, stepping through the resort's own photo into the rainy, under-renovation reality.
  - Education: *Source Detective*, marking four reels as trustworthy or a red flag.
- **Main stage.** The show repeats every 8 minutes like a real event, with a clock in the scene that starts at 8:30 pm:

  | Time in loop | Segment |
  |---|---|
  | 0:00–0:40 | DJ set |
  | 0:40–3:35 | Panel: *Trust in my niche* (host, four panelists, one audience question) |
  | 3:35–4:00 | Changeover |
  | 4:00–6:32 | Trust Awards (four fictional creators, trophies, confetti) |
  | 6:32–7:05 | Fireworks and drone show |
  | 7:05–8:00 | Interval |

  If the visitor has the maze stamp and at least three niche stamps, the host calls them up as *Rising Trust Creator*. This is a demo moment, not a real award. The HUD offers a "Take me up" button during the call.
- **Photobooth.** A 3-2-1 countdown takes a photo of your avatar with two friends and composes a 1080 × 1440 post card with the exhibit's own heart-tick mark and an "unofficial" footer. You can save it as a JPG and, where the browser supports it, record a 3-second loop.
- **Chai corner, creator lounge and arcade tent.** Places to meet people. The arcade tent opens the v1 experience.
- **Map and quick travel.** A live map sits in the top-left corner. Tap it (or press M) for the full map, tap any place or open spot, and press **Go here** to jump there. The buttons beside the map jump straight to each zone.
- **Sound.** Real recordings, placed in 3D: the stage PA plays the show's music (Bollywood-style DJ set, an awards bed, a fireworks track) and fades with distance, the lounge has its own jazz speaker, crowd murmur gathers around the lawn, chai stall and lounge, the plaza fountain trickles, fireworks boom a moment after the flash, and footsteps change between grass, paths and wooden decks. Sound starts from the start card or the speaker button (N).
- **About 30 computer-controlled people.** Six mentors, the host and co-host, four panelists, seven creators with trust dilemmas you can help with, extras who chat, drink chai or sit in the lounge, and two who wander the paths. They work offline and need no server.

## 4. Controls

| | Desktop | Touch | VR |
|---|---|---|---|
| Move | WASD or arrows (5 m/s), Shift to run (9 m/s), with eased starts and stops; the scroll wheel glides forward or back | Left joystick, Run button | Left stick; right grip to teleport |
| Look and turn | Click once, then move the mouse | Drag | Your head; right stick snap-turns |
| Use | Click, E or Enter | Tap | Trigger |
| Guided tour | T starts it; it moves by itself, scroll to go faster or back, Space pauses | Tour button; swipe up or down to move along it | Not available |
| Map and travel | Click the top-left map or press M, pick a spot, press Go | Tap the top-left map, pick a spot, tap Go | Fast travel from the VR panel |
| Menus | M map, P passport, G language, N sound, H help, L researcher overlay, Esc releases the pointer | Buttons in the HUD | B or Y opens the panel |

The **guided tour** glides along one path through every zone and turns to face each pavilion and the stage as it passes.

Language: English and Hindi, switchable at any time from the start card, the HUD (हि / EN) or G.

## 5. URL options (self-hosted copies)

| Option | Effect |
|---|---|
| `?q=high`, `?q=medium`, `?q=low` | Graphics quality. Default is high on desktop and medium on touch devices. VR always runs the low tier without post-processing. |
| `?lang=en`, `?lang=hi` | Start language. |
| `?fresh` | Ignore progress saved in this tab. |
| `?v=A`, `?v=B` | Variant label written into exported data. Both labels show the same experience in this build. |
| `?nolock` | Drag to look instead of pointer lock. |
| `?test` | Developer mode for automated tests (manual frame stepping). Not for visitors. |

## 6. Data and privacy

- Progress (stamps, choices, photo flag, survey) is kept in `sessionStorage` under `trustArcade.creatorNight.v2` and disappears when the tab closes. Nothing is sent to any server; there are no cookies or analytics services.
- Event logging is off unless the visitor switches on the consent toggle on the start card. Events record zone, time and choices only; any field that looks like a name, alias, handle, email, phone or pass ID is dropped before it is stored.
- The researcher overlay (L) shows live counts and exports JSON or CSV to the device.
- Photobooth images are made in the browser and leave the device only if the visitor saves them.

## 7. Content notes

- All creators, posts, brands, handles and awards are fictional. The trust meter rates fictional posts, never the visitor.
- Regulatory references are limited to the ASCI influencer-advertising guidelines, the Department of Consumer Affairs endorsement guidelines (2023), CCPA's 2024 guidance on coaching-sector advertising and SEBI's 2024 rules on unregistered finfluencers. Check them against the current versions before a public run.
- Survey figures come only from the project's own sample (172 responses, 6 interviews; 71.6% value actual product use) and are presented as "our sample", not as a population figure.

## 8. Performance and limitations

- This is real-time, game-quality 3D with physically based materials, night lighting, moving heads with volumetric beams, bloom and shadows. It is not photorealistic.
- In headless software-rendering tests, a frame at high quality uses about 600–1,150 draw calls and 1.0–1.5 million triangles. If the frame rate stays below about 43 fps for a few seconds, the page lowers its resolution and then its lighting tier on its own, and climbs back when there is headroom (turned off when `?q=` is set).
- Not yet tested on a real Meta Quest headset or on iOS Safari.
- The images in the handoff PDF cannot be turned into walkable 3D directly; the ground was rebuilt from their layout.
- All music is public-domain library music; there are no social-media clips or copyrighted songs.

## 9. Tested

Automated browser run (25 checks, all passing): maze stamp and dead-end board, all six niche games and stamps, award eligibility, the visitor called up and awarded on stage, panel subtitles, switch to Hindi, photobooth photo and dialog, guided tour, event log, no console errors. Every zone was also checked visually.

Sound and map checks: all 13 audio files load and decode, the stage music follows the show segments, footsteps fire on grass, paths and decks, and a full awards-and-fireworks run with sound on raised no errors. On desktop and phone layouts, tapping a place or an open spot on the map and pressing Go moves you there.

## 10. Credits and licences

- **People and animations:** Microsoft Rocketbox Avatar Library, © 2020 Microsoft, MIT licence (full text in `assets/avatars/LICENSE-Rocketbox.md`). Converted to glTF, retextured as WebP and compressed.
- **Props from the Khronos glTF Sample Assets:**
  - CC0: Lantern, Corset, Water Bottle, Boom Box, Avocado (Microsoft and UX3D); Antique Camera (UX3D); Glass Vase Flowers; Sheen Chair (Wayfair).
  - CC BY 4.0: Glam Velvet Sofa, Specular Silk Pouf, Iridescent Dish with Olives, Anisotropy Barn Lamp (© Wayfair LLC, modelled by Eric Chadwick); Materials Variants Shoe (© Shopify); Diffuse Transmission Plant (© 2024 Darmstadt Graphics Group GmbH); Pot of Coals (© 2023 Darmstadt Graphics Group GmbH; its logo textures were removed); Traffic Cone (© 2024 hinndia).
  - Models were optimised (compressed, simplified, textures converted to WebP) and some materials were changed. Licence texts: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).
- **Bench:** "Bench wooden 01" by randombug on Sketchfab, CC BY 4.0.
- **Grass texture and night-sky HDRI:** Poly Haven, CC0.
- **Music** (public domain, from FreePD.com): "Bollywood Groove" and "Energizing" by Kevin MacLeod; "Celebration" and "Fanfare X" by Alexander Nakarada; "Martini Sunset". Shortened, made mono and loudness-matched.
- **Sound effects** (CC0): Kenney's Interface Sounds, Impact Sounds (footsteps), Music Jingles and Voiceover Pack (voices by Jeffrey M. Smith and Giselle); rubberduck's firework and water-loop recordings (OpenGameArt); Ben Burnes's Organic Wooshes and MadameBerry micro packs; camera shutter by uEffects (Freesound), taken from Nicky Case's CC0 game *We Become What We Behold*. Collected from the CC0-Public-Domain-Sounds repository by lavenderdotpet.
- **Crowd murmur:** mixed for this exhibit from the voice lines above and three LibriSpeech readings (Heather Barnett, Anders Lankford, Garth Comira; LibriSpeech SLR12, CC BY 4.0). **Applause:** synthesised for this exhibit from modelled hand claps.
- **Engine and fonts:** three.js (MIT); Poppins and Mukta (SIL Open Font Licence).
- **Everything else** (code, signs, screens and the other textures) was made for this exhibit.
