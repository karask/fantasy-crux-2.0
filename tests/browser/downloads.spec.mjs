import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import downloads from '../../src/_data/downloads.mjs';

test('downloads offers both approved card sets with the exact PDF files', async ({ page }) => {
  await page.goto('/downloads/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Downloads');
  await expect(page.locator('.download-card')).toHaveCount(2);

  for (const download of downloads) {
    const card = page.getByRole('region', { name: download.title, exact: true });
    await expect(card).toBeVisible();
    await expect(card).toContainText('3 A4 pages');
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
