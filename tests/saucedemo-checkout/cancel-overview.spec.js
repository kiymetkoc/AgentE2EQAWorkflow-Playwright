const { test, expect, enterCheckoutInformation, installTestHooks, startCheckout } = require('./helpers');

test.describe('Order overview cancellation', () => {
  installTestHooks();

  test('Cancel order overview returns to cart', async ({ page }) => {
    await startCheckout(page);
    await enterCheckoutInformation(page);
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
  });
});
