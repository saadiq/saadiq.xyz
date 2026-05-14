import puppeteer from "puppeteer";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = typeof import.meta.dir === "string" ? import.meta.dir : dirname(fileURLToPath(import.meta.url));

const htmlArg = process.argv[2];
const outArg = process.argv[3];

if (!htmlArg || !outArg) {
  console.error("Usage: bun run render-cover-once.ts <html-file> <output-png>");
  process.exit(1);
}

const htmlPath = resolve(process.cwd(), htmlArg);
const outputFile = resolve(process.cwd(), outArg);

const WIDTH = 1900;
const HEIGHT = 400;
const DPR = 2;

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: DPR });
await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });

await page.screenshot({
  path: outputFile,
  type: "png",
  clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
});

await browser.close();
console.log(`Generated ${outputFile} (${WIDTH * DPR}×${HEIGHT * DPR})`);
