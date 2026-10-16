import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import { format } from 'prettier';

const directory = path.dirname(fileURLToPath(import.meta.url));
const a5 = path.dirname(directory);
const handbook = path.dirname(a5);
const root = path.dirname(handbook);
const edition = JSON.parse(await readFile(path.join(directory, 'edition.json'), 'utf8'));
const version = process.argv[2] ?? edition.version;
assert.match(version, /^v\d{2,3}$/);
const review = path.join(directory, 'review');
const scratch = path.join(directory, 'tmp/pdfs');
await Promise.all([mkdir(review, { recursive: true }), mkdir(scratch, { recursive: true })]);
const md = new MarkdownIt({ html: false });
const esc = (value) => md.utils.escapeHtml(String(value));
const normal = (value) =>
  value
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .replaceAll('`', '')
    .replace(/\s+/g, ' ')
    .trim();
const slug = (value) => value.toLowerCase().replace(/[^a-z]+/g, '-');
const dataUrl = async (filename, mime) =>
  `data:${mime};base64,${(await readFile(filename)).toString('base64')}`;
const artMap = {
  'new-offhand': [
    'art/off-hand-v01.png',
    "A fighter follows a sword swing with a dagger attack, meeting the other fighter's ready shield.",
  ],
  'new-charge': [
    'art/charge-v01.png',
    'A two-handed spear is braced before an approaching swordsman reaches sword range.',
  ],
  'legacy-cover': [
    path.join(handbook, 'art/15-terrain-cover/illustration-v01.png'),
    'An archer aims at a soldier behind a low wall.',
  ],
  'legacy-guard': [
    path.join(a5, 'art/guard-v01.png'),
    'An aware soldier raises a ready shield to intercept an arrow.',
  ],
  'female-warrior': [null, 'A travelling warrior carries mundane arms and armour in a village.'],
  'mechanisms-trapwork': [null, 'A scout examines a mechanism with tools while a companion helps.'],
  'battle-command': [null, 'A warrior points toward the field.'],
  'ambusher-from-rafters': [
    null,
    'A fighter watches an unaware guard from a higher position behind him.',
  ],
  'shield-reaction': [null, 'A defender actively blocks a melee blow with a ready shield.'],
  'grapple-reversal': [null, "A fighter uses both hands to hold an opponent's arm."],
  'field-surgeon-under-fire': [
    null,
    'An adjacent helper treats a stationary wounded companion with field supplies.',
  ],
  'weapons-field-sketch': [null, 'Mundane weapons lie on a table for inspection.'],
  'armour-field-sketch': [
    null,
    'Five armour suits: Leather, Ringmail, Scalemail, Chainmail and Platemail.',
  ],
  'adventuring-company': [null, 'A varied company of adventurers travels together.'],
  'fire-shaping': [null, 'A Shaper works a visible fiery effect through a deliberate gesture.'],
  'night-senses-stalking': [null, 'An adventurer observes danger in the night.'],
  'enchanted-sword-identification': [null, 'An adventurer examines the signs of magic on a sword.'],
};
const assetRecords = [];
// Diagrams are generated SVG from scripts/diagrams/: print variants first, then the website set.
const diagramFolders = [path.join(directory, 'diagrams'), path.join(root, 'src/assets/diagrams')];
async function diagramFigure(data) {
  if (!data.diagram) return '';
  assert.ok(data.diagram_alt, `${data.title}: a diagram needs diagram_alt that states its rule`);
  const folder = diagramFolders.find((candidate) =>
    existsSync(path.join(candidate, `${data.diagram}.svg`)),
  );
  assert.ok(folder, `Unknown diagram ${data.diagram}`);
  const filename = path.join(folder, `${data.diagram}.svg`);
  const bytes = await readFile(filename);
  assetRecords.push({
    key: `diagram:${data.diagram}`,
    path: path.relative(root, filename),
    sha256: createHash('sha256').update(bytes).digest('hex'),
  });
  const width = data.diagram_width ? ` style="--diagram-width:${data.diagram_width}mm"` : '';
  const svg = bytes
    .toString('utf8')
    .trim()
    .replace('<svg ', `<svg role="img" aria-label="${esc(data.diagram_alt)}" `);
  return `<figure class="diagram svg-diagram"${width}>${svg}</figure>`;
}
const assets = {};
for (const [key, [relative, alt]] of Object.entries(artMap)) {
  const filename = relative
    ? path.resolve(directory, relative)
    : path.join(root, `art/library/subjects/${key}/styles/inked-adventure-comic-vivid.png`);
  const bytes = await readFile(filename);
  assets[key] = { src: await dataUrl(filename, 'image/png'), alt };
  assetRecords.push({
    key,
    path: path.relative(root, filename),
    sha256: createHash('sha256').update(bytes).digest('hex'),
  });
}
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
      return `/*! ${await readFile(path.join(base, 'LICENSE'), 'utf8')} */\n@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;src:url('${url}') format('woff2');font-display:block;}`;
    }),
  )
).join('\n');
const modules = {};
for (const file of (await readdir(path.join(handbook, 'pages'))).filter((x) => x.endsWith('.md'))) {
  const { data } = matter(await readFile(path.join(handbook, 'pages', file), 'utf8'));
  modules[data.page] = data;
}
const files = edition.pages.map(([id, file, section, oldFolio], index) => ({
  id,
  file: path.join(directory, file),
  section,
  oldFolio,
  folio: index + 1,
}));
const byId = Object.fromEntries(files.map((entry) => [entry.id, entry]));
const oldToNew = Object.fromEntries(
  files.filter((x) => x.oldFolio).map((x) => [x.oldFolio, x.folio]),
);
assert.equal(new Set(files.map((x) => x.id)).size, files.length);
const talents = new Map();
for (const file of (await readdir(path.join(root, 'src/content/rules/talents'))).filter(
  (x) => x.endsWith('.md') && x !== 'index.md',
)) {
  const source = `src/content/rules/talents/${file}`;
  const { data } = matter(await readFile(path.join(root, source), 'utf8'));
  talents.set(data.slug, { ...data, source });
}
const coveredTalents = new Set();
const allowedGM = new Set([
  'src/content/rules/gm-tools/fantasy-races.md',
  'src/content/rules/gm-tools/enchanted-items.md',
]);
function references(text, legacy) {
  if (legacy)
    text = text.replace(/\b(pages?)\s+(\d+)(?:-(\d+))?/gi, (_, label, start, end) => {
      assert.ok(oldToNew[start], `Unknown legacy page ${start}`);
      if (end) assert.ok(oldToNew[end]);
      return `${label} ${oldToNew[start]}${end ? `-${oldToNew[end]}` : ''}`;
    });
  return text.replace(/\{\{(ref|num):([^}]+)\}\}/g, (_, type, id) => {
    assert.ok(byId[id], `Unknown page reference ${id}`);
    return type === 'num' ? String(byId[id].folio) : `page ${byId[id].folio}`;
  });
}
const covered = new Set();
const sourceRecords = new Map();
const pageRecords = [];
const tableRecords = { close: [], ranged: [], armour: [] };
function tables(copy) {
  return (copy.match(/^\|.+\|\r?\n(?:\|.+\|(?:\r?\n|$))+/gm) ?? []).map((block) =>
    block
      .trim()
      .split('\n')
      .filter((line) => !/^\|[\s:|-]+\|\s*$/.test(line))
      .map((line) => line.trim().slice(1, -1).split('|').map(normal)),
  );
}
// Only insert soft wrapping into table-cell text, never HTML closing tags.
function formatTables(html, type) {
  if (!type) return html;
  const count = { close: 7, ranged: 8, armour: 4 }[type];
  return html
    .replace(
      '<table>',
      `<table class="table-${type}"><colgroup>${'<col>'.repeat(count)}</colgroup>`,
    )
    .replace(
      /(<t[dh][^>]*>)([^<]*)(<\/t[dh]>)/g,
      (_, open, text, close) => open + text.replaceAll('/', '/<wbr>') + close,
    );
}
const sections = [];
for (const entry of files) {
  const { data: original, content } = matter(await readFile(entry.file, 'utf8'));
  const data = { ...original };
  data.modules ??= data.source_modules ?? [];
  assert.ok(Array.isArray(data.modules));
  data.modules.forEach((x) => covered.add(x));
  const pageTalents = (data.talents ?? []).map((slug) => {
    assert.ok(talents.has(slug), `Unknown Talent ${slug}`);
    assert.ok(!coveredTalents.has(slug), `Duplicate Talent ${slug}`);
    coveredTalents.add(slug);
    return talents.get(slug);
  });
  const sources = [
    ...new Set([
      ...(data.sources ?? []),
      ...data.modules.flatMap((x) => modules[x].sources),
      ...pageTalents.map((x) => x.source),
    ]),
  ];
  for (const source of sources) {
    assert.ok(
      source.startsWith('src/content/rules/') &&
        (!/\/(creatures|gm-tools|gazetteer)\//.test(source) || allowedGM.has(source)),
    );
    sourceRecords.set(
      source,
      createHash('sha256')
        .update(await readFile(path.join(root, source)))
        .digest('hex'),
    );
  }
  const [rawCopy, notes, extra] = content.split(/^## Editorial notes\s*$/m);
  assert.ok(rawCopy && notes && !extra);
  const copy = references(rawCopy, Boolean(entry.oldFolio))
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .trim();
  assert.ok(!/pregenerated character edition|choose a pregenerated character/i.test(copy));
  assert.ok(copy.startsWith(`# ${data.title}\n`));
  for (const match of copy.matchAll(/pages?\s+(\d+)(?:-(\d+))?/g))
    for (const ref of match.slice(1).filter(Boolean)) assert.ok(+ref >= 1 && +ref <= files.length);
  const parsedTables = tables(copy);
  if (data.table) {
    assert.equal(parsedTables.length, 1);
    tableRecords[data.table].push(...parsedTables[0].slice(1));
  }
  if (entry.oldFolio === 12)
    Object.assign(data, {
      layout: 'ranged-attacks',
      art: 'legacy-cover',
      caption: 'LOW WALL: ATTACK -1P',
      aim: 'AIM +1B',
    });
  if (entry.oldFolio === 13)
    Object.assign(data, {
      layout: 'cover-and-defence',
      art: 'legacy-guard',
      caption: 'AFTER A HIT: SHIELD PARRY -1P',
    });
  const [head, ...blocks] = copy.replace(/^# .+\n+/, '').split(/^## /m);
  const [lead, ...rest] = head.trim().split(/\n\s*\n/);
  for (const talent of pageTalents)
    assert.ok(
      blocks.some((block) => block.startsWith(`${talent.title}\n`)),
      `Missing summary for ${talent.title}`,
    );
  const body = blocks
    .map((block) => {
      const split = block.indexOf('\n');
      const title = block.slice(0, split).trim();
      const talent = pageTalents.find((x) => x.title === title);
      const meta = talent
        ? `<p class="talent-meta"><strong>${talent.cost} IP</strong> · ${esc(talent.activation)} · ${esc(talent.prerequisites)}</p>`
        : '';
      return `<section class="rule-block ${slug(title)}${talent ? ' talent-entry' : ''}"><h2>${esc(title)}</h2>${meta}${md.render(block.slice(split).trim())}</section>`;
    })
    .join('\n');
  const folio = String(entry.folio).padStart(2, '0');
  const section = entry.section;
  const asset = assets[data.art];
  const art = asset
    ? `<figure class="scene"><div class="art-window"><img src="${asset.src}" alt="${esc(asset.alt)}">${data.aim ? `<span class="aim-label">${data.aim}</span>` : ''}</div><figcaption><span>${esc(data.caption ?? '')}</span>${data.captionRight ? `<span>${esc(data.captionRight)}</span>` : ''}</figcaption></figure>`
    : '';
  const identity = `<header class="identity"><span>FANTASY CRUX <small>2.0</small></span><span class="section">${section}</span></header>`;
  const footer = `<footer><span>PLAYER HANDBOOK / 2.0 BETA</span><span>PAGE ${folio}</span></footer>`;
  const figure = await diagramFigure(data);
  let inside = `${identity}<h1>${esc(data.title)}</h1><div class="lead player-text">${md.render(lead)}</div>${art}${figure}${formatTables(md.render(rest.join('\n\n')), data.table)}<div class="rules">${body}</div>`;
  if (data.layout === 'cover')
    inside = `${identity}<h1>Player Handbook</h1><div class="cover-subtitle">Core Rules</div><div class="cover-edition">CREATE · PLAY · IMPROVE / 2.0 BETA</div><img class="cover-art" src="${asset.src}" alt="${esc(asset.alt)}"><div class="cover-copy player-text"><h2>From your first idea to your next adventure</h2><p>Create a character. Learn the dice and combat. Choose Talents, shape magic and grow through play.</p></div>`;
  sections.push(
    `<article id="page-${folio}" class="sheet ${entry.folio % 2 ? 'odd' : 'even'} ${data.layout}" data-folio="${folio}" data-table="${data.table ?? ''}"><div class="page-content">${inside}</div>${footer}</article>`,
  );
  pageRecords.push({
    folio: entry.folio,
    title: data.title,
    file: path.relative(root, entry.file),
    modules: data.modules,
    sources,
    wordCount: copy.split(/\s+/).length,
    art: data.art ?? null,
    id: entry.id,
    section,
    talents: pageTalents.map(({ slug, title, cost, prerequisites, activation }) => ({
      slug,
      title,
      cost,
      prerequisites,
      activation,
    })),
  });
}
assert.deepEqual(
  [...covered].sort((a, b) => a - b),
  Array.from({ length: 23 }, (_, i) => i + 1),
);
assert.deepEqual(
  [...coveredTalents].sort(),
  [...talents.keys()].sort(),
  'Every current Talent must have exactly one catalogue entry.',
);
const weaponTables = tables(
  await readFile(path.join(root, 'src/content/rules/equipment/weapons.md'), 'utf8'),
);
const armourTables = tables(
  await readFile(path.join(root, 'src/content/rules/equipment/armour.md'), 'utf8'),
);
const sorted = (rows) => [...rows].sort((a, b) => a[0].localeCompare(b[0]));
// Find the weapon tables by their headers, not their position in the chapter.
const closeWeapons = weaponTables.find((t) => t[0][0] === 'Weapon' && !t[0].includes('Range'));
const rangedWeapons = weaponTables.find((t) => t[0][0] === 'Weapon' && t[0].includes('Range'));
assert.deepEqual(sorted(tableRecords.close), sorted(closeWeapons.slice(1)));
assert.deepEqual(sorted(tableRecords.ranged), sorted(rangedWeapons.slice(1)));
assert.deepEqual(tableRecords.armour, armourTables[0].slice(1));
const skillText = (
  await Promise.all(['skills-a', 'skills-b'].map((id) => readFile(byId[id].file, 'utf8')))
).join('\n');
const skillNames = (text) => [...text.matchAll(/^- \*\*([^*]+):\*\*/gm)].map((match) => match[1]);
const generalSkills = skillNames(
  await readFile(path.join(handbook, 'pages/05-skills-at-a-glance.md'), 'utf8'),
);
// Engineering merged into Mechanisms (ADR-029), leaving 23 general skills.
assert.equal(generalSkills.length, 23);
for (const skill of generalSkills)
  assert.ok(skillText.includes(`| ${skill}`), `Missing general skill: ${skill}`);
assert.ok(/\|\s*Shaping\s*\|\s*INT \+ POW\s*\|/.test(skillText));
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fantasy Crux Player Handbook</title><style>${fonts}\n${await readFile(path.join(directory, 'book.css'), 'utf8')}</style></head><body><main class="book">${sections.join('\n')}</main></body></html>`;
await writeFile(
  path.join(review, `handbook-${version}.html`),
  await format(html, { parser: 'html', printWidth: 100, singleQuote: true }),
);
await writeFile(
  path.join(review, `manifest-${version}.json`),
  JSON.stringify(
    {
      pages: pageRecords,
      assets: assetRecords,
      sources: Object.fromEntries(sourceRecords),
      equipmentRows: { close: 24, ranged: 12, armour: 5 },
      talentCount: coveredTalents.size,
      generalSkillCount: generalSkills.length,
    },
    null,
    2,
  ) + '\n',
);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1175, height: 840 },
    deviceScaleFactor: 1.5,
  });
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.decode()));
  });
  const checks = await page.evaluate(() => {
    const mm = (px) => (px / 96) * 25.4;
    return [...document.querySelectorAll('.sheet')].map((sheet) => {
      const bounds = sheet.getBoundingClientRect();
      const footer = sheet.querySelector('footer').getBoundingClientRect();
      const content = sheet.querySelector('.page-content').getBoundingClientRect();
      const texts = [
        ...sheet.querySelectorAll(
          'h1,h2,p,li,td,th,figcaption,.aim-label,.cover-subtitle,.cover-edition,footer span',
        ),
      ];
      const edge = sheet.classList.contains('odd') ? 'left' : 'right';
      const problems = texts
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.left < bounds.left - 1 ||
            r.right > bounds.right + 1 ||
            r.bottom > bounds.bottom ||
            el.scrollWidth > el.clientWidth + 1
          );
        })
        .map((el) => el.textContent.trim());
      const body = [
        ...sheet.querySelectorAll('.rules p:not(.talent-meta),.rules li,.lead p,.cover-copy p'),
      ];
      const minimum = (items) =>
        Math.min(...items.map((el) => parseFloat(getComputedStyle(el).fontSize) * 0.75));
      // Diagram text prints at its SVG font size times the figure's scale. Uppercase condensed
      // labels may be smaller than the mixed-case text that carries the content.
      const diagramText = [...sheet.querySelectorAll('.svg-diagram text')].map((el) => {
        const svg = el.ownerSVGElement;
        const scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
        return {
          pt: parseFloat(el.getAttribute('font-size')) * scale * 0.75,
          label: el.getAttribute('font-family').includes('Barlow'),
        };
      });
      const smallest = (items) => (items.length ? Math.min(...items.map((item) => item.pt)) : null);
      const safe = [
        ...sheet.querySelectorAll(
          '.identity,h1,.lead,.scene,.diagram,table,.rules,footer,.cover-art,.cover-copy,.cover-subtitle,.cover-edition',
        ),
      ];
      return {
        folio: Number(sheet.dataset.folio),
        widthMm: mm(bounds.width),
        heightMm: mm(bounds.height),
        bindingEdge: edge,
        bindingClearanceMm: Math.min(
          ...safe.map((el) => {
            const r = el.getBoundingClientRect();
            return mm(edge === 'left' ? r.left - bounds.left : bounds.right - r.right);
          }),
        ),
        footerGapMm: mm(footer.top - content.bottom),
        minBodyPt: minimum(body),
        minTablePt: sheet.querySelector('td')
          ? minimum([...sheet.querySelectorAll('td,th')])
          : null,
        minDiagramPt: smallest(diagramText.filter((item) => !item.label)),
        minDiagramLabelPt: smallest(diagramText.filter((item) => item.label)),
        problems,
        fragments: texts.map((el) => el.textContent.trim().replace(/\s+/g, ' ')),
      };
    });
  });
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const metadata = await page.evaluate(() => ({
    fontsLoaded:
      document.fonts.check('700 24px "Barlow Condensed"') &&
      document.fonts.check('400 16px "Atkinson Hyperlegible"') &&
      document.fonts.check('500 12px "IBM Plex Mono"'),
    brokenImages: [...document.images].filter((x) => !x.naturalWidth).length,
  }));
  const result = {
    ...metadata,
    accessibilityViolations: axe.violations.map((x) => ({
      id: x.id,
      nodes: x.nodes.map((n) => n.target),
    })),
    pages: checks,
  };
  await writeFile(
    path.join(review, `checks-${version}.json`),
    JSON.stringify(result, null, 2) + '\n',
  );
  await page.pdf({
    path: path.join(scratch, `rules-${version}.pdf`),
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
  });
  for (const check of checks) {
    await page.locator(`#page-${String(check.folio).padStart(2, '0')}`).screenshot({
      path: path.join(review, `${version}-candidate-${String(check.folio).padStart(2, '0')}.png`),
    });
    console.log(JSON.stringify({ ...check, fragments: undefined }));
  }
  assert.equal(result.fontsLoaded, true);
  assert.equal(result.brokenImages, 0);
  assert.deepEqual(result.accessibilityViolations, []);
  const errors = checks.filter(
    (x) =>
      x.problems.length ||
      x.footerGapMm < 2 ||
      x.bindingClearanceMm < 14.95 ||
      x.minBodyPt < 10.99 ||
      (x.minTablePt !== null && x.minTablePt < 9.99) ||
      (x.minDiagramPt !== null && x.minDiagramPt < 9.99) ||
      (x.minDiagramLabelPt !== null && x.minDiagramLabelPt < 8.99),
  );
  assert.deepEqual(
    errors.map(({ fragments, ...metrics }) => metrics),
    [],
    'Layout needs another pass; inspect candidate images.',
  );
  console.log(
    `${files.length} pages passed geometry, type, artwork, source inventory, all ${coveredTalents.size} Talents and equipment checks.`,
  );
} finally {
  await browser.close();
}
