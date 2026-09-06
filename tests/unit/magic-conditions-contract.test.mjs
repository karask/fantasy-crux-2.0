import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (location) => readFileSync(path.resolve(location), 'utf8');

describe('magical conditions and restoration', () => {
  const building = read('src/content/rules/magic/building-a-shaping.md');
  const effects = read('src/content/rules/magic/effects.md');
  const forms = read('src/content/rules/magic/techniques-and-forms.md');
  const examples = read('src/content/rules/magic/rituals-and-examples.md');

  it('separates concealment of a subject from impairment of a perceiver', () => {
    expect(effects).toMatch(/Sensory impairment is a condition on a perceiver/i);
    expect(effects).toMatch(/sensory concealment instead hides a particular subject or evidence/i);
    expect(effects).toMatch(/Reach for impairment counts affected perceivers/i);
    expect(effects).toMatch(/Impairment and concealment do not add their penalties together/i);
    expect(effects).toMatch(/optical invisibility does not hide body heat/i);
  });

  it('applies sight loss globally but invisibility only against its subject', () => {
    expect(effects).toMatch(/removes sight[\s\S]{0,250}only against the concealed subject/i);
    expect(effects).toMatch(/observer's surrounding illumination and Movement are unchanged/i);
    expect(effects).toMatch(/Suppressing sight[\s\S]{0,500}Movement is quartered/i);
    expect(effects).toMatch(/unless another applicable sense/i);
  });

  it('prices condition mechanics rather than names and prevents repeated denial', () => {
    expect(effects).toMatch(/condition name describes paid consequences/i);
    expect(effects).toMatch(/\|\s*4\s*\| Incapacitate/i);
    expect(effects).toMatch(/no Actions or Reactions/i);
    expect(effects).toMatch(/Duration sustains a state but never repeats a one-use outcome/i);
    expect(building).toMatch(/Duration sustains[^.]*not repeated[^.]*lost Actions/i);
    expect(effects).toMatch(/lost Combat Action occurs once regardless of Duration/i);
  });

  it('provides retries and bounded sleep without making every incapacity helpless', () => {
    expect(effects).toMatch(/spend a Combat Action to retry its original defence/i);
    expect(effects).toMatch(/prevents Combat Actions[^.]*retry freely at the end of each turn/i);
    expect(effects).toMatch(/Winning frees that subject/i);
    expect(effects).toMatch(/magical sleep[^.]*unconscious and helpless[^.]*damage/i);
    expect(effects).toMatch(/Incapacitation alone[^.]*not automatic[^.]*helplessness/i);
    expect(examples).toMatch(/magical sleep[^\n]*Alter·Mind; I4, D1[^\n]*5/i);
    expect(examples).toMatch(/Paralyse[^\n]*Alter·Flesh; I4, D1[^\n]*5/i);
  });

  it('removes conditions according to their source without bypassing Dispel', () => {
    expect(effects).toMatch(/Active magic:[\s\S]{0,160}only \[Dispel\][^.]*ends the Shaping/i);
    expect(effects).toMatch(/Poison or disease:[\s\S]{0,160}Potency-based curing/i);
    expect(effects).toMatch(/Bleeding, Dying, or Wounded:[\s\S]{0,180}specific healing rules/i);
    expect(effects).toMatch(/Intensity 3 removes Fatigued or reduces Exhausted to Fatigued/i);
    expect(effects).toMatch(/Intensity 4 removes Exhausted entirely/i);
    expect(effects).toMatch(/Another nonmagical condition:[\s\S]{0,220}at least the Intensity/i);
    expect(effects).toMatch(/Curse[^.]*not a separate mechanical category/i);
    expect(forms).toMatch(/Only Dispel ends an active Shaping/i);
  });
});
