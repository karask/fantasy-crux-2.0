import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (location) => readFileSync(path.resolve(location), 'utf8');

describe('magical movement, senses, and adaptations', () => {
  const effects = read('src/content/rules/magic/effects.md');
  const forms = read('src/content/rules/magic/techniques-and-forms.md');
  const ongoing = read('src/content/rules/magic/ongoing-and-magical-actions.md');
  const examples = read('src/content/rules/magic/rituals-and-examples.md');

  it('prices capabilities separately from their fictional method', () => {
    expect(effects).toMatch(/benchmark prices a capability, not its fictional method/i);
    expect(effects).toMatch(/Technique·Form must explain how it works/i);
    expect(forms).toMatch(/price what a subject can do[^.]*do not choose a cell/i);
    expect(forms).toMatch(/Similar practical results do not make those methods interchangeable/i);
    expect(examples).toMatch(/adhesive climbing pads[^\n]*Alter·Flesh; I2, D1[^\n]*3/i);
  });

  it('omits numeric characteristic modification as a Shaping outcome', () => {
    expect(effects).not.toMatch(/Characteristic modifier/i);
    expect(effects).not.toMatch(/Temporary characteristic changes/i);
  });

  it('defines movement modes and nonstacking speed increases', () => {
    expect(effects).toMatch(/\|\s*2\s*\| Gain a climb or swim mode at normal Movement/i);
    expect(effects).toMatch(/\|\s*3\s*\| Gain flight at normal Movement/i);
    expect(effects).toMatch(
      /\|\s*4\s*\| Pass through one named mundane substance at half Movement/i,
    );
    expect(effects).toMatch(
      /3 metres at Intensity 1[^.]*1\.5 at Intensity 2[^.]*double[^.]*Intensity 3[^.]*triple[^.]*Intensity 4/i,
    );
    expect(effects).toMatch(/only the strongest magical speed adjustment/i);
    expect(effects).toMatch(/not automatic success[\s\S]{0,100}Athletics may still be required/i);
  });

  it('separates self-directed movement from active control', () => {
    expect(effects).toMatch(/granted mode is subject-directed/i);
    expect(effects).toMatch(/neither concentration nor the Shaper's Combat Action/i);
    expect(effects).toMatch(
      /Shaper instead directs another subject's movement[^.]*active control/i,
    );
    expect(ongoing).toMatch(
      /subject-directed movement mode or fixed sense[^.]*no maintenance Action/i,
    );
    expect(examples).toMatch(/subject's own direction[^\n]*may still fight/i);
    expect(examples).toMatch(/another subject's magical flight[^\n]*Shaper's Combat Action/i);
  });

  it('prices senses and breathing without granting unrelated benefits', () => {
    expect(effects).toMatch(/Low-Light Sight/i);
    expect(effects).toMatch(/Night Vision/i);
    expect(effects).toMatch(/Blind Sight through one named sense/i);
    expect(effects).toMatch(/broad supernatural sense[^.]*one defined class[^.]*Form governs/i);
    expect(effects).toMatch(/Breathe one named medium/i);
    expect(effects).toMatch(/Function without breathing/i);
    expect(effects).toMatch(/Breathing water does not grant swimming/i);
    expect(effects).toMatch(/does not grant protection from pressure, heat, cold, corrosion/i);
  });
});
