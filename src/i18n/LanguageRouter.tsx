import { useEffect } from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { languages } from "@/i18n";

const SUPPORTED = languages.map((l) => l.code);
const STORAGE_KEY = "lang";

/** Strip the `/:lang` prefix from a path, returning the rest (always starts with /). */
export const stripLangPrefix = (pathname: string): string => {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] && SUPPORTED.includes(parts[0])) {
    return "/" + parts.slice(1).join("/");
  }
  return pathname;
};

/** Build a path with the given lang prefix. */
export const withLang = (lang: string, path: string): string => {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${clean === "/" ? "" : clean}`;
};

/** Resolve the language to use when none is in the URL. */
const resolveInitialLang = (): string => {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED.includes(stored)) return stored;
  const nav = navigator.language?.slice(0, 2).toLowerCase();
  if (nav && SUPPORTED.includes(nav)) return nav;
  return "en";
};

/** Redirect `/` (or any path without a lang prefix) to the persisted/detected lang. */
export const RootRedirect = () => {
  const location = useLocation();
  const lang = resolveInitialLang();
  const target = withLang(lang, location.pathname + location.search + location.hash);
  return <Navigate to={target} replace />;
};

/** Layout for `/:lang/*` — keeps i18n + <html lang> + localStorage in sync with URL. */
export const LanguageRoute = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const location = useLocation();
  const valid = Boolean(lang && SUPPORTED.includes(lang));

  useEffect(() => {
    if (!valid || !lang) return;
    if (i18n.resolvedLanguage !== lang) {
      i18n.changeLanguage(lang);
    }
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore quota */
    }
    document.documentElement.lang = lang;
  }, [lang, i18n, valid]);

  // Invalid lang → the ":lang" segment is actually a page path (e.g. /portfolio).
  // Redirect to the detected lang, preserving the original path.
  if (!valid) {
    const fallback = resolveInitialLang();
    return <Navigate to={withLang(fallback, location.pathname)} replace />;
  }

  return <Outlet />;
};
