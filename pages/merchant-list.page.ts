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
  readonly headerMerchantName: Locator;
  readonly btnNextPage: Locator;
  readonly btnPrevPage: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // 1. DAFTAR ELEMEN
    this.menuMerchant = page.getByRole('button', { name: 'Merchant' }).first(); 

    this.menuMerchantList = page.getByRole('link', { name: 'Merchant List' });

    this.searchInput = page.getByPlaceholder('Search');

    this.tableRow = page.locator('tbody tr');
    
    this.filterMerchantType = page.locator('div').filter({ hasText: /^Merchant Type$/ }).nth(1);

    this.filterMerchantCategory = page.getByText('Merchant Category').nth(1);

    this.btnColumnVisibility = page.getByText('Column Visibility');

    this.btnViewDetail = page.locator('.cursor-pointer.rounded-md');

    this.headerMerchantName = page.locator('th').filter({ hasText: 'Name' }).first();

    this.btnNextPage = page.getByText('Next'); 

    this.btnPrevPage = page.getByText('Previous');
  }

  // 2. DAFTAR AKSI/FUNGSI
  async navigateToMerchantList() {
    await this.page.goto(`${process.env.BASE_URL}/home`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await this.menuMerchant.click();
    await this.menuMerchantList.click();
    await expect(this.page).toHaveURL(/.*merchant\/list/);
    await expect(this.tableRow.first()).toBeVisible({ timeout: 15000 });
  }

  async search(keyword: string) {
    await this.searchInput.clear();
    await this.searchInput.fill(keyword);
  }

  async selectType(type: string) {
    await this.filterMerchantType.click();
    await this.page.getByRole('listitem').filter({ hasText: type }).click();
  }

  async selectCategory(category: string) {
    await this.filterMerchantCategory.click();
    await this.page.getByRole('listitem').filter({ hasText: category }).click();
  }

  async toggleColumn(columnName: string) {
    await this.btnColumnVisibility.click();
    await this.page.getByRole('listitem').filter({ hasText: columnName }).click();
  }

  async closeDropdown() {
    await this.page.keyboard.press('Escape');
  }

  async sortByMerchantName() {
    await this.headerMerchantName.click();
    // Tunggu sebentar agar tabel selesai mengurutkan data
    await this.page.waitForTimeout(1000); 
  }

  async goToNextPage() {
    await this.btnNextPage.click();
    await this.page.waitForTimeout(1000);
  }
  
  // --- UBAH FUNGSI INI ---
  async changeEntriesTo5() {
    await this.page.getByText('10').last().click(); 
    await this.page.getByText('5', { exact: true }).last().click(); 
    await this.page.waitForTimeout(1000); 
  }

}