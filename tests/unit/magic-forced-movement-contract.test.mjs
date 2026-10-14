import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (location) => readFileSync(path.resolve(location), 'utf8');

describe('Shaping forced movement', () => {
  const effects = read('src/content/rules/magic/effects.md');

  it('limits actively controlled unwilling movement to 3 metres per round', () => {
    expect(effects).toMatch(
      /unwilling subject under active control moves at most 3 metres per round, in any direction/i,
    );
  });
});
