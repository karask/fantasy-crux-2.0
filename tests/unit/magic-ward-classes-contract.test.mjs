import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (location) => readFileSync(path.resolve(location), 'utf8');

describe('Ward classes of harm', () => {
  const effects = read('src/content/rules/magic/effects.md');
  const npcs = read('src/content/rules/gm-tools/minor-npcs.md');

  it('defines physical, elemental, and spiritual classes', () => {
    expect(effects).toMatch(/\*\*Physical:\*\* blows, missiles, falls, and crushing/i);
    expect(effects).toMatch(/\*\*Elemental:\*\* fire and heat, cold, lightning, and acid/i);
    expect(effects).toMatch(/\*\*Spiritual:\*\* PP damage/i);
    expect(effects).toMatch(/covers its harm whether mundane or Shaped/i);
    expect(effects).toMatch(/both physical and elemental harm raises the Ward's Intensity by 1/i);
  });

  it('gives Mind, Paths, and Fate non-AP Wards', () => {
    expect(effects).toMatch(/Mind, Paths, and Fate grant no AP/i);
    expect(effects).toMatch(/`Ward·Paths`:\*\* denial at a threshold/i);
  });

  it('names the class on the Warding Amulet', () => {
    expect(npcs).toMatch(/Warding Amulet[^\n]*2 AP vs physical harm/i);
  });
});
