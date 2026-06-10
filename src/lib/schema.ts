export const personSchema = {
  "@type": "Person" as const,
  "@id": "https://saadiq.xyz/#person",
  "name": "Saadiq Rodgers-King",
  "jobTitle": "AI Transformation Consultant",
  "description":
    "AI transformation consultant with 20+ years across product, engineering, and strategy. Princeton CS, MIT Sloan MBA. Embeds with product and engineering teams to move AI from pilot to production.",
  "url": "https://saadiq.xyz/about",
  "image": {
    "@type": "ImageObject" as const,
    "url": "https://saadiq.xyz/og.png",
    "width": 2400,
    "height": 1260,
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

export const defaultJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://saadiq.xyz/#service",
  "name": "Saadiq Rodgers-King — AI Transformation Consulting",
  "url": "https://saadiq.xyz",
  "description":
    "Smart leaders are stuck on AI. I get their teams unstuck. Embedded consulting for tech companies with product and engineering teams.",
  "areaServed": {
    "@type": "Country" as const,
    "name": "United States",
  },
  "provider": personSchema,
  "hasOfferCatalog": {
    "@type": "OfferCatalog" as const,
    "name": "AI Transformation Services",
    "itemListElement": [
      {
        "@type": "Offer" as const,
        "itemOffered": {
          "@type": "Service" as const,
          "name": "Product Team AI Transformation",
          "description":
            "Customer support signals, sales conversations, competitive moves, and usage analytics synthesized in real time. Fewer sprints wasted building the wrong thing.",
        },
      },
      {
        "@type": "Offer" as const,
        "itemOffered": {
          "@type": "Service" as const,
          "name": "Engineering Team AI Transformation",
          "description":
            "Routine work executed by agents. Engineers focus on architecture and strategy. Output per engineer increases because the nature of the work changes.",
        },
      },
    ],
  },
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
    "AI transformation consulting for tech companies with product and engineering teams.",
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
  "hasOfferCatalog": {
    "@type": "OfferCatalog" as const,
    "name": "AI Consulting Services",
    "itemListElement": [
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
            "One to two weeks inside your stack. Use cases pressure-tested, AI wired to live data, a working prototype, and a phased build estimate. Fixed fee.",
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
    ],
  },
};

export const servicesBreadcrumbJsonLd = {
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
      "name": "Services",
      "item": "https://saadiq.xyz/services",
    },
  ],
};

export const aboutBreadcrumbJsonLd = {
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
      "name": "About",
      "item": "https://saadiq.xyz/about",
    },
  ],
};
