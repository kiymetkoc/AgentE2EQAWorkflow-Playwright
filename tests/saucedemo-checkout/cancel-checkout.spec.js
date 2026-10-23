const { test, expect, installTestHooks, startCheckout } = require('./helpers');

test.describe('Checkout information cancellation', () => {
  installTestHooks();

  test('Cancel checkout information returns to cart', async ({ page }) => {
    await startCheckout(page);
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
  });
});
