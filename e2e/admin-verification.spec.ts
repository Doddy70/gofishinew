import { test, expect } from '@playwright/test';
import prisma from '../src/lib/prisma';

test.describe('Admin Verification Flow', () => {
  let vendorEmail: string;
  let adminEmail: string;

  test.beforeAll(async () => {
    const uniqueSuffix = Math.random().toString(36).substring(2, 9);
    vendorEmail = `pending-vendor-${uniqueSuffix}@gofishi.com`;
    adminEmail = `admin-${uniqueSuffix}@gofishi.com`;
    
    // 2. Create a pending vendor user directly in DB
    const createdUser = await prisma.user.create({
      data: {
        id: `vendor-id-${uniqueSuffix}`,
        name: 'Kapten Budi',
        email: vendorEmail,
        role: 'HOST',
        hostStatus: 'PENDING',
        captainLicense: 'https://example.com/license.pdf',
        boatSafetyCert: 'https://example.com/safety.pdf'
      }
    });
    console.log("=== KAPTEN BUDI DIBUAT DENGAN ID ===", createdUser.id);
    
    // Wait for Supabase to commit the record globally
    await new Promise(resolve => setTimeout(resolve, 2000));

    const count = await prisma.user.count({ where: { hostStatus: 'PENDING' } });
    console.log("=== JUMLAH PENDING VENDOR DI DB SAAT INI ===", count);
  });

  test.afterAll(async () => {
    // Cleanup using unique emails is not strictly necessary for local DB
    await prisma.$disconnect();
  });

  test('should allow admin to approve a pending vendor', async ({ page }) => {
    // Listen to console and errors
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

    // Wait, Better Auth requires the user to actually log in via the UI to get a session cookie.
    // Instead of seeding the user without a password, we should register them via the UI, 
    // then use Prisma to set the admin role, then log in.

    // Step 1: Register the Admin via UI
    await page.goto('/');
    await page.getByRole('button').filter({ has: page.locator('svg.text-gray-600') }).click();
    await page.getByText('Daftar', { exact: true }).click();
    await page.fill('input[name="name"]', 'Super Admin');
    await page.fill('input[name="email"]', adminEmail);
    await page.fill('input[name="password"]', 'AdminPass123!');
    await page.getByRole('button', { name: 'Setuju dan Lanjutkan' }).click();
    
    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await page.waitForTimeout(1000); // Wait for DB commit to settle

    // Step 2: Elevate to ADMIN via Prisma
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'ADMIN' }
    });

    // Step 3: Go to Admin Panel Verification page
    await page.goto('/admin/verifications');
    
    // Force a hard reload to completely break Next.js client-side router cache
    // since the page might have been prefetched while the user was still a GUEST
    await page.reload({ waitUntil: 'networkidle' });

    // Verify page loaded
    await expect(page.getByRole('heading', { name: 'Verifikasi Vendor' })).toBeVisible();

    // Debugging DOM
    const html = await page.content();
    console.log("=== HALAMAN HTML ===", html.substring(0, 1500)); // Print first 1500 chars

    // Verify Kapten Budi is in the list
    await expect(page.getByText('Kapten Budi').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(vendorEmail).first()).toBeVisible({ timeout: 10000 });

    // Step 4: Click Approve
    const approveBtn = page.getByRole('button', { name: 'Setujui' }).first();
    await approveBtn.click();

    // Verify status changed or toast appeared
    await expect(page.locator('text=Vendor berhasil disetujui')).toBeVisible({ timeout: 5000 });
    
    // Verify Kapten Budi is no longer pending (or status shows Approved)
    await expect(page.getByText('APPROVED').first()).toBeVisible();
  });
});
