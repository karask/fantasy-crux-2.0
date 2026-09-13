import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import downloads from '../../src/_data/downloads.mjs';

test('downloads offers both approved card sets with the exact PDF files', async ({ page }) => {
  await page.goto('/downloads/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Downloads');
  await expect(page.locator('.download-card')).toHaveCount(downloads.length);

  for (const download of downloads) {
    const card = page.getByRole('region', { name: download.title, exact: true });
    await expect(card).toBeVisible();
    await expect(card).toContainText('3 A4 pages');
    const advice = card.locator('.download-print');
    await expect(advice).not.toHaveAttribute('open');
    await advice.getByText('Printing advice', { exact: true }).click();
    await expect(advice.locator('p')).toBeVisible();
    await expect(advice.locator('p')).toHaveText(download.print);
    await advice.getByText('Printing advice', { exact: true }).click();
    const link = card.getByRole('link', { name: `Download ${download.title} PDF` });
    await expect(link).toHaveAttribute('href', `/downloads/${download.filename}`);
    await expect(link).toHaveAttribute('download', download.filename);

    const response = await page.request.get(await link.getAttribute('href'));
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('application/pdf');
    expect((await response.body()).equals(await readFile(download.source))).toBe(true);
  }

  const dimensions = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('download grid keeps compact columns as the catalogue grows', async ({ page }) => {
  await page.goto('/downloads/');
  await page.locator('.download-list').evaluate((list) => {
    const original = list.firstElementChild;
    for (let i = 0; i < 5; i++) {
      const card = original.cloneNode(true);
      card.removeAttribute('aria-labelledby');
      card.querySelector('[id]').removeAttribute('id');
      list.append(card);
    }
  });
  const layout = await page.locator('.download-list').evaluate((list) => ({
    width: list.getBoundingClientRect().width,
    columns: getComputedStyle(list).gridTemplateColumns.split(' ').length,
    cardWidth: list.firstElementChild.getBoundingClientRect().width,
    gap: parseFloat(getComputedStyle(list).columnGap),
    minWidth: parseFloat(getComputedStyle(document.documentElement).fontSize) * 17,
    scroll: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  const expectedColumns = Math.max(
    1,
    Math.floor((layout.width + layout.gap) / (layout.minWidth + layout.gap)),
  );
  expect(layout.columns).toBe(expectedColumns);
  expect(layout.cardWidth).toBeLessThanOrEqual(layout.width / expectedColumns + 1);
  expect(layout.scroll).toBeLessThanOrEqual(layout.viewport + 1);
});
