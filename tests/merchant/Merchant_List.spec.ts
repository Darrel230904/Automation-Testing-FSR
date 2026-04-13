import { test, expect } from '@playwright/test';
import { MerchantListPage } from '../../pages/merchant-list.page';

test.describe('Eksplorasi Fitur Halaman Merchant List (POM)', () => {
  let merchantListPage: MerchantListPage;

  test.beforeEach(async ({ page }) => {
    // Panggil remote control-nya, lalu suruh navigasi ke tabel
    merchantListPage = new MerchantListPage(page);
    await merchantListPage.navigateToMerchantList();
  });

  // --- SKENARIO 1: FITUR SEARCH ---
  test('Fitur Search (Positif & Negatif)', async ({ page }) => {
    // Positif
    await merchantListPage.search('Coba QA');
    await expect(page.getByRole('row', { name: /Coba QA/i }).first()).toBeVisible();

    // Negatif
    await merchantListPage.search('KXXX');
    await expect(page.getByText('No Merchants Found')).toBeVisible();
  });

  // --- SKENARIO 2: FITUR FILTER ---
  test('Fitur Filter Merchant Type & Category', async ({ page }) => {
    await merchantListPage.selectType('Redemption');
    await merchantListPage.selectCategory('Beauty');

    await expect(merchantListPage.tableRow.first()).toBeVisible();
  });

  // --- SKENARIO 3: FITUR COLUMN VISIBILITY ---
  test('Fitur Column Visibility', async ({ page }) => {
    await merchantListPage.toggleColumn('Priority');
    await merchantListPage.toggleColumn('Provider');
    await merchantListPage.closeDropdown();
  });

});