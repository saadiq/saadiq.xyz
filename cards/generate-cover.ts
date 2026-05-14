import puppeteer from "puppeteer";
import { resolve } from "path";

const outputFile = process.argv[2] || resolve(import.meta.dir, "linkedin-cover.png");
const htmlPath = process.argv[3]
  ? resolve(process.cwd(), process.argv[3])
  : resolve(import.meta.dir, "templates/linkedin-cover.html");

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

await page.setViewport({ width: 1584, height: 396, deviceScaleFactor: 1 });
await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });

await page.screenshot({
  path: outputFile,
  type: "png",
  clip: { x: 0, y: 0, width: 1584, height: 396 },
});

await browser.close();
console.log(`Generated ${outputFile} (1584×396)`);
