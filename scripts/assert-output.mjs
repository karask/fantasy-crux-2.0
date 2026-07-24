import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const required = [
  'index.html',
  'rules/start-here/index.html',
  'rules/characters/index.html',
  'rules/skills/index.html',
  'rules/equipment/index.html',
  'rules/combat/index.html',
  'rules/adventuring/index.html',
  'rules/talents/index.html',
  'rules/magic/index.html',
  'rules/gm-tools/index.html',
  'rules/creatures/index.html',
  'reference/index.html',
  'license/index.html',
  'search/index.html',
  'pagefind/pagefind.js',
];

for (const relativePath of required) {
  await access(path.join('_site', relativePath));
}

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const location = path.join(directory, entry.name);
      if (entry.isDirectory()) return htmlFiles(location);
      return entry.isFile() && entry.name.endsWith('.html') ? [location] : [];
    }),
  );
  return nested.flat();
}

for (const htmlFile of await htmlFiles('_site')) {
  const html = await readFile(htmlFile, 'utf8');
  if (html.includes('It is not part of the website yet')) {
    throw new Error(`Draft compendium framing leaked into ${htmlFile}.`);
  }
}

const magic = await readFile('_site/rules/magic/index.html', 'utf8');
if (!magic.includes('Becoming a Shaper') || magic.includes('Magic rules are in development.')) {
  throw new Error('The published Shaping chapter is missing or still marked as unfinished.');
}

// Every chapter publishes as a single page, so its sections must be inlined with anchors.
const chapterSections = {
  'rules/magic/index.html': [
    'becoming-a-shaper',
    'building-a-shaping',
    'techniques-and-forms',
    'effects',
    'casting-and-defence',
    'ongoing-and-magical-actions',
    'rituals-and-examples',
  ],
  'rules/combat/index.html': [
    'active-guard',
    'grappling',
    'off-hand-options',
    'rounds-and-actions--intimidate',
  ],
  'rules/talents/index.html': ['off-hand-mastery', 'shield-cover'],
  'rules/creatures/index.html': [
    'using-creatures',
    'creature-tags',
    'multiattack',
    'dragon',
    'dryad',
    'vampire',
  ],
  'rules/gm-tools/index.html': ['plunder', 'ships-and-sailing', 'mass-combat', 'fantasy-races'],
};

for (const [chapterFile, anchors] of Object.entries(chapterSections)) {
  const html = await readFile(path.join('_site', chapterFile), 'utf8');
  for (const anchor of anchors) {
    if (!html.includes(`id="${anchor}"`)) {
      throw new Error(`${chapterFile} is missing the inlined section #${anchor}.`);
    }
  }
}

for (const strayPage of [
  '_site/rules/magic/building-a-shaping/index.html',
  '_site/rules/combat/active-guard/index.html',
  '_site/rules/talents/deadeye/index.html',
]) {
  try {
    await access(strayPage);
    throw new Error(`${strayPage} was published as a separate page instead of a chapter section.`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

if (!magic.includes('Magnitude')) {
  throw new Error('The core Shaping procedure is missing from the production output.');
}

const creatures = await readFile('_site/rules/creatures/index.html', 'utf8');
const publishedProfiles = [...creatures.matchAll(/class="[^"]*\bcreature-profile\b[^"]*"/g)].length;
if (publishedProfiles !== 57) {
  throw new Error(`Expected 57 published creature profiles, found ${publishedProfiles}.`);
}
for (const marker of ['data-filter="animal"', 'data-filter="undead"', 'creature-portrait']) {
  if (!creatures.includes(marker)) {
    throw new Error(`The bestiary is missing ${marker} in the production output.`);
  }
}

// Section 10 of the Open Game License requires the licence to ship with the content.
const license = await readFile('_site/license/index.html', 'utf8');
for (const clause of [
  'Definitions:',
  '15. Copyright Notice',
  'Open Game License v 1.0a Copyright 2000',
]) {
  if (!license.includes(clause)) {
    throw new Error(`The published Open Game License is missing: ${clause}`);
  }
}
if (license.includes('© “Distribute”')) {
  throw new Error('Typographic substitution corrupted a clause marker in the Open Game License.');
}

console.log(`Verified ${required.length} required production outputs.`);
