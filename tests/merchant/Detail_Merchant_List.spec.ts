import { test, expect } from '@playwright/test';
import { MerchantListPage } from '../../pages/merchant-list.page';
import { MerchantDetailPage } from '../../pages/merchant-detail.page';

test.describe('Eksplorasi Fitur Halaman Merchant Detail (POM)', () => {
  let merchantListPage: MerchantListPage;
  let merchantDetailPage: MerchantDetailPage;

  test.beforeEach(async ({ page }) => {
    merchantListPage = new MerchantListPage(page);
    merchantDetailPage = new MerchantDetailPage(page);

    // 1. Navigasi ke List
    await merchantListPage.navigateToMerchantList();

    // 2. Masuk ke Detail Merchant Pertama
    await merchantListPage.btnViewDetail.first().click();

    // 3. Pastikan sudah di halaman detail
    await expect(merchantDetailPage.tabOutletList).toBeVisible({ timeout: 15000 });
  });

  // --- SKENARIO 1: TAB INFO ---
  test('Eksplorasi Tab Info (Membuka Accordion)', async ({ page }) => {
    await merchantDetailPage.expandAllInfo();
  });

  // --- SKENARIO 2: TAB OUTLET LIST ---
  test('Eksplorasi Tab Outlet List', async ({ page }) => {
    await merchantDetailPage.openTab('Outlet List');
    
    // Klik action icon & Toggle (menggunakan locator langsung karena sangat spesifik)
    await page.locator('td > div > .py-3 > .h-4').first().click();
    await page.getByText('Off').first().click();
    
    await merchantDetailPage.searchInsideTab('Testing Outlet');
  });

  // --- SKENARIO 3: TAB BRAND ---
  test('Eksplorasi Tab Brand', async ({ page }) => {
    await merchantDetailPage.openTab('Brand');
    await merchantDetailPage.searchInsideTab('apa');

    // Buka detail brand lalu tutup
    await page.locator('.cursor-pointer.rounded-md.p-1').first().click();
    await merchantDetailPage.closeModal('modal-brand-detail');

    // Buka Create Brand lalu tutup
    await merchantDetailPage.btnCreateBrand.click();
    await merchantDetailPage.closeModal('modal-create-brand');
  });

});