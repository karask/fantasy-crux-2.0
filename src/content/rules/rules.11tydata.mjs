export default {
  eleventyComputed: {
    layout: (data) => {
      if (data.type === 'chapter') return 'layouts/chapter.njk';
      if (data.type === 'talent') return 'layouts/talent.njk';
      return 'layouts/rule.njk';
    },
    permalink: (data) => {
      if (data.type === 'chapter') return `/rules/${data.id}/index.html`;
      return `/rules/${data.chapter}/${data.slug}/index.html`;
    },
  },
};
