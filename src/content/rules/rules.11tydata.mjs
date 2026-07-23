export default {
  eleventyComputed: {
    // Rules and Talents are published inside their chapter page, never as standalone pages.
    layout: (data) => (data.type === 'chapter' ? 'layouts/chapter.njk' : false),
    permalink: (data) => (data.type === 'chapter' ? `/rules/${data.id}/index.html` : false),
    anchorUrl: (data) =>
      data.type === 'chapter' ? `/rules/${data.id}/` : `/rules/${data.chapter}/#${data.slug}`,
  },
};
