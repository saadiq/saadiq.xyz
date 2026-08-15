---
name: droplet-operations
description: Use when working on the Digital Ocean droplet that hosts saadiq.xyz and its Ghost blog — upgrading Ghost, bumping Node, applying OS updates or reboots, editing nginx config, or reviewing npm supply-chain posture. Covers server layout, the Ghost upgrade procedure, pending-reboot checks, and the nginx routing rules.
---

# Droplet operations

The static Astro site and the Ghost blog share one Digital Ocean droplet (`167.71.169.225`).
The safety-critical prohibitions are duplicated in the repo's root `CLAUDE.md` so they apply
even when this skill is not loaded. This file holds the full procedures.

## How the server is laid out

- **Droplet**: `167.71.169.225` (SSH as `saadiq`, root login disabled)
- **Nginx config**: `/etc/nginx/sites-enabled/saadiq.xyz.conf`
- **Static site files**: `/var/www/saadiq.xyz/` (this repo's `dist/` output)
- **Ghost blog**: runs on `127.0.0.1:2368`, served at `/newsletter`
- **Ghost users**: `ghost-mgr` (UID 1000) owns the install and is the user for `ghost` CLI commands; `ghost` (UID 998) is the Node process user only. Run cli as: `cd /var/www/ghost && sudo -u ghost-mgr ghost <cmd>`. Running ghost-cli as `ghost` shows "No installed ghost instances found".
- **Ghost systemd unit**: `ghost_167-71-169-225.service` — use `sudo systemctl restart ghost_167-71-169-225.service` to apply config changes
- **Ghost themes**: `/var/www/ghost/content/themes/` (active theme: `journal-field-notes`; `journal-dark` is a stale fallback dir)
- **Ghost admin**: `https://saadiq.xyz/newsletter/ghost/`
- **Ghost mail config**: `/var/www/ghost/config.production.json` → `mail.from` sets the display name on **admin notification emails** (e.g. new free signup). Distinct from Site Title (general settings) and per-newsletter Sender Name. Restart Ghost after editing.

## Ghost upgrades

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

**Check the Node engine requirement before starting.** `ghost update` hard-fails at the download step if Node is too old, *before* modifying anything — `Ghost v6.57.1 is not compatible with the current Node version. Your node version is 22.22.3, but Ghost v6.57.1 requires ^22.23.1` (hit 2026-08-15). Every 6.53+ release wanted `^22.23.1`, so there was no intermediate Ghost version that avoided the Node bump. Check first, and confirm the *currently installed* Ghost also accepts the new Node so a failed update still leaves a bootable install:

```bash
npm view ghost@<target> engines.node      # what the target needs
npm view ghost@<installed> engines.node   # rollback safety
sudo apt-get install -y nodejs=22.23.2-1nodesource1   # Node comes from deb.nodesource.com/node_22.x
```

A same-major Node bump (22.22 → 22.23) keeps the ABI, so Ghost's compiled native modules stay valid and no rebuild is needed.

**The NodeSource package silently removes the global npm pin.** It logs `Detected old npm client, removing` and installs its bundled npm over yours (11.16.0 → 10.9.8 on 2026-08-15). Re-pin explicitly after every Node bump — never `@latest`, since upstream npm is already on 12.x.

**Automation notes**: `saadiq` has **passwordless sudo to `ghost-mgr`**, so the whole upgrade is drivable over non-interactive SSH (`sudo -n -u ghost-mgr true` to confirm). Stopping Ghost first frees its ~900MB, which is what gives the native-module compiles headroom.

**Theme file permissions fail the pre-flight most upgrades, and will keep doing so.** Deploying `journal-field-notes` leaves its assets mode `755`, and ghost-cli refuses to run until they are `664` (four files under `assets/` on 2026-08-15). ghost-cli prints a blanket `sudo find ./ ! -path "./versions/*" -type f -exec chmod 664 {} \;` — **chmod only the files it lists instead**, because the blanket form also widens `config.production.json` (holds mail credentials) to world-readable. The real fix is upstream in whatever deploys the theme setting the exec bit.

**Verify after upgrading** (systemd `active` is not enough — check it actually serves):

```bash
curl -s https://saadiq.xyz/newsletter/ | grep -o '<meta name="generator" content="[^"]*"'   # running version
curl -so /dev/null -w '%{http_code}\n' https://saadiq.xyz/newsletter/                        # expect 200
```

## Droplet OS updates — check for a pending reboot

`unattended-upgrades` is active and keeps **security** packages current by itself, but it cannot reboot. Kernel and glibc fixes therefore install and then sit **inactive** until someone restarts the box. Nothing in this runbook used to prompt for that, which is how the droplet reached **9 weeks 6 days uptime running a kernel 13 revisions behind** what was installed (6.8.0-124 vs 6.8.0-137) on 2026-08-15. Check on every visit:

```bash
[ -f /var/run/reboot-required ] && cat /var/run/reboot-required.pkgs   # what is waiting
sudo needrestart -b | grep NEEDRESTART-K                               # KSTA 1 = current, 3 = reboot needed
apt list --upgradable                                                  # non-security -updates are NOT auto-applied
```

Before rebooting, confirm it will come back — this box previously needed a power-cycle, and a bad nginx conf is the known way to strand it: `sudo nginx -t` passes, `ls /etc/nginx/sites-enabled/` holds only `.conf` files, `systemctl is-enabled nginx mysql ghost_167-71-169-225` are all `enabled`, and `/swapfile` is still in `/etc/fstab`. With those green, `sudo systemctl reboot` took ~30s on 2026-08-15 and every service came back unattended.

Most remaining `-updates` packages are base-image cruft irrelevant to a headless droplet (qemu, plymouth, ovmf, alsa, firmware). Taking all of them via `apt-get upgrade` is fine; note that `apparmor` sets `reboot-required` again afterwards.

## npm supply-chain hardening

The box pulls from the npm registry in only two spots, so the surface is narrow — but kept deliberately conservative given the 2026 self-propagating worm wave (Shai-Hulud/Miasma; "Phantom Gyp" executes via `binding.gyp` during native builds, so blanket `ignore-scripts` is *not* a fix — and Ghost needs those builds: sqlite3, sharp, re2, dtrace-provider compile during every `ghost update`).

- **Ghost's own deps** install via `pnpm` against a committed `pnpm-lock.yaml` (versions pinned; corepack provisions the pnpm version from Ghost's `packageManager` field). Lowest-risk path.
- **pnpm cooldown**: `/home/ghost-mgr/.npmrc` sets `minimum-release-age=1440` (24h) — pnpm refuses any version published <24h ago, blunting fast worm publishes. Harmless to the frozen `ghost update` install; protects ad-hoc/non-frozen resolution. Key must be **kebab-case** (`minimum-release-age`); camelCase is silently ignored. Tune the minutes or comment it out if a legit fresh dep is ever blocked.
- **ghost-cli updates**: do **not** use `@latest`. Pin a specific, already-published-for-a-few-days version and run as root only when deliberately updating:
  ```bash
  npm install -g ghost-cli@1.30.1   # pin the version; let a new release age a few days first
  ```
  Currently **1.30.1** (installed 2026-08-15; 1.31.1 existed but was 2 days old). Worth taking once it ages: **1.31.0 fixes "nginx failing to start when ap.ghost.org is unresolvable"** — the exact failure that took the site down twice. Low urgency here, because that bug lives in ghost-cli's *generated* nginx config and `saadiq.xyz.conf` is hand-managed and already carries the resolver fix.
- **npm itself** is pinned-bumped the same way (`npm install -g npm@<ver>`), currently 11.16.0. Its `allow-scripts` gate is load-bearing: it blocked a `yarn` preinstall script during the 2026-08-15 ghost-cli install. Re-pin after any Node bump (see above).
- The **Astro site never builds on the droplet** — the server just receives static `dist/` over rsync. Builds run in GitHub Actions on every push to `main` (and on the dev machine for local work), so that supply chain lives in CI and the dev machine. The droplet's SSH deploy key exists in **two** places: the dev machine and the repo's `SSH_PRIVATE_KEY` Actions secret — GitHub repo/secrets access is a crown jewel accordingly.

## Routing (nginx)

- `https://saadiq.xyz/*` — serves Astro static files from `/var/www/saadiq.xyz/`
- `https://saadiq.xyz/newsletter/*` — proxies to Ghost
- `/content`, `/members` — rewritten to `/newsletter/` prefix and proxied to Ghost
- Unknown paths fall through to Ghost via `@ghost_redirect`

### Never hand-edit the live conf in place; the include is `*.conf`-scoped

**Edit nginx configs via a backup location *outside* the include dir — never with `sed -i.bak …` on a file inside `sites-enabled/`.** `sed -i.SUFFIX` writes its backup *next to* the edited file, so editing `sites-enabled/saadiq.xyz.conf` in place drops `saadiq.xyz.conf.bak.<date>` right into the include dir, where nginx loads it as live config.

This caused two outages. Both Apr 4 and Apr 13 ActivityPub edits were done in place (`sed -i.bak.$(date +%Y%m%d%H%M%S)`), leaving two `.bak` files in `sites-enabled/` that still contained the *old* bare `proxy_pass https://ap.ghost.org;` (resolves DNS at config-parse time). On **2026-06-10** a routine acme.sh/certbot reload hit a transient DNS hiccup → `[emerg] host not found in upstream "ap.ghost.org"` → `nginx -t` failed → nginx **stopped and stayed down** (ports 80/443 refused; SSH/ping fine, so the droplet *looked* up). Same failure had already happened **2026-04-10**.

**Hardened 2026-06-10:** the include is now `include /etc/nginx/sites-enabled/*.conf;` (was `/*`), so any stray `.bak`/`.save`/`.orig`/swapfile in that dir is ignored and can't break `nginx -t`. Old backups live in `/etc/nginx/disabled-backups/`. Recovery if it ever recurs (move non-conf cruft out, retest, start):

```bash
sudo mv /etc/nginx/sites-enabled/*.bak.* /etc/nginx/disabled-backups/ 2>/dev/null
sudo nginx -t && sudo systemctl start nginx
```

The **active** `saadiq.xyz.conf` does the ActivityPub proxy right — `resolver 127.0.0.53 valid=300s;` + `set $ap_ghost https://ap.ghost.org; proxy_pass $ap_ghost;`. A variable in `proxy_pass` defers DNS to request-time via the resolver, so a momentary DNS failure can't break `nginx -t`. Keep that pattern; never reintroduce a bare `proxy_pass https://ap.ghost.org;`.

### llms.txt discovery headers are rewritten in nginx (subdirectory workaround)

Ghost's `core/frontend/web/middleware/llms-discovery.js` **hardcodes root-relative** discovery paths — `Link: </llms.txt>` and `X-Llms-Txt: /llms.txt` — with no subdirectory awareness. Ghost lives at `/newsletter`, so the advertised path resolved to this repo's own `public/llms.txt` (the consulting index) and crawlers never reached the archive; `/llms-full.txt` at root was a 404. Since 2026-08-15 the `location /newsletter` block does `proxy_hide_header` on both headers and re-adds the corrected `/newsletter/` paths. Verified safe: those are the *only* `Link` headers Ghost emits under `/newsletter` (admin, Content API, and members endpoints send none).

**Remove the workaround once Ghost fixes this upstream** — `proxy_hide_header` would otherwise keep masking their corrected header indefinitely. Harmless while the replacement value is right, but it is a silent override.

The feature itself is the Ghost setting `llms_enabled` (**Settings → General → Meta data**, "Enable structured data for LLMs and AI search engines"). It ships **off for sites predating the 6.46 grandfather migration**, which is why it needed enabling by hand despite the code being present since 6.46. It serves `/newsletter/llms.txt`, `/newsletter/llms-full.txt`, and a `.md` variant of every post. Members-only posts are correctly gated: `.md` returns 403 and `llms-full.txt` carries title/excerpt only. `public/llms.txt` links both Ghost indexes so root-level discovery works from either entry point.
