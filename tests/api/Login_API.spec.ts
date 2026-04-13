import { test, expect } from '@playwright/test';

test.describe('API Testing: Modul Login', () => {

  // --- SKENARIO 1: POSITIVE TEST ---
  test('Positive: Login Berhasil via API', async ({ request }) => {
    const response = await request.post(`${process.env.API_BASE_URL}/api/v1/cms/login`, {
      data: {
        email: process.env.LOGIN_EMAIL, 
        password: process.env.LOGIN_PASSWORD 
      }
    });

    // Validasi API sukses (Status 200)
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    
    expect(responseBody.status).toBe('SUCCESS');
    expect(responseBody.message).toBe('Success');
  });


  // --- SKENARIO 2: NEGATIVE TEST (Password Salah) ---
  test('Negative: Login Gagal karena Password Salah', async ({ request }) => {
    const response = await request.post(`${process.env.API_BASE_URL}/api/v1/cms/login`, {
      data: {
        email: process.env.LOGIN_EMAIL, 
        password: 'PasswordSalah123!' 
      }
    });

    expect(response.ok()).toBeFalsy(); 
    
    const responseBody = await response.json();
    console.log('Error Password Salah:', responseBody);
  });


  // --- SKENARIO 3: NEGATIVE TEST (Email & Password Kosong) ---
  test('Negative: Login Gagal karena email dan password kosong', async ({ request }) => {
    const response = await request.post(`${process.env.API_BASE_URL}/api/v1/cms/login`, {
      data: {
        email: '', 
        password: '' 
      }
    });

    expect(response.ok()).toBeFalsy();
  });


  // --- SKENARIO 4: NEGATIVE TEST (Format Email Tidak Valid) ---
  test('Negative: Login Gagal karena format Email tidak valid', async ({ request }) => {
    const response = await request.post(`${process.env.API_BASE_URL}/api/v1/cms/login`, {
      data: {
        email: 'darel=+@yopmail.com', 
        password: process.env.LOGIN_PASSWORD 
      }
    });

    // Harus ditolak oleh server
    expect(response.ok()).toBeFalsy();
    
    // Opsional: Cek pesan errornya
    const responseBody = await response.json();
    console.log('Error Email Invalid:', responseBody);
  });

});