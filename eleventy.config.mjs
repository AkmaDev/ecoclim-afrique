import Image from "@11ty/eleventy-img";

export default function (eleventyConfig) {
  // Pages HTML statiques : copiées telles quelles
  ["css", "js", "assets", "admin", "robots.txt", "*.html"].forEach(p =>
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

  // Partage et référencement
  const SITE = "https://ecoclimafrique.com";
  eleventyConfig.addGlobalData("site", { url: SITE, name: "ECOCLIM AFRIQUE EXPERTISE" });
  eleventyConfig.addFilter("absUrl", u => (!u ? "" : /^https?:/.test(u) ? u : SITE + (u.startsWith("/") ? "" : "/") + u));
  // Description d'environ 155 caractères, coupée sur un mot
  eleventyConfig.addFilter("metaDesc", (t, max = 155) => {
    const s = String(t || "").replace(/\s+/g, " ").trim();
    if (s.length <= max) return s;
    return s.slice(0, s.lastIndexOf(" ", max)).replace(/[,;:.\s]+$/, "") + "…";
  });
  // Image de partage : copie JPEG (max 1200 px) lisible par WhatsApp, LinkedIn, Facebook
  eleventyConfig.addAsyncFilter("shareImage", async src => {
    const source = !src ? "./assets/images/hero.jpg" : /^https?:/.test(src) ? src : "." + (src.startsWith("/") ? src : "/" + src);
    try {
      const meta = await Image(source, { widths: [1200], formats: ["jpeg"], outputDir: "./_site/og/", urlPath: "/og/", sharpJpegOptions: { quality: 82 } });
      return SITE + meta.jpeg[0].url;
    } catch (e) {
      console.warn("[shareImage]", source, e.message);
      return SITE + "/assets/images/hero.jpg";
    }
  });
  eleventyConfig.addFilter("jsonString", s => JSON.stringify(String(s || "")));

  return {
    dir: { input: ".", includes: "_includes", output: "_site" },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: false
  };
}
