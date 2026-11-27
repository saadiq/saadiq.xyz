# src/ design system

Loaded when working under `src/`. Site-wide rules (homepage message, content rules, attribution, deploy) live in the root `CLAUDE.md`.

## Color tokens (in `src/styles/global.css`)

Three ground planes and three text tiers. Neutrals are warmed off pure grey so the ground sits in the same light as the type.

| Token | Value | Notes |
|---|---|---|
| `bg` | `#0b0a09` | Page ground |
| `bg-surface` | `#131110` | Unused since 2026-09-23 (was the alternating section plane) |
| `bg-raise` | `#1c1917` | Quotes, tables, code |
| `text` | `#f2eee6` | Display and headings (17.1:1 on bg) |
| `text-body` | `#cfc5b8` | **All running prose** (11.6:1 on bg) |
| `text-muted` | `#ab9d91` | Metadata only (7.5:1 AAA on bg) |
| `accent` | `#d4a843` | Gold accent (8.9:1 on bg) |
| `accent-hover` | `#e8bd5a` | Hover state |
| `rule` | `#2f2926` | Decorative borders |

**The tier split is load-bearing.** `text-muted` means *metadata* — `font-mono` captions, sources, timestamps, link rest-states, input placeholders. Running prose uses `text-body`. Putting prose back on `text-muted` is what made the site read flat and grey before 2026-08-15.

Every tier clears AAA on `bg` and `bg-surface`. The one exception is `text-muted` on `bg-raise` at 6.63:1 (AA, not AAA), which is a deliberate trade: darkening `bg-raise` far enough to reach 7:1 collapses its separation from `bg-surface` to 1.03:1 and the plane stops reading.

**Every page runs on continuous `bg` and sets raised objects on it** (2026-09-23, replacing the old bg / bg-surface alternation). The black is the setting, not the thing every section lives in. Raised objects use `.panel` in `global.css`: a `bg-raise` gradient, a hairline border with a lighter top edge, and a deep shadow. The lighter top edge is what makes it lift, because a shadow alone barely shows on near-black. `.panel-accent` adds the gold top edge for the homepage case studies. Every homepage section below the hero carries one raised object or a strong form: the case-study cards, the How I work list (three big words between rules, deliberately not a panel so it differs from its card neighbours), the newsletter post cards, and the About portrait. **Vary the object's form between neighbouring sections.** Three 3-up card grids in a row read as monotonous as the old uniform section labels did (2026-10-21). A section with no object reads as empty black, so a new section needs one too. Sections use `py-16 md:py-20`; without the old shade changes, the previous `py-28` read as a void. The hero nameplate and the About portrait take the same shadow. Sections carry no `border-t`; the `.rule-heading` labels and the panels mark the boundaries. Keep panels for things that are objects (numbers, cards, tables). Boxing every section brings back the flatness in a new form. `FooterCTA` keeps its rule.

Every page, `FooterCTA` included, shares `.container-wide` (82rem). Prose inside it keeps its own `max-w-*` measure. Subpage h1s share one scale (`text-5xl md:text-7xl lg:text-8xl`). Subpage panels: each `/work` case study (metric studies add `.panel-accent`) and testimonial, the `/services` at-a-glance table and each service, the `/speaking` appearances list and theme cards (stage photos take the panel shadow), and the `/about` metadata block (portrait takes the shadow). `bg-surface` is no longer used on any page; it stays in the token table because the contrast figures reference it.

## Saadiq Industries identity (2026-11-25)

The site carries the **Saadiq Industries** mark: an S whose counters form an I (`public/brand/saadiq-industries-mark.svg`, inline as `Mark.astro`; the two halves are exact 180-degree rotations, redrawn from an AI-generated PNG). The nav shows the mark on a cream tile plus the wordmark; below `sm` the mark stands alone. Only the mark and Book are persistent on mobile: the page links and /newsletter fold into a menu below `md`. The "available for engagement" status bar was removed (2026-11-25): it read as eager rather than in demand. Display type is **Inter Tight** (700 by default via `.font-display` in the base layer, 800 for the hero and big words) — the display cut of the body face, replacing Instrument Serif. The OG cards use it too.

**The Industries framing lives in the mark and the layout, never in the copy or the palette.** That rule came out of a long exploration (canvas: https://claude.ai/artifact/WmVs6zWtt2BANjmRqNeERS). Everything invented for the theme was rejected: gold as a field, enamel green / signal red / cobalt, manila, a cream-on-cream layering, a serif, Archivo / IBM Plex / Schibsted Grotesk, and themed labels like "Job files" or "Place an order". What worked was the system the site already had. Don't add a new color or face for the brand's sake, and keep labels plain ("Case studies", "Book a call"). No copy that sells being a one-person shop.

The hero puts the headline beside a **nameplate**: the monogram on a cream (`text`) plate with the shadow, the one block of light above the fold, hidden below `lg` (between `md` and `lg` it would wrap under the headline). It replaced the hero photo; the portrait lives in About. Credentials run as one mono strip under both (Advising / Exits / Before), so the exits are still said once. No italics in headlines.

Labels are plain words in sentence case. JetBrains Mono is used for small metadata labels and text links; nav is in the body face. (The terminal motifs the site used to carry, such as the blinking cursor and `result_`-style labels, were removed 2026-11-25. They are no longer part of the identity.)

Design canvas with the treatments that led here: https://claude.ai/artifact/Y2rS3ZjaK33S8rRFNsuT3p

Design review that produced this system, including the changes not yet made (break the shared `max-w-5xl` container, one large accent moment per page, bring photography above the fold): https://claude.ai/code/artifact/219fdc26-0c51-4d53-b23f-1379a56bf049

## Section labels

The 17 `// section` eyebrows (now plain `.rule-heading` labels) were cut to 9 on 2026-08-15. **The test is not "does the label restate the heading below it" — it is "does the section identify itself without the label."** Getting that wrong in the first pass stripped two sections that genuinely needed one; see below.

Cut (8): every page-level label, where the nav highlight and the h1 already say the word three times over (`// work` above "What shipped", `// services` above "How I work", `// about`, `// speaking`), plus `// ai transformation` above an h1 that says AI, `// the problem` above four 5xl gold percentages, `// about` above a portrait, and `// what clients say` above attributed blockquotes. Those sections identify themselves; the label only added a line. Uniform overture is what made the page read flat — when all seven homepage sections open the same way, the announcement stops carrying rank and degrades into an `<hr>` with words on it.

**Kept `How I work` (then `Services`) and `From the newsletter` on the homepage after cutting them first and being corrected.** Three service steps and three post cards look like generic content until something frames them — unlike the stats or the portrait, they do not announce what they are. Restating a nearby heading is not the disqualifier; leaving the reader unsure what they are looking at is.

Survivors use `.rule-heading` in `global.css`: a mono label carrying its own hairline via `::after`, so the label and the rule are one device instead of two stacked ones. **The rule starts after the label rather than spanning the container** — that is what keeps it reading as a heading and not as a section border, so it does not fight the plane-change boundary rule above. It replaced the old `border-t border-rule pt-12` + `.section-label mb-10` stack on `/work`, `/speaking`, `/services` (keep the `pt-12`, drop the `border-t`). `.section-label` survives for exactly one use, the 404 status code.

**Every surviving label is a real `<h2>`, not a `<p>`.** They used to be paragraphs while the items *inside* them were `<h2>`s, so group names were absent from the heading outline and every item was a flat sibling. Items dropped to `<h3>` (and `/speaking` themes to `<h4>`) to match. The sections that lost their only label — AboutSection and the `/work` testimonials — got an `sr-only` `<h2>` so the outline stays complete. Write labels in sentence case in the markup and let `text-transform` uppercase them, so screen readers get real words.
