const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const OUT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log('Launching browser using:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Home
  console.log('Capturing Home...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, 'home.png'), fullPage: false });

  // 2. Check / Analysis input
  console.log('Capturing Check page...');
  await page.goto('http://localhost:3000/check', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, 'analysis.png'), fullPage: false });

  // 3. Trigger an actual text analysis to get Risk Result
  console.log('Running analysis for risk-result screenshot...');
  try {
    // Switch to Text tab if needed or click sample button
    const sampleBtn = await page.$('button ::-p-text(High-Yield Fraud)');
    if (sampleBtn) {
      await sampleBtn.click();
    } else {
      // Find textarea and enter text
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.type('Guaranteed ₹25,000 return from ₹5,000 investment in 7 days! Join our VIP Telegram channel.');
      }
    }
    // Click analyze button
    const analyzeBtn = await page.$('button[type="submit"], button ::-p-text(Analyze)');
    if (analyzeBtn) {
      await analyzeBtn.click();
      await page.waitForNetworkIdle({ timeout: 10000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 2000));
    }
  } catch (err) {
    console.warn('Analysis interaction note:', err.message);
  }
  await page.screenshot({ path: path.join(OUT_DIR, 'risk-result.png'), fullPage: false });

  // 4. Dashboard
  console.log('Capturing Dashboard...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, 'dashboard.png'), fullPage: false });

  // 5. History
  console.log('Capturing History...');
  await page.goto('http://localhost:3000/history', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, 'history.png'), fullPage: false });

  // 6. Learn
  console.log('Capturing Learn...');
  await page.goto('http://localhost:3000/learn', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, 'learn.png'), fullPage: false });

  // 7. Report
  console.log('Capturing Report...');
  await page.goto('http://localhost:3000/report', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, 'report.png'), fullPage: false });

  // 8. Mobile Viewport (390x844 iPhone 12/13/14 style)
  console.log('Capturing Mobile...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile.png'), fullPage: false });

  await browser.close();
  console.log('Successfully captured all 8 screenshots into docs/screenshots/');
}

main().catch(err => {
  console.error('Screenshot script error:', err);
  process.exit(1);
});
