// Case studies and testimonials for /work.
// Naming is gated on written releases. Until `nameCleared` is true a case study
// renders its anonymized descriptor; until `cleared` is true a testimonial does
// not render at all. Flip flags as releases land.
// Preview everything locally with: SHOW_PENDING=1 bun run dev
//
// Anonymized descriptors and every claim below are bound by the proof
// constraints in docs/plans/2026-06-10-services-page-design.md. Read it before
// editing. In particular: no industry tag on the Fortune 500 CEO engagement, no
// reference to the research firm's restructuring or the executive's new title,
// and no claiming work that is scoped but not delivered.

export const SHOW_PENDING = process.env.SHOW_PENDING === "1";

export interface CaseStudy {
  client: string;
  anonym: string;
  nameCleared: boolean;
  // Display headline: the strongest verified result, phrased within the proof
  // constraints. The client descriptor renders beneath it, not above it.
  headline: string;
  format: string[];
  challenge: string;
  work: string;
  results: string[];
}

export interface CaseStudyGroup {
  group: string;
  studies: CaseStudy[];
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  cleared: boolean;
  source: string;
}

export const caseStudyGroups: CaseStudyGroup[] = [
  {
    group: "Executive advisory",
    studies: [
      {
        client: "Molina Healthcare",
        anonym: "A Fortune 500 company",
        nameCleared: false,
        headline: "A standing weekly AI session with the chief executive",
        format: ["executive AI advisory", "weekly one-on-one with the CEO"],
        challenge:
          "The chief executive needed to reason about AI at the level of mechanics rather than vendor decks. The decisions in front of him could not be delegated to a team still forming its own view.",
        work: "A standing weekly session on the decisions actually on his desk. Model evaluation, retrieval versus fine-tuning economics, token cost modeling, hallucination and prompt-injection risk. Each session runs on source-verified research. I have no platform to sell, so the read stays honest.",
        results: [
          "A weekly cadence delivered directly to the chief executive, not to a delegate",
          "Mechanics covered at depth, from model evaluation through token cost modeling to prompt-injection risk",
        ],
      },
      {
        client: "Kantar",
        anonym: "A global research firm",
        nameCleared: false,
        headline: "Go-to-market recommendation and architecture for a new API and MCP surface",
        format: ["executive AI advisory", "weekly sessions"],
        challenge:
          "A senior technology leader was driving a company-wide rework of how the business operates and delivers its services. AI decisions were landing faster than the organization could evaluate them.",
        work: "Weekly strategic advisory through the rework. The work ran from go-to-market strategy for an API and MCP surface down to the platform architecture underneath it.",
        results: [
          "Go-to-market recommendation delivered for a new API and MCP surface",
          "The platform architecture beneath it specified",
          "The engagement led to a talk at the global product and engineering leadership offsite",
        ],
      },
    ],
  },
  {
    group: "Embedded delivery",
    studies: [
      {
        client: "Lanyard Stays",
        anonym: "A B2B corporate-housing company",
        nameCleared: false,
        headline: "A voice agent in production, replacing 8 to 12 hours of calling per request",
        format: [
          "embedded technical leadership",
          "thirteen months and running",
        ],
        challenge:
          "Core operations ran by hand. Sourcing a single housing request took hours of manual search and property calls, and triaging property emails consumed the team's day.",
        work: "The engagement started with one email automation and grew into fractional technical leadership. A voice agent went into production making first-pass qualification calls. The website was replatformed. The team was in the work the whole way, so the capability stayed.",
        results: [
          "Voice agent in production, replacing 8 to 12 hours of manual calling per request",
          "Property email triage automated",
          "Website replatform shipped",
          "The non-technical founder now runs her own dev environment and merges her own pull requests",
        ],
      },
      {
        client: "Avaaz",
        anonym: "A 70-million-member advocacy organization",
        nameCleared: false,
        headline: "A campaign-setup agent, built and accepted milestone by milestone",
        format: ["agent and automation build", "milestone billed"],
        challenge:
          "Campaign setup was manual work repeated across a global organization. Every hour spent standing a campaign up was an hour not spent on the campaign itself.",
        work: "An AI campaign-setup agent with human review designed in from the start. It was built to execute through the organization's own CMS and messaging APIs, so it fits inside their systems rather than beside them.",
        results: [
          "Agent built and accepted, milestone by milestone",
          "Human review at every step, so the agent never acts on its own",
        ],
      },
      {
        client: "Our Kids Read",
        anonym: "A children's literacy nonprofit",
        nameCleared: false,
        headline: "Partner tracking moved from spreadsheets to automated status updates",
        format: ["operations automation", "pro bono"],
        challenge:
          "The nonprofit tracked hospital book partnerships in spreadsheets, phone calls, and photographed shipping receipts. The manual load capped how many hospital partners the team could serve.",
        work: "Replaced the manual workflow with an integrated tracking system the staff manages themselves, mapped 30-plus volunteers to work that fit their skills, and set up AI-assisted training content the team can update without a production budget.",
        results: [
          "Partner tracking moved from spreadsheets to a system with automated status updates",
          "A framework to scale monthly book revenue from $3K toward a $20K target",
        ],
      },
    ],
  },
  {
    group: "Enablement and strategy",
    studies: [
      {
        client: "TigerData",
        anonym: "A venture-backed database company",
        nameCleared: false,
        headline: "A zero percent AI mention rate diagnosed across seven models",
        format: ["2-week discovery sprint", "converted to a 6-month retainer"],
        challenge:
          "The company had shipped real AI products, and no AI assistant recommended them. Buyers increasingly ask models what to use, and the company was absent from the answers.",
        work: "A two-week discovery sprint. I built a custom visibility audit, tested how seven AI models saw the product across the queries buyers actually ask, found a zero percent mention rate and a blog invisible to AI crawlers, and traced the problem to how the content was structured.",
        results: [
          "Zero percent AI mention rate diagnosed across seven models, with the cause identified",
          "90-day roadmap delivered with an executive brief and a measurement framework",
          "Converted into a six-month advisory retainer",
        ],
      },
      {
        client: "Takes",
        anonym: "A consumer product team",
        nameCleared: false,
        headline: "Prototype iteration cut from weeks to about three hours",
        format: ["3 weeks embedded", "AI-native prototyping"],
        challenge:
          "Product feedback moved through static designs, an external engineering team, and a debugging cycle before anyone learned anything. Iterations took weeks, and keeping the app moving required a full-time CTO plus two developers.",
        work: "Three weeks embedded with the team. We separated prototyping from production, stood up an AI toolstack the team ran themselves, and rebuilt the testing loop around working prototypes instead of mockups.",
        results: [
          "Prototype iteration went from weeks to about three hours",
          "Engineering need dropped from a full-time CTO plus two developers to office hours and a fraction of one",
          "Users reacted to working software, which sharpened every feedback cycle",
        ],
      },
    ],
  },
];

export const caseStudyCount = caseStudyGroups.reduce(
  (n, g) => n + g.studies.length,
  0,
);

export const testimonials: Testimonial[] = [
  {
    quote:
      "Saadiq is one of my favorite colleagues to work with. He is incredibly sharp, has a keen critical eye, and is one of the best communicators that I've ever met. He bridges the gaps between engineering, product, and business seamlessly.",
    name: "Ajay Kulkarni",
    title: "CEO, TigerData",
    cleared: false,
    source: "LinkedIn recommendation",
  },
  {
    quote:
      "I really am in awe of you as a product leader. Thank you for bringing clarity to the craziness. Thank you for asking why when no one else would.",
    name: "Justin",
    title: "Product, PROOF",
    cleared: false,
    source: "Written recommendation",
  },
];
