import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const siteRoot = path.resolve('_site');

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const location = path.join(directory, entry.name);
      return entry.isDirectory() ? filesUnder(location) : [location];
    }),
  );
  return nested.flat();
}

function localTarget(sourceFile, rawUrl) {
  const url = rawUrl.replaceAll('&amp;', '&');
  if (/^(?:https?:|mailto:|tel:|data:)/i.test(url)) return null;
  if (/^javascript:/i.test(url)) throw new Error(`unsafe JavaScript URL: ${url}`);

  const [pathname = '', rawFragment] = url.split('#', 2);
  const cleanPath = decodeURIComponent(pathname.split('?', 1)[0]);
  let target = cleanPath.startsWith('/')
    ? path.join(siteRoot, cleanPath.slice(1))
    : path.resolve(path.dirname(sourceFile), cleanPath || '.');

  if (cleanPath.endsWith('/') || cleanPath === '') target = path.join(target, 'index.html');
  if (!path.extname(target)) target = path.join(target, 'index.html');

  const relative = path.relative(siteRoot, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`link escapes the built site: ${url}`);
  }

  return { target, fragment: rawFragment ? decodeURIComponent(rawFragment) : null };
}

function escapePattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const files = await filesUnder(siteRoot);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const failures = [];
let checked = 0;

for (const sourceFile of htmlFiles) {
  const html = await readFile(sourceFile, 'utf8');
  const urls = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);

  for (const url of urls) {
    try {
      const resolved = localTarget(sourceFile, url);
      if (!resolved) continue;
      checked += 1;
      await access(resolved.target);

      if (resolved.fragment) {
        const targetHtml = await readFile(resolved.target, 'utf8');
        const id = escapePattern(resolved.fragment);
        if (!new RegExp(`\\bid="${id}"`).test(targetHtml)) {
          throw new Error(`missing fragment #${resolved.fragment}`);
        }
      }
    } catch (error) {
      failures.push(`${path.relative(siteRoot, sourceFile)} → ${url} — ${error.message}`);
    }
  }
}

if (failures.length) {
  console.error(`Link validation failed (${failures.length}):\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${checked} local links and assets across ${htmlFiles.length} pages.`);
}
