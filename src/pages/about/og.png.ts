import type { APIRoute } from "astro";
import { generateOgImage } from "../../lib/og";

export const GET: APIRoute = async () => {
  const png = await generateOgImage({
    label: "// about",
    heading: "Saadiq Rodgers-King",
    subtext: "I help organizations get ahead with AI.",
  });

  return new Response(png, { headers: { "Content-Type": "image/png" } });
};
