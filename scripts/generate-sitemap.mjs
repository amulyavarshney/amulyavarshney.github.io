// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://amulyavarshney.github.io";

const LANGS = ["en", "hi", "de", "fr", "es"];
const PATHS = [
  "",
  "portfolio",
  "projects",
  "services",
  "playground",
  "blogs",
  "blogs/applied-ai-engineer-roadmap",
  "blogs/qdrant-fastapi-grpc-guide",
  "blogs/ai-engineer-job-requirements",
  "blogs/multi-agent-eval-guide",
  "contact",
  "projects/case-study/payroll-intelligence-agent",
  "projects/case-study/ray-fintech-concierge",
];

const entries = PATHS.map((p) => {
  const canonical = p ? `/${p}` : `/`;
  return {
    path: canonical,
    changefreq: "weekly",
    priority: p === "" ? "1.0" : "0.8",
    alternates: [
      ...LANGS.map((l) => ({ lang: l, href: p ? `/${l}/${p}` : `/${l}` })),
      { lang: "x-default", href: canonical },
    ],
  };
});

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      `    <changefreq>${e.changefreq}</changefreq>`,
      `    <priority>${e.priority}</priority>`,
      ...e.alternates.map(
        (a) =>
          `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${BASE_URL}${a.href}" />`,
      ),
      `  </url>`,
    ].join("\n"),
  ),
  `</urlset>`,
].join("\n");

writeFileSync(resolve(__dirname, "../public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries)`);
