import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve('.');
const resolve = (...parts) => path.join(root, ...parts);
const readJson = (location) => JSON.parse(readFileSync(resolve(location), 'utf8'));
const sha256 = (location) =>
  createHash('sha256')
    .update(readFileSync(resolve(location)))
    .digest('hex');
const walk = (directory) =>
  readdirSync(resolve(directory), { withFileTypes: true }).flatMap((entry) => {
    const relative = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(relative) : [relative.split(path.sep).join('/')];
  });

const styleIds = [
  'inked-adventure-comic-vivid',
  'more-naturalistic',
  'watercolor-storybook',
  'cinematic-graphic-novel',
  'animated-fantasy-feature',
];

describe('canonical art library', () => {
  it('stores five reusable style systems with exactly one anchor each', () => {
    for (const styleId of styleIds) {
      expect(existsSync(resolve(`art/library/styles/${styleId}/STYLE.md`))).toBe(true);
      expect(existsSync(resolve(`art/library/styles/${styleId}/anchor.png`))).toBe(true);
    }
    expect(existsSync(resolve('src/assets/images/styles'))).toBe(false);
  });

  it('uses one creature registry and 57 canonical masters', () => {
    const registry = readJson('art/library/subjects/creatures/pose-registry.json');
    const content = readJson('art/library/subjects/creatures/content-manifest.json');
    const website = readJson('src/assets/images/creatures/manifest.json');
    const masterRoot = 'art/library/subjects/creatures/styles/inked-adventure-comic-vivid';
    const masters = walk(masterRoot).filter((file) => file.endsWith('.png'));

    expect(registry.count).toBe(57);
    expect(registry.creatures).toHaveLength(57);
    expect(masters).toHaveLength(57);
    expect(content.count).toBe(57);
    expect(website.count).toBe(57);
    expect(new Set(registry.creatures.map((creature) => creature.slug)).size).toBe(57);

    for (const creature of registry.creatures) {
      const contentCreature = content.creatures.find((item) => item.slug === creature.slug);
      const websiteCreature = website.assets.find((item) => item.slug === creature.slug);
      expect(creature.master).toBe(`${masterRoot}/${creature.slug}.png`);
      expect(sha256(creature.master)).toBe(creature.masterSha256);
      expect(contentCreature.poseBrief).toBe(creature.poseBrief);
      expect(contentCreature.styleImages['inked-adventure-comic-vivid']).toBe(creature.master);
      expect(websiteCreature.source).toBe(creature.master);
      expect(websiteCreature.sourceSha256).toBe(creature.masterSha256);
      expect(sha256(websiteCreature.website)).toBe(websiteCreature.websiteSha256);
      expect(sha256(websiteCreature.website320)).toBe(websiteCreature.website320Sha256);
    }
  });

  it('catalogs the homepage, chapter art, creatures, cast, and derivatives', () => {
    const catalog = readJson('art/library/catalog.json');
    expect(catalog.activeStyleId).toBe('inked-adventure-comic-vivid');
    expect(catalog.styles).toHaveLength(5);
    expect(catalog.homepage.master).toBe(
      'art/library/subjects/home-hero/styles/inked-adventure-comic-vivid.png',
    );
    expect(catalog.homepage.exports).toHaveLength(2);
    expect(catalog.chapters).toHaveLength(28);
    expect(catalog.creatures).toHaveLength(57);
    expect(catalog.cast).toHaveLength(4);

    for (const collection of [[catalog.homepage], catalog.chapters, catalog.creatures]) {
      for (const asset of collection) {
        expect(existsSync(resolve(asset.master)), asset.master).toBe(true);
        expect(sha256(asset.master)).toBe(asset.masterSha256);
        for (const output of asset.exports) {
          expect(existsSync(resolve(output.path)), output.path).toBe(true);
          expect(sha256(output.path)).toBe(output.sha256);
        }
      }
    }
  });

  it('contains no approved or rejected raster candidates and no live legacy production tree', () => {
    const reviewPngs = existsSync(resolve('art/review'))
      ? walk('art/review').filter((file) => file.endsWith('.png'))
      : [];
    expect(reviewPngs).toEqual([]);
    expect(existsSync(resolve('art/production'))).toBe(false);
    expect(existsSync(resolve('art/creatures'))).toBe(false);
    expect(existsSync(resolve('art/style-studies'))).toBe(false);
    expect(existsSync(resolve('art/art-direction'))).toBe(false);
    expect(walk('art/archive').some((file) => /\.(png|webp)$/i.test(file))).toBe(false);
  });

  it('does not retain exact duplicate full-resolution PNGs', () => {
    const pngs = walk('art/library').filter((file) => file.endsWith('.png'));
    const seen = new Map();
    for (const png of pngs) {
      const hash = sha256(png);
      expect(seen.get(hash), `${png} duplicates ${seen.get(hash)}`).toBeUndefined();
      seen.set(hash, png);
      expect(statSync(resolve(png)).size).toBeGreaterThan(0);
    }
  });
});
