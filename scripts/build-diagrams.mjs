// Generates the rules diagrams in src/assets/diagrams/ from scripts/diagrams/.
// `--check` regenerates in memory and fails if any committed SVG is missing, stale, or orphaned.
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import adventuring from './diagrams/adventuring.mjs';
import combat from './diagrams/combat.mjs';
import shaping from './diagrams/shaping.mjs';
import skills from './diagrams/skills.mjs';

const outputDirectory = path.resolve('src/assets/diagrams');
const diagrams = { ...combat, ...shaping, ...skills, ...adventuring };
const check = process.argv.includes('--check');

const problems = [];
mkdirSync(outputDirectory, { recursive: true });

for (const [name, draw] of Object.entries(diagrams)) {
  const svg = draw();
  const file = path.join(outputDirectory, `${name}.svg`);
  if (check) {
    if (!existsSync(file)) problems.push(`${name}.svg is missing`);
    else if (readFileSync(file, 'utf8') !== svg) problems.push(`${name}.svg is out of date`);
  } else {
    writeFileSync(file, svg);
  }
}

for (const file of readdirSync(outputDirectory)) {
  if (file.endsWith('.svg') && !(file.slice(0, -4) in diagrams)) {
    problems.push(`${file} has no generator in scripts/diagrams/`);
  }
}

if (problems.length) {
  console.error(`Diagram check failed:\n- ${problems.join('\n- ')}\nRun npm run diagrams:build.`);
  process.exit(1);
}
console.log(`${check ? 'Checked' : 'Built'} ${Object.keys(diagrams).length} diagrams.`);
