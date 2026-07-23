import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

async function expectNoHorizontalOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
}

test('home and primary rules navigation work at the target width', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Fantasy Crux Lite');
  await expect(page.getByRole('link', { name: /Enter the rules/i })).toBeVisible();
  await expect(page.locator('.chapter-directory li')).toHaveCount(8);
  await expect(page.locator('.chapter-nav a').nth(0)).toContainText('00');
  await expect(page.locator('.chapter-nav a').nth(4)).toContainText('04');
  await expect(page.locator('.chapter-nav a').nth(7)).toContainText('07');
  await expect(page.locator('.chapter-nav a').nth(8)).toContainText('QR');
  await expectNoHorizontalOverflow(page);

  await page.goto('/rules/combat/two-ready-items/');
  await expect(page.locator('h1')).toHaveText('Fighting With Two Ready Items');
  await expect(page.locator('main')).toContainText('make one free attack');
  await expect(page.locator('main')).toContainText('cannot Dodge');
  await expectNoHorizontalOverflow(page);
});

test('Talent filters progressively enhance the complete catalogue', async ({ page }) => {
  await page.goto('/rules/talents/');
  await expect(page.locator('[data-talent-card]')).toHaveCount(17);
  await page.getByRole('button', { name: 'Shield' }).click();
  const visibleCards = page.locator('[data-talent-card]:visible');
  await expect(visibleCards).not.toHaveCount(0);
  await expect(visibleCards.first()).toContainText(/shield/i);
  await expect(page.locator('[data-talent-count]')).not.toHaveText('17');
  await expect(page.getByRole('status')).toContainText('Talents available');
  await expectNoHorizontalOverflow(page);
});

test('Shaping is a first-class rules chapter', async ({ page }) => {
  const routes = [
    '/rules/magic/becoming-a-shaper/',
    '/rules/magic/building-a-shaping/',
    '/rules/magic/techniques-and-forms/',
    '/rules/magic/effects/',
    '/rules/magic/casting-and-defence/',
    '/rules/magic/ongoing-and-magical-actions/',
    '/rules/magic/rituals-and-examples/',
  ];

  await page.goto('/');
  const magicItem = page.locator('.chapter-directory li').filter({ hasText: 'Magic' });
  await expect(magicItem).not.toHaveClass(/is-future/);
  await magicItem.getByRole('link', { name: /Magic/ }).click();
  await expect(page.locator('h1')).toHaveText('Magic');
  const links = page.locator('.rule-index a');
  await expect(links).toHaveCount(7);
  expect(
    await links.evaluateAll((items) => items.map((item) => new URL(item.href).pathname)),
  ).toEqual(routes);
  await expect(
    page.locator('.rule-index').getByRole('link', { name: 'Becoming a Shaper' }),
  ).toBeVisible();
  await expect(page.locator('main')).not.toContainText('Magic rules are in development.');
  await expectNoHorizontalOverflow(page);

  await page.goto('/reference/');
  await expect(page.getByRole('heading', { name: 'Magic', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Building a Shaping' })).toHaveAttribute(
    'href',
    '/rules/magic/building-a-shaping/',
  );

  await page.goto('/rules/characters/character-creation/');
  await expect(page.getByRole('link', { name: /Shaper/i })).toHaveAttribute(
    'href',
    '/rules/magic/becoming-a-shaper/',
  );

  await page.goto('/rules/magic/building-a-shaping/');
  await expect(page.locator('h1')).toHaveText('Building a Shaping');
  await expect(page.locator('main')).toContainText('Intensity + Range + Duration + Reach');
  await expect(page.locator('.table-wrap')).not.toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});

test('Pagefind returns indexed rules and Talents', async ({ page }) => {
  await page.goto('/search/');
  await page.getByLabel('Rule, term, or Talent').fill('faster Combat Order');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.locator('[data-search-status]')).toContainText(/results? for/i);
  await expect(page.locator('[data-search-results]')).toContainText('Quick Reflexes');

  await page.getByLabel('Rule, term, or Talent').fill('DEX 13');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.locator('[data-search-results]')).toContainText('Quick Reflexes');

  await page.getByLabel('Rule, term, or Talent').fill('combat');
  await page.getByRole('button', { name: 'Search' }).click();
  const status = page.locator('[data-search-status]');
  await expect(status).toContainText(/results? for/i);
  const reportedCount = Number((await status.textContent()).match(/^\d+/)?.[0]);
  await expect(page.locator('[data-search-results] li')).toHaveCount(reportedCount);

  await page.getByLabel('Rule, term, or Talent').fill('Effect');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.locator('[data-search-results] li').first()).toBeVisible();
  await expect(page.locator('[data-search-results]')).not.toContainText('#');

  await page.getByLabel('Rule, term, or Talent').fill('Unmake Fire cell');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.locator('[data-search-results]')).toContainText('Becoming a Shaper');

  await page.getByLabel('Rule, term, or Talent').fill('"development"');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(status).toContainText('0 results');
  await expect(page.locator('[data-search-results] li')).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});

test('table-heavy rules remain within the target width', async ({ page }) => {
  for (const route of [
    '/rules/equipment/weapons/',
    '/rules/combat/active-guard/',
    '/rules/magic/techniques-and-forms/',
    '/rules/magic/effects/',
  ]) {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.table-wrap').first()).toHaveAttribute('tabindex', '0');
    await expectNoHorizontalOverflow(page);
  }
});

test('core pages have no automatically detectable accessibility violations', async ({ page }) => {
  for (const route of [
    '/',
    '/rules/combat/active-guard/',
    '/rules/talents/',
    '/rules/magic/',
    '/rules/magic/casting-and-defence/',
  ]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations, `${route}: ${JSON.stringify(results.violations)}`).toEqual([]);
  }
});

test('the rules remain readable without JavaScript', async ({ browser, viewport }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8080/rules/talents/');
  await expect(page.locator('[data-talent-card]')).toHaveCount(17);
  await expect(page.locator('.talent-filters')).toBeHidden();
  await expect(page.locator('main')).toContainText('Off-Hand Mastery');
  await expectNoHorizontalOverflow(page);
  await context.close();
});
