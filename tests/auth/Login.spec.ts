import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

// Kosongkan session/cookies khusus untuk file ini saja
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Pengujian Modul Login (Menggunakan POM)', () => {
  let loginPage: LoginPage;

  // Sebelum tiap tes, inisialisasi "remote control" dan buka URL
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // --- SKENARIO 1: NEGATIVE TEST ---
  test('Negative: Login Gagal karena Password Salah', async ({ page }) => {
    // Lihat betapa rapinya kode ini sekarang! Cukup panggil fungsi login()
    await loginPage.login(process.env.LOGIN_EMAIL as string, 'passoword salah!');
    
    await expect(page.getByText('Password must have 8+ characters, uppercase, lowercase, number, and symbol')).toBeVisible();
    await expect(page).toHaveURL(/.*login/);
  });

  // --- SKENARIO 2: NEGATIVE TEST ---
  test('Negative: Login Gagal karena email dan password kosong', async ({ page }) => {
    await loginPage.login('', '');
    
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
    await expect(page).toHaveURL(/.*login/);
  });

  // --- SKENARIO 3: NEGATIVE TEST ---
  test('Negative: Login Gagal karena format Email tidak valid', async ({ page }) => {
    await loginPage.login('darel=+@yopmail.com', process.env.LOGIN_PASSWORD as string);
    
    await expect(page.getByText('Invalid email format')).toBeVisible();
    await expect(page).toHaveURL(/.*login/);
  });

  // --- SKENARIO 4: POSITIVE TEST ---
  test('Positive: Login Berhasil dengan Password Benar', async ({ page }) => {
    await loginPage.login(process.env.LOGIN_EMAIL as string, process.env.LOGIN_PASSWORD as string);
    
    await expect(page).toHaveURL(`${process.env.BASE_URL}/splashscreen`);
    await expect(page.getByText('Login successfully')).toBeVisible();
    await expect(page).toHaveURL(`${process.env.BASE_URL}/home`);
  });

});