import { expect, type Locator, type Page } from '@playwright/test';

export class CreateMerchantPage {
  readonly page: Page;
  
  // --- Navigasi ---
  readonly menuMerchant: Locator;
  readonly menuCreateMerchant: Locator;
  
  // --- Tombol Global ---
  readonly btnNext: Locator;
  readonly btnSave: Locator;
  readonly toastSuccess: Locator;

  // --- Tab 1: Info (Beberapa elemen kunci) ---
  readonly inputMerchantName: Locator;
  readonly radioProvider: Locator;
  readonly radioRetail: Locator;
  readonly dropdownCategory: Locator;
  readonly radioCodeManual: Locator;
  readonly inputCodeManual: Locator;
  readonly inputPriority: Locator;
  readonly inputDescription: Locator;
  readonly inputFileUpload: Locator; 
  readonly dropdownProvince: Locator;
  readonly dropdownCity: Locator;
  readonly dropdownDistrict: Locator;
  readonly dropdownSubDistrict: Locator;
  readonly inputPostalCode: Locator;
  readonly inputPicName: Locator;
  readonly inputPicPhone: Locator;
  readonly inputPicEmail: Locator;
  readonly accordionLocation: Locator;
  readonly accordionPIC: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Navigasi
    this.menuMerchant = page.getByRole('button', { name: 'Merchant' }).first(); 
    this.menuCreateMerchant = page.getByRole('link', { name: 'Create Merchant' });
    
    // Tombol Bawah
    this.btnNext = page.getByRole('button', { name: 'Next' });
    this.btnSave = page.getByRole('button', { name: 'Save' });
    this.toastSuccess = page.getByText(/Successfully/i).first();

    // Tab 1 Elements (Contoh locator standar)
    this.inputMerchantName = page.getByPlaceholder('Merchant Name');
    this.radioProvider = page.getByText('Provider', { exact: true });
    this.radioRetail = page.getByText('Retail', { exact: true });
    this.dropdownCategory = page.getByText('-Select Category-');
    this.radioCodeManual = page.getByText('Manual', { exact: true });
    this.inputCodeManual = page.getByPlaceholder('Insert Code Manually')
    this.inputPriority = page.getByPlaceholder('Priority Number');
    this.inputDescription = page.getByPlaceholder('Description');
    this.dropdownProvince = page.getByText('-Select Province-', { exact: true });
    this.dropdownCity = page.getByText('-Select City / Regency-', { exact: true });
    this.dropdownDistrict = page.getByText('-Select District-', { exact: true });
    this.dropdownSubDistrict = page.getByText('-Select Sub-District-', { exact: true });
    this.inputPostalCode = page.getByPlaceholder('Postal Code');
    this.inputPicName = page.getByPlaceholder('PIC Name');
    this.inputPicPhone = page.getByPlaceholder('PIC Phone Number');
    this.inputPicEmail = page.getByPlaceholder('PIC Email');
    this.accordionLocation = page.getByRole('button', { name: 'Location' });
    this.accordionPIC = page.getByRole('button', { name: 'PIC' });
    
    // INI PENTING UNTUK UPLOAD: Playwright mencari tag <input type="file">
    this.inputFileUpload = page.locator('input[type="file"]'); 
  }

  // --- FUNGSI NAVIGASI ---
  async navigateToCreateMerchant() {
    await this.page.goto(`${process.env.BASE_URL}/home`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await this.menuMerchant.click();
    await this.menuCreateMerchant.click();
    await expect(this.page).toHaveURL(/.*merchant\/new/);
  }

  // --- FUNGSI PENGISIAN TAB 1 ---
  async fillTab1Info(merchantName: string, imagePath: string) {

    // 1. --- MENGISI NAMA MERCHANT---
    await this.inputMerchantName.fill(merchantName);
    await this.radioProvider.click();
    await this.radioRetail.click();

    // 2. --- MENGISI CATEGORY ---
    await this.dropdownCategory.click();
    // Kita suruh robot pilih 'Beauty'. Kalau mau yang lain, tinggal ganti teksnya.
    await this.page.getByText('Beauty', { exact: true }).click(); 

    // 3. --- MENGISI CODE ---
    await this.radioCodeManual.click();
    const randomCode = `MTH-${Math.floor(Math.random() * 10000)}`; 
    await this.inputCodeManual.fill(randomCode);
    
    // 4. --- MENGISI PRIORITY & DESCRIPTION
    await this.inputPriority.fill('4');
    await this.inputDescription.fill('Klinik terpadu dengan layanan kesehatan lengkap untuk keluarga Anda.');

    // 5. --- MENGUNGGAH GAMBAR LOGO ---
    await this.inputFileUpload.setInputFiles(imagePath);
    await this.page.waitForTimeout(1000); // Tunggu preview gambar muncul

    // 6. --- MENGISI ORDER TYPE ---
    await this.page.locator('div').filter({ hasText: /^Order Type$/ }).nth(2).click();
    await this.page.getByText('In-Store Purchase').click();

    // 7. --- MENGISI LOCATION ---
    await this.accordionLocation.click();
    await this.page.waitForTimeout(500); 

    await this.dropdownProvince.click();
    await this.page.getByText('BALI', { exact: true }).click();
    
    await this.dropdownCity.click();
    await this.page.getByText('KABUPATEN BULELENG', { exact: true }).click();
    
    await this.dropdownDistrict.click();
    await this.page.getByText('Sukasada', { exact: true }).click();
    
    await this.dropdownSubDistrict.click();
    await this.page.getByText('Pancasari', { exact: true }).click();
    
    await this.page.waitForTimeout(500); 

    // 8. --- MENGISI PIC ---
    await this.accordionPIC.click();
    await this.page.waitForTimeout(500); 

    await this.inputPicName.fill('Alex Permadi');
    await this.inputPicPhone.fill('089542867847');
    await this.inputPicEmail.fill('alex@gmail.com');

    // Scroll dan klik Next
    await this.btnNext.click();
  }

  // --- FUNGSI PENGISIAN TAB 2 ---
  async fillTab2Settlement() {
    await this.page.getByPlaceholder('Bank Name').fill('BCA');
    await this.page.getByPlaceholder('Bank Account Name').fill('Alex-Permadi');
    await this.page.getByPlaceholder('Bank Account Number').fill('09876827');
    await this.page.getByPlaceholder('NPWP').fill('238450987487681');
    
    // Checkbox Payment Method
    await this.page.getByText('Nominal (IDR)').click();
    
    await this.btnNext.click();
  }


  // --- FUNGSI PENGISIAN TAB 3 ---
  async fillTab3Brand() {
    await this.page.getByText('Merchant as brand').click();
    await this.btnSave.click();
  }
}