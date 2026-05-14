import puppeteer from "puppeteer";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = typeof import.meta.dir === "string" ? import.meta.dir : dirname(fileURLToPath(import.meta.url));
const outputFile = process.argv[2] || resolve(__dirname, "quote-card.png");
const htmlPath = process.argv[3]
  ? resolve(process.cwd(), process.argv[3])
  : resolve(__dirname, "templates/quote-card.html");

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
