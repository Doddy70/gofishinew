import { test, expect } from '@playwright/test';

test.describe('Header Navigation', () => {
  test('Navbar shows weather widget and HeroSearch responsive behavior', async ({ page }) => {
    // Go to the homepage
    await page.goto('http://localhost:3000');
    
    // Check if Navbar exists
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();

    // The Weather Widget should be visible on Desktop
    // Note: This relies on the static text added in Navbar.tsx
    await expect(page.getByText('32°C')).toBeVisible();
    await expect(page.getByText('12 kn')).toBeVisible();
    await expect(page.getByText('0.8m')).toBeVisible();
    
    // Check if HeroSearch expanded pill is visible initially
    await expect(page.getByText('Cari destinasi', { exact: true })).toBeVisible();
    
    // Scroll down to trigger shrink
    await page.evaluate(() => window.scrollTo(0, 200));
    // Need to wait for scroll event to fire and state to update
    await page.waitForTimeout(500);
    
    // Check if it shrinked. The expanded text might be hidden via pointer-events-none or opacity-0
    // We can check if the shrinked pill is visible (it has "Cari destinasi")
    const shrinkedCari = page.locator('span', { hasText: /^Cari destinasi$/ }).first();
    await expect(shrinkedCari).toBeVisible();

    // Scroll back up slightly to trigger expand
    await page.evaluate(() => window.scrollTo(0, 50));
    await page.waitForTimeout(500);
    
    // Should be expanded again (check for LOKASI text which is unique to expanded state)
    await expect(page.getByText('LOKASI', { exact: true })).toBeVisible();
  });
});
