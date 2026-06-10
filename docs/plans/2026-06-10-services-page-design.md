# Services Page Design

**Date:** 2026-06-10
**Status:** Approved
**Decisions (Saadiq, 2026-06-10):** dedicated `/services` page plus homepage teaser; no prices anywhere; fully anonymous proof points (no client names); all five services.

## What this is

A `/services` page articulating the five engagement shapes, derived from a multi-agent evidence sweep over the vault (six months of meeting notes, all project folders, the Business area CRM, positioning docs), with every proof point adversarially verified against the Trust Artifacts canon. This closes a known gap. The 2026-03-04 redesign planned a "How I Work" section that never shipped, and `defaultJsonLd` already claims an OfferCatalog that no visible page details.

## The five services

Public lineup, mapped to the internal services-menu grid (talk/teach/build x augmentation/automation):

1. **Talks and executive briefings** (Talk/Augmentation). Live-demo sessions for leadership teams and product orgs; written executive briefs standalone.
2. **Executive AI advisory** (advisory retainer). Standing weekly session for CEOs/CPOs on decisions they can't delegate, plus research briefs between sessions.
3. **AI discovery sprint** (Teach/Automation). 1-2 weeks inside the real stack, working prototype with the team in the room, phased build estimate. Fixed fee.
4. **Agent and automation builds** (Build/Automation). Production agents with human review designed in, milestone billed, knowledge transfer at handoff.
5. **Embedded technical leadership** (Build convergence). Weekly cadence as de facto technical lead for founder-led companies; starts with one scoped win.

Deliberately excluded from the public lineup (insufficient delivered evidence or off-strategy): standalone cohort training (Teladoc SOW unsigned as of 6/10), 1:1 individual coaching, partner-channel dev work, LLM-visibility consulting as a named service, free scoping memos.

## Proof-point constraints (from verification)

Every proof sentence on the page must stay inside these lines:

- No client names anywhere. Anonymize by descriptive shape ("a global research firm", "a Fortune 500 company", "a database company", "a 70-million-member advocacy organization", "a hospitality company", "a product team").
- No industry tag on the Fortune 500 CEO engagement ("healthcare" narrows it too far) and no reference to the Kantar executive's new title, which is not yet public. Anonymize him as "a senior technology leader".
- No mention of the private-equity restructuring; that is the client's business. Describe the mandate instead: a company-wide rework of how the business operates and delivers its services.
- No confidential verbatim quotes, even anonymized.
- FFiH panel and the client-summit panel are the same single event; Saadiq moderated. Do not present as a demo talk or double-count.
- Molina: sessions 1-4 delivered is claimable; "co-pilot agents" expansion is an unscoped future call, not claimable.
- TigerData: claim the verified arc only (0% mention rate diagnosed across seven models, blog invisible to AI crawlers, 90-day roadmap, follow-on work). Never claim "0% to 50%+".
- Lanyard email triage: never cite "99% accuracy" (traces to an unverified internal draft). Voice agent live in production and the 8-12 hours per request figure are verified. Replatform live. Admin platform and Sarah email phase 2 are in-flight, not claimable as shipped.
- Avaaz: built and accepted is claimable; "17 languages" and "in production at the client" are not.
- BookPortal (Our Kids Read) is not AI-meaty; do not use as an agent-build proof.
- Takes: three weeks embedded, prototype iteration weeks to ~3 hours, verified and claimable (anonymized as "a product team").
- Lanyard founder upskilling (own dev environment, merges own PRs) verified and claimable.

## Page structure

`src/pages/services/index.astro`, mirroring `/about`:

- BaseLayout: title, description, `ogImage="/services/og.png"`, `jsonLd={[websiteJsonLd, servicesJsonLd, servicesBreadcrumbJsonLd]}`.
- Header (pt-40 md:pt-48): section-label `// services`, h1 "How I work", lede with the positioning pair ("I get product and engineering teams actually using AI. For companies without those teams, I build the systems and stay until they run without me."), one path sentence (talk seeds, sprint proves, build ships; trust compounds and the work expands).
- Five service rows in WhyNotThem's two-column grid pattern (`grid md:grid-cols-2 gap-4 md:gap-16`, `border-b border-rule` dividers). Left column carries the h2 (font-display text-2xl md:text-3xl) and mono `format_` metadata lines. Right column carries who-it's-for, what-you-get, and a `proof_` mono label with 1-2 anonymous verified proof sentences (text-sm text-text-muted).
- FooterCTA + StatusBar reused as-is.

Supporting changes:

- `src/pages/services/og.png.ts` via the existing `ogEndpoint` factory (label `// services`).
- `src/lib/schema.ts`: `servicesJsonLd` (ProfessionalService with a five-offer OfferCatalog at `https://saadiq.xyz/services`, consistent with `defaultJsonLd`) and `servicesBreadcrumbJsonLd`.
- `src/components/ServicesTeaser.astro`: homepage section between Tracks and NewsletterPreview, section-label `// services`, one heading + sentence, mono "How I work →" link to `/services`.
- `src/components/Nav.astro`: add `services` link between `work` and `about`.
- `public/llms.txt`: add the Services page to the Pages list.
- Sitemap: automatic, no change.

## Copy rules

Vault writing rules apply in full. No em-dashes, no colon setup/payoff, no filler, no metadiscourse, no aphoristic kickers, at most one real "X, not Y" contrast on the page, claims landed in short declaratives, peer register. Analytics attributes follow the existing PostHog data-attribute pattern (`nav_click`, `cta_book_consultation`, plus `cta_services` for the teaser link).

## Out of scope

Pricing display (revisit if posture changes), client naming (revisit as written consents land: Lanyard SOW publicity clause, Kantar NDA, Molina), a separate /speaking page (April coaching action item, separate effort), cohort enablement (add if/when Teladoc signs and delivers).
