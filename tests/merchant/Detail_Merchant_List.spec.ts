import { test, expect } from '@playwright/test';

test.describe('Eksplorasi Fitur Halaman Merchant Detail', () => {

  // --- BEFORE EACH: Langsung tembus dengan Bypass Login ---
  test.beforeEach(async ({ page }) => {
    // 1. Langsung tembus ke Home (Jurus anti-timeout)
    await page.goto(`${process.env.BASE_URL}/home`, { timeout: 60000, waitUntil: 'domcontentloaded' });

    // 2. Masuk ke Merchant List
    await page.getByRole('button', { name: 'Merchant', exact: true }).click();
    await page.getByRole('link', { name: 'Merchant List' }).click();
    await expect(page).toHaveURL(/.*merchant\/list/);
    
    // Tunggu spinner hilang dan data tabel muncul
    await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 15000 });

    // 3. Buka Detail Merchant Pertama
    await page.locator('.cursor-pointer.rounded-md').first().click();

    // Pastikan halaman detail sudah siap sebelum skenario berjalan
    await expect(page.getByRole('button', { name: 'Outlet List' })).toBeVisible({ timeout: 15000 });
  });

  // --- SKENARIO 1: TAB INFO ---
  test('Eksplorasi Tab Info (Membuka Accordion)', async ({ page }) => {
    await page.getByRole('button', { name: 'Location' }).click();
    await page.getByRole('button', { name: 'PIC' }).click();
    await page.getByRole('button', { name: 'Settlement & Payment' }).click();
  });

  // --- SKENARIO 2: TAB OUTLET LIST ---
  test('Eksplorasi Tab Outlet List', async ({ page }) => {
    await page.getByRole('button', { name: 'Outlet List' }).click();
    await page.locator('td > div > .py-3 > .h-4').first().click();
    await page.getByText('Off').first().click();
    
    await page.getByRole('textbox', { name: 'Search' }).click();
    await page.getByRole('textbox', { name: 'Search' }).fill('Testing Outlet');
    await page.getByRole('textbox', { name: 'Search' }).fill('');
  });

  // --- SKENARIO 3: TAB BRAND ---
  test('Eksplorasi Tab Brand', async ({ page }) => {
    await page.getByRole('button', { name: 'Brand' }).click();
    
    await page.getByRole('textbox', { name: 'Search' }).click();
    await page.getByRole('textbox', { name: 'Search' }).fill('apa');

    await page.locator('.cursor-pointer.rounded-md.p-1').first().click();
    await page.locator('#modal-brand-detail').getByRole('button').filter({ hasText: /^$/ }).click();

    await page.getByRole('button', { name: 'Create New Brand' }).click();
    await page.locator('#modal-create-brand').getByRole('button').filter({ hasText: /^$/ }).click();
  });

});