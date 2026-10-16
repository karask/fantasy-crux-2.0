// Renders Fantasy Crux Lite: one Markdown file per A4 page, typeset with the reference-card
// stylesheet, then the complete Open Game License. Lite must stay compatible with the full
// rules, so every table it shares with them is checked against the canonical source.
import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import { format } from 'prettier';

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory, '../..');
const rules = path.join(root, 'src/content/rules');
const version = process.argv[2] ?? 'v02';
assert.match(version, /^v\d{2,3}$/);
const output = path.join(directory, 'output/pdf');
const review = path.join(directory, 'review');
await Promise.all([mkdir(output, { recursive: true }), mkdir(review, { recursive: true })]);

const md = new MarkdownIt({ html: false });
const esc = (value) => md.utils.escapeHtml(String(value));
const slug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
const body = async (file) => matter(await readFile(file, 'utf8'));

// ---- Canonical tables -------------------------------------------------------------------------

/** Pipe tables in a Markdown string, as arrays of rows of trimmed cells, header first. */
function tables(markdown) {
  const blocks = markdown.match(/^\|.+\|\r?\n(?:\|.+\|(?:\r?\n|$))+/gm) ?? [];
  return blocks.map((block) =>
    block
      .trim()
      .split('\n')
      .filter((line) => !/^\|[\s:|-]+\|\s*$/.test(line))
      .map((line) =>
        line
          .trim()
          .slice(1, -1)
          .split('|')
          .map((cell) => cell.replace(/[`*]/g, '').trim().replace(/\s+/g, ' ')),
      ),
  );
}
const canonical = async (file) => tables((await body(path.join(rules, file))).content);
const tableWith = (list, first, header) =>
  list.find((t) => t[0][0] === first && (!header || t[0].includes(header)));
const key = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
const same = (a, b) => a.replace(/\s+/g, '') === b.replace(/\s+/g, '');

const checks = [];
function check(label, condition, detail = '') {
  checks.push({ label, ok: Boolean(condition), detail });
  assert.ok(condition, `Lite differs from the full rules: ${label} ${detail}`);
}

/** Compare each Lite row (several names per row allowed) with the canonical row of each name. */
function compareRows(label, liteTable, canonTable, columns) {
  const canonRows = new Map(canonTable.slice(1).map((row) => [key(row[0]), row]));
  const liteHeader = liteTable[0];
  const canonHeader = canonTable[0];
  for (const row of liteTable.slice(1)) {
    const names = canonRows.has(key(row[0])) ? [row[0]] : row[0].split(/,\s*/);
    for (const name of names) {
      const canon = canonRows.get(key(name));
      check(`${label}: ${name} is a full-rules entry`, canon);
      for (const [liteColumn, canonColumn, normalise = (v) => v] of columns) {
        const lite = normalise(row[liteHeader.indexOf(liteColumn)]);
        const full = normalise(canon[canonHeader.indexOf(canonColumn)]);
        check(`${label}: ${name} ${liteColumn}`, same(lite, full), `(${lite} vs ${full})`);
      }
    }
  }
}

// ---- Pages ----------------------------------------------------------------------------------

const files = (await readdir(path.join(directory, 'content')))
  .filter((file) => file.endsWith('.md'))
  .sort();
const pageData = [];
for (const file of files) {
  const { data, content } = await body(path.join(directory, 'content', file));
  assert.ok(data.title && data.subtitle && data.label, `${file}: title, subtitle and label`);
  assert.ok(data.sources?.length, `${file}: list the full-rules sources`);
  for (const source of data.sources) await readFile(path.join(root, source), 'utf8');
  const copy = content.trim();
  assert.ok(copy.startsWith(`# ${data.title}\n`), `${file}: heading must match the title`);
  assert.ok(!/\bpage \d|\bp\. ?\d/i.test(copy), `${file}: refer to sections, not page numbers`);
  pageData.push({ file, data, copy });
}

// Bestiary rows come straight from the creature profiles.
async function bestiary(entries) {
  const rows = [];
  for (const { slug: creature, note } of entries) {
    const { data } = await body(path.join(rules, 'creatures', `${creature}.md`));
    const d = data.derived;
    const skill = (name) =>
      data.skills.find((entry) => entry.startsWith(`${name} `))?.slice(name.length + 1) ?? '—';
    const attacks = data.attacks
      .map((attack) => {
        const [name, rest] = attack.split(' — ');
        const chance = rest?.match(/(\d+)%/)?.[1];
        if (!chance) return null;
        const damage = rest
          .match(/`([^`]+)`/)?.[1]
          .replace(/\s*\+\s*0$/, '')
          .replace(/\s+/g, '');
        const size = rest.match(/\b(Light|Medium|Heavy|Huge)\b/)?.[1];
        const reach = rest.match(/(\d+ m)\b/)?.[1];
        return [`${name} ${chance}%`, damage ?? 'special', size, reach].filter(Boolean).join(', ');
      })
      .filter(Boolean)
      .slice(0, 3);
    const armour = String(d.ap).replace(/^(\d+) (.+)$/, '$1 ($2)');
    const stats = [
      `HP ${d.hp}`,
      `MWL ${d.mwl}`,
      `AP ${armour}`,
      `Move ${d.movement}`,
      `CO ${d.combatOrder}`,
      `Dodge ${skill('Dodge')}, Persistence ${skill('Persistence')}, Resilience ${skill('Resilience')}`,
    ].join(' · ');
    const extra = note && note !== '—' ? ` ${note}` : '';
    rows.push(`**${data.title}** · ${stats}. ${attacks.join('; ')}.${extra}`);
  }
  return rows.join('\n\n');
}

// Talent costs and requirements come straight from the Talent files, as "(2 IP; Close Combat 51%)".
// A group placeholder stands for Talents that share a cost and a 51% requirement in their own skill.
const talentSlugs = new Set();
function requirement(text) {
  return String(text)
    .replace(/^A /, 'a ')
    .replace(/, as used by the chosen weapon$/, '')
    .replace(/(\w+) Combat (\d+%) or (\w+) Combat \2/, '$1 or $3 Combat $2')
    .replace(/ and /, ', ');
}
async function talentTag(list) {
  const slugs = list.split(',').map((slug) => slug.trim());
  const talents = [];
  for (const talent of slugs) {
    const { data } = await body(path.join(rules, 'talents', `${talent}.md`));
    assert.ok(
      Number.isInteger(data.cost) && data.prerequisites,
      `${talent}: cost and prerequisites`,
    );
    talentSlugs.add(talent);
    talents.push(data);
  }
  if (talents.length === 1)
    return `(${talents[0].cost} IP; ${requirement(talents[0].prerequisites)})`;
  const [first] = talents;
  assert.ok(
    talents.every((t) => t.cost === first.cost && /^[A-Z][A-Za-z ]+ 51%$/.test(t.prerequisites)),
    `${list}: a group must share its cost and a 51% requirement`,
  );
  return `(${first.cost} IP; 51% in that skill)`;
}
async function expandTalents(text) {
  let result = text;
  for (const match of text.matchAll(/\{\{talent:([a-z,-]+)\}\}/g)) {
    result = result.replace(match[0], await talentTag(match[1]));
  }
  return result;
}

function sectionHtml(block) {
  const split = block.indexOf('\n');
  const title = block.slice(0, split).trim();
  const markdown = block.slice(split).trim();
  return {
    title,
    html: `<section class="rule ${slug(title.replace(/^\d+\.\s*/, ''))}"><h2>${esc(title)}</h2>${md.render(markdown)}</section>`,
  };
}

const pages = [];
const liteTables = {};
for (const [index, { file, data, copy }] of pageData.entries()) {
  let text = copy;
  if (data.bestiary) {
    assert.ok(text.includes('{{bestiary}}'), `${file}: place {{bestiary}}`);
    text = text.replace('{{bestiary}}', await bestiary(data.bestiary));
  }
  text = await expandTalents(text);
  assert.ok(!text.includes('{{'), `${file}: unknown placeholder`);
  const blocks = text
    .replace(/^# .+\n+/, '')
    .split(/^## /m)
    .filter(Boolean);
  const sections = blocks.map(sectionHtml);
  for (const block of blocks) {
    const title = block.slice(0, block.indexOf('\n')).trim();
    liteTables[title] = tables(block);
  }
  const wideTop = data.wide_top ?? [];
  const wideBottom = data.wide_bottom ?? [];
  const isWide = (title) => wideTop.includes(title) || wideBottom.includes(title);
  for (const title of [...wideTop, ...wideBottom])
    assert.ok(
      sections.some((s) => s.title === title),
      `${file}: no section ${title}`,
    );
  const flowing = sections.filter((s) => !isWide(s.title));
  const columnBreak = flowing.findIndex((s) => s.title === data.column_break);
  assert.ok(columnBreak > 0, `${file}: column_break must name a later section`);
  const columns = [flowing.slice(0, columnBreak), flowing.slice(columnBreak)]
    .map((column) => `<div class="rule-column">${column.map((s) => s.html).join('\n')}</div>`)
    .join('\n');
  const wide = (titles) =>
    titles.length
      ? `<div class="rules-wide">${sections
          .filter((s) => titles.includes(s.title))
          .map((s) => s.html.replace('class="rule ', 'class="rule rule-wide '))
          .join('\n')}</div>`
      : '';
  const folio = index + 1;
  let art = '';
  if (data.cover) {
    const bytes = await readFile(path.join(directory, data.art));
    art = `<figure class="cover-art"><img src="data:image/jpeg;base64,${bytes.toString('base64')}" alt="${esc(data.art_alt)}"></figure>`;
  }
  const heading = data.cover
    ? `<h1>${esc(data.title)}</h1><p class="subtitle">${esc(data.subtitle)}</p>${art}`
    : `<h1>${esc(data.title)}</h1><p class="subtitle">${esc(data.subtitle)}</p>`;
  pages.push(
    `<article id="page-${String(folio).padStart(2, '0')}" class="card${data.cover ? ' cover' : ''}" data-folio="${folio}"><header class="identity"><span>FANTASY CRUX <small>LITE</small></span><span class="side">${esc(data.label)}</span></header>${heading}${wide(wideTop)}<main class="rules">${columns}</main>${wide(wideBottom)}<footer><span>FANTASY CRUX LITE · 2.0 BETA</span><span>PAGE ${folio}</span></footer></article>`,
  );
}

// The complete existing licence travels with the rules.
const licenceSource = (await readFile(path.join(root, 'player-handbook/LICENSE.md'), 'utf8'))
  .replace(/^---\n[\s\S]*?\n---\n/, '')
  .replace(/\s*\{#[^}]+\}/g, '')
  .trim();
// Keep each licence heading with its first paragraph across the three columns.
const licenceHtml = md
  .render(licenceSource.replace(/^# .+\n+/, ''))
  .replace(/(<h2>[\s\S]*?<\/h2>\s*<p>[\s\S]*?<\/p>)/g, '<div class="keep">$1</div>');
const licenceFolio = pages.length + 1;
pages.push(
  `<article id="page-${String(licenceFolio).padStart(2, '0')}" class="card licence" data-folio="${licenceFolio}"><header class="identity"><span>FANTASY CRUX <small>LITE</small></span><span class="side">LICENCE</span></header><h1>Open Game License</h1><p class="subtitle">Version 1.0a, with the copyright notices it requires.</p><div class="licence-text">${licenceHtml}</div><footer><span>FANTASY CRUX LITE · 2.0 BETA</span><span>PAGE ${licenceFolio}</span></footer></article>`,
);

// ---- Compatibility checks ---------------------------------------------------------------------

const weapons = await canonical('equipment/weapons.md');
const hands = (v) => v.replace(/,\s*/g, '/');
compareRows('Close weapons', liteTables['Close weapons'][0], tableWith(weapons, 'Weapon', 'Size'), [
  ['Damage', 'Damage'],
  ['Size', 'Size'],
  ['Hands', 'Type', hands],
  ['STR/DEX', 'STR/DEX'],
  ['ENC', 'ENC'],
  ['Cost', 'Cost'],
]);
compareRows(
  'Ranged weapons',
  liteTables['Ranged weapons'][0],
  tableWith(weapons, 'Weapon', 'Range'),
  [
    ['Damage', 'Damage'],
    ['Range', 'Range'],
    ['STR/DEX', 'STR/DEX'],
    ['ENC', 'ENC'],
    ['Cost', 'Cost'],
  ],
);
compareRows('Armour', liteTables.Armour[0], (await canonical('equipment/armour.md'))[0], [
  ['AP', 'AP'],
  ['ENC', 'ENC'],
  ['Cost', 'Cost'],
]);

const creation = await canonical('characters/character-creation.md');
const baseRows = creation
  .filter((t) => t[0][1] === 'Base')
  .flatMap((t) => t.slice(1))
  .map(([skill, base]) => [skill.replace('Craft (type)', 'Craft (trade)'), base]);
const liteSkills = liteTables['4. Skills'].flatMap((t) => t.slice(1)).filter((row) => row[1]);
for (const [skill, base] of baseRows) {
  const row = liteSkills.find((r) => r[0] === skill);
  check(`Skill base: ${skill}`, row && same(row[1], base), row ? `(${row[1]} vs ${base})` : '');
}
check('Skill count', liteSkills.length === baseRows.length + 1, `(${liteSkills.length})`);
check(
  'Shaping base',
  liteSkills.some((r) => r[0].startsWith('Shaping') && same(r[1], 'INT + POW')),
);
check(
  'Damage Modifier steps',
  creation
    .find((t) => t[0][1] === 'Damage Modifier')
    .slice(1, -1)
    .every(([range, dm]) =>
      pageData
        .find((p) => p.file.includes('characters'))
        .copy.replace(/\*/g, '')
        .replace(/\s+/g, ' ')
        .includes(`${range} ${dm}`),
    ),
);

const races = await canonical('gm-tools/fantasy-races.md');
check(
  'Ancestry spreads',
  JSON.stringify(liteTables['2. Ancestry and characteristics'][0].slice(1)) ===
    JSON.stringify(tableWith(races, 'Race', 'STR').slice(1)),
);
check(
  'Ancestry maxima',
  JSON.stringify(liteTables['Ancestry maxima'][0].slice(1)) ===
    JSON.stringify(
      races
        .filter((t) => t[0][0] === 'Race' && t[0][1] === 'STR')
        .at(-1)
        .slice(1),
    ),
);

// Ancestry abilities: Lite's IP costs must equal the sum of the listed abilities.
const raceBody = (await body(path.join(rules, 'gm-tools/fantasy-races.md'))).content;
const characters = pageData.find((p) => p.file.includes('characters')).copy.replace(/\s+/g, ' ');
for (const line of raceBody.match(/^- \*\*\w+\*\* — .+$/gm)) {
  const race = line.match(/^- \*\*(\w+)\*\*/)[1];
  const cost = /No innate abilities/.test(line)
    ? 0
    : [...line.matchAll(/(\d+) IP/g)].reduce((sum, m) => sum + Number(m[1]), 0);
  const lite = characters.match(new RegExp(`\\*\\*${race}\\*\\* \\((\\d+) IP\\)`));
  check(`Ancestry IP: ${race}`, lite && Number(lite[1]) === cost, `(${lite?.[1]} vs ${cost})`);
}
check('Talent costs from the Talent files', talentSlugs.size > 0, `(${talentSlugs.size} Talents)`);
for (const talent of talentSlugs) check(`Talent: ${talent}`, true);

const building = await canonical('magic/building-a-shaping.md');
const limits = tableWith(building, 'Shaping', 'Safe Magnitude').slice(1);
check(
  'Shaping limits',
  JSON.stringify(liteTables['Your limits'][0].slice(1)) ===
    JSON.stringify(limits.map((row) => [row[0], row[2], row[3]])),
);
const beings = tableWith(await canonical('magic/effects.md'), 'Intensity', 'HP').slice(1);
const outcomes = liteTables['Common outcomes'][0];
const summon = outcomes.find((row) => row[0] === 'Summon')[1];
for (const [i, hp, ap, attack, damage] of beings) {
  const expected = `I${i}: ${hp} HP${ap === '0' ? '' : `, ${ap} AP`}, ${attack}, ${damage}.`;
  check(`Summon I${i}`, summon.includes(expected), `(${expected})`);
}
const travel = tableWith(await canonical('adventuring/travel.md'), 'Pace');
for (const row of liteTables.Travel[0].slice(1)) {
  const canon = travel.find((r) => key(r[0]) === key(row[0]));
  check(`Travel: ${row[0]}`, canon && same(canon[1], row[1]));
}
const fatigue = tableWith(await canonical('adventuring/fatigue-and-survival.md'), 'State');
check(
  'Fatigue states',
  JSON.stringify(liteTables.Fatigue[0].slice(1)) === JSON.stringify(fatigue.slice(1)),
);
const objects = (await canonical('adventuring/objects.md'))[0];
for (const row of liteTables.Objects[0].slice(1)) {
  const name = row[0].replace('Hut wall, 2 m', 'Hut wall, 2-metre section');
  const canon = objects.find((r) => r[0] === name);
  check(`Object: ${row[0]}`, canon && canon[1] === row[1] && canon[2] === row[2]);
}

// ---- Typeset, check, print ---------------------------------------------------------------------

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
const css = (
  await Promise.all([
    readFile(path.join(root, 'player-handbook/reference-cards/cards.css'), 'utf8'),
    readFile(path.join(directory, 'lite.css'), 'utf8'),
  ])
).join('\n');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fantasy Crux Lite</title><style>${fonts}\n${css}</style></head><body><div class="book">${pages.join('\n')}</div></body></html>`;
await writeFile(
  path.join(review, `lite-${version}.html`),
  await format(html, { parser: 'html', printWidth: 100, singleQuote: true }),
);

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1120, height: 1584 },
    deviceScaleFactor: 1.25,
  });
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.decode()));
  });
  const geometry = await page.evaluate(() =>
    [...document.querySelectorAll('.card')].map((card) => {
      const mm = (px) => (px / 96) * 25.4;
      const bounds = card.getBoundingClientRect();
      const footer = card.querySelector('footer').getBoundingClientRect();
      const texts = [...card.querySelectorAll('h1,h2,h3,p,li,th,td,figure,.identity span')];
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
        .map((el) => el.textContent.trim().slice(0, 80));
      const licence = card.querySelector('.licence-text');
      if (licence && licence.scrollWidth > licence.clientWidth + 1)
        problems.push('licence overflows');
      const sized = texts.filter((el) => !el.closest('.licence-text'));
      const minPt = Math.min(
        ...sized.map((el) => parseFloat(getComputedStyle(el).fontSize) * 0.75),
      );
      const blocks = [...card.querySelectorAll('.rule-column, .rules-wide')];
      const lowest = Math.max(
        ...blocks.map((block) => (block.lastElementChild ?? block).getBoundingClientRect().bottom),
        card.querySelector('.licence-text')?.getBoundingClientRect().bottom ?? 0,
      );
      return {
        page: Number(card.dataset.folio),
        footerGapMm: mm(footer.top - lowest),
        columns: [...card.querySelectorAll('.rule-column')].map((column) =>
          mm(footer.top - (column.lastElementChild ?? column).getBoundingClientRect().bottom),
        ),
        sections: [...card.querySelectorAll('.rule')].map(
          (rule) =>
            `${rule.querySelector('h2').textContent} ${mm(rule.getBoundingClientRect().height).toFixed(0)}`,
        ),
        minPt,
        problems,
        expectedText: card.innerText,
      };
    }),
  );
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const fontsLoaded = await page.evaluate(
    () =>
      document.fonts.check('700 24px "Barlow Condensed"') &&
      document.fonts.check('400 16px "Atkinson Hyperlegible"') &&
      document.fonts.check('500 12px "IBM Plex Mono"'),
  );
  for (const g of geometry) {
    await page.locator(`#page-${String(g.page).padStart(2, '0')}`).screenshot({
      path: path.join(review, `${version}-candidate-${String(g.page).padStart(2, '0')}.png`),
    });
    console.log(JSON.stringify({ ...g, expectedText: undefined }));
  }
  await writeFile(
    path.join(review, `checks-${version}.json`),
    JSON.stringify(
      {
        version,
        pages: geometry,
        compatibilityChecks: checks.length,
        compatibility: checks,
        fontsLoaded,
        accessibilityViolations: axe.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        sources: pageData.map(({ file, data }) => ({ file, sources: data.sources })),
      },
      null,
      2,
    ) + '\n',
  );
  // Every word of the licence must reach the page, in order.
  // Headings are uppercased by CSS, so compare case-insensitively.
  const words = (text) => text.toLowerCase().replace(/[“”]/g, '"').split(/\s+/).filter(Boolean);
  const licenceWords = words(
    licenceSource
      .replace(/^# .+\n+/, '')
      .replace(/^\d+\.\s+/gm, '')
      .replace(/^#+\s*/gm, '')
      .replace(/[*_`]/g, ''),
  );
  const licencePage = words(geometry.at(-1).expectedText).join(' ');
  check('Complete licence text', licencePage.includes(licenceWords.join(' ')));
  assert.equal(fontsLoaded, true);
  assert.deepEqual(
    axe.violations.map((v) => v.id),
    [],
  );
  const errors = geometry.filter((g) => g.problems.length || g.footerGapMm < 4 || g.minPt < 9.45);
  assert.deepEqual(
    errors.map(({ expectedText, ...g }) => g),
    [],
    'Layout needs another pass; inspect the candidate images.',
  );
  const pdf = path.join(output, `fantasy-crux-lite-${version}.pdf`);
  await page.pdf({
    path: pdf,
    format: 'A4',
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: false,
    tagged: true,
  });
  console.log(`${geometry.length} pages passed; ${checks.length} compatibility checks passed.`);
  console.log(pdf);
} finally {
  await browser.close();
}
