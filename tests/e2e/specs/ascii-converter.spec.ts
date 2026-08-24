import { expect, test } from '@playwright/test';

test('demo output responds to controls', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Image to ASCII' })
  ).toBeVisible();
  const output = page.locator('.ascii-output');
  await expect(output).not.toBeEmpty({ timeout: 15_000 });
  const initial = await output.textContent();
  await page.getByRole('button', { name: 'DENSE' }).click();
  await expect(output).not.toHaveText(initial ?? '');
  await page.getByRole('slider', { name: 'OUTPUT WIDTH' }).fill('64');
  await expect(page.getByText('64 COL')).toBeVisible();
});

test('scene presets and output formats change the copied result', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await expect(page.locator('.ascii-output')).not.toBeEmpty({
    timeout: 15_000,
  });

  await page.getByRole('button', { name: 'Discord', exact: true }).click();
  await expect(page.getByText('56 COL')).toBeVisible();
  await page
    .getByRole('combobox', { name: 'OUTPUT FORMAT' })
    .selectOption('markdown');
  await page.getByRole('button', { name: 'Copy text' }).click();

  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toMatch(/^```text\n/);
});

test('line art can be filtered and copied', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/line-art');
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => navigator.clipboard.writeText(''));
  await page.getByRole('button', { name: 'Animals', exact: true }).click();
  await page.getByRole('textbox', { name: 'Search ASCII art' }).fill('=^');
  await expect(page.locator('.ascii-piece')).toHaveCount(1);
  await page
    .getByRole('article')
    .filter({ hasText: '=^..^=' })
    .getByRole('button', { name: 'Copy Animals ASCII art' })
    .click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe('=^..^=');
});
