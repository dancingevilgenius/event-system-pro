import { expect, test } from '@playwright/test';

test.describe('public home', () => {
  test('shows brand and login CTA', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Event System Pro' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
  });

  test('navigates to login from home', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/\/login$/);
  });
});
