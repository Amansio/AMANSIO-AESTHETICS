# Hoodie Cinema

CPU-first, deterministic 2D animation for vertical Shorts/Reels. This workspace was
added without changing the repository's existing README or files.

## Quick start

Node.js 22 LTS recommended (tested with 22.22.3), npm, and a Chromium-capable OS.

```sh
cd animation
npm ci
npm run typecheck
npm test
npx remotion browser ensure
npm run studio
npm run render
```

Open the Studio URL printed by Remotion. `Kitchen` is the finished seven-second
proof of concept; `Story20` is a **20-slot editable storyboard**, NOT twenty unique
finished scenes. `npm run render:full` exports its 140-second timeline.
Remotion supplies its platform FFmpeg encoder via npm; no diffusion model, Python,
CUDA, ElevenLabs API key, or local GPU inference is required.

Normal output: `out/kitchen.mp4`, H.264, 1080×1920, 30fps, 210 frames.
Outputs and private voice-over files are Git-ignored. Regenerate backgrounds with
`npm run background`; the original illustration generator and PNG are both included.

### Linux with restricted downloads (this sandbox)

The standard browser download host was blocked here. The npm-packaged Chromium
fallback includes the browser, SwiftShader and NSS libraries:

```sh
npm run render:sandbox
# Fast low-resolution draft:
npm run render:sandbox -- --scale=0.5
```

This fallback is Linux x64 only, uses temporary runtime extraction, and requires
`tar` on PATH. On Windows/macOS use the normal Remotion browser installation.
If using an existing Chrome installation instead, append
`--browser-executable="/path/to/chrome"` to `npm run render --`.
Linux systems may require Chrome's system dependencies. Do not enable NVENC or
rely on the GTX 750's codec support; single-browser software rendering is the default.

## Editing scenes and rigs

- `src/scenes.ts`: positions, beat times, poses, expressions, camera paths,
  countdown, narration text, audio configuration, and storyboard slots.
- `src/rig.ts`: reusable Hoodie / mother / guest skins, custom shirt colors,
  articulated sleeves, hoodie pocket/drawstrings, perfectly circular dark heads.
- `src/types.ts`: reusable scene/actor contract.
- `src/Film.tsx`: local-time scene composition, separate raster backgrounds,
  lighting/vignette, fade-through-black transitions, captions and sound.
- `vendor/figures`: pinned MIT engine, joint-state/face API extension documented
  in PROVENANCE.md. The installed skill includes the pose/expression reference.

Coordinates are in 1080×1920 world space; actor x/y is the hip, s is rig scale.
Feet are approximately y + 53*s in standing pose. Keys carry previous values.
Start with t=0 and initial x/y. Put `move:'walk'` on the **destination** key.
Use Figures poses such as standing, pointing, waving, holding, think, shrug,
facepalm, arms_raised; expressions include neutral, happy, worried and surprised.
Keep key times strictly increasing. Each frame is sampled at frame/30 seconds.
Figures owns IK walking, spring anticipation, idle breathing/sway, blinking and
facial blending; our skin follows its joints. Skin changes do not replace the rig.
Head turns shift/rotate facial features without squashing the round skull. Mother's
turn also uses Figures' smooth facing transition. This is stylized 2D, not a 3D head.

Hoodie's palette is fixed at ink `#0e0b12`, cream `#f4efe6`, hoodie `#1e56a0`.
The lighting layer intentionally changes perceived screen colors; source fills
remain exact. Adjust `light` and the vignette in Film.tsx for a flat-color export.
Expressions may enlarge eyes/mouth for shock; the normal face has small dot eyes.

The proof-of-concept beats:

| Time | Action |
|---|---|
| 0–2.3s | Hoodie enters with joint-driven walk and arm swing |
| 2.3–3.7s | Stop, turn/gaze toward mother, worried thinking gesture |
| 2.8s onward | Mother turns and puts her hands on hips |
| 4.55–7s | Shock recoil, raised arms, then held reaction with idle motion |

Countdown is an independent Remotion text layer, not baked into the PNG. Change
`countdown.enabled`, `start`, `end`, `value`, `label` in scenes.ts. Camera x/y/zoom
are independent start/end values. Replace any background with a 1080×1920 PNG in
`public/backgrounds`, setting `scene.background` to its relative path. A shared
world transform keeps characters and background aligned; overlays remain screen-fixed.

### ElevenLabs voice-over import

Export your narration from ElevenLabs as MP3/WAV, then copy it to
`public/audio/kitchen.mp3`. Add this to the scene:

```ts
voice: {src:'audio/kitchen.mp3', start:0, volume:0.9, trimBefore:0},
narration: 'You walk into the kitchen. Then you see it. You freeze.',
```

Audio placement and trim are in seconds, quantized to frame boundaries. Each scene
has its own local audio timeline and clips at the scene end. Edit pose keys to align
beats with your spoken delivery in Studio. Audio is not automatically transcribed
or lip-synced. `narration` is a script/validation field, not speech synthesis.
The proof of concept is intentionally **silent** because no voice-over was supplied.
Always address the viewer as **you**, never as Hoodie. Validation rejects scripted
narration containing Hoodie or lacking “you”; review imported speech manually since
this text guard cannot verify the contents of an audio file.

### Future 20-scene production

Replace each generated storyboard slot with unique scene data, actors, background,
voice file, camera and overlay. Seven seconds × twenty scenes = 140 seconds / 4200
frames. Change durations freely; composition metadata recalculates at 30fps.
You can pass complete `{"scenes":[...]}` JSON using Remotion's `--props=story.json`.
Transitions are short fade-through-black (no duration overlap). This supports
predictable timing and low memory use. More complex transitions would need an
explicit overlapping timeline. The current title in Film.tsx is kitchen-specific;
change it when authoring other scenes.

## Compatibility and licenses inspected

- **Figures:** dependency-free CommonJS/browser SVG engine, deterministic time
  sampling. Compatible with React/Remotion through SVG markup. The default
  parchment/plain-head renderer is unsuitable for the character design, so our
  renderer consumes exposed skeletal state and facial primitives instead.
- **Remotion:** inspected upstream README/license and repo metadata (main commit
  3580812a7db3c7e68257130b142938c14626d258); npm packages pinned to 4.0.539.
  Supplies React composition, frame clock, audio, sequences, browser capture,
  CPU H.264 encoding. Remotion is **not MIT**: its inspected license allows free
  use by individuals, nonprofits, evaluation users, and for-profit companies with
  up to three employees. Larger commercial organizations need a company license.
  Read the installed package LICENSE.md and current upstream terms before use.
- **ToonCrafter:** inspected README and license metadata only. It is a diffusion
  interpolation model, not an articulated stickman engine; upstream reports
  approximately 24–27GB VRAM, community reductions around 10GB. Not compatible
  with the requested 2GB VRAM budget. Not installed; no weights downloaded.

## Validation and observed limitations

- TypeScript: passes.
- Six tests: pass. All 210 frames checked for deterministic finite SVG/palette;
  walking joint changes, reaction, mother's turn, idle motion/blink, narration and
  key ordering checked. No claim of photorealistic motion or exact foot-contact
  fidelity; Figures includes subtle deliberate hand-drawn joint jitter.
- Render: completed with one software browser, about 105 seconds including setup
  in this sandbox. This is **not** a benchmark for your machine.
- ffprobe verified H.264, 1080×1920, 30/1 fps, 210 frames, 7.000 seconds,
  4:2:0 output, approximately 2.2MB. Shock key frame visually inspected.
- No physical GTX 750 / 12GB machine was available. Defaults minimize memory,
  but actual RAM, render speed and Chrome compatibility need local verification.
- `npm audit`: zero vulnerabilities after pinning transitive Zod to 4.6.6.
  Remotion expects Zod 4.5.4 and prints a version warning. This override avoids
  the reported high-severity constrained-collection memory-exhaustion advisory;
  the project uses no Zod schemas. Typecheck, tests and actual render pass with
  the override. Re-evaluate it when upgrading Remotion, especially if adding
  schema-driven Studio controls. Do not blindly run audit fix --force (it proposed
  downgrading Remotion).
- Full 140-second storyboard and real imported voice audio were not rendered/tested.
  Keep Studio private; it is an authoring server, not a hardened production service.

### Premium deliverable

The directed seven-second episode (`hoodie_7_days_premium.mp4`) is rendered from the same deterministic pipeline:

```sh
cd animation
npm run render:sandbox -- --output out/hoodie_7_days_premium.mp4
# Re-encode for broad H.264 / yuv420p compatibility (requires the pinned Remotion ffmpeg):
./node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg -hide_banner -y -i out/hoodie_7_days_premium.mp4 -c:v libx264 -preset medium -crf 17 -color_range tv -pix_fmt yuv420p -movflags +faststart hoodie_7_days_premium.mp4
```

It produces 210 frames at 30 FPS (exactly 7.000 s), 1080×1920, H.264, yuv420p. Verified with ffprobe: `codec_name=h264`, `pix_fmt=yuv420p`, `width=1080`, `height=1920`, `nb_frames=210`, `duration=7.000000`.
