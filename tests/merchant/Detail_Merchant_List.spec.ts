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
    await expect(merchantDetailPage.accordionLocation).toBeVisible();
    await expect(merchantDetailPage.accordionPIC).toBeVisible();
  });
  
  // --- SKENARIO 2: TAB OUTLET LIST ---
  test('Eksplorasi Tab Outlet List (Validasi Search)', async ({ page }) => {
    await merchantDetailPage.openTab('Outlet List');
    
    // Klik action icon & Toggle
    await page.locator('td > div > .py-3 > .h-4').first().click();
    await page.getByText('Off').first().click();
    
    // Ketik pencarian
    await merchantDetailPage.searchInsideTab('Testing Outlet');

    // VALIDASI: Pastikan tabel outlet merespons pencarian (Mengecek apakah baris tabel muncul, atau pesan "No Data" muncul)
    const tableBody = page.locator('tbody tr').first();
    await expect(tableBody).toBeVisible();
  });

  // --- SKENARIO 3: TAB BRAND ---
  test('Eksplorasi Tab Brand', async ({ page }) => {
    await merchantDetailPage.openTab('Brand');
    await merchantDetailPage.searchInsideTab('apa');

    // Validasi Modal Brand Detail
    await page.locator('.cursor-pointer.rounded-md.p-1').first().click();
    await expect(merchantDetailPage.modalBrandDetail).toBeVisible(); 
    
    await merchantDetailPage.closeModal('modal-brand-detail');
    await expect(merchantDetailPage.modalBrandDetail).toBeHidden();

    // Validasi Modal Create New Brand
    await merchantDetailPage.btnCreateBrand.click();
    await expect(merchantDetailPage.modalCreateBrand).toBeVisible();
    
    await merchantDetailPage.closeModal('modal-create-brand');
    await expect(merchantDetailPage.modalCreateBrand).toBeHidden();
  });

  // --- SKENARIO 4: NEGATIVE SEARCH OUTLET ---
  test('Eksplorasi Tab Outlet List (Negative Search)', async ({ page }) => {
    await merchantDetailPage.openTab('Outlet List');
    
    // Mencari outlet yang sudah pasti tidak ada
    await merchantDetailPage.searchInsideTab('DATA-TIDAK-VALID-12345');

    // VALIDASI: Pastikan tabel menampilkan pesan data tidak ditemukan
    await expect(page.getByText('No outlets have been created yet')).toBeVisible();
  });

  // --- SKENARIO 5: FORM VALIDATION CREATE BRAND ---
  test('Validasi Form Create New Brand (Negative Test)', async ({ page }) => {
    await merchantDetailPage.openTab('Brand');
    await merchantDetailPage.btnCreateBrand.click();
    
    // Pastikan modal terbuka
    await expect(merchantDetailPage.modalCreateBrand).toBeVisible();

    // Karena tidak mengisi apapun, tombol Save HARUS disable
    await expect(merchantDetailPage.btnSubmitBrand).toBeDisabled();

    // Tutup modal kembali agar bersih
    await merchantDetailPage.closeModal('modal-create-brand');
  });

});