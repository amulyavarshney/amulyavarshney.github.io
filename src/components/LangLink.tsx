import { forwardRef } from "react";
import { Link, LinkProps, useParams } from "react-router-dom";
import { withLang } from "@/i18n/LanguageRouter";

/** <Link> that automatically prepends the current `/:lang` from the URL. */
export const LangLink = forwardRef<HTMLAnchorElement, LinkProps>(({ to, ...rest }, ref) => {
  const { lang } = useParams<{ lang: string }>();
  const path = typeof to === "string" ? to : (to as { pathname?: string }).pathname ?? "/";
  return <Link ref={ref} to={withLang(lang ?? "en", path)} {...rest} />;
});
LangLink.displayName = "LangLink";

/** Build a lang-prefixed href string (for use in non-Link contexts). */
export const useLangHref = () => {
  const { lang } = useParams<{ lang: string }>();
  return (path: string) => withLang(lang ?? "en", path);
};
