import { access, readFile } from 'node:fs/promises';
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
  'reference/index.html',
  'search/index.html',
  'pagefind/pagefind.js',
];

for (const relativePath of required) {
  await access(path.join('_site', relativePath));
}

const magic = await readFile('_site/rules/magic/index.html', 'utf8');
if (!magic.includes('Magic rules are in development.')) {
  throw new Error('The Magic placeholder is missing its locked message.');
}

console.log(`Verified ${required.length} required production outputs.`);
