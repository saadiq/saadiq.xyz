import type { APIRoute } from "astro";

const sitemaps = [
  "https://saadiq.xyz/sitemap-0.xml",
  "https://saadiq.xyz/newsletter/sitemap-posts.xml",
  "https://saadiq.xyz/newsletter/sitemap-pages.xml",
  "https://saadiq.xyz/newsletter/sitemap-tags.xml",
  "https://saadiq.xyz/newsletter/sitemap-authors.xml",
];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().split("T")[0];
  const entries = sitemaps
    .map(
      (loc) => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};
