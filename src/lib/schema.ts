export const personSchema = {
  "@type": "Person" as const,
  "name": "Saadiq Rodgers-King",
  "jobTitle": "AI Transformation Consultant",
  "url": "https://saadiq.xyz/about",
  "sameAs": [
    "https://www.linkedin.com/in/saadiq/",
    "https://github.com/saadiq",
  ],
  "alumniOf": [
    { "@type": "CollegeOrUniversity" as const, "name": "Princeton University" },
    { "@type": "CollegeOrUniversity" as const, "name": "MIT Sloan School of Management" },
  ],
};

export const defaultJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Saadiq Rodgers-King — AI Transformation Consulting",
  "url": "https://saadiq.xyz",
  "description": "AI transformation consulting for tech and non-tech companies.",
  "provider": personSchema,
};

export const aboutJsonLd = {
  "@context": "https://schema.org",
  ...personSchema,
};
