// Square edge of the Person image that src/pages/saadiq-rodgers-king.jpg.ts
// renders, so the dimensions below can't drift from the file.
export const PERSON_IMAGE_SIZE = 800;

export const personSchema = {
  "@type": "Person" as const,
  "@id": "https://saadiq.xyz/#person",
  "name": "Saadiq Rodgers-King",
  "jobTitle": "AI Transformation Consultant",
  "description":
    "AI transformation consultant with 20+ years in product and engineering. Princeton CS, MIT Sloan MBA. Advises the executives making AI decisions and works hands-on with their teams until AI is part of how the work gets done.",
  "url": "https://saadiq.xyz/about",
  "image": {
    "@type": "ImageObject" as const,
    "url": "https://saadiq.xyz/saadiq-rodgers-king.jpg",
    "width": PERSON_IMAGE_SIZE,
    "height": PERSON_IMAGE_SIZE,
  },
  "address": {
    "@type": "PostalAddress" as const,
    "addressLocality": "Brooklyn",
    "addressRegion": "NY",
    "addressCountry": "US",
  },
  "sameAs": [
    "https://www.linkedin.com/in/saadiq/",
    "https://github.com/saadiq",
    "https://x.com/saadiq",
    "https://www.threads.com/@saadiq",
    "https://bsky.app/profile/saadiq.bsky.social",
  ],
  "alumniOf": [
    {
      "@type": "CollegeOrUniversity" as const,
      "name": "Princeton University",
      "url": "https://www.princeton.edu",
    },
    {
      "@type": "CollegeOrUniversity" as const,
      "name": "MIT Sloan School of Management",
      "url": "https://mitsloan.mit.edu",
    },
  ],
  "knowsAbout": [
    "AI transformation",
    "product management",
    "engineering leadership",
    "enterprise SaaS",
    "large language models",
    "agentic workflows",
    "AI strategy",
    "AI implementation",
  ],
};

const serviceOffers = [
  {
    "@type": "Offer" as const,
    "itemOffered": {
      "@type": "Service" as const,
      "name": "Talks and Executive Briefings",
      "url": "https://saadiq.xyz/services",
      "description":
        "Live-demo sessions for leadership teams on what AI changes about how they build, plus standalone written executive briefs.",
    },
  },
  {
    "@type": "Offer" as const,
    "itemOffered": {
      "@type": "Service" as const,
      "name": "Executive AI Advisory",
      "url": "https://saadiq.xyz/services",
      "description":
        "A standing weekly session for CEOs and CPOs on AI decisions they can't delegate, with source-verified research briefs between sessions.",
    },
  },
  {
    "@type": "Offer" as const,
    "itemOffered": {
      "@type": "Service" as const,
      "name": "AI Discovery Sprint",
      "url": "https://saadiq.xyz/services",
      "description":
        "One to two weeks embedded in your meetings, your stack, and your processes to find where AI can move the business. Ends with a prioritized set of opportunities and a scoped proposal. Fixed fee.",
    },
  },
  {
    "@type": "Offer" as const,
    "itemOffered": {
      "@type": "Service" as const,
      "name": "Agent and Automation Builds",
      "url": "https://saadiq.xyz/services",
      "description":
        "Production agents and automations with human review designed in. Milestone billed, with knowledge transfer so your team owns the system.",
    },
  },
  {
    "@type": "Offer" as const,
    "itemOffered": {
      "@type": "Service" as const,
      "name": "Embedded Technical Leadership",
      "url": "https://saadiq.xyz/services",
      "description":
        "A weekly cadence as your de facto technical lead. Systems shipped, vendor decisions owned, and a team that levels up along the way.",
    },
  },
];

const offerCatalog = (name: string) => ({
  "@type": "OfferCatalog" as const,
  "name": name,
  "itemListElement": serviceOffers,
});

export const defaultJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://saadiq.xyz/#service",
  "name": "Saadiq Rodgers-King — AI Transformation Consulting",
  "url": "https://saadiq.xyz",
  "description":
    "AI transformation consulting for leadership teams that bought the AI tools and saw nothing change. Executive AI advisory, discovery sprints, agent and automation builds, embedded technical leadership, and talks.",
  "areaServed": {
    "@type": "Country" as const,
    "name": "United States",
  },
  "provider": personSchema,
  "hasOfferCatalog": offerCatalog("AI Transformation Services"),
};

export const aboutJsonLd = {
  "@context": "https://schema.org",
  ...personSchema,
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://saadiq.xyz/#website",
  "url": "https://saadiq.xyz",
  "name": "Saadiq Rodgers-King",
  "description":
    "AI transformation consulting for leadership teams that bought the AI tools and saw nothing change.",
  "publisher": { "@id": "https://saadiq.xyz/#person" },
};

export const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://saadiq.xyz/services#services",
  "name": "AI Consulting Services — Saadiq Rodgers-King",
  "url": "https://saadiq.xyz/services",
  "description":
    "Five engagement shapes, from a single talk to ongoing technical leadership. Talks and executive briefings, executive AI advisory, AI discovery sprints, agent and automation builds, embedded technical leadership.",
  "areaServed": {
    "@type": "Country" as const,
    "name": "United States",
  },
  "provider": personSchema,
  "hasOfferCatalog": offerCatalog("AI Consulting Services"),
};

const breadcrumbJsonLd = (name: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem" as const,
      "position": 1,
      "name": "Home",
      "item": "https://saadiq.xyz/",
    },
    {
      "@type": "ListItem" as const,
      "position": 2,
      "name": name,
      "item": `https://saadiq.xyz${path}`,
    },
  ],
});

export const servicesBreadcrumbJsonLd = breadcrumbJsonLd("Services", "/services");
export const aboutBreadcrumbJsonLd = breadcrumbJsonLd("About", "/about");
export const workBreadcrumbJsonLd = breadcrumbJsonLd("Work", "/work");
export const speakingBreadcrumbJsonLd = breadcrumbJsonLd("Speaking", "/speaking");

export const faqJsonLd = (items: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": items.map(({ question, answer }) => ({
    "@type": "Question" as const,
    "name": question,
    "acceptedAnswer": { "@type": "Answer" as const, "text": answer },
  })),
});
