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
  // The one number a reader should leave with. Set only where the result is a
  // verified figure; it leads the case study on /work. `label` must read on its
  // own, and the claim is not repeated in `results`.
  metric?: { value: string; label: string };
  // For ongoing engagements whose outcomes are qualitative, not measured:
  // relabels the result block ("Result" / "Results") so it doesn't read as a
  // verified figure.
  outcomeLabel?: string;
  // Set on the studies the homepage shows. Every engagement is advising, so
  // `advising` names who was advised, not a service type; builds come in as
  // proof where they happened. Copy here is shorter than challenge/work above
  // and bound by the same proof constraints.
  home?: {
    advising: string;
    cadence: string;
    situation: string;
    work: string;
    result: string;
  };
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
        outcomeLabel: "So far",
        format: ["executive AI advisory", "weekly one-on-one with the CEO", "ongoing"],
        home: {
          advising: "Advising the CEO",
          cadence: "weekly",
          situation:
            "The chief executive wanted to understand AI well enough to make the calls himself, instead of relying on vendor pitches or a team still forming its own view.",
          work: "A standing weekly session on the AI decisions in front of him, covering which models to trust, what building would cost, and where the risks are.",
          result:
            "He weighs AI proposals on how they actually work, and decides for himself where AI is worth applying across the company.",
        },
        challenge:
          "The chief executive wanted to understand AI well enough to make the calls himself, instead of relying on vendor pitches. The decisions in front of him could not wait for a team still forming its own view.",
        work: "A standing weekly session on the decisions actually on his desk. We cover how to judge which AI models to trust, when to build versus buy and what each costs, and where AI creates new risks for the company. Each session runs on checked research. I have no platform to sell, so the read stays honest.",
        results: [
          "A chief executive who can judge AI proposals on how they work, not on the pitch",
          "Clearer calls on where AI is worth applying across the company, and where it is not",
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
    group: "Advisory with builds",
    studies: [
      {
        client: "Lanyard",
        anonym: "A B2B corporate-housing company",
        nameCleared: true, // Named by Saadiq 2026-11-25.
        headline: "A voice agent in production, replacing 8 to 12 hours of calling per request",
        metric: {
          value: "8–12 hrs",
          label: "of manual calling per request, replaced by a voice agent in production",
        },
        format: [
          "technical advisory to the founder, with builds",
          "eighteen months and running",
        ],
        home: {
          advising: "Advising the founder",
          cadence: "18 months",
          situation:
            "Lanyard finds corporate housing that is open right now, so the team phones properties directly for every request. As demand grew, one request could take a full day of calls.",
          work: "I advise the founder on technology and AI. Along the way we built a voice agent that makes the first round of property calls, automated property email, and rebuilt the website.",
          result:
            "The voice agent now handles the 8 to 12 hours of calling each request used to take. The founder ships her own code changes.",
        },
        challenge:
          "Clients come to Lanyard for housing that is available now, and the team finds it by phoning properties directly for every request. As demand grew, one request could take 8 to 12 hours of calls, and property email filled the rest of the day.",
        work: "I started by automating one email workflow. Eighteen months later I am the founder's standing technical advisor. We built a voice agent that makes the first round of calls to properties and checks whether they fit the request, and we moved the website to a new platform. The team worked alongside me throughout, so they can run and extend what we built.",
        results: [
          "Property email triage automated",
          "Website replatform shipped",
          "The non-technical founder now runs her own development setup and ships her own code changes",
        ],
      },
      {
        client: "Our Kids Read",
        anonym: "A children's literacy nonprofit",
        nameCleared: true, // Named by Saadiq 2026-11-25.
        headline: "Standing tech and AI operations advisor to a growing nonprofit",
        format: ["tech and AI operations advisory", "pro bono, since 2025"],
        home: {
          advising: "Advising the founder and tech team",
          cadence: "pro bono",
          situation:
            "A nonprofit that sends books to children in hospitals, run by a small staff and volunteers. It needed help deciding how technology and AI should run its operations, and what to build next.",
          work: "I advise the founder and the volunteer tech team on how the organization runs on technology, from hosting and code ownership to using AI for grant research. It started with a book-ordering system I built in 2025.",
          result:
            "The grants team has an AI workflow for researching funders, and the ordering system runs on Our Kids Read's own accounts.",
        },
        challenge:
          "Our Kids Read sends books to children in hospitals. Its operations ran on spreadsheets, phone calls, and photos of shipping receipts, which capped how many hospitals it could serve. As the program grew, the founder needed help deciding how technology and AI should carry the work, and steering a mostly volunteer tech team.",
        work: "I advise the founder and the volunteer tech team, which sets direction and leaves the building to a pro bono development studio. The advice covers where the platform should be hosted, how the code stays in the organization's hands, and where AI can take on operations work like grant research. It started with a book-ordering system I built in 2025, so hospitals order online and staff can see every shipment.",
        results: [
          "An AI workflow for researching grant funders, set up with the grants team",
          "Code and hosting moved into Our Kids Read's own accounts, so no single volunteer holds the keys",
          "Book ordering moved from spreadsheets and phone calls to an online system the staff runs",
          "A plan to grow monthly book revenue from $3K toward $20K",
        ],
      },
    ],
  },
  {
    group: "Sprints and builds",
    studies: [
      {
        client: "TigerData",
        anonym: "A venture-backed database company",
        nameCleared: false,
        headline: "A zero percent AI mention rate diagnosed across seven models",
        metric: {
          value: "0%",
          label: "AI mention rate across seven models, diagnosed with the cause in a two-week sprint",
        },
        format: ["2-week discovery sprint", "converted to a 6-month retainer"],
        challenge:
          "The company had shipped real AI products, and no AI assistant recommended them. Buyers increasingly ask models what to use, and the company was absent from the answers.",
        work: "A two-week discovery sprint. I built a custom visibility audit, tested how seven AI models saw the product across the queries buyers actually ask, found a zero percent mention rate and a blog invisible to AI crawlers, and traced the problem to how the content was structured.",
        results: [
          "90-day roadmap delivered with an executive brief and a measurement framework",
          "Converted into a six-month advisory retainer",
        ],
      },
      {
        client: "Takes",
        anonym: "A consumer product team",
        nameCleared: false,
        headline: "Prototype iteration cut from weeks to about three hours",
        metric: {
          value: "~3 hrs",
          label: "per prototype iteration, down from weeks, after three weeks embedded",
        },
        format: ["3 weeks embedded", "AI-native prototyping"],
        challenge:
          "Product feedback moved through static designs, an external engineering team, and a debugging cycle before anyone learned anything. Iterations took weeks, and keeping the app moving required a full-time CTO plus two developers.",
        work: "Three weeks embedded with the team. We separated prototyping from production, stood up an AI toolstack the team ran themselves, and rebuilt the testing loop around working prototypes instead of mockups.",
        results: [
          "Engineering need dropped from a full-time CTO plus two developers to office hours and a fraction of one",
          "Users reacted to working software, which sharpened every feedback cycle",
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
    ],
  },
];

// The naming gate, resolved once so templates render values, not policy.
export const displayName = (cs: CaseStudy) =>
  cs.nameCleared || SHOW_PENDING ? cs.client : cs.anonym;

// Local previews only: the descriptor a cleared name would replace.
export const pendingNote = (cs: CaseStudy) =>
  !cs.nameCleared && SHOW_PENDING ? cs.anonym : null;

const allStudies = caseStudyGroups.flatMap((g) => g.studies);

// Homepage case studies, in caseStudyGroups order, so reordering /work reorders
// the homepage too. Keep the CEO engagement first: it is the one the hero describes.
export const homeStudies = allStudies.filter(
  (cs): cs is CaseStudy & Required<Pick<CaseStudy, "home">> => !!cs.home,
);

export const testimonials: Testimonial[] = [
  {
    quote:
      "Saadiq is one of my favorite colleagues to work with. He is incredibly sharp, has a keen critical eye, and is one of the best communicators that I've ever met. He bridges the gaps between engineering, product, and business seamlessly.",
    name: "Ajay Kulkarni",
    title: "CEO, TigerData",
    // Cleared by Saadiq 2026-08-15: public LinkedIn recommendation.
    cleared: true,
    source: "LinkedIn recommendation",
  },
  {
    quote:
      "I'm excited, man. You've just changed my life in the last hour. So thank you. This is nuts. I had no idea this technology existed. Super helpful, man. Thank you so much, Saadiq. I really appreciate you, man.",
    name: "Jahmal Lake",
    title: "Founder & CEO, Our Kids Read",
    // Quote chosen by Saadiq 2026-08-15: two consecutive utterances from the
    // end of the first working session, joined. Wording is the cleaned Granola
    // transcript from the Trust Artifacts canon, which asks to confirm exact
    // wording with Jahmal before public use; get his written sign-off when
    // convenient.
    cleared: true,
    source: "Recorded first working session, 2025-05-30 (Trust Artifacts)",
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
