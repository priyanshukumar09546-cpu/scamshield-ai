const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const OUT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');

const VIEWPORTS = [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1280', width: 1280, height: 800 },
];

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2, isMobile: vp.width < 768 });
    await page.goto('http://localhost:3000/check', { waitUntil: 'networkidle0' });

    // Check horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const hasHorizontalOverflow = scrollWidth > clientWidth;

    console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}): clientWidth=${clientWidth}, scrollWidth=${scrollWidth}, overflow=${hasHorizontalOverflow}`);

    if (hasHorizontalOverflow) {
      console.error(`WARNING: Viewport ${vp.name} has horizontal overflow!`);
    }

    // Save screenshot
    await page.screenshot({ path: path.join(OUT_DIR, `${vp.name}.png`), fullPage: false });
  }

  // Also refresh main mobile.png
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile.png'), fullPage: false });

  await browser.close();
  console.log('Mobile viewport audit complete! All screenshots captured.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
