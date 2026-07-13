import puppeteer from "puppeteer";
import { resolve } from "path";

// Render an infographic HTML to a single-page, full-bleed PDF with vector text.
// Usage: bun run render-infographic-pdf.ts <html> <out.pdf> [selector]
//
// Why this is more than a goto+pdf: Chromium's page.pdf() print path races
// lazily-fetched Google Fonts and silently falls back (mono -> Menlo, sans ->
// system), even though the on-screen/PNG render is correct. Fix: fetch the
// linked Google Fonts CSS, inline every woff2 as a base64 data URI, swap it in
// for the network <link>, so every face is synchronously present at print time.
const htmlPath = resolve(process.cwd(), process.argv[2]);
const outputFile = resolve(process.cwd(), process.argv[3]);
const selector = process.argv[4] || ".infographic";

// Old UA on purpose: Google Fonts then serves one full-coverage @font-face per
// weight (no unicode-range subsets). Chrome's PDF embedder drops the subsetted
// css2 faces but embeds these cleanly. The format is .woff, which embeds fine.
const UA = "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)";

// Old headless ("shell") embeds web fonts reliably in page.pdf(); the new
// headless path selectively substitutes some families (mono -> Menlo).
const browser = await puppeteer.launch({ headless: "shell" });
const page = await browser.newPage();
await page.emulateMediaType("screen"); // match the screen/PNG render, not print
await page.setViewport({ width: 1600, height: 2800, deviceScaleFactor: 1 });
await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });

// Inline the Google Fonts the page links, woff2 as data URIs.
const cssHrefs: string[] = await page.evaluate(() =>
  [...document.querySelectorAll('link[rel="stylesheet"]')]
    .map((l) => (l as HTMLLinkElement).href)
    .filter((h) => h.includes("fonts.googleapis.com"))
);
let inlinedCss = "";
for (const href of cssHrefs) {
  let css = await (await fetch(href, { headers: { "User-Agent": UA } })).text();
  const urls = [...new Set([...css.matchAll(/url\((https:\/\/[^)]+\.woff2?)\)/g)].map((m) => m[1]))];
  for (const u of urls) {
    const buf = Buffer.from(await (await fetch(u)).arrayBuffer());
    const mime = u.endsWith(".woff2") ? "font/woff2" : "font/woff";
    css = css.split(u).join(`data:${mime};base64,${buf.toString("base64")}`);
  }
  inlinedCss += css + "\n";
}
const fontReport = await page.evaluate(async (css: string) => {
  document.querySelectorAll('link[rel="stylesheet"]').forEach((l) => {
    const href = (l as HTMLLinkElement).href;
    if (href.includes("fonts.googleapis.com") || href.includes("fonts.gstatic.com")) l.remove();
  });
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
  // Defining @font-face isn't enough: data-URI faces stay "unloaded" until used,
  // and the print path then falls back. Force-decode every face before printing.
  const faces = [...document.fonts];
  const results = await Promise.allSettled(faces.map((f) => f.load()));
  await document.fonts.ready;
  return {
    total: faces.length,
    loaded: results.filter((r) => r.status === "fulfilled").length,
    families: [...new Set(faces.map((f) => f.family))],
  };
}, inlinedCss);
console.log("Fonts decoded:", JSON.stringify(fontReport));

// Drop the body's flex centering so the target sits at the top-left, then size
// the PDF page to its box: one page, no margins, no slicing.
const bg: string = await page.$eval(selector, (el) => getComputedStyle(el).backgroundColor);
await page.evaluate((color) => {
  Object.assign(document.body.style, { display: "block", margin: "0", padding: "0", background: color });
}, bg);
const box: { w: number; h: number } = await page.$eval(selector, (el) => {
  const r = el.getBoundingClientRect();
  return { w: Math.ceil(r.width), h: Math.ceil(r.height) };
});

await page.pdf({
  path: outputFile,
  printBackground: true,
  width: `${box.w}px`,
  height: `${box.h}px`,
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
  pageRanges: "1",
});

await browser.close();
console.log(`Generated ${outputFile} (${box.w}x${box.h} css px, single page, fonts inlined)`);
