import type { APIRoute } from "astro";
import sharp from "sharp";
import { join } from "node:path";
import { PERSON_IMAGE_SIZE } from "../lib/schema";

// The Person JSON-LD image. Astro hashes imported asset URLs, and search
// engines cache this one, so it is served at a fixed path from the same source
// file the pages import.
export const GET: APIRoute = async () => {
  const jpeg = await sharp(join(process.cwd(), "src/assets/images/portrait.jpg"))
    .resize(PERSON_IMAGE_SIZE, PERSON_IMAGE_SIZE, { fit: "cover" })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": "image/jpeg" } });
};
