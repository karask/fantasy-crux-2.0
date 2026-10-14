import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (location) => readFileSync(path.resolve(location), 'utf8');

describe('Created fire', () => {
  const fire = read('src/content/rules/adventuring/suffocation-and-fire.md');

  it('defers recurring fire damage to mundane fuel, as ADR-020 requires', () => {
    expect(fire).toMatch(/Shaped fire deals its damage once, when cast/i);
    expect(fire).toMatch(/created magical hazards[^.]*never deal damage each round/i);
    expect(fire).not.toMatch(/fixed Shaping damage until/i);
  });
});
