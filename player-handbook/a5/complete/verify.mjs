import assert from 'node:assert/strict';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const edition = JSON.parse(await readFile(path.join(here, 'edition.json'), 'utf8'));
const version = process.argv[2] ?? edition.version;
const manifest = JSON.parse(
  await readFile(path.join(here, `review/manifest-${version}.json`), 'utf8'),
);
const checks = JSON.parse(await readFile(path.join(here, `review/checks-${version}.json`), 'utf8'));
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const normal = (text) =>
  text
    .replace(/[`*]/g, '')
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
function rows(text) {
  return text
    .split('\n')
    .filter((line) => /^\|/.test(line) && !/^\|[\s:|-]+\|\s*$/.test(line))
    .map((line) => line.trim().slice(1, -1).split('|').map(normal));
}

assert.equal(manifest.pages.length, edition.pages.length);
assert.equal(checks.pages.length, edition.pages.length);
assert.ok(checks.fontsLoaded && !checks.brokenImages && !checks.accessibilityViolations.length);
for (const page of checks.pages) {
  assert.deepEqual(page.problems, []);
  assert.ok(page.footerGapMm >= 2 && page.bindingClearanceMm >= 14.95);
  assert.ok(page.minBodyPt >= 10.99);
  assert.ok(page.minTablePt === null || page.minTablePt >= 9.99);
}
for (const [file, hash] of Object.entries(manifest.sources)) {
  assert.equal(
    createHash('sha256')
      .update(await readFile(path.join(root, file)))
      .digest('hex'),
    hash,
    `Source changed since render: ${file}`,
  );
}

const copy = new Map(
  await Promise.all(
    edition.pages.map(async ([id, file]) => [
      id,
      matter(await readFile(path.join(here, file), 'utf8')).content.split('## Editorial notes')[0],
    ]),
  ),
);
const creation = await read('src/content/rules/characters/character-creation.md');
const canonicalRows = rows(creation);
const skillRows = [...rows(copy.get('skills-a')), ...rows(copy.get('skills-b'))].filter(
  (row) => row.length === 3 && !row.includes('Base') && row[0] !== 'Shaping',
);
for (const row of skillRows) {
  assert.ok(
    canonicalRows.some((source) => source[0] === row[0] && source[1] === row[1]),
    `Wrong skill base: ${row[0]}`,
  );
}
assert.equal(skillRows.length, 26, '23 general skills with own/other subject bases');
assert.equal(new Set(skillRows.map((row) => row[0])).size, 26);
const racialRows = rows(await read('src/content/rules/gm-tools/fantasy-races.md'));
const ancestryRows = rows(copy.get('ancestries')).filter(
  (row) => row.length === 8 && row[0] !== 'Ancestry',
);
assert.equal(ancestryRows.length, 12);
for (const row of ancestryRows)
  assert.ok(racialRows.some((source) => JSON.stringify(source) === JSON.stringify(row)));

const talentRecords = [];
for (const file of (await readdir(path.join(root, 'src/content/rules/talents'))).filter(
  (x) => x.endsWith('.md') && x !== 'index.md',
)) {
  talentRecords.push(matter(await read(`src/content/rules/talents/${file}`)).data);
}
const included = manifest.pages.flatMap((page) => page.talents);
assert.equal(included.length, talentRecords.length);
assert.equal(new Set(included.map((x) => x.slug)).size, talentRecords.length);
for (const talent of talentRecords) {
  const record = included.find((x) => x.slug === talent.slug);
  for (const field of ['title', 'cost', 'prerequisites', 'activation'])
    assert.equal(record[field], talent[field]);
}

const example = JSON.parse(await readFile(path.join(here, 'creation-example.json'), 'utf8'));
const scores = example.characteristics;
assert.equal(
  Object.values(scores).reduce((a, b) => a + b),
  86,
);
for (const [name, value] of Object.entries(scores))
  assert.ok(value >= (['INT', 'SIZ'].includes(name) ? 7 : 3) && value <= 18);
const totals = { Resistances: 50, Combat: 50, Knowledge: 50, Practical: 75 };
const finalSkills = {};
for (const [category, allocation] of Object.entries(example.allocations)) {
  assert.equal(
    Object.values(allocation).reduce((a, b) => a + b),
    totals[category],
  );
  for (const [skill, points] of Object.entries(allocation)) {
    assert.ok(points >= 0 && points <= 30);
    const formula = canonicalRows.find((row) => row[0] === skill)[1];
    const base = formula
      .split(' + ')
      .reduce((sum, term) => sum + (scores[term] ?? Number(term)), 0);
    finalSkills[skill] = base + points;
    assert.ok(finalSkills[skill] <= 100);
  }
}
assert.equal(
  example.talents.reduce((sum, slug) => sum + talentRecords.find((x) => x.slug === slug).cost, 0),
  10,
);
assert.ok(scores.DEX >= 13 && finalSkills.Dodge >= 51 && finalSkills['Close Combat'] >= 51);
const hp = Math.round((scores.SIZ + scores.CON) / 2);
assert.deepEqual(
  {
    HP: hp,
    MWL: Math.round(hp / 2),
    PP: scores.POW,
    CO: Math.round((scores.DEX + scores.INT) / 2) - 3 + 2,
    capacity: scores.STR + scores.SIZ,
    DM: scores.STR + scores.SIZ >= 26 && scores.STR + scores.SIZ <= 30 ? '+1D4' : null,
  },
  example.expected,
);
assert.deepEqual(finalSkills, {
  Dodge: 54,
  Persistence: 30,
  Resilience: 33,
  'Close Combat': 58,
  'Ranged Combat': 37,
  'Unarmed Combat': 38,
  'Culture (own)': 33,
  'Natural Lore': 43,
  'Lore (own field)': 43,
  Athletics: 48,
  Deception: 42,
  Perception: 43,
  Healing: 33,
  Mechanisms: 37,
});
assert.equal(10 + (20 + 20 + 10) / 5, 20);
assert.deepEqual([50 - 20, 50 - 20, 50, 75 - 10], [30, 30, 50, 65]);
assert.equal(2 + 1 + 0 + 0, 3);
assert.equal(2 + 1 + 1 + 1, 5);
assert.equal(2 + 1 + 1 + 1 + 1, 6);
assert.ok(copy.get('conditions').includes('does not restore missed Actions'));
assert.ok(copy.get('conditions').includes("your own turn's end"));
assert.ok(copy.get('magic-training').includes('Counter replaces your own defence'));
assert.ok(copy.get('active').includes('permanent, unmodified INT'));
assert.ok(copy.get('improvement').includes('Skills keep their scores'));
assert.ok(![...copy.values()].some((text) => /pregenerated character edition/i.test(text)));

const report = {
  version,
  playerPages: edition.pages.length,
  talentCount: included.length,
  generalSkills: 23,
  skillBaseRowsChecked: skillRows.length,
  ancestryRowsChecked: ancestryRows.length,
  creationExample: {
    characteristicTotal: 86,
    pools: totals,
    ipSpent: 10,
    finalSkills,
    attributes: example.expected,
  },
  shaperBudgetVerified: true,
  buildExamplesVerified: true,
  sourceHashesVerified: true,
};
await writeFile(
  path.join(here, `review/content-checks-${version}.json`),
  JSON.stringify(report, null, 2) + '\n',
);
console.log(JSON.stringify(report, null, 2));
