import type { APIRoute } from "astro";
import { generateOgImage } from "../lib/og";

export const GET: APIRoute = async () => {
  const png = await generateOgImage({
    label: "// ai transformation",
    heading: "Smart leaders are stuck on AI. I show them the future and build the path there.",
    subtext: "You have the mandate and the urgency — I can show you what success looks like.",
  });

  return new Response(png, { headers: { "Content-Type": "image/png" } });
};
