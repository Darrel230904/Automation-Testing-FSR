import { expect, type Locator, type Page } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export class MerchantCategoryPage {
  readonly page: Page;
  
  // --- NAVIGASI & TABEL ---
  readonly menuMerchant: Locator;
  readonly menuCategory: Locator;
  readonly searchInput: Locator;
  readonly tableRow: Locator;
  readonly btnAddCategory: Locator;
  readonly dropdownEntries: Locator;

  // --- MODAL CREATE / EDIT ---
  readonly inputCategoryName: Locator;
  readonly btnSave: Locator;
  readonly btnEdit: Locator;
  readonly btnSaveChanges: Locator;
  
  // --- MODAL DELETE ---
  readonly btnConfirmDelete: Locator;

  // --- TOAST NOTIFICATION (Pesan Sukses) ---
  readonly toastSuccess: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Navigasi
    this.menuMerchant = page.getByRole('button', { name: 'Merchant' }).first(); 
    this.menuCategory = page.getByRole('link', { name: 'Merchant Category' });
    
    // Halaman Utama Category
    this.searchInput = page.getByPlaceholder('Search');
    this.tableRow = page.locator('tbody tr');
    this.btnAddCategory = page.getByRole('button', { name: 'Add Merchant Category' });
    this.dropdownEntries = page.locator('select').first(); // Sesuai dengan yang ada di webmu

    // Elemen di dalam Modal
    // Menggunakan getByRole textbox karena biasanya input nama hanya satu-satunya textbox di modal itu
    this.inputCategoryName = page.getByPlaceholder('Merchant Category Name'); 
    this.btnSave = page.getByRole('button', { name: 'Save', exact: true });
    this.btnEdit = page.getByRole('button', { name: 'Edit', exact: true });
    this.btnSaveChanges = page.getByRole('button', { name: 'Save Changes', exact: true });
    
    // Modal Delete
    this.btnConfirmDelete = page.getByRole('button', { name: 'Delete', exact: true });

    // Toast Pop-up hijau di pojok kanan atas
    this.toastSuccess = page.getByText(/Success/i).first();
  }

  // --- FUNGSI NAVIGASI ---
  async navigateToCategory() {
    await this.page.goto(`${process.env.BASE_URL}/home`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await this.menuMerchant.click();
    await this.menuCategory.click();
    await expect(this.page).toHaveURL(/.*merchant\/category/);
    await expect(this.tableRow.first()).toBeVisible({ timeout: 15000 });
  }

  // --- FUNGSI INTERAKSI ---
  async search(keyword: string) {
    await this.searchInput.clear();
    await this.searchInput.fill(keyword);
    await this.page.waitForTimeout(1000); // Tunggu tabel merespons
  }
}