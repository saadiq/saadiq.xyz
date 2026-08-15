// Appearances and talk themes for /speaking.
// Venues are named where the event was public. The June offsite stays
// anonymized under the client's NDA (see docs/plans/2026-06-10-services-page-design.md).

export interface Appearance {
  role: string;
  title: string;
  venue: string;
  date: string;
  note?: string;
  recording?: string;
}

export interface Theme {
  title: string;
  hook: string;
  delivered?: boolean;
}

export const appearances: Appearance[] = [
  {
    role: "Speaker",
    title:
      "The Product Development Factory: What AI Changes About How We Build",
    venue:
      "Global product and engineering leadership offsite, a global research firm",
    date: "June 2026",
    note: "Still being discussed two days later. The deck went to everyone who missed the room.",
  },
  {
    role: "Co-presenter",
    title: "Conversations About AI: Exploring AI Agents",
    venue: "New York Public Library, Staten Island",
    date: "April 2026",
    note: "A live agent build for a general audience, about 80 people.",
    recording: "https://www.youtube.com/watch?v=V8s82NcK1q0",
  },
  {
    role: "Moderator",
    title: "AI in Action",
    venue: "Female Founders in Hospitality Summit, New York",
    date: "March 2026",
    note: "Panel at the inaugural summit.",
  },
];

export interface ThemeGroup {
  group: string;
  themes: Theme[];
}

export const themeGroups: ThemeGroup[] = [
  {
    group: "for leadership teams",
    themes: [
      {
        title: "99% Adoption and Still Stuck",
        hook: "You bought the licenses, adoption climbed, and nothing moved.",
      },
      {
        title: "Your Annual Roadmap Is Already Dead",
        hook: "Any precision you add to a nine-month plan right now is false precision.",
      },
      {
        title: "The New Org Chart",
        hook: "The PM, design, and engineering assembly line is collapsing into builders. The question is what you draw in its place.",
      },
    ],
  },
  {
    group: "for product and engineering orgs",
    themes: [
      {
        title: "The Product Development Factory",
        hook: "Orchestration and enablement were always product's real work. When execution gets cheap, they become the whole job.",
        delivered: true,
      },
      {
        title: "Is Product Management Dead?",
        hook: "No. It's splitting, and about half of PMs are on the wrong side.",
      },
      {
        title: "Sell Work, Not Software",
        hook: "You can't sell an agent. You sell the job done. And your app was never the moat.",
      },
    ],
  },
  {
    group: "for mixed rooms",
    themes: [
      {
        title: "You Don't Need to Know What an Agent Is",
        hook: "An agent is context plus tools. Everything else is plumbing.",
        delivered: true,
      },
      {
        title: "Context Is the Company Brain",
        hook: "The highest-leverage AI investment isn't a tool. It's the context layer underneath every tool.",
      },
      {
        title: "The Jagged Frontier",
        hook: "Effective AI use is a skill, not a tool. Everyone has the tool.",
      },
    ],
  },
];
