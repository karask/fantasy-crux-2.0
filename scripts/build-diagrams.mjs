// Generates the rules diagrams: website diagrams into src/assets/diagrams/, and the handbook's
// print variants into player-handbook/a5/complete/diagrams/. `--check` regenerates in memory and
// fails if any committed SVG is missing, stale, or orphaned.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import adventuring from './diagrams/adventuring.mjs';
import combat from './diagrams/combat.mjs';
import handbook from './diagrams/handbook.mjs';
import shaping from './diagrams/shaping.mjs';
import skills from './diagrams/skills.mjs';

const targets = [
  {
    directory: 'src/assets/diagrams',
    diagrams: { ...combat, ...shaping, ...skills, ...adventuring },
  },
  { directory: 'player-handbook/a5/complete/diagrams', diagrams: handbook },
];
const check = process.argv.includes('--check');
const problems = [];
let count = 0;

for (const { directory, diagrams } of targets) {
  const outputDirectory = path.resolve(directory);
  mkdirSync(outputDirectory, { recursive: true });
  for (const [name, draw] of Object.entries(diagrams)) {
    const svg = draw();
    const file = path.join(outputDirectory, `${name}.svg`);
    count += 1;
    if (check) {
      if (!existsSync(file)) problems.push(`${directory}/${name}.svg is missing`);
      else if (readFileSync(file, 'utf8') !== svg)
        problems.push(`${directory}/${name}.svg is out of date`);
    } else {
      writeFileSync(file, svg);
    }
  }
  for (const file of readdirSync(outputDirectory)) {
    if (file.endsWith('.svg') && !(file.slice(0, -4) in diagrams)) {
      problems.push(`${directory}/${file} has no generator in scripts/diagrams/`);
    }
  }
}

if (problems.length) {
  console.error(`Diagram check failed:\n- ${problems.join('\n- ')}\nRun npm run diagrams:build.`);
  process.exit(1);
}
console.log(`${check ? 'Checked' : 'Built'} ${count} diagrams.`);
