import { expect, type Locator, type Page } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export class MerchantListPage {
  readonly page: Page;
  readonly menuMerchant: Locator;
  readonly menuMerchantList: Locator;
  readonly searchInput: Locator;
  readonly tableRow: Locator;
  readonly filterMerchantType: Locator;
  readonly filterMerchantCategory: Locator;
  readonly btnColumnVisibility: Locator;
  readonly btnViewDetail: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // 1. DAFTAR ELEMEN
    this.menuMerchant = page.getByRole('button', { name: 'Merchant' }).first(); 
    this.menuMerchantList = page.getByRole('link', { name: 'Merchant List' });
    this.searchInput = page.getByPlaceholder('Search');
    this.tableRow = page.locator('tbody tr');
    
    // Locator dropdown
    this.filterMerchantType = page.locator('div').filter({ hasText: /^Merchant Type$/ }).nth(1);
    this.filterMerchantCategory = page.getByText('Merchant Category').nth(1);
    this.btnColumnVisibility = page.getByText('Column Visibility');
    this.btnViewDetail = page.locator('.cursor-pointer.rounded-md');
  }

  // 2. DAFTAR AKSI/FUNGSI
  // Fungsi untuk masuk ke halaman Merchant List (sudah termasuk bypass login)
  async navigateToMerchantList() {
    await this.page.goto(`${process.env.BASE_URL}/home`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await this.menuMerchant.click();
    await this.menuMerchantList.click();
    await expect(this.page).toHaveURL(/.*merchant\/list/);
    await expect(this.tableRow.first()).toBeVisible({ timeout: 15000 });
  }

  // Fungsi untuk mengetik di kotak pencarian
  async search(keyword: string) {
    await this.searchInput.clear();
    await this.searchInput.fill(keyword);
  }

  // Fungsi untuk memilih dropdown Merchant Type
  async selectType(type: string) {
    await this.filterMerchantType.click();
    await this.page.getByRole('listitem').filter({ hasText: type }).click();
  }

  // Fungsi untuk memilih dropdown Merchant Category
  async selectCategory(category: string) {
    await this.filterMerchantCategory.click();
    await this.page.getByRole('listitem').filter({ hasText: category }).click();
  }

  // Fungsi untuk men-ceklis kolom visibility
  async toggleColumn(columnName: string) {
    await this.btnColumnVisibility.click();
    await this.page.getByRole('listitem').filter({ hasText: columnName }).click();
  }

  // Fungsi untuk menutup dropdown dengan tombol Escape
  async closeDropdown() {
    await this.page.keyboard.press('Escape');
  }
}