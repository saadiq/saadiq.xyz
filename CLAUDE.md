# saadiq.xyz

Personal website for Saadiq Rodgers-King — AI transformation consulting.

## Architecture

This is an **Astro static site** served at `https://saadiq.xyz`. It shares a Digital Ocean droplet (`167.71.169.225`) with a Ghost blog: this repo's `dist/` output is served from `/var/www/saadiq.xyz/`, and Ghost runs on `127.0.0.1:2368` behind nginx at `/newsletter`.

### Server operations

**The full runbook — server layout, Ghost upgrades, Node bumps, OS updates and reboots, nginx routing, npm supply-chain posture — is the `droplet-operations` skill. Invoke it before touching the server.** The rules below stay here because they must apply even when that skill is not loaded:

- **Stop Ghost before `ghost update`, and `ghost start` afterwards is mandatory.** Running both at once OOM'd the droplet (2026-05-13). `ghost update` does *not* restart Ghost if you stopped it first, and skipping the start leaves `/newsletter` 502ing while the static site keeps serving, so the site *looks* healthy.
- **Never hand-edit a conf in place inside `/etc/nginx/sites-enabled/`.** `sed -i.bak` writes its backup next to the edited file, i.e. into the include dir. Two outages came from exactly this. Edit via a backup location *outside* the dir; the `*.conf`-scoped include is a second guard, not a licence.
- **Never reintroduce a bare `proxy_pass https://ap.ghost.org;`.** It resolves DNS at config-parse time, so a transient hiccup fails `nginx -t` and nginx stops and stays down. Keep the `resolver 127.0.0.53 valid=300s;` + `set $ap_ghost …; proxy_pass $ap_ghost;` variable form.
- **Never run ghost-cli's blanket `chmod 664` suggestion.** It also widens `config.production.json` (holds mail credentials) to world-readable. Chmod only the files ghost-cli lists.
- **Remove the `llms.txt` `proxy_hide_header` workaround once Ghost fixes the hardcoded root-relative discovery paths upstream.** It silently masks their corrected header otherwise.
- **Check `/var/run/reboot-required` on every visit.** `unattended-upgrades` installs kernel and glibc fixes but cannot reboot, so they sit inactive until someone restarts the box.

## Related repo

- **Ghost theme** (`journal-field-notes`, branch `field-notes`): `~/dev/journal`
- The two do **not** share a palette, and syncing tokens between them is not the goal. The site is dark (`bg #0b0a09`); Field Notes is deliberately light (`--bg #f6f6f4`) because an archive is read, not scanned. What they share is a *vocabulary*: JetBrains Mono for metadata, `// section` eyebrow labels, the trailing-underscore terminal motif, a green live dot, and the gold `#d4a843` (the site's `accent`, the theme's `--accent-bright`). Keep that vocabulary in sync; let the grounds differ.
- Field Notes darkens the accent to `#a47018` for its own body copy because `#d4a843` fails contrast on a light ground. That's correct, not drift.

## Color tokens (in `src/styles/global.css`)

Three ground planes and three text tiers. Neutrals are warmed off pure grey so the ground sits in the same light as the type.

| Token | Value | Notes |
|---|---|---|
| `bg` | `#0b0a09` | Page ground |
| `bg-surface` | `#131110` | Unused since 2026-09-23 (was the alternating section plane) |
| `bg-raise` | `#1c1917` | Quotes, tables, code |
| `text` | `#f2eee6` | Display and headings (17.1:1 on bg) |
| `text-body` | `#cfc5b8` | **All running prose** (11.6:1 on bg) |
| `text-muted` | `#ab9d91` | Metadata only (7.5:1 AAA on bg) |
| `accent` | `#d4a843` | Gold accent (8.9:1 on bg) |
| `accent-hover` | `#e8bd5a` | Hover state |
| `rule` | `#2f2926` | Decorative borders |

**The tier split is load-bearing.** `text-muted` means *metadata* — `font-mono` captions, sources, timestamps, link rest-states, input placeholders. Running prose uses `text-body`. Putting prose back on `text-muted` is what made the site read flat and grey before 2026-08-15.

Every tier clears AAA on `bg` and `bg-surface`. The one exception is `text-muted` on `bg-raise` at 6.63:1 (AA, not AAA), which is a deliberate trade: darkening `bg-raise` far enough to reach 7:1 collapses its separation from `bg-surface` to 1.03:1 and the plane stops reading.

**Every page runs on continuous `bg` and sets raised objects on it** (2026-09-23, replacing the old bg / bg-surface alternation). The black is the setting, not the thing every section lives in. Raised objects use `.panel` in `global.css`: a `bg-raise` gradient, a hairline border with a lighter top edge, and a deep shadow. The lighter top edge is what makes it lift, because a shadow alone barely shows on near-black. `.panel-accent` adds the gold top edge for the What shipped cards. Every homepage section below the hero carries one raised object: the Stats row, the What shipped cards, the three WhyNotThem panels, the Tracks receipts, the Services at-a-glance table (rows from `src/lib/services-data.ts`, shared with /services), the newsletter post cards, and the About portrait. A section with no object reads as empty black, so a new section needs one too. Sections use `py-16 md:py-20`; without the old shade changes, the previous `py-28` read as a void. The hero photo and the About portrait take the same shadow. Sections carry no `border-t`; the `.rule-heading` labels and the panels mark the boundaries. Keep panels for things that are objects (numbers, cards, tables). Boxing every section brings back the flatness in a new form. `FooterCTA` keeps its rule.

Every page, `FooterCTA` included, shares `.container-wide` (82rem). Prose inside it keeps its own `max-w-*` measure. Subpage h1s share one scale (`text-5xl md:text-7xl lg:text-8xl`). Subpage panels: each `/work` case study (metric studies add `.panel-accent`) and testimonial, the `/services` at-a-glance table and each service, the `/speaking` appearances list and theme cards (stage photos take the panel shadow), and the `/about` metadata block (portrait takes the shadow). `bg-surface` is no longer used on any page; it stays in the token table because the contrast figures reference it.

The hero puts the message ahead of the person. The headline runs the full container width at up to 8.25rem, credentials stay as the small mono `exits_` / `before_` lines, and the photo sits small in the bottom-right corner. `speaking-mic-mirrored.jpg` is deliberately flipped so the gaze points into the page, not off its edge. Keep it that way if the photo is replaced.

Design canvas with the treatments that led here: https://claude.ai/artifact/Y2rS3ZjaK33S8rRFNsuT3p

Design review that produced this system, including the changes not yet made (break the shared `max-w-5xl` container, one large accent moment per page, bring photography above the fold): https://claude.ai/code/artifact/219fdc26-0c51-4d53-b23f-1379a56bf049

## Section labels

The 17 `// section` eyebrows were cut to 9 on 2026-08-15. **The test is not "does the label restate the heading below it" — it is "does the section identify itself without the label."** Getting that wrong in the first pass stripped two sections that genuinely needed one; see below.

Cut (8): every page-level label, where the nav highlight and the h1 already say the word three times over (`// work` above "What shipped", `// services` above "How I work", `// about`, `// speaking`), plus `// ai transformation` above an h1 that says AI, `// the problem` above four 5xl gold percentages, `// about` above a portrait, and `// what clients say` above attributed blockquotes. Those sections identify themselves; the label only added a line. Uniform overture is what made the page read flat — when all seven homepage sections open the same way, the announcement stops carrying rank and degrades into an `<hr>` with words on it.

**Kept `Services` and `From the newsletter` on the homepage after cutting them first and being corrected.** A list of five service nouns and three post titles look like generic content until something frames them — unlike the stats or the portrait, they do not announce what they are. Restating a nearby heading is not the disqualifier; leaving the reader unsure what they are looking at is.

Survivors use `.rule-heading` in `global.css`: a mono label carrying its own hairline via `::after`, so the label and the rule are one device instead of two stacked ones. **The rule starts after the label rather than spanning the container** — that is what keeps it reading as a heading and not as a section border, so it does not fight the plane-change boundary rule above. It replaced the old `border-t border-rule pt-12` + `.section-label mb-10` stack on `/work`, `/speaking`, `/services` (keep the `pt-12`, drop the `border-t`). `.section-label` survives for exactly one use, the `// 404` status code.

**Every surviving label is a real `<h2>`, not a `<p>`.** They used to be paragraphs while the items *inside* them were `<h2>`s, so group names were absent from the heading outline and every item was a flat sibling. Items dropped to `<h3>` (and `/speaking` themes to `<h4>`) to match. The three sections that lost their only label — Stats, AboutSection, and the `/work` testimonials — got an `sr-only` `<h2>` so the outline stays complete. Write labels in sentence case in the markup and let `text-transform` uppercase them, so screen readers get real words.

## Content rules and proof gating

- Site prose follows the vault writing rules (no em-dashes, no colon setup/payoff, no filler, no aphoristic kickers). Per-claim proof constraints — what is and isn't claimable about each engagement — live in `docs/plans/2026-06-10-services-page-design.md`; read it before writing or editing any proof copy. No prices anywhere on the site.
- `/work` case-study names and testimonials are gated in `src/lib/work-data.ts`. Everything ships anonymized until a written release lands; then flip that entry's `nameCleared` (case studies) or `cleared` (testimonials) flag. Naming gates: Lanyard needs written consent per the SOW publicity clause, Kantar has a signed NDA, Molina needs explicit permission, Our Kids Read was an explicit testimonial swap. Preview all names/testimonials locally with `SHOW_PENDING=1 bun run dev`.
- The newsletter signup forms (homepage + FooterCTA) POST to the Ghost Members API under `/newsletter/members/api/` (integrity token, then send-magic-link — no keys). They only work where nginx serves Ghost on the same origin, so on localhost dev the form errors and shows a fallback link to `/newsletter`. Successful signups fire a `newsletter_signup` PostHog event, and send `urlHistory` so Ghost can attribute the member (see below).

## Member attribution

Ghost decides a member's source from `sessionStorage['ghost-history']`, written by `member-attribution.min.js` and posted as `urlHistory` on `send-magic-link`. Three things about this repo's setup are non-obvious and were each derived the hard way (2026-08-26, 2026-09-01):

- **`BaseLayout` loads `/newsletter/public/member-attribution.min.js`, and `NewsletterSignup.astro` sends `urlHistory`.** Ghost serves that script only on its own `/newsletter` pages, so without both halves every signup off the Astro site reached Ghost as Direct. Use the **unversioned** script path; the `?v=` hash changes on Ghost upgrades. Portal does the same thing via its internal `Ru()`.
- **Never put `?ref=` or `?utm_source=` on an internal link into `/newsletter`. Use `rel="noreferrer"`.** Ghost's `siteUrl` is the `/newsletter` subdirectory, so `@tryghost/referrer-parser` does *not* treat the apex site as same-site: your own homepage lands in the history as a legitimate external referrer, and `referrer-translator.js` returns the **newest** entry that parses (`url-history.js` iterates `.slice().reverse()`). Verified against 6.57.1 for LinkedIn → apex → `/newsletter` — plain link gives `saadiq.xyz`, `?ref=site-nav` gives `site-nav`, `rel="noreferrer"` gives `LinkedIn`. A ref param only relabels the wrong answer; dropping the referrer lets the resolver fall through to the entry holding the real source. Every internal `/newsletter` link carries `rel="noreferrer"` for this reason — keep the client-rendered template in `NewsletterPreview.astro` in sync with the server one.
- **Outbound links from social INTO the site are the opposite rule: tag them.** Verified 2026-09-01 against 6.57.1 and `@tryghost/referrer-parser` 0.1.21. `url-attribution.js` resolves `referrerSource` as `ref || source || utm_source`, and `ReferrerParser.parse` checks `referrerSource` before it ever looks at `document.referrer`, so the param wins. `utm_source` also populates a separate `utmSource` field, resolved by its own loop (oldest tagged entry, versus newest parsing entry for the referrer), which is what carries campaign data. Two cases need it: an untagged Threads click lands as the raw hostname `www.threads.com` with a null medium instead of `Threads / social`, and any visit with a stripped referrer (app webviews, X's redirector, privacy modes) lands as Direct. Use `utm_source=twitter`, not `x` — the known-referrer list keys on the canonical name, so `x` passes through unnormalized. The convention (`utm_source` platform, `utm_medium=organic-social`, `utm_campaign` post slug) lives in the vault at `2-Areas/Content-Creation/_guidance/platforms/hub-and-spoke.md` § Link Tagging.

To re-verify after a Ghost upgrade, run `core/server/services/member-attribution/referrer-translator.js` on the droplet against a hand-built history; `getReferrerDetails` is the whole decision. Portal signups are invisible to PostHog (Portal is a cross-document iframe), so Ghost admin is the only place attribution shows.

## Deploy

Pushing to `main` deploys automatically: `.github/workflows/deploy.yml` builds with bun, rsyncs `dist/` to the droplet, deploys `server/ghost-redirects.conf`, and reloads nginx. There is no manual deploy script (deploy.sh was removed 2026-06-10 after a local deploy and a CI deploy raced and silently overwrote each other). To ship: merge to `main`, push, and watch with `gh run list` / `gh run watch`.

- **Repo Actions secrets**: `SSH_PRIVATE_KEY` (droplet deploy key) and `GHOST_CONTENT_API_KEY` (Ghost Content API, read-only/public by design).
- The build **fails hard** if `GHOST_CONTENT_API_KEY` is unset (`src/lib/ghost.ts`) — local builds need it in `.env` (gitignored). Before 2026-06-10 a missing key silently shipped a homepage without the newsletter section.
- The homepage newsletter section renders at build time and re-fetches client-side from the Content API, so new Ghost posts appear without a redeploy.

## Commands

- `bun run dev` — local dev server (`bun run dev -- --host 0.0.0.0` to reach it over Tailscale; allowed hostnames are in `astro.config.mjs` `vite.server.allowedHosts`)
- `bun run build` — production build to `dist/`
- `SHOW_PENDING=1` before either command reveals gated client names and testimonials on `/work` (never set in CI)

## Repo skills (`.claude/skills/`)

- `droplet-operations` — the full server runbook (see Server operations above)
- `search-console` — Google Search Console auth setup and API recipes for `sc-domain:saadiq.xyz`
