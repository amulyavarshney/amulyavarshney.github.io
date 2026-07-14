import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { navItems } from "@/data/portfolio";
import { useTheme } from "@/hooks/useTheme";
import { useLangHref } from "@/components/LangLink";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const Navbar = () => {
  const { theme, toggle } = useTheme();
  const { t } = useTranslation();
  const langHref = useLangHref();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <nav
        className={cn(
          "mx-auto max-w-6xl px-4 sm:px-6 transition-all duration-300",
          scrolled && "glass rounded-2xl mx-3 sm:mx-auto"
        )}
      >
        <div className="flex items-center justify-between h-14">
          <Link to={langHref("/")} className="flex items-center gap-2 group" aria-label="Home">
            <div className="relative w-9 h-9 rounded-xl glass-strong grid place-items-center overflow-hidden">
              <Sparkles className="w-4 h-4 text-primary relative z-10" />
              <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-primary/30 to-secondary/30 animate-pulse-glow" />
            </div>
            <span className="font-display font-semibold text-sm tracking-tight hidden sm:inline">
              Amulya<span className="text-primary">.</span>
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-1 glass rounded-full px-2 py-1">
            {navItems.map((n) => (
              <li key={n.id}>
                <NavLink
                  to={langHref(n.path)}
                  end={n.path === "/"}
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-1.5 text-xs font-medium rounded-full transition-all inline-block",
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )
                  }
                >
                  {t(n.labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))
              }
              aria-label={t("cmd.open", { defaultValue: "Open command palette" })}
              title="⌘K"
              className="hidden md:inline-flex items-center gap-2 h-10 px-3 rounded-xl glass text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{t("cmd.search", { defaultValue: "Search" })}</span>
              <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted">⌘K</kbd>
            </button>
            <LanguageSwitcher />
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="w-10 h-10 rounded-xl glass grid place-items-center hover:text-primary transition-spring hover:scale-110"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              className="lg:hidden w-10 h-10 rounded-xl glass grid place-items-center"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {open && (
          <div className="lg:hidden mt-2 glass-strong rounded-2xl p-3 animate-fade-in">
            <ul className="grid grid-cols-2 gap-1">
              {navItems.map((n) => (
                <li key={n.id}>
                  <NavLink
                    to={langHref(n.path)}
                    end={n.path === "/"}
                    className={({ isActive }) =>
                      cn(
                        "block w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors",
                        isActive ? "bg-primary/15 text-primary" : "hover:bg-muted"
                      )
                    }
                  >
                    {t(n.labelKey)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};
