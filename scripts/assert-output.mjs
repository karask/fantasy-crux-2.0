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
  'rules/magic/becoming-a-shaper/index.html',
  'rules/magic/building-a-shaping/index.html',
  'rules/magic/techniques-and-forms/index.html',
  'rules/magic/effects/index.html',
  'rules/magic/casting-and-defence/index.html',
  'rules/magic/ongoing-and-magical-actions/index.html',
  'rules/magic/rituals-and-examples/index.html',
  'reference/index.html',
  'search/index.html',
  'pagefind/pagefind.js',
];

for (const relativePath of required) {
  await access(path.join('_site', relativePath));
}

try {
  await access('_site/rules/creatures/index.html');
  throw new Error('The unpublished creature compendium leaked into the website output.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
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
  if (html.includes('Fantasy Crux Lite Creatures')) {
    throw new Error(`The unpublished creature compendium leaked into ${htmlFile}.`);
  }
}

const magic = await readFile('_site/rules/magic/index.html', 'utf8');
if (!magic.includes('Becoming a Shaper') || magic.includes('Magic rules are in development.')) {
  throw new Error('The published Shaping chapter is missing or still marked as unfinished.');
}

const shaping = await readFile('_site/rules/magic/building-a-shaping/index.html', 'utf8');
if (!shaping.includes('Building a Shaping') || !shaping.includes('Magnitude')) {
  throw new Error('The core Shaping procedure is missing from the production output.');
}

console.log(`Verified ${required.length} required production outputs.`);
