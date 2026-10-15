// Measures text with the site's own fonts so generated diagrams can wrap and centre labels
// without a browser. Reads the WOFF 1.0 files that @fontsource ships beside the woff2 files the
// site serves: the glyph advances are identical, and WOFF 1.0 needs only zlib to decode.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { inflateSync } from 'node:zlib';

const fontFiles = {
  display700: '@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff',
  body400: '@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-normal.woff',
  body700: '@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-700-normal.woff',
  mono500: '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff',
};

function woffTables(buffer) {
  if (buffer.toString('latin1', 0, 4) !== 'wOFF') throw new Error('Not a WOFF 1.0 font');
  const tableCount = buffer.readUInt16BE(12);
  const tables = {};
  for (let index = 0; index < tableCount; index += 1) {
    const entry = 44 + index * 20;
    const tag = buffer.toString('latin1', entry, entry + 4);
    const offset = buffer.readUInt32BE(entry + 4);
    const compressedLength = buffer.readUInt32BE(entry + 8);
    const length = buffer.readUInt32BE(entry + 12);
    const data = buffer.subarray(offset, offset + compressedLength);
    tables[tag] = compressedLength < length ? inflateSync(data) : data;
  }
  return tables;
}

// Maps Unicode code points to glyph ids from the first Windows Unicode cmap subtable.
function characterMap(cmap) {
  const subtableCount = cmap.readUInt16BE(2);
  const glyphs = new Map();
  for (let index = 0; index < subtableCount; index += 1) {
    const platform = cmap.readUInt16BE(4 + index * 8);
    const encoding = cmap.readUInt16BE(6 + index * 8);
    const offset = cmap.readUInt32BE(8 + index * 8);
    const format = cmap.readUInt16BE(offset);
    if (platform !== 3 || ![1, 10].includes(encoding)) continue;

    if (format === 4) {
      const segments = cmap.readUInt16BE(offset + 6) / 2;
      const ends = offset + 14;
      const starts = ends + segments * 2 + 2;
      const deltas = starts + segments * 2;
      const rangeOffsets = deltas + segments * 2;
      for (let segment = 0; segment < segments; segment += 1) {
        const end = cmap.readUInt16BE(ends + segment * 2);
        const start = cmap.readUInt16BE(starts + segment * 2);
        const delta = cmap.readInt16BE(deltas + segment * 2);
        const rangeOffsetAt = rangeOffsets + segment * 2;
        const rangeOffset = cmap.readUInt16BE(rangeOffsetAt);
        for (let code = start; code <= end && code !== 0xffff; code += 1) {
          let glyph;
          if (rangeOffset === 0) glyph = (code + delta) & 0xffff;
          else {
            const glyphAt = rangeOffsetAt + rangeOffset + (code - start) * 2;
            glyph = cmap.readUInt16BE(glyphAt);
            if (glyph !== 0) glyph = (glyph + delta) & 0xffff;
          }
          if (glyph) glyphs.set(code, glyph);
        }
      }
    } else if (format === 12) {
      const groups = cmap.readUInt32BE(offset + 12);
      for (let group = 0; group < groups; group += 1) {
        const at = offset + 16 + group * 12;
        const start = cmap.readUInt32BE(at);
        const end = cmap.readUInt32BE(at + 4);
        const firstGlyph = cmap.readUInt32BE(at + 8);
        for (let code = start; code <= end; code += 1) glyphs.set(code, firstGlyph + code - start);
      }
    }
  }
  return glyphs;
}

function loadFont(file) {
  const tables = woffTables(readFileSync(path.resolve('node_modules', file)));
  const unitsPerEm = tables.head.readUInt16BE(18);
  const metricCount = tables.hhea.readUInt16BE(34);
  const advances = [];
  for (let glyph = 0; glyph < metricCount; glyph += 1) {
    advances.push(tables.hmtx.readUInt16BE(glyph * 4));
  }
  const glyphs = characterMap(tables.cmap);
  const fallback = advances[glyphs.get(0x6e) ?? 0];
  return (character) => {
    const glyph = glyphs.get(character.codePointAt(0));
    if (glyph === undefined) return fallback / unitsPerEm;
    return advances[Math.min(glyph, metricCount - 1)] / unitsPerEm;
  };
}

const fonts = Object.fromEntries(
  Object.entries(fontFiles).map(([name, file]) => [name, loadFont(file)]),
);

/** Width of `text` set in `font` at `size`, plus `tracking` em of letter-spacing per character. */
export function measure(text, font, size, tracking = 0) {
  const advance = fonts[font];
  if (!advance) throw new Error(`Unknown diagram font: ${font}`);
  let width = 0;
  for (const character of text) width += advance(character) + tracking;
  return width * size;
}
