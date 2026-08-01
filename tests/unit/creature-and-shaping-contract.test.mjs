import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

const read = (location) => readFileSync(path.resolve(location), 'utf8');

// The compendium remains the drafting source; the chapter under src/content is what ships.
const creaturePath = path.resolve('freeform-creatures/FC-creatures-lite.md');
const creatureText = existsSync(creaturePath) ? readFileSync(creaturePath, 'utf8') : '';
const publishedRoot = path.resolve('src/content/rules/creatures');
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
const sourceBodyOf = (name) => creatureByName.get(name) ?? '';

const publishedRecords = existsSync(publishedRoot)
  ? readdirSync(publishedRoot)
      .filter((file) => file.endsWith('.md'))
      .map((file) => matter(read(path.join(publishedRoot, file))))
      .sort((left, right) => left.data.order - right.data.order)
  : [];
const publishedCreatures = publishedRecords.filter((record) => record.data.type === 'creature');
const creatureRecord = (name) =>
  publishedCreatures.find((record) => record.data.title === name) ?? { data: {}, content: '' };
const bodyOf = (name) => creatureRecord(name).content;
const talentsOf = (name) => creatureRecord(name).data.talents ?? '';
const tagsOf = (name) => creatureRecord(name).data.tags ?? [];
const ruleContent = (slug) =>
  publishedRecords.find((record) => record.data.slug === slug)?.content ?? '';
const publishedText = publishedRecords
  .map(({ data, content }) => `${data.skills?.join('; ') ?? ''} ${data.talents ?? ''} ${content}`)
  .join('\n');

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
    const attributes = read('src/content/rules/characters/character-creation.md');
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
    expect(ranged).toContain('/rules/adventuring/#light-and-darkness');
  });
});

describe('published creature compendium', () => {
  it('publishes the 57 approved profiles and keeps the compendium as their source', () => {
    expect(existsSync(creaturePath)).toBe(true);
    expect(existsSync(publishedRoot)).toBe(true);

    expect(parsedCreatureProfiles.map(({ name }) => name)).toEqual(expectedCreatures);
    expect(publishedCreatures.map((record) => record.data.title)).toEqual(expectedCreatures);
    for (const excluded of ['Centaur', 'Gorgon', 'Hippogriff', 'Lamia', 'Slime', 'Octupus']) {
      expect(publishedCreatures.map((record) => record.data.title)).not.toContain(excluded);
    }

    expect([...new Set(publishedCreatures.map((record) => record.data.category))]).toEqual([
      'animal',
      'monster',
      'nymph',
      'spirit',
      'undead',
    ]);
    expect(
      publishedRecords
        .filter((record) => record.data.type === 'rule')
        .map((record) => record.data.slug),
    ).toEqual([
      'using-creatures',
      'reading-a-profile',
      'creature-tags',
      'creature-talents',
      'multiattack',
      'creature-senses',
      'spirit-combat-and-possession',
      'elemental-shells',
    ]);
  });

  it('gives every published profile a compact, self-contained rules schema', () => {
    for (const { data } of publishedCreatures) {
      const label = data.title;
      expect(data.tags.length, `${label}: tags`).toBeGreaterThan(0);
      expect(data.summary, `${label}: summary`).toBeTruthy();
      expect(data.characteristics, `${label}: characteristics`).toBeTruthy();
      expect(data.derived, `${label}: derived`).toBeTruthy();
      expect(data.skills.length, `${label}: skills`).toBeGreaterThan(0);
      expect(
        (data.attacks?.length ?? 0) + (data.attackNotes?.length ?? 0),
        `${label}: attacks`,
      ).toBeGreaterThan(0);
      expect(data.talents, `${label}: talents`).toBeTruthy();
    }
  });

  it('spells out each creature damage modifier in its attack damage', () => {
    expect(creatureText).not.toMatch(/\+\s*DM\b/);

    for (const { data } of publishedCreatures) {
      expect((data.attacks ?? []).join('\n'), `${data.title}: attacks`).not.toMatch(/\bDM\b/);
    }

    expect(creatureRecord('Mummy').data.attacks.some((attack) => attack.includes('`2D8 + 1D6`'))).toBe(
      true,
    );
    expect(
      creatureRecord('Basilisk').data.attacks.some((attack) =>
        attack.includes('`1D6 - 1D6`'),
      ),
    ).toBe(true);
    expect(creatureRecord('Dwarf').data.attacks.some((attack) => attack.includes('`1D8 + 0`'))).toBe(
      true,
    );
  });

  // The approved Plunder Ratings, converted from the LaTeX creature chapter. Everything that
  // chapter left unrated is an animal, the Elemental, or a spirit, and the chapter states
  // outright that animals carry no treasure by design.
  it('carries the approved Plunder Rating on every profile', () => {
    const approved = {
      'Giant Ant': 0,
      Bear: 0,
      Bull: 0,
      Crocodile: 0,
      Dog: 0,
      Elephant: 0,
      Hawk: 0,
      'Giant Hawk': 0,
      Horse: 0,
      Lion: 0,
      'Giant Lizard': 0,
      'Giant Octopus': 0,
      'Giant Python': 0,
      Raven: 0,
      Rhinoceros: 0,
      'Giant Spider': 0,
      Viper: 0,
      Wolf: 0,
      Basilisk: 5,
      Beastman: 2,
      Dragon: 5,
      Dwarf: 3,
      Elemental: 0,
      Elf: 1,
      Gargoyle: 0,
      Giant: 1,
      Goblin: 1,
      Golem: 0,
      Griffin: 0,
      Harpy: 3,
      Merfolk: 1,
      'Sea Serpent': 3,
      'Holy Steed': 0,
      'Holy Warrior': 0,
      Lizardman: 3,
      Ogre: 1,
      Orc: 2,
      Pixie: 0,
      Troll: 1,
      Werewolf: 0,
      Wyvern: 1,
      Dryad: 1,
      Hag: 3,
      Naiad: 1,
      Oread: 1,
      'Ancestor Spirit': 0,
      'Disease Spirit': 0,
      Ghost: 0,
      'Guardian Spirit': 0,
      'Healing Spirit': 0,
      'Magic Spirit': 0,
      'Passion Spirit': 0,
      Ghoul: 1,
      Mummy: 4,
      Skeleton: 0,
      Vampire: 4,
      Zombie: 0,
    };

    expect(Object.keys(approved)).toEqual(expectedCreatures);
    for (const { data } of publishedCreatures) {
      expect(data.plunder, `${data.title}: plunder`).toBe(approved[data.title]);
    }
    expect(Object.values(approved).filter((rating) => rating > 0)).toHaveLength(22);
  });

  it('carries the approved characteristic dice on every profile that has them', () => {
    const approved = {
      'Ancestor Spirit': { int: '3D6', pow: '3D6+6', cha: '3D6' },
      Basilisk: { str: '2D3', con: '2D6+6', dex: '3D6', siz: '1D3', pow: '1D6+12' },
      Bear: { str: '3D6+15', con: '2D6+6', dex: '3D6', siz: '3D6+15', pow: '3D6' },
      Beastman: {
        str: '2D6+6',
        con: '1D6+12',
        dex: '3D6',
        siz: '1D6+12',
        int: '2D6+6',
        pow: '3D6',
        cha: '2D6',
      },
      Bull: { str: '4D6+6', con: '2D6+9', dex: '2D6', siz: '2D6+9', pow: '2D6' },
      Crocodile: { str: '5D6+12', con: '3D6+12', dex: '3D6', siz: '4D6', pow: '3D6' },
      'Disease Spirit': { int: '2D6', pow: '3D6+6', cha: '3D6' },
      Dog: { str: '2D6+6', con: '3D6', dex: '2D6+6', siz: '1D6', pow: '1D6+6' },
      Dragon: {
        str: '20D6',
        con: '10D6',
        dex: '4D6',
        siz: '10D6+30',
        int: '6D6',
        pow: '4D6+12',
        cha: '6D6',
      },
      Dryad: {
        str: '2D6',
        con: '3D6',
        dex: '4D6',
        siz: '2D6+3',
        int: '3D6+6',
        pow: '2D6+15',
        cha: '2D6+12',
      },
      Dwarf: {
        str: '4D6',
        con: '2D6+12',
        dex: '3D6',
        siz: '1D6+3',
        int: '2D6+6',
        pow: '3D6',
        cha: '3D6',
      },
      Elephant: { str: '6D6+24', con: '3D6+15', dex: '3D6', siz: '6D6+30', pow: '2D6+6' },
      Elf: {
        str: '2D6+3',
        con: '3D6',
        dex: '3D6+6',
        siz: '2D6+3',
        int: '3D6+6',
        pow: '2D6+6',
        cha: '3D6',
      },
      Gargoyle: {
        str: '5D6+12',
        con: '3D6',
        dex: '3D6',
        siz: '5D6',
        int: '1D6',
        pow: '3D6',
        cha: '1D6',
      },
      Ghost: { int: '3D6', pow: '3D6', cha: '3D6' },
      Ghoul: {
        str: '4D6',
        con: '3D6',
        dex: '3D6',
        siz: '2D6+6',
        int: '3D6',
        pow: '3D6',
        cha: '1D6',
      },
      'Giant Ant': { str: '4D6', con: '3D6+6', dex: '2D6+6', siz: '2D6', pow: '1D6+3' },
      'Giant Hawk': { str: '6D6+21', con: '5D6+15', dex: '3D6+9', siz: '6D6+21', pow: '3D6' },
      'Giant Lizard': { str: '2D6+12', con: '3D6', dex: '1D6+12', siz: '2D6+12', pow: '3D6' },
      'Giant Octopus': { str: '12D6', con: '4D6+6', dex: '3D6+12', siz: '12D6', pow: '3D6' },
      'Giant Python': { str: '3D6+24', con: '3D6', dex: '2D6+6', siz: '3D6', pow: '3D6' },
      'Giant Spider': { str: '2D6+12', con: '3D6+6', dex: '2D6+9', siz: '4D6+12', pow: '3D6' },
      Giant: {
        str: '9D6+18',
        con: '6D6+18',
        dex: '2D6+3',
        siz: '9D6+18',
        int: '3D6',
        pow: '3D6',
        cha: '2D6',
      },
      Goblin: {
        str: '2D6+3',
        con: '2D6+3',
        dex: '5D6',
        siz: '2D6',
        int: '3D6',
        pow: '2D6+3',
        cha: '2D6',
      },
      Golem: {
        str: '6D6+18',
        con: '3D6+18',
        dex: '2D6',
        siz: '3D6+18',
        int: '1D6/2D6',
        pow: '1D6/3D6',
        cha: '1D6/2D6',
      },
      Griffin: { str: '8D6', con: '3D6+12', dex: '3D6+12', siz: '8D6', pow: '2D6+6' },
      'Guardian Spirit': { int: '2D6', pow: '3D6+6', cha: '3D6' },
      Hag: {
        str: '6D6',
        con: '3D6',
        dex: '3D6',
        siz: '3D6',
        int: '2D6+12',
        pow: '2D6+21',
        cha: '1D6',
      },
      Harpy: { str: '3D6', con: '3D6', dex: '5D6', siz: '2D6', int: '3D6', pow: '3D6', cha: '1D6' },
      Hawk: { str: '1D3', con: '2D3', dex: '3D6+18', siz: '1D2', pow: '2D6' },
      'Healing Spirit': { int: '2D6', pow: '4D6', cha: '3D6' },
      Horse: { str: '2D6+18', con: '3D6+6', dex: '2D6+3', siz: '2D6+18', pow: '3D6' },
      Lion: { str: '3D6+12', con: '3D6', dex: '3D6+6', siz: '2D6+12', pow: '3D6' },
      Lizardman: {
        str: '3D6+6',
        con: '3D6',
        dex: '2D6+3',
        siz: '3D6',
        int: '2D6+6',
        pow: '3D6',
        cha: '2D6',
      },
      'Magic Spirit': { int: '3D6', pow: '4D6', cha: '1D6' },
      Merfolk: {
        str: '3D6+3',
        con: '3D6',
        dex: '2D6+6',
        siz: '3D6+6',
        int: '3D6',
        pow: '3D6',
        cha: '3D6',
      },
      Mummy: { str: '3D6+12', con: '3D6+12', dex: '2D6', siz: '2D6+6', int: '2D6+6' },
      Naiad: {
        str: '4D6',
        con: '3D6',
        dex: '4D6',
        siz: '2D6+3',
        int: '3D6+6',
        pow: '2D6+18',
        cha: '2D6+12',
      },
      Ogre: {
        str: '3D6+12',
        con: '2D6+6',
        dex: '3D6',
        siz: '3D6+12',
        int: '2D6+3',
        pow: '2D6+3',
        cha: '1D6',
      },
      Orc: {
        str: '4D6',
        con: '3D6',
        dex: '4D6',
        siz: '2D6+3',
        int: '3D6',
        pow: '2D6+3',
        cha: '2D6',
      },
      Oread: {
        str: '2D6',
        con: '3D6+3',
        dex: '3D6+6',
        siz: '2D6+3',
        int: '3D6+3',
        pow: '2D6+15',
        cha: '2D6+9',
      },
      'Passion Spirit': { int: '2D6+3', pow: '3D6+6', cha: '4D6' },
      Pixie: {
        str: '2D3',
        con: '3D6',
        dex: '4D6',
        siz: '1D6',
        int: '3D6',
        pow: '2D6+6',
        cha: '3D6',
      },
      Raven: { str: '1D3', con: '2D3', dex: '3D6+12', siz: '1D2', pow: '2D6' },
      Rhinoceros: { str: '2D6+21', con: '3D6', dex: '2D6', siz: '2D6+21', pow: '3D6' },
      'Sea Serpent': { str: '8D6+30', con: '4D6+21', dex: '2D6', siz: '6D6+15', pow: '6D6' },
      Skeleton: { str: '2D6+6', con: '1D6', dex: '3D6', siz: '3D6' },
      Troll: {
        str: '4D6+12',
        con: '3D6+9',
        dex: '2D6',
        siz: '4D6+12',
        int: '1D6+3',
        pow: '3D6',
        cha: '2D6',
      },
      Vampire: { str: '3D6+12', con: '3D6+12', dex: '3D6', siz: '2D6+6', int: '2D6+6', cha: '3D6' },
      Viper: { str: '2D6+6', con: '2D6', dex: '3D6+18', siz: '2D6', pow: '2D6+6' },
      Werewolf: {
        str: '3D6/6D6',
        con: '3D6',
        dex: '3D6',
        siz: '2D6+6',
        int: '2D6+6/1D6+3',
        pow: '3D6',
        cha: '3D6',
      },
      Wolf: { str: '3D6', con: '3D6+3', dex: '3D6+3', siz: '2D6+3', pow: '3D6' },
      Wyvern: { str: '4D6+12', con: '2D6+12', dex: '2D6+6', siz: '4D6+12', pow: '3D6' },
      Zombie: { str: '3D6+12', con: '1D6', dex: '1D6+3', siz: '3D6', int: '1D3', cha: '1D3' },
    };

    expect(Object.keys(approved).sort()).toEqual(
      publishedCreatures
        .filter(({ data }) => data.characteristicDice)
        .map(({ data }) => data.title)
        .sort(),
    );
    for (const { data } of publishedCreatures) {
      expect(data.characteristicDice ?? null, `${data.title}: dice`).toEqual(
        approved[data.title] ?? null,
      );
    }
    for (const name of ['Elemental', 'Holy Steed', 'Holy Warrior']) {
      expect(creatureRecord(name).data.characteristicDice, name).toBeUndefined();
    }
  });

  it("derives the published Fantasy Races maxima from each creature's own dice", () => {
    const gmTools = read('src/content/rules/gm-tools/fantasy-races.md');
    const maximaSection = gmTools.split('## Racial maxima')[1];
    const racialTop = (formula) => {
      const [, count, sides, modifier] = formula.match(/^(\d+)D(\d+)([+-]\d+)?$/i);
      return Number(count) * Number(sides) + Number(modifier ?? 0) + 3;
    };
    const tableRow = (name) => {
      const row = maximaSection.match(new RegExp(`^\\| ${name}\\s*\\|(.+)\\|\\s*$`, 'm'));
      return row[1]
        .split('|')
        .map((cell) => cell.trim())
        .filter(Boolean)
        .map(Number);
    };

    for (const name of ['Elf', 'Dwarf']) {
      const dice = creatureRecord(name).data.characteristicDice;
      const computed = ['str', 'con', 'dex', 'siz', 'int', 'pow', 'cha'].map((key) =>
        racialTop(dice[key]),
      );
      expect(tableRow(name), name).toEqual(computed);
    }
  });

  it('keeps every published value traceable to the compendium', () => {
    const flatten = (value) => String(value).replace(/\s+/g, ' ').trim();

    for (const { data, content } of publishedCreatures) {
      const source = flatten(sourceBodyOf(data.title));
      const traces = [
        data.summary,
        data.talents,
        ...data.tags.map((tag) => tag[0].toUpperCase() + tag.slice(1)),
        ...data.skills,
        ...(data.attacks ?? []),
        ...(data.attackNotes ?? []),
        ...content
          .split(/\n\n+/)
          .map((paragraph) => paragraph.trim())
          .filter((paragraph) => paragraph && !paragraph.startsWith('|')),
      ];

      for (const trace of traces) {
        expect(source, `${data.title}: ${trace}`).toContain(flatten(trace));
      }
    }
  });

  it('caps skills at 100% and preserves exceptional competence through Mastery', () => {
    const published = publishedCreatures
      .map(({ data, content }) => `${data.skills.join('; ')} ${data.talents} ${content}`)
      .join('\n');
    const percentages = [...published.matchAll(/\b(\d{1,3})%/g)].map((match) => Number(match[1]));
    expect(percentages.length).toBeGreaterThan(50);
    expect(Math.max(...percentages)).toBeLessThanOrEqual(100);

    expect(
      publishedCreatures
        .filter(({ data, content }) => `${data.talents}${content}`.includes('Mastery ('))
        .map(({ data }) => data.title),
    ).toEqual(['Dragon', 'Elemental', 'Holy Steed', 'Holy Warrior', 'Hag']);

    expect(talentsOf('Dragon')).toBe(
      'Mastery (Persistence) III; Mastery (Influence) II; Mastery (Resilience) I; Mastery (Athletics) I; Mastery (Perception) I; Mastery (Unarmed Combat) I',
    );
    expect(talentsOf('Elemental')).toBe(
      'Small: Mastery (Dodge) I. Large: Mastery (Attack) I. Huge: Mastery (Persistence) I. Medium: none',
    );
    expect(talentsOf('Holy Steed')).toBe(
      'Mastery (Dodge) I; Mastery (Persistence) I; Mastery (Resilience) I',
    );
    expect(talentsOf('Holy Warrior')).toBe(
      'Mastery (Dodge) II; Mastery (chosen combat skill) II; Mastery (Resilience) I; Mastery (Athletics) I',
    );
    expect(talentsOf('Hag')).toBe('Mastery (Deception) I');
  });

  it('uses the standard HP, MWL, PP, DM, and Combat Order formulas for fixed profiles', () => {
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
    const fixedNumber = (value) =>
      typeof value === 'number' ? value : Number(String(value).match(/^\d+/)?.[0] ?? NaN);
    let checked = 0;
    const skipped = [];

    for (const { data } of publishedCreatures) {
      const { title: name, characteristics, derived } = data;
      const characteristicValues = ['str', 'con', 'dex', 'siz', 'int', 'pow'].map((key) =>
        typeof characteristics === 'string' ? NaN : characteristics[key],
      );
      const combatOrder = typeof derived === 'string' ? NaN : fixedNumber(derived.combatOrder);
      const fixed =
        typeof derived !== 'string' &&
        characteristicValues.every((value) => typeof value === 'number') &&
        ['hp', 'mwl', 'pp'].every((key) => typeof derived[key] === 'number') &&
        /^[+-](?:0|\d+D\d+)$/.test(String(derived.dm)) &&
        Number.isInteger(combatOrder);
      if (!fixed) {
        skipped.push(name);
        continue;
      }

      const [str, con, dex, siz, int, pow] = characteristicValues;
      const armour = Object.entries(wornArmourEnc).find(([kind]) =>
        `${derived.ap} ${derived.combatOrder}`.toLowerCase().includes(kind),
      );
      const enc = armour?.[1] ?? 0;

      expect(derived.hp, `${name}: HP`).toBe(Math.ceil((siz + con) / 2));
      expect(derived.mwl, `${name}: MWL`).toBe(Math.ceil(derived.hp / 2));
      expect(derived.pp, `${name}: PP`).toBe(pow);
      expect(combatOrder, `${name}: Combat Order`).toBe(Math.floor((dex + int) / 2 + 0.5) - enc);
      expect(derived.dm, `${name}: DM`).toBe(damageModifier(str + siz));
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
    const packages = publishedCreatures
      .filter(({ content }) => /\b(?:Multiattack|Many Arms|Raking Dive)\b/.test(content))
      .map(({ data }) => data.title);
    const multiattack = ruleContent('multiattack');

    expect(packages).toEqual(['Giant Octopus', 'Dragon', 'Griffin', 'Wyvern']);
    expect(multiattack).toContain('each later attack at `-1P`');
    expect(multiattack).toContain('same or different targets');
    expect(multiattack).toContain('Dodge remains limited to the base Reaction');
    expect(bodyOf('Giant Octopus')).toContain('up to four Arm attacks');
    expect(bodyOf('Dragon')).toContain('Make two Claw attacks');
    expect(bodyOf('Griffin')).toContain('make two Claw attacks');
    expect(bodyOf('Wyvern')).toContain('Make all three attacks');
    for (const attack of ['Bite', 'Claw', 'Sting']) {
      expect(bodyOf('Wyvern')).toContain(attack);
    }
  });

  it('defines creature tags, vision, spirit combat, and undead consistently', () => {
    const glossary = ruleContent('creature-tags');
    const senses = ruleContent('creature-senses');
    const spirits = ruleContent('spirit-combat-and-possession');

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
      expect(glossary, tag).toMatch(new RegExp(`\\*\\*${tag}\\*\\*`));
    }
    expect(publishedText).toContain('Blind Sight (heat)');
    expect(publishedText).toContain('Blind Sight (living beings)');
    expect(publishedText).not.toContain('Dark Vision');
    expect(senses).toContain('Spirit Sense');
    expect(spirits).toContain('Spirit Combat');
    expect(spirits).toContain("host's existing Combat Order");
    expect(spirits).toContain('possession refreshes nothing');
    expect(creatureRecord('Elemental').data.attacks.join(' ')).toContain(
      'every other creature within the listed radius',
    );
    for (const name of ['Ghoul', 'Mummy', 'Vampire']) {
      expect(tagsOf(name), name).toContain('undead');
      expect(tagsOf(name), name).toContain('soulless');
      expect(tagsOf(name), name).not.toContain('mindless');
    }
    for (const name of ['Skeleton', 'Zombie']) {
      expect(tagsOf(name), name).toContain('undead');
      expect(tagsOf(name), name).toContain('soulless');
      expect(tagsOf(name), name).toContain('mindless');
    }
    expect(tagsOf('Ghost')).not.toContain('undead');
    expect(tagsOf('Ghost')).not.toContain('soulless');
  });

  it('contains no retired systems, draft framing, or publishable markup', () => {
    for (const text of [creatureText, publishedText]) {
      expect(text).not.toMatch(
        /\b(?:Magnitude|Demoralise|Dark Vision|Folk Magic|Arcane Magic|Divine Magic|Shamanism)\b/,
      );
      expect(text).not.toMatch(/!\[[^\]]*\]\(|<\/?[a-z][^>]*>/i);
    }
    expect(publishedText).not.toContain('It is not part of the website yet');
  });
});
