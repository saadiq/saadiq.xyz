# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: CEOs, CPOs, and senior leaders of tech companies whose product and engineering teams have AI licenses and mandates but no results, evaluating whether Saadiq can get their teams actually using AI. This is the current strategic priority (confirmed 2026-08-14).

Secondary: leaders of non-tech companies (founder-led or enterprise) without product/engineering teams, where Saadiq builds the systems and stays until they run without him.

Visitors arrive in two readiness states, and the site serves both: ready buyers who should book a conversation, and not-yet-ready leaders who should join the newsletter.

## Product Purpose

Personal site for Saadiq Rodgers-King's AI transformation consulting practice at https://saadiq.xyz. It communicates who Saadiq is, what he does, who it's for, and his ongoing thinking (newsletter). Success is dual, by audience: a booked conversation for ready buyers, a newsletter signup for everyone else. Neither is subordinate; the surface routes each visitor to the conversion that fits their readiness.

## Positioning

"Smart leaders are stuck on AI. I get their teams unstuck." Hands-on practitioner, not slideware: he demonstrates live, embeds in the client's real meetings, people, stack, and processes, and builds production systems with knowledge transfer designed in. The two-track claim (level up teams that exist; build and stay where they don't) is the position a neighboring consultant could not truthfully copy.

Five public engagement shapes (detailed in `docs/plans/2026-06-10-services-page-design.md`): talks and executive briefings, executive AI advisory, AI discovery sprint, agent and automation builds, embedded technical leadership.

Speaking is both a lead engine and credibility proof (confirmed 2026-08-14): talks and briefings are a real top-of-funnel channel the site should sell, and the speaking record doubles as evidence of authority.

## Operating Context

- Astro static site sharing an origin with a self-hosted Ghost blog at `/newsletter`; newsletter forms POST to the Ghost Members API on the same origin (they error on localhost by design).
- Deploys automatically on push to `main` via GitHub Actions; never builds on the server.
- Analytics via PostHog (project 292099); CTAs carry `data-ph-capture` attributes (`cta_book_consultation`, `nav_click`, `cta_services`, `newsletter_signup`).
- Booking goes to an external scheduling URL (`BOOKING_URL` in `src/lib/constants.ts`).

## Capabilities and Constraints

- **Proof gating is a hard constraint.** Per-claim proof limits live in `docs/plans/2026-06-10-services-page-design.md`; read it before writing or editing any proof copy. Client names and testimonials are gated by flags in `src/lib/work-data.ts` (`nameCleared` / `cleared`) and ship anonymized until a written release lands. Preview with `SHOW_PENDING=1`, never in CI.
- **No prices anywhere on the site.**
- Never de-risk through size language: don't call the work, entry point, or practice "small" (Saadiq, 2026-06-10).
- No invented testimonials, stats, clients, or claims; state absences rather than fabricate.
- Newsletter section renders at build time and re-fetches client-side, so new Ghost posts appear without redeploy; build fails hard without `GHOST_CONTENT_API_KEY`.

## Brand Commitments

- Name: Saadiq Rodgers-King; brand mark "saadiq_"; Brooklyn, NY; Princeton CS, MIT Sloan MBA, 20+ years.
- Voice: vault writing rules apply to all site prose. No em-dashes, no colon setup/payoff, no filler, no metadiscourse, no aphoristic kickers, at most one "X, not Y" contrast per page, short declaratives, peer register. Internal-doc aphorisms stay internal.
- Incumbent visual identity ("The Expert's Desk"): dark, editorial, confident; terminal energy without being a literal terminal. Color tokens in `src/styles/global.css` (documented in CLAUDE.md); fonts Instrument Serif / JetBrains Mono / Inter; `//` section labels, blinking cursor, fixed status bar. Shared color system with the Ghost theme `journal-dark` (`~/dev/journal`); keep tokens in sync across both repos.

## Evidence on Hand

- Case studies and testimonials in `src/lib/work-data.ts` (anonymized until cleared; naming gates per client documented there and in CLAUDE.md).
- Speaking record in `src/lib/speaking-data.ts`.
- Verified proof arcs and their exact claimable boundaries in `docs/plans/2026-06-10-services-page-design.md` (e.g. Takes prototype iteration weeks to ~3 hours; Lanyard voice agent live in production, 8-12 hours per request; TigerData 0% mention rate diagnosed, never "0% to 50%+").
- Live newsletter archive at `/newsletter` via Ghost Content API.

## Product Principles

1. Route by readiness: every surface gives a ready buyer a path to book and everyone else a path to subscribe, without forcing one conversion on both.
2. Proof over promise: only verified, release-cleared claims ship; anonymize by descriptive shape rather than weaken or invent.
3. Practitioner register: the site sounds like someone who does the work, in peer voice, never marketing filler.
4. Tech-company leaders first: when a tradeoff forces a choice, the surface speaks to product/engineering org leaders before the no-tech-team track.
5. The newsletter is live thinking: keep the Ghost integration first-class so the site always shows current work without a redeploy.
