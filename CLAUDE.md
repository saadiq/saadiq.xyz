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
- **The DigitalOcean web console needs the login user changed to `saadiq`.** It defaults to `root`, which sshd refuses, so it fails silently. It also rides public port 22, as do CI deploys, so don't close 22 without replacing both.
- **Check `/var/run/reboot-required` on every visit.** `unattended-upgrades` installs kernel and glibc fixes but cannot reboot, so they sit inactive until someone restarts the box.

## Related repo

- **Ghost theme** (`journal-field-notes`, branch `field-notes`): `~/dev/journal`
- **Social and newsletter cards** (Puppeteer-rendered HTML): `~/dev/cards` (`git@github.com:saadiq/cards.git`, private). Lived in `cards/` here until 2026-10-16. The cards hand-copy this site's tokens and nothing here imports from them; their `CLAUDE.md` says where to read the canonical values from.
- The two do **not** share a palette, and syncing tokens between them is not the goal. The site is dark (`bg #0b0a09`); Field Notes is deliberately light (`--bg #f6f6f4`) because an archive is read, not scanned. What they share is a *vocabulary*: the Saadiq Industries mark (the theme copies the SVG into `partials/icons/mark.hbs`, so recopy it if the mark changes), Inter Tight display over Inter body, JetBrains Mono for metadata, and the gold `#d4a843` (the site's `accent`, the theme's `--accent-bright`). Keep that vocabulary in sync; let the grounds differ. Field Notes dropped its terminal motifs and Instrument Serif on 2026-11-26 to match the site.
- Field Notes darkens the accent to `#a47018` for its own body copy because `#d4a843` fails contrast on a light ground. That's correct, not drift.

## Design system

Color tokens, the Saadiq Industries identity, and the section-label rules live in `src/CLAUDE.md`, which loads when working under `src/`. Read it before any visual or layout change.

## Homepage message

The homepage is written for warm leads (referrals, LinkedIn), not strangers, so it does not argue that the problem exists. Cut on 2026-10-21 from ~1,100 words and 8 sections to ~460 and 6. The spine is one line: I help CEOs get fluent on AI and set the strategy for it, then work with their product and technology teams until it's how the work gets done. (Reframed 2026-11-19 after a 2026-11-04 coaching session; the old spine was "the team has the AI tools and isn't using them," pitched at CEOs and CPOs. The buyer is now the CEO alone.) The short form, for OG cards, Field Notes and anywhere one clause has to carry it, is **"I help CEOs lead their companies through AI."** (2026-11-26). Don't shorten the spine to "get fluent on AI and set the strategy for it"; that clause reads awkwardly on its own. **Competitors are context, not the pitch.** Everything sits in the frame of running a successful business; don't sell with the competitor bogeyman. **Sell the expertise, not the hours.** Building is what makes the advice credible, and builds do happen, but the highest-leverage engagement is advisory. Copy frames building as proof and as an option, never as the main thing to hire me for (no "then I build it for you"). Sections, in order: hero, Case studies (first-party proof: situation, work, result, tagged by who was advised; copy in `work-data.ts` under `home`), (Why it sticks was cut 2026-11-25), How I work (advise, scope, build, showing the strategy-to-execution span), newsletter cards, About.

- **Third-party stats and other companies' results stay off the homepage.** The problem stats (`Stats`) and the "What changes" receipts (`Tracks`) were removed; they belong in the newsletter. Only first-party numbers earn homepage space.
- **Say each thing once.** The exits list lives in the hero credentials only. One newsletter form (the footer's). Booking CTAs in the hero and footer only.

## Content rules and proof gating

- Site prose follows the vault writing rules (no em-dashes, no colon setup/payoff, no filler, no aphoristic kickers). Per-claim proof constraints — what is and isn't claimable about each engagement — live in `docs/plans/2026-06-10-services-page-design.md`; read it before writing or editing any proof copy. No prices anywhere on the site.
- `/work` case-study names and testimonials are gated in `src/lib/work-data.ts`. Everything ships anonymized until a written release lands; then flip that entry's `nameCleared` (case studies) or `cleared` (testimonials) flag. Lanyard and Our Kids Read are named (cleared by Saadiq 2026-11-25). Still gated: Kantar has a signed NDA, Molina needs explicit permission. Preview all names/testimonials locally with `SHOW_PENDING=1 bun run dev`. The build fails if an uncleared study's copy names its client, because `displayName()` only gates the heading; un-clearing a name means rewriting its prose too.
- The newsletter signup form (`FooterCTA`, on every page; the homepage's own form was removed 2026-10-21) POSTs to the Ghost Members API under `/newsletter/members/api/` (integrity token, then send-magic-link — no keys). It only works where nginx serves Ghost on the same origin, so on localhost dev the form errors and shows a fallback link to `/newsletter`. Successful signups fire a `newsletter_signup` PostHog event, and send `urlHistory` so Ghost can attribute the member (see below).

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
