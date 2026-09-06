import { readFileSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

const read = (location) => readFileSync(path.resolve(location), 'utf8');

describe('Confluence Shaping adjustment', () => {
  const source = read('src/content/rules/talents/confluence.md');
  const talent = matter(source);
  const building = read('src/content/rules/magic/building-a-shaping.md');
  const examples = read('src/content/rules/magic/rituals-and-examples.md');

  it('is a 5-IP Expert passive Talent with a +1 Magnitude adjustment', () => {
    expect(talent.data).toMatchObject({
      id: 'talent.confluence',
      title: 'Confluence',
      cost: 5,
      prerequisites: 'Shaping 76%',
      activation: 'passive',
    });
    expect(talent.content).toMatch(/Confluence[^.]*for `\+1` Magnitude/i);
  });

  it('combines exactly two known cells while fully pricing their outcomes', () => {
    expect(talent.content).toMatch(/exactly two known Technique·Form cells/i);
    expect(talent.content).toMatch(/know both cells/i);
    expect(talent.content).toMatch(
      /each must contribute at least one distinct, cell-permitted outcome/i,
    );
    expect(talent.content).toMatch(/Pay every outcome's full Intensity/i);
    expect(talent.content).toMatch(/shared Range, Duration, and Reach once/i);
    expect(building).toMatch(/Every outcome must use that cell unless you apply \[Confluence\]/i);
    expect(building).toMatch(
      /additional outcome[^.]*within the same known cell needs no training/i,
    );
  });

  it('resolves as one Shaping while retaining outcome-specific resolution', () => {
    expect(talent.content).toMatch(
      /one Combat Action, one Shaping test, one Power Point payment, and one Tell/i,
    );
    expect(talent.content).toMatch(
      /Each outcome retains its own target, defence, delivery, protection/i,
    );
    expect(talent.content).toMatch(/defence rolls per subject/i);
    expect(talent.content).toMatch(/one subject[^.]*same defence share one defence roll/i);
    expect(talent.content).toMatch(/one subject[^.]*different defences resolve separately/i);
    expect(talent.content).toMatch(/Different subjects always defend separately/i);
    expect(talent.content).toMatch(/Counter stops the whole Shaping/i);
    expect(talent.content).toMatch(/Dispel ends the whole ongoing Shaping/i);
  });

  it('permits paid dependencies and supplies a correctly priced life-drain example', () => {
    expect(talent.content).toMatch(
      /one outcome occurs only if another outcome affects its target/i,
    );
    expect(talent.content).toMatch(/never reduces Magnitude or refunds Power Points/i);
    expect(talent.content).toMatch(/retains its own dice, limits, and valid subjects/i);
    expect(talent.content).toMatch(
      /Unmake·Flesh I2 \+ Alter·Flesh I2; Reach1, Direct, Confluence; M7/i,
    );
    expect(talent.content).toMatch(/heal yourself for `2D4` HP[^.]*HP the target actually lost/i);
    expect(examples).toMatch(/Burn and shove[^\n]*Confluence[^\n]*6/i);
    expect(examples).toMatch(/Drain life[^\n]*Confluence[^\n]*7/i);
  });
});
