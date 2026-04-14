import { test, expect } from '@playwright/test';
import { CreateMerchantPage } from '../../../pages/create-merchant.page';
import { MerchantListPage } from '../../../pages/merchant-list.page';
import path from 'path';

test.describe('Eksplorasi Halaman Create Merchant (Multi-step Form)', () => {
  let createMerchantPage: CreateMerchantPage;

  test.beforeEach(async ({ page }) => {
    createMerchantPage = new CreateMerchantPage(page);
    await createMerchantPage.navigateToCreateMerchant();
  });

  test('End-to-End: Berhasil membuat Merchant Baru kemudian menghapusnya', async ({ page }) => {
    
    const uniqueName = `Klinik Matahari`;
    const logoPath = path.join(__dirname, '../../fixtures/merchant logo.jpg');

    // FASE 1: CREATE MERCHANT
    // --- EKSEKUSI TAB: INFO ---
    await createMerchantPage.fillTab1Info(uniqueName, logoPath);
    
    // Validasi kita berhasil pindah ke Tab 2 (Muncul field Bank)
    await expect(page.getByText('Settlement & Payment', { exact: true })).toHaveClass(/text-behave-text-primary/);

    // --- EKSEKUSI TAB: SETTLEMENT ---
    await createMerchantPage.fillTab2Settlement();

    // --- EKSEKUSI TAB: BRAND & SAVE ---
    await createMerchantPage.fillTab3Brand();

    // --- VALIDASI AKHIR ---
    // Pastikan toast sukses muncul
    await expect(createMerchantPage.toastSuccess).toBeVisible({ timeout: 15000 });
    
    // Pastikan robot dilempar kembali ke halaman Merchant List
    await expect(page).toHaveURL(/.*merchant\/list/);

    // FASE 2: DELETE MERCHANT
    const merchantListPage = new MerchantListPage(page);

    await merchantListPage.search(uniqueName);
    const barisMerchantBaru = page.locator('tr', { hasText: uniqueName });
    await expect(barisMerchantBaru).toBeVisible();

    await barisMerchantBaru.locator('.bg-\\[\\#FFEDED\\]').last().click();

    await expect(page.getByText(/Are you sure you want to delete/i)).toBeVisible();
    await merchantListPage.btnConfirmDelete.click();

    await expect(merchantListPage.toastSuccessDelete).toBeVisible();

    // Validasi akhir
    await merchantListPage.search(uniqueName);
    await expect(page.getByText(/No Merchants Found/i)).toBeVisible();
  });

});