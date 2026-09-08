import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import { format } from 'prettier';

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory, '../..');
const version = process.argv[2] ?? 'v03';
assert.match(version, /^v\d{2,3}$/);
const output = path.join(directory, 'output/pdf');
const review = path.join(directory, 'review');
await Promise.all([mkdir(output, { recursive: true }), mkdir(review, { recursive: true })]);
const md = new MarkdownIt({ html: false });
const esc = (value) => md.utils.escapeHtml(String(value));
const slug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z]+/g, '-')
    .replace(/(^-|-$)/g, '');
const fontSpecs = [
  ['Barlow Condensed', 700, 'barlow-condensed'],
  ['Atkinson Hyperlegible', 400, 'atkinson-hyperlegible'],
  ['Atkinson Hyperlegible', 700, 'atkinson-hyperlegible'],
  ['IBM Plex Mono', 500, 'ibm-plex-mono'],
];
const fonts = (
  await Promise.all(
    fontSpecs.map(async ([family, weight, name]) => {
      const file = path.join(
        root,
        `node_modules/@fontsource/${name}/files/${name}-latin-${weight}-normal.woff2`,
      );
      const data = (await readFile(file)).toString('base64');
      return `@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;src:url('data:font/woff2;base64,${data}') format('woff2');font-display:block;}`;
    }),
  )
).join('\n');
const files = (await readdir(path.join(directory, 'content')))
  .filter((file) => file.endsWith('.md'))
  .sort();
assert.ok(files.length >= 2 && files.length <= 3);
const pages = [];
const sourceMap = [];
for (const [index, file] of files.entries()) {
  const { data, content } = matter(await readFile(path.join(directory, 'content', file), 'utf8'));
  assert.ok(data.sources?.length, `${file}: list canonical sources`);
  for (const source of data.sources) await readFile(path.join(root, source), 'utf8');
  const copy = content.replace(/[\u2010-\u2015\u2212]/g, '-').trim();
  assert.ok(copy.startsWith(`# ${data.title}\n`));
  const blocks = copy
    .replace(/^# .+\n+/, '')
    .split(/^## /m)
    .filter(Boolean);
  const rules = blocks.map((block) => {
    const split = block.indexOf('\n');
    const title = block.slice(0, split).trim();
    return `<section class="rule ${slug(title)}"><h2>${esc(title)}</h2>${md.render(block.slice(split).trim())}</section>`;
  });
  const columnBreak = blocks.findIndex((block) => block.split('\n', 1)[0] === data.column_break);
  assert.ok(columnBreak > 0, `${file}: invalid column break`);
  const bottomIndex = data.bottom_section
    ? blocks.findIndex((block) => block.split('\n', 1)[0] === data.bottom_section)
    : rules.length;
  assert.ok(bottomIndex > columnBreak, `${file}: invalid bottom section`);
  if (data.bottom_section) assert.equal(bottomIndex, rules.length - 1);
  const columns = [rules.slice(0, columnBreak), rules.slice(columnBreak, bottomIndex)]
    .map((column) => `<div class="rule-column">${column.join('\n')}</div>`)
    .join('\n');
  const bottom = data.bottom_section ? `<div class="rule-bottom">${rules[bottomIndex]}</div>` : '';
  const side = String(index + 1).padStart(2, '0');
  pages.push(
    `<article id="page-${side}" class="card page-${side}"><header class="identity"><span>FANTASY CRUX <small>2.0</small></span><span class="side">PLAYER REFERENCE</span></header><h1>${esc(data.title)}</h1><p class="subtitle">${esc(data.subtitle)}</p><main class="rules">${columns}${bottom}</main><footer><span>SHAPING</span><span>CARD ${index + 1} / ${files.length}</span></footer></article>`,
  );
  sourceMap.push({ file, title: data.title, sources: data.sources });
}
const css = (
  await Promise.all([
    readFile(path.join(directory, '../reference-cards/cards.css'), 'utf8'),
    readFile(path.join(directory, 'cards.css'), 'utf8'),
  ])
).join('\n');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fantasy Crux Shaping Reference Cards</title><style>${fonts}\n${css}</style></head><body><div class="book">${pages.join('\n')}</div></body></html>`;
await writeFile(
  path.join(review, `shaping-reference-cards-${version}.html`),
  await format(html, { parser: 'html', printWidth: 100, singleQuote: true }),
);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1120, height: 1584 },
    deviceScaleFactor: 1.25,
  });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const checks = await page.evaluate(() =>
    [...document.querySelectorAll('.card')].map((card) => {
      const bounds = card.getBoundingClientRect();
      const footer = card.querySelector('footer').getBoundingClientRect();
      const rules = card.querySelector('.rules').getBoundingClientRect();
      const texts = [...card.querySelectorAll('h1,h2,p,li,th,td,.identity span')];
      const problems = texts
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.left < bounds.left - 1 ||
            r.right > bounds.right + 1 ||
            r.bottom > footer.top - 1 ||
            el.scrollWidth > el.clientWidth + 1
          );
        })
        .map((el) => el.textContent.trim());
      const minPt = Math.min(
        ...texts.map((el) => parseFloat(getComputedStyle(el).fontSize) * 0.75),
      );
      if (footer.bottom > bounds.bottom + 1) problems.push('footer outside page');
      return {
        page: Number(card.id.slice(-2)),
        footerGapMm: ((footer.top - rules.bottom) / 96) * 25.4,
        columns: [...card.querySelectorAll('.rule-column')].map((column) => ({
          footerGapMm:
            ((footer.top - column.lastElementChild.getBoundingClientRect().bottom) / 96) * 25.4,
          blocks: [...column.children].map((block) => ({
            title: block.querySelector('h2').textContent,
            heightMm: (block.getBoundingClientRect().height / 96) * 25.4,
          })),
        })),
        minPt,
        problems,
        expectedText: card.innerText,
        orderedListMarkers: [...card.querySelectorAll('ol')].flatMap((list) =>
          [...list.children].map((_, index) => `${list.start + index}.`),
        ),
      };
    }),
  );
  console.log(
    JSON.stringify(
      checks.map(({ expectedText, ...geometry }) => geometry),
      null,
      2,
    ),
  );
  await writeFile(
    path.join(review, `checks-${version}.json`),
    JSON.stringify({ pages: checks, sourceMap }, null, 2) + '\n',
  );
  assert.deepEqual(
    checks.flatMap((x) => x.problems),
    [],
  );
  assert.ok(checks.every((x) => x.footerGapMm >= 4 && x.minPt >= 9.45));
  const pdf = path.join(output, `fantasy-crux-shaping-reference-cards-${version}.pdf`);
  await page.pdf({
    path: pdf,
    format: 'A4',
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: false,
    tagged: true,
  });
  console.log(pdf);
} finally {
  await browser.close();
}
