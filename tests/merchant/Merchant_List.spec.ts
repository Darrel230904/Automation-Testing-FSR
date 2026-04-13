import { test, expect } from '@playwright/test';

test.describe('Eksplorasi Fitur Halaman Merchant List', () => {

  // --- BEFORE EACH: Langsung tembus karena sudah Bypass Login! ---
  test.beforeEach(async ({ page }) => {
    // Langsung buka halaman Home (Robot otomatis dikenali sebagai Darrel)
    await page.goto(`${process.env.BASE_URL}/home`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    
    // Langsung masuk ke Merchant List
    await page.getByRole('button', { name: 'Merchant', exact: true }).click();
    await page.getByRole('link', { name: 'Merchant List' }).click();
    await expect(page).toHaveURL(/.*merchant\/list/);
    
    // Tunggu spinner hilang
    await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 15000 });
  });

  // --- SKENARIO 1: FITUR SEARCH ---
  test('Fitur Search (Positif & Negatif)', async ({ page }) => {
    // Positif: Cari "Coba QA"
    await page.getByPlaceholder('Search').fill('Coba QA');
    await expect(page.getByRole('row', { name: /Coba QA/i }).first()).toBeVisible();

    // Negatif: Cari data random "KXXX"
    await page.getByPlaceholder('Search').clear();
    await page.getByPlaceholder('Search').fill('KXXX');
    await expect(page.getByText('No Merchants Found')).toBeVisible();
  });

  // --- SKENARIO 2: FITUR FILTER ---
  test('Fitur Filter Merchant Type & Category', async ({ page }) => {
    // 1. Filter Merchant Type -> Pilih Redemption
    await page.locator('div').filter({ hasText: /^Merchant Type$/ }).nth(1).click();
    await page.getByRole('listitem').filter({ hasText: 'Redemption' }).click();

    // 2. Filter Merchant Category -> Pilih Beauty
    await page.getByText('Merchant Category').nth(1).click();
    await page.getByRole('listitem').filter({ hasText: 'Beauty' }).click();

    // Validasi: Pastikan tabel masih memunculkan baris data setelah difilter
    await expect(page.locator('tbody tr').first()).toBeVisible();
  });

  // --- SKENARIO 3: FITUR COLUMN VISIBILITY ---
  test('Fitur Column Visibility', async ({ page }) => {
    // 1. Buka dropdown dan klik Priority
    await page.getByText('Column Visibility').click();
    await page.getByRole('listitem').filter({ hasText: 'Priority' }).click();
    
    // 2. BUKA LAGI dropdown-nya (karena tadi menutup otomatis)
    await page.getByText('Column Visibility').click();
    await page.getByRole('listitem').filter({ hasText: 'Provider' }).click();
  });

});