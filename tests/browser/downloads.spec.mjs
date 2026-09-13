import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import downloads from '../../src/_data/downloads.mjs';
const publicDownloads = downloads.filter((download) => download.audience !== 'gm');

test('downloads offers the published resources with the exact PDF files', async ({ page }) => {
  await page.goto('/downloads/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Downloads');
  await expect(page.locator('.download-card:visible')).toHaveCount(publicDownloads.length);

  for (const download of publicDownloads) {
    const card = page.getByRole('region', { name: download.title, exact: true });
    await expect(card).toBeVisible();
    await expect(card).toContainText(download.pages);
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
  await page
    .locator('.download-list')
    .first()
    .evaluate((list) => {
      const original = list.firstElementChild;
      for (let i = 0; i < 5; i++) {
        const card = original.cloneNode(true);
        card.removeAttribute('aria-labelledby');
        card.querySelector('[id]').removeAttribute('id');
        list.append(card);
      }
    });
  const layout = await page
    .locator('.download-list')
    .first()
    .evaluate((list) => ({
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

test('GM mode confirms spoilers, persists in this tab, and can be hidden', async ({ page }) => {
  await page.goto('/downloads/');
  const panel = page.locator('#gm-adventures');
  await expect(panel).toBeHidden();
  await expect(panel).toHaveAttribute('data-pagefind-ignore', '');
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toBe('GM adventures contain spoilers. Continue?');
    await dialog.dismiss();
  });
  await page.keyboard.press('Control+Alt+KeyG');
  await expect(panel).toBeHidden();
  page.once('dialog', (dialog) => dialog.accept());
  await page.keyboard.press('Control+Alt+KeyG');
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('No approved adventures are available yet.');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.reload();
  await expect(panel).toBeVisible();
  await page.getByRole('button', { name: 'Hide GM adventures' }).click();
  await expect(panel).toBeHidden();
  await page.reload();
  await expect(panel).toBeHidden();
  await page.locator('input[type="search"]').first().focus();
  await page.keyboard.press('Control+Alt+KeyG');
  await expect(panel).toBeHidden();
  await page.goto('/');
  await page.keyboard.press('Control+Alt+KeyG');
  expect(await page.evaluate(() => sessionStorage.getItem('crux-gm-adventures'))).toBeNull();
});

test('holding the Downloads heading reveals GM mode but tapping or scrolling does not', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('/downloads/');
  const heading = page.locator('[data-gm-trigger]');
  const pointer = { pointerType: 'touch', isPrimary: true, button: 0, clientX: 30, clientY: 30 };
  await heading.dispatchEvent('pointerdown', pointer);
  await heading.dispatchEvent('pointerup', pointer);
  await page.clock.fastForward(900);
  await expect(page.locator('#gm-adventures')).toBeHidden();
  await heading.dispatchEvent('pointerdown', pointer);
  await heading.dispatchEvent('pointermove', { ...pointer, clientY: 70 });
  await page.clock.fastForward(900);
  await expect(page.locator('#gm-adventures')).toBeHidden();
  page.once('dialog', (dialog) => dialog.accept());
  await heading.dispatchEvent('pointerdown', pointer);
  await page.clock.fastForward(900);
  await expect(page.locator('#gm-adventures')).toBeVisible();
});
