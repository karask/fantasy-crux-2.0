import { describe, expect, it } from 'vitest';
import {
  chooseModifiedResult,
  criticalCeiling,
  improvementFor,
  opposedWinner,
  powerPointsRecovered,
  resultGrade,
} from '../../src/lib/rules-contract.mjs';

describe('locked Fantasy Crux 2.0 rules', () => {
  it.each([
    [0, 0],
    [1, 1],
    [9, 1],
    [10, 1],
    [59, 5],
    [60, 6],
    [99, 9],
    [100, 10],
  ])(
    'uses the integer tens digit, minimum 01 above 0%%, for criticals at %i%%',
    (skill, ceiling) => {
      expect(criticalCeiling(skill)).toBe(ceiling);
    },
  );

  it.each([
    [5, 1, 'critical'],
    [5, 2, 'success'],
    [59, 5, 'critical'],
    [59, 6, 'success'],
    [59, 59, 'success'],
    [59, 60, 'failure'],
    [59, 99, 'fumble'],
    [100, 10, 'critical'],
    [100, 99, 'success'],
    [100, 100, 'fumble'],
  ])('grades a result at %i%% skill', (skill, roll, grade) => {
    expect(resultGrade(skill, roll)).toBe(grade);
  });

  it('keeps the better grade for Bonus dice and the worse grade for Penalty dice', () => {
    expect(chooseModifiedResult({ skill: 60, candidates: [25, 65], modifier: 'bonus' })).toBe(25);
    expect(chooseModifiedResult({ skill: 60, candidates: [25, 65], modifier: 'penalty' })).toBe(65);
    expect(chooseModifiedResult({ skill: 51, candidates: [4, 44], modifier: 'bonus' })).toBe(4);
    expect(chooseModifiedResult({ skill: 51, candidates: [79, 99], modifier: 'penalty' })).toBe(99);
  });

  it('uses opposed-result quality when candidate grades match', () => {
    expect(chooseModifiedResult({ skill: 70, candidates: [25, 65], modifier: 'bonus' })).toBe(65);
    expect(chooseModifiedResult({ skill: 70, candidates: [25, 65], modifier: 'penalty' })).toBe(25);
    expect(chooseModifiedResult({ skill: 60, candidates: [72, 82], modifier: 'bonus' })).toBe(72);
    expect(chooseModifiedResult({ skill: 60, candidates: [72, 82], modifier: 'penalty' })).toBe(82);
  });

  it('treats 00 as 100 and chooses once across every candidate', () => {
    expect(chooseModifiedResult({ skill: 100, candidates: [40, 90, 100], modifier: 'bonus' })).toBe(
      90,
    );
    expect(
      chooseModifiedResult({ skill: 100, candidates: [40, 90, 100], modifier: 'penalty' }),
    ).toBe(100);
    expect(chooseModifiedResult({ skill: 70, candidates: [42, 42], modifier: 'bonus' })).toBe(42);
  });

  it.each([
    [0, 5],
    [50, 5],
    [51, 3],
    [75, 3],
    [76, 3],
    [99, 3],
    [100, 0],
  ])('uses tiered one-IP improvement at %i%%', (skill, gain) => {
    expect(improvementFor(skill)).toBe(gain);
  });

  it('uses base skill and then the status quo to break exact opposed ties', () => {
    expect(
      opposedWinner(
        { grade: 'success', roll: 42, skill: 60, role: 'actor' },
        { grade: 'success', roll: 42, skill: 70, role: 'defender' },
      ),
    ).toBe('defender');

    expect(
      opposedWinner(
        { grade: 'success', roll: 42, skill: 70, role: 'actor' },
        { grade: 'success', roll: 42, skill: 70, role: 'defender' },
      ),
    ).toBe('defender');
  });

  it('uses the same within-grade quality order for opposed results', () => {
    expect(
      opposedWinner(
        { grade: 'success', roll: 52, skill: 60, role: 'actor' },
        { grade: 'success', roll: 42, skill: 60, role: 'defender' },
      ),
    ).toBe('actor');

    expect(
      opposedWinner(
        { grade: 'failure', roll: 62, skill: 60, role: 'actor' },
        { grade: 'failure', roll: 82, skill: 60, role: 'defender' },
      ),
    ).toBe('actor');
  });

  it('recovers one-quarter PP per two hours and all PP after eight hours', () => {
    expect(powerPointsRecovered({ pow: 3, hours: 2 })).toBe(1);
    expect(powerPointsRecovered({ pow: 3, hours: 6 })).toBe(3);
    expect(powerPointsRecovered({ pow: 9, hours: 2 })).toBe(2);
    expect(powerPointsRecovered({ pow: 9, hours: 6 })).toBe(6);
    expect(powerPointsRecovered({ pow: 9, hours: 8 })).toBe(9);
  });
});
