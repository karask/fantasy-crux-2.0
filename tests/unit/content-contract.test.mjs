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
  it('ships exactly the approved 47-Talent catalogue', () => {
    const titles = records
      .filter((record) => record.data.type === 'talent')
      .map((record) => record.data.title)
      .sort();

    expect(titles).toEqual(
      [
        'Ambusher',
        'Battle Awareness',
        'Committed Strike',
        'Counter',
        'Cutpurse',
        'Deadeye',
        'Defensive Stance',
        'Disarm',
        'Enchanter',
        'Field Surgeon',
        'Flurry',
        'Indirect',
        'Killing Angle',
        'Lockbreaker',
        'Master Assassin',
        'Master Craftsman',
        'Mastery',
        "Merchant's Eye",
        'Mighty Shot (Bow or Sling)',
        'Missile Guard',
        'Off-Hand Mastery',
        'Physician',
        'Piercing',
        'Point-Blank Shot',
        'Poisoner',
        'Practised Hands',
        'Protector',
        'Quick Reflexes',
        'Rally',
        'Rapid Shot',
        'Selective',
        'Shaping',
        'Shield Cover',
        'Shield Rush',
        'Silent Step',
        'Silver Tongue',
        'Steady Aim',
        'Steady Casting',
        'Subdue',
        'Sure Hand',
        'Tracker',
        'Trigger',
        'Trip',
        'Veiled',
        'Wayfinder',
        'Weak Point',
        'Wrestler',
      ].sort(),
    );
  });

  it('publishes Shaping as the canonical Magic chapter and preserves Magic 2.0', () => {
    const magicChapter = records.find((record) => record.data.id === 'magic');
    const magicRules = records
      .filter((record) => record.data.type === 'rule' && record.data.chapter === 'magic')
      .sort((left, right) => left.data.order - right.data.order);
    const shapingTalent = records.find((record) => record.data.id === 'talent.shaping');
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
    expect(shapingTalent.data.cost).toBe(20);
    expect(shapingTalent.content).toContain('/rules/magic/#becoming-a-shaper');
    expect(alternateMagic).toContain('Traditions and Authorities');
    expect(existsSync(path.resolve('freeform-magic/FC-magic-shaping-potential-1.md'))).toBe(false);
  });

  // Reference chapters carry their own budget so they never compete with rules prose for the
  // same allowance.
  //
  // The core ceiling was raised repeatedly as the Talent catalogue grew from 17 combat entries to
  // 47 covering every role, each rise tracking the last commit rather than any intended length.
  // It is set here once, deliberately, at 17,400: the catalogue is complete, so this is the size
  // the core rules are meant to be. Treat a failure as a signal to cut prose, not to raise the
  // number again.
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
    expect(countWords(core)).toBeLessThanOrEqual(17_400);
  });

  it('contains no generic image or raw-HTML markup', () => {
    for (const record of records) {
      expect(record.content, record.file).not.toMatch(/!\[[^\]]*\]\(|<\/?[a-z][^>]*>/i);
    }
  });
});
