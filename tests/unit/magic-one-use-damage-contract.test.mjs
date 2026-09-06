import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (location) => readFileSync(path.resolve(location), 'utf8');

describe('one-use Shaping damage', () => {
  const building = read('src/content/rules/magic/building-a-shaping.md');
  const effects = read('src/content/rules/magic/effects.md');
  const ongoing = read('src/content/rules/magic/ongoing-and-magical-actions.md');
  const trigger = read('src/content/rules/talents/trigger.md');
  const items = read('src/content/rules/gm-tools/enchanted-items.md');
  const examples = read('src/content/rules/magic/rituals-and-examples.md');

  it('prohibits recurring, retaliatory, and repeated weapon damage', () => {
    expect(effects).toMatch(/damage outcome resolves once/i);
    expect(effects).toMatch(/Duration cannot[^.]*repeat it each round/i);
    expect(effects).toMatch(/Duration cannot[^.]*add it to every weapon hit/i);
    expect(effects).toMatch(/Duration cannot[^.]*retaliate/i);
    expect(ongoing).toMatch(/never automatic Shaping damage each round/i);
    expect(items).toMatch(/No enchantment retaliates with damage/i);
    expect(items).toMatch(/adds magical damage to repeated weapon hits/i);
  });

  it('keeps genuine environmental consequences mundane', () => {
    expect(ongoing).toMatch(/damage at its creation[^.]*separately paid immediate Unmake outcome/i);
    expect(ongoing).toMatch(/genuinely changed environmental hazards[^.]*core rules/i);
    expect(ongoing).toMatch(/rather than recurring magical damage/i);
  });

  it('uses the existing Trigger without deferred target selection', () => {
    expect(building).toMatch(/Trigger fixes its target, cell, outcomes, Range, Reach/i);
    expect(trigger).toMatch(/cannot choose or change them when it fires/i);
    expect(trigger).toMatch(
      /ordinary casting is armed when cast[^.]*check target, Range, and route/i,
    );
    expect(trigger).toMatch(/fires once/i);
    expect(trigger).toMatch(/Counter resolves when the Shaping is cast/i);
    expect(trigger).toMatch(
      /target's ordinary[^.]*resolves when the effect fires[^.]*stored Shaping result/i,
    );
  });

  it('treats a weapon hit only as the event and resolves both effects separately', () => {
    expect(trigger).toMatch(/successful weapon hit against the already selected target/i);
    expect(trigger).toMatch(/hit triggers but does not deliver the magic or replace its defence/i);
    expect(trigger).toMatch(/Magical damage gains no weapon Damage Modifier or Critical benefit/i);
    expect(trigger).toMatch(/miss leaves the Trigger waiting/i);
    expect(examples).toMatch(
      /named ogre[^\n]*Unmake·Fire; I2, R1, Direct, Trigger, wait D1[^\n]*6/i,
    );
    expect(examples).toMatch(/ogre when casting[^\n]*Resilience/i);
  });
});
