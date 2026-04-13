import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // 1. DAFTAR ELEMEN (Semua locator dikumpulkan di sini)
    this.emailInput = page.getByRole('textbox', { name: 'Enter your email address' });
    this.passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
  }

  // 2. DAFTAR AKSI/FUNGSI
  // Fungsi untuk buka URL
  async goto() {
    await this.page.goto(`${process.env.BASE_URL}/login`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  }

  // Fungsi untuk melakukan login (menggabungkan klik dan ketik)
  async login(email: string, password: string) {
    await this.emailInput.click();
    await this.emailInput.fill(email);
    
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    
    await this.signInButton.click();
  }
}