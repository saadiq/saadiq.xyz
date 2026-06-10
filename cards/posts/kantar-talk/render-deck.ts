import puppeteer from "puppeteer";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Batch-renders every .slide in deck.html to a 1920x1080 PNG at 2x DPR.
// Usage: bun run render-deck.ts
const __dirname = typeof import.meta.dir === "string" ? import.meta.dir : dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, "deck.html");

const W = 1920, H = 1080;

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 400)); // let webfonts settle

const slides = await page.$$(".slide");
let n = 0;
for (const slide of slides) {
  n++;
  const num = String(n).padStart(2, "0");
  const out = resolve(__dirname, `kantar-${num}.png`);
  await slide.screenshot({ path: out, type: "png" });
  console.log(`Generated kantar-${num}.png`);
}

await browser.close();
console.log(`Done — ${slides.length} slides at ${W}x${H} (2x).`);
