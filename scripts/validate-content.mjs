import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { permalinkFor, validateRecord } from '../src/lib/content-schema.mjs';

const contentRoot = path.resolve('src/content/rules');

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const location = path.join(directory, entry.name);
      return entry.isDirectory()
        ? markdownFiles(location)
        : entry.name.endsWith('.md')
          ? [location]
          : [];
    }),
  );
  return nested.flat();
}

const files = await markdownFiles(contentRoot);
const seenIds = new Map();
const seenUrls = new Map();
const failures = [];

for (const file of files) {
  try {
    const source = await readFile(file, 'utf8');
    const parsed = matter(source);
    const record = validateRecord(parsed.data);
    const url = permalinkFor(record);

    if (seenIds.has(record.id)) {
      throw new Error(`duplicate id also used by ${seenIds.get(record.id)}`);
    }
    if (seenUrls.has(url)) {
      throw new Error(`duplicate URL also used by ${seenUrls.get(url)}`);
    }
    seenIds.set(record.id, path.relative(contentRoot, file));
    seenUrls.set(url, path.relative(contentRoot, file));
  } catch (error) {
    const details = error.issues
      ? error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')
      : error.message;
    failures.push(`${path.relative(contentRoot, file)} — ${details}`);
  }
}

if (failures.length) {
  console.error(`Content validation failed (${failures.length}):\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${files.length} Markdown records with unique IDs and URLs.`);
}
