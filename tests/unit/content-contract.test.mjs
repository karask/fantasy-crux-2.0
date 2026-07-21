import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

const contentRoot = path.resolve('src/content/rules');

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(location);
    return entry.name.endsWith('.md') ? [location] : [];
  });
}

const records = markdownFiles(contentRoot).map((file) => {
  const parsed = matter(readFileSync(file, 'utf8'));
  return { file, ...parsed };
});

describe('canonical lite content', () => {
  it('ships exactly the approved 17-Talent catalogue', () => {
    const titles = records
      .filter((record) => record.data.type === 'talent')
      .map((record) => record.data.title)
      .sort();

    expect(titles).toEqual(
      [
        'Battle Awareness',
        'Committed Strike',
        'Deadeye',
        'Defensive Stance',
        'Disarm',
        'Flurry',
        'Mighty Shot (Bow or Sling)',
        'Missile Guard',
        'Off-Hand Mastery',
        'Protector',
        'Quick Reflexes',
        'Rapid Shot',
        'Shield Cover',
        'Shield Rush',
        'Subdue',
        'Trip',
        'Wrestler',
      ].sort(),
    );
  });

  it('keeps the Magic chapter to the single locked placeholder', () => {
    const magic = records.find((record) => record.data.id === 'magic');
    expect(magic.content.trim()).toBe('Magic rules are in development.');
  });

  it('stays within the compact visible-copy budget', () => {
    const words = records
      .map((record) => record.content)
      .join('\n')
      .match(/[\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*/gu);
    expect(words.length).toBeLessThanOrEqual(12_000);
  });

  it('contains no generic image or raw-HTML markup', () => {
    for (const record of records) {
      expect(record.content, record.file).not.toMatch(/!\[[^\]]*\]\(|<\/?[a-z][^>]*>/i);
    }
  });
});
