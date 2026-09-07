import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import nunjucks from 'nunjucks';
import { format } from 'prettier';

const directory = path.dirname(fileURLToPath(import.meta.url));
const handbook = path.dirname(directory);
const root = path.dirname(handbook);
const version = process.argv[2] ?? 'v02';
assert.match(version, /^v\d{2,3}$/);
const binding = process.argv[3] ?? (version === 'v01' ? 'fold' : 'spiral');
assert.ok(['fold', 'spiral'].includes(binding), 'Binding must be fold or spiral.');
assert.ok(version !== 'v01' || binding === 'fold', 'Preserve v01 as the folded proof.');
const review = path.join(directory, 'review');
const output = path.join(directory, 'output/pdf');
await Promise.all([mkdir(review, { recursive: true }), mkdir(output, { recursive: true })]);
const basename = `ranged-spread-${version}`;
const markdown = new MarkdownIt({ html: false });
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
    fontSpecs.map(async ([family, weight, slug]) => {
      const base = path.join(root, `node_modules/@fontsource/${slug}`);
      const licence = await readFile(path.join(base, 'LICENSE'), 'utf8');
      const url = await dataUrl(
        path.join(base, `files/${slug}-latin-${weight}-normal.woff2`),
        'font/woff2',
      );
      return `/*! ${family} ${weight}\n${licence}\n*/\n@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:block;src:url('${url}') format('woff2');}`;
    }),
  )
).join('\n');

const art = [
  {
    id: 'ranged-attacks',
    side: 'L',
    bindingEdge: 'right',
    proofFolio: binding === 'spiral' ? '02' : 'L',
    role: 'ATTACKER',
    aimLabel: 'AIM +1B',
    filename: path.join(handbook, 'art/15-terrain-cover/illustration-v01.png'),
    alt: "An archer in open ground aims at a soldier whose lower body is behind a low stone wall. The wall affects the archer's attack roll.",
    artLabel: 'LOW WALL: ATTACK',
    artModifier: '-1P',
  },
  {
    id: 'cover-and-defence',
    side: 'R',
    bindingEdge: 'left',
    proofFolio: binding === 'spiral' ? '03' : 'R',
    role: 'DEFENDER',
    aimLabel: '',
    filename: path.join(directory, 'art/guard-v01.png'),
    alt: 'A soldier actively raises a ready shield to intercept an arrow above a low wall. This is a separate defence roll after a hit.',
    artLabel: 'AFTER A HIT: SHIELD PARRY',
    artModifier: '-1P',
  },
];
const pages = await Promise.all(
  art.map(async (item) => {
    const { data, content } = matter(
      await readFile(path.join(directory, `content/${item.id}.md`), 'utf8'),
    );
    assert.equal(data.id, item.id);
    for (const source of data.sources) {
      assert.ok(source.startsWith('src/content/rules/') && !source.includes('..'));
      await readFile(path.join(root, source));
    }
    const [copy, notes, extra] = content.split(/^## Editorial notes\s*$/m);
    assert.ok(copy && notes && !extra, 'Keep exactly one editorial boundary.');
    assert.ok(!/\b(?:Shaping|Talents?|Power Points|Improvement Points)\b/i.test(copy));
    assert.ok(!/^\|/m.test(copy), 'Only equipment pages may use tables.');
    const [head, ...blocks] = copy.trim().split(/^## /m);
    assert.ok(head.startsWith(`# ${data.title}\n`));
    const intro = markdown.render(head.replace(/^# .+\n+/, '').trim());
    const sections = blocks.map((block) => {
      const split = block.indexOf('\n');
      const title = block.slice(0, split).trim();
      return {
        title,
        className: title.toLowerCase().replace(/[^a-z]+/g, '-'),
        html: markdown.render(block.slice(split).trim()),
      };
    });
    return {
      ...item,
      ...data,
      art: await dataUrl(item.filename, 'image/png'),
      intro,
      sections,
      wordCount: copy.trim().split(/\s+/).length,
    };
  }),
);
assert.deepEqual(
  [...new Set(pages.flatMap((item) => item.source_modules))].sort((a, b) => a - b),
  [14, 15, 16],
);
const env = new nunjucks.Environment(null, { autoescape: true, throwOnUndefined: true });
const html = await format(
  env.renderString(await readFile(path.join(directory, 'spread.njk'), 'utf8'), {
    pages,
    fonts,
    binding,
    proofLabel: binding === 'spiral' ? 'SPIRAL PROOF' : 'A5 PROOF',
    css:
      (await readFile(path.join(directory, 'page.css'), 'utf8')) +
      (binding === 'spiral' ? await readFile(path.join(directory, 'spiral.css'), 'utf8') : ''),
  }),
  { parser: 'html', printWidth: 100, singleQuote: true },
);
await writeFile(path.join(review, `${basename}.html`), html);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1123, height: 794 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.decode()));
  });
  const checks = await page.evaluate(() => {
    const pages = [...document.querySelectorAll('.sheet')].map((sheet) => {
      const bounds = sheet.getBoundingClientRect();
      const footer = sheet.querySelector('footer').getBoundingClientRect();
      const rules = sheet.querySelector('.rules').getBoundingClientRect();
      const bindingEdge = sheet.dataset.bindingEdge;
      const bindingClearanceMm = Math.min(
        ...[...sheet.querySelectorAll('h1,h2,p,li,figcaption,footer,.art-window,.identity')].map(
          (element) => {
            const r = element.getBoundingClientRect();
            return (
              ((bindingEdge === 'right' ? bounds.right - r.right : r.left - bounds.left) / 96) *
              25.4
            );
          },
        ),
      );
      const problems = [...sheet.querySelectorAll('h1,h2,p,li,figcaption,footer')]
        .filter((element) => {
          const r = element.getBoundingClientRect();
          return (
            r.left < bounds.left ||
            r.right > bounds.right ||
            r.bottom > bounds.bottom ||
            element.scrollWidth > element.clientWidth + 1
          );
        })
        .map((element) => element.textContent.trim());
      const minBodyPt = Math.min(
        ...[...sheet.querySelectorAll('.player-text p,.player-text li')].map(
          (element) => parseFloat(getComputedStyle(element).fontSize) * 0.75,
        ),
      );
      return {
        id: sheet.className,
        widthMm: (bounds.width / 96) * 25.4,
        heightMm: (bounds.height / 96) * 25.4,
        minBodyPt,
        bindingEdge,
        bindingClearanceMm,
        footerGapMm: ((footer.top - rules.bottom) / 96) * 25.4,
        problems,
        copyFragments: [
          ...sheet.querySelectorAll(
            '.player-text,h1,h2,figcaption > span,figcaption > strong,.aim-label,footer > span',
          ),
        ].map((element) => element.textContent.trim().replace(/\s+/g, ' ')),
        fullText: sheet.innerText,
      };
    });
    return {
      pages,
      brokenImages: [...document.images].filter((img) => !img.naturalWidth).length,
      fontsLoaded:
        document.fonts.check('700 24px "Barlow Condensed"') &&
        document.fonts.check('400 16px "Atkinson Hyperlegible"') &&
        document.fonts.check('500 12px "IBM Plex Mono"'),
    };
  });
  // Save an inspection candidate even when geometry needs another layout pass.
  await page.screenshot({ path: path.join(review, `${basename}.png`), fullPage: true });
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  checks.accessibilityViolations = axe.violations.map(({ id, nodes }) => ({
    id,
    targets: nodes.map((node) => node.target),
  }));
  checks.wordCounts = pages.map(({ id, wordCount }) => ({ id, wordCount }));
  checks.binding = binding;
  await writeFile(
    path.join(review, `${basename}-checks.json`),
    JSON.stringify(checks, null, 2) + '\n',
  );
  console.log(
    JSON.stringify(
      { ...checks, pages: checks.pages.map(({ fullText, copyFragments, ...metrics }) => metrics) },
      null,
      2,
    ),
  );
  assert.equal(checks.brokenImages, 0);
  assert.ok(checks.fontsLoaded);
  assert.deepEqual(checks.accessibilityViolations, []);
  for (const item of checks.pages) {
    assert.ok(Math.abs(item.widthMm - 148.5) < 0.05 && Math.abs(item.heightMm - 210) < 0.05);
    assert.ok(item.minBodyPt >= 10.99, 'Do not shrink body text below 11 pt.');
    assert.ok(
      item.bindingClearanceMm >= (binding === 'spiral' ? 14.95 : 11.95),
      `${item.id}: content intrudes into the binding clearance.`,
    );
    assert.deepEqual(item.problems, []);
    assert.ok(item.footerGapMm >= 2, `${item.id}: rules collide with footer.`);
    assert.ok(!item.fullText.includes('Editorial notes'));
  }
  // Freeze this binding-only revision; later numbered editions may revise copy.
  if (binding === 'spiral' && version === 'v02') {
    const baseline = JSON.parse(
      await readFile(path.join(review, 'ranged-spread-v01-checks.json'), 'utf8'),
    );
    const rulesOnly = (fragments) =>
      fragments.filter((fragment) => !/^(?:A5|SPIRAL) PROOF /.test(fragment));
    assert.deepEqual(
      checks.pages.map((item) => rulesOnly(item.copyFragments)),
      baseline.pages.map((item) => rulesOnly(item.copyFragments)),
      'Binding adaptation must retain every existing rule and annotation.',
    );
  }
  await page.pdf({
    path: path.join(output, `${basename}-reading.pdf`),
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
  });
  await context.close();
  console.log(`Saved native A5-format reading PDF and review spread: ${basename}`);
} finally {
  await browser.close();
}
