import { describe, expect, it } from 'vitest';
import { permalinkFor, urlsFor, validateRecord } from '../../src/lib/content-schema.mjs';

describe('content schema', () => {
  it('accepts a portable rule record and computes its stable URL', () => {
    const rule = validateRecord({
      type: 'rule',
      id: 'combat.active-guard',
      chapter: 'combat',
      title: 'Active Guard',
      slug: 'active-guard',
      order: 40,
      summary: ['A ready shield can parry missiles.'],
      aliases: ['missile parry'],
    });

    expect(permalinkFor(rule)).toBe('/rules/combat/#active-guard');
  });

  it('accepts Magic rules with computed anchors', () => {
    const rule = validateRecord({
      type: 'rule',
      id: 'magic.building-a-shaping',
      chapter: 'magic',
      title: 'Building a Shaping',
      slug: 'building-a-shaping',
      order: 20,
      summary: 'Combine Intensity, Range, Duration, Reach, and adjustments into Magnitude.',
      aliases: ['Magnitude', 'magic formula'],
    });

    expect(permalinkFor(rule)).toBe('/rules/magic/#building-a-shaping');
  });

  it('keeps canonical URLs while reserving legacy fragments', () => {
    const talent = validateRecord({
      type: 'talent',
      id: 'talent.mastery',
      chapter: 'talents',
      title: 'Weapon Expertise',
      slug: 'weapon-expertise',
      legacySlugs: ['mastery', 'mastery--effect'],
      order: 260,
      summary: 'Master one named weapon.',
      cost: 4,
      prerequisites: 'Close Combat 76% or Ranged Combat 76%',
      activation: 'passive',
      tags: ['training'],
    });

    expect(permalinkFor(talent)).toBe('/rules/talents/#weapon-expertise');
    expect(urlsFor(talent)).toEqual([
      '/rules/talents/#weapon-expertise',
      '/rules/talents/#mastery',
      '/rules/talents/#mastery--effect',
    ]);
  });

  it('lets a chapter reserve fragments retired from its catalogue', () => {
    const chapter = validateRecord({
      type: 'chapter',
      id: 'talents',
      title: 'Talents',
      order: 5,
      summary: 'Optional abilities.',
      legacySlugs: ['sure-hand', 'sure-hand--effect'],
    });

    expect(urlsFor(chapter)).toEqual([
      '/rules/talents/',
      '/rules/talents/#sure-hand',
      '/rules/talents/#sure-hand--effect',
    ]);
  });

  it('rejects duplicate and canonical legacy fragments', () => {
    const baseTalent = {
      type: 'talent',
      id: 'talent.mastery',
      chapter: 'talents',
      title: 'Weapon Expertise',
      slug: 'weapon-expertise',
      order: 260,
      summary: 'Master one named weapon.',
      cost: 4,
      prerequisites: 'Close Combat 76% or Ranged Combat 76%',
      activation: 'passive',
      tags: ['training'],
    };

    expect(() => validateRecord({ ...baseTalent, legacySlugs: ['mastery', 'mastery'] })).toThrow();
    expect(() => validateRecord({ ...baseTalent, legacySlugs: ['weapon-expertise'] })).toThrow();
    expect(() =>
      validateRecord({ ...baseTalent, legacySlugs: ['weapon-expertise--effect'] }),
    ).toThrow();
  });

  it('rejects unknown metadata and malformed immutable IDs', () => {
    expect(() =>
      validateRecord({
        type: 'chapter',
        id: 'Combat Rules',
        title: 'Combat',
        order: 4,
        summary: 'Fight.',
        accidentalKey: true,
      }),
    ).toThrow();
  });

  it('requires Talent-specific purchase metadata', () => {
    expect(() =>
      validateRecord({
        type: 'talent',
        id: 'talent.off-hand-mastery',
        chapter: 'talents',
        title: 'Off-Hand Mastery',
        slug: 'off-hand-mastery',
        order: 50,
        summary: 'Remove the off-hand penalty.',
      }),
    ).toThrow();
  });

  describe('creature characteristic dice', () => {
    const baseCreature = {
      type: 'creature',
      id: 'creatures.test-wolf',
      chapter: 'creatures',
      title: 'Test Wolf',
      slug: 'test-wolf',
      order: 10,
      category: 'animal',
      summary: 'A test fixture.',
      tags: ['living', 'corporeal'],
      plunder: 0,
      characteristics: { str: 11, con: 14, dex: 13, siz: 10, int: 5, pow: 11, cha: 5 },
      derived: { hp: 12, mwl: 6, pp: 11, movement: '23 m', combatOrder: 9, ap: 0, dm: '+0' },
      skills: ['Dodge 39%'],
      attacks: ['Bite — Unarmed Combat 50%, `1D8 + DM`, Medium'],
      talents: 'None',
    };

    it('accepts single and dual dice formulas', () => {
      const record = validateRecord({
        ...baseCreature,
        characteristicDice: { str: '3D6', con: '3D6+3', int: '2D6+6/1D6+3' },
      });
      expect(record.characteristicDice).toEqual({ str: '3D6', con: '3D6+3', int: '2D6+6/1D6+3' });
    });

    it('rejects a malformed dice formula', () => {
      expect(() =>
        validateRecord({ ...baseCreature, characteristicDice: { str: '3d' } }),
      ).toThrow();
      expect(() =>
        validateRecord({ ...baseCreature, characteristicDice: { str: '11' } }),
      ).toThrow();
    });

    it('rejects an empty characteristicDice object', () => {
      expect(() => validateRecord({ ...baseCreature, characteristicDice: {} })).toThrow();
    });

    it('omits characteristicDice cleanly for fixed-stat creatures', () => {
      const record = validateRecord(baseCreature);
      expect(record.characteristicDice).toBeUndefined();
    });

    it('accepts a complete responsive image set', () => {
      const record = validateRecord({
        ...baseCreature,
        image: '/assets/images/creatures/test-wolf.webp',
        image320: '/assets/images/creatures/test-wolf-320.webp',
        imageAlt: 'A grey wolf standing beneath pine trees.',
      });

      expect(record.image320).toBe('/assets/images/creatures/test-wolf-320.webp');
      expect(record.imageAlt).toBe('A grey wolf standing beneath pine trees.');
    });

    it('rejects incomplete responsive image metadata', () => {
      expect(() =>
        validateRecord({
          ...baseCreature,
          image: '/assets/images/creatures/test-wolf.webp',
        }),
      ).toThrow();
      expect(() =>
        validateRecord({
          ...baseCreature,
          image320: '/assets/images/creatures/test-wolf-320.webp',
          imageAlt: 'A grey wolf standing beneath pine trees.',
        }),
      ).toThrow();
    });
  });
});
