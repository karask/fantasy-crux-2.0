// Renders an adventure's Markdown as an A4 Gamemaster edition: a cover, contents with page
// numbers, the GM chapters, the GM maps, print-and-play handouts, and the Open Game License.
// Chrome typesets the HTML. The script checks that the browser shows every word of every chapter
// and that nothing overflows or drops below 9 pt; verify.py then checks the PDF itself.
//
//   PYTHON=/path/to/python-with-pypdf node adventures/print/render.mjs twelve-below
//
// The Markdown files stay the only source. Run from the repository root.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import editions from './editions.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const name = process.argv[2];
const edition = editions[name];
assert.ok(
  edition,
  `Usage: node adventures/print/render.mjs <${Object.keys(editions).join(' | ')}>`,
);
const source = path.join(root, 'adventures', name);
const review = path.join(here, 'review', name);
const output = path.join(root, 'output/pdf', `${name}-gm.pdf`);
const draft = path.join(review, `${name}-pass1.pdf`);
const python = process.env.PYTHON ?? 'python3';
const verifier = path.join(here, 'verify.py');
await mkdir(review, { recursive: true });
await mkdir(path.dirname(output), { recursive: true });

const site = 'https://fantasycrux.org';
const rulesDirectory = path.join(root, 'src/content/rules');
const md = new MarkdownIt({ html: false });
const esc = (value) => md.utils.escapeHtml(String(value));
// The same anchors GitHub gives Markdown headings, so the files' own links keep working.
const slugify = (text) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-');
const plain = (inline) =>
  inline.children
    .filter((token) => token.type === 'text' || token.type === 'code_inline')
    .map((token) => token.content)
    .join('');
const decode = (html) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
const letters = (text) =>
  text
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

// ---- Links ----------------------------------------------------------------------------------

const chapters = edition.chapters;
const links = [];

/** Where a link in an adventure file points in the book, or null to keep only its words. */
function resolve(href, key) {
  if (/^(https?:|mailto:)/.test(href)) return href;
  const [file, anchor] = href.split('#');
  if (!file) return `#${key}--${anchor}`;
  const chapter = chapters.find((entry) => entry.file === file);
  if (chapter) return anchor ? `#${chapter.key}--${anchor}` : `#${chapter.key}`;
  if (edition.maps[file]) return `#${edition.maps[file].id}`;
  const target = path.resolve(source, file);
  if (target.startsWith(rulesDirectory + path.sep)) {
    const { data } = matter(readFileSync(target, 'utf8'));
    return data.type === 'chapter'
      ? `${site}/rules/${data.id}/`
      : `${site}/rules/${data.chapter}/#${data.slug}`;
  }
  if (target.startsWith(path.join(root, 'pregenerated-characters') + path.sep))
    return `${site}/downloads/`;
  return null; // a repository document with no public page
}

function rewriteLinks(tokens, key) {
  for (const token of tokens) {
    if (token.type !== 'inline') continue;
    const children = token.children;
    for (let index = 0; index < children.length; index += 1) {
      if (children[index].type !== 'link_open') continue;
      const href = resolve(children[index].attrGet('href'), key);
      if (href) {
        children[index].attrSet('href', href);
        links.push(href);
        continue;
      }
      const close = children.findIndex((item, at) => at > index && item.type === 'link_close');
      const Token = children[index].constructor;
      children[index] = new Token('text', '', 0);
      children[close] = new Token('text', '', 0);
    }
  }
}

/** Render a chapter body with GitHub-style heading ids, prefixed by the chapter key. */
function render(markdown, key, headings = []) {
  const tokens = md.parse(markdown, {});
  const used = new Map();
  tokens.forEach((token, index) => {
    if (token.type !== 'heading_open') return;
    const text = plain(tokens[index + 1]);
    const base = `${key}--${slugify(text)}`;
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    const id = count ? `${base}-${count}` : base;
    token.attrSet('id', id);
    headings.push({ level: Number(token.tag.slice(1)), id, title: text });
  });
  rewriteLinks(tokens, key);
  return md.renderer.render(tokens, md.options, {});
}

/** Top-level block groups of a Markdown fragment, each rendered on its own. */
function blocks(markdown, key) {
  const tokens = md.parse(markdown, {});
  rewriteLinks(tokens, key);
  const groups = [];
  let depth = 0;
  let current = [];
  for (const token of tokens) {
    current.push(token);
    depth += token.nesting;
    if (depth === 0) {
      groups.push(current);
      current = [];
    }
  }
  return groups.map((group) => ({
    type: group[0].type.replace(/_open$/, ''),
    tokens: group,
    content: group[0].type === 'fence' ? group[0].content : '',
    html: md.renderer.render(group, md.options, {}),
  }));
}

// A paragraph wholly in italics, before a handout, is a note to the GM.
const gmNote = (group) => {
  if (group?.type !== 'paragraph') return false;
  const children = group.tokens[1].children;
  return children[0]?.type === 'em_open' && children.at(-1)?.type === 'em_close';
};

// ---- Chapters -------------------------------------------------------------------------------

function omit(markdown, chapter) {
  let text = markdown;
  for (const heading of chapter.omitSections ?? []) {
    const pattern = new RegExp(`^## ${heading}\\n[\\s\\S]*?(?=^## |(?![\\s\\S]))`, 'm');
    assert.match(text, pattern, `${chapter.file}: no section "${heading}" to omit`);
    text = text.replace(pattern, '');
  }
  for (const pattern of chapter.omitParagraphs ?? []) {
    const parts = text.split(/\n{2,}/);
    const kept = parts.filter((part) => !pattern.test(part.trim()));
    assert.equal(kept.length, parts.length - 1, `${chapter.file}: ${pattern} must match once`);
    text = kept.join('\n\n');
  }
  return text;
}

const chapterHtml = [];
const expectedChapters = {};
for (const chapter of chapters) {
  const raw = await readFile(path.join(source, chapter.file), 'utf8');
  const match = omit(raw, chapter).match(/^# (.+)\n+([\s\S]*)$/);
  assert.ok(match, `${chapter.file} must begin with a level-one heading`);
  chapter.title ??= match[1];
  chapter.headings = [];
  const body = render(match[2], chapter.key, chapter.headings);
  expectedChapters[chapter.key] = letters(decode(body));
  chapterHtml.push(
    `<section class="chapter" id="${chapter.key}"><header class="chapter-head"><p class="kicker">${esc(chapter.kicker)}</p><h1 id="${chapter.key}--title">${esc(chapter.title)}</h1></header>${body}</section>`,
  );
}

// ---- Maps -----------------------------------------------------------------------------------

async function mapPage(file) {
  const map = edition.maps[file];
  const svg = (await readFile(path.join(source, file), 'utf8'))
    .trim()
    .replace(/^<\?xml[^>]*>\s*/, '')
    .replace('<svg ', '<svg role="img" ');
  return `<section class="map-page" id="${map.id}"><div class="map-label"><h2 id="${map.id}--title">${esc(map.title)}</h2><span>${esc(map.note)} · ${esc(edition.title)}</span></div>${svg}</section>`;
}

// ---- Print and play -------------------------------------------------------------------------

const handoutChapter = chapters.find((chapter) => chapter.key === 'handouts');
const handoutSource = await readFile(path.join(source, handoutChapter.file), 'utf8');
const sections = new Map(
  handoutSource
    .split(/^(?=## )/m)
    .slice(1)
    .map((part) => {
      const [heading, ...rest] = part.split('\n');
      const title = heading.replace(/^## /, '').trim();
      return [slugify(title), { title, body: rest.join('\n') }];
    }),
);

const inner = (html, tag) =>
  html.replace(new RegExp(`^<${tag}>\\n?`), '').replace(new RegExp(`</${tag}>\\n?$`), '');

/** The bell code: a fenced block of `n   MEANING` rows between plain lines. */
function card(text) {
  const lines = text.replace(/\n$/, '').split('\n');
  const title = lines.shift().trim();
  const parts = [];
  let words = [];
  let rows = [];
  const flushWords = () => {
    if (words.length) parts.push(`<p class="card-text">${esc(words.join(' '))}</p>`);
    words = [];
  };
  const flushRows = () => {
    if (rows.length)
      parts.push(
        `<table class="signals"><tbody>${rows.map(([count, meaning]) => `<tr><td class="count">${count}</td><td class="meaning">${esc(meaning)}</td></tr>`).join('')}</tbody></table>`,
      );
    rows = [];
  };
  for (const line of lines) {
    const signal = line.match(/^\s+(\d+)\s{2,}(\S.*)$/);
    if (signal) {
      flushWords();
      rows.push([signal[1], signal[2].trim()]);
    } else if (!line.trim()) {
      flushWords();
      flushRows();
    } else {
      flushRows();
      words.push(line.trim());
    }
  }
  flushWords();
  flushRows();
  return `<div class="prop prop-card"><p class="card-title">${esc(title)}</p>${parts.join('')}</div>`;
}

/** The Water track, drawn from its text version: boxes, the marks under them, and labels. */
function track(text) {
  const lines = text.replace(/\n$/, '').split('\n');
  const at = lines.findIndex((line) => /\[\s*1\s*\]/.test(line));
  const boxes = [...lines[at].matchAll(/\[\s*(\d+)\s*\]/g)].map((m) => ({
    number: Number(m[1]),
    start: m.index,
    end: m.index + m[0].length,
  }));
  const boxAt = (column) => boxes.find((box) => column >= box.start && column < box.end);
  const words = (line) =>
    [...line.matchAll(/\S+(?: \S+)*/g)].map((m) => ({
      text: m[0],
      centre: m.index + m[0].length / 2,
      start: m.index,
    }));
  const [title, ...tops] = words(lines[at - 1]);
  const marks = [...lines[at + 1].matchAll(/\|/g)].map((m) => boxAt(m.index));
  const labels = words(lines[at + 2]).map((label) => {
    const mark = marks.reduce((best, box) =>
      Math.abs((box.start + box.end) / 2 - label.centre) <
      Math.abs((best.start + best.end) / 2 - label.centre)
        ? box
        : best,
    );
    return { text: label.text, box: mark };
  });
  assert.equal(new Set(labels.map((label) => label.box.number)).size, labels.length);
  const topFor = (box) => tops.find((top) => boxAt(top.start) === box);
  const boxHtml = boxes
    .map((box) => {
      const top = topFor(box);
      const tone = box === boxes.at(-1) ? ' last' : marks.includes(box) ? ' marked' : '';
      return `<div class="box${tone}">${top ? `<span class="top">${esc(top.text)}</span>` : ''}${box.number}</div>`;
    })
    .join('');
  const labelHtml = labels
    .map(
      ({ text: words, box }) =>
        `<span style="left:${(((box.number - 0.5) / boxes.length) * 100).toFixed(3)}%">${esc(words)}</span>`,
    )
    .join('');
  return `<div class="prop prop-track"><p class="track-title">${esc(title.text)}</p><div class="track" style="grid-template-columns:repeat(${boxes.length},1fr)">${boxHtml}</div><div class="track-labels">${labelHtml}</div></div>`;
}

/** Cut-out tokens: `LEVEL n   [ Name ]  [ Name ]`, continued on following lines. */
function tokens(text) {
  const groups = [];
  for (const line of text.split('\n')) {
    const level = line.match(/^(LEVEL \d+)/)?.[1];
    const names = [...line.matchAll(/\[ ([^\]]+?) \]/g)].map((m) => m[1]);
    if (level) groups.push({ level, names });
    else if (names.length) groups.at(-1).names.push(...names);
  }
  const title = (level) => level.charAt(0) + level.slice(1).toLowerCase();
  return `<div class="prop prop-tokens">${groups
    .map(
      (group) =>
        `<p class="token-level">${esc(title(group.level))}</p><div class="tokens">${group.names
          .map(
            (person) =>
              `<div class="token"><strong>${esc(person)}</strong><span>${esc(title(group.level))}</span></div>`,
          )
          .join('')}</div>`,
    )
    .join('')}</div>`;
}

/** A printed song: a title block, stanzas, and a closing note, separated by blank lines. */
function songsheet(text) {
  const blocks = text
    .replace(/\n$/, '')
    .split(/\n\s*\n/)
    .map((block) => block.split('\n').map((line) => line.trim()));
  const [head, ...rest] = blocks;
  const foot = rest.pop();
  const stanza = (lines) => {
    const heading = /^[IVX]+\. /.test(lines[0]) ? lines.shift() : null;
    return `<div class="stanza${heading ? '' : ' chorus'}">${heading ? `<p class="stanza-head">${esc(heading)}</p>` : ''}<p>${lines.map(esc).join('<br>')}</p></div>`;
  };
  return `<div class="prop prop-songsheet"><p class="song-title">${esc(head[0])}</p>${head
    .slice(1)
    .map((line) => `<p class="song-sub">${esc(line)}</p>`)
    .join(
      '',
    )}${rest.map(stanza).join('')}<p class="song-foot">${foot.map(esc).join('<br>')}</p></div>`;
}

/** The courier's seal ribbon: names in brackets, and under each its state. */
function seals(text) {
  const lines = text
    .replace(/\n$/, '')
    .split('\n')
    .filter((line) => line.trim());
  const title = lines[0].trim();
  const nameLine = lines.findIndex((line) => /\(\s*[A-Z]+\s*\)/.test(line));
  const names = [...lines[nameLine].matchAll(/\(\s*([A-Z]+)\s*\)/g)].map((m) => ({
    name: m[1],
    centre: m.index + m[0].length / 2,
  }));
  const states = [...lines[nameLine + 1].matchAll(/ash|\[ \]/g)].map((m) => ({
    ash: m[0] === 'ash',
    centre: m.index + m[0].length / 2,
  }));
  assert.equal(states.length, names.length, 'Every seal needs a state');
  const foot = lines
    .at(-1)
    .trim()
    .replace(/\s{2,}/g, ' ');
  const slots = names
    .map((seal, index) => {
      const ash = states[index].ash;
      return `<div class="seal-slot"><div class="seal-disc${ash ? ' ash' : ''}">${esc(seal.name)}</div>${ash ? '<span class="seal-state">ash</span>' : '<span class="seal-box" role="img" aria-label="unused"></span>'}</div>`;
    })
    .join('');
  return `<div class="prop prop-seals"><p class="seals-title">${esc(title)}</p><div class="seals">${slots}</div><p class="seals-foot">${esc(foot)}</p></div>`;
}

const screws = [
  'left:3.4mm;top:3.4mm',
  'right:3.4mm;top:3.4mm',
  'left:3.4mm;bottom:3.4mm',
  'right:3.4mm;bottom:3.4mm',
]
  .map((place) => `<span class="screw" style="${place}" aria-hidden="true"></span>`)
  .join('');

function handout(entry) {
  if (entry.map) return null;
  const section = sections.get(entry.section);
  assert.ok(section, `${handoutChapter.file}: no section ${entry.section}`);
  let groups = blocks(section.body, 'handouts');
  if (gmNote(groups[0])) groups = groups.slice(1);
  const quote = groups.find((group) => group.type === 'blockquote');
  const fence = groups.find((group) => group.type === 'fence');
  let prop;
  switch (entry.kind) {
    case 'player':
      prop = `<div class="player-sheet">${groups.map((group) => group.html).join('')}</div>`;
      break;
    case 'card':
      prop = card(fence.content);
      break;
    case 'track-and-tokens':
      prop = groups
        .map((group) => {
          if (group.type === 'paragraph') return group.html.replace('<p>', '<p class="prop-note">');
          if (group.type === 'fence')
            return /\[\s*1\s*\]/.test(group.content) ? track(group.content) : tokens(group.content);
          throw new Error(`Unexpected ${group.type} in ${entry.section}`);
        })
        .join('');
      break;
    case 'seals':
      prop = seals(fence.content);
      break;
    case 'songsheet':
      prop = songsheet(fence.content);
      break;
    default: {
      assert.ok(quote, `${entry.section}: a ${entry.kind} handout needs a block quote`);
      let html = inner(quote.html, 'blockquote');
      if (entry.stamp) {
        assert.ok(html.includes(`<strong>${entry.stamp}`), `${entry.section}: no ${entry.stamp}`);
        html = html.replace(`<strong>${entry.stamp}`, `<strong class="stamp">${entry.stamp}`);
      }
      const extra =
        entry.kind === 'plate'
          ? screws
          : entry.kind === 'decree'
            ? '<div class="seal" aria-hidden="true"></div>'
            : '';
      prop = `<div class="prop prop-${entry.kind}">${entry.kind === 'plate' ? extra : ''}${html}${entry.kind === 'decree' ? extra : ''}</div>`;
      if (entry.caption)
        prop += groups
          .slice(groups.indexOf(quote) + 1)
          .filter((group) => group.type === 'paragraph')
          .map((group) => group.html.replace('<p>', '<p class="prop-caption">'))
          .join('');
    }
  }
  const id = `print--${entry.section}`;
  return {
    id,
    title: section.title,
    html: `<div class="handout handout-${entry.kind}"><div class="handout-label"><h2 id="${id}">${esc(section.title)}</h2><span>${esc(edition.title)}</span></div>${prop}</div>`,
  };
}

const printPages = [];
for (const entries of edition.handoutPages) {
  if (entries[0].map) {
    const map = edition.maps[entries[0].map];
    printPages.push({
      html: await mapPage(entries[0].map),
      entries: [{ id: map.id, title: map.title }],
    });
    continue;
  }
  const rendered = entries.map(handout);
  printPages.push({
    html: `<section class="print-page">${rendered.map((item) => item.html).join('')}</section>`,
    entries: rendered.map(({ id, title }) => ({ id, title })),
  });
}

// ---- Licence --------------------------------------------------------------------------------

const licenceSource = matter(await readFile(path.join(root, 'src/license.md'), 'utf8')).content;
const terms = licenceSource
  .slice(licenceSource.indexOf('## Terms of the License'))
  .replace(/\s*\{#[^}]+\}/g, '')
  .trim();
const notice = `${edition.title} Copyright 2026; Author Konstantinos Karasavvas.`;
const aboutHtml = `<div class="about"><p><strong>${esc(edition.title)}, Gamemaster edition.</strong> Fantasy Crux 2.0 Beta; ${esc(edition.date)}. Game and setting: Konstantinos Karasavvas. Adventure writing, layout and maps assisted by Claude. Not yet playtested.</p>
<p>The rules mechanics and creature statistics reproduced or adapted here are Open Game Content under the Open Game License 1.0a, printed in full at the back. Story, dialogue, named characters, places, setting descriptions, maps, handouts and artwork are not designated as Open Game Content.</p></div>`;
const licenceHtml = `<section class="chapter licence" id="licence"><header class="chapter-head"><p class="kicker">Open Game Content</p><h1 id="licence--title">Open Game License</h1></header>
<div class="licence-text">${md.render(terms)}<p>${esc(notice)}</p></div></section>`;

// ---- Cover and contents ---------------------------------------------------------------------

const coverTrack = edition.coverTrack
  ? `<div class="cover-track" aria-hidden="true">${Array.from({ length: 12 }, (_, index) => (index === 11 ? '<span class="dawn">DAWN</span>' : `<span>${index + 1}</span>`)).join('')}</div>`
  : '';
const coverHtml = `<section class="cover" aria-label="Cover">${edition.cover()}
<div class="cover-top"><span>Fantasy Crux 2.0 Beta</span><span>Gamemaster edition</span></div>
<h1 class="cover-title" style="top:${edition.titleTop}mm;font-size:${edition.titleSize}pt">${edition.titleLines.map((line) => `<span>${esc(line)}</span>`).join(' ')}</h1>
<p class="cover-tagline" style="top:${edition.taglineTop}mm">${esc(edition.tagline)}</p>
${coverTrack}
<div class="cover-foot"><span>${esc(edition.coverFoot[0])}</span><span>${esc(edition.coverFoot[1])}</span></div></section>`;

const gmMapPages = await Promise.all(edition.gmMaps.map(mapPage));
const toc = [
  ...chapters.map((chapter) => ({
    id: `${chapter.key}--title`,
    title: chapter.title,
    entries: chapter.headings.filter((heading) => heading.level === 2),
  })),
  ...edition.gmMaps.map((file) => ({
    id: `${edition.maps[file].id}--title`,
    title: edition.maps[file].title,
    entries: [],
  })),
  {
    id: printPages[0].entries[0].id,
    title: 'Print and play',
    entries: printPages.flatMap((page) => page.entries),
    first: true,
  },
  { id: 'licence--title', title: 'Open Game License', entries: [] },
];

// Folios come from the PDF's own outline after a first pass.
function contentsHtml(folios) {
  const folio = (key) => `<span class="folio">${folios?.get(key) ?? '00'}</span>`;
  const groups = toc
    .map((group) => {
      const head = group.first
        ? `<p class="toc-entry chapter-entry"><span>${esc(group.title)}</span><span class="fill"></span></p>`
        : `<p class="toc-entry chapter-entry"><a href="#${group.id}">${esc(group.title)}</a><span class="fill"></span>${folio(group.id)}</p>`;
      const rows = group.entries
        .map(
          (entry) =>
            `<p class="toc-entry"><a href="#${entry.id}">${esc(entry.title)}</a><span class="fill"></span>${folio(entry.id)}</p>`,
        )
        .join('');
      return `<div class="toc-group">${head}${rows}</div>`;
    })
    .join('');
  return `<section class="contents"><header class="contents-head"><p class="kicker">${esc(edition.title)}</p><h1 id="contents">Contents</h1></header><div class="toc">${groups}</div>${aboutHtml}</section>`;
}

// ---- Fonts, page furniture and the document -------------------------------------------------

const fontFiles = [
  [
    'Barlow Condensed',
    700,
    'normal',
    'node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2',
  ],
  [
    'Atkinson Hyperlegible',
    400,
    'normal',
    'node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-normal.woff2',
  ],
  [
    'Atkinson Hyperlegible',
    700,
    'normal',
    'node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-700-normal.woff2',
  ],
  [
    'Atkinson Hyperlegible',
    400,
    'italic',
    'node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-italic.woff2',
  ],
  [
    'Atkinson Hyperlegible',
    700,
    'italic',
    'node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-700-italic.woff2',
  ],
  [
    'IBM Plex Mono',
    500,
    'normal',
    'node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2',
  ],
  ['Noto Serif', 400, 'normal', '/usr/share/fonts/truetype/noto/NotoSerif-Regular.ttf'],
  ['Noto Serif', 700, 'normal', '/usr/share/fonts/truetype/noto/NotoSerif-Bold.ttf'],
  ['Noto Serif', 400, 'italic', '/usr/share/fonts/truetype/noto/NotoSerif-Italic.ttf'],
  ['Noto Serif', 700, 'italic', '/usr/share/fonts/truetype/noto/NotoSerif-BoldItalic.ttf'],
  [
    'Noto Serif Display',
    400,
    'normal',
    '/usr/share/fonts/truetype/noto/NotoSerifDisplay-Regular.ttf',
  ],
  ['Noto Serif Display', 700, 'normal', '/usr/share/fonts/truetype/noto/NotoSerifDisplay-Bold.ttf'],
  ['Kalam', 400, 'normal', path.join(here, 'fonts/Kalam-Regular.ttf')],
];
const fonts = (
  await Promise.all(
    fontFiles.map(async ([family, weight, style, file]) => {
      const data = (await readFile(path.resolve(root, file))).toString('base64');
      const format = file.endsWith('.woff2') ? 'woff2' : 'truetype';
      return `@font-face{font-family:'${family}';font-weight:${weight};font-style:${style};src:url('data:font/${format};base64,${data}') format('${format}');font-display:block;}`;
    }),
  )
).join('\n');

const running = (text) => `content: "${text.toUpperCase()}";`;
const box = `font-family: 'Barlow Condensed'; font-weight: 700; font-size: 8.5pt; letter-spacing: 0.14em; color: #4d5857;`;
const none =
  '@top-left { content: none; } @top-right { content: none; } @bottom-left { content: none; } @bottom-right { content: none; }';
const pages = `
@page { size: A4; margin: 20mm 22mm 18mm;
  @top-left { ${running(edition.title)} ${box} vertical-align: bottom; padding-bottom: 5mm; }
  @top-right { content: "GAMEMASTER EDITION"; ${box} vertical-align: bottom; padding-bottom: 5mm; }
  @bottom-left { content: "FANTASY CRUX 2.0 BETA"; ${box} vertical-align: top; padding-top: 5mm; }
  @bottom-right { content: counter(page); font-family: 'Barlow Condensed'; font-weight: 700; font-size: 10.5pt; color: #171c1d; vertical-align: top; padding-top: 4.4mm; }
}
@page cover { margin: 0; ${none} }
@page handout { @top-right { content: "PRINT AND PLAY"; ${box} vertical-align: bottom; padding-bottom: 5mm; } }
@page map { size: A4 landscape; margin: 10mm; ${none} }`;

const css = await readFile(path.join(here, 'adventure.css'), 'utf8');
const documentHtml = (folios) =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(edition.title)}: Gamemaster edition</title><style>${fonts}\n${pages}\n${css}</style></head><body><main class="book">${coverHtml}${contentsHtml(folios)}${chapterHtml.join('\n')}${gmMapPages.join('\n')}${printPages.map((page) => page.html).join('\n')}${licenceHtml}</main></body></html>`;

// ---- Typeset, check, print ------------------------------------------------------------------

const python3 = (...args) => execFileSync(python, ['-B', verifier, ...args], { encoding: 'utf8' });
const normal = (text) =>
  text.normalize('NFKD').toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();

function folioMap(outline) {
  const folios = new Map();
  let cursor = 0;
  const wanted = toc.flatMap((group) => [
    ...(group.first ? [] : [{ id: group.id, title: group.title }]),
    ...group.entries,
  ]);
  for (const entry of wanted) {
    const index = outline.findIndex(
      (item, at) => at >= cursor && normal(item.title) === normal(entry.title),
    );
    assert.ok(index >= 0, `The PDF outline has no "${entry.title}" after entry ${cursor}`);
    folios.set(entry.id, outline[index].page);
    cursor = index + 1;
  }
  return folios;
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
let report;
try {
  const context = await browser.newContext({ viewport: { width: 900, height: 1200 } });
  const page = await context.newPage();
  const typeset = async (html) => {
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    // Keep short tables whole; let long ones break between rows rather than leave a gap.
    await page.evaluate(() => {
      for (const table of document.querySelectorAll('.chapter table'))
        table.classList.toggle('keep', table.getBoundingClientRect().height < (55 * 96) / 25.4);
    });
  };

  // Pass 1: placeholder folios, to read where each heading lands.
  await typeset(documentHtml(null));
  await page.pdf({
    path: draft,
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
    outline: true,
  });
  const folios = folioMap(JSON.parse(python3('outline', draft)));

  // Pass 2: the finished book.
  const html = documentHtml(folios);
  await writeFile(path.join(review, `${name}.html`), html);
  await typeset(html);

  const ids = await page.evaluate(() => [...document.querySelectorAll('[id]')].map((el) => el.id));
  assert.equal(new Set(ids).size, ids.length, 'Duplicate ids');
  for (const href of links.filter((link) => link.startsWith('#')))
    assert.ok(ids.includes(href.slice(1)), `Broken internal link ${href}`);

  // The browser must show every word of every chapter.
  const shown = await page.evaluate(() =>
    Object.fromEntries(
      [...document.querySelectorAll('section.chapter[id]')].map((section) => {
        const head = section.querySelector('.chapter-head').innerText;
        return [section.id, section.innerText.slice(head.length)];
      }),
    ),
  );
  for (const [key, expected] of Object.entries(expectedChapters))
    assert.equal(letters(shown[key]), expected, `Chapter ${key} does not show all of its text`);

  // Layout, at the printed measure: nothing wider than the page, no type below its floor.
  const layout = await page.evaluate(() => {
    const book = document.querySelector('.book').getBoundingClientRect();
    const checked = [...document.querySelectorAll('.contents, .chapter, .print-page')];
    const problems = [];
    let minPt = Infinity;
    let smallest = '';
    for (const element of checked.flatMap((part) => [part, ...part.querySelectorAll('*')])) {
      if (element.closest('svg')) continue;
      const rect = element.getBoundingClientRect();
      if (rect.width && (rect.left < book.left - 1 || rect.right > book.right + 1))
        problems.push(
          `wider than the page: ${element.tagName} ${element.textContent.trim().slice(0, 60)}`,
        );
      if (
        ['PRE', 'TABLE', 'TD', 'TH'].includes(element.tagName) &&
        element.scrollWidth > element.clientWidth + 1
      )
        problems.push(`overflows: ${element.tagName} ${element.textContent.trim().slice(0, 60)}`);
      const hasText = [...element.childNodes].some(
        (node) => node.nodeType === 3 && node.textContent.trim(),
      );
      const pt = parseFloat(getComputedStyle(element).fontSize) * 0.75;
      if (hasText && !element.closest('.licence-text') && pt < minPt) {
        minPt = pt;
        smallest = `${element.tagName} ${element.textContent.trim().slice(0, 40)}`;
      }
    }
    return { problems, minPt, smallest };
  });
  assert.deepEqual(layout.problems, [], 'Layout problems');
  assert.ok(
    layout.minPt >= 9,
    `Type below 9 pt: ${layout.minPt.toFixed(2)} pt in ${layout.smallest}`,
  );

  const fontsLoaded = await page.evaluate(() =>
    [
      '700 20px "Barlow Condensed"',
      '400 16px "Atkinson Hyperlegible"',
      'italic 400 16px "Atkinson Hyperlegible"',
      '500 12px "IBM Plex Mono"',
      '400 16px "Noto Serif"',
      '700 16px "Noto Serif Display"',
      '400 16px "Kalam"',
    ].every((font) => document.fonts.check(font)),
  );
  assert.ok(fontsLoaded, 'A font did not load');
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  assert.deepEqual(
    axe.violations.map(
      (violation) => `${violation.id}: ${violation.nodes.map((node) => node.target).join(', ')}`,
    ),
    [],
    'Accessibility violations',
  );

  // Every block of text the reader can see must reach the PDF.
  const blocksShown = await page.evaluate(() =>
    [...document.querySelectorAll('.contents, .chapter, .print-page, .map-label')]
      .flatMap((part) => [
        ...part.querySelectorAll(
          'h1, h2, h3, p, li, th, td, pre, .token, .box, .track-labels span, .seal-slot',
        ),
      ])
      .filter((element) => !element.querySelector('p, li, pre, table, ul, ol'))
      .map((element) => element.innerText)
      .filter((text) => /[a-z]/i.test(text)),
  );

  await page.pdf({
    path: output,
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
    outline: true,
  });
  const tocEntries = toc.flatMap((group) => [
    ...(group.first ? [] : [{ id: group.id, title: group.title }]),
    ...group.entries,
  ]);
  const checks = {
    blocks: blocksShown,
    folios: tocEntries.map((entry) => [entry.title, folios.get(entry.id)]),
    landscape: Object.values(edition.maps).map(
      (map) => folios.get(`${map.id}--title`) ?? folios.get(map.id),
    ),
    sheets: printPages.map((page) => page.entries.map((entry) => folios.get(entry.id))),
    licencePage: folios.get('licence--title'),
    licence: decode(md.render(terms)) + ' ' + notice,
  };
  await writeFile(path.join(review, 'expected.json'), JSON.stringify(checks, null, 2) + '\n');
  report = JSON.parse(python3('check', output, path.join(review, 'expected.json'), review));
} finally {
  await browser.close();
}
console.log(JSON.stringify({ ...report, problems: report.problems }, null, 2));
assert.deepEqual(report.problems, [], 'The PDF failed its checks; see the review folder.');
console.log(output);
