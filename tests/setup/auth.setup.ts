import { test as setup, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

// Lokasi tempat kita akan menyimpan "Kartu Akses" (session)
const authFile = 'playwright/.auth/user.json';

setup('Authenticate once for all tests', async ({ page }) => {
  // 1. Robot melakukan login seperti biasa SATU KALI
  await page.goto(`${process.env.BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
  
  await page.getByRole('textbox', { name: 'Enter your email address' }).click();
  await page.getByRole('textbox', { name: 'Enter your email address' }).fill(process.env.LOGIN_EMAIL as string);
  
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill(process.env.LOGIN_PASSWORD as string);
  
  await page.getByRole('button', { name: 'Sign In' }).click();

  // 2. Tunggu sampai benar-benar masuk ke Home
  await page.waitForURL('**/home', { timeout: 15000 });

  // 3. INI BAGIAN AJAIBNYA: Simpan semua cookies dan session ke file user.json!
  await page.context().storageState({ path: authFile });
});