import { describe, expect, it } from 'vitest';
import {
  criticalCeiling,
  improvementFor,
  opposedWinner,
  powerPointsRecovered,
} from '../../src/lib/rules-contract.mjs';

describe('locked Fantasy Crux Lite rules', () => {
  it.each([
    [9, 0],
    [10, 1],
    [59, 5],
    [60, 6],
    [99, 9],
    [100, 10],
  ])('uses only the integer tens digit for criticals at %i%%', (skill, ceiling) => {
    expect(criticalCeiling(skill)).toBe(ceiling);
  });

  it.each([
    [0, 5],
    [50, 5],
    [51, 3],
    [75, 3],
    [76, 1],
    [99, 1],
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

  it('recovers one-quarter PP per two hours and all PP after eight hours', () => {
    expect(powerPointsRecovered({ pow: 9, hours: 2 })).toBe(3);
    expect(powerPointsRecovered({ pow: 9, hours: 6 })).toBe(9);
    expect(powerPointsRecovered({ pow: 9, hours: 8 })).toBe(9);
  });
});
