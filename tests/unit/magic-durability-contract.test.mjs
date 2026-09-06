import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (location) => readFileSync(path.resolve(location), 'utf8');

describe('magical vitality without regeneration', () => {
  const building = read('src/content/rules/magic/building-a-shaping.md');
  const combat = read('src/content/rules/combat/damage-and-wounds.md');
  const effects = read('src/content/rules/magic/effects.md');
  const items = read('src/content/rules/gm-tools/enchanted-items.md');
  const examples = read('src/content/rules/magic/rituals-and-examples.md');

  it('uses a finite reserve without changing actual or maximum HP', () => {
    expect(effects).toMatch(/vitality reserve[^.]*finite magical protection/i);
    expect(effects).toMatch(/`3 × Intensity`/i);
    expect(effects).toMatch(/After resolving Parry, armour, resistance/i);
    expect(effects).toMatch(/Any excess damages actual HP/i);
    expect(effects).toMatch(/only the damage that reaches actual HP[^.]*MWL/i);
    expect(effects).toMatch(/changes neither maximum HP nor MWL/i);
    expect(effects).toMatch(/cannot be healed/i);
    expect(effects).toMatch(/persists across any number of damage instances/i);
  });

  it('prevents stacking and automatic replenishment', () => {
    expect(effects).toMatch(/subject can have only one vitality reserve/i);
    expect(effects).toMatch(/existing reserve's remaining points and keep the larger/i);
    expect(effects).toMatch(/on a tie, the subject chooses/i);
    expect(effects).toMatch(/discarded reserve ends/i);
    expect(effects).toMatch(/Unused points vanish when Duration ends/i);
    expect(effects).toMatch(/Once depleted[^.]*reserve ends/i);
    expect(effects).toMatch(
      /vitality-reserve enchantment must be Activated or Charged, never Continuous/i,
    );
    expect(items).toMatch(/depletable outcome[^.]*cannot be Continuous/i);
    expect(items).toMatch(/Activated[^.]*paying for each fresh reserve[^.]*Charged/i);
  });

  it('keeps vitality and Ward AP mechanically distinct', () => {
    expect(effects).toMatch(/cell must explain the protection/i);
    expect(effects).toMatch(
      /Ward AP remains repeatable[^.]*vitality reserve[^.]*finite, depletable pool/i,
    );
    expect(effects).toMatch(/absorbs HP damage only—not PP damage/i);
    expect(effects).toMatch(/paid HP cost or sacrifice/i);
    expect(effects).toMatch(/HP loss without dealing damage/i);
    expect(combat).toMatch(/apply it after every other applicable reduction but before actual HP/i);
    expect(combat).toMatch(/Only damage that passes the reserve[^.]*Major Wound/i);
    expect(examples).toMatch(
      /supernatural vigour[^\n]*Alter·Flesh; I2, D1[^\n]*6-point vitality reserve/i,
    );
    expect(examples).toMatch(
      /finite force shell[^\n]*Ward·Force\/Motion; I3, D1[^\n]*9-point vitality reserve/i,
    );
  });

  it('explicitly rejects regenerative Shaping', () => {
    expect(building).toMatch(/not repeated[^.]*healing/i);
    expect(effects).toMatch(/Shaping cannot regenerate/i);
    expect(effects).toMatch(/cannot distribute healing across later turns/i);
    expect(effects).toMatch(/cannot[^.]*restore HP repeatedly through Duration/i);
    expect(effects).toMatch(/creature's explicitly listed Regeneration[^.]*profile ability/i);
  });
});
