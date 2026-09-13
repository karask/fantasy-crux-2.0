import { describe, expect, it } from 'vitest';
import { resultGrade, weaponDefenceOutcome } from '../../src/lib/rules-contract.mjs';
const result = (roll, skill = 76) => ({ roll, skill, grade: resultGrade(skill, roll) });

describe('opposed weapon defence with critical demotion', () => {
  it.each(['dodge', 'parry', 'guard'])('a losing ordinary %s cannot block damage', (kind) => {
    expect(weaponDefenceOutcome(result(65), result(20), kind)).toBe('ordinary');
  });
  it('applies Size only to a winning ordinary Parry or guard', () => {
    expect(weaponDefenceOutcome(result(20), result(65), 'dodge')).toBe('blocked');
    expect(weaponDefenceOutcome(result(20), result(65), 'parry')).toBe('parry');
    expect(weaponDefenceOutcome(result(20), result(65), 'guard')).toBe('parry');
  });
  it('uses base skill then defender for ties', () => {
    expect(weaponDefenceOutcome(result(40, 80), result(40, 76))).toBe('ordinary');
    expect(weaponDefenceOutcome(result(40, 76), result(40, 80))).toBe('blocked');
    expect(weaponDefenceOutcome(result(40), result(40))).toBe('blocked');
  });
  it.each(['dodge', 'parry', 'guard'])(
    'ordinary successful %s demotes a critical without blocking',
    (kind) => {
      expect(weaponDefenceOutcome(result(5), result(20), kind)).toBe('ordinary');
    },
  );
  it('compares critical rolls instead of automatically blocking', () => {
    expect(weaponDefenceOutcome(result(7), result(3), 'parry')).toBe('critical');
    expect(weaponDefenceOutcome(result(3), result(7), 'parry')).toBe('blocked');
    expect(weaponDefenceOutcome(result(7), result(7), 'parry')).toBe('blocked');
    expect(weaponDefenceOutcome(result(20), result(3), 'parry')).toBe('blocked');
  });
  it('respects an expanded critical range declared before rolling', () => {
    const precision = { ...result(14), grade: 'critical' };
    expect(weaponDefenceOutcome(precision, result(7))).toBe('critical');
    expect(weaponDefenceOutcome(precision, result(65))).toBe('ordinary');
  });
  it('failed attacks miss and failed or absent defences preserve attack grade', () => {
    expect(weaponDefenceOutcome(result(80), result(90))).toBe('miss');
    expect(weaponDefenceOutcome(result(5), result(80))).toBe('critical');
    expect(weaponDefenceOutcome(result(5))).toBe('critical');
    expect(weaponDefenceOutcome(result(65))).toBe('ordinary');
  });
});
