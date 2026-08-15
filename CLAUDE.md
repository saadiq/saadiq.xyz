# saadiq.xyz

Personal website for Saadiq Rodgers-King — AI transformation consulting.

## Architecture

This is an **Astro static site** served at `https://saadiq.xyz`. It shares a Digital Ocean droplet (`167.71.169.225`) with a Ghost blog.

### How the server is laid out

- **Droplet**: `167.71.169.225` (SSH as `saadiq`, root login disabled)
- **Nginx config**: `/etc/nginx/sites-enabled/saadiq.xyz.conf`
- **Static site files**: `/var/www/saadiq.xyz/` (this repo's `dist/` output)
- **Ghost blog**: runs on `127.0.0.1:2368`, served at `/newsletter`
- **Ghost users**: `ghost-mgr` (UID 1000) owns the install and is the user for `ghost` CLI commands; `ghost` (UID 998) is the Node process user only. Run cli as: `cd /var/www/ghost && sudo -u ghost-mgr ghost <cmd>`. Running ghost-cli as `ghost` shows "No installed ghost instances found".
- **Ghost systemd unit**: `ghost_167-71-169-225.service` — use `sudo systemctl restart ghost_167-71-169-225.service` to apply config changes
- **Ghost themes**: `/var/www/ghost/content/themes/` (active theme: `journal-dark`)
- **Ghost admin**: `https://saadiq.xyz/newsletter/ghost/`
- **Ghost mail config**: `/var/www/ghost/config.production.json` → `mail.from` sets the display name on **admin notification emails** (e.g. new free signup). Distinct from Site Title (general settings) and per-newsletter Sender Name. Restart Ghost after editing.

### Ghost upgrades

Stop Ghost before running `ghost update`. Running both at once OOM'd the droplet on 2026-05-13 (Ghost 6.32.0 → 6.38.0 attempt) — ghost-cli's pre-flight filesystem walk over `content/` combined with the running Ghost process exhausted memory and required a `doctl compute droplet-action power-cycle` to recover. Procedure:

**Swap backstop**: a 2G swapfile (`/swapfile`, fstab `/swapfile none swap sw 0 0`, default swappiness 60) was added 2026-05-13 right after that OOM. It gave the headroom that let the 6.38.0 → 6.44.1 upgrade run cleanly on 2026-06-07 (peak ~1.2Gi free + swap mostly idle), and 6.44.1 → 6.52.1 on 2026-07-11 (same profile: ~1.3Gi available with Ghost stopped, swap idle). The droplet only has 1.9Gi RAM, so the swap is the safety net — but **stopping Ghost first is still the primary safeguard**, not something the swap lets you skip. Verify with `swapon --show`; if it's ever missing, recreate before upgrading.

```bash
cd /var/www/ghost
sudo -u ghost-mgr ghost stop

# run the update DETACHED so a dropped SSH session can't kill it mid-flight
setsid nohup sudo -u ghost-mgr ghost update <version> </dev/null > /tmp/ghost-update.log 2>&1 &   # pin explicitly
# poll: pgrep -f "gho[s]t update"  (bracket avoids the pattern matching your own shell)

sudo -u ghost-mgr ghost start   # MANDATORY — see below
```

**`ghost update` does NOT restart Ghost if you stopped it first.** Confirmed 2026-07-11. Since stopping first is required, the explicit `ghost start` is a **mandatory step, not a verification step** — skip it and Ghost stays down, nginx proxies to a dead upstream, and `/newsletter` 502s while the static Astro site keeps serving fine (so the site *looks* healthy). Always finish with `ghost start` and confirm `systemctl is-active ghost_167-71-169-225.service`.

**Pin the version, don't take same-day releases.** Pass the version explicitly (`ghost update 6.52.1`). Let a release age a few days first — same reasoning as the ghost-cli pin below. The pnpm `minimum-release-age` cooldown does *not* protect you here, since `ghost update` is a frozen lockfile install.

**Automation notes**: `saadiq` has **passwordless sudo to `ghost-mgr`**, so the whole upgrade is drivable over non-interactive SSH (`sudo -n -u ghost-mgr true` to confirm). Stopping Ghost first frees its ~900MB, which is what gives the native-module compiles headroom.

Fix any pre-flight permission errors (e.g. theme files needing `chmod 664`) before retrying — ghost-cli prints the exact `find ... -exec chmod` command to run.

**Verify after upgrading** (systemd `active` is not enough — check it actually serves):

```bash
curl -s https://saadiq.xyz/newsletter/ | grep -o '<meta name="generator" content="[^"]*"'   # running version
curl -so /dev/null -w '%{http_code}\n' https://saadiq.xyz/newsletter/                        # expect 200
```

### npm supply-chain hardening

The box pulls from the npm registry in only two spots, so the surface is narrow — but kept deliberately conservative given the 2026 self-propagating worm wave (Shai-Hulud/Miasma; "Phantom Gyp" executes via `binding.gyp` during native builds, so blanket `ignore-scripts` is *not* a fix — and Ghost needs those builds: sqlite3, sharp, re2, dtrace-provider compile during every `ghost update`).

- **Ghost's own deps** install via `pnpm` against a committed `pnpm-lock.yaml` (versions pinned; corepack provisions the pnpm version from Ghost's `packageManager` field). Lowest-risk path.
- **pnpm cooldown**: `/home/ghost-mgr/.npmrc` sets `minimum-release-age=1440` (24h) — pnpm refuses any version published <24h ago, blunting fast worm publishes. Harmless to the frozen `ghost update` install; protects ad-hoc/non-frozen resolution. Key must be **kebab-case** (`minimum-release-age`); camelCase is silently ignored. Tune the minutes or comment it out if a legit fresh dep is ever blocked.
- **ghost-cli updates**: do **not** use `@latest`. Pin a specific, already-published-for-a-few-days version and run as root only when deliberately updating:
  ```bash
  npm install -g ghost-cli@1.29.3   # pin the version; let a new release age a few days first
  ```
- **npm itself** is pinned-bumped the same way (`npm install -g npm@<ver>`), currently 11.16.0.
- The **Astro site never builds on the droplet** — the server just receives static `dist/` over rsync. Builds run in GitHub Actions on every push to `main` (and on the dev machine for local work), so that supply chain lives in CI and the dev machine. The droplet's SSH deploy key exists in **two** places: the dev machine and the repo's `SSH_PRIVATE_KEY` Actions secret — GitHub repo/secrets access is a crown jewel accordingly.

### Routing (nginx)

- `https://saadiq.xyz/*` — serves Astro static files from `/var/www/saadiq.xyz/`
- `https://saadiq.xyz/newsletter/*` — proxies to Ghost
- `/content`, `/members` — rewritten to `/newsletter/` prefix and proxied to Ghost
- Unknown paths fall through to Ghost via `@ghost_redirect`

#### Never hand-edit the live conf in place; the include is `*.conf`-scoped

**Edit nginx configs via a backup location *outside* the include dir — never with `sed -i.bak …` on a file inside `sites-enabled/`.** `sed -i.SUFFIX` writes its backup *next to* the edited file, so editing `sites-enabled/saadiq.xyz.conf` in place drops `saadiq.xyz.conf.bak.<date>` right into the include dir, where nginx loads it as live config.

This caused two outages. Both Apr 4 and Apr 13 ActivityPub edits were done in place (`sed -i.bak.$(date +%Y%m%d%H%M%S)`), leaving two `.bak` files in `sites-enabled/` that still contained the *old* bare `proxy_pass https://ap.ghost.org;` (resolves DNS at config-parse time). On **2026-06-10** a routine acme.sh/certbot reload hit a transient DNS hiccup → `[emerg] host not found in upstream "ap.ghost.org"` → `nginx -t` failed → nginx **stopped and stayed down** (ports 80/443 refused; SSH/ping fine, so the droplet *looked* up). Same failure had already happened **2026-04-10**.

**Hardened 2026-06-10:** the include is now `include /etc/nginx/sites-enabled/*.conf;` (was `/*`), so any stray `.bak`/`.save`/`.orig`/swapfile in that dir is ignored and can't break `nginx -t`. Old backups live in `/etc/nginx/disabled-backups/`. Recovery if it ever recurs (move non-conf cruft out, retest, start):

```bash
sudo mv /etc/nginx/sites-enabled/*.bak.* /etc/nginx/disabled-backups/ 2>/dev/null
sudo nginx -t && sudo systemctl start nginx
```

The **active** `saadiq.xyz.conf` does the ActivityPub proxy right — `resolver 127.0.0.53 valid=300s;` + `set $ap_ghost https://ap.ghost.org; proxy_pass $ap_ghost;`. A variable in `proxy_pass` defers DNS to request-time via the resolver, so a momentary DNS failure can't break `nginx -t`. Keep that pattern; never reintroduce a bare `proxy_pass https://ap.ghost.org;`.

## Related repo

- **Ghost theme** (`journal-dark`): `~/dev/journal`
- Both repos share a color system — keep `text-muted`, `accent`, `bg`, etc. in sync when changing colors

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

Design review that produced this system, including the changes not yet made (break the shared `max-w-5xl` container, one large accent moment per page, thin out the 17 `// section` labels, bring photography above the fold): https://claude.ai/code/artifact/219fdc26-0c51-4d53-b23f-1379a56bf049

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

## Google Search Console

GSC property: `sc-domain:saadiq.xyz` (domain-level, owned by `saadiq@gmail.com`).

**Auth setup**: Requires application-default credentials with webmasters scope:
```bash
gcloud auth application-default login --scopes=https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/cloud-platform
```
The `webmasters.readonly` scope covers all reads (URL inspection, performance, listing sitemaps). **Writes** — e.g. (re)submitting a sitemap via `PUT .../sitemaps/<url-encoded-url>` — return `403` under readonly; re-auth with the read-write scope `https://www.googleapis.com/auth/webmasters` (drop the `.readonly`) first.

**API calls** need a quota project header. Example — inspect a URL:
```bash
ACCESS_TOKEN=$(gcloud auth application-default print-access-token)
curl -s -X POST "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "x-goog-user-project: saadiq" \
  -H "Content-Type: application/json" \
  -d '{"inspectionUrl": "https://saadiq.xyz/", "siteUrl": "sc-domain:saadiq.xyz"}'
```

**List sites**: `GET https://searchconsole.googleapis.com/webmasters/v3/sites` (same auth headers)
