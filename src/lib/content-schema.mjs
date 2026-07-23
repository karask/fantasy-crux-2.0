import { z } from 'zod';

const immutableId = z.string().regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/, 'Use a stable lowercase ID.');
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase URL slug.');
const summary = z.union([z.string().trim().min(1), z.array(z.string().trim().min(1)).min(1)]);
const aliases = z.array(z.string().trim().min(1)).min(1).optional();
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
const quickReference = z
  .object({
    group: z.enum([
      'core',
      'characters',
      'skills',
      'equipment',
      'combat',
      'adventuring',
      'talents',
      'magic',
      'gm-tools',
    ]),
    order,
  })
  .strict();

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
  'defence',
  'mobility',
  'offence',
  'ranged',
  'shield',
  'unarmed',
];

const chapterSchema = z
  .object({
    type: z.literal('chapter'),
    id: chapterId,
    title: z.string().trim().min(1),
    order,
    summary,
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
  quickReference: quickReference.optional(),
};

const ruleSchema = z
  .object({
    type: z.literal('rule'),
    ...sharedRuleFields,
  })
  .strict();

const talentSchema = z
  .object({
    type: z.literal('talent'),
    ...sharedRuleFields,
    chapter: z.literal('talents'),
    cost: z.number().int().min(1).max(10),
    prerequisites: z.union([z.string().trim().min(1), z.array(z.string().trim().min(1)).min(1)]),
    activation: z.string().trim().min(1),
    tags: z.array(z.enum(talentTags)).min(1),
  })
  .strict();

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
    derived: statBlock(['hp', 'mwl', 'pp', 'movement', 'combatOrder', 'ap', 'dm']),
    derivedNotes: statLine.optional(),
    skills: statLine,
    skillNote: statNote.optional(),
    attacks: statLine.optional(),
    attackNotes: statLine.optional(),
    talents: statNote,
    image: z.string().trim().min(1).optional(),
  })
  .strict()
  .refine((value) => Boolean(value.attacks?.length || value.attackNotes?.length), {
    message: 'A creature needs at least one attack or an attack note.',
    path: ['attacks'],
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
