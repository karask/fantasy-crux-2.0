import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import matter from 'gray-matter';
import nunjucks from 'nunjucks';
import { format } from 'prettier';
import AxeBuilder from '@axe-core/playwright';

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(directory);
const output = path.join(directory, 'review');
const version = process.argv[2] ?? 'v01';
assert.match(version, /^v\d{2,3}$/, 'Version must be v01, v02, etc.');
const basename = `15-terrain-cover-${version}`;
const pageSource = await readFile(path.join(directory, 'pages/15-terrain-cover.md'), 'utf8');
const { data, content } = matter(pageSource);
const copy = content.split(/^## Editorial notes\s*$/m)[0].trim();
const sections = copy.split(/^## /m);
assert.equal(sections.length, 5, 'Expected introduction, three cover examples, and reminder.');
const introduction = sections[0]
  .replace(/^# .+\n+/, '')
  .trim()
  .replace(/\s+/g, ' ');
function example(section) {
  const match = section.match(/^([^\n]+)\n+### ([^\n]+)\n+([\s\S]+)$/);
  assert.ok(match, 'Each cover example needs a heading, badge heading, and caption.');
  const label = match[2].trim();
  const [action, modifier] = label.split(' ');
  return {
    title: match[1].trim(),
    label,
    action,
    modifier,
    caption: match[3].trim().replace(/\s+/g, ' '),
  };
}
const [partial, substantial, complete] = sections.slice(1, 4).map(example);
const reminder = sections[4]
  .replace(/^Remember\n+/, '')
  .trim()
  .replace(/\s+/g, ' ');
async function dataUrl(filename, mime) {
  return `data:${mime};base64,${(await readFile(filename)).toString('base64')}`;
}
const artworkPath = path.join(directory, 'art/15-terrain-cover/illustration-v01.png');
const fontFiles = [
  ['Barlow Condensed', 700, 'barlow-condensed'],
  ['Atkinson Hyperlegible', 400, 'atkinson-hyperlegible'],
  ['Atkinson Hyperlegible', 700, 'atkinson-hyperlegible'],
  ['IBM Plex Mono', 500, 'ibm-plex-mono'],
];
const fonts = (
  await Promise.all(
    fontFiles.map(async ([family, weight, slug]) => {
      const licence = await readFile(
        path.join(root, `node_modules/@fontsource/${slug}/LICENSE`),
        'utf8',
      );
      const url = await dataUrl(
        path.join(
          root,
          `node_modules/@fontsource/${slug}/files/${slug}-latin-${weight}-normal.woff2`,
        ),
        'font/woff2',
      );
      return `/*! ${family} ${weight}\n${licence}\n*/\n@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:block;src:url('${url}') format('woff2');}`;
    }),
  )
).join('\n');
const environment = new nunjucks.Environment(null, { autoescape: true, throwOnUndefined: true });
const html = environment.renderString(
  await readFile(path.join(directory, 'design/terrain-cover.njk'), 'utf8'),
  {
    ...data,
    fonts,
    introduction,
    partial,
    substantial,
    complete,
    reminder,
    css: await readFile(path.join(directory, 'design/page.css'), 'utf8'),
    artwork: await dataUrl(artworkPath, 'image/png'),
    brand: await dataUrl(path.join(root, 'src/assets/brand-mark.png'), 'image/png'),
  },
);
await mkdir(output, { recursive: true });
await writeFile(
  path.join(output, `${basename}.html`),
  await format(html, { parser: 'html', printWidth: 100, singleQuote: true }),
);

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1240, height: 1754 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode()));
  });
  const checks = await page.evaluate(() => {
    const sheet = document.querySelector('.handbook-page');
    const footer = document.querySelector('.page-footer').getBoundingClientRect();
    const reminderRect = document.querySelector('.remember').getBoundingClientRect();
    const outside = [...document.querySelectorAll('h1,h2,p,[data-check-bounds]')]
      .filter((element) => {
        const r = element.getBoundingClientRect();
        return (
          r.left < 0 ||
          r.top < 0 ||
          r.right > 1240 ||
          r.bottom > 1754 ||
          element.scrollWidth > element.clientWidth + 1
        );
      })
      .map((element) => element.textContent.trim());
    return {
      pageWidth: sheet.offsetWidth,
      pageHeight: sheet.offsetHeight,
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      fontsLoaded:
        document.fonts.check('700 24px "Barlow Condensed"') &&
        document.fonts.check('400 24px "Atkinson Hyperlegible"') &&
        document.fonts.check('500 20px "IBM Plex Mono"'),
      imageCount: document.images.length,
      brokenImages: [...document.images].filter((image) => !image.naturalWidth).length,
      footerGap: footer.top - reminderRect.bottom,
      outside,
      text: sheet.innerText,
    };
  });
  assert.deepEqual([checks.pageWidth, checks.pageHeight], [1240, 1754]);
  assert.deepEqual(
    [checks.documentWidth, checks.documentHeight],
    [1240, 1754],
    'Page overflows its A4 canvas.',
  );
  assert.ok(checks.fontsLoaded, 'Fonts did not load.');
  assert.equal(checks.brokenImages, 0);
  assert.deepEqual(checks.outside, [], 'Text or labels extend beyond their bounds.');
  assert.ok(checks.footerGap >= 20, 'Content collides with footer.');
  const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  checks.accessibilityViolations = accessibility.violations.map(({ id, description }) => ({
    id,
    description,
  }));
  assert.deepEqual(checks.accessibilityViolations, [], 'Accessibility review found violations.');
  for (const text of [
    introduction,
    partial.caption,
    substantial.caption,
    complete.caption,
    reminder,
  ]) {
    assert.ok(checks.text.replace(/\s+/g, ' ').includes(text), `Missing source copy: ${text}`);
  }
  await page.screenshot({ path: path.join(output, `${basename}.png`), fullPage: false });
  await context.close();

  const printContext = await browser.newContext({
    viewport: { width: 1240, height: 1754 },
    deviceScaleFactor: 2,
  });
  const printPage = await printContext.newPage();
  await printPage.setContent(html, { waitUntil: 'load' });
  await printPage.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode()));
  });
  await printPage.screenshot({ path: path.join(output, `${basename}-print.png`), fullPage: false });
  await printContext.close();
  delete checks.text;
  await writeFile(
    path.join(output, `${basename}-checks.json`),
    JSON.stringify(checks, null, 2) + '\n',
  );
  console.log(
    `Rendered ${basename}: 1240 × 1754 review, 2480 × 3508 print composition, self-contained HTML.`,
  );
  console.log(JSON.stringify(checks, null, 2));
} finally {
  await browser.close();
}
