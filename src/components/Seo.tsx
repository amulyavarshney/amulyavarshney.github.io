import { Helmet } from "react-helmet-async";
import { useParams, useLocation } from "react-router-dom";
import { languages } from "@/i18n";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  absoluteUrl,
  langUrl,
} from "@/lib/site";

interface SeoProps {
  title: string;
  description: string;
  /** Path without lang prefix, starting with "/" (e.g. "/", "/projects"). */
  path: string;
  type?: "website" | "article" | "profile";
  /** Set true on pages that should not appear in search results (e.g. 404). */
  noindex?: boolean;
  /** Optional absolute or site-relative URL for og:image / twitter:image. */
  image?: string;
  /** Optional keywords for search / answer engines. */
  keywords?: string | string[];
  /** Optional JSON-LD structured data for the page. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const ogLocale = (lang: string) => {
  const map: Record<string, string> = {
    en: "en_US",
    hi: "hi_IN",
    de: "de_DE",
    fr: "fr_FR",
    es: "es_ES",
  };
  return map[lang] ?? "en_US";
};

export const Seo = ({
  title,
  description,
  path,
  type = "website",
  noindex = false,
  image,
  keywords,
  jsonLd,
}: SeoProps) => {
  const { lang = "en" } = useParams<{ lang: string }>();
  const { hash } = useLocation();
  const suffix = path === "/" ? "" : path;
  const canonical = langUrl(lang, path);
  const ogUrl = `${canonical}${hash || ""}`;
  const imageUrl = absoluteUrl(image || DEFAULT_OG_IMAGE);
  const keywordStr = Array.isArray(keywords) ? keywords.join(", ") : keywords;
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const ogType = type === "profile" ? "profile" : type === "article" ? "article" : "website";

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={SITE_NAME} />
      {keywordStr && <meta name="keywords" content={keywordStr} />}
      <meta
        name="robots"
        content={noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"}
      />
      <meta name="googlebot" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" type="text/plain" title="LLM instructions" href={`${SITE_URL}/llms.txt`} />

      {/* hreflang alternates for every supported language + x-default */}
      {languages.map((l) => (
        <link
          key={l.code}
          rel="alternate"
          hrefLang={l.code}
          href={langUrl(l.code, path)}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={langUrl("en", path)} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={ogLocale(lang)} />
      {languages
        .filter((l) => l.code !== lang)
        .map((l) => (
          <meta key={l.code} property="og:locale:alternate" content={ogLocale(l.code)} />
        ))}
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={title} />

      {type === "article" && <meta property="article:author" content={SITE_NAME} />}

      {ldArray.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};
