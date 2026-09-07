import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(directory);
const filenames = (await readdir(path.join(directory, 'pages')))
  .filter((name) => name.endsWith('.md'))
  .sort();
assert.equal(filenames.length, 23, 'The agreed handbook has 23 rules pages.');

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
          .map((cell) => cell.replaceAll('`', '').trim().replace(/\s+/g, ' ')),
      ),
  );
}

const pages = [];
const forbiddenSources = /\/rules\/(?:talents|magic|creatures|gm-tools|gazetteer)\//;
const forbiddenCopy = /\b(?:Shaping|Power Points|Improvement Points|Talents?)\b/i;
for (const [index, filename] of filenames.entries()) {
  const { data, content } = matter(await readFile(path.join(directory, 'pages', filename), 'utf8'));
  assert.equal(data.page, index + 1, `${filename}: non-contiguous page number.`);
  assert.ok(filename.startsWith(String(data.page).padStart(2, '0') + '-'));
  for (const field of ['title', 'section', 'objective', 'layout']) {
    assert.ok(typeof data[field] === 'string' && data[field], `${filename}: missing ${field}.`);
  }
  const split = content.split(/^## Editorial notes\s*$/m);
  assert.equal(split.length, 2, `${filename}: needs one editorial boundary.`);
  const [copy, notes] = split.map((part) => part.trim());
  assert.ok(copy.startsWith(`# ${data.title}\n`), `${filename}: title mismatch.`);
  assert.ok(notes.includes('**Visual:**') && notes.includes('**Exact labels:**'));
  assert.ok(notes.includes('**Must retain:**'), `${filename}: missing essential exceptions.`);
  assert.ok(!forbiddenCopy.test(copy), `${filename}: excluded mechanics in player text.`);
  assert.ok(Array.isArray(data.sources) && data.sources.length > 0);
  for (const source of data.sources) {
    assert.ok(source.startsWith('src/content/rules/') && !source.includes('..'));
    assert.ok(!forbiddenSources.test(source), `${filename}: excluded source ${source}.`);
    if (source.includes('/characters/')) {
      assert.ok([1, 11].includes(data.page) && source.endsWith('/character-creation.md'));
    }
    await readFile(path.join(root, source), 'utf8');
  }
  const pageTables = tables(copy);
  assert.equal(pageTables.length, data.page >= 21 ? 1 : 0, `${filename}: table policy.`);
  for (const match of copy.matchAll(/pages?\s+(\d{2})(?:[–-](\d{2}))?/g)) {
    for (const number of match.slice(1).filter(Boolean)) {
      assert.ok(Number(number) >= 1 && Number(number) <= 23, `${filename}: invalid page link.`);
    }
  }
  pages.push({ ...data, filename, copy, tables: pageTables });
}

// Protect the values players will actually use; the source may be edited later.
const weaponTables = tables(
  await readFile(path.join(root, 'src/content/rules/equipment/weapons.md'), 'utf8'),
);
const armourTables = tables(
  await readFile(path.join(root, 'src/content/rules/equipment/armour.md'), 'utf8'),
);
assert.deepEqual(
  pages[20].tables[0],
  weaponTables[1],
  'Close weapons differ from the canonical table.',
);
assert.deepEqual(
  pages[21].tables[0],
  weaponTables[2],
  'Ranged weapons differ from the canonical table.',
);
assert.deepEqual(pages[22].tables[0], armourTables[0], 'Armour differs from the canonical table.');

const skillNames = [
  'Dodge',
  'Persistence',
  'Resilience',
  'Close Combat',
  'Ranged Combat',
  'Unarmed Combat',
  'Culture',
  'Language',
  'Lore',
  'Natural Lore',
  'Athletics',
  'Craft',
  'Deception',
  'Driving',
  'Engineering',
  'Healing',
  'Influence',
  'Mechanisms',
  'Perception',
  'Performance',
  'Riding',
  'Sailing',
  'Streetwise',
  'Trade',
];
const listedSkills = [...pages[4].copy.matchAll(/^- \*\*([^*]+):\*\*/gm)].map((match) => match[1]);
assert.deepEqual(
  listedSkills,
  skillNames,
  'The skill reference must contain all 24 mundane skills.',
);

// Initial grapple defence costs a Reaction; opposing an established hold does not.
const grappleCopies = [
  pages[12].copy.split('## While held together')[0],
  (await readFile(path.join(directory, 'a5/complete/content/11-grapple.md'), 'utf8')).split(
    '## While held together',
  )[0],
  (await readFile(path.join(directory, 'reference-cards/content/02-combat-choices.md'), 'utf8'))
    .split('## Grapple')[1]
    .split('**Escape:**')[0],
  (await readFile(path.join(root, 'pregenerated-characters/02-play-reference.md'), 'utf8'))
    .split("## Grappling and Orren's capture options")[1]
    .split('The held participant spends')[0],
];
for (const [index, copy] of grappleCopies.entries()) {
  const text = copy.replaceAll('**', '').replace(/\s+/g, ' ');
  assert.match(text, /spend one eligible Reaction/i, `Grapple copy ${index}: defence cost.`);
  assert.match(text, /Dodge or Parry/i, `Grapple copy ${index}: defence choices.`);
  assert.match(text, /unopposed/i, `Grapple copy ${index}: undefended attempt.`);
  assert.doesNotMatch(text, /spends? no Reaction|costs (?:the target )?no Reaction/i);
  assert.doesNotMatch(text, /Dodge limit does not apply|not the once-per-round reactive Dodge/i);
}

console.log(
  'Validated 23 ordered drafts, source paths, page references, and player/editorial separation.',
);
console.log(
  'Equipment matches the canonical 24 close-weapon, 12 ranged-weapon, and 5 armour rows.',
);
console.log('All 24 mundane skills are present; tables appear only on equipment pages.');
console.log(
  'All current player grapple copies charge a defence Reaction and cover unopposed attempts.',
);
console.log('Player-copy word counts (editorial guidance only; no enforced ceiling):');
for (const page of pages) {
  console.log(
    `${String(page.page).padStart(2, '0')}  ${String(page.copy.split(/\s+/).length).padStart(3)}  ${page.title}`,
  );
}
