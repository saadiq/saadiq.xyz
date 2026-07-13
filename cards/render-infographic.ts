import puppeteer from "puppeteer";
import { resolve } from "path";

const htmlPath = resolve(process.cwd(), process.argv[2]);
const outputFile = resolve(process.cwd(), process.argv[3]);
const selector = process.argv[4] || ".infographic";

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 2800, deviceScaleFactor: 2 });
await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
await page.evaluateHandle("document.fonts.ready");

const el = await page.$(selector);
if (!el) throw new Error(`selector not found: ${selector}`);
await el.screenshot({ path: outputFile, type: "png" });

await browser.close();
console.log(`Generated ${outputFile}`);
