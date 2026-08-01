import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import site from '../../src/_data/site.mjs';

const read = (location) => readFileSync(path.resolve(location), 'utf8');
const sha256 = (location) =>
  createHash('sha256')
    .update(readFileSync(path.resolve(location)))
    .digest('hex');

const homepagePath = 'src/index.njk';
const homeSubjectPath = 'art/library/subjects/home-hero/subject.json';
const creatureManifestPath = 'src/assets/images/creatures/manifest.json';
const creatureContentManifestPath = 'art/library/subjects/creatures/content-manifest.json';
const chapterArtProgramPath = 'art/library/chapters/illustration-program.json';
const styleIds = [
  'inked-adventure-comic-vivid',
  'more-naturalistic',
  'watercolor-storybook',
  'cinematic-graphic-novel',
  'animated-fantasy-feature',
];
describe('website art integration', () => {
  it('uses selected homepage variant A as the opening image and removes the old rules-stat hero', () => {
    const homepage = read(homepagePath);
    const selection = JSON.parse(read(homeSubjectPath));

    expect(selection.selectedVariant).toBe('A');
    expect(selection.activeStyleId).toBe('inked-adventure-comic-vivid');
    expect(selection.master).toBe(
      'art/library/subjects/home-hero/styles/inked-adventure-comic-vivid.png',
    );
    expect(homepage).toContain('class="home-hero-art"');
    expect(homepage).toContain('/assets/images/home/index-tower-hero.webp');
    expect(homepage).toContain('/assets/images/home/index-tower-hero-960.webp 960w');
    expect(homepage).toContain('width="1672"');
    expect(homepage).toContain('height="941"');
    expect(homepage).toMatch(
      /<h1[^>]*>\s*Roll under\. Read the situation\. Live with the consequence\.\s*<\/h1>/,
    );
    expect(homepage).toMatch(/<\/section>\s*<section class="chapter-directory"/);
    expect(homepage).not.toContain('hero-copy');
    expect(homepage).not.toContain('hero-principles');
    expect(homepage).not.toContain('home-start');
    expect(homepage).not.toContain('<dt>D100</dt>');
    expect(homepage).not.toContain('<dt>1 + 1 + 1</dt>');
  });

  it('publishes every creature from the vivid Inked Adventure Comic source set', () => {
    expect(existsSync(path.resolve(creatureManifestPath)), creatureManifestPath).toBe(true);
    const manifest = JSON.parse(read(creatureManifestPath));

    expect(manifest.style).toBe('inked-adventure-comic-vivid');
    expect(manifest.count).toBe(57);
    expect(manifest.assets).toHaveLength(57);
    expect(new Set(manifest.assets.map((asset) => asset.slug)).size).toBe(57);

    for (const asset of manifest.assets) {
      expect(existsSync(path.resolve(asset.source)), `${asset.slug}: vivid source`).toBe(true);
      expect(existsSync(path.resolve(asset.website)), `${asset.slug}: 640px website image`).toBe(
        true,
      );
      expect(existsSync(path.resolve(asset.website320)), `${asset.slug}: 320px website image`).toBe(
        true,
      );
      expect(asset.websiteSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(asset.website320Sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(sha256(asset.website), `${asset.slug}: 640px hash`).toBe(asset.websiteSha256);
      expect(sha256(asset.website320), `${asset.slug}: 320px hash`).toBe(asset.website320Sha256);
    }
  });

  it('publishes only Vivid Ink artwork and exposes no art-style selector', () => {
    expect(site.artStyles).toBeUndefined();
    expect(existsSync(path.resolve('src/assets/images/styles'))).toBe(false);

    for (const template of [
      homepagePath,
      'src/_includes/layouts/base.njk',
      'src/_includes/partials/chapter-art.njk',
      'src/_includes/partials/creature-profile.njk',
    ]) {
      expect(read(template), template).not.toMatch(/data-art-|assets\/images\/styles/);
    }

    expect(read('src/assets/js/site.js')).not.toContain('enhanceArtStyleSelector');
    expect(read('src/assets/css/site.css')).not.toContain('.art-style-picker');
  });

  it('keeps reusable style briefs and complete creature content blueprints in one art library', () => {
    expect(existsSync(path.resolve('art/library/README.md'))).toBe(true);

    for (const styleId of styleIds) {
      const styleBrief = `art/library/styles/${styleId}/STYLE.md`;
      expect(existsSync(path.resolve(styleBrief)), styleBrief).toBe(true);
      const brief = read(styleBrief);
      expect(brief).toContain('Brushwork');
      expect(brief).toContain('Edge handling');
      expect(brief).toContain('Shape simplification');
      expect(brief).toContain('Detail density');
      expect(brief).toContain('Material rendering');
    }

    const creatures = JSON.parse(read(creatureContentManifestPath));
    expect(creatures.count).toBe(57);
    expect(creatures.creatures).toHaveLength(57);
    expect(new Set(creatures.creatures.map((creature) => creature.slug)).size).toBe(57);

    for (const creature of creatures.creatures) {
      expect(creature.summary).toBeTruthy();
      expect(creature.imageAlt).toBeTruthy();
      expect(creature.poseBrief).toBeTruthy();
      expect(creature.statistics.characteristics).toBeTruthy();
      expect(creature.rulesAndAbilitiesMarkdown).toBeTruthy();
      expect(creature.styleImages['inked-adventure-comic-vivid']).toBeTruthy();
      expect(existsSync(path.resolve(creature.styleImages['inked-adventure-comic-vivid']))).toBe(
        true,
      );
    }
  });

  it('stores and publishes every chapter-art subject in Vivid Ink', () => {
    expect(existsSync(path.resolve(chapterArtProgramPath)), chapterArtProgramPath).toBe(true);
    const program = JSON.parse(read(chapterArtProgramPath));

    expect(program.subjectCount).toBe(28);
    expect(program.newSubjectCount).toBe(24);
    expect(program.chapterCounts).toEqual({
      'start-here': 2,
      characters: 2,
      skills: 2,
      equipment: 2,
      combat: 3,
      talents: 3,
      magic: 4,
      adventuring: 2,
      'gm-tools': 3,
      creatures: 3,
      license: 2,
    });
    expect(new Set(program.subjects.map((subject) => subject.id)).size).toBe(28);

    const licenseMarkdown = readFileSync(path.resolve('src/license.md'), 'utf8');
    const licenseSubjects = program.subjects.filter((subject) => subject.chapter === 'license');
    for (const subject of licenseSubjects) {
      expect(subject.pageTarget).toBeTruthy();
      expect(licenseMarkdown).toMatch(new RegExp(`^#{2,6}\\s+.*\\{#${subject.pageTarget}\\}`, 'm'));
    }

    for (const subject of program.subjects) {
      const contentBrief = `art/library/subjects/${subject.id}/CONTENT.md`;
      expect(existsSync(path.resolve(contentBrief)), contentBrief).toBe(true);
      expect(read(contentBrief)).toContain('Website placement:');
      expect(subject.contentBrief).toBeTruthy();
      expect(subject.poseBrief).toBeTruthy();
      expect(subject.alt).toBeTruthy();

      const siteSubject = site.chapterArt[subject.chapter].find((item) => item.id === subject.id);
      expect(siteSubject).toMatchObject({
        id: subject.id,
        asset: subject.asset,
        rule: subject.rule,
        layout: subject.layout,
        ...(subject.afterHeading ? { afterHeading: subject.afterHeading } : {}),
        ...(subject.position ? { position: subject.position } : {}),
        ...(subject.side ? { side: subject.side } : {}),
      });

      const master = `art/library/subjects/${subject.id}/styles/inked-adventure-comic-vivid.png`;
      expect(existsSync(path.resolve(master)), master).toBe(true);

      const websiteRoot = 'src/assets/images/chapter-art';
      expect(existsSync(path.resolve(`${websiteRoot}/${subject.asset}.webp`))).toBe(true);
      expect(existsSync(path.resolve(`${websiteRoot}/${subject.asset}-480.webp`))).toBe(true);

      if (subject.asset !== subject.id) {
        const cutout = `art/library/subjects/${subject.id}/cutouts/inked-adventure-comic-vivid.png`;
        expect(existsSync(path.resolve(cutout)), cutout).toBe(true);
      }
    }

    for (const mask of [
      'village-cloud',
      'bridge-mist',
      'storm-cloud',
      'action-slash',
      'folio-sketch',
    ]) {
      const maskPath = `src/assets/images/chapter-art/masks/${mask}.svg`;
      expect(existsSync(path.resolve(maskPath)), maskPath).toBe(true);
    }
  });

  it('renders chapter art through a reusable mid-rule partial instead of at chapter openings', () => {
    const chapterLayout = read('src/_includes/layouts/chapter.njk');
    const partialPath = 'src/_includes/partials/chapter-art.njk';

    expect(existsSync(path.resolve(partialPath)), partialPath).toBe(true);
    expect(chapterLayout).toContain('placeAfterHeading');
    expect(chapterLayout).toContain('partials/chapter-art.njk');
    expect(chapterLayout).toContain('{% for chapterArt in chapterArtItems %}');
    expect(chapterLayout).not.toMatch(/<\/nav>[\s\S]{0,1200}<figure class="chapter-art/);
    expect(read(partialPath)).not.toContain('<figcaption');
    expect(read(partialPath)).toContain('loading="lazy"');
    expect(read(partialPath)).toContain('chapterArt.asset');
  });
});
