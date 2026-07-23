import { existsSync, readFileSync, readdirSync } from 'node:fs';
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

describe('canonical Fantasy Crux 2.0 content', () => {
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

  it('publishes Shaping as the canonical Magic chapter and preserves Magic 2.0', () => {
    const magicChapter = records.find((record) => record.data.id === 'magic');
    const magicRules = records
      .filter((record) => record.data.type === 'rule' && record.data.chapter === 'magic')
      .sort((left, right) => left.data.order - right.data.order);
    const characterCreation = records.find(
      (record) => record.data.id === 'characters.character-creation',
    );
    const alternateMagic = readFileSync(
      path.resolve('freeform-magic/FC-magic-potential-2.md'),
      'utf8',
    );

    expect(magicChapter.content).toContain('Shaping');
    expect(magicChapter.content).not.toContain('Magic rules are in development.');
    expect(magicRules.map((record) => [record.data.id, record.data.slug])).toEqual([
      ['magic.becoming-a-shaper', 'becoming-a-shaper'],
      ['magic.building-a-shaping', 'building-a-shaping'],
      ['magic.techniques-and-forms', 'techniques-and-forms'],
      ['magic.effects', 'effects'],
      ['magic.casting-and-defence', 'casting-and-defence'],
      ['magic.ongoing-and-magical-actions', 'ongoing-and-magical-actions'],
      ['magic.rituals-and-examples', 'rituals-and-examples'],
    ]);
    expect(characterCreation.content).toContain('/rules/magic/#becoming-a-shaper');
    expect(alternateMagic).toContain('Traditions and Authorities');
    expect(existsSync(path.resolve('freeform-magic/FC-magic-shaping-potential-1.md'))).toBe(false);
  });

  // Reference chapters carry their own budget so they never compete with rules prose for the
  // same allowance. The core ceiling moved from 16,000 to 16,250 when Intimidate was restored:
  // the original figure was measured against a conversion that had dropped a Combat Action.
  it('stays within the compact visible-copy budget', () => {
    const chapterBudgets = { creatures: 4_500, 'gm-tools': 4_000 };
    const chapterOf = (record) => record.data.chapter ?? record.data.id;
    const countWords = (subset) =>
      subset
        .map((record) => record.content)
        .join('\n')
        .match(/[\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*/gu).length;

    for (const [chapter, budget] of Object.entries(chapterBudgets)) {
      const subset = records.filter((record) => chapterOf(record) === chapter);
      expect(subset.length, chapter).toBeGreaterThan(0);
      expect(countWords(subset), chapter).toBeLessThanOrEqual(budget);
    }

    const core = records.filter((record) => !(chapterOf(record) in chapterBudgets));
    expect(countWords(core)).toBeLessThanOrEqual(16_250);
  });

  it('contains no generic image or raw-HTML markup', () => {
    for (const record of records) {
      expect(record.content, record.file).not.toMatch(/!\[[^\]]*\]\(|<\/?[a-z][^>]*>/i);
    }
  });
});
