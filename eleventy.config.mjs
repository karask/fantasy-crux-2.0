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
        symbol: '<span aria-hidden="true">#</span>',
        placement: 'after',
        class: 'heading-anchor',
        ariaHidden: false,
        renderAttrs: () => ({
          'aria-label': 'Link to this section',
          'data-pagefind-ignore': '',
        }),
      }),
    });

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
  eleventyConfig.addCollection('quickReference', (collection) =>
    collection
      .getAll()
      .filter((item) => item.data.quickReference)
      .sort(
        (left, right) =>
          left.data.quickReference.group.localeCompare(right.data.quickReference.group) ||
          left.data.quickReference.order - right.data.quickReference.order,
      ),
  );

  eleventyConfig.addFilter('summaryText', (value) =>
    Array.isArray(value) ? value.join(' ') : (value ?? ''),
  );
  eleventyConfig.addFilter('chapterRules', (items, chapter) =>
    (items ?? []).filter((item) => item.data.chapter === chapter).sort(byOrder),
  );
  eleventyConfig.addFilter('quickGroup', (items, group) =>
    (items ?? []).filter((item) => item.data.quickReference.group === group),
  );
  eleventyConfig.addFilter('navCurrent', (pageUrl, href) =>
    href === '/' ? pageUrl === '/' : pageUrl?.startsWith(href),
  );
  eleventyConfig.addFilter('padChapter', (value) => String(value).padStart(2, '0'));
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
