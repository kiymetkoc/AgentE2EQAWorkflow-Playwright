const { test, expect, enterCheckoutInformation, installTestHooks, openCart, startCheckout } = require('./helpers');

test.describe('Order overview and confirmation', () => {
  installTestHooks();

  test('Valid checkout displays correct overview and completes order', async ({ page }) => {
    await startCheckout(page, ['sauce-labs-backpack', 'sauce-labs-bolt-t-shirt']);
    await enterCheckoutInformation(page);
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);

    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    await expect(page.getByText('Sauce Labs Bolt T-Shirt', { exact: true })).toBeVisible();
    await expect(page.getByText('SauceCard #31337')).toBeVisible();
    await expect(page.getByText('Free Pony Express Delivery!')).toBeVisible();
    await expect(page.getByText('Item total: $45.98')).toBeVisible();
    await expect(page.getByText('Tax: $3.68')).toBeVisible();
    await expect(page.getByText('Total: $49.66')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();

    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Back Home' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();

    await page.getByTestId('back-to-products').click();
    await openCart(page);
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toHaveCount(0);
  });
});
