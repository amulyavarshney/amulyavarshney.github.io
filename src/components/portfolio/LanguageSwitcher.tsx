import { useEffect, useRef, useState } from "react";
import { Languages, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { languages } from "@/i18n";
import { stripLangPrefix, withLang } from "@/i18n/LanguageRouter";
import { cn } from "@/lib/utils";

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang: urlLang } = useParams<{ lang: string }>();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const activeCode = urlLang ?? i18n.resolvedLanguage ?? "en";
  const current = languages.find((l) => l.code === activeCode) ?? languages[0];

  const switchTo = (code: string) => {
    const rest = stripLangPrefix(location.pathname);
    navigate(withLang(code, rest) + location.search + location.hash);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t("common.language")}
        aria-haspopup="menu"
        aria-expanded={open}
        className="h-10 px-2.5 rounded-xl glass grid grid-flow-col auto-cols-max items-center gap-1.5 hover:text-primary transition-spring hover:scale-105"
      >
        <Languages className="w-4 h-4" />
        <span className="text-xs font-mono uppercase tracking-wider">{current.code}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 glass-strong rounded-xl p-1.5 animate-fade-in z-50"
        >
          {languages.map((l) => {
            const active = l.code === activeCode;
            return (
              <button
                key={l.code}
                role="menuitem"
                onClick={() => switchTo(l.code)}
                className={cn(
                  "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors",
                  active ? "bg-primary/15 text-primary" : "hover:bg-muted"
                )}
              >
                <span className="text-base leading-none">{l.flag}</span>
                <span className="flex-1 text-left">{l.label}</span>
                {active && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
