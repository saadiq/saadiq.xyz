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

## Tech stack

- Astro (static output)
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Fonts: Instrument Serif, JetBrains Mono, Inter

## Color tokens (in `src/styles/global.css`)

Three ground planes and three text tiers. Neutrals are warmed off pure grey so the ground sits in the same light as the type.

| Token | Value | Notes |
|---|---|---|
| `bg` | `#0b0a09` | Page ground |
| `bg-surface` | `#131110` | Alternating section plane |
| `bg-raise` | `#1c1917` | Quotes, tables, code |
| `text` | `#f2eee6` | Display and headings (17.1:1 on bg) |
| `text-body` | `#cfc5b8` | **All running prose** (11.6:1 on bg) |
| `text-muted` | `#ab9d91` | Metadata only (7.5:1 AAA on bg) |
| `accent` | `#d4a843` | Gold accent (8.9:1 on bg) |
| `accent-hover` | `#e8bd5a` | Hover state |
| `rule` | `#2f2926` | Decorative borders |

**The tier split is load-bearing.** `text-muted` means *metadata* — `font-mono` captions, sources, timestamps, link rest-states, input placeholders. Running prose uses `text-body`. Putting prose back on `text-muted` is what made the site read flat and grey before 2026-08-15.

Every tier clears AAA on `bg` and `bg-surface`. The one exception is `text-muted` on `bg-raise` at 6.63:1 (AA, not AAA), which is a deliberate trade: darkening `bg-raise` far enough to reach 7:1 collapses its separation from `bg-surface` to 1.03:1 and the plane stops reading.

Sections alternate planes rather than being separated by hairlines. On the homepage, Stats / Tracks / NewsletterPreview sit on `bg-surface`; Hero / WhyNotThem / ServicesTeaser / About stay on `bg`. Those sections carry no `border-t` — the plane change *is* the boundary. `FooterCTA` keeps its rule because it follows ground-plane content and is shared with all four subpages.

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
- The newsletter signup forms (homepage + FooterCTA) POST to the Ghost Members API under `/newsletter/members/api/` (integrity token, then send-magic-link — no keys). They only work where nginx serves Ghost on the same origin, so on localhost dev the form errors and shows a fallback link to `/newsletter`. Successful signups fire a `newsletter_signup` PostHog event.

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
