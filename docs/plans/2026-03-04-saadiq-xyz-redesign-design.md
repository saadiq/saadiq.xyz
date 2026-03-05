# saadiq.xyz Redesign — Design Document

Created: 2026-03-04
Status: Approved

---

## Goal

Consolidate saadiq.xyz into a single site that clearly communicates:
- Who Saadiq Rodgers-King is
- What he does (AI transformation consulting)
- Who he does it for (CEOs, CPOs, senior leaders)
- His ongoing thinking (newsletter)

## Architecture

### Stack
- **Homepage**: Astro 5 static site (bun, Tailwind CSS)
- **Newsletter/Blog**: Ghost CMS (existing, self-hosted on Digital Ocean)
- **Server**: nginx on existing DO droplet — serves Astro static files at root, reverse-proxies `/newsletter` to Ghost
- **DNS**: No change — saadiq.xyz already points at the droplet

### Routing
```
saadiq.xyz/              -> Astro static files (nginx serves from /var/www/saadiq.xyz/)
saadiq.xyz/newsletter    -> Ghost (nginx proxy_pass to localhost:2368)
saadiq.xyz/newsletter/*  -> Ghost (all Ghost routes under /newsletter prefix)
```

### Redirects (301)
Preserve SEO for existing Ghost URLs:
- `/about` -> `/#about` (or dedicated /about if needed for Google ranking)
- All existing blog post slugs -> `/newsletter/<slug>`
- `/tag/*` -> `/newsletter/tag/*`
- `/author/*` -> `/newsletter/author/*`

Ghost will need its URL config updated to use `/newsletter` as its base path.

## Design Direction: "The Expert's Desk"

### Aesthetic
Dark, editorial, confident. Terminal energy translated into web design — not a literal terminal, but the feeling of someone who lives in these tools.

### Color Palette
- Background: `#0c0c0c` (near-black)
- Text: `#f0ece4` (warm off-white)
- Muted text: `#8a8578`
- Accent: `#d4a843` (amber/gold)
- Borders/rules: `#2a2a2a`

### Typography
- Headlines: Instrument Serif (Google Fonts)
- Labels/nav/monospace: JetBrains Mono (Google Fonts)
- Body: Clean sans-serif (system or loaded)

### Signature Details
- `//` prefixed section labels in monospace
- Blinking cursor on hero headline
- Subtle noise/grain texture overlay on dark background
- Fixed bottom status bar: `> saadiq -- available for engagement`
- "saadiq_" as brand mark (top-left nav)

## Pages

### Homepage (`/`)

Sections in order:

1. **Navigation** — "saadiq_" left, section links + "/newsletter" right. Monospace. Fixed.

2. **Hero** — `// ai transformation` label. Headline: "Smart leaders are stuck on AI. I show them the future and build the path there." Subtext about mandate/urgency/vision. CTA: "Book a conversation ->"

3. **The Problem (Stats)** — Four stats in grid (74% CEOs fear job loss, 95% pilots fail, 80%+ no productivity gains, 42% abandoned projects). Caption: "The tools exist. The results don't."

4. **Two Tracks** — Track A: Tech Companies (level up). Track B: Non-Tech Companies (get more help). Two-column editorial layout.

5. **How I Work** — Discovery / Sprint / Embedded engagement models. Three-column grid.

6. **Latest from the Newsletter** — 2-3 recent posts pulled from Ghost Content API at Astro build time. Title, excerpt, date. Links to `/newsletter/<slug>`. Reinforces active thought leadership.

7. **About** — Full name "Saadiq Rodgers-King" prominent. Brooklyn, NY. Princeton CS, MIT Sloan MBA, 20+ years. "I know what high performance with these tools looks like — not the LinkedIn version."

8. **Footer CTA** — "I'm the person who does this work." Two CTAs: book a conversation + read the newsletter.

9. **Status Bar** — Fixed bottom: `> saadiq -- available for engagement` with blinking cursor.

### Newsletter (`/newsletter`)
Ghost blog with theme restyled to match the dark/monospace aesthetic. Same color palette, same fonts, same feeling. This is a Ghost theme customization (fork of the existing journal theme or a new theme built to match).

### SEO / Meta
- `<title>`: "Saadiq Rodgers-King — AI Transformation Consulting"
- Open Graph and Twitter Card meta tags
- Full name in structured data / meta description
- Canonical URLs for all pages

## Ghost Integration Details

### Content API
- Astro fetches recent posts at build time using Ghost Content API
- Ghost webhook triggers Astro rebuild on publish (or cron-based rebuild)
- API key stored as environment variable

### Ghost URL Configuration
- Ghost `url` config set to `https://saadiq.xyz/newsletter`
- All Ghost-generated links will include the `/newsletter` prefix
- Ghost admin remains accessible at its current admin URL

### Ghost Theme
- New or forked theme matching "Expert's Desk" aesthetic
- Dark background, same fonts, same color palette
- Maintains Ghost's native features: membership, comments, search

## Deployment Flow

1. Astro builds to static files (`dist/`)
2. Files deployed to `/var/www/saadiq.xyz/` on the droplet
3. nginx serves static files for root routes
4. nginx proxies `/newsletter` to Ghost
5. Ghost theme deployed separately via Ghost admin or CLI

## Open Questions (deferred)

- Exact redirect mapping: need to crawl current Ghost site for all existing URLs
- Ghost rebuild trigger: webhook vs cron vs manual
- Whether `/about` should be a standalone page (for SEO) vs a hash link to homepage section
