module.exports = {
  layout: "article.njk",
  eleventyComputed: {
    // Un brouillon n'est jamais généré
    permalink: data => (data.draft ? false : `/actualites/${data.page.fileSlug}/`)
  }
};
