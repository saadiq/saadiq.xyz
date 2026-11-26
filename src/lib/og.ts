import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const fontsDir = join(process.cwd(), "src/assets/fonts");
const interTightData = readFileSync(join(fontsDir, "InterTight-ExtraBold.ttf"));
const interData = readFileSync(join(fontsDir, "Inter-Regular.ttf"));

const COLORS = {
  bg: "#0b0a09",
  text: "#f2eee6",
  textMuted: "#ab9d91",
  accent: "#d4a843",
  rule: "#2f2926",
};

// The Saadiq Industries monogram, dark on a cream tile, as satori takes images.
// The tile pads the mark's own viewBox, so a redrawn mark stays centred.
const MARK_SVG = readFileSync(join(process.cwd(), "public/brand/saadiq-industries-mark.svg"), "utf8");
const MARK_PATHS = MARK_SVG.match(/<path[^>]*\/>/g)!.join("");
const TILE_PAD = 80;
const [mx, my, mw, mh] = MARK_SVG.match(/viewBox="([^"]+)"/)![1].split(/\s+/).map(Number);
const tile = { x: mx - TILE_PAD, y: my - TILE_PAD, w: mw + 2 * TILE_PAD, h: mh + 2 * TILE_PAD };
const markTile = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${tile.x} ${tile.y} ${tile.w} ${tile.h}"><rect x="${tile.x}" y="${tile.y}" width="${tile.w}" height="${tile.h}" fill="${COLORS.text}"/><g fill="${COLORS.bg}">${MARK_PATHS}</g></svg>`,
).toString("base64")}`;

import type { APIRoute } from "astro";

interface OgImageOptions {
  label: string;
  heading: string;
  subtext?: string;
}

export async function generateOgImage({ label, heading, subtext }: OgImageOptions): Promise<Buffer> {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: COLORS.bg,
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                fontSize: 14,
                fontFamily: "Inter",
                color: COLORS.accent,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 32,
              },
              children: label,
            },
          },
          {
            type: "div",
            props: {
              style: {
                fontSize: 56,
                fontFamily: "Inter Tight",
                color: COLORS.text,
                lineHeight: 1.02,
                letterSpacing: -2,
                marginBottom: subtext ? 28 : 0,
              },
              children: heading,
            },
          },
          ...(subtext
            ? [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 24,
                      fontFamily: "Inter",
                      color: COLORS.textMuted,
                      lineHeight: 1.5,
                      maxWidth: "80%",
                    },
                    children: subtext,
                  },
                },
              ]
            : []),
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: 72,
                left: 80,
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 20,
                fontFamily: "Inter Tight",
                color: COLORS.text,
              },
              children: [
                { type: "img", props: { src: markTile, width: 40, height: 40 } },
                { type: "div", props: { children: "Saadiq Industries" } },
                { type: "div", props: { style: { color: COLORS.textMuted, fontFamily: "Inter" }, children: "saadiq.xyz" } },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter Tight",
          data: interTightData,
          weight: 800,
          style: "normal",
        },
        {
          name: "Inter",
          data: interData,
          style: "normal",
        },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 2400 } });
  return Buffer.from(resvg.render().asPng());
}

export function ogEndpoint(options: OgImageOptions): APIRoute {
  return async () => {
    const png = await generateOgImage(options);
    return new Response(png, { headers: { "Content-Type": "image/png" } });
  };
}
