const { test, expect, installTestHooks } = require('./helpers');

test.describe('Authentication gating', () => {
  installTestHooks();

  test('Unauthenticated user cannot access checkout directly', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByTestId('logout-sidebar-link').click();
    await page.goto('https://www.saucedemo.com/checkout-step-one.html');

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(page.getByRole('alert')).toContainText('only access');
  });
});
