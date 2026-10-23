const { test, expect, enterCheckoutInformation, installTestHooks, startCheckout } = require('./helpers');

test.describe('Invalid checkout information', () => {
  installTestHooks();

  test('Checkout rejects invalid characters and postal codes', async ({ page }) => {
    await startCheckout(page);
    await enterCheckoutInformation(page, '@@!!', '#<>?', 'abc-!?');
    await page.getByTestId('continue').click();

    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(page.getByRole('alert')).toBeVisible();
  });
});
