import { profile } from "@/data/portfolio";

/** Canonical origin for this GitHub Pages site. */
export const SITE_URL = "https://amulyavarshney.github.io";

/** Default social / Open Graph image (absolute). */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const SITE_NAME = "Amulya Varshney";

export const SITE_DESCRIPTION =
  "Software Engineer 2 (Applied AI) in Bangalore. Builds multi-agent systems, RAG pipelines, LLMOps, and production full-stack products.";

export const KNOWS_ABOUT = [
  "Applied AI",
  "AI agents",
  "Multi-agent systems",
  "RAG",
  "LLMOps",
  "LangGraph",
  "Evaluation pipelines",
  "Full-stack engineering",
  "Python",
  "TypeScript",
] as const;

/** Turn a site path into an absolute URL. */
export const absoluteUrl = (path = "/"): string => {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
};

/** Absolute URL for a language-prefixed route. */
export const langUrl = (lang: string, path = "/"): string => {
  const suffix = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return absoluteUrl(`/${lang}${suffix}`);
};

export const personJsonLd = (lang = "en") => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: profile.name,
  jobTitle: "Software Engineer 2 — Applied AI",
  description: SITE_DESCRIPTION,
  url: langUrl(lang, "/"),
  image: DEFAULT_OG_IMAGE,
  homeLocation: {
    "@type": "Place",
    name: profile.location,
  },
  knowsAbout: [...KNOWS_ABOUT],
  sameAs: [profile.social.github, profile.social.linkedin, profile.social.medium],
  worksFor: {
    "@type": "Organization",
    name: "Intuit",
  },
});

export const websiteJsonLd = (lang = "en") => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: "Amulya Varshney Portfolio",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: ["en", "hi", "de", "fr", "es"],
  publisher: { "@id": `${SITE_URL}/#person` },
  about: { "@id": `${SITE_URL}/#person` },
  mainEntity: { "@id": `${SITE_URL}/#person` },
  potentialAction: {
    "@type": "ReadAction",
    target: langUrl(lang, "/"),
  },
});

export const profilePageJsonLd = (lang = "en") => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${langUrl(lang, "/")}/#profilepage`,
  url: langUrl(lang, "/"),
  name: `${profile.name} — Applied AI Engineer`,
  description: SITE_DESCRIPTION,
  mainEntity: { "@id": `${SITE_URL}/#person` },
  inLanguage: lang,
  isPartOf: { "@id": `${SITE_URL}/#website` },
});

/** Common Q&A for answer engines (must match public site facts). */
export const homeFaqJsonLd = (lang = "en") => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${langUrl(lang, "/")}/#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "Who is Amulya Varshney?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Amulya Varshney is a Software Engineer 2 in Applied AI, based in Bangalore, India. He builds multi-agent systems, RAG pipelines, LLMOps, and production full-stack products.",
      },
    },
    {
      "@type": "Question",
      name: "What does Amulya Varshney specialize in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Applied AI engineering: AI agents and multi-agent workflows, retrieval-augmented generation (RAG), LLMOps and evaluation pipelines, plus backend and full-stack product engineering.",
      },
    },
    {
      "@type": "Question",
      name: "Where does Amulya Varshney work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Amulya currently works at Intuit on Applied AI.",
      },
    },
    {
      "@type": "Question",
      name: "How can I contact Amulya Varshney?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use the secure contact form on https://amulyavarshney.github.io/en/contact. Profiles: GitHub (amulyavarshney), LinkedIn (varamu), and Medium (@amulyavarshney7).",
      },
    },
  ],
});

export const breadcrumbJsonLd = (
  lang: string,
  items: { name: string; path: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: langUrl(lang, item.path),
  })),
});
