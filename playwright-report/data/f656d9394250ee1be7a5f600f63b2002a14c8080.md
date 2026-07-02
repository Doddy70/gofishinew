# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-verification.spec.ts >> Admin Verification Flow >> should allow admin to approve a pending vendor
- Location: e2e/admin-verification.spec.ts:39:7

# Error details

```
PrismaClientKnownRequestError: 
Invalid `prisma.user.create()` invocation in
/Users/doddykapisha/Downloads/GITDODDY/new-gofishi/airbnb-clone-tutorial-egbontech-main/e2e/admin-verification.spec.ts:14:43

  11 adminEmail = `admin-${uniqueSuffix}@gofishi.com`;
  12 
  13 // 2. Create a pending vendor user directly in DB
→ 14 const createdUser = await prisma.user.create(
Can't reach database server at db.eoygwgikfounwpsfaalt.supabase.co
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import prisma from '../src/lib/prisma';
  3  | 
  4  | test.describe('Admin Verification Flow', () => {
  5  |   let vendorEmail: string;
  6  |   let adminEmail: string;
  7  | 
  8  |   test.beforeAll(async () => {
  9  |     const uniqueSuffix = Math.random().toString(36).substring(2, 9);
  10 |     vendorEmail = `pending-vendor-${uniqueSuffix}@gofishi.com`;
  11 |     adminEmail = `admin-${uniqueSuffix}@gofishi.com`;
  12 |     
  13 |     // 2. Create a pending vendor user directly in DB
> 14 |     const createdUser = await prisma.user.create({
     |                                           ^ PrismaClientKnownRequestError: 
  15 |       data: {
  16 |         id: `vendor-id-${uniqueSuffix}`,
  17 |         name: 'Kapten Budi',
  18 |         email: vendorEmail,
  19 |         role: 'HOST',
  20 |         hostStatus: 'PENDING',
  21 |         captainLicense: 'https://example.com/license.pdf',
  22 |         boatSafetyCert: 'https://example.com/safety.pdf'
  23 |       }
  24 |     });
  25 |     console.log("=== KAPTEN BUDI DIBUAT DENGAN ID ===", createdUser.id);
  26 |     
  27 |     // Wait for Supabase to commit the record globally
  28 |     await new Promise(resolve => setTimeout(resolve, 2000));
  29 | 
  30 |     const count = await prisma.user.count({ where: { hostStatus: 'PENDING' } });
  31 |     console.log("=== JUMLAH PENDING VENDOR DI DB SAAT INI ===", count);
  32 |   });
  33 | 
  34 |   test.afterAll(async () => {
  35 |     // Cleanup using unique emails is not strictly necessary for local DB
  36 |     await prisma.$disconnect();
  37 |   });
  38 | 
  39 |   test('should allow admin to approve a pending vendor', async ({ page }) => {
  40 |     // Listen to console and errors
  41 |     page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  42 |     page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  43 | 
  44 |     // Wait, Better Auth requires the user to actually log in via the UI to get a session cookie.
  45 |     // Instead of seeding the user without a password, we should register them via the UI, 
  46 |     // then use Prisma to set the admin role, then log in.
  47 | 
  48 |     // Step 1: Register the Admin via UI
  49 |     await page.goto('/');
  50 |     await page.getByRole('button').filter({ has: page.locator('svg.text-gray-600') }).click();
  51 |     await page.getByText('Daftar', { exact: true }).click();
  52 |     await page.fill('input[name="name"]', 'Super Admin');
  53 |     await page.fill('input[name="email"]', adminEmail);
  54 |     await page.fill('input[name="password"]', 'AdminPass123!');
  55 |     await page.getByRole('button', { name: 'Setuju dan Lanjutkan' }).click();
  56 |     
  57 |     // Wait for redirect to dashboard
  58 |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  59 |     await page.waitForTimeout(1000); // Wait for DB commit to settle
  60 | 
  61 |     // Step 2: Elevate to ADMIN via Prisma
  62 |     await prisma.user.update({
  63 |       where: { email: adminEmail },
  64 |       data: { role: 'ADMIN' }
  65 |     });
  66 | 
  67 |     // Step 3: Go to Admin Panel Verification page
  68 |     await page.goto('/admin/verifications');
  69 |     
  70 |     // Force a hard reload to completely break Next.js client-side router cache
  71 |     // since the page might have been prefetched while the user was still a GUEST
  72 |     await page.reload({ waitUntil: 'networkidle' });
  73 | 
  74 |     // Verify page loaded
  75 |     await expect(page.getByRole('heading', { name: 'Verifikasi Vendor' })).toBeVisible();
  76 | 
  77 |     // Debugging DOM
  78 |     const html = await page.content();
  79 |     console.log("=== HALAMAN HTML ===", html.substring(0, 1500)); // Print first 1500 chars
  80 | 
  81 |     // Verify Kapten Budi is in the list
  82 |     await expect(page.getByText('Kapten Budi').first()).toBeVisible({ timeout: 10000 });
  83 |     await expect(page.getByText(vendorEmail).first()).toBeVisible({ timeout: 10000 });
  84 | 
  85 |     // Step 4: Click Approve
  86 |     const approveBtn = page.getByRole('button', { name: 'Setujui' }).first();
  87 |     await approveBtn.click();
  88 | 
  89 |     // Verify status changed or toast appeared
  90 |     await expect(page.locator('text=Vendor berhasil disetujui')).toBeVisible({ timeout: 5000 });
  91 |     
  92 |     // Verify Kapten Budi is no longer pending (or status shows Approved)
  93 |     await expect(page.getByText('APPROVED').first()).toBeVisible();
  94 |   });
  95 | });
  96 | 
```