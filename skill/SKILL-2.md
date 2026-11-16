---
name: portfolio-cinema-3d
description: Recreate Rishab's cinematic scroll-driven 3D portfolio (Vite + React + three.js + Tailwind-free custom CSS) — a dark, glow-typography, CRT-scanline site that is fully driven by one JSON config file.
---

# Portfolio Cinema 3D

A skill for building sites that match the "Rishab Portfolio" project (`portfolio-main`).
If an agent is asked to build a new page, screen, or component "in the style of the portfolio",
recreate the site, or extend it, use this skill.

The system is a **single-page, scroll-driven 3D experience** (`src/cinema/`) plus one
secondary text page (`src/pages/Projects.tsx`). Everything personal is pulled from
`portfolio.config.json`; every visible string is uppercased; the visual identity is a dark CRT
terminal with a Doto glow-heading font and a fixed monospace body.

## 1. Architecture at a glance

- Stack: Vite 6 + React 18 + TypeScript 5 + three.js 0.186 + react-three-fiber (unused at runtime) +
  Tailwind v4 (installed but **not used** — no `@tailwind` directives; styling is plain CSS).
- Router: `wouter` (`<Switch><Route>`). Two routes:
  - `/` → `Cinema` (the 3D experience)
  - `/projects` → `ProjectsPage` (text archive)
- State: React local state + a tiny external live-store (`src/cinema/feed.ts`) driven by
  `useSyncExternalStore` for GitHub/LeetCode/Discord/contributions data.
- Build: `npm run dev` / `npm run build` (output `dist/public`) / `npm run serve` / `npm run typecheck`.
- API: Vite middlewares (dev) + Vercel serverless functions (`api/`) proxy GitHub & LeetCode.
- SEO: a plugin (`seo/generate.ts`) injects head tags, JSON-LD, `crawlerFallback`,
  `llms.txt`, `sitemap.xml`, `robots.txt` from the config.

Reference files beside this skill:
- `3d-scene-guide.md` — three.js engine, portal transitions, CRT/scanline shader, per-scene builds.
- `config-and-api-guide.md` — `portfolio.config.json` schema and the live-data API contract.

## 2. Design principles (the "feel")

1. **The browser is a terminal / CRT.** Everything is uppercase, monospace, green-accented,
   scan-lined, glitch-prone, and "pages" transition through portals.
2. **Black is the canvas.** The body and every 3D scene background are `#000` (or near-black);
   light exists only as scene-specific scenes (work = off-white `#f4f4f2`).
3. **Glow is the elevation.** Shadows are never soft box-shadows for cards; they are text/box
   glow (`--glow`), or a 1px dashed line, or a border-weight + deep drop shadow for windows.
4. **Grid + asymmetry.** Panels are absolutely positioned inside a fixed viewport, anchored to
   the left at `42px` (20px on mobile), vertically centered. Content hugs edges.
5. **Stepping motion.** All hover/reveal transitions use `steps()` easing (5–9 steps) — never
   smooth `ease` for UI chrome; only the 3D camera eases. This is a signature.
6. **"•" active marker, ">" link prefix.** Active list items get a `• ` prefix; every primary
   link/action is prefixed with `> ` (or `[00]` index markers).
7. **One source of truth.** Never hardcode names, links, numbers, or copy. Everything comes from
   `portfolio.config.json` (via `src/config.ts`).
8. **Progressively degrade.** If WebGL is unavailable, the site still renders every section as a
   stacked scrollable layout (`.cx-nogl`). If live APIs are down, show "SYNCING…"/"—" fallbacks.

## 3. Design tokens (exact values)

### 3.1 Color

Dark theme (default):

| Token | Value | Used for |
|---|---|---|
| `--fg` | `#e9ecef` | default text |
| `--fg-dim` | `#e9ecefa6` | secondary text, dashed borders, faint links |
| `--dot` | `"Doto", ui-monospace, monospace` | display headings |
| `--mono` | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | body |
| `--glow` | `0 0 1px #ffffffd0, 0 0 8px #ffffff40` | heading text-shadow |
| page background | `#000` | body + every canvas scene (except work) |
| accent green `green` | `#22ff00` | `$` prompt, caret, menu hover, focus underline, caret-color, live link |
| contributions green | `#39d353` | commits total number, week label, GitHub data color |
| timeline blue | `#b9dcf2` | timeline dates, PR card text, journey sky |
| journey fog | `#0b1d33` | journey scene fog/background |
| terminal window bg | `#050607d9` | terminal + modal form panel |
| terminal border | `#ffffff26` | window border |
| terminal bar dots | `#ff5f57`, `#febc2e`, `#28c840` | traffic lights (macOS) |
| dark surface | `#0b0b0b` | monitor bezel, archive frame border |

Light theme (work chapter only, `.cx.is-light`):
`--fg: #121212`, `--fg-dim: #121212a6`, `--glow: none`, scene bg `#f4f4f2`.

Status (header presence dot): `online #22ff00`, `idle #ffd000`, `dnd #ff3344`, `offline #7a7a7a`.
Status (painted signal cards): `online #23a55a`, `idle #f0b232`, `dnd #f23f43`, `offline #80848e`.
Signal card glows: discord `#da0149`, leetcode `#ffa116`, github `#39d353`, linkedin `#0a66c2`.

Form error `#ff5a5a`; archive hover invert (`bg #e9ecef`, text `#050505`).

### 3.2 Typography

- Body: `font-family: var(--mono); text-transform: uppercase;` base `letter-spacing` varies.
- Display headings (`.cx-dot-type`): `font-family: var(--dot); font-weight: 900;`
  `letter-spacing: -0.07em; word-spacing: -0.2em; line-height: 0.95; text-shadow: var(--glow);`
- Google Font `Doto` loaded at `wght 700;900` (`index.html`).
- Sizes: header `13px` (ls `.08em`), brand `17px`; hero h1 `clamp(30px,3.1vw,46px)`;
  blurb `12.5px` (lh 1.38); work h2 `clamp(24px,2vw,30px)`; work list `12.5px`;
  detail `11.5px`; terminal `13px`; commits total `clamp(64px,9vw,138px)`;
  journey `13px`; contact h2 `clamp(30px,3.4vw,48px)`; menu item `clamp(42px,7vw,92px)`;
  archive h1 `clamp(56px,11vw,168px)`; archive stats `clamp(34px,4vw,56px)`;
  archive list `12.5px`; archive repo name `22px` (Doto 900, no transform).

### 3.3 Spacing / layout

- Fixed header: `padding: 26px 42px`; right cluster `gap: 32px`; mobile `18px 20px`, gap 18px.
- Panel anchor: left/top `42px`; mobile `20px`.
- Terminal: `width: min(620px,86vw)`, `margin: -230px auto 0; top:50%`.
- Contacts box `padding: 56px 72px`; mobile `40px 22px`.
- Journey: `padding: 90px 42px 60px; gap: 40px`, two columns `min(440px,44vw)`.
- Archive main: `padding: 140px 42px 100px; max-width: 1400px; margin: 0 auto`.
- List row grid `grid-template-columns: 56px minmax(0,1fr) 120px 56px 56px 80px 64px; gap:18px`.

### 3.4 Radius / borders / shadow

- Terminal + modal form: `border-radius: 10px`; timeline logos `7px`; archive frame
  `18px / 26px`; loader pill `99px`.
- Terminal: `border: 1px solid #ffffff26; box-shadow: 0 30px 80px #000c, 0 0 0 1px #000; backdrop-filter: blur(3px)`.
- Modal form: `border: 1px solid #ffffff2e; background: #050607f2; box-shadow: 0 30px 90px #000, 0 0 0 1px #000`.
- Dashed rules: `1px dashed var(--fg-dim)` (block/terminal/. about, journey timeline, form inputs, archive border-block).
- Contact box corner brackets: `linear-gradient` 14px×1px corner ticks (see `.cx-contact-box::before/after`).

### 3.5 Motion (all `steps()`)

| Element | Animation |
|---|---|
| loader fade | `opacity .6s steps(6,end)` |
| loader pill bead | `cx-pill 1.1s ease-in-out infinite alternate` |
| hover blink | `cx-blink .4s step-end 2` (scroll hint `1.6s` infinite) |
| detail reveal type | `cx-type .5s steps(8,end)` (clip-path wipe) |
| menu/modal open | `cx-menu-in .35s steps(5,end)` (clip-path from top) |
| journey reveal | `opacity .35s steps(4,end), transform .35s steps(4,end)` |
| archive hover | `background .15s steps(2,end), padding .15s steps(2,end)` |
| preview | `opacity .2s steps(3,end)`, frame `width .18s steps(3,end)` |
| lang bar | `opacity .2s steps(3,end)` |
| 3D camera | smooth exponential ease (`1 - exp(-k·dt)`), fog, glitch by scroll velocity |

Breakpoints: `max-width: 760px` (panel mobile layout), `max-width: 860px` (archive),
`(pointer: coarse)` (touch → fewer voxels/cards, no hover preview), `prefers-reduced-motion: reduce`
(disable all CSS animation and 3D time/glitch).

## 4. Component catalog

All class names are namespaced `.cx-…` and live in `src/cinema/cinema.css` (shared by both
pages). States are `is-*` modifiers.

### 4.1 Header `.cx-head`
Fixed top bar: brand link (Doto, left) + right cluster (LET'S TALK w/ presence dot, MENU ☰ button).
States: hover blinks (`.cx-blink`); focus-visible dashed outline `1px dashed currentColor offset 4px`.
```tsx
<header className="cx-head">
  <a href="#" className="cx-brand cx-dot-type">Name</a>
  <nav className="cx-head-right">
    <a className="cx-talk">LET'S TALK<i style={{ background: dot, boxShadow: `0 0 6px ${dot}` }} /></a>
    <button className="cx-menu-btn">MENU<span>☰</span></button>
  </nav>
</header>
```

### 4.2 Loader `.cx-loader`
Full-screen black; `LOADING` in Doto + pill w/ moving bead; `.is-done` → fade out when engine + fonts ready.

### 4.3 Hero `.cx-hero`
Absolute inset. `.cx-hero-name` left/center (h1 Doto, line: `// PORTFOLIO` + `©year`),
`.cx-hero-blurb` right column, `.cx-scroll-hint` bottom-center (`SCROLL ↓`, blinking).

### 4.4 Work reel `.cx-work`
Left-anchored panel. `h2` Doto, `<ol>` of project links `[01] NAME`; active gets `is-active`
→ `• ` prefix, full `--fg`. `.cx-work-detail` shows `tag — stack`, `desc`, `> OPEN ON GITHUB`,
and `> ALL N PROJECTS` (wouter `<Link>`). Keyed by project id so it re-animates.

### 4.5 Terminal `.cx-term`
Centered window. `.cx-term-bar` (3 dots + title), `.cx-term-body` types lines from
`config.terminal.lines` ([cmd, output]); `$` prompt in green, `.cx-caret` block cursor.
`data-text` drives typewriter; `.is-typing::after` caret. SR-only `.cx-sr` copy for a11y.

### 4.6 Commits `.cx-commits`
`.cx-commits-week` (green uppercase week label, top-center), `.cx-commits-main` (bottom-left):
huge green `.cx-commits-total` count, label, `<ul>` of BUSIEST DAY / CURRENT STREAK / LONGEST
STREAK, link `> GITHUB.COM/USERNAME`.

### 4.7 Journey `.cx-journey`
Two columns: `.cx-timeline` (left, dashed rule, logo thumbs, span date / b|a title·org / em note)
and `.cx-prs` (merged upstream PRs). `li` starts `opacity:0; translateX(-14px)`; `.is-on` reveals.
On ≤760px only one column shows at a time via `data-phase` (`tl`/`prs`).

### 4.8 Signal `.cx-work.cx-signal`
Like work reel but the list is the signal cards (DISCORD, LEETCODE, GITHUB, LINKEDIN). `.is-active`
index; detail shows the live line + `> OPEN X`. `sig` state −1 = intro copy.

### 4.9 Contact `.cx-contact`
Centered `.cx-contact-box` (corner brackets), Doto headline w/ `<br>` per line, sub line, email
link (underline), `> SEND A MESSAGE` (opens modal), social `<ul>`, bottom `<footer>` strip.

### 4.10 Full-screen menu `.cx-menu`
`.is-open` overlay, backdrop blur `6px`, bg `#000000eb`. Big Doto items `[00] HOME …` (hover →
green), footer has Discord dot + social links. Esc closes.

### 4.11 Contact modal `.cx-modal` / form `.cx-form`
`role=dialog`, backdrop, centered form. Fields: dashed-underline inputs, focus border-green,
caret-color green. Honeypot `._honey` (hidden). Foot: submit (`SENDING…` when sending, disabled),
"OR MAIL". `.cx-form-error` (red, `role=alert`). Success state `.cx-form-done` → "Message sent. …".

### 4.12 Archive page `.cx-archive` components
- `.cx-archive-fx` — fixed scanline+grain overlay (`repeating-linear-gradient` + SVG turbulence, steps flicker).
- `.cx-archive-stats` — 4-col bordered stat grid (Doto numbers + small labels).
- `.cx-archive-langbar` — flex bars colored by `LANG_COLORS`.
- `.cx-archive-controls` — search `<label>&gt; <input>` (uppercase, green caret) + sort role=group buttons.
- `.cx-archive-chips` — language filter pills; `.is-active` = inverted (bg `var(--fg)`).
- `.cx-archive-list`/`li` — grid row; `:hover/:focus-within` inverts; `[01]` index, name (Doto),
  desc, topics chips, lang dot, stars, forks, when, `LIVE ↗`.
- `.cx-archive-preview` — follow-cursor floating frame; README preview image or painted canvas, else `LOADING README…`.
- `.sw-*` — "swarm" reveal layer (colored cursors fly around, draw boxes, exit into a trash bin; see reference).

### 4.13 Painted screens & cards (2D Canvas)
Each project (`.cx-work`, archive preview) and each signal card is a **canvas texture** drawn by
the `screens.ts`/`cards.ts` painters. Hand-drawn screens exist for `layla`, `syella`,
`makimakey`, `deltasys`, `commitify`; all others get a procedural `generic` screen (bg from a
5-scheme palette, name, desc, topic chips, hex-scroll). Signal cards are 768×1024 canvases that
imitate Discord / LeetCode / GitHub / LinkedIn UI with live data.

## 5. Layout & page patterns

- **Scroll = chapters.** The page's height is `(total+1)*100vh` via `.cx-spacer`. The engine maps
  `window.scrollY / innerHeight` → chapter index `i`, local progress `lp`, transition `t` (see
  `timeline.ts`). Panels get `opacity`/`visibility`/`transform` from `opacityFor` each frame.
- **Every panel is a fixed-position layer** inside `.cx-panels` (z-index 10) above the canvas
  (z 0); header z 20; archive preview z 25; swarm z 28; archive fx z 30; menu z 40; modal z 45;
  loader z 50.
- **Mobile** reflows panels to edges and switches to stacked solo-column for journey/signal.
- **No-GL fallback** (`.cx-nogl`): canvas hidden, `.cx-panels` becomes static stacked grid.
- **The /projects page** reuses the same chrome, adds a text archive pattern with the `data-build`
  attribute marking elements the swarm targets, plus the follow-cursor preview.

## 6. Behavior & interaction rules

1. **Scroll-driven narration.** All chapters are progress-bound; user scroll controls everything.
   Menu items call `window.scrollTo({ top: scrollTargetFor(key), behavior:"smooth" })`.
2. **Live data** (`feed.ts` + `startLive`): GitHub (via `/api/gh`) → repos/stars/followers,
   featurd repos, merged PRs, commits; github-contributions-api → days; LeetCode via `/api/leetcode`;
   Lanyard (30s poll) → presence/activities/Spotify. All merged into one `Live` store; UI re-renders
   on `set`.
3. **Token substitution** in terminal output: `{uptime} {repos} {stars} {followers} {solved}`.
4. **Contact modal** opens when `config.contact.form` is set and URL `/contact`; uses
   `history.pushState/replaceState` + `popstate`; posts JSON to `formsubmit.co/ajax/…` with
   honeypot guard; success/error states.
5. **SEO**: `usePageMeta` sets title/desc/canonical/OG/Twitter on route. `seo/generate.ts` also
   emits JSON-LD person graph, crawlable `#seo-content`, llms.txt, sitemap, robots on build.
6. **Error/empty handling**: fetch failures → `null` + fallback config data; UI shows
   `SYNCING…`/`—`; archive load failure shows `⚠ ERROR`; list empty → "NO MATCH …".
7. **Accessibility**: `aria-hidden` on canvas/decor, `aria-label` per panel, `role=dialog`,
   focus-visible outlines, SR-only terminal copy, `prefers-reduced-motion` full disable.

## 7. Building a new screen (workflow)

To add a chapter or page in this style:

1. Copy an existing panel's `<section ref={reg(chapter)} className="cx-panel cx-…" aria-label>`
   into `Cinema.tsx` inside `<main className="cx-panels">`, and add its key to `ORDER`/`PANELS`
   in `timeline.ts` + `Cinema.tsx` (chapter length in `buildTimeline`, `<Win>` opacity window).
2. Compose it from the component primitives above (Doto `h2`, `> ` links, `• ` active markers,
   dashed rules). Use `config` for every string; uppercase all display text.
3. Add `.cx-…` CSS in `cinema.css`: absolutely position within `.cx-panel`, anchor to `42px`
   (`20px` at ≤760px), set `font-size/letter-spacing` from the token scale, use
   `--glow`/`--fg-dim`, `steps()` transitions, and add a `@media (max-width:760px)` reflow.
4. For a 3D chapter, follow `3d-scene-guide.md`: build a `Chapter` (`scene/camera/update/dispose`),
   register it in `engine.ts` `make`. For a text-only addition, no scene needed — the panel can
   float over the hero canvas.
5. Add live data hooks via `feed.ts` if needed; fall back to "SYNCING…"/`—`/config defaults.
6. Verify: `npm run typecheck` then `npm run build` (dist → `dist/public`); re-check mobile &
   no-GL (`cx-nogl`) and reduced-motion.

## 8. Do / Don't

**Do**
- Do keep every user-facing string from `portfolio.config.json`; uppercase it in UI.
- Do use the namespaced `.cx-` classes + `is-*` states; extend `cinema.css`, don't fork it.
- Do use `--glow`, `--fg-dim`, `steps()` transitions, and `margin:0` resets on `p`.
- Do add `data-text`/`.is-typing` for any typewriter effect and `.cx-sr` for its SR copy.
- Do add `aria-label`, `aria-hidden` on decoration, `focus-visible` outlines, and honor
  `prefers-reduced-motion`.
- Do implement the `cx-nogl` fallback and live-fetch fallbacks for any new live data.
- Do gate desktop-only follow/hover effects on `(pointer: coarse)`.
- Do keep chapters independent so each is a pure function of its `lp`.

**Don't**
- Don't introduce Tailwind utility classes or any new framework — the style is plain CSS.
- Don't use smooth `ease` on UI chrome; that breaks the stepped-J signature (3D camera is the exception).
- Don't hardcode names, repo lists, numbers, or API data; everything flows from the config/store.
- Don't put text directly on the canvas panels without a text layer — panels are DOM overlays
  sitting on top of the 3D canvas.
- Don't forget the fixed `z-index` stack (canvas 0 → loader 50).
- Don't break the scroll-height contract: keep `.cx-spacer` height in sync with the timeline total.

## 9. Final checklist

- [ ] `npm run typecheck` clean; `npm run build` succeeds and emits `dist/public`.
- [ ] New content is fully config-driven (no literals for person/links/numbers/copy).
- [ ] Doto `h2` + `--glow`, monospace body, uppercase text, `> `/`• ` conventions honored.
- [ ] Panel is absolute within `.cx-panels`, positioned from the 42px/20px gutters.
- [ ] States covered: hover (blink/invert), focus-visible, active `• `, disabled/sending, error,
      loading (`SYNCING…`), empty (`NO MATCH`), no-GL, reduced-motion.
- [ ] Mobile `@media (max-width:760px)` reflow present; archive `860px` rules intact.
- [ ] `aria-label` per section, `aria-hidden` on decoration, SR copy where visual text is canvas-only.
- [ ] Live data has fallbacks; polling uses the existing `feed.ts` store.
- [ ] No secrets committed; `GITHUB_TOKEN` only via env for rate-limit.
