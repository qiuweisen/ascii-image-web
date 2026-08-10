import { expect, test } from '@playwright/test';

test('demo output responds to controls', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Image to ASCII' })
  ).toBeVisible();
  const output = page.locator('.ascii-output');
  await expect(output).not.toBeEmpty();
  const initial = await output.textContent();
  await page.getByRole('button', { name: 'DENSE' }).click();
  await expect(output).not.toHaveText(initial ?? '');
  await page.getByRole('slider', { name: 'OUTPUT WIDTH' }).fill('64');
  await expect(page.getByText('64 COL')).toBeVisible();
});

test('line art can be filtered and copied', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/line-art');
  await page.getByRole('button', { name: 'ANIMALS' }).click();
  await page.getByRole('textbox', { name: 'Search ASCII art' }).fill('=^');
  await page.getByRole('button', { name: 'Copy Animals ASCII art' }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe('=^..^=');
});
