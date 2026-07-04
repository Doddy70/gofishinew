const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });

  await page.waitForTimeout(2000);
  console.log('Page loaded');

  // Find user menu button
  const menuBtn = await page.$('button[class*="rounded-full"]');
  if (menuBtn) {
    console.log('Found menu button, clicking...');
    await menuBtn.click();
    await page.waitForTimeout(1000);

    // Look for Masuk - use JavaScript click
    const masukLink = await page.getByText('Masuk').first();
    if (masukLink) {
      console.log('Found Masuk, clicking via JS...');
      await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        for (const el of elements) {
          if (el.textContent === 'Masuk') {
            el.click();
            break;
          }
        }
      });
      await page.waitForTimeout(2000);
    }
  }

  await page.screenshot({ path: '/tmp/gofishi-modal-test.png', fullPage: false });
  console.log('Screenshot saved');

  const fixedElements = await page.$$('[class*="fixed inset-0"]');
  console.log(`Fixed elements: ${fixedElements.length}`);

  await browser.close();
})();
