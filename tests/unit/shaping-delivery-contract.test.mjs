import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (location) => readFileSync(path.resolve(location), 'utf8');

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(location);
    return entry.name.endsWith('.md') ? [location] : [];
  });
}

function cleanCell(cell) {
  return cell
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replaceAll('**', '')
    .replaceAll('`', '')
    .trim();
}

function tables(markdown) {
  return [...markdown.matchAll(/(?:^\|.*\|\r?\n){2,}/gm)].map((match) => {
    const rows = match[0]
      .trim()
      .split(/\r?\n/)
      .map((line) => line.split('|').slice(1, -1).map(cleanCell));
    return { header: rows[0], body: rows.slice(2) };
  });
}

function tableWithHeader(markdown, firstHeader) {
  return tables(markdown).find((table) => table.header[0] === firstHeader);
}

const magicFiles = [
  'becoming-a-shaper.md',
  'building-a-shaping.md',
  'techniques-and-forms.md',
  'effects.md',
  'casting-and-defence.md',
  'ongoing-and-magical-actions.md',
  'rituals-and-examples.md',
];

describe('Projected and Direct Harm', () => {
  const building = read('src/content/rules/magic/building-a-shaping.md');
  const casting = read('src/content/rules/magic/casting-and-defence.md');
  const effects = read('src/content/rules/magic/effects.md');
  const examples = read('src/content/rules/magic/rituals-and-examples.md');
  const activeGuard = read('src/content/rules/combat/active-guard.md');
  const missileGuard = read('src/content/rules/talents/missile-guard.md');
  const shieldCover = read('src/content/rules/talents/shield-cover.md');
  const adr = read('docs/decisions/007-distinguish-projected-and-direct-harm.md');
  const magic = magicFiles.map((file) => read(`src/content/rules/magic/${file}`)).join('\n');

  it('makes the two deliveries exclusive and prices Direct Harm once', () => {
    expect(casting).toMatch(/Projected Harm and Direct Harm are mutually exclusive/i);
    expect(building).toMatch(/declare (?:its|the) delivery before calculating Magnitude/i);

    expect(tableWithHeader(casting, 'Delivery')).toEqual({
      header: ['Delivery', 'Cost', 'Opposed defence', 'Protection'],
      body: [
        ['Projected Harm', '—', 'Dodge or shield Active Guard', 'Cover and nonmagical AP'],
        [
          'Direct bodily or material Harm',
          '+1 M',
          'Resilience',
          'Magical Wards and named resistance',
        ],
        [
          'Direct mental or spiritual Harm',
          '+1 M',
          'Persistence',
          'Magical Wards and named resistance',
        ],
        ['Direct Harm to unattended objects', '+1 M', 'None', 'Magical protection only'],
      ],
    });

    expect(casting).toMatch(
      /each hostile outcome receives exactly one defence against the original Shaping result/i,
    );
    expect(casting).toMatch(
      /successful resistance that wins[^.]*negates the entire Direct outcome/i,
    );
    expect(casting).toMatch(/does not reduce (?:its |the )?damage/i);
    expect(casting).toMatch(/character who Counters cannot[^.]*Resilience or Persistence/i);
    expect(casting).toMatch(/another character's Counter[^.]*target's defence/i);
    expect(casting).toMatch(/selected-target Reach[^.]*never a radius/i);
    expect(casting).toMatch(/each Direct target[^.]*valid Range route/i);
    expect(casting).toMatch(/complete barrier[^.]*Indirect/i);

    expect(tableWithHeader(casting, 'Other effect')?.body).toContainEqual([
      'Bodily or material alteration, restraint, or physical control',
      'Resilience',
    ]);
    expect(tableWithHeader(casting, 'Other effect')?.body).toContainEqual([
      'Thought, emotion, memory, identity, soul, or control',
      'Persistence',
    ]);
  });

  it('opposes every magical defence with the original Shaping result', () => {
    expect(casting).toMatch(
      /Dodge, shield Active Guard, Resilience, (?:or|and) Persistence[^.]*original Shaping result[^.]*opposed test/i,
    );
    expect(casting).toMatch(/original Shaping result[^.]*attacker's skill roll/i);
    expect(casting).toMatch(
      /Shaper must succeed and win against Dodge, Resilience, or Persistence[^.]*subject[^.]*affected/i,
    );
    expect(casting).toMatch(/shield Active Guard wins[^.]*Parry Size/i);
    expect(casting).toMatch(/Shaping wins[^.]*guard has no effect/i);
    expect(casting).toMatch(/areas share one Shaping roll[^.]*defend separately/i);

    expect(activeGuard).toMatch(/mundane[^.]*critical matrix/i);
    expect(activeGuard).toMatch(
      /Projected Shaping[^.]*oppose Close Combat[^.]*original Shaping result/i,
    );
    expect(casting).toMatch(/hostile Touch Shaping[^.]*sole defence exception/i);
    expect(casting).toMatch(/hostile Touch Shaping[\s\S]{0,500}\[combat matrix\]\(/i);
    expect(effects).toMatch(
      /Full control[^.]*Persistence[^.]*stored Shaping result[^.]*Winning frees/i,
    );
    expect(effects).toMatch(
      /denial[^.]*crossing[^.]*appropriate defence[^.]*stored Shaping result/i,
    );
  });

  it('keeps Projected Harm physical and Direct Harm inside mundane armour', () => {
    expect(effects).toMatch(/Projected Harm[^.]*normal [^.]*damage rules[^.]*nonmagical AP/i);
    expect(effects).toMatch(/Direct Harm ignores nonmagical worn, natural, and object AP/i);
    expect(effects).toMatch(/Direct Harm against creatures[^.]*Ward AP and named resistances/i);
    expect(effects).toMatch(
      /Unattended objects[^.]*(?:only magical protection|magical protection only)/i,
    );
    expect(adr).toMatch(/unattended\s+objects[^.]*magical protection only/i);
    expect(effects).toMatch(
      /subsequent hazards, summons, falling objects, and mundane consequences[^.]*ordinary armour rules/i,
    );
    expect(effects).toMatch(/Unmake deals `Intensity D6`/i);
  });

  it('gives every individually targeted projection the same shield path', () => {
    expect(casting).toMatch(/projection may be[^.]*ready shield/i);
    expect(casting).toMatch(/regardless of Form[^.]*solid or non-solid/i);
    expect(casting).toMatch(/weapons cannot Active Guard magical projections/i);
    expect(casting).toMatch(
      /defender chooses one eligible Reaction: Counter, Dodge, or Active Guard/i,
    );
    expect(casting).toMatch(/areas cannot be Active Guarded/i);
    expect(casting).toMatch(/Direct Harm and Spirit Harm cannot be Active Guarded/i);
    expect(casting).toMatch(/occupants' shields do not alter (?:an|the) area's shared roll/i);
    expect(casting).toMatch(/aware subject may Dodge a projected area at `-1P`/i);

    expect(tableWithHeader(activeGuard, 'Incoming attack')?.body).toContainEqual([
      'Individually targeted Projected Shaping',
      'Ready shield only',
      '-1P',
    ]);
    expect(activeGuard).toMatch(
      /after (?:a )?ranged attack or individually targeted Projected Shaping succeeds[^.]*React with Active Guard before resolution/i,
    );
    expect(missileGuard).toMatch(/bows, crossbows, slings, and Projected Shapings/i);
    expect(shieldCover).toMatch(/individually targeted Projected Shaping/i);
    expect(shieldCover).toMatch(/before (?:a |the )?Active Guard/i);
    expect(shieldCover).toMatch(/best Shield Cover or terrain/i);
  });

  it('contracts every Impact Size and shield result', () => {
    expect(tableWithHeader(casting, 'Intensity')).toEqual({
      header: ['Intensity', 'Damage', 'Impact Size'],
      body: [
        ['1', '1D6', 'Light'],
        ['2', '2D6', 'Medium'],
        ['3', '3D6', 'Heavy'],
        ['4', '4D6', 'Huge'],
        ['5', '5D6', 'Beyond Huge'],
      ],
    });
    expect(tableWithHeader(casting, 'Shield')).toEqual({
      header: ['Shield', 'Size', 'I1', 'I2', 'I3', 'I4', 'I5'],
      body: [
        ['Small', 'Medium', 'All', 'All', 'Half', 'None', 'None'],
        ['Medium', 'Heavy', 'All', 'All', 'All', 'Half', 'None'],
        ['Large', 'Huge', 'All', 'All', 'All', 'All', 'Half'],
      ],
    });

    expect(casting).toMatch(/same Size or larger[^.]*damage and attached outcomes/i);
    expect(casting).toMatch(/Shaping deals no damage[^.]*blocks its projected outcome/i);
    expect(casting).toMatch(
      /one Size smaller[^.]*half[^.]*separately paid non-damage outcomes remain/i,
    );
    expect(casting).toMatch(/two or more Sizes smaller[^.]*reduce no damage/i);
    expect(casting).toMatch(
      /Critical shield Parry that wins[^.]*blocks? everything regardless of Size/i,
    );
    expect(casting).toMatch(/Shaping wins[^.]*guard has no effect/i);
    expect(casting).toMatch(/Shields suffer no item damage merely for guarding/i);
    expect(casting).toMatch(/separate mundane[^.]*attack[^.]*ordinary weapon Size/i);
    expect(casting).toMatch(/resolved as Shaping[^.]*Impact Size/i);
  });

  it('keeps Fire, ice, Flesh, and Spirit on their declared paths', () => {
    const spiritCombat = read('src/content/rules/creatures/spirit-combat-and-possession.md');

    expect(examples).toMatch(
      /firebolt[^\n]*Unmake·Fire; I2, R1[^\n]*3[^\n]*Dodge or shield Active Guard/i,
    );
    expect(examples).toMatch(/ice shard[^\n]*Unmake·Water\/Ice; I2, R1[^\n]*3[^\n]*firebolt/i);
    expect(examples).toMatch(
      /searing heat[^\n]*Unmake·Fire; I2, R1, Direct[^\n]*4[^\n]*Resilience/i,
    );
    expect(examples).toMatch(
      /flesh wither[^\n]*Unmake·Flesh; I2, R1, Direct[^\n]*4[^\n]*Resilience/i,
    );
    expect(examples).toMatch(
      /soul assault[^\n]*Unmake·Spirit; I2, R1, Direct[^\n]*4[^\n]*Persistence/i,
    );

    expect(effects).toMatch(/Unmake·Spirit damage is Direct-only/i);
    expect(effects).toMatch(/visible spectral bolt[^.]*cosmetic Tell/i);
    expect(effects).toMatch(/`Intensity D6` PP/i);
    expect(effects).toMatch(/Spirit[^.]*only magical Ward AP and named resistances apply/i);
    expect(effects).toMatch(/no HP loss, Major Wound, or Bleeding/i);
    expect(effects).toMatch(
      /At 0 PP[^.]*living target[^.]*unconscious[^.]*Spirit[^.]*banished[^.]*possession ends/i,
    );
    expect(effects).toMatch(/Soulless targets are (?:invalid|immune)/i);
    expect(spiritCombat).not.toMatch(/Direct Harm|Projected Harm|\+1 M/);
  });

  it('removes Internal Flesh and Piercing from canonical rules', () => {
    const canonicalRules = markdownFiles(path.resolve('src/content/rules'))
      .map((file) => readFileSync(file, 'utf8'))
      .join('\n');

    expect(magic).not.toMatch(/Internal Flesh|padding (?:interrupts|interference)/i);
    expect(canonicalRules).not.toMatch(/\bPiercing\b/);
    expect(existsSync(path.resolve('src/content/rules/talents/piercing.md'))).toBe(false);
  });
});
