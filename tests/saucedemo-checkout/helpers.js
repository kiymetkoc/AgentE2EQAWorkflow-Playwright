const { test, expect } = require('@playwright/test');

const baseUrl = 'https://www.saucedemo.com';

async function logIn(page) {
  await page.goto(baseUrl);
  await page.getByTestId('username').fill(process.env.SAUCE_USERNAME || 'standard_user');
  await page.getByTestId('password').fill(process.env.SAUCE_PASSWORD || 'secret_sauce');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/\/inventory\.html$/);
}

async function addProducts(page, productIds) {
  for (const productId of productIds) {
    await page.getByTestId(`add-to-cart-${productId}`).click();
  }
}

async function openCart(page) {
  await page.getByTestId('shopping-cart-link').click();
  await expect(page).toHaveURL(/\/cart\.html$/);
}

async function startCheckout(page, productIds = ['sauce-labs-backpack']) {
  await addProducts(page, productIds);
  await openCart(page);
  await page.getByTestId('checkout').click();
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
}

async function enterCheckoutInformation(page, firstName = 'Ada', lastName = 'Lovelace', postalCode = '90210') {
  await page.getByTestId('firstName').fill(firstName);
  await page.getByTestId('lastName').fill(lastName);
  await page.getByTestId('postalCode').fill(postalCode);
}

function installTestHooks() {
  test.beforeEach(async ({ page }) => {
    await logIn(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus && page && !page.isClosed()) {
      await page.screenshot({ path: testInfo.outputPath('failure.png'), fullPage: true });
    }
  });
}

module.exports = {
  test,
  expect,
  addProducts,
  enterCheckoutInformation,
  installTestHooks,
  logIn,
  openCart,
  startCheckout
};
