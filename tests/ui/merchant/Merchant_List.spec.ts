import { test, expect } from '@playwright/test';
import { MerchantListPage } from '../../../pages/merchant-list.page';

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

  // --- SKENARIO 4: EDGE CASE SEARCH ---
  test('Fitur Search (Karakter Spesial/Edge Case)', async ({ page }) => {
    // Mencari menggunakan simbol tidak masuk akal untuk memastikan web tidak crash/error 500
    await merchantListPage.search('@#$!%^&*');
    
    // Web tetap berjalan normal dan menampilkan pesan 'No Merchants Found'
    await expect(page.getByText('No Merchants Found')).toBeVisible();
  });

  // --- SKENARIO 5: FITUR SORTING ---
  test('Fitur Sorting pada Kolom Tabel', async ({ page }) => {
    // Simpan teks dari baris pertama SEBELUM di-sort
    const textSebelumSort = await merchantListPage.tableRow.first().innerText();

    // Klik header untuk mengurutkan (Sort)
    await merchantListPage.sortByMerchantName();

    // Simpan teks dari baris pertama SESUDAH di-sort
    const textSesudahSort = await merchantListPage.tableRow.first().innerText();

    // Validasi: Baris pertama harusnya berubah datanya karena urutannya berubah
    expect(textSebelumSort).not.toEqual(textSesudahSort);
  });

  // --- SKENARIO 6: FITUR PAGINATION ---
  test('Fitur Navigasi Halaman (Pagination)', async ({ page }) => {
    // 1. Ubah jumlah tampilan menjadi 5 data menggunakan klik
    await merchantListPage.changeEntriesTo5();

    // 2. Pastikan tombol Next sekarang terlihat
    await expect(merchantListPage.btnNextPage).toBeVisible();
    
    // 3. Klik halaman selanjutnya
    await merchantListPage.goToNextPage();

    // 4. Validasi: Pastikan tabel tetap memunculkan data
    await expect(merchantListPage.tableRow.first()).toBeVisible();
  });

});