const { test, expect, enterCheckoutInformation, installTestHooks, startCheckout } = require('./helpers');

test.describe('Responsive checkout', () => {
  installTestHooks();

  test('Checkout remains usable on a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startCheckout(page);
    await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await enterCheckoutInformation(page);
    await page.getByTestId('continue').click();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(page.getByText('Item total: $29.99')).toBeVisible();
    await expect(page.getByText('Tax: $2.40')).toBeVisible();
    await expect(page.getByText('Total: $32.39')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
