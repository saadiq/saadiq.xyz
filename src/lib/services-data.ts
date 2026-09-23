// The five engagement shapes. /services renders them in full; the homepage
// Services teaser renders the at-a-glance rows.
export const services = [
  {
    slug: "talks",
    name: "Talks and executive briefings",
    forShort: "leadership teams",
    shape: "one session, or a written brief",
    cta: "Book a talk",
    format: ["one session · in person or remote", "briefs · written, 1-2 weeks"],
    who: "For leadership teams that need a concrete picture of what AI changes about how they build.",
    body:
      "A 45 to 90 minute session built around live demos of real systems instead of slides. Your org sees working agents on actual business problems, then we take questions for as long as you want, and you keep a deck made to circulate. When a single decision needs depth rather than a room, I write executive briefs.",
    proof:
      "A product-offsite talk for a global research firm was still being discussed two days later, and the deck went to everyone who missed the room. A panel on AI agents in a public library's AI literacy series drew about 80 people for live demos.",
  },
  {
    slug: "advisory",
    name: "Executive AI advisory",
    forShort: "CEOs and CPOs",
    shape: "weekly sessions on retainer",
    cta: "Book a conversation",
    format: ["monthly retainer · weekly sessions", "three-month initial term"],
    who: "For CEOs and CPOs facing AI decisions they can't delegate.",
    body:
      "A standing weekly session on the topics you pick. Vendor evaluations, org design, what to believe in a demo, how fast to push. Deep enough to get into mechanics, with source-verified research briefs between sessions. I have no platform to sell you, so the read stays honest.",
    proof:
      "Current engagements include weekly sessions with the chief executive of a Fortune 500 company and advisory to a senior technology leader navigating a company-wide rework of how the business operates and delivers its services.",
  },
  {
    slug: "sprint",
    name: "AI discovery sprint",
    forShort: "executives picking the first problem",
    shape: "1-2 weeks, fixed fee",
    cta: "Scope a sprint",
    format: ["1-2 weeks · fixed fee", "ends with a scoped proposal"],
    who: "For executives who want AI working in their business but need to know which problems are worth solving first.",
    body:
      "One to two weeks embedded in your company. I join your meetings, talk to your people, and learn your stack and your processes. The goal is finding where AI can move the business, and separating what's valuable from what's an expensive distraction. You end with a prioritized set of opportunities and a concrete, scoped proposal for the first project. The fee is fixed, so discovery can't balloon.",
    proof:
      "A two-week sprint for a database company tested how seven AI models saw their product, found a zero percent mention rate and a blog invisible to AI crawlers, and shipped a 90-day roadmap that turned into follow-on work.",
  },
  {
    slug: "builds",
    name: "Agent and automation builds",
    forShort: "teams stuck in manual work",
    shape: "4-8 weeks per phase, milestones",
    cta: "Scope a build",
    format: ["fixed fee · milestone billed", "4-8 weeks per phase"],
    who: "For companies whose skilled people burn hours on manual work across systems.",
    body:
      "A production agent or automation that keeps running after I leave. Human review is designed in from the start, so the agent never hits send on its own. Billing is tied to milestones you accept, and handoff includes the knowledge transfer your team needs to own and extend the system.",
    proof:
      "Recent builds include a campaign-setup agent for a 70-million-member advocacy organization, delivered and accepted milestone by milestone, and a voice agent in production for a hospitality company, making first-pass qualification calls that replace 8 to 12 hours of manual calling per request.",
  },
  {
    slug: "embedded",
    name: "Embedded technical leadership",
    forShort: "founder-led companies",
    shape: "weekly cadence on retainer",
    cta: "Book a conversation",
    format: ["monthly retainer · weekly cadence", "starts with one scoped win"],
    who: "For established founder-led companies that need senior technical leadership without the full-time hire.",
    body:
      "I run a weekly cadence as your de facto technical lead. Agents, integrations, and replatforms get shipped. Vendor and cost decisions get owned. Your team levels up along the way because they're in the work, not watching it. Engagements start with a scoped first project that stands on its own. The mandate grows from results.",
    proof:
      "A year-plus engagement with a hospitality company grew from a single automation into voice and email agents and a full website replatform, and its non-technical founder now runs her own dev environment and merges her own pull requests. Three weeks embedded with a product team cut prototype iteration from weeks to about three hours.",
  },
];
