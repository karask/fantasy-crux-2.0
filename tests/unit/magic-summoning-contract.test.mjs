import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (location) => readFileSync(path.resolve(location), 'utf8');

describe('Shaping summons and calling', () => {
  const effects = read('src/content/rules/magic/effects.md');
  const ongoing = read('src/content/rules/magic/ongoing-and-magical-actions.md');
  const creatures = read('src/content/rules/creatures/using-creatures.md');

  it('runs summons on standing orders rather than the Shaper’s Combat Action', () => {
    expect(effects).toMatch(/one short standing order/i);
    expect(effects).toMatch(/acts on its own turn immediately after its Shaper/i);
    expect(effects).toMatch(/Changing the order costs the Shaper's Movement Action/i);
    expect(effects).not.toMatch(/consequential acts cost the Shaper's Combat Action/i);
    expect(effects).toMatch(/only one combat-capable summon, created or called/i);
    expect(ongoing).toMatch(/changing it costs the Shaper's Movement Action/i);
  });

  it('links conjured beings to their Form without creating souls', () => {
    expect(effects).toMatch(/every conjured being is Soulless/i);
    expect(effects).toMatch(/Form sets its body, tags, one signature trait, and one drawback/i);
    expect(effects).toMatch(/Never combat-capable/i);
    expect(effects).toMatch(/Spirit, Paths, and Fate create no beings/i);
    expect(effects).toMatch(/Giving a Mindless being a mind[^.]*raises its Intensity by 1/i);
    expect(effects).toMatch(/conjured being cannot be Incorporeal/i);
  });

  it('restricts calling to Form-bound or linked beings', () => {
    expect(effects).toMatch(/Ordinary creatures[^.]*cannot/i);
    expect(effects).toMatch(/Conjure·Spirit/);
    expect(effects).toMatch(/An Anchored being cannot be called beyond its anchor's boundary/i);
  });

  it('prices calling by Threat Intensity with a resistance floor', () => {
    expect(effects).toMatch(/Intensity equals the being's \[Threat Intensity\]/i);
    expect(effects).toMatch(/Persistence or `20 × Threat Intensity`%, whichever is higher/i);
    expect(effects).toMatch(/arrives bound for the Duration/i);
    expect(effects).toMatch(/ongoing Shapings count against its caller's Active Magnitude/i);
    expect(creatures).toMatch(/Average the body and attack ratings, rounding up/i);
    expect(creatures).toMatch(/add 1, once/i);
  });
});
