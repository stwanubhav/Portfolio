# GSAP Scroll & 3D Character Guide

Deep reference for the animation engine and 3D character. Files: `src/components/utils/*`,
`src/components/Character/**`, `src/data/boneData.ts`.

## ScrollSmoother (created in `Navbar.tsx`)

```ts
gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1.7, speed: 1.7, effects: true,
  autoResize: true, ignoreMobileResize: true,
});
smoother.scrollTop(0);
smoother.paused(true); // unpaused by initialFX()
```

- Header links: on click (desktop) `e.preventDefault(); smoother.scrollTo(data-href, true, "top top")`.
- `window` resize → `ScrollSmoother.refresh(true)`.
- The `smoother` object is exported for `initialFX`.

## SplitText reveals (`utils/splitText.ts`)

- Register `ScrollTrigger, ScrollSmoother, SplitText`; `ScrollTrigger.config({ ignoreMobileResize: true })`.
- Returns early `window.innerWidth < 900`.
- `.para` paragraphs → `SplitText{ type:"lines,words", linesClass:"split-line" }`;
  `fromTo(words, {autoAlpha:0, y:80}, {autoAlpha:1, y:0, duration:1, ease:"power3.out", stagger:.02, scrollTrigger})`.
- `.title` headings → `SplitText{ type:"chars,lines", linesClass:"split-line" }`;
  from `{autoAlpha:0, y:80, rotate:10}` → `{duration:.8, ease:"power2.inOut", stagger:.03}`.
- Toggle actions `"play pause resume reverse"`, start `"20% 60%"` (≤1024: `"top 60%"`).
- Re-runs on every ScrollTrigger refresh.

## Loading sequence (`Loading.tsx`, `utils/initialFX.ts`)

- `setProgress(setLoading)` ticks random increments (fast to 50, slower to 91, then `loaded()` to 100).
- At 100: `loaded` (600ms) → `isLoaded` (1000ms) → button clickable → `.loader-out` + `.loading-clicked`
  (pill expands to a 5000px-radius tile over the screen) → 900ms → `initialFX()` → `setIsLoading(false)`.
- `initialFX`: body `overflowY:auto`; `smoother.paused(false)`; `main` gets `.main-active`
  (fadeIn 1s); `gsap.to("body",{backgroundColor:"#0b080c", duration:.5, delay:1})`; landing intro
  split-text reveal (blur 5px → 0, power3.inOut, stagger .025); `.header/.icons-section/.nav-fade`
  fade in; `LoopText` swaps `.landing-h2-info`/`.landing-h2-1/-2` (Designer ↔ Developer) every ~4s.

## Scroll choreography (`utils/GsapScroll.ts`)

- `setCharTimeline(character, camera)` builds 3 scrubbed `gsap.timeline`s:
  - tl1 (`.landing-section`): character `rotation.y 0→0.7`, camera z→22, `.character-model x 0→-25%`,
    `.landing-container` fades + y 40%, `.about-me y -50%→0`.
  - tl2 (`.about-section`): camera z→75/y→8.4 (6s), about y 30% then opacity fade; character
    rotation y .92/x .12; neck bone `spine005` rotates; monitor material opacity→1 (`Plane004`
    child `Material.027` set white); screen light emissive→1; `.what-box-in display flex`;
    monitor lifts; `.character-rim` scales away.
  - tl3 (`.whatIDO`): `.character-model y 0→-100%`; `.whatIDO y→15%`.
  - Mobile path: only shows `.what-box-in` on scroll (no camera/character choreography).
- `setAllTimeline()` (`career-section`): grows `.career-timeline` (`maxHeight 10%→100%`), fades
  `.career-info-box` (stagger .1), stops `.career-dot` breathing, shifts `.career-section y 20%` desktop.
- `handleResize`: resizes renderer/camera, kills all ScrollTriggers except `work`, rebuilds timelines.

## 3D character (`components/Character/`)

- `Scene.tsx`: raw `WebGLRenderer({alpha:true, antialias:true})`, `ACESFilmicToneMapping`, exposure 1,
  `PerspectiveCamera(14.5, aspect, 0.1, 1000)` at `(0, 13.1, 24.7)`, `zoom 1.1`.
- Load: `decryptFile("/models/character.enc", "Character3D#@")` → blob URL → `GLTFLoader` +
  `DRACOLoader("/draco/")`. Encrypted with AES-256-CBC (iv = first 16 bytes; key = SHA-256 password;
  `public/models/encrypt.cjs` encrypts `character.glb` → `character.enc`).
- Post-load: `renderer.compileAsync`, cast/receive shadow on meshes, fix feet y 3.36, start timelines.
- Animations (`animationUtils.ts`): `AnimationMixer`; `introAnimation` (LoopOnce), `key1/key2/key5/key6`
  (timeScale 1.2), `typing` applied only to the 54 bones in `boneData.typingBoneNames`, `Blink`
  after intro, `browup` on hover over `.character-hover` (fadeIn .5 / fadeOut .6, weight 4).
- Head follows mouse/touch (`mouseUtils.ts`): NDC from clientX/Y; lerp; max rotation π/6; only when
  `scrollY < 200`; on scroll>200 desktop head eases to `(-0.4, -0.3)`.
- Lighting (`lighting.ts`): `DirectionalLight 0xc7a9ff` + `PointLight 0xc2a4ff`; HDR environment
  `char_enviorment.hdr` (`RGBELoader`, equirectangular); `turnOnLights()` GSAP-fades environment
  intensity → 0.64 and light → 1; `setPointLight` ties point light to the screen emissive.

## TechStack physics (`components/TechStack.tsx`)

- 30 spheres, random scale from `[0.7,1,0.8,1,1]`, textures from `/images/*.webp`, `MeshPhysicalMaterial`
  (emissive map, metalness .5, roughness 1, clearcoat .1).
- `@react-three/rapier`: gravity zero; each sphere `RigidBody` applies an inward impulse each frame;
  a kinematic `Pointer` (BallCollider 2) follows pointer lerp; spheres repel.
- `Canvas` (shadows, alpha, `fov 32.5`, camera z 20), `Environment` HDR, `EffectComposer` +
  `N8AO color #0f002c aoRadius 2 intensity 1.15`. `isActive` toggles by scroll position vs `#work`.
