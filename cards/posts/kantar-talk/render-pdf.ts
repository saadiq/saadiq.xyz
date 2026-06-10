import puppeteer from "puppeteer";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Renders deck.html to a single 16:9 PDF, one slide per page.
// Usage: bun run render-pdf.ts
const __dirname = typeof import.meta.dir === "string" ? import.meta.dir : dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, "deck.html");
const out = resolve(__dirname, "kantar-deck.pdf");

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 400)); // let webfonts settle

await page.pdf({
  path: out,
  width: "1920px",
  height: "1080px",
  printBackground: true,
  preferCSSPageSize: false,
});

await browser.close();
console.log(`Generated ${out}`);
