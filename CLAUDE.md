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

```bash
cd /var/www/ghost
sudo -u ghost-mgr ghost stop
sudo -u ghost-mgr ghost update
sudo -u ghost-mgr ghost start   # `update` usually restarts, but verify
```

Fix any pre-flight permission errors (e.g. theme files needing `chmod 664`) before retrying — ghost-cli prints the exact `find ... -exec chmod` command to run.

### Routing (nginx)

- `https://saadiq.xyz/*` — serves Astro static files from `/var/www/saadiq.xyz/`
- `https://saadiq.xyz/newsletter/*` — proxies to Ghost
- `/content`, `/members` — rewritten to `/newsletter/` prefix and proxied to Ghost
- Unknown paths fall through to Ghost via `@ghost_redirect`

## Related repo

- **Ghost theme** (`journal-dark`): `~/dev/journal`
- Both repos share a color system — keep `text-muted`, `accent`, `bg`, etc. in sync when changing colors

## Tech stack

- Astro (static output)
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Fonts: Instrument Serif, JetBrains Mono, Inter

## Color tokens (in `src/styles/global.css`)

| Token | Value | Notes |
|---|---|---|
| `bg` | `#0c0c0c` | Page background |
| `bg-surface` | `#141414` | Card/elevated surfaces |
| `text` | `#f0ece4` | Primary text (16.6:1 on bg) |
| `text-muted` | `#ac9e90` | Secondary text (7.5:1 AAA on bg) |
| `accent` | `#d4a843` | Gold accent (8.8:1 on bg) |
| `accent-hover` | `#e8bd5a` | Hover state |
| `rule` | `#2a2a2a` | Decorative borders |

## Deploy

```bash
bash deploy.sh  # builds with `bun run build`, scps dist/* to server
```

## Commands

- `bun run dev` — local dev server
- `bun run build` — production build to `dist/`

## Google Search Console

GSC property: `sc-domain:saadiq.xyz` (domain-level, owned by `saadiq@gmail.com`).

**Auth setup**: Requires application-default credentials with webmasters scope:
```bash
gcloud auth application-default login --scopes=https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/cloud-platform
```

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
