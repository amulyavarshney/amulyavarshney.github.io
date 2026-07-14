import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, ArrowRight, Command } from "lucide-react";
import { navItems, profile } from "@/data/portfolio";
import { useLangHref } from "@/components/LangLink";
import { useTheme } from "@/hooks/useTheme";

type Item = {
  id: string;
  label: string;
  hint?: string;
  action: () => void;
};

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const langHref = useLangHref();
  const { t } = useTranslation();
  const { toggle: toggleTheme } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === "k";
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setIdx(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const navGroup: Item[] = navItems.map((n) => ({
      id: `nav-${n.id}`,
      label: t(n.labelKey),
      hint: t("cmd.hintPage", { defaultValue: "Page" }),
      action: () => navigate(langHref(n.path)),
    }));

    const actions: Item[] = [
      {
        id: "theme",
        label: t("cmd.toggleTheme", { defaultValue: "Toggle theme" }),
        hint: t("cmd.hintAction", { defaultValue: "Action" }),
        action: () => toggleTheme(),
      },
      {
        id: "github",
        label: t("cmd.openGithub", { defaultValue: "Open GitHub" }),
        hint: t("cmd.hintExternal", { defaultValue: "External" }),
        action: () => window.open(profile.social.github, "_blank", "noopener"),
      },
      {
        id: "linkedin",
        label: t("cmd.openLinkedin", { defaultValue: "Open LinkedIn" }),
        hint: t("cmd.hintExternal", { defaultValue: "External" }),
        action: () => window.open(profile.social.linkedin, "_blank", "noopener"),
      },
      {
        id: "medium",
        label: t("cmd.openMedium", { defaultValue: "Open Medium" }),
        hint: t("cmd.hintExternal", { defaultValue: "External" }),
        action: () => window.open(profile.social.medium, "_blank", "noopener"),
      },
    ];

    return [...navGroup, ...actions];
  }, [t, navigate, langHref, toggleTheme]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return items;
    return items.filter((i) => i.label.toLowerCase().includes(ql));
  }, [items, q]);

  useEffect(() => {
    if (idx >= filtered.length) setIdx(0);
  }, [filtered.length, idx]);

  const run = (i: Item) => {
    i.action();
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((v) => Math.min(v + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((v) => Math.max(v - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[idx];
      if (item) run(item);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("cmd.title", { defaultValue: "Command palette" })}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
    >
      <button
        aria-label="Close"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-xl glass-strong rounded-2xl overflow-hidden shadow-2xl border border-border animate-fade-in">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIdx(0);
            }}
            onKeyDown={onKeyDown}
            placeholder={t("cmd.placeholder", { defaultValue: "Jump to a page, action…" })}
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            ESC
          </kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <li className="text-center text-sm text-muted-foreground py-6">
              {t("cmd.empty", { defaultValue: "No results" })}
            </li>
          )}
          {filtered.map((i, k) => (
            <li key={i.id}>
              <button
                onMouseEnter={() => setIdx(k)}
                onClick={() => run(i)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                  k === idx ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-muted/60"
                }`}
              >
                <span className="flex-1 truncate">{i.label}</span>
                {i.hint && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {i.hint}
                  </span>
                )}
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between px-3 py-2 border-t border-border text-[10px] font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
          <div className="flex items-center gap-3">
            <span>↑↓ {t("cmd.navigate", { defaultValue: "navigate" })}</span>
            <span>↵ {t("cmd.select", { defaultValue: "select" })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
