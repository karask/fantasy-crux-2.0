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
  it('ships exactly the approved 51-Talent catalogue', () => {
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
        'Favoured Weapon',
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
        'Signature Weapon',
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

  it('publishes the two-tier exact-weapon damage progression', () => {
    const favouredWeapon = records.find((record) => record.data.id === 'talent.favoured-weapon');
    const signatureWeapon = records.find((record) => record.data.id === 'talent.signature-weapon');

    expect(favouredWeapon.data).toMatchObject({
      title: 'Favoured Weapon',
      slug: 'favoured-weapon',
      order: 55,
      cost: 3,
      activation: 'passive',
      tags: ['close', 'offence', 'ranged'],
    });
    expect(favouredWeapon.data.prerequisites).toContain('51%');
    expect(favouredWeapon.content).toContain('Choose one named weapon');
    expect(favouredWeapon.content).toContain('Unarmed or Improvised rock');
    expect(favouredWeapon.content).toContain('Shields qualify');
    expect(favouredWeapon.content).toContain('adds 1 damage before Parry and armour');
    expect(favouredWeapon.content).toContain('applies to every matching hit');
    expect(favouredWeapon.content).toContain('both Close and Ranged profiles');
    expect(favouredWeapon.content).toContain('A primitive version of the chosen weapon qualifies');
    expect(favouredWeapon.content).toContain('any weapon as an improvised club does not');
    expect(favouredWeapon.content).toContain(
      'including Disarm, Trip, Shield Rush, Subdue, or an unopposed Critical',
    );
    expect(favouredWeapon.content).toContain('A Critical opposed by an ordinary Reaction');
    expect(favouredWeapon.content).toContain('never more than once for the same weapon');
    expect(favouredWeapon.content).toContain(
      'does not apply to unarmed attacks, natural weapons, or Shaping',
    );

    expect(signatureWeapon.data).toMatchObject({
      title: 'Signature Weapon',
      slug: 'signature-weapon',
      order: 57,
      cost: 4,
      activation: 'passive',
      tags: ['close', 'offence', 'ranged'],
    });
    expect(signatureWeapon.data.prerequisites).toContain('76%');
    expect(signatureWeapon.data.prerequisites).toContain('Favoured Weapon');
    expect(signatureWeapon.content).toContain('from 1 to 2 damage');
    expect(signatureWeapon.content).toContain('does not add to it for +3');
    expect(signatureWeapon.content).toContain('All Favoured Weapon limits still apply');
    expect(signatureWeapon.content).toContain('never more than once for the same weapon');

    const offHandMastery = records.find((record) => record.data.id === 'talent.off-hand-mastery');
    const wrestler = records.find((record) => record.data.id === 'talent.wrestler');
    expect([
      offHandMastery.data.order,
      favouredWeapon.data.order,
      signatureWeapon.data.order,
      wrestler.data.order,
    ]).toEqual([50, 55, 57, 60]);
  });

  it('makes Bonus and Penalty dice choose the better or worse outcome', () => {
    const modifiers = records.find((record) => record.data.id === 'skills.bonus-penalty-dice');
    const opposed = records.find((record) => record.data.id === 'skills.opposed-tests');
    const quickStart = records.find((record) => record.data.id === 'start-here.d100-percentile');

    expect(modifiers.content).toContain(
      'With Bonus dice, always keep the result that is better for the roller',
    );
    expect(modifiers.content).toContain(
      'With Penalty dice, always keep the result that is worse for the roller',
    );
    expect(modifiers.content).toContain('Critical > Success > Failure > Fumble');
    expect(modifiers.content).toContain('Within Critical or Success, the higher roll is better');
    expect(modifiers.content).toContain('Within Failure or Fumble, the lower roll is better');
    expect(modifiers.content).not.toMatch(/use the lowest complete|use the highest/i);
    expect(opposed.content).toContain(
      "Resolve each participant's Bonus or Penalty dice before comparing their final results",
    );
    expect(quickStart.content).toContain(
      'Bonus dice always keep the better result; Penalty dice always keep the worse',
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
