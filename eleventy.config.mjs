export default function (eleventyConfig) {
  // Pages HTML statiques : copiées telles quelles
  ["css", "js", "assets", "admin", "robots.txt", "sitemap.xml", "*.html"].forEach(p =>
    eleventyConfig.addPassthroughCopy(p)
  );

  // Articles publiés (les brouillons sont exclus)
  eleventyConfig.addCollection("posts", api =>
    api.getFilteredByGlob("_posts/*.md")
      .filter(p => !p.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  const fmt = opts => d => {
    const s = new Intl.DateTimeFormat("fr-FR", { ...opts, timeZone: "UTC" }).format(new Date(d));
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  eleventyConfig.addFilter("moisAnnee", fmt({ month: "long", year: "numeric" }));
  eleventyConfig.addFilter("dateLongue", fmt({ day: "numeric", month: "long", year: "numeric" }));
  eleventyConfig.addFilter("head", (arr, n) => arr.slice(0, n));
  eleventyConfig.addFilter("isoDate", d => new Date(d).toISOString().slice(0, 10));

  return {
    dir: { input: ".", includes: "_includes", output: "_site" },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: false
  };
}
