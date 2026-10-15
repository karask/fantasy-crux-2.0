import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { HtmlBasePlugin } from '@11ty/eleventy';
import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItDeflist from 'markdown-it-deflist';
import markdownItFootnote from 'markdown-it-footnote';
import * as pagefind from 'pagefind';
import downloads from './src/_data/downloads.mjs';

const diagramDirectory = path.resolve('src/assets/diagrams');
const diagramCache = new Map();

function diagramName(source) {
  return /(?:^|\/)assets\/diagrams\/([a-z0-9-]+)\.svg$/.exec(source ?? '')?.[1];
}

function diagramSvg(name) {
  if (!diagramCache.has(name)) {
    const file = path.join(diagramDirectory, `${name}.svg`);
    if (!existsSync(file))
      throw new Error(`Missing rules diagram ${name}.svg; run npm run diagrams:build`);
    diagramCache.set(name, readFileSync(file, 'utf8').trim());
  }
  return diagramCache.get(name);
}

function escapeAttribute(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}

function verdictFor(cell) {
  const answer = cell.trim();
  if (/^(?:Yes|All)\b/.test(answer)) return /-\d+P/.test(answer) ? 'partial' : 'yes';
  if (/^(?:No|None)\b/.test(answer)) return 'no';
  if (/^Half\b/.test(answer)) return 'partial';
  return null;
}

const byOrder = (left, right) =>
  (left.data.order ?? 999) - (right.data.order ?? 999) ||
  left.data.title.localeCompare(right.data.title);
const sitePathPrefix = process.env.FANTASY_CRUX_PATH_PREFIX ?? '/';

export default function configure(eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin, { baseHref: sitePathPrefix });

  const markdown = markdownIt({
    html: false,
    linkify: true,
    typographer: true,
  })
    .use(markdownItAttrs)
    .use(markdownItDeflist)
    .use(markdownItFootnote)
    .use(markdownItAnchor, {
      level: [2, 3],
      permalink: markdownItAnchor.permalink.linkInsideHeader({
        symbol: '',
        placement: 'after',
        class: 'heading-anchor',
        ariaHidden: false,
        renderAttrs: () => ({
          'aria-label': 'Link to this section',
          'data-pagefind-ignore': '',
        }),
      }),
    });

  // Smart quotes stay on, but the (c)/(tm)/-- substitutions do not: they would rewrite the
  // clause markers in the Open Game License. No rules content depends on them.
  markdown.disable('replacements');

  markdown.renderer.rules.table_open = (tokens, index, _options, _env, self) =>
    `<div class="table-wrap" tabindex="0"><table${self.renderAttrs(tokens[index])}>`;
  markdown.renderer.rules.table_close = () => '</table></div>';

  // A table marked {.verdicts} answers "can X do Y?" questions. Tag each answer cell by its
  // opening word so CSS can tint it; the word itself still carries the meaning.
  markdown.core.ruler.push('verdict_cells', (state) => {
    let inVerdictTable = false;
    state.tokens.forEach((token, index) => {
      if (token.type === 'table_open') {
        inVerdictTable = (token.attrGet('class') ?? '').split(/\s+/).includes('verdicts');
      } else if (token.type === 'table_close') {
        inVerdictTable = false;
      } else if (inVerdictTable && token.type === 'td_open') {
        const verdict = verdictFor(state.tokens[index + 1]?.content ?? '');
        if (verdict) token.attrSet('data-verdict', verdict);
      }
    });
  });

  // Rules prose may embed only generated diagrams, each as its own paragraph. The SVG is
  // inlined so it uses the site's fonts; anything else fails the build.
  markdown.core.ruler.push('rule_diagrams', (state) => {
    state.tokens.forEach((token, index) => {
      const images = token.children?.filter((child) => child.type === 'image') ?? [];
      if (!images.length) return;
      const [image] = images;
      const name = diagramName(image.attrGet('src'));
      const alone = token.children.every(
        (child) => child === image || (child.type === 'text' && !child.content.trim()),
      );
      if (!name || !alone || state.tokens[index - 1]?.type !== 'paragraph_open') {
        throw new Error(
          `Rules may only embed a diagram from assets/diagrams/ as its own paragraph: ${image.attrGet('src')}`,
        );
      }
      state.tokens[index - 1].hidden = true;
      state.tokens[index + 1].hidden = true;
      image.meta = { ...image.meta, diagram: name };
    });
  });

  markdown.renderer.rules.image = (tokens, index) => {
    const image = tokens[index];
    const alt = image.children.map((child) => child.content).join('');
    const caption = image.attrGet('title');
    const svg = diagramSvg(image.meta.diagram).replace(
      '<svg ',
      `<svg class="rule-diagram__art" role="img" aria-label="${escapeAttribute(alt)}" `,
    );
    return (
      `<figure class="rule-diagram" data-pagefind-ignore>${svg}` +
      (caption ? `<figcaption>${markdown.utils.escapeHtml(caption)}</figcaption>` : '') +
      '</figure>\n'
    );
  };

  eleventyConfig.setLibrary('md', markdown);
  eleventyConfig.on('eleventy.before', () => diagramCache.clear());
  eleventyConfig.addWatchTarget('src/assets/');
  eleventyConfig.addWatchTarget('art/library/chapters/');
  eleventyConfig.addPassthroughCopy('CNAME');
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  for (const download of downloads) {
    eleventyConfig.addPassthroughCopy({
      [download.source]: `downloads/${download.filename}`,
    });
    eleventyConfig.addWatchTarget(download.source);
  }
  eleventyConfig.addPassthroughCopy({
    'node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2':
      'assets/fonts/barlow-condensed-600.woff2',
    'node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2':
      'assets/fonts/barlow-condensed-700.woff2',
    'node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-normal.woff2':
      'assets/fonts/atkinson-400.woff2',
    'node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-italic.woff2':
      'assets/fonts/atkinson-400-italic.woff2',
    'node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-700-normal.woff2':
      'assets/fonts/atkinson-700.woff2',
    'node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2':
      'assets/fonts/ibm-plex-mono-500.woff2',
  });

  eleventyConfig.on('eleventy.after', async ({ directories }) => {
    const { errors: createErrors, index } = await pagefind.createIndex({
      rootSelector: '[data-pagefind-body]',
    });
    if (!index || createErrors.length) {
      throw new Error(`Pagefind could not create an index: ${createErrors.join('; ')}`);
    }

    const indexed = await index.addDirectory({ path: directories.output });
    const generated = await index.getFiles();
    const written = await index.writeFiles({
      outputPath: `${directories.output}/pagefind`,
    });
    await index.deleteIndex();

    const errors = [...indexed.errors, ...generated.errors, ...written.errors];
    if (errors.length) {
      throw new Error(`Pagefind indexing failed: ${errors.join('; ')}`);
    }

    const searchablePages = generated.files.filter(({ path }) =>
      path.startsWith('fragment/'),
    ).length;
    console.log(
      `Pagefind wrote ${searchablePages} searchable pages after scanning ${indexed.page_count} HTML files.`,
    );
  });

  eleventyConfig.addCollection('chapters', (collection) =>
    collection
      .getAll()
      .filter((item) => item.data.type === 'chapter')
      .sort(byOrder),
  );
  eleventyConfig.addCollection('rules', (collection) =>
    collection
      .getAll()
      .filter((item) => item.data.type === 'rule')
      .sort(byOrder),
  );
  eleventyConfig.addCollection('talents', (collection) =>
    collection
      .getAll()
      .filter((item) => item.data.type === 'talent')
      .sort(byOrder),
  );
  eleventyConfig.addCollection('creatures', (collection) =>
    collection
      .getAll()
      .filter((item) => item.data.type === 'creature')
      .sort(byOrder),
  );

  // Maps every in-chapter anchor back to its rule title so search results stay rule-level.
  eleventyConfig.addCollection('sectionTitles', (collection) =>
    Object.fromEntries(
      collection
        .getAll()
        .filter((item) => ['rule', 'talent', 'creature'].includes(item.data.type))
        .flatMap((item) =>
          [item.data.slug, ...(item.data.legacySlugs ?? [])].map((slug) => [
            `/rules/${item.data.chapter}/#${slug}`,
            item.data.title,
          ]),
        ),
    ),
  );

  // Rules are rendered inside their chapter page, so their headings drop one level and
  // every id/fragment is namespaced by the rule slug to stay unique across the chapter.
  eleventyConfig.addFilter('inlineSection', (html, slug) =>
    String(html ?? '')
      .replace(/<(\/?)h([2-5])\b/g, (_match, close, level) => `<${close}h${Number(level) + 1}`)
      .replace(/\bid="([^"]+)"/g, (_match, id) => `id="${slug}--${id}"`)
      .replace(/\bhref="#([^"]+)"/g, (_match, id) => `href="#${slug}--${id}"`),
  );

  // Chapter illustrations belong beside a specific piece of rules prose, not at the top of
  // every chapter. Fail the build if an authored target moves so art cannot drift silently.
  eleventyConfig.addFilter('placeAfterHeading', (html, targetId, markup) => {
    const escapedId = String(targetId).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const heading = new RegExp(
      `<h([2-6])\\b(?=[^>]*\\bid="${escapedId}")[^>]*>[\\s\\S]*?<\\/h\\1>`,
    );
    const content = String(html ?? '');

    if (!heading.test(content)) {
      throw new Error(`Chapter art target heading not found: ${targetId}`);
    }

    return content.replace(heading, (matched) => `${matched}\n${String(markup ?? '')}`);
  });

  // Profile values keep their authored Markdown, so dice such as `1D6 + DM` stay code spans.
  eleventyConfig.addFilter('inlineMarkdown', (value) => markdown.renderInline(String(value ?? '')));

  eleventyConfig.addFilter('summaryText', (value) =>
    Array.isArray(value) ? value.join(' ') : (value ?? ''),
  );
  eleventyConfig.addFilter('chapterRules', (items, chapter) =>
    (items ?? []).filter((item) => item.data.chapter === chapter).sort(byOrder),
  );
  eleventyConfig.addFilter('navCurrent', (pageUrl, href) =>
    href === '/' ? pageUrl === '/' : pageUrl?.startsWith(href),
  );
  // Chapters pad to two digits; non-numeric markers such as QR or § stand as written.
  eleventyConfig.addFilter('padChapter', (value) =>
    typeof value === 'number' ? String(value).padStart(2, '0') : String(value),
  );
  eleventyConfig.addFilter('json', (value) => JSON.stringify(value));

  return {
    pathPrefix: sitePathPrefix,
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
    markdownTemplateEngine: false,
    htmlTemplateEngine: 'njk',
    templateFormats: ['md', 'njk'],
  };
}
