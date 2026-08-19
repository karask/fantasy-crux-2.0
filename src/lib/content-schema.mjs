import { z } from 'zod';

const immutableId = z.string().regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/, 'Use a stable lowercase ID.');
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase URL slug.');
const summary = z.union([z.string().trim().min(1), z.array(z.string().trim().min(1)).min(1)]);
const aliases = z.array(z.string().trim().min(1)).min(1).optional();
const legacySlugs = z
  .array(slug)
  .min(1)
  .refine((values) => new Set(values).size === values.length, 'Legacy slugs must be unique.')
  .optional();
const order = z.number().int().nonnegative();

export const chapterIds = [
  'start-here',
  'characters',
  'skills',
  'equipment',
  'combat',
  'adventuring',
  'talents',
  'magic',
  'gm-tools',
  'creatures',
];

const chapterId = z.enum(chapterIds);
export const creatureCategories = ['animal', 'monster', 'nymph', 'spirit', 'undead'];

export const creatureTags = [
  'living',
  'corporeal',
  'incorporeal',
  'spirit',
  'construct',
  'elemental',
  'undead',
  'soulless',
  'mindless',
  'anchored',
];

export const talentTags = [
  'awareness',
  'close',
  'craft',
  'defence',
  'healing',
  'magic',
  'mobility',
  'offence',
  'ranged',
  'shield',
  'social',
  'stealth',
  'survival',
  'training',
  'unarmed',
];

const chapterSchema = z
  .object({
    type: z.literal('chapter'),
    id: chapterId,
    title: z.string().trim().min(1),
    order,
    summary,
    legacySlugs,
  })
  .strict();

const sharedRuleFields = {
  id: immutableId,
  chapter: chapterId,
  title: z.string().trim().min(1),
  slug,
  order,
  summary,
  aliases,
  legacySlugs,
};

const excludesCanonicalSlug = (record) => !record.legacySlugs?.includes(record.slug);

const ruleSchema = z
  .object({
    type: z.literal('rule'),
    ...sharedRuleFields,
  })
  .strict()
  .refine(excludesCanonicalSlug, {
    message: 'A canonical slug cannot also be a legacy slug.',
    path: ['legacySlugs'],
  });

const talentSchema = z
  .object({
    type: z.literal('talent'),
    ...sharedRuleFields,
    chapter: z.literal('talents'),
    cost: z.number().int().min(1).max(20),
    prerequisites: z.union([z.string().trim().min(1), z.array(z.string().trim().min(1)).min(1)]),
    activation: z.string().trim().min(1),
    tags: z.array(z.enum(talentTags)).min(1),
  })
  .strict()
  .refine(excludesCanonicalSlug, {
    message: 'A canonical slug cannot also be a legacy slug.',
    path: ['legacySlugs'],
  });

// A stat entry is a number where the compendium gives one, and prose where it qualifies the
// value ('4 or 7 free-willed') or withholds it entirely ('—').
const statValue = z.union([z.number().int(), z.string().trim().min(1)]);
const statNote = z.string().trim().min(1);
const statLine = z.array(statNote).min(1);
const statBlock = (keys) =>
  z.union([
    z.object(Object.fromEntries(keys.map((key) => [key, statValue]))).strict(),
    z.string().trim().min(1),
  ]);

// The dice a creature's characteristics were generated from, e.g. '4D6' or '10D6+30'. A dual
// form such as '3D6/6D6' covers a creature with two states (Golem's programmed/free-willed,
// Werewolf's human/wolf); only characteristics that actually vary carry an entry here — a fixed
// value (a summoned being, or an undead's 0 POW) has nothing to roll and is simply omitted.
const diceFormula = z
  .string()
  .regex(
    /^\d+D\d+(?:[+-]\d+)?(?:\/\d+D\d+(?:[+-]\d+)?)?$/i,
    'Use a dice formula like 4D6, 10D6+30, or 3D6/6D6.',
  );
const characteristicDice = z
  .object({
    str: diceFormula.optional(),
    con: diceFormula.optional(),
    dex: diceFormula.optional(),
    siz: diceFormula.optional(),
    int: diceFormula.optional(),
    pow: diceFormula.optional(),
    cha: diceFormula.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, 'List at least one characteristic die.');

const creatureSchema = z
  .object({
    type: z.literal('creature'),
    ...sharedRuleFields,
    chapter: z.literal('creatures'),
    category: z.enum(creatureCategories),
    tags: z.array(z.enum(creatureTags)).min(1),
    tagNote: statNote.optional(),
    plunder: z.number().int().min(0).max(6),
    characteristics: statBlock(['str', 'con', 'dex', 'siz', 'int', 'pow', 'cha']),
    characteristicDice: characteristicDice.optional(),
    derived: statBlock(['hp', 'mwl', 'pp', 'movement', 'combatOrder', 'ap', 'dm']),
    derivedNotes: statLine.optional(),
    skills: statLine,
    skillNote: statNote.optional(),
    attacks: statLine.optional(),
    attackNotes: statLine.optional(),
    talents: statNote,
    image: z.string().trim().min(1).optional(),
    image320: z.string().trim().min(1).optional(),
    imageAlt: z.string().trim().min(1).optional(),
  })
  .strict()
  .refine((value) => Boolean(value.attacks?.length || value.attackNotes?.length), {
    message: 'A creature needs at least one attack or an attack note.',
    path: ['attacks'],
  })
  .refine(
    (value) => {
      const imageFields = [value.image, value.image320, value.imageAlt];
      return imageFields.every(Boolean) || imageFields.every((field) => field === undefined);
    },
    {
      message: 'Creature artwork requires image, image320, and imageAlt together.',
      path: ['image'],
    },
  )
  .refine(excludesCanonicalSlug, {
    message: 'A canonical slug cannot also be a legacy slug.',
    path: ['legacySlugs'],
  });

export const contentRecordSchema = z.discriminatedUnion('type', [
  chapterSchema,
  ruleSchema,
  talentSchema,
  creatureSchema,
]);

export function validateRecord(record) {
  return contentRecordSchema.parse(record);
}

export function permalinkFor(record) {
  const value = validateRecord(record);

  if (value.type === 'chapter') {
    return `/rules/${value.id}/`;
  }

  return `/rules/${value.chapter}/#${value.slug}`;
}

export function urlsFor(record) {
  const value = validateRecord(record);
  const canonical = permalinkFor(value);
  const chapter = value.type === 'chapter' ? value.id : value.chapter;
  return [
    canonical,
    ...(value.legacySlugs ?? []).map((legacySlug) => `/rules/${chapter}/#${legacySlug}`),
  ];
}
