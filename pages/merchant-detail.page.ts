import { expect, type Locator, type Page } from '@playwright/test';

export class MerchantDetailPage {
  readonly page: Page;
  readonly tabOutletList: Locator;
  readonly tabBrand: Locator;
  readonly accordionLocation: Locator;
  readonly accordionPIC: Locator;
  readonly accordionSettlement: Locator;
  readonly searchInput: Locator;
  readonly btnCreateBrand: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // 1. DAFTAR ELEMEN
    this.tabOutletList = page.getByRole('button', { name: 'Outlet List' });
    this.tabBrand = page.getByRole('button', { name: 'Brand' });
    
    // Info Accordions
    this.accordionLocation = page.getByRole('button', { name: 'Location' });
    this.accordionPIC = page.getByRole('button', { name: 'PIC' });
    this.accordionSettlement = page.getByRole('button', { name: 'Settlement & Payment' });
    
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    this.btnCreateBrand = page.getByRole('button', { name: 'Create New Brand' });
  }

  // 2. DAFTAR AKSI/FUNGSI
  async openTab(tabName: 'Outlet List' | 'Brand') {
    if (tabName === 'Outlet List') await this.tabOutletList.click();
    if (tabName === 'Brand') await this.tabBrand.click();
  }

  async expandAllInfo() {
    await this.accordionLocation.click();
    await this.accordionPIC.click();
    await this.accordionSettlement.click();
  }

  async searchInsideTab(keyword: string) {
    await this.searchInput.click();
    await this.searchInput.fill(keyword);
  }

  async closeModal(modalId: string) {
    // Menutup modal dengan klik tombol silang 
    await this.page.locator(`#${modalId}`).getByRole('button').filter({ hasText: /^$/ }).click();
  }
}