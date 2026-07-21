import { rmSync } from 'node:fs';
import path from 'node:path';

const workspace = path.resolve(process.cwd());
const output = path.resolve(workspace, '_site');

if (path.dirname(output) !== workspace || path.basename(output) !== '_site') {
  throw new Error(`Refusing to clean unexpected output directory: ${output}`);
}

rmSync(output, { recursive: true, force: true });
console.log(`Cleaned ${output}`);
