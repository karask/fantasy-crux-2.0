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
  it('ships exactly the approved 49-Talent catalogue', () => {
    const titles = records
      .filter((record) => record.data.type === 'talent')
      .map((record) => record.data.title)
      .sort();

    expect(titles).toEqual(
      [
        'Alchemist',
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
        'Iron Fist',
        'Indirect',
        'Killing Angle',
        'Lockbreaker',
        'Master Assassin',
        'Master Craftsman',
        'Mastery',
        "Merchant's Eye",
        'Master Brawler',
        'Mighty Shot',
        'Missile Guard',
        'Off-Hand Mastery',
        'Physician',
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
        'Tactician',
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
    expect(
      magicRules.map((record) => [
        record.data.id,
        record.data.title,
        record.data.slug,
        record.data.order,
      ]),
    ).toEqual([
      ['magic.becoming-a-shaper', 'Becoming a Shaper', 'becoming-a-shaper', 10],
      ['magic.building-a-shaping', 'Building a Shaping', 'building-a-shaping', 20],
      ['magic.techniques-and-forms', 'Forms and Techniques', 'techniques-and-forms', 30],
      ['magic.effects', 'Effects', 'effects', 40],
      ['magic.casting-and-defence', 'Casting and Defence', 'casting-and-defence', 50],
      [
        'magic.ongoing-and-magical-actions',
        'Ongoing Shapings and Magical Actions',
        'ongoing-and-magical-actions',
        60,
      ],
      ['magic.rituals-and-examples', 'Rituals and Examples', 'rituals-and-examples', 70],
    ]);
    expect(shapingTalent.data.cost).toBe(20);
    expect(shapingTalent.content).toContain('/rules/magic/#becoming-a-shaper');
    expect(alternateMagic).toContain('Traditions and Authorities');
    expect(existsSync(path.resolve('freeform-magic/FC-magic-shaping-potential-1.md'))).toBe(false);
  });

  it('contains no generic image or raw-HTML markup', () => {
    for (const record of records) {
      expect(record.content, record.file).not.toMatch(/!\[[^\]]*\]\(|<\/?[a-z][^>]*>/i);
    }
  });
});
