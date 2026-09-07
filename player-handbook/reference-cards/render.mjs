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
const version = process.argv[2] ?? 'v05';
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
const dataUrl = async (filename, mime) =>
  `data:${mime};base64,${(await readFile(filename)).toString('base64')}`;

const fontSpecs = [
  ['Barlow Condensed', 700, 'barlow-condensed'],
  ['Atkinson Hyperlegible', 400, 'atkinson-hyperlegible'],
  ['Atkinson Hyperlegible', 700, 'atkinson-hyperlegible'],
  ['IBM Plex Mono', 500, 'ibm-plex-mono'],
];
const fonts = (
  await Promise.all(
    fontSpecs.map(async ([family, weight, name]) => {
      const base = path.join(root, `node_modules/@fontsource/${name}`);
      const url = await dataUrl(
        path.join(base, `files/${name}-latin-${weight}-normal.woff2`),
        'font/woff2',
      );
      return `@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;src:url('${url}') format('woff2');font-display:block;}`;
    }),
  )
).join('\n');

const files = (await readdir(path.join(directory, 'content')))
  .filter((file) => file.endsWith('.md'))
  .sort();
assert.equal(files.length, 3);
const pages = [];
for (const [index, file] of files.entries()) {
  const { data, content } = matter(await readFile(path.join(directory, 'content', file), 'utf8'));
  const copy = content.replace(/[\u2010-\u2015\u2212]/g, '-').trim();
  assert.ok(copy.startsWith(`# ${data.title}\n`));
  assert.ok(
    !/\b(?:armour table|weapon table|Open Game Licen[cs]e|character creation|advancement|Shaping|Talent)\b/i.test(
      copy,
    ),
  );
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
  assert.ok(columnBreak > 0, `${file}: choose a heading for the second column`);
  const columns = [rules.slice(0, columnBreak), rules.slice(columnBreak)]
    .map((column) => `<div class="rule-column">${column.join('\n')}</div>`)
    .join('\n');
  const side = String(index + 1).padStart(2, '0');
  pages.push(
    `<article id="page-${side}" class="card page-${side}"><header class="identity"><span>FANTASY CRUX <small>2.0</small></span><span class="side">PLAYER REFERENCE · CARD ${index + 1}</span></header><h1>${esc(data.title)}</h1><p class="subtitle">${esc(data.subtitle)}</p><main class="rules">${columns}</main><footer><span>CORE RULES</span><span>CARD ${index + 1} / ${files.length}</span></footer></article>`,
  );
}
const css = await readFile(path.join(directory, 'cards.css'), 'utf8');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fantasy Crux Player Reference</title><style>${fonts}\n${css}</style></head><body><div class="book">${pages.join('\n')}</div></body></html>`;
await writeFile(
  path.join(review, `reference-cards-${version}.html`),
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
      };
    }),
  );
  console.log(JSON.stringify(checks, null, 2));
  assert.deepEqual(
    checks.flatMap((x) => x.problems),
    [],
  );
  assert.ok(checks.every((x) => x.footerGapMm >= 4 && x.minPt >= 9.45));
  const pdf = path.join(output, `fantasy-crux-player-reference-cards-${version}.pdf`);
  await page.pdf({
    path: pdf,
    format: 'A4',
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: false,
    tagged: true,
  });
  for (const check of checks)
    await page.locator(`#page-${String(check.page).padStart(2, '0')}`).screenshot({
      path: path.join(review, `candidate-${String(check.page).padStart(2, '0')}.png`),
    });
  await writeFile(
    path.join(review, `checks-${version}.json`),
    JSON.stringify(
      {
        pages: checks,
        prohibitedSections: [
          'equipment tables',
          'licence',
          'character creation',
          'advancement',
          'GM procedures',
        ],
      },
      null,
      2,
    ) + '\n',
  );
  console.log(pdf);
} finally {
  await browser.close();
}
