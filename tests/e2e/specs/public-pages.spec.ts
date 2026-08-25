import { expect, test } from '@playwright/test';
import {
  expectHealthyPage,
  installPageHealthMonitor,
  localizedPath,
  setTheme,
  type LocaleMode,
  type ThemeMode,
} from '../fixtures/page-health';

const publicPages = [
  { path: '/', name: 'home' },
  { path: '/pricing', name: 'pricing' },
  { path: '/blog', name: 'blog index' },
  { path: '/blog/getting-started', name: 'blog detail' },
  { path: '/ai', name: 'ai playground' },
  { path: '/about', name: 'about' },
  { path: '/contact', name: 'contact' },
  { path: '/changelog', name: 'changelog' },
  { path: '/roadmap', name: 'roadmap' },
  { path: '/waitlist', name: 'waitlist' },
  { path: '/cookie', name: 'cookie policy' },
  { path: '/privacy', name: 'privacy policy' },
  { path: '/terms', name: 'terms of service' },
  { path: '/ascii-art-for-discord', name: 'ASCII art for Discord' },
  { path: '/ascii-art-for-readme', name: 'ASCII art for README' },
  { path: '/auth/login', name: 'login' },
  { path: '/auth/register', name: 'register' },
  { path: '/auth/forgot-password', name: 'forgot password' },
  { path: '/auth/reset-password', name: 'reset password' },
] as const;

const smokeMatrix: Array<{ locale: LocaleMode; theme: ThemeMode }> = [
  { locale: 'en', theme: 'dark' },
  { locale: 'en', theme: 'light' },
  { locale: 'zh', theme: 'dark' },
  { locale: 'zh', theme: 'light' },
];

test.describe('public page smoke coverage', () => {
  for (const { locale, theme } of smokeMatrix) {
    test(`renders all public pages in ${locale}/${theme}`, async ({ page }) => {
      await setTheme(page, theme);
      const monitor = installPageHealthMonitor(page);

      for (const publicPage of publicPages) {
        await test.step(publicPage.name, async () => {
          await expectHealthyPage(
            page,
            monitor,
            localizedPath(publicPage.path, locale),
            { theme }
          );
        });
      }
    });
  }

  test('opens the home page login modal', async ({ page }) => {
    await setTheme(page, 'dark');
    const monitor = installPageHealthMonitor(page);

    await expectHealthyPage(page, monitor, '/', { theme: 'dark' });
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /^log in$/i }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('input[name="email"]')).toBeVisible();
    await expect(dialog.locator('input[name="password"]')).toBeVisible();
    monitor.expectNoErrors('home login modal');
  });

  test('health check responds with pong', async ({ request }) => {
    const response = await request.get('/api/ping');

    await expect(response).toBeOK();
    expect(await response.json()).toEqual({ message: 'pong' });
  });

  test('scene pages expose distinct search intent and canonical URLs', async ({
    page,
  }) => {
    await page.goto('/ascii-art-for-discord');
    await expect(
      page.getByRole('heading', { name: 'ASCII Art for Discord' })
    ).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/ascii-art-for-discord$/
    );
    await expect(page.getByText('56 COL')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Discord code block example' })
    ).toBeVisible();
    await expect(page.locator('.ascii-scene-example pre')).toContainText(
      '```text'
    );
    await expect(
      page.getByRole('link', { name: /ASCII Art for README/ })
    ).toBeVisible();

    await page.goto('/ascii-art-for-readme');
    await expect(
      page.getByRole('heading', { name: 'ASCII Art for README' })
    ).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/ascii-art-for-readme$/
    );
    await expect(page.getByText('96 COL')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'README Markdown example' })
    ).toBeVisible();
    await expect(page.locator('.ascii-scene-example pre')).toContainText(
      '```text'
    );
    await expect(
      page.getByRole('link', { name: /ASCII Art for Discord/ })
    ).toBeVisible();
  });

  test('sitemap includes both ASCII scene pages', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const sitemap = await response.text();

    expect(sitemap).toContain('/ascii-art-for-discord');
    expect(sitemap).toContain('/ascii-art-for-readme');
    expect(sitemap).not.toContain('/zh/');
    expect(sitemap).not.toContain('hreflang="zh-CN"');
  });

  test('unfinished locales stay out of the search index', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('link[hreflang="zh-CN"]')).toHaveCount(0);

    await page.goto('/zh');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex'
    );
  });
});
