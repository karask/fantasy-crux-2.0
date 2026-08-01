import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const activeStyleId = 'inked-adventure-comic-vivid';
const styleIds = [
  activeStyleId,
  'more-naturalistic',
  'watercolor-storybook',
  'cinematic-graphic-novel',
  'animated-fantasy-feature',
];
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const fromRoot = (location) => path.join(root, ...location.split('/'));
const readJson = (location) => JSON.parse(readFileSync(fromRoot(location), 'utf8'));
const sha256 = (location) =>
  createHash('sha256')
    .update(readFileSync(fromRoot(location)))
    .digest('hex');
const walk = (location) => {
  if (!existsSync(fromRoot(location))) return [];
  return readdirSync(fromRoot(location), { withFileTypes: true }).flatMap((entry) => {
    const child = `${location}/${entry.name}`;
    return entry.isDirectory() ? walk(child) : [child];
  });
};
const uint24le = (buffer, offset) =>
  buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
const imageSize = (location) => {
  const buffer = readFileSync(fromRoot(location));
  if (buffer.subarray(1, 4).toString('ascii') === 'PNG') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  const chunk = buffer.subarray(12, 16).toString('ascii');
  if (chunk === 'VP8X') {
    return { width: uint24le(buffer, 24) + 1, height: uint24le(buffer, 27) + 1 };
  }
  if (chunk === 'VP8 ') {
    return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === 'VP8L') {
    const [b1, b2, b3, b4] = buffer.subarray(21, 25);
    return {
      width: 1 + b1 + ((b2 & 0x3f) << 8),
      height: 1 + (b2 >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10),
    };
  }
  throw new Error(`Unsupported image format: ${location}`);
};
const verifyImage = (record, label) => {
  check(existsSync(fromRoot(record.path)), `${label}: missing ${record.path}`);
  if (!existsSync(fromRoot(record.path))) return;
  check(sha256(record.path) === record.sha256, `${label}: hash mismatch for ${record.path}`);
  const actual = imageSize(record.path);
  check(
    actual.width === record.width && actual.height === record.height,
    `${label}: dimension mismatch for ${record.path}`,
  );
};

const catalog = readJson('art/library/catalog.json');
const registry = readJson('art/library/subjects/creatures/pose-registry.json');
const content = readJson('art/library/subjects/creatures/content-manifest.json');
const website = readJson('src/assets/images/creatures/manifest.json');
const chapters = readJson('art/library/chapters/illustration-program.json');

check(catalog.activeStyleId === activeStyleId, 'catalog: wrong active style');
check(catalog.styles.length === 5, 'catalog: expected five styles');
check(catalog.homepage.exports.length === 2, 'catalog: expected two homepage exports');
check(catalog.chapters.length === 28, 'catalog: expected 28 chapter subjects');
check(catalog.creatures.length === 57, 'catalog: expected 57 creatures');
check(catalog.cast.length === 4, 'catalog: expected four recurring cast records');

for (const styleId of styleIds) {
  const style = catalog.styles.find((item) => item.id === styleId);
  check(Boolean(style), `style: missing ${styleId}`);
  if (!style) continue;
  check(existsSync(fromRoot(style.brief)), `style: missing brief ${style.brief}`);
  check(existsSync(fromRoot(style.anchor)), `style: missing anchor ${style.anchor}`);
  check(sha256(style.anchor) === style.anchorSha256, `style: anchor hash mismatch ${styleId}`);
  check(style.active === (styleId === activeStyleId), `style: incorrect active flag ${styleId}`);
}
check(!existsSync(fromRoot('src/assets/images/styles')), 'inactive styles must not be published');

verifyImage(
  {
    path: catalog.homepage.master,
    sha256: catalog.homepage.masterSha256,
    width: catalog.homepage.width,
    height: catalog.homepage.height,
  },
  'homepage master',
);
for (const output of catalog.homepage.exports) verifyImage(output, 'homepage export');
check(
  catalog.homepage.width === 1672 && catalog.homepage.height === 941,
  'homepage: unexpected master dimensions',
);

check(
  registry.count === 57 && registry.creatures.length === 57,
  'creatures: registry count mismatch',
);
check(content.count === 57 && content.creatures.length === 57, 'creatures: content count mismatch');
check(website.count === 57 && website.assets.length === 57, 'creatures: website count mismatch');
check(
  new Set(registry.creatures.map((item) => item.slug)).size === 57,
  'creatures: duplicate registry slug',
);
for (const creature of registry.creatures) {
  const contentCreature = content.creatures.find((item) => item.slug === creature.slug);
  const websiteCreature = website.assets.find((item) => item.slug === creature.slug);
  check(Boolean(contentCreature), `creature: missing content ${creature.slug}`);
  check(Boolean(websiteCreature), `creature: missing website record ${creature.slug}`);
  check(
    sha256(creature.master) === creature.masterSha256,
    `creature: master hash mismatch ${creature.slug}`,
  );
  const masterSize = imageSize(creature.master);
  check(
    masterSize.width === 1254 && masterSize.height === 1254,
    `creature: master must be 1254 square ${creature.slug}`,
  );
  if (contentCreature) {
    check(
      contentCreature.poseBrief === creature.poseBrief,
      `creature: pose mismatch ${creature.slug}`,
    );
    check(
      contentCreature.styleImages[activeStyleId] === creature.master,
      `creature: content source mismatch ${creature.slug}`,
    );
  }
  if (websiteCreature) {
    check(
      websiteCreature.source === creature.master,
      `creature: website source mismatch ${creature.slug}`,
    );
    check(
      websiteCreature.sourceSha256 === creature.masterSha256,
      `creature: website source hash mismatch ${creature.slug}`,
    );
    verifyImage(
      {
        path: websiteCreature.website,
        sha256: websiteCreature.websiteSha256,
        width: 640,
        height: 640,
      },
      `${creature.slug} 640`,
    );
    verifyImage(
      {
        path: websiteCreature.website320,
        sha256: websiteCreature.website320Sha256,
        width: 320,
        height: 320,
      },
      `${creature.slug} 320`,
    );
  }
}

check(chapters.subjects.length === 28, 'chapters: expected 28 subjects');
for (const subject of chapters.subjects) {
  const entry = catalog.chapters.find((item) => item.id === subject.id);
  check(Boolean(entry), `chapter: missing catalog entry ${subject.id}`);
  if (!entry) continue;
  verifyImage(
    { path: entry.master, sha256: entry.masterSha256, width: entry.width, height: entry.height },
    `${subject.id} master`,
  );
  check(entry.exports.length === 2, `chapter: expected two exports ${subject.id}`);
  for (const output of entry.exports) verifyImage(output, `${subject.id} export`);
  const [full, small] = entry.exports;
  check(
    full.width === subject.width && full.height === subject.height,
    `chapter: full export dimensions ${subject.id}`,
  );
  check(
    small.width === 480 && small.height === Math.round((subject.height * 480) / subject.width),
    `chapter: 480 export dimensions ${subject.id}`,
  );
}

const duplicateHashes = new Map();
for (const location of walk('art/library').filter((file) => file.endsWith('.png'))) {
  const hash = sha256(location);
  check(
    !duplicateHashes.has(hash),
    `duplicate master: ${location} and ${duplicateHashes.get(hash)}`,
  );
  duplicateHashes.set(hash, location);
}
check(
  walk('art/review').every((file) => !/\.(png|webp)$/i.test(file)),
  'review: contains raster candidates',
);
check(
  walk('art/archive').every((file) => !/\.(png|webp)$/i.test(file)),
  'archive: contains raster outputs',
);
for (const obsolete of [
  'art/production',
  'art/creatures',
  'art/style-studies',
  'art/art-direction',
]) {
  check(!existsSync(fromRoot(obsolete)), `obsolete live tree remains: ${obsolete}`);
}

if (failures.length) {
  console.error(`Art library validation failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  'Validated 5 styles, 1 homepage subject, 28 chapter subjects, 57 creature masters, and all website derivatives.',
);
