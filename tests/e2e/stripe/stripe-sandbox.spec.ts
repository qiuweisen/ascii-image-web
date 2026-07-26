import { expect, test, type Page } from '@playwright/test';
import Stripe from 'stripe';
import {
  cleanupE2EUsers,
  loginByForm,
  registerE2EUser,
} from '../fixtures/auth';
import type { E2EUser } from '../fixtures/test-data';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey?.startsWith('sk_test_')) {
  throw new Error('Stripe sandbox tests require an sk_test_ key');
}

const stripe = new Stripe(stripeSecretKey);
const activeEmails = new Set<string>();

type CheckoutScenario = {
  expectedPlan: 'Lifetime' | 'Pro';
  expectedPriceId: string;
  interval?: 'month' | 'year';
  portalButton?: RegExp;
};

async function fillStripeField(page: Page, label: RegExp, value: string) {
  const field = page.getByRole('textbox', { name: label }).first();
  await field.waitFor({ state: 'visible', timeout: 60_000 });
  await field.fill(value);
}

async function cleanupStripeCustomers(email: string) {
  const customers = await stripe.customers.list({ email, limit: 100 });
  for (const customer of customers.data) {
    if (!customer.deleted) await stripe.customers.del(customer.id);
  }
}

async function cleanupStripeE2ECustomers() {
  for await (const customer of stripe.customers.list({ limit: 100 })) {
    const email = customer.email ?? '';
    if (email.startsWith('e2e-stripe-') && email.endsWith('@example.test')) {
      await stripe.customers.del(customer.id);
    }
  }
}

async function completeStripeCheckout(
  page: Page,
  user: E2EUser,
  scenario: CheckoutScenario
) {
  await loginByForm(page, user);
  await page.goto('/pricing');
  await page.waitForLoadState('networkidle');

  if (scenario.interval === 'year') {
    await page.getByText('Yearly', { exact: true }).click();
  }

  const planCard = page
    .locator('[data-slot="card"]')
    .filter({
      has: page.getByRole('heading', {
        name: scenario.expectedPlan,
        exact: true,
      }),
    })
    .first();
  const checkoutButtonName =
    scenario.expectedPlan === 'Lifetime'
      ? 'Get Lifetime Access'
      : 'Get Started';
  await planCard
    .getByRole('button', { name: checkoutButtonName, exact: true })
    .click();

  await page.waitForURL(/https:\/\/checkout\.stripe\.com\//, {
    timeout: 60_000,
  });
  await page
    .getByRole('textbox', { name: /card number/i })
    .waitFor({ state: 'visible', timeout: 60_000 });
  const emailField = page.getByLabel(/email/i).first();
  if ((await emailField.count()) > 0 && (await emailField.isEditable())) {
    await emailField.fill(user.email);
  }
  await fillStripeField(page, /card number/i, '4242424242424242');
  await fillStripeField(page, /expiration|expiry/i, '1230');
  await fillStripeField(page, /security code|cvc/i, '123');

  const nameField = page
    .getByRole('textbox', { name: /cardholder name|name on card/i })
    .first();
  if ((await nameField.count()) > 0 && (await nameField.isEditable())) {
    await nameField.fill(user.name);
  }
  const postalField = page
    .getByRole('textbox', { name: /zip|postal/i })
    .first();
  if ((await postalField.count()) > 0 && (await postalField.isEditable())) {
    await postalField.fill('94107');
  }

  await page
    .getByRole('button', { name: /subscribe|pay|complete order/i })
    .click();
  await page.waitForURL(/\/settings\/billing/, { timeout: 120_000 });

  const billingCard = page
    .locator('[data-slot="card"]')
    .filter({ hasText: 'Current plan' })
    .first();
  await expect(
    billingCard.getByText(scenario.expectedPlan, { exact: true })
  ).toBeVisible();

  const customers = await stripe.customers.list({
    email: user.email,
    limit: 10,
  });
  expect(customers.data).toHaveLength(1);
  const customer = customers.data[0];

  if (scenario.interval) {
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      limit: 10,
    });
    expect(subscriptions.data).toHaveLength(1);
    expect(subscriptions.data[0].items.data[0]?.price.id).toBe(
      scenario.expectedPriceId
    );
  } else {
    const sessions = await stripe.checkout.sessions.list({
      customer: customer.id,
      limit: 10,
      status: 'complete',
    });
    expect(sessions.data).toHaveLength(1);
    const lineItems = await stripe.checkout.sessions.listLineItems(
      sessions.data[0].id,
      { limit: 10 }
    );
    expect(lineItems.data[0]?.price?.id).toBe(scenario.expectedPriceId);
  }

  if (scenario.portalButton) {
    await billingCard
      .getByRole('button', { name: scenario.portalButton })
      .click();
    await page.waitForURL(/https:\/\/billing\.stripe\.com\//, {
      timeout: 60_000,
    });
  }
}

test.describe
  .serial('Stripe sandbox payment flows', () => {
    test.beforeAll(async ({ request }) => {
      await cleanupStripeE2ECustomers();
      await cleanupE2EUsers(request);
    });

    test.afterEach(async ({ request }) => {
      for (const email of activeEmails) await cleanupStripeCustomers(email);
      activeEmails.clear();
      await cleanupE2EUsers(request);
    });

    test.afterAll(async () => {
      await cleanupStripeE2ECustomers();
    });

    test('completes a monthly subscription and opens Customer Portal', async ({
      page,
      request,
    }) => {
      const user = await registerE2EUser(request, {
        email: `e2e-stripe-month-${Date.now()}@example.test`,
      });
      activeEmails.add(user.email);

      await completeStripeCheckout(page, user, {
        expectedPlan: 'Pro',
        expectedPriceId: process.env.VITE_STRIPE_PRICE_PRO_MONTHLY ?? '',
        interval: 'month',
        portalButton: /manage subscription/i,
      });
    });

    test('completes a yearly subscription', async ({ page, request }) => {
      const user = await registerE2EUser(request, {
        email: `e2e-stripe-year-${Date.now()}@example.test`,
      });
      activeEmails.add(user.email);

      await completeStripeCheckout(page, user, {
        expectedPlan: 'Pro',
        expectedPriceId: process.env.VITE_STRIPE_PRICE_PRO_YEARLY ?? '',
        interval: 'year',
      });
    });

    test('completes a one-time lifetime payment', async ({ page, request }) => {
      const user = await registerE2EUser(request, {
        email: `e2e-stripe-lifetime-${Date.now()}@example.test`,
      });
      activeEmails.add(user.email);

      await completeStripeCheckout(page, user, {
        expectedPlan: 'Lifetime',
        expectedPriceId: process.env.VITE_STRIPE_PRICE_LIFETIME ?? '',
      });
    });
  });
