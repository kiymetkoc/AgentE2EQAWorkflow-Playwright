const { test, expect, addProducts, installTestHooks, openCart } = require('./helpers');

test.describe('Cart review', () => {
  installTestHooks();

  test('Cart shows selected item details, total, and checkout choices', async ({ page }) => {
    await addProducts(page, ['sauce-labs-backpack', 'sauce-labs-bolt-t-shirt']);
    await expect(page.getByRole('button', { name: 'Cart, 2 items' })).toBeVisible();

    await openCart(page);
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    await expect(page.getByText('Sauce Labs Bolt T-Shirt', { exact: true })).toBeVisible();
    await expect(page.getByText('carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.')).toBeVisible();
    await expect(page.getByText('$29.99', { exact: true })).toBeVisible();
    await expect(page.getByText('$15.99', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();
    await expect(page.getByText(/(?:item )?total/i)).toBeVisible();
  });
});
