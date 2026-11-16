---
name: portfolio-gsap-3d-character
description: Recreate Moncy's single-page GSAP + React Three Fiber portfolio — a dark purple-accented, smooth-scrolling site with a 3D character, a game-like loading screen, split-text reveals, a custom cursor, and a pinned horizontal work reel.
---

# Portfolio GSAP + 3D Character

A skill for building sites that match the "Moncy Portfolio" project (`Portfolio-Website-main`).
Use it when asked to build or extend a page/section "in the style of the Moncy portfolio".

The site is a **single-page, one-screen-at-a-time SPA** with a lab: smooth scrolling
(GSAP ScrollSmoother), an interactive 3D character (React Three Fiber + raw three.js), a
full-screen geometric loading intro, and sections that reveal via GSAP SplitText. There is **no
router, no forms, no API calls, and no server**. All copy is hardcoded placeholder text in the
components (this project ships lorem-ipsum content).

## 1. Architecture at a glance

- Stack: Vite 5 + React 18 + TypeScript 5 + three.js 0.168 + React Three Fiber + drei +
  postprocessing + rapier (physics) + GSAP (core, ScrollTrigger, ScrollSmoother) + GSAP Club
  trial (SplitText) + react-fast-marquee + react-icons + Vercel Analytics.
- Entry: `src/main.tsx` → `App.tsx` (`LoadingProvider` > `Suspense` > `MainContainer` with lazy `CharacterModel`).
- Section order (in `MainContainer`): `Cursor`, `Navbar`, `SocialIcons`, `CharacterModel` (desktop only),
  then `#smooth-wrapper > #smooth-content` containing `Landing` (mobile children), `About`, `WhatIDo`,
  `Career`, `Work`, `TechStack` (desktop lazy), `Contact`.
- Styling: **plain CSS, one file per component** under `src/components/styles/` (e.g. `About.css`),
  imported by the component. No Tailwind, no CSS modules. Global vars in `src/index.css`.
- Build/run: `npm run dev` | `npm run build` (`tsc -b && vite build`) | `npm run lint` (`eslint .`) | `npm run preview`.

Reference file beside this skill: `gsap-scroll-and-3d-guide.md` (ScrollSmoother/SplitText/ScrollTrigger
recipes and the full 3D character scene internals).

> ⚠️ Build/run **not verified** in this environment: `@gsap/react` and `gsap-trial` resolve from the
> private `npm.greensock.com` registry, which timed out, so an install/build could not complete.
> Everything below is confirmed by tracing the committed source.

## 2. Design principles (the "feel")

1. **One screen at a time.** The body scroll is swallowed by ScrollSmoother; each section is a
   full `100vh` "screen" that the camera/character choreography transitions between.
2. **Purple on black.** The palette is near-black `#0b080c` with a lavender accent `#c2a4ff`
   and soft magenta/purple glows. Accent marks emphasis spans, headings, and hovers.
3. **Typography is the hero.** Big Geist headings (often gradient-filled or accented), wide
   letter-spacing on small caps labels, and large paragraphs. Type reveals by characters/words
   sliding up from `y:80` with a blur.
4. **Dashed + corner hardware.** Cards are outlined with dashed SVG lines and small corner ticks
   (`.what-content::before/after`, `.what-corner`), giving a technical "blueprint" feel.
5. **Playful interactivity.** A giant custom cursor with `mix-blend-mode: difference`, social icons
   that chase the mouse, a hover-expanding "What I do" stack, and a marquee+ball loading game.
6. **Everything animates, nothing waits.** Transitions are the product: scroll-scrubbed camera
   moves, looping text swaps in the landing, blinking loading elements, pinned horizontal scroll.
7. **Desktop vs mobile are separate compositions.** Desktop (>1024px) shows the 3D character and
   smooth-scroll camera choreography; mobile shows content stacked with the character inside Landing.

## 3. Design tokens (exact values)

### 3.1 Color

| Token | Value | Used for |
|---|---|---|
| `--backgroundColor` | `#0b080c` | page background (root; body starts `#000` then GSAP fades to this) |
| `--accentColor` | `#c2a4ff` | hovers, accent spans/headings, labels (About h3, career h5, contact span, work span, landing intro h2) |
| base text | `#eae5ec` | root `color`; navbar li at ≥500px |
| loader bg | `#eae5ec` | full-screen loading screen |
| loader black | `#000` | loading button, wrap, content, game lines |
| loader hover glow | `#a87cff` | `.loading-hover` blur blob, loader ball |
| ambient circles | `#fb8dff` | `.landing-circle1/2` blurred orbs |
| character rim | `#f59bf8` | `.character-rim` halo |
| landing info h2 | `#c481ff` | `.landing-info-h2` |
| career title gradient | `#7f40ff` → `#ffffff` | `.career-section h2` (background-clip: text) |
| career timeline | `#aa42ff` | `.career-timeline`, `.career-dot` |
| timeline glow | `#d29bff`, `#d097ff`, `#f2c0ff` | dot multi-layer box-shadow |
| cursor | `#e6c3ff` + `rgb(175,131,255)` glow | custom cursor (mix-blend-mode: difference) |
| work/muted | `#363636`, `#adacac`, `#ccc`, `#5e5e5e` | rules, secondary text, navbar links, resume button |
| tech AO | `#0f002c` | N8AO ambient occlusion tint |

### 3.2 Typography

- Family: **Geist** (Google Fonts, `wght 100..900`) for everything, including headings.
- Body: `font-family: "Geist", sans-serif; line-height: 1.5;`
- Landing intro `h1`: 28px → 30 (≥500) → 40 (≥768) → 60px (≥1600), weight 500, `line-height` ≈ size, ls 2px.
- Landing intro `h2`/info `h3`: accent, `font-size: 22px`, weight 300, ls 2px.
- Landing info `h2`: uppercase, weight 600, 32px/42px (`.landing-info-h2`), ls 2px.
- About: `h3` uppercase 25px ls **7px** weight 400 accent; `p` 33px weight 600 lh 36px ls 1px.
- What I do `h2`: `font-size: calc(4vw + 25px)`, lh `calc(4vw + 20px)`, weight 600 (7rem at ≥1950).
- Career: `h2` 70px weight 400 + gradient; `h4` 33px; `h3` 48px; `h5` 20px accent, capitalized.
- Work: `h2` 70px weight 500; card `h3` 50px weight 600; `h4` 18px; `p` weight 200 `#adacac`.
- Contact: `h3` 60px uppercase weight 400; social links 25px underline `#ccc`; `h2` 23px.
- Navbar: title 14–18px weight 700; links 12→16px ls 1px weight 600.

### 3.3 Spacing / layout containers

- `--cWidth: calc(100% - 30px)` (mobile), `94%` at ≥768px; `--cMaxWidth: 1920px`.
- Header/footer fixed bars pad `20px` (35px at ≥1200) vertically, centered via
  `left:50%; transform:translateX(-50%)`.
- `.section-container`: **1300px** (→1200 ≤1600, →900 ≤1400, →500 ≤900).
- Work horizontal strip: `.work-box` width 600px, padding 80px, `gap:50px`; `.work-flex` `margin-left:-80px; padding-right:120px`.
- What I do cards: `.what-content` width 450px, padding 50px; title margin-right 10%.
- Contacts: `justify-content: space-between` columns; mobile stacks with gap 40px.

### 3.4 Radius / borders / shadows

- Radius: pills everywhere — cursor `50px`, resume `50px`, loading button `100px`, tags `30px`,
  timeline dot `50px`, career timeline `3px` width.
- Dashed SVG borders: `.what-border1` (top/bottom dashed lines), `.what-border2` (left/right),
  `strokeDasharray="6,6"` / `"7,7"`, stroke white 2px; fade to `opacity:.2` after `whatBorders`.
- Corner ticks: `.what-content::before/after` + `.what-corner::before/after` — 10px squares with
  4px white borders, fade in via `whatCorners`.
- Shadows/glows: cursor `0 0 30px rgb(175,131,255)`; loading wrap `0 15px 15px rgba(0,0,0,.2)`;
  career dot triple glow; work link `0 0 10px rgba(255,255,255,.5), inset 0 0 10px #393939`;
  circles inset `-50px 40px 50px rgba(84,0,255,.6)`.

### 3.5 Motion

| Where | What |
|---|---|
| Smooth scroll | `ScrollSmoother.create({ smooth:1.7, speed:1.7, effects:true, autoResize:true })` |
| Text reveals | GSAP `SplitText` chars/words: `{autoAlpha:0, y:80}` → visible, `stagger .02–.03`, ease `power2–3` |
| Landing loop | `LoopText` swaps Designer/Developer every ~4s, y ±80 |
| Camera/character | Scroll-scrubbed timelines (`scrub:true`) move `camera.position.z`, `character.rotation`, `character-rim`, `.character-model` x/y |
| Loading | marquee (react-fast-marquee), game lines `loaderGame 7s linear`, ball `ball25 7s` cubic-bezier(.3,1.18,.63,1.28), blink `1s`, click-explode via `.loading-clicked` |
| Keyframes | `loadingCircle/loadingCircle2 5s linear`, `fadeIn 1s`, `timeline .8s linear`, `whatFlicker .5s`, `whatCorners .2s`, `whatBorders 1.2s`, `blink/blinkDone` |
| CSS transitions | `.3s`, `.5s`, `.8s ease-in-out`; cursor `left/top/width/height .3s ease-out` (`.cursor-icons` `.5s`) |

Breakpoints: `500`, `600`, `768`, `900`, `1024/1025`, `1200`, `1400`, `1600`, `1950`; desktop = `> 1024px`.

## 4. Component catalog

All class names are kebab-case; each CSS file lives in `src/components/styles/`.

### 4.1 `. Loading (`.loading-screen`, context-driven)
Full-screen fixed `#eae5ec`; header row ("Logo" + game). Marquee "A Creative Developer / Designer".
Center pill button with mouse-follow glow (`.loading-hover`), progress `Loading {percent}%`, then
"Welcome". `setProgress` ticks 0→100; on 100 → `loaded` → `isLoaded` → `clicked` (`loader-out`,
`.loading-clicked` expands to cover screen) → `initialFX()` → `setIsLoading(false)`.
```tsx
<LoadingContext.Provider value={value}>
  {isLoading && <Loading percent={loading} />}
  <main className="main-body">{children}</main>
</LoadingContext.Provider>
```

### 4.2 Custom cursor (`.cursor-main`, `Cursor.tsx`)
Fixed 50px lavender circle, `mix-blend-mode:difference`, chases mouse (`gsap.to` lerp, delay 6).
`data-cursor="icons"` → grows to element height (`.cursor-icons`); `data-cursor="disable"` → hides
(`.cursor-disable`). Hover adds/removes classes.

### 4.3 Navbar (`.header`)
Fixed top bar: title "Logo", centered `navbar-connect` email (≥900px), right column/list of
ABOUT/WORK/CONTACT using `<HoverLinks>`. Creates the `ScrollSmoother`, binds `data-href` links →
`smoother.scrollTo(section)`, and renders `.landing-circle1/2` + `.nav-fade` overlay.

### 4.4 HoverLinks (`.hover-link` / `.hover-in`)
Text + duplicate text stacked; hover slides up to reveal duplicate in accent (CSS-only `translateY(-100%)`).

### 4.5 SocialIcons (`.icons-section`)
Bottom-left vertical icon rail (GitHub/LinkedIn/X/Instagram) that follows the mouse within each
50px slot (`--siLeft/--siTop` lerp); bottom-right rotated RESUME button (`.resume-button`, `rotateZ(-90deg)` ≤768px).

### 4.6 Landing (`.landing-section`)
Left intro (`Hello! I'm` accent, MONCY YOHANNAN h1) + bottom-center `.landing-info` ("A Creative"
+ swapping Designer/Developer h2s). Hosts the character (`.character-model`) + `.character-rim`
halo on desktop. On ≥1025px intro sits right:66%, info left:66%.

### 4.7 3D character (`.character-model`, `Scene.tsx`)
Raw three.js `WebGLRenderer` (alpha, ACESFilmic tone mapping, camera 14.5° fov @ z 24.7, zoom 1.1).
Loads an **AES-256-CBC encrypted GLB** (`character.enc`, password `Character3D#@`) via
`decrypt.ts` + `GLTFLoader` + DRACO. Applies character animations (intro, blink, typing bone subset,
brow-up on hover of `.character-hover`), head follows mouse/touch, scroll timelines move camera.
Lights turn on after load.

### 4.8 About (`.about-section`)
Left/right centered 500px block: `h3.title "About Me"` (uppercase, ls 7px) + `p.para`.
`.title`/`.para` are SplitText targets.

### 4.9 What I do (`.whatIDO`)
Title "WHAT I DO" (accent "HAT"/"DO", italic "HAT") + two bordered cards (DEVELOP / DESIGN).
Cards expand on hover (`min-height 33%→67%`) with dashed borders, corner ticks, arrow rotate, flicker
fade-in. On touch, click toggles `.what-content-active` + `.what-sibling`.

### 4.10 Career (`.career-section`)
Gradient h2 "My career & experience"; vertical glowing timeline (`.career-timeline` + `.career-dot`)
that grows on scroll (`maxHeight 10%→100%`); rows of role/year + paragraph.

### 4.11 Work (`.work-section`)
Pinned horizontal scroll: GSAP timeline (`scrollTrigger {trigger:".work-section", start:"top top", pin:true, scrub:true}`)
translates `.work-flex` left by measured `translateX`. Cards (`.work-box`, 600px, alternating column
vs column-reverse) with `[01]`, title, category, tools; `.WorkImage` shows image + hover video +
circular arrow link.

### 4.12 TechStack (`.techstack`, lazy, desktop)
`<Canvas shadow>` with ~30 physics spheres (`@react-three/rapier`) using logo textures, a kinematic
pointer that attracts spheres, environment HDR `# ``, N8AO postprocessing. Only `isActive` when scrollY > work top.

### 4.13 Contact (`.contact-section`)
Three columns: Email/Phone, Social links (underline + arrow), "Designed and Developed by Moncy Yohannan" + ©.

## 5. Layout & page patterns

- **Single scroll.** Body `overflow:hidden`; `#smooth-wrapper > #smooth-content` holds all sections;
  ScrollSmoother animates it. `main` opacity keyed by `.main-active` after load.
- **Sections are full-height screens** (`height: var(--vh)` = `100svh`), centered via `place-items`.
- **Fixed chrome** around scrolling content: header, social icons, cursor, bubble orbs, fade overlay.
- **Mobile** (<1025): no fixed character; character renders inside Landing; WhatIDo/Contact/Career
  reflow to single column; work flex un-pins.

## 6. Behavior & interaction rules

1. **Boot sequence**: `LoadingProvider` shows Loading (z 999999999) → progress → click → `initialFX()`
   (enables body scroll, unpauses smoother, fades body to `#0b080c`, plays landing split-text + loops,
   fades in header/icons/fade). User must click to enter.
2. **Smooth nav**: header links prevent default and call `smoother.scrollTo(section)`.
3. **Scroll-driven choreography**: `setCharTimeline`/`setAllTimeline` build scrolledub timelines for
   the character camera and career/About reveals; recreated on resize (`handleResize` kills non-work
   triggers and rebuilds).
4. **SplitText**: `.title` (chars) and `.para` (words) animate on scroll (disabled <900px).
5. **Mouse/touch**: custom cursor lerp; character head rotation (scrollY <200), touch interpolation resets.
6. **No data layer**: no API, no state beyond context `LoadingProvider`; all copy is static placeholder.
7. **Accessibility**: minimal explicit ARIA; `pointer-events:none` on decorative cursor; text is real DOM
   (no canvas text). No `prefers-reduced-motion` handling found — note as a gap (unverified vs. requirement).

## 7. Building a new screen (workflow)

1. Add a `<section>` in `MainContainer` inside `#smooth-content` (e.g. a new `.some-section section-container`), with an `id` for nav `data-href`.
2. Create `src/components/YourSection.tsx` + `src/components/styles/YourSection.css`, import the CSS.
3. Write markup with Geist headings; use accent `var(--accentColor)` on emphasis spans; use the
   container widths (`.section-container` or `var(--cWidth)`); size type from the scale.
4. For scroll reveals, give a heading `className="title"` and paragraph `className="para"` so
   `setSplitText` picks them up, or add your own GSAP `ScrollTrigger` timeline.
5. For a pinned/horizontal effect, mirror the `Work` pattern (measure `translateX`, `pin:true`, `scrub:true`).
6. Add nav link (ABOUT/WORK/CONTACT pattern) and any `data-cursor` attributes for the custom cursor.
7. Verify: `npm run lint`, `npm run build`. Test ≥1025px (desktop choreography) and mobile reflow.

## 8. Do / Don't

**Do**
- Do register GSAP plugins before use (`gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)`).
- Do keep one CSS file per component in `src/components/styles/` and import it in the component.
- Do use CSS variables `--accentColor`, `--backgroundColor`, `--cWidth`, `--cMaxWidth`, `--vh`.
- Do use `SplitText` + `gsap.fromTo` for scroll reveals; `scrub:true` timelines for scroll-linked motion.
- Do add `data-cursor="disable"` on interactive chrome (nav, resume, links) so the cursor hides there.
- Do support the `>1024px` desktop vs mobile split; reflow with the listed breakpoints.
- Do lazy-load heavy 3D sections (`React.lazy` + `Suspense`) and guard with `isActive` scroll checks.

**Don't**
- Don't add a router, API calls, or forms — this is a static single page.
- Don't introduce Tailwind/CSS modules; stick to plain per-component CSS.
- Don't use the public `gsap-trial`/`@gsap/react` in production builds (trial license) — swap in official GSAP Club.
- Don't hardcode global styles in `index.css`; keep them in `styles/` beside the component.
- Don't break the `#smooth-wrapper/#smooth-content` structure — ScrollSmoother depends on it.
- Don't put interactive elements inside `.character-model canvas` (pointer-events none).

## 9. Final checklist

- [ ] `npm run lint` clean; `npm run build` (tsc -b && vite build) succeeds.
- [ ] Single-scroll structure intact (`#smooth-wrapper > #smooth-content`), body `overflow:hidden`, `main-body` max-width 100vw.
- [ ] New section uses `.section-container`/`var(--cWidth)` and `var(--vh)` heights.
- [ ] Accent/emphasis spans use `var(--accentColor)`; muted text uses `#adacac`/`#ccc`/`opacity .5–.6`.
- [ ] `title`/`para` classes present for SplitText reveals (or custom GSAP timeline added).
- [ ] `data-cursor` attributes applied; custom cursor unaffected; chrome hides cursor where needed.
- [ ] Desktop >1024 and mobile reflows verified against the breakpoint set.
- [ ] GSAP trial only used in dev/learning; production path documented (club plugin swap).
- [ ] No secrets; the encrypted character model + password stay out of source/build output.
