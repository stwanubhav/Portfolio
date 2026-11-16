# Config & API Guide

## portfolio.config.json (single source of truth)

Edited to make the site yours. Loaded raw into `src/config.ts` (`config`). Keys:

| Key | Drives |
|---|---|
| `site` | url, title, description, keywords, ogImage, favicon, themeColor, locale, twitter, geo |
| `person` | name, givenName, familyName, handle, pronouns, gender, born, location, city, country, nationality, languages, email, jobTitle, avatar, summary |
| `accounts` | github, leetcode, discordId |
| `github` | featuredTopic, excludeUpstreamOwners, ignoreCommits regex |
| `hero` | tag (`// PORTFOLIO`), blurb |
| `projects` | `[{repo, tag, stack, desc, homepage?}]` — the curated work reel + copy overrides |
| `terminal` | title + `lines: [[cmd, out]]` with `{uptime} {repos} {stars} {followers} {solved}` tokens |
| `timeline` | `[{type: work\|education, when, title, org, note?, logo?, url?, current?, sameAs?}]` |
| `signal` | `cards: ["discord"\|"leetcode"\|"github"\|"linkedin"]`, discordBanner |
| `linkedin` | static LinkedIn card (no public API) |
| `contact` | headline (may contain `\n`), sub, form URL |
| `socials` | `[{label, href}]` |
| `seo` | about, extraProjects, expertise, knowsAbout, openSource, faq |

`data.ts` derives `PROJECTS` (uppercase names, `gh url`), `SOCIALS` (uppercase labels),
`DISCORD_ID`, `BORN`, `TIMELINE`, `LINKEDIN`, and `OVERRIDES` keyed by lowercase repo name.

## API routes

Vite middlewares (dev/preview) and Vercel functions (build) implement the same contract:

- `/api/gh/*` — proxies `api.github.com/*`; forces `is:public` on searches; only allows
  `users/{owner}`, `users/{owner}/repos`, `search/{repositories|issues|commits}`,
  `repos/{owner}/{repo}/readme` (readme guarded against private repos). `GITHUB_TOKEN` optional
  (rate-limit only; classic token, no scopes). Cache `public, max-age=300`.
- `/api/leetcode?username=` — proxies LeetCode GraphQL `userStats`; returns
  `{username, ranking, totalSolved, easySolved, mediumSolved, hardSolved, totalQuestions, totalEasy, totalMedium, totalHard}`.
  Cache `public, s-maxage=300, stale-while-revalidate=600`.

## Live data store (`feed.ts`)

`startLive()` runs once; populates a module-level `Live` object; `set()` bumps `updated` and
notifies subscribers; `useLive()` = `useSyncExternalStore(subscribe, getLive)`.

| Feed | Source | Fields |
|---|---|---|
| GitHub user | `/api/gh/users/{owner}` | followers, gh profile |
| GitHub repos | `/api/gh/users/{owner}/repos?per_page=100` | repos count, stars, langs tally |
| Merged PRs | `/api/gh/search/issues?q=is:pr author:{owner} is:merged …` | prs[] (repo, number, title, date, url) |
| Commits | `/api/gh/search/commits?q=author:{owner} is:public` | commits[] (12), filtered by `ignoreCommits` |
| Contributions | `github-contributions-api` v4 `?y=last` | days[] (-371), contribTotal |
| LeetCode | `/api/leetcode?username=` | solved, leet |
| Discord | Lanyard `api.lanyard.rest/v1/users/{id}` (30s poll) | presence (status/activity/spotify), discord profile, activities |

`toProject(repo)` maps a GitHub repo to a `Project` using config overrides, else derives tag/stack
from topics/language. `loadFeatured()` = search `topic:{featuredTopic}` repos (timeout 2.5s →
fallback `PROJECTS`). `weekAt`/`weekSummary` and `contribStats` power the commits chapter.
`ago()` formats `Xm/h/d/mo/y AGO`.

## SEO generation (`seo/generate.ts`)

Vite plugin `seoPlugin`:
- injects `headTags(config)` at `<!--seo:head-->` (title, meta, OG/Twitter, JSON-LD graph,
  favicon, canonical, `link rel=me` for socials), `crawlerFallback` at `<!--seo:body-->`
  (1px SR block with full text content for crawlers).
- serves/emits `/llms.txt`, `/sitemap.xml`, `/robots.txt`.
- `jsonLd` builds a `Person` (schema.org) graph with `worksFor`/`alumniOf`, `Organization`,
  `WebSite`, `ProfilePage`, `BreadcrumbList`, `FAQPage`.

`usePageMeta({title, description, path})` (runtime) sets title/description/canonical + OG/Twitter.
