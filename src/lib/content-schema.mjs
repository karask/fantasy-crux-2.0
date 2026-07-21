import { z } from 'zod';

const immutableId = z
  .string()
  .regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/, 'Use a stable lowercase ID.');
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase URL slug.');
const summary = z.union([
  z.string().trim().min(1),
  z.array(z.string().trim().min(1)).min(1),
]);
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
    ]),
    order,
  })
  .strict();

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
    prerequisites: z.union([
      z.string().trim().min(1),
      z.array(z.string().trim().min(1)).min(1),
    ]),
    activation: z.string().trim().min(1),
    tags: z.array(z.enum(talentTags)).min(1),
  })
  .strict();

export const contentRecordSchema = z.discriminatedUnion('type', [
  chapterSchema,
  ruleSchema,
  talentSchema,
]);

export function validateRecord(record) {
  return contentRecordSchema.parse(record);
}

export function permalinkFor(record) {
  const value = validateRecord(record);

  if (value.type === 'chapter') {
    return `/rules/${value.id}/`;
  }

  return `/rules/${value.chapter}/${value.slug}/`;
}
