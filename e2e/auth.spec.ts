import { test, expect } from '@playwright/test';

test.describe('Vendor Journey', () => {
  const testEmail = `vendor-${Date.now()}@example.com`;
  const testPassword = 'Password123!';

  test('should register as a vendor and access dashboard', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    page.on('response', async response => {
      if (response.status() >= 400) {
        console.log(`API ERROR: ${response.url()} status ${response.status()}`);
        try {
          const body = await response.json();
          console.log('API ERROR BODY:', JSON.stringify(body, null, 2));
        } catch (e) {}
      }
    });

    await page.goto('/');

    // 1. Open Register Modal
    const userMenu = page.getByRole('button').filter({ has: page.locator('svg.text-gray-600') });
    await userMenu.click();
    await page.getByText('Daftar', { exact: true }).click();

    // 2. Fill Registration Form
    await page.waitForSelector('input[name="name"]', { state: 'visible' });
    await page.fill('input[name="name"]', 'Test Vendor');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);

    // Click "Setuju dan Lanjutkan"
    const registerBtn = page.getByRole('button', { name: 'Setuju dan Lanjutkan' });
    await registerBtn.click();

    // Check for success or error toast
    // We expect the success toast to appear if registration is successful
    const successToast = page.locator('text=Akun berhasil dibuat!');
    const errorToast = page.locator('div.hot-toast-content'); // Generic toast check

    // Wait for either redirect or error
    await Promise.race([
      expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 }),
      expect(successToast).toBeVisible({ timeout: 10000 })
    ]);

    // 3. Verify Dashboard content
    await expect(page.getByText('Tugas Anda')).toBeVisible();
  });
});
