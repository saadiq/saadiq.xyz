# saadiq.xyz

Personal website for Saadiq Rodgers-King — AI transformation consulting.

## Architecture

This is an **Astro static site** served at `https://saadiq.xyz`. It shares a Digital Ocean droplet (`167.71.169.225`) with a Ghost blog.

### How the server is laid out

- **Droplet**: `167.71.169.225` (SSH as `saadiq`, root login disabled)
- **Nginx config**: `/etc/nginx/sites-enabled/saadiq.xyz.conf`
- **Static site files**: `/var/www/saadiq.xyz/` (this repo's `dist/` output)
- **Ghost blog**: runs on `127.0.0.1:2368`, served at `/newsletter`
- **Ghost themes**: `/var/www/ghost/content/themes/` (active theme: `journal-dark`)
- **Ghost admin**: `https://saadiq.xyz/newsletter/ghost/`

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
