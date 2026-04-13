import { test, expect } from '@playwright/test';
import { MerchantCategoryPage } from '../../pages/merchant-category.page';

test.describe('Eksplorasi Halaman Merchant Category (CRUD & Search)', () => {
  let categoryPage: MerchantCategoryPage;

  test.beforeEach(async ({ page }) => {
    categoryPage = new MerchantCategoryPage(page);
    await categoryPage.navigateToCategory();
  });

  // --- SKENARIO 1: SEARCH EDGE CASE ---
  test('Negative Search Data Tidak Ditemukan', async ({ page }) => {
    // Sesuai video: Ketik AAA
    await categoryPage.search('AAA');

    // Validasi: Muncul teks No Merchant Category Found
    await expect(page.getByText('No Merchant Category Found')).toBeVisible();
  });

  // --- SKENARIO 2: END-TO-END CRUD (Create, Read, Update, Delete) ---
  // Skenario ini dibuat bersambung dalam 1 test agar datanya mengalir (TEST -> TEST 1 -> Dihapus)
  test('End-to-End CRUD Flow (Add, Edit, Delete Category)', async ({ page }) => {
    const namaKategoriAwal = 'TEST';
    const namaKategoriEdit = 'TEST 1';

    // ==========================================
    // 1. CREATE (ADD NEW CATEGORY)
    // ==========================================
    await categoryPage.btnAddCategory.click();
    
    // Validasi modal terbuka
    await expect(page.getByText('Create Merchant Category', { exact: true })).toBeVisible();
    
    // Isi data dan simpan
    await categoryPage.inputCategoryName.fill(namaKategoriAwal);
    await categoryPage.btnSave.click();

    // Validasi toast sukses muncul lalu hilang
    await expect(categoryPage.toastSuccess).toBeVisible();
    await expect(categoryPage.toastSuccess).toBeHidden({ timeout: 10000 }); 

    // ==========================================
    // 2. READ (SEARCH & VERIFY)
    // ==========================================
    await categoryPage.search(namaKategoriAwal);
    // Pastikan baris yang dicari muncul di tabel
    const barisKategori = page.locator('tr', { hasText: namaKategoriAwal });
    await expect(barisKategori).toBeVisible();

    // ==========================================
    // 3. UPDATE (EDIT CATEGORY)
    // ==========================================
    // Klik ikon mata/edit (asumsi ikon berwarna biru dengan icon eye, ambil button action pertama)
    await barisKategori.locator('td button').first().click();

    // Di video, kamu klik tombol Edit dulu agar inputnya bisa diisi
    await categoryPage.btnEdit.click();
    await categoryPage.inputCategoryName.clear();
    await categoryPage.inputCategoryName.fill(namaKategoriEdit);
    await categoryPage.btnSaveChanges.click();

    // Validasi toast sukses muncul lalu hilang
    await expect(categoryPage.toastSuccess).toBeVisible();
    await expect(categoryPage.toastSuccess).toBeHidden({ timeout: 10000 });

    // ==========================================
    // 4. DELETE CATEGORY
    // ==========================================
    // Cari data yang sudah di-edit tadi
    await categoryPage.search(namaKategoriEdit);
    const barisKategoriEdit = page.locator('tr', { hasText: namaKategoriEdit });
    await expect(barisKategoriEdit).toBeVisible();

    // Klik ikon tong sampah (biasanya warna merah, tombol action terakhir)
    await barisKategoriEdit.locator('td button').last().click();

    // Konfirmasi Delete
    await expect(page.getByText('Are you sure want to delete this merchant category?')).toBeVisible();
    await categoryPage.btnConfirmDelete.click();

    // Validasi toast sukses delete
    await expect(categoryPage.toastSuccess).toBeVisible();
    await expect(categoryPage.toastSuccess).toBeHidden({ timeout: 10000 });
    
    // Validasi akhir: Pastikan data 'TEST 1' sudah benar-benar lenyap dari tabel
    await categoryPage.search(namaKategoriEdit);
    await expect(page.getByText('No Merchant Category Found')).toBeVisible();
  });

});