# 3D Scene Guide (three.js engine)

Reference for the cinematic engine. Files under `src/cinema/`.

## Rendering pipeline (`engine.ts`)

- `startEngine(canvas, projects, tl, onFrame)`:
  - Creates `THREE.WebGLRenderer` (`antialias:false`, `powerPreference:"high-performance"`),
    pixel ratio `min(dpr, mobile?1.5:1.75)`.
  - Builds one `Chapter` per `ORDER` key via the `make` map. `Chapter = { scene, camera, update(lp,time,dt,mouse), dispose }`.
  - Two `WebGLRenderTarget`s (`HalfFloatType`, `samples: mobile?0:4`) with a full-screen
    post quad (`post.ts`).
  - Each frame: read `p = scrollY/innerHeight`, smooth `p += (target-p)*(1-exp(-7·dt))`,
    velocity smoothing, `loc = tl.locate(p)`.
  - Render current chapter to `rtA`; if `t>0` render next to `rtB`; `setPortal(t, PORTALS[i])`.
  - `post` shader composites scene B inside a moving "portal" rounded box (scale/rot/offset ease
    from `PORTALS`), plus sRGB conversion, scanlines, rolling noise band, jitter, tear, drop,
    vignette, barrel (from `uBarrel` = `mobile?0.1:0.18`).
  - `onFrame` returns `{i, lp, t, p, velocity}`; host panel updates consume it.
  - Handles `resize`, `pointermove` (mouse NDC), `deviceorientation` tilt, `visibilitychange`
    pause, full `dispose`.

## Scroll timeline (`timeline.ts`)

- `ORDER = [hero, work, about, commits, journey, signal, contact]`.
- Chapter lengths: hero 1.4, work `1.3·projects`, about 3, commits 3.2, journey 3.4, signal 3.6,
  contact 1.8. Total = sum → spacer height `(total+1)*100vh`.
- `locate(p)` → `i` (current), `lp = (p-start_i)/len_i` clamped 0..1, and
  `t` transition 0..1 over the last `TRANSITION=0.75` units of each chapter.
- `smooth(a,b,x)` = smoothstep. `scrollTargetFor(key, local=0.12)` used by the menu.

## The CRT screen shader (`crt.ts`)

- `crtGeometry()` → curved plane (z displaced `0.09*(1-x²·0.8)(1-y²·0.8)`, 48×30 segs).
- `crtMaterial(map, aspect)` → shader: rounded-box mask, 90-row scanline glitch rows,
  luminance desat until `uFocus`=1, brightness scan `0.97+0.03·sin(y·900)`, edge darkening,
  top-left bloom. Used for every project screen and signal card.

## Scenes (each `createX` returns a Chapter)

| Scene | bg | Camera | What you see |
|---|---|---|---|
| hero | `#000` | 32° fov, z=7 | InstancedMesh voxel avatar sampled from `profile.svg` (112×112 desktop / 72 mobile), 3D "grid" cylinder shader behind, key/rim/ambient lights, slow head sway, mouse parallax, camera pulls in with `lp`. |
| work | `#f4f4f2` + fog 4→13 | 38° | A rail of floating monitor screens (CRT texture), bezels, terminal-print floor plane (procedural canvas), camera slides between screens by `workFocus(lp)`; focus/glitch per screen; light theme `is-light` toggled from host. |
| about | `#030406` fog 3→24 | 58° | Server racks (instanced boxes + units + glowing LEDs), floor shader with moving chip train, hanging colored cables, ceiling strip, two point lights; camera drives down the aisle. |
| commits | `#000301` | 50° | 53×7 instanced contribution bars, local `uGrow` growth, level colors (0→4), grid ground; camera sweeps along weeks; host overlays week label/stats. |
| journey | `#0b1d33` fog, sky `#b9dcf2` | 62° | Instanced city corridor (blocks on both sides + walls + sky plane), camera flies up/forward, `camera.up` rotation. |
| signal | `#030303` | 42° | 4 painted 768×1024 cards floating (portrait grid or wide arc), additive glow planes per card, camera zoom overview→card tour by `signalFocus(lp)`. |
| contact | (no clear color) | 50° | Shader-only neon alley: brick wall + glyph panels + glow core + floating particles + 6 "lights"; subtle zoom with `lp`. |

Mobile heuristics: `ctx.mobile = matchMedia("(max-width:760px), (pointer:coarse)")`. Drives counts
(hé voxels, fewer journey blocks, 6 cards), MSAA, barrel.

`dispose()` always walks the scene and disposes geometries/materials/textures (see `scenes/types.ts`).

## Painted 2D screens (`screens.ts`)

- Canvas 1024×640; `screenPainter(p)` returns `{paint, custom}`.
- Custom painters by repo id: layla, syella, makimakey, deltasys, commitify.
- `generic(p)`: picks a scheme from a 5-entry palette (hashed by id); draws name (auto-shrink Doto
  weight 900), description wrap, topic chips, and a scrolling hex/level column. Wrapped in round
  corner "window" chrome in `work.ts` floor/`projects.css` frame.
