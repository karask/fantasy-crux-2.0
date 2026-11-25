import path from 'node:path';
// Render ../diagrams/*.svg to print PNGs (5x, transparent) with the installed booklet fonts.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
// Works with the repository's playwright or a global install.
const req = createRequire(import.meta.url);
let pw;
try { pw = req('playwright'); } catch { pw = req(path.join(execSync('npm root -g').toString().trim(), 'playwright')); }
const { chromium } = pw;
import { readdirSync, readFileSync } from 'node:fs';
const dir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'diagrams');
const scale = Number(process.argv[2] ?? 5);
const b = await chromium.launch();
const p = await b.newPage({ deviceScaleFactor: scale });
for (const f of readdirSync(dir).filter((f) => f.endsWith('.svg'))) {
  const svg = readFileSync(path.join(dir, f), 'utf8');
  await p.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
  await p.evaluate(() => document.fonts.ready);
  await p.locator('svg').screenshot({ path: path.join(dir, f.replace('.svg', '.png')), omitBackground: true });
}
await b.close();
