import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve('.');
const fromRoot = (location) => path.join(root, ...location.split('/'));
const readJson = (location) => JSON.parse(readFileSync(fromRoot(location), 'utf8'));
const walk = (directory) =>
  readdirSync(fromRoot(directory), { withFileTypes: true }).flatMap((entry) => {
    const child = `${directory}/${entry.name}`;
    return entry.isDirectory() ? walk(child) : [child];
  });

describe('historical art provenance', () => {
  it('preserves the original production manifest and exact prompt records as metadata', () => {
    const manifestPath = 'art/archive/provenance/production/manifest.json';
    expect(existsSync(fromRoot(manifestPath))).toBe(true);
    const manifest = readJson(manifestPath);
    expect(manifest.schemaVersion).toBe(1);
    expect(manifest.styleVersion).toBe('FC-HOUSE-V1');
    expect(manifest.status).toBe('production');
    expect(manifest.selectedStyle.id).toBe('inked-adventure-comic');
    expect(manifest.calibration.assets).toHaveLength(12);
    for (const asset of manifest.calibration.assets) {
      expect(asset.prompt).toContain('Use case: stylized-concept');
      expect(asset.output).toBeTruthy();
    }
  });

  it('keeps exploration and finalist decisions without retaining their raster outputs', () => {
    const exploration = readJson(
      'art/archive/provenance/production/fc-house-v1/exploration-02/manifest.json',
    );
    const finalist = readJson(
      'art/archive/provenance/production/fc-house-v1/finalist-stress-test-01/manifest.json',
    );
    expect(exploration.selectedStyle).toBe('inked-adventure-comic');
    expect(exploration.styles).toHaveLength(5);
    expect(finalist.selectedStyle).toBe('inked-adventure-comic');
    expect(finalist.subjects).toHaveLength(6);

    const archived = walk('art/archive');
    expect(archived.some((file) => /\.(png|webp)$/i.test(file))).toBe(false);
    expect(archived.every((file) => /\.(md|json|html)$/i.test(file))).toBe(true);
  });

  it('marks archived output paths as historical rather than live dependencies', () => {
    const readme = readFileSync(fromRoot('art/archive/README.md'), 'utf8');
    expect(readme).toContain('not live dependencies');
    expect(readme).toContain('intentionally absent');
    expect(existsSync(fromRoot('art/production'))).toBe(false);
  });
});
