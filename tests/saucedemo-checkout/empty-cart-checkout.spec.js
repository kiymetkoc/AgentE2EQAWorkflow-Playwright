const { test, expect, installTestHooks, openCart } = require('./helpers');

test.describe('Empty-cart checkout guard', () => {
  installTestHooks();

  test('Empty cart cannot proceed to checkout', async ({ page }) => {
    await openCart(page);
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Checkout' })).toBeDisabled();
  });
});
