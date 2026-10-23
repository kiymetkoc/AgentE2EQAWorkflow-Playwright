const { test, expect, installTestHooks, startCheckout } = require('./helpers');

test.describe('Checkout information validation', () => {
  installTestHooks();

  test('Checkout information requires each field', async ({ page }) => {
    await startCheckout(page);
    await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Last Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Zip/Postal Code' })).toBeVisible();

    await page.getByTestId('continue').click();
    await expect(page.getByRole('alert')).toContainText('First Name is required');
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);

    await page.getByTestId('firstName').fill('Ada');
    await page.getByTestId('continue').click();
    await expect(page.getByRole('alert')).toContainText('Last Name is required');
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);

    await page.getByTestId('lastName').fill('Lovelace');
    await page.getByTestId('continue').click();
    await expect(page.getByRole('alert')).toContainText('Postal Code is required');
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });
});
