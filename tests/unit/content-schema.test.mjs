import { describe, expect, it } from 'vitest';
import { permalinkFor, validateRecord } from '../../src/lib/content-schema.mjs';

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
      quickReference: { group: 'combat', order: 20 },
    });

    expect(permalinkFor(rule)).toBe('/rules/combat/#active-guard');
  });

  it('accepts Magic rules in the quick-reference collection', () => {
    const rule = validateRecord({
      type: 'rule',
      id: 'magic.building-a-shaping',
      chapter: 'magic',
      title: 'Building a Shaping',
      slug: 'building-a-shaping',
      order: 20,
      summary: 'Combine Intensity, Range, Duration, Reach, and adjustments into Magnitude.',
      aliases: ['Magnitude', 'magic formula'],
      quickReference: { group: 'magic', order: 10 },
    });

    expect(permalinkFor(rule)).toBe('/rules/magic/#building-a-shaping');
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
});
