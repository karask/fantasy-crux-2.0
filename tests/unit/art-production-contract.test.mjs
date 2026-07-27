import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const manifestPath = path.resolve('art/production/manifest.json');
const explorationManifestPath = path.resolve(
  'art/production/fc-house-v1/exploration-02/manifest.json',
);
const finalistStressTestManifestPath = path.resolve(
  'art/production/fc-house-v1/finalist-stress-test-01/manifest.json',
);

function readManifest() {
  expect(existsSync(manifestPath), 'art production manifest').toBe(true);
  return JSON.parse(readFileSync(manifestPath, 'utf8'));
}

function readExplorationManifest() {
  expect(existsSync(explorationManifestPath), 'alternative style exploration manifest').toBe(true);
  return JSON.parse(readFileSync(explorationManifestPath, 'utf8'));
}

function readFinalistStressTestManifest() {
  expect(existsSync(finalistStressTestManifestPath), 'finalist stress-test manifest').toBe(true);
  return JSON.parse(readFileSync(finalistStressTestManifestPath, 'utf8'));
}

describe('Fantasy Crux art production contract', () => {
  it('defines the complete FC-HOUSE-V1 calibration matrix', () => {
    const manifest = readManifest();

    expect(manifest.schemaVersion).toBe(1);
    expect(manifest.styleVersion).toBe('FC-HOUSE-V1');
    expect(manifest.status).toBe('production');
    expect(manifest.selectedStyle).toMatchObject({
      id: 'inked-adventure-comic',
      label: 'Inked Adventure Comic',
      masterRoot: 'art/production/fc-house-v1/approved/inked-adventure-comic',
      styleAnchor: 'art/production/fc-house-v1/approved/inked-adventure-comic/style-anchor.png',
    });
    expect(manifest.calibration.lanes.map((lane) => lane.id)).toEqual([
      'more-graphic',
      'balanced',
      'more-naturalistic',
    ]);
    expect(manifest.calibration.subjects.map((subject) => subject.id)).toEqual([
      'warrior',
      'bear',
      'dragon',
      'village',
    ]);
    expect(manifest.calibration.assets).toHaveLength(12);
    expect(manifest.explorations).toEqual([
      {
        id: 'exploration-02',
        status: 'complete-selected-inked-adventure-comic',
        manifest: 'art/production/fc-house-v1/exploration-02/manifest.json',
      },
    ]);
  });

  it('records a unique verbatim prompt and stable output path for every calibration asset', () => {
    const manifest = readManifest();
    const ids = manifest.calibration.assets.map((asset) => asset.id);
    const outputPaths = manifest.calibration.assets.map((asset) => asset.output);

    expect(new Set(ids).size).toBe(12);
    expect(new Set(outputPaths).size).toBe(12);

    for (const asset of manifest.calibration.assets) {
      expect(asset.prompt).toContain('Use case: stylized-concept');
      expect(asset.prompt).toContain('Lighting/mood: neutral diffuse midday daylight');
      expect(asset.prompt).toContain('no fire');
      expect(asset.prompt).toContain('no enclosing');
      expect(asset.output).toBe(
        `art/production/fc-house-v1/calibration/${asset.lane}/${asset.subject}.png`,
      );
      expect(['pending', 'generated', 'rejected', 'approved']).toContain(asset.status);
      if (asset.status === 'generated' || asset.status === 'approved') {
        expect(existsSync(path.resolve(asset.output)), asset.id).toBe(true);
      }
    }
  });

  it('keeps rendering style separate from palette, lighting, and mood', () => {
    const manifest = readManifest();

    for (const lane of manifest.calibration.lanes) {
      for (const styleBlock of [lane.styleBlock, lane.revisionStyleBlock]) {
        expect(styleBlock).not.toMatch(
          /\b(indigo|teal|jade|vermilion|gold|earth|ochre|charcoal|firelight|sunset|moonlight|moody|dramatic)\b/i,
        );
        expect(styleBlock).toMatch(/brush|stroke/i);
        expect(styleBlock).toMatch(/edge/i);
        expect(styleBlock).toMatch(/silhouette|shape/i);
        expect(styleBlock).toMatch(/detail|microtexture/i);
        expect(styleBlock).toMatch(/material/i);
      }
    }
  });

  it('records the complete targeted calibration revision with exact provenance', () => {
    const manifest = readManifest();
    const revisions = manifest.calibration.revisions;

    expect(manifest.calibration.revisionStatus).toBe('complete-reference-only');
    expect(revisions).toHaveLength(12);
    expect(new Set(revisions.map((asset) => asset.id)).size).toBe(12);
    expect(new Set(revisions.map((asset) => asset.output)).size).toBe(12);

    for (const asset of revisions) {
      const lane = manifest.calibration.lanes.find((candidate) => candidate.id === asset.lane);

      expect(asset.iteration).toBe('revision-01');
      expect(asset.sourceAsset).toBe(`${asset.lane}-${asset.subject}`);
      expect(asset.source).toBe(
        `art/production/fc-house-v1/calibration/${asset.lane}/${asset.subject}.png`,
      );
      expect(asset.output).toBe(
        `art/production/fc-house-v1/calibration/revision-01/${asset.lane}/${asset.subject}.png`,
      );
      expect(asset.prompt).toContain('Use case: style-transfer');
      expect(asset.prompt).toContain(
        'content/composition source only; do not inherit its rendering style',
      );
      expect(asset.prompt).toContain('Replace only');
      expect(asset.prompt).toContain('natural local palette');
      expect(asset.prompt).toContain('neutral daylight');
      expect(asset.prompt).toContain(`Style/medium: ${lane.revisionStyleBlock}`);
      expect(['pass', 'pass-with-notes', 'fail']).toContain(asset.qa.status);
      expect(existsSync(path.resolve(asset.source)), `${asset.id} source`).toBe(true);
      expect(existsSync(path.resolve(asset.output)), `${asset.id} output`).toBe(true);
    }
  });

  it('records five reproducible alternative style systems and their sentinels', () => {
    const exploration = readExplorationManifest();
    const expectedStyleIds = [
      'inked-adventure-comic',
      'watercolor-storybook',
      'hand-colored-woodcut',
      'illuminated-chronicle',
      'painted-miniature-diorama',
    ];

    expect(exploration.schemaVersion).toBe(1);
    expect(exploration.id).toBe('exploration-02');
    expect(exploration.status).toBe('complete-selected-inked-adventure-comic');
    expect(exploration.selectedStyle).toBe('inked-adventure-comic');
    expect(exploration.generationTool.workflow).toBe('built-in image_gen');
    expect(exploration.styles.map((style) => style.id)).toEqual(expectedStyleIds);

    for (const styleReference of exploration.styles) {
      expect(styleReference.provenance).toBe(
        `art/production/fc-house-v1/exploration-02/${styleReference.id}/provenance.json`,
      );
      const provenancePath = path.resolve(styleReference.provenance);
      expect(existsSync(provenancePath), `${styleReference.id} provenance`).toBe(true);
      const style = JSON.parse(readFileSync(provenancePath, 'utf8'));

      expect(style.id).toBe(styleReference.id);
      expect(style.styleBlock).toMatch(/brush|ink|paint|wash|resin/i);
      expect(style.anchor.prompt).toContain(`Style/medium: ${style.styleBlock}`);
      const isSelected = style.id === exploration.selectedStyle;
      const expectedAnchor = isSelected
        ? 'art/production/fc-house-v1/approved/inked-adventure-comic/style-anchor.png'
        : `art/production/fc-house-v1/exploration-02/${style.id}/anchor.png`;

      expect(style.anchor.output).toBe(expectedAnchor);
      expect(existsSync(path.resolve(style.anchor.output)), style.id).toBe(true);
      expect(style.sentinels).toHaveLength(4);
      expect(style.sentinels.map((asset) => asset.subject)).toEqual([
        'warrior',
        'bear',
        'dragon',
        'village',
      ]);

      for (const asset of style.sentinels) {
        const expectedOutput = isSelected
          ? `art/production/fc-house-v1/approved/inked-adventure-comic/${asset.subject}.png`
          : `art/production/fc-house-v1/exploration-02/${style.id}/${asset.subject}.png`;

        expect(asset.output).toBe(expectedOutput);
        expect(asset.contentSource).toBe(
          `art/production/fc-house-v1/calibration/revision-01/more-graphic/${asset.subject}.png`,
        );
        expect(asset.styleSource).toBe(expectedAnchor);
        expect(asset.prompt).toMatch(/content(?: and |\/)composition source only/i);
        expect(asset.prompt).toContain('style-only anchor');
        expect(asset.prompt).toContain(`Style/medium: ${style.styleBlock}`);
        expect(asset.qa.status).toBe('pass');
        expect(existsSync(path.resolve(asset.output)), asset.id).toBe(true);
      }
    }
  });

  it('records two finalists tested against the same six composition sources', () => {
    const manifest = readManifest();
    const stressTest = readFinalistStressTestManifest();
    const expectedSubjects = [
      'interior',
      'magic',
      'item',
      'humanoid-monster',
      'group-scene',
      'night-weather',
    ];

    expect(manifest.finalistStressTests).toEqual([
      {
        id: 'finalist-stress-test-01',
        status: 'complete-selected-inked-adventure-comic',
        finalists: ['inked-adventure-comic', 'more-naturalistic'],
        selectedStyle: 'inked-adventure-comic',
        manifest: 'art/production/fc-house-v1/finalist-stress-test-01/manifest.json',
        comparison: 'art/production/fc-house-v1/finalist-stress-test-01/comparison.html',
      },
    ]);
    expect(stressTest.status).toBe('complete-selected-inked-adventure-comic');
    expect(stressTest.selectedStyle).toBe('inked-adventure-comic');
    expect(stressTest.subjects).toEqual(expectedSubjects);
    expect(stressTest.contentSources.map((asset) => asset.subject)).toEqual(expectedSubjects);
    expect(stressTest.styles.map((style) => style.id)).toEqual([
      'inked-adventure-comic',
      'more-naturalistic',
    ]);

    for (const source of stressTest.contentSources) {
      expect(source.prompt).toContain('neutral composition reference');
      expect(source.prompt).toContain('no distinctive finished illustration style');
      expect(existsSync(path.resolve(source.output)), `${source.subject} content source`).toBe(
        true,
      );
    }

    for (const style of stressTest.styles) {
      expect(style.assets.map((asset) => asset.subject)).toEqual(expectedSubjects);
      expect(style.sharedPrompt).toContain('content and composition source only');
      expect(style.sharedPrompt).toMatch(
        /style reference|define the selected More Naturalistic style/,
      );

      for (const asset of style.assets) {
        expect(asset.contentSource).toBe(
          `art/production/fc-house-v1/finalist-stress-test-01/content/${asset.subject}.png`,
        );
        const approvedSubject = asset.subject === 'humanoid-monster' ? 'ogre' : asset.subject;
        const expectedOutput =
          style.id === stressTest.selectedStyle
            ? `art/production/fc-house-v1/approved/inked-adventure-comic/${approvedSubject}.png`
            : `art/production/fc-house-v1/finalist-stress-test-01/${style.id}/${asset.subject}.png`;

        expect(asset.output).toBe(expectedOutput);
        expect(asset.qa.status).toBe('pass');
        expect(existsSync(path.resolve(asset.output)), `${style.id}/${asset.subject}`).toBe(true);
      }
    }
  });

  it('records every approved creature batch with reproducible prompts and existing masters', () => {
    const manifest = readManifest();
    const expectedBatchIds = [
      'creature-batch-02',
      'creature-batch-03',
      'creature-batch-04',
      'creature-batch-05',
      'creature-batch-06',
    ];
    const expectedCreatureIds = [
      ['griffin', 'dryad', 'ghost', 'skeleton', 'giant-spider'],
      ['hag', 'naiad', 'oread', 'ghoul', 'mummy', 'vampire', 'zombie'],
      [
        'bull',
        'crocodile',
        'dog',
        'elephant',
        'giant-ant',
        'giant-hawk',
        'giant-lizard',
        'giant-octopus',
        'giant-python',
        'hawk',
        'horse',
        'lion',
        'raven',
        'rhinoceros',
        'viper',
        'wolf',
      ],
      [
        'basilisk',
        'beastman',
        'dwarf',
        'elemental',
        'elf',
        'gargoyle',
        'giant',
        'goblin',
        'golem',
        'harpy',
        'holy-steed',
        'holy-warrior',
        'lizardman',
        'merfolk',
        'orc',
        'pixie',
        'sea-serpent',
        'troll',
        'werewolf',
        'wyvern',
      ],
      [
        'ancestor-spirit',
        'disease-spirit',
        'guardian-spirit',
        'healing-spirit',
        'magic-spirit',
        'passion-spirit',
      ],
    ];

    expect(manifest.selectedStyle.productionBatches).toHaveLength(expectedBatchIds.length);

    manifest.selectedStyle.productionBatches.forEach((batchPath, index) => {
      expect(existsSync(path.resolve(batchPath)), batchPath).toBe(true);
      const batch = JSON.parse(readFileSync(path.resolve(batchPath), 'utf8'));

      expect(batch.batchId).toBe(expectedBatchIds[index]);
      expect(batch.status).toBe('complete-approved');
      expect(batch.styleVersion).toBe('FC-HOUSE-V1');
      expect(batch.style).toBe('inked-adventure-comic');
      expect(batch.assets.map((asset) => asset.id)).toEqual(expectedCreatureIds[index]);

      for (const asset of batch.assets) {
        expect(asset.prompt).toContain('Use case: stylized-concept');
        expect(asset.prompt).toContain('Hand-inked Western fantasy adventure comic');
        expect(asset.prompt).toContain('Do not inherit');
        expect(asset.qa.status).toBe('pass');
        expect(existsSync(path.resolve(asset.output)), asset.id).toBe(true);
      }
    });
  });
});
