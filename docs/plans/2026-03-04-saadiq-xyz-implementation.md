# saadiq.xyz Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the saadiq.xyz homepage (Astro 5) and integrate Ghost blog under /newsletter, all on the existing DO droplet.

**Architecture:** Astro 5 static site served by nginx at root. Ghost CMS reverse-proxied under /newsletter. Old Ghost URLs 301-redirected. Ghost Content API feeds recent posts to the homepage at build time.

**Tech Stack:** Astro 5, Tailwind CSS v4, bun, Ghost Content API, nginx, Let's Encrypt (existing)

**Reference:** `docs/plans/2026-03-04-saadiq-xyz-redesign-design.md`, `mockups/direction-1-experts-desk.html`

---

## Phase 1: Astro Project Setup

### Task 1: Initialize Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`

**Step 1: Scaffold Astro project**

Run from `/Users/saadiq/dev/saadiq.xyz`:
```bash
bunx create-astro@latest . --template minimal --install --no-git
```
Select: TypeScript strict, install dependencies.

**Step 2: Add Tailwind CSS v4**

```bash
bunx astro add tailwind
```

**Step 3: Add environment file for Ghost API**

Create `.env`:
```
GHOST_URL=https://saadiq.xyz
GHOST_CONTENT_API_KEY=d3b526d54daaa8ec308013a03c
```

Add to `.gitignore`:
```
.env
```

**Step 4: Verify dev server runs**

```bash
bun dev
```
Expected: Astro dev server at localhost:4321

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: initialize Astro 5 project with Tailwind"
```

---

### Task 2: Configure design tokens and global styles

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/layouts/BaseLayout.astro` (create if needed)

**Step 1: Create global stylesheet**

`src/styles/global.css`:
```css
@import "tailwindcss";

@theme {
  --color-bg: #0c0c0c;
  --color-bg-surface: #141414;
  --color-text: #f0ece4;
  --color-text-muted: #8a8578;
  --color-accent: #d4a843;
  --color-accent-hover: #e8bd5a;
  --color-rule: #2a2a2a;
  --font-display: "Instrument Serif", serif;
  --font-mono: "JetBrains Mono", monospace;
  --font-body: "Inter", system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
  background-color: var(--color-bg);
  color: var(--color-text);
}

body {
  font-family: var(--font-body);
  line-height: 1.6;
}

/* Noise texture overlay */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

/* Blinking cursor */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.cursor-blink {
  animation: blink 1s step-end infinite;
}

/* Section label style */
.section-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}
```

**Step 2: Create BaseLayout**

`src/layouts/BaseLayout.astro`:
```astro
---
interface Props {
  title?: string;
  description?: string;
}

const {
  title = "Saadiq Rodgers-King — AI Transformation Consulting",
  description = "I help organizations get ahead with AI. I embed with your team, work on real outcomes, and transfer the capability."
} = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://saadiq.xyz" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="canonical" href={`https://saadiq.xyz${Astro.url.pathname}`} />
</head>
<body class="bg-bg text-text antialiased">
  <slot />
</body>
</html>
```

**Step 3: Verify styles load**

Update `src/pages/index.astro` to use BaseLayout with a test heading. Check dev server.

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add design tokens, global styles, and base layout"
```

---

## Phase 2: Homepage Components

### Task 3: Navigation component

**Files:**
- Create: `src/components/Nav.astro`

**Step 1: Build Nav**

`src/components/Nav.astro` — Fixed top bar. "saadiq_" brand left (Instrument Serif). Links right in JetBrains Mono: Work, About, Newsletter. Backdrop blur on scroll. Mobile: hamburger or just brand + newsletter link.

Reference mockup: `mockups/direction-1-experts-desk.html` nav section.

Key details:
- `position: fixed`, full width, z-50
- Background transparent, gains `backdrop-blur` + slight bg opacity on scroll (small JS in a `<script>` tag)
- "saadiq_" links to `/`
- "work" links to `/#work`
- "about" links to `/about`
- "/newsletter" links to `/newsletter`

**Step 2: Add Nav to BaseLayout as a slot or directly to index**

**Step 3: Verify nav renders, scrolls, blur effect works**

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add navigation component"
```

---

### Task 4: Hero section

**Files:**
- Create: `src/components/Hero.astro`

**Step 1: Build Hero**

Content:
- Label: `// ai transformation` (section-label class)
- Headline: "Smart leaders are stuck on AI. I show them the future and build the path there." (Instrument Serif, large)
- Blinking cursor after headline
- Subtext: "You have the mandate, the tools, and the urgency. What you don't have is a picture of what success actually looks like. I do." (Inter, text-muted)
- CTA: "Book a conversation →" linking to `https://cal.com/saadiq/free-ai-consultation`

Layout: max-w-3xl, generous top padding (pt-32 or more to clear nav), large bottom padding.

**Step 2: Add to index.astro, verify**

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add hero section"
```

---

### Task 5: Stats section

**Files:**
- Create: `src/components/Stats.astro`

**Step 1: Build Stats**

Four stats in a 2x2 or 4-column grid:
- `74%` — CEOs who fear losing their jobs over AI within 2 years
- `95%` — AI pilots that fail to deliver ROI
- `80%+` — Report NO productivity gains despite 70% using AI
- `42%` — Abandoned majority of AI projects before production

Numbers large (Instrument Serif, amber accent color). Captions small (JetBrains Mono, muted).

Below: "The tools exist. The results don't. The gap is not access — it's knowing what to aim for."

Separated from hero by a thin `border-rule` line.

**Step 2: Add to index.astro, verify**

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add stats section"
```

---

### Task 6: Two Tracks section

**Files:**
- Create: `src/components/Tracks.astro`

**Step 1: Build Tracks**

Label: `// two tracks`
Two-column layout on desktop, stacked on mobile. Separated by vertical rule on desktop.

**Track A: Tech Companies — Level Up How You Work**
"Your board said 'leverage AI.' Nobody knows what that means. I embed with your product team, demonstrate what high performance actually looks like, and transfer the capability. When I leave, the pattern stays."

**Track B: Non-Tech Companies — Get More Help**
"You don't have a software team. What you want is for things to work that never worked before. I come in as your technical brain — build automations, replace manual processes, expand from there."

Track titles in Instrument Serif. Body in Inter. "Track A" / "Track B" labels in JetBrains Mono, muted.

**Step 2: Add to index.astro, verify**

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add two tracks section"
```

---

### Task 7: How I Work section

**Files:**
- Create: `src/components/HowIWork.astro`

**Step 1: Build HowIWork**

Label: `// how i work`
Three engagement models. Three-column grid on desktop, stacked on mobile. Each separated by vertical rules.

1. **Discovery** — `2-3 conversations` — "I learn where you are. I talk to your people, watch how they work, and identify the first concrete problem worth solving with AI."
2. **Sprint** — `Defined scope` — "We pick one project and deliver it with your own data. Your team sees the future. That's the unlock."
3. **Embedded** — `Ongoing` — "I work alongside your team on real outcomes. They participate, the pattern transfers, and the capability becomes theirs."

Title in Instrument Serif. Duration in JetBrains Mono, muted. Description in Inter.

**Step 2: Add to index.astro, verify**

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add how-i-work section"
```

---

### Task 8: Newsletter preview section

**Files:**
- Create: `src/lib/ghost.ts`
- Create: `src/components/NewsletterPreview.astro`

**Step 1: Create Ghost API client**

`src/lib/ghost.ts`:
```typescript
interface GhostPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  reading_time: number;
}

interface GhostResponse {
  posts: GhostPost[];
}

const GHOST_URL = import.meta.env.GHOST_URL || "https://saadiq.xyz";
const GHOST_KEY = import.meta.env.GHOST_CONTENT_API_KEY;

export async function getRecentPosts(limit = 3): Promise<GhostPost[]> {
  const url = `${GHOST_URL}/ghost/api/content/posts/?key=${GHOST_KEY}&limit=${limit}&fields=id,title,slug,excerpt,published_at,reading_time`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Ghost API error: ${res.status}`);
  const data: GhostResponse = await res.json();
  return data.posts;
}
```

**Step 2: Build NewsletterPreview component**

`src/components/NewsletterPreview.astro`:
- Label: `// latest from the newsletter`
- Calls `getRecentPosts(3)` in frontmatter
- Renders 3 posts: title (Instrument Serif, links to `/newsletter/<slug>`), excerpt (Inter, muted, truncated), date (JetBrains Mono, small)
- "Read more →" link to `/newsletter`
- Each post separated by thin horizontal rule

**Step 3: Add to index.astro, verify with dev server**

Note: In dev, this calls the live Ghost API. Posts should render.

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add newsletter preview with Ghost Content API"
```

---

### Task 9: About section (homepage)

**Files:**
- Create: `src/components/AboutSection.astro`

**Step 1: Build AboutSection**

Label: `// about`
Two-column layout: left has metadata in key-value format (JetBrains Mono), right has prose.

Left column (monospace, small):
```
name_     Saadiq Rodgers-King
location_ Brooklyn, NY
edu_      Princeton CS, MIT Sloan MBA
exp_      20+ years
```

Right column (Inter, body text):
"I've spent my career at the intersection of product, engineering, and strategy — consumer internet, fintech, Web3, enterprise SaaS. I know what high performance with these tools looks like. Not the LinkedIn version."

Link: "More about me →" linking to `/about`

**Step 2: Add to index.astro, verify**

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add about section to homepage"
```

---

### Task 10: Footer CTA and Status Bar

**Files:**
- Create: `src/components/FooterCTA.astro`
- Create: `src/components/StatusBar.astro`

**Step 1: Build FooterCTA**

Pull quote: "If you're a leader feeling the pressure of AI and you don't know how to get your organization there, I'm the person who does this work."

Two CTAs side by side:
- "Book a conversation →" (accent color, links to cal.com)
- "Read the newsletter →" (muted, links to /newsletter)

Small copyright line: "© 2026 Saadiq Rodgers-King"

**Step 2: Build StatusBar**

Fixed to bottom of viewport. JetBrains Mono, small text.
`> saadiq — available for engagement` with blinking green dot and blinking cursor.
Backdrop blur background.

**Step 3: Add both to index.astro, verify**

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add footer CTA and status bar"
```

---

### Task 11: Assemble and polish homepage

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Assemble all components in order**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Nav from "../components/Nav.astro";
import Hero from "../components/Hero.astro";
import Stats from "../components/Stats.astro";
import Tracks from "../components/Tracks.astro";
import HowIWork from "../components/HowIWork.astro";
import NewsletterPreview from "../components/NewsletterPreview.astro";
import AboutSection from "../components/AboutSection.astro";
import FooterCTA from "../components/FooterCTA.astro";
import StatusBar from "../components/StatusBar.astro";
---

<BaseLayout>
  <Nav />
  <main>
    <Hero />
    <Stats />
    <Tracks />
    <HowIWork />
    <NewsletterPreview />
    <AboutSection />
    <FooterCTA />
  </main>
  <StatusBar />
</BaseLayout>
```

**Step 2: Review spacing, section padding consistency, responsive behavior**

Each section should use consistent padding: `py-20 md:py-28` or similar. Max width container: `max-w-5xl mx-auto px-6`. Sections separated by `border-t border-rule`.

**Step 3: Test on mobile viewport**

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: assemble homepage, polish spacing and responsive"
```

---

## Phase 3: About Page

### Task 12: Build /about page

**Files:**
- Create: `src/pages/about.astro`

**Step 1: Build about page**

This is the robust, dedicated about page. Uses BaseLayout with title "About — Saadiq Rodgers-King".

Content (draw from offering doc and existing Ghost /about):
- Full name large: "Saadiq Rodgers-King" (Instrument Serif)
- Location, credentials (JetBrains Mono metadata block)
- Extended bio: Princeton CS, MIT Sloan MBA, 20+ years across consumer internet, fintech, Web3, enterprise SaaS. Career at the intersection of product, engineering, and strategy.
- What drives the work: "I know what high performance with these tools looks like — not the LinkedIn version. If you are a CEO or company leader who feels the pressure of AI transforming your industry and you don't know how to get your organization there, I'm the person who does this work."
- Photo if available (check Ghost `/content/images/` for profile photo)
- CTA: "Book a conversation →"
- Back link: "← Home"

**Step 2: Verify page renders at localhost:4321/about**

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add dedicated about page"
```

---

## Phase 4: Ghost Reconfiguration

### Task 13: Update Ghost URL to /newsletter

**Step 1: SSH into droplet and backup Ghost config**

```bash
ssh root@167.71.169.225
cp /var/www/ghost/config.production.json /var/www/ghost/config.production.json.bak
```

**Step 2: Update Ghost URL**

Edit `/var/www/ghost/config.production.json`:
Change `"url": "https://saadiq.xyz"` to `"url": "https://saadiq.xyz/newsletter"`

**Step 3: Restart Ghost**

```bash
cd /var/www/ghost && ghost restart
```

**Step 4: Verify Ghost is running**

```bash
curl -s http://127.0.0.1:2368/newsletter/ | head -20
```

Expected: Ghost homepage HTML with /newsletter prefix in all links.

---

### Task 14: Restyle Ghost theme to match "Expert's Desk"

**Files:**
- Modify: Ghost theme in `/Users/saadiq/dev/journal/`

This is a separate workstream. Fork the existing journal theme and restyle:
- Dark background (#0c0c0c)
- Same font stack (Instrument Serif, JetBrains Mono, Inter)
- Same color palette (warm off-white text, amber accent)
- Update `default.hbs` nav to include link back to main site ("← saadiq.xyz")
- Keep Ghost portal, search, membership features

Key files to modify:
- `assets/css/screen.css` — override colors, fonts, backgrounds
- `default.hbs` — update nav, add Google Fonts link, add link to main site
- `index.hbs` — adjust to match dark aesthetic
- `post.hbs` — dark reading experience
- `package.json` — update theme name

After styling: `bun run zip` and upload via Ghost Admin or `ghost theme:upload`.

**Note:** This is the most design-intensive task. Reference the mockup extensively. The newsletter should feel like a seamless part of saadiq.xyz, not a separate site.

**Commit theme changes:**
```bash
cd /Users/saadiq/dev/journal && git add -A && git commit -m "feat: restyle journal theme to Expert's Desk dark aesthetic"
```

---

## Phase 5: nginx and Deployment

### Task 15: Build Astro site and deploy to droplet

**Step 1: Build**

```bash
cd /Users/saadiq/dev/saadiq.xyz && bun run build
```

Expected: Static files in `dist/`

**Step 2: Create web root on droplet**

```bash
ssh root@167.71.169.225 "mkdir -p /var/www/saadiq.xyz"
```

**Step 3: Deploy static files**

```bash
scp -r dist/* root@167.71.169.225:/var/www/saadiq.xyz/
```

---

### Task 16: Update nginx configuration

**Step 1: Backup current nginx config**

```bash
ssh root@167.71.169.225 "cp /etc/nginx/sites-enabled/saadiq.xyz.conf /etc/nginx/sites-enabled/saadiq.xyz.conf.bak"
```

**Step 2: Write new nginx config**

Replace the main `server` block (port 443) in `/etc/nginx/sites-enabled/saadiq.xyz.conf`:

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name saadiq.xyz;

    ssl_certificate /etc/letsencrypt/live/saadiq.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/saadiq.xyz/privkey.pem;
    include /etc/nginx/snippets/ssl-params.conf;

    root /var/www/saadiq.xyz;
    index index.html;

    # --- Ghost under /newsletter ---
    location /newsletter {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $http_host;
        proxy_pass http://127.0.0.1:2368;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
    }

    # Ghost content (images, themes, etc.) — still served by Ghost
    location /content {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $http_host;
        proxy_pass http://127.0.0.1:2368;
    }

    # Ghost admin
    location /ghost {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $http_host;
        proxy_pass http://127.0.0.1:2368;
    }

    # Ghost ActivityPub
    location ~ /.ghost/activitypub/* {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $http_host;
        proxy_ssl_server_name on;
        proxy_pass https://ap.ghost.org;
    }

    location ~ /.well-known/(webfinger|nodeinfo) {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $http_host;
        proxy_ssl_server_name on;
        proxy_pass https://ap.ghost.org;
    }

    # --- 301 Redirects for old Ghost post slugs ---
    location = /about/ { return 301 /about; }
    location = /rss/ { return 301 /newsletter/rss/; }
    location = /page/2/ { return 301 /newsletter/page/2/; }
    location /tag/ { return 301 /newsletter$request_uri; }
    location /author/ { return 301 /newsletter$request_uri; }

    # Catch-all for old post slugs: if not a file in Astro, redirect to newsletter
    # This uses try_files to check Astro first, then redirect
    location / {
        try_files $uri $uri/ $uri.html @ghost_redirect;
    }

    location @ghost_redirect {
        return 301 /newsletter$request_uri;
    }

    client_max_body_size 1g;
}
```

**Step 3: Test and reload nginx**

```bash
ssh root@167.71.169.225 "nginx -t && systemctl reload nginx"
```

Expected: `syntax is ok`, `test is successful`

**Step 4: Verify routing**

- `curl -sI https://saadiq.xyz/` — should serve Astro homepage
- `curl -sI https://saadiq.xyz/about` — should serve Astro about page
- `curl -sI https://saadiq.xyz/newsletter` — should proxy to Ghost
- `curl -sI https://saadiq.xyz/your-team-has-the-tools-but-nothing-has-changed/` — should 301 to /newsletter/...

---

## Phase 6: Final Verification

### Task 17: End-to-end testing

**Step 1: Test all pages**

- Homepage loads, all sections render
- About page loads
- Newsletter loads Ghost content
- Newsletter posts are readable
- Ghost admin accessible at /ghost
- Old post URLs redirect correctly
- Ghost images load (via /content proxy)
- Mobile responsive check
- CTA links work (cal.com booking)

**Step 2: Test SEO**

- Check `<title>` tags on all pages
- Check Open Graph meta
- Check canonical URLs
- Verify /about returns 200 (not redirect) for Google ranking preservation

**Step 3: Test Ghost newsletter features**

- Can send test newsletter from Ghost admin
- Signup/subscribe still works
- Portal overlay functions

**Step 4: Commit any final fixes**

---

## Deployment Script (for ongoing deploys)

Create `deploy.sh` at project root:

```bash
#!/bin/bash
set -e
echo "Building..."
bun run build
echo "Deploying to droplet..."
scp -r dist/* root@167.71.169.225:/var/www/saadiq.xyz/
echo "Done. Site live at https://saadiq.xyz"
```

```bash
chmod +x deploy.sh
git add deploy.sh && git commit -m "feat: add deployment script"
```

---

## Task Summary

| # | Task | Phase |
|---|------|-------|
| 1 | Initialize Astro project | Setup |
| 2 | Design tokens + global styles + BaseLayout | Setup |
| 3 | Navigation component | Homepage |
| 4 | Hero section | Homepage |
| 5 | Stats section | Homepage |
| 6 | Two Tracks section | Homepage |
| 7 | How I Work section | Homepage |
| 8 | Newsletter preview (Ghost API) | Homepage |
| 9 | About section (homepage) | Homepage |
| 10 | Footer CTA + Status Bar | Homepage |
| 11 | Assemble + polish homepage | Homepage |
| 12 | Build /about page | About |
| 13 | Update Ghost URL to /newsletter | Ghost |
| 14 | Restyle Ghost theme | Ghost |
| 15 | Build + deploy Astro to droplet | Deploy |
| 16 | Update nginx configuration | Deploy |
| 17 | End-to-end testing | Verify |
