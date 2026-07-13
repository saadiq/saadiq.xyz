import puppeteer from "puppeteer";
import { resolve } from "path";

// Renders each .slide in an HTML file to its own PDF page, the format LinkedIn
// carousels take. Use render-deck.ts instead when you want PNG slides.
// Usage: bun run render-carousel.ts <html> <output-dir>
const htmlPath = resolve(process.cwd(), process.argv[2]);
const outputDir = resolve(process.cwd(), process.argv[3]);
const browser = await puppeteer.launch({ headless: "shell" });
const page = await browser.newPage();

await page.emulateMediaType("screen");
await page.setViewport({ width: 1600, height: 2000, deviceScaleFactor: 1 });
await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
await page.evaluate(async () => { await document.fonts.ready; });

const count = await page.$$eval(".slide", slides => slides.length);
for (let index = 0; index < count; index++) {
  await page.evaluate((active) => {
    document.body.style.display = "block";
    document.body.style.margin = "0";
    document.querySelectorAll<HTMLElement>(".slide").forEach((slide, i) => {
      slide.style.display = i === active ? "flex" : "none";
    });
  }, index);

  const number = String(index + 1).padStart(2, "0");
  await page.pdf({
    path: `${outputDir}/slide-${number}.pdf`,
    printBackground: true,
    width: "1600px",
    height: "2000px",
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
    pageRanges: "1",
  });
}

await browser.close();
console.log(`Rendered ${count} isolated carousel slides.`);
