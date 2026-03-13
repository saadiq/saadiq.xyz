import puppeteer from "puppeteer";
import { resolve } from "path";

const outputFile = process.argv[2] || resolve(import.meta.dir, "quote-card.png");
const htmlPath = resolve(import.meta.dir, "quote-card.html");

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

await page.setViewport({ width: 1600, height: 2000, deviceScaleFactor: 1 });
await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });

await page.screenshot({
  path: outputFile,
  type: "png",
  clip: { x: 0, y: 0, width: 1600, height: 2000 },
});

await browser.close();
console.log(`Generated ${outputFile} (1600×2000)`);
