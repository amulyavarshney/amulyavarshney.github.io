import { Helmet } from "react-helmet-async";
import { useParams, useLocation } from "react-router-dom";
import { languages } from "@/i18n";

interface SeoProps {
  title: string;
  description: string;
  /** Path without lang prefix, starting with "/" (e.g. "/", "/projects"). */
  path: string;
  type?: "website" | "article" | "profile";
  /** Set true on pages that should not appear in search results (e.g. 404). */
  noindex?: boolean;
  /** Optional absolute URL for og:image / twitter:image. */
  image?: string;
  /** Optional JSON-LD structured data for the page. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export const Seo = ({
  title,
  description,
  path,
  type = "website",
  noindex = false,
  image,
  jsonLd,
}: SeoProps) => {
  const { lang = "en" } = useParams<{ lang: string }>();
  const { hash } = useLocation();
  const suffix = path === "/" ? "" : path;
  const url = `/${lang}${suffix}${hash || ""}`;
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* hreflang alternates for every supported language + x-default */}
      {languages.map((l) => (
        <link
          key={l.code}
          rel="alternate"
          hrefLang={l.code}
          href={`/${l.code}${suffix}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`/en${suffix}`} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={lang} />
      {image && <meta property="og:image" content={image} />}
      {image && <meta property="og:image:alt" content={title} />}

      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {ldArray.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};
