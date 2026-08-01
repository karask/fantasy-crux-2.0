import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { format } from 'prettier';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const generatedOn = '2026-08-01';
const activeStyleId = 'inked-adventure-comic-vivid';
const styleIds = [
  activeStyleId,
  'more-naturalistic',
  'watercolor-storybook',
  'cinematic-graphic-novel',
  'animated-fantasy-feature',
];

const fromRoot = (location) => path.join(root, ...location.split('/'));
const readJson = (location) => JSON.parse(readFileSync(fromRoot(location), 'utf8'));
const writeJson = async (location, value) => {
  const destination = fromRoot(location);
  mkdirSync(path.dirname(destination), { recursive: true });
  writeFileSync(
    destination,
    await format(JSON.stringify(value), { parser: 'json', printWidth: 100 }),
    'utf8',
  );
};
const sha256 = (location) =>
  createHash('sha256')
    .update(readFileSync(fromRoot(location)))
    .digest('hex');
const uint24le = (buffer, offset) =>
  buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
const imageSize = (location) => {
  const buffer = readFileSync(fromRoot(location));
  if (buffer.subarray(1, 4).toString('ascii') === 'PNG') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (
    buffer.subarray(0, 4).toString('ascii') !== 'RIFF' ||
    buffer.subarray(8, 12).toString('ascii') !== 'WEBP'
  ) {
    throw new Error(`Unsupported image format: ${location}`);
  }
  const chunk = buffer.subarray(12, 16).toString('ascii');
  if (chunk === 'VP8X') {
    return { width: uint24le(buffer, 24) + 1, height: uint24le(buffer, 27) + 1 };
  }
  if (chunk === 'VP8 ') {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === 'VP8L') {
    const b1 = buffer[21];
    const b2 = buffer[22];
    const b3 = buffer[23];
    const b4 = buffer[24];
    return {
      width: 1 + b1 + ((b2 & 0x3f) << 8),
      height: 1 + (b2 >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10),
    };
  }
  throw new Error(`Unsupported WebP chunk ${chunk}: ${location}`);
};
const imageRecord = (location) => ({
  path: location,
  sha256: sha256(location),
  ...imageSize(location),
});

const poseRegistryPath = 'art/library/subjects/creatures/pose-registry.json';
const creatureContentPath = 'art/library/subjects/creatures/content-manifest.json';
const creatureWebsitePath = 'src/assets/images/creatures/manifest.json';
const chapterProgramPath = 'art/library/chapters/illustration-program.json';
const homeSubjectPath = 'art/library/subjects/home-hero/subject.json';
const catalogPath = 'art/library/catalog.json';

const poseRegistry = readJson(poseRegistryPath);
const chapterProgram = readJson(chapterProgramPath);
const homeSubject = readJson(homeSubjectPath);

const creatures = poseRegistry.creatures.map((creature) => {
  const parsed = matter(readFileSync(fromRoot(creature.sourceProfile), 'utf8'));
  const data = parsed.data;
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    category: data.category,
    summary: data.summary,
    imageAlt: data.imageAlt,
    poseBrief: creature.poseBrief,
    tags: data.tags ?? [],
    statistics: {
      characteristics: data.characteristics ?? {},
      characteristicDice: data.characteristicDice ?? {},
      derived: data.derived ?? {},
      skills: data.skills ?? [],
      attacks: data.attacks ?? [],
      talents: data.talents ?? null,
      plunder: data.plunder ?? null,
    },
    rulesAndAbilitiesMarkdown:
      parsed.content.trim() ||
      'No additional rules or abilities beyond the listed statistics, skills, attacks, talents, and tags.',
    sourceProfile: creature.sourceProfile,
    styleImages: { [activeStyleId]: creature.master },
  };
});

await writeJson(creatureContentPath, {
  schemaVersion: 1,
  generatedOn,
  purpose:
    'Style-independent creature content blueprints. Combine one record with one art/library/styles/*/STYLE.md brief to recreate its illustration.',
  generationRecipe: [
    'Treat the creature record as the only source of identity, anatomy, temperament, equipment, environment, action, pose, and rules-derived visual cues.',
    'Use summary, imageAlt, poseBrief, statistics, and rulesAndAbilitiesMarkdown together; preserve unusually high or low characteristics and visible abilities.',
    'Treat STYLE.md and its anchor as rendering-only references; do not inherit the anchor subject, composition, palette, lighting, weather, or mood.',
    'Keep anatomy coherent and preserve the varied poseBrief rather than defaulting bipedal creatures to one repeated stance.',
  ],
  styleIds: [activeStyleId],
  count: creatures.length,
  creatures,
});

const websiteAssets = poseRegistry.creatures.map((creature) => {
  const website = `src/assets/images/creatures/${creature.slug}.webp`;
  const website320 = `src/assets/images/creatures/${creature.slug}-320.webp`;
  return {
    slug: creature.slug,
    title: creature.title,
    source: creature.master,
    sourceSha256: creature.masterSha256,
    website,
    websiteSha256: sha256(website),
    website320,
    website320Sha256: sha256(website320),
  };
});

await writeJson(creatureWebsitePath, {
  schemaVersion: 1,
  style: activeStyleId,
  generatedOn,
  sourceManifest: poseRegistryPath,
  count: websiteAssets.length,
  resizePolicy: {
    master: 'lossless PNG retained in the canonical art library',
    website: '640x640 WebP, quality 86',
    website320: '320x320 WebP, quality 83',
    fit: 'centered square crop with Lanczos resampling',
  },
  assets: websiteAssets,
});

const catalog = {
  schemaVersion: 1,
  generatedOn,
  activeStyleId,
  purpose:
    'Canonical index of reusable art masters, content sources, style references, and published website derivatives.',
  styles: styleIds.map((id) => ({
    id,
    active: id === activeStyleId,
    brief: `art/library/styles/${id}/STYLE.md`,
    anchor: `art/library/styles/${id}/anchor.png`,
    anchorSha256: sha256(`art/library/styles/${id}/anchor.png`),
  })),
  homepage: {
    id: homeSubject.id,
    title: homeSubject.title,
    content: homeSubjectPath,
    master: homeSubject.master,
    masterSha256: sha256(homeSubject.master),
    ...imageSize(homeSubject.master),
    exports: homeSubject.exports.map(imageRecord),
  },
  chapters: chapterProgram.subjects.map((subject) => {
    const master = `art/library/subjects/${subject.id}/styles/${activeStyleId}.png`;
    return {
      id: subject.id,
      chapter: subject.chapter,
      content: `art/library/subjects/${subject.id}/CONTENT.md`,
      master,
      masterSha256: sha256(master),
      ...imageSize(master),
      exports: [
        imageRecord(`src/assets/images/chapter-art/${subject.asset}.webp`),
        imageRecord(`src/assets/images/chapter-art/${subject.asset}-480.webp`),
      ],
    };
  }),
  creatures: poseRegistry.creatures.map((creature) => ({
    slug: creature.slug,
    content: creature.sourceProfile,
    poseBrief: creature.poseBrief,
    master: creature.master,
    masterSha256: creature.masterSha256,
    ...imageSize(creature.master),
    exports: [
      imageRecord(`src/assets/images/creatures/${creature.slug}.webp`),
      imageRecord(`src/assets/images/creatures/${creature.slug}-320.webp`),
    ],
  })),
  cast: Object.entries(chapterProgram.cast).map(([id, character]) => ({
    id,
    profile: `art/library/cast/${id}/PROFILE.md`,
    anchor: character.anchor,
    anchorSha256: sha256(character.anchor),
  })),
};

await writeJson(catalogPath, catalog);
console.log(
  `Wrote ${creatures.length} creature blueprints, ${websiteAssets.length} website records, and ${catalog.chapters.length + catalog.creatures.length + 1} cataloged subjects.`,
);
