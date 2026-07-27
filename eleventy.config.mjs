import { HtmlBasePlugin } from '@11ty/eleventy';
import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItDeflist from 'markdown-it-deflist';
import markdownItFootnote from 'markdown-it-footnote';
import * as pagefind from 'pagefind';

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

  markdown.renderer.rules.table_open = () => '<div class="table-wrap" tabindex="0"><table>';
  markdown.renderer.rules.table_close = () => '</table></div>';

  eleventyConfig.setLibrary('md', markdown);
  eleventyConfig.addWatchTarget('src/assets/');
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
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
        .map((item) => [`/rules/${item.data.chapter}/#${item.data.slug}`, item.data.title]),
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
