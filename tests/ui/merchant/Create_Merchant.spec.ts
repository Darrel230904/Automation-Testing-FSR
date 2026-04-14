import { test, expect } from '@playwright/test';
import { CreateMerchantPage } from '../../../pages/create-merchant.page';
import path from 'path';

test.describe('Eksplorasi Halaman Create Merchant (Multi-step Form)', () => {
  let createMerchantPage: CreateMerchantPage;

  test.beforeEach(async ({ page }) => {
    createMerchantPage = new CreateMerchantPage(page);
    await createMerchantPage.navigateToCreateMerchant();
  });

  test('End-to-End: Berhasil membuat Merchant Baru', async ({ page }) => {
    // 1. Tentukan nama unik agar tidak bentrok dengan data lain
    const uniqueName = `Klinik Matahari`;
    
    // 2. Siapkan path/jalur menuju file logo dummy kamu
    const logoPath = path.join(__dirname, '../../fixtures/merchant logo.jpg');

    // --- EKSEKUSI TAB 1: INFO ---
    // Di tab 1 ini ada proses upload file
    await createMerchantPage.fillTab1Info(uniqueName, logoPath);
    
    // Validasi kita berhasil pindah ke Tab 2 (Muncul field Bank)
    await expect(page.getByText('Settlement & Payment', { exact: true })).toHaveClass(/text-behave-text-primary/); // Validasi tab aktif (opsional)

    // --- EKSEKUSI TAB 2: SETTLEMENT ---
    await createMerchantPage.fillTab2Settlement();

    // --- EKSEKUSI TAB 3: BRAND & SAVE ---
    await createMerchantPage.fillTab3Brand();

    // --- VALIDASI AKHIR ---
    // Pastikan toast sukses muncul
    await expect(createMerchantPage.toastSuccess).toBeVisible({ timeout: 15000 });
    
    // Pastikan robot dilempar kembali ke halaman Merchant List
    await expect(page).toHaveURL(/.*merchant\/list/);
  });

});