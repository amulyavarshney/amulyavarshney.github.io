import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Section } from "./Section";
import { curatedProjectMeta, profile } from "@/data/portfolio";
import { ExternalLink, Github, Star, GitFork, Search, Pin, Loader2, BookOpen } from "lucide-react";
import { Tilt3D } from "./Tilt3D";
import { Reveal } from "./Reveal";
import { LangLink } from "@/components/LangLink";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  updated_at: string;
  fork: boolean;
  archived: boolean;
};

const CATEGORY_FILTERS = ["All", "Featured", "Deployed", "AI", "Full Stack", "Backend"] as const;
const LANGUAGE_FILTERS = ["Python", "TypeScript", "JavaScript", "Java", "C#", "C", "Kotlin", "CSS", "Jupyter Notebook"] as const;
const FILTERS = [...CATEGORY_FILTERS, ...LANGUAGE_FILTERS] as const;
type Filter = typeof FILTERS[number];

const CACHE_KEY = "gh-repos-cache-v1";
const CACHE_TTL = 1000 * 60 * 30;

type Curated = { title: string; description: string };

export const Projects = () => {
  const { t } = useTranslation();
  const curated = t("projects.curated", { returnObjects: true }) as Curated[];
  const filterLabels = t("projects.filters", { returnObjects: true }) as Record<string, string>;

  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [q, setQ] = useState("");

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { ts, data } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) {
          setRepos(data);
          setLoading(false);
          return;
        }
      } catch {}
    }
    fetch(`https://api.github.com/users/${profile.githubUser}/repos?per_page=100&sort=updated&type=owner`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: Repo[]) => {
        const filtered = data.filter((r) => !r.fork && !r.archived);
        setRepos(filtered);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: filtered }));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const matchesFilter = (r: Repo) => {
    if (filter === "All") return true;
    const topics = (r.topics ?? []).map((tt) => tt.toLowerCase());
    const lang = (r.language ?? "").toLowerCase();
    const blob = `${r.name} ${r.description ?? ""} ${topics.join(" ")} ${lang}`.toLowerCase();
    if (filter === "AI") return /\b(ai|llm|rag|agent|ml|nlp|neural|gpt|embedding|langchain)\b/.test(blob);
    if (filter === "Backend") return /\b(api|backend|server|fastapi|spring|django|node|microservice|rest)\b/.test(blob);
    if (filter === "Full Stack") return /\b(full[- ]?stack|react|next|nest)\b/.test(blob);
    if (filter === "Featured") return r.stargazers_count >= 1;
    if (filter === "Deployed") return !!r.homepage;
    return lang === filter.toLowerCase();
  };

  const visible = useMemo(() => {
    if (!repos) return [];
    const ql = q.trim().toLowerCase();
    return repos.filter((r) => {
      if (!matchesFilter(r)) return false;
      if (!ql) return true;
      return `${r.name} ${r.description ?? ""}`.toLowerCase().includes(ql);
    });
  }, [repos, filter, q]);

  return (
    <Section
      id="projects"
      eyebrow={t("projects.eyebrow")}
      title={<>{t("projects.titlePre")} <span className="gradient-text">{t("projects.titleAccent")}</span></>}
      subtitle={t("projects.subtitle")}
    >
      <div className="grid md:grid-cols-2 gap-4 mb-10 perspective-1000">
        {curated.map((p, idx) => {
          const meta = curatedProjectMeta[idx];
          return (
            <Reveal key={p.title} delay={idx * 100}>
              <Tilt3D max={8} className="h-full">
                <article className="glass rounded-2xl p-6 gradient-border relative overflow-hidden group transition-spring h-full">
                  <div className="absolute -top-20 -right-20 w-56 h-56 bg-secondary/15 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-2 mb-2 tilt-card-inner">
                    <Pin className="w-3.5 h-3.5 text-accent" />
                    <span className="text-[10px] uppercase tracking-widest font-mono text-accent">{t("projects.curatedBadge")}</span>
                  </div>
                  <h3 className="relative font-display font-semibold text-lg leading-snug tilt-card-inner">{p.title}</h3>
                  <p className="relative text-sm text-muted-foreground mt-2 leading-relaxed">{p.description}</p>
                  <div className="relative flex flex-wrap gap-1.5 mt-4">
                    {meta?.stack.map((s) => (
                      <span key={s} className="text-[11px] px-2 py-1 rounded-md glass font-mono">{s}</span>
                    ))}
                  </div>
                  <div className="relative flex gap-3 mt-5 pt-4 border-t border-border">
                    <a href={meta?.github} target="_blank" rel="noreferrer noopener"
                       className="inline-flex items-center gap-1.5 text-xs font-medium hover:text-primary transition-colors">
                      <Github className="w-3.5 h-3.5" /> {t("common.code")}
                    </a>
                    {meta?.caseStudy && (
                      <LangLink
                        to={`/projects/case-study/${meta.caseStudy}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                      >
                        <BookOpen className="w-3.5 h-3.5" /> {t("common.caseStudy", { defaultValue: "Read case study" })}
                      </LangLink>
                    )}
                  </div>
                </article>
              </Tilt3D>
            </Reveal>
          );
        })}
      </div>

      <div className="glass rounded-2xl p-3 mb-6 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("projects.searchPlaceholder")}
            aria-label={t("projects.searchPlaceholder")}
            className="w-full bg-transparent pl-9 pr-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="flex flex-nowrap md:flex-wrap gap-1 items-center overflow-x-auto snap-x scroll-px-2 -mx-1 px-1 md:mx-0 md:px-0 md:overflow-visible">
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 snap-start text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {filterLabels[f] ?? f}
            </button>
          ))}
          <select
            value={(LANGUAGE_FILTERS as readonly string[]).includes(filter) ? filter : ""}
            onChange={(e) => setFilter((e.target.value || "All") as Filter)}
            aria-label={t("projects.languageFilter", { defaultValue: "Filter by language" })}
            className={`shrink-0 text-xs px-3 py-1.5 pr-7 rounded-lg font-medium border cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors bg-[right_0.5rem_center] bg-no-repeat bg-[length:0.75rem] ${
              (LANGUAGE_FILTERS as readonly string[]).includes(filter)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-muted"
            }`}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'/%3e%3c/svg%3e\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "0.75rem",
            }}
          >
            <option value="" style={{ background: "hsl(var(--background))", color: "hsl(var(--foreground))" }}>
              {t("projects.languageFilter", { defaultValue: "Language" })}
            </option>
            {LANGUAGE_FILTERS.map((f) => (
              <option key={f} value={f} style={{ background: "hsl(var(--background))", color: "hsl(var(--foreground))" }}>
                {filterLabels[f] ?? f}
              </option>
            ))}
          </select>
        </div>

      </div>

      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-5 h-44 animate-pulse">
              <div className="h-4 w-2/3 bg-muted rounded mb-3" />
              <div className="h-3 w-full bg-muted rounded mb-1.5" />
              <div className="h-3 w-4/5 bg-muted rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="glass rounded-2xl p-8 text-center">
          <Loader2 className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {t("projects.errorPre")}{" "}
            <a className="text-primary hover:underline" href={profile.social.github} target="_blank" rel="noreferrer noopener">
              github.com/{profile.githubUser}
            </a>
            .
          </p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="text-xs font-mono text-muted-foreground mb-3">
            {t("projects.showing", { defaultValue: "Showing" })} {visible.length} / {repos?.length ?? 0}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((r) => {
              const thumb = `https://opengraph.githubassets.com/1/${profile.githubUser}/${r.name}`;
              return (
                <article key={r.id} className="glass rounded-2xl overflow-hidden group hover:-translate-y-1 transition-spring flex flex-col">
                  <a href={r.html_url} target="_blank" rel="noreferrer noopener" className="relative block aspect-[16/8] overflow-hidden border-b border-border bg-muted">
                    <img
                      src={thumb}
                      alt={`${r.name} preview`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
                    {r.stargazers_count >= 1 && (
                      <span className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded-md glass font-mono inline-flex items-center gap-1">
                        <Star className="w-3 h-3" /> {r.stargazers_count}
                      </span>
                    )}
                  </a>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-semibold text-sm leading-snug group-hover:text-primary transition-colors">{r.name}</h3>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3 min-h-[3rem]">
                      {r.description || t("projects.noDescription")}
                    </p>
                    {r.topics && r.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {r.topics.slice(0, 5).map((tp) => (
                          <span key={tp} className="text-[10px] px-1.5 py-0.5 rounded bg-muted/60 font-mono text-muted-foreground">{tp}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border text-[11px] text-muted-foreground font-mono">
                      {r.language && (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-primary" /> {r.language}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1"><GitFork className="w-3 h-3" /> {r.forks_count}</span>
                      <span className="ml-auto">{new Date(r.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <a href={r.html_url} target="_blank" rel="noreferrer noopener"
                         className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md glass hover:text-primary transition-colors">
                        <Github className="w-3.5 h-3.5" /> {t("common.code")}
                      </a>
                      {r.homepage && (
                        <a href={r.homepage} target="_blank" rel="noreferrer noopener"
                           className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                          <ExternalLink className="w-3.5 h-3.5" /> {t("common.liveDemo", { defaultValue: "Live Demo" })}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
            {visible.length === 0 && (
              <div className="md:col-span-2 lg:col-span-3 glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
                {t("projects.noResults")}
              </div>
            )}
          </div>
        </>
      )}
    </Section>
  );
};
