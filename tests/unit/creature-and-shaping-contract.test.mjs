import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (location) => readFileSync(path.resolve(location), 'utf8');

const creaturePath = path.resolve('freeform-creatures/FC-creatures-lite.md');
const creatureText = existsSync(creaturePath) ? readFileSync(creaturePath, 'utf8') : '';
const publishedMagicPages = [
  'becoming-a-shaper.md',
  'building-a-shaping.md',
  'techniques-and-forms.md',
  'effects.md',
  'casting-and-defence.md',
  'ongoing-and-magical-actions.md',
  'rituals-and-examples.md',
];

const expectedCreatures = [
  'Giant Ant',
  'Bear',
  'Bull',
  'Crocodile',
  'Dog',
  'Elephant',
  'Hawk',
  'Giant Hawk',
  'Horse',
  'Lion',
  'Giant Lizard',
  'Giant Octopus',
  'Giant Python',
  'Raven',
  'Rhinoceros',
  'Giant Spider',
  'Viper',
  'Wolf',
  'Basilisk',
  'Beastman',
  'Dragon',
  'Dwarf',
  'Elemental',
  'Elf',
  'Gargoyle',
  'Giant',
  'Goblin',
  'Golem',
  'Griffin',
  'Harpy',
  'Merfolk',
  'Sea Serpent',
  'Holy Steed',
  'Holy Warrior',
  'Lizardman',
  'Ogre',
  'Orc',
  'Pixie',
  'Troll',
  'Werewolf',
  'Wyvern',
  'Dryad',
  'Hag',
  'Naiad',
  'Oread',
  'Ancestor Spirit',
  'Disease Spirit',
  'Ghost',
  'Guardian Spirit',
  'Healing Spirit',
  'Magic Spirit',
  'Passion Spirit',
  'Ghoul',
  'Mummy',
  'Skeleton',
  'Vampire',
  'Zombie',
];

function creatureProfiles(markdown) {
  const matches = [...markdown.matchAll(/^### ([^\r\n]+)\r?\n([\s\S]*?)(?=^### |(?![\s\S]))/gm)];
  return matches.map((match) => ({ name: match[1].trim(), body: match[2] }));
}

const parsedCreatureProfiles = creatureProfiles(creatureText);
const creatureByName = new Map(parsedCreatureProfiles.map(({ name, body }) => [name, body]));
const bodyOf = (name) => creatureByName.get(name) ?? '';
const talentsOf = (name) => bodyOf(name).match(/\*\*Talents:\*\* ([^\r\n]+)/)?.[1] ?? '';
const tagsOf = (name) =>
  bodyOf(name)
    .match(/\*\*Tags:\*\* ([^\r\n]+)/)?.[1]
    .split(', ')
    .map((tag) => tag.replace(/\.$/, '')) ?? [];

describe('canonical Shaping and senses', () => {
  it('uses the approved six Techniques and ten Forms', () => {
    const techniques = read('src/content/rules/magic/techniques-and-forms.md');
    const allMagic = publishedMagicPages
      .map((name) => read(`src/content/rules/magic/${name}`))
      .join('\n');

    const techniqueSection =
      techniques.match(/## Techniques[^\r\n]*\r?\n([\s\S]*?)\r?\n## Forms/)?.[1] ?? '';
    const formsSection =
      techniques.match(/## Forms[^\r\n]*\r?\n([\s\S]*?)\r?\n### Bodies/)?.[1] ?? '';
    const boldFirstColumn = (table) =>
      [...table.matchAll(/^\|\s+\*\*([^*]+)\*\*\s+\|/gm)].map((match) => match[1]);

    expect(boldFirstColumn(techniqueSection)).toEqual([
      'Conjure',
      'Bend',
      'Unmake',
      'Alter',
      'Ward',
      'Scry',
    ]);
    expect(boldFirstColumn(formsSection)).toEqual([
      'Fire',
      'Water/Ice',
      'Air/Storm',
      'Earth/Stone',
      'Flesh',
      'Mind',
      'Force/Motion',
      'Spirit',
      'Paths',
      'Fate',
    ]);
    expect(allMagic).not.toMatch(/\b(?:Wield|Shift)\b/);
    expect(techniques).toContain('Soulless');
    expect(techniques).toContain('Mindless');
    expect(allMagic).not.toMatch(/\b(?:Names|Shadow)\b/);
  });

  it('prices teleportation, portals, Fate, and corporeal undead explicitly', () => {
    const techniques = read('src/content/rules/magic/techniques-and-forms.md');
    const effects = read('src/content/rules/magic/effects.md');
    const examples = read('src/content/rules/magic/rituals-and-examples.md');
    const attributes = read('src/content/rules/characters/attributes.md');
    const combined = `${techniques}\n${effects}\n${examples}`;

    expect(combined).toMatch(/Bend[·.]Paths[\s\S]{0,120}Intensity 2/i);
    expect(combined).toMatch(/Conjure[·.]Paths[\s\S]{0,120}Intensity 3/i);
    expect(combined).toContain('Movement Action');
    expect(combined).toContain('Trigger');
    expect(combined).toContain('`+1B` or `-1P`');
    expect(combined).toContain('`+2B` or `-2P`');
    expect(combined).toMatch(/Conjure[·.]Flesh/i);
    expect(combined).toMatch(/Alter[·.]Flesh/i);
    expect(combined).toMatch(/Undead/i);
    expect(effects).toMatch(/Unmake·Spirit[\s\S]{0,100}souled target/i);
    expect(effects).toMatch(/At 0 PP[\s\S]{0,100}living target falls unconscious/i);
    expect(effects).toMatch(/Soulless targets are invalid/i);
    expect(attributes).toMatch(/At 0 PP[\s\S]{0,120}nonliving characters stay active/i);
  });

  it('separates illumination, obscurity, and alternate senses', () => {
    const light = read('src/content/rules/adventuring/light-and-darkness.md');
    const ranged = read('src/content/rules/combat/ranged-combat.md');

    expect(light).toContain('Mist, fog, foliage, and smoke are obscurity');
    expect(light).toMatch(/Night Vision:[\s\S]{0,220}surface night/i);
    expect(light).toMatch(/Night Sight:[\s\S]{0,220}Pitch black/i);
    expect(light).toMatch(/Blind Sight \(sense\):[\s\S]{0,300}eye contact/i);
    expect(light).toMatch(/observed target[\s\S]{0,100}mover/i);
    expect(ranged).not.toMatch(/mist, smoke, or dim light/i);
    expect(ranged).not.toMatch(/fog, smoke, or darkness/i);
    expect(ranged).toContain('/rules/adventuring/light-and-darkness/');
  });
});

describe('unpublished Lite creature compendium', () => {
  it('exists outside the published content tree with exactly 57 approved profiles', () => {
    expect(existsSync(creaturePath)).toBe(true);
    expect(existsSync(path.resolve('src/content/rules/creatures'))).toBe(false);

    expect(parsedCreatureProfiles.map(({ name }) => name)).toEqual(expectedCreatures);
    for (const excluded of ['Centaur', 'Gorgon', 'Hippogriff', 'Lamia', 'Slime', 'Octupus']) {
      expect(parsedCreatureProfiles.map(({ name }) => name)).not.toContain(excluded);
    }

    expect(creatureText.match(/^## (Animals|Monsters|Nymphs|Spirits|Undead)$/gm)).toEqual([
      '## Animals',
      '## Monsters',
      '## Nymphs',
      '## Spirits',
      '## Undead',
    ]);
  });

  it('gives every profile a compact, self-contained rules schema', () => {
    for (const { name, body } of parsedCreatureProfiles) {
      for (const field of [
        'Tags',
        'Characteristics',
        'Derived',
        'Skills',
        'Attacks',
        'Talents',
        'Abilities',
      ]) {
        expect(body, `${name}: ${field}`).toMatch(new RegExp(`\\*\\*${field}:\\*\\*\\s+\\S`));
      }
    }
  });

  it('caps skills at 100% and preserves exceptional competence through Mastery', () => {
    const percentages = [...creatureText.matchAll(/\b(\d{1,3})%/g)].map((match) =>
      Number(match[1]),
    );
    expect(percentages.length).toBeGreaterThan(50);
    expect(Math.max(...percentages)).toBeLessThanOrEqual(100);

    expect(
      parsedCreatureProfiles
        .filter(({ body }) => body.includes('Mastery ('))
        .map(({ name }) => name),
    ).toEqual(['Dragon', 'Elemental', 'Holy Steed', 'Holy Warrior', 'Hag']);

    expect(talentsOf('Dragon')).toBe(
      'Mastery (Persistence) III; Mastery (Influence) II; Mastery (Resilience) I; Mastery (Athletics) I; Mastery (Perception) I; Mastery (Unarmed Combat) I.',
    );
    expect(talentsOf('Elemental')).toBe(
      'Small: Mastery (Dodge) I. Large: Mastery (Attack) I. Huge: Mastery (Persistence) I. Medium: none.',
    );
    expect(talentsOf('Holy Steed')).toBe(
      'Mastery (Dodge) I; Mastery (Persistence) I; Mastery (Resilience) I.',
    );
    expect(talentsOf('Holy Warrior')).toBe(
      'Mastery (Dodge) II; Mastery (chosen combat skill) II; Mastery (Resilience) I; Mastery (Athletics) I.',
    );
    expect(talentsOf('Hag')).toBe('Mastery (Deception) I.');
  });

  it('uses the Lite HP, MWL, PP, DM, and Combat Order formulas for fixed profiles', () => {
    const wornArmourEnc = {
      leather: 3,
      ringmail: 4,
      scalemail: 6,
      chainmail: 7,
      platemail: 9,
    };
    const damageModifier = (total) => {
      if (total <= 10) return '-1D6';
      if (total <= 15) return '-1D4';
      if (total <= 25) return '+0';
      if (total <= 30) return '+1D4';
      if (total <= 45) return '+1D6';
      return `+${2 + Math.max(0, Math.ceil((total - 60) / 15))}D6`;
    };
    let checked = 0;
    const skipped = [];

    for (const { name, body } of parsedCreatureProfiles) {
      const characteristics = body.match(
        /\*\*Characteristics:\*\* STR (\d+); CON (\d+); DEX (\d+); SIZ (\d+); INT (\d+); POW (\d+);/,
      );
      const derived = body.match(
        /\*\*Derived:\*\* HP (\d+); MWL (\d+); PP (\d+);[\s\S]*?Combat Order (\d+)[^;]*;[\s\S]*?DM ([+-](?:0|\d+D\d+))/,
      );
      if (!characteristics || !derived) {
        skipped.push(name);
        continue;
      }

      const [, str, con, dex, siz, int, pow] = characteristics.map(Number);
      const [, hp, mwl, pp, combatOrder, dm] = derived;
      const armour = Object.entries(wornArmourEnc).find(([kind]) =>
        derived[0].toLowerCase().includes(kind),
      );
      const enc = armour?.[1] ?? 0;

      expect(Number(hp), `${name}: HP`).toBe(Math.ceil((siz + con) / 2));
      expect(Number(mwl), `${name}: MWL`).toBe(Math.ceil(Number(hp) / 2));
      expect(Number(pp), `${name}: PP`).toBe(pow);
      expect(Number(combatOrder), `${name}: Combat Order`).toBe(
        Math.floor((dex + int) / 2 + 0.5) - enc,
      );
      expect(dm, `${name}: DM`).toBe(damageModifier(str + siz));
      checked += 1;
    }

    expect(checked).toBe(47);
    expect(skipped.sort()).toEqual(
      [
        'Ancestor Spirit',
        'Disease Spirit',
        'Elemental',
        'Ghost',
        'Golem',
        'Guardian Spirit',
        'Healing Spirit',
        'Magic Spirit',
        'Passion Spirit',
        'Werewolf',
      ].sort(),
    );
  });

  it('limits physical extra-attack packages to the approved four creatures', () => {
    const packages = parsedCreatureProfiles
      .filter(({ body }) => /\b(?:Multiattack|Many Arms|Raking Dive)\b/.test(body))
      .map(({ name }) => name);

    expect(packages).toEqual(['Giant Octopus', 'Dragon', 'Griffin', 'Wyvern']);
    expect(creatureText).toContain('each later attack at `-1P`');
    expect(creatureText).toContain('same or different targets');
    expect(creatureText).toContain('Dodge remains limited to the base Reaction');
    expect(bodyOf('Giant Octopus')).toContain('up to four Arm attacks');
    expect(bodyOf('Dragon')).toContain('Make two Claw attacks');
    expect(bodyOf('Griffin')).toContain('make two Claw attacks');
    expect(bodyOf('Wyvern')).toContain('Make all three attacks');
    for (const attack of ['Bite', 'Claw', 'Sting']) {
      expect(bodyOf('Wyvern')).toContain(attack);
    }
  });

  it('defines creature tags, vision, spirit combat, and undead consistently', () => {
    for (const tag of [
      'Living',
      'Corporeal',
      'Incorporeal',
      'Spirit',
      'Construct',
      'Elemental',
      'Undead',
      'Soulless',
      'Mindless',
      'Anchored',
    ]) {
      expect(creatureText).toMatch(new RegExp(`\\*\\*${tag}\\*\\*`));
    }
    expect(creatureText).toContain('Blind Sight (heat)');
    expect(creatureText).toContain('Blind Sight (living beings)');
    expect(creatureText).not.toContain('Dark Vision');
    expect(creatureText).toContain('Spirit Combat');
    expect(creatureText).toContain("host's existing Combat Order");
    expect(creatureText).toContain('possession refreshes nothing');
    expect(bodyOf('Elemental')).toContain('every other creature within the listed radius');
    for (const name of ['Ghoul', 'Mummy', 'Vampire']) {
      expect(tagsOf(name), name).toContain('Undead');
      expect(tagsOf(name), name).toContain('Soulless');
      expect(tagsOf(name), name).not.toContain('Mindless');
    }
    for (const name of ['Skeleton', 'Zombie']) {
      expect(tagsOf(name), name).toContain('Undead');
      expect(tagsOf(name), name).toContain('Soulless');
      expect(tagsOf(name), name).toContain('Mindless');
    }
    expect(tagsOf('Ghost')).not.toContain('Undead');
    expect(tagsOf('Ghost')).not.toContain('Soulless');
  });

  it('contains no retired systems or publishable markup', () => {
    expect(creatureText).not.toMatch(
      /\b(?:Magnitude|Demoralise|Dark Vision|Folk Magic|Arcane Magic|Divine Magic|Shamanism)\b/,
    );
    expect(creatureText).not.toMatch(/!\[[^\]]*\]\(|<\/?[a-z][^>]*>/i);
  });
});
