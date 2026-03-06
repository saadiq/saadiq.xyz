import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const fontsDir = join(process.cwd(), "src/assets/fonts");
const instrumentSerifData = readFileSync(join(fontsDir, "InstrumentSerif-Regular.ttf"));
const interData = readFileSync(join(fontsDir, "Inter-Regular.ttf"));

const COLORS = {
  bg: "#0c0c0c",
  text: "#f0ece4",
  textMuted: "#ac9e90",
  accent: "#d4a843",
  rule: "#2a2a2a",
};

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
                fontSize: 52,
                fontFamily: "Instrument Serif",
                color: COLORS.text,
                lineHeight: 1.15,
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
                bottom: 80,
                left: 80,
                fontSize: 18,
                fontFamily: "Inter",
                color: COLORS.accent,
              },
              children: "saadiq.xyz",
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
          name: "Instrument Serif",
          data: instrumentSerifData,
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
