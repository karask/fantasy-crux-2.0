import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (location) => readFileSync(path.resolve(location), 'utf8');

describe('Shaping healing limit', () => {
  const effects = read('src/content/rules/magic/effects.md');

  it('mirrors the mundane once-per-rest treatment limit', () => {
    expect(effects).toMatch(
      /one during each encounter, and one more between that encounter and the subject's next full rest/i,
    );
    expect(effects).toMatch(/only removes Bleeding and Dying[^.]*never limited/i);
    expect(effects).toMatch(/Below Intensity 3[^.]*does not end Wounded/i);
  });
});
