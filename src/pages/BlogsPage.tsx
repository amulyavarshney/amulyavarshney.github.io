import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ArrowUpRight, BookOpen, Clock, Sparkles } from "lucide-react";
import { Section } from "@/components/portfolio/Section";
import { Seo } from "@/components/Seo";
import { profile } from "@/data/portfolio";

type Post = {
  title: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
  categories?: string[];
  description?: string;
};

const stripHtml = (html: string) =>
  html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

const extractThumb = (html: string) => {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1];
};

const BlogsPage = () => {
  const { t, i18n } = useTranslation();
  const { lang = "en" } = useParams<{ lang: string }>();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(profile.mediumFeed)}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.status !== "ok") throw new Error("bad feed");
        const items: Post[] = (data.items ?? []).map((it: any) => ({
          title: it.title,
          link: it.link,
          pubDate: it.pubDate,
          thumbnail: it.thumbnail || extractThumb(it.description ?? it.content ?? ""),
          categories: it.categories,
          description: stripHtml(it.description ?? "").slice(0, 200),
        }));
        setPosts(items);
      })
      .catch(() => !cancelled && setError("error"));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="pt-24">
      <Seo
        title={t("seo.blogs.title")}
        description={t("seo.blogs.description")}
        path="/blogs"
      />
      <h1 className="sr-only">{t("seo.blogs.title")}</h1>
      <Section
        id="blogs"
        eyebrow={t("blogs.eyebrow")}
        title={<>{t("blogs.titlePre")} <span className="gradient-text">{t("blogs.titleAccent")}</span></>}
        subtitle={t("blogs.subtitle")}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Link
            to={`/${lang}/blogs/applied-ai-engineer-roadmap`}
            className="group glass rounded-2xl p-6 flex flex-col gap-4 hover:scale-[1.01] transition-spring border border-primary/20"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 grid place-items-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-primary">
                Featured Guide
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-display text-lg md:text-xl font-semibold group-hover:text-primary transition-colors">
                The Applied AI Engineer Roadmap: Skills and Tools for 2026
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                A seven-stage path covering LLMOps, RAG pipelines, and multi-agent systems — with checklists for each stage.
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform self-end" />
          </Link>

          <Link
            to={`/${lang}/blogs/qdrant-fastapi-grpc-guide`}
            className="group glass rounded-2xl p-6 flex flex-col gap-4 hover:scale-[1.01] transition-spring border border-primary/20"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/30 to-primary/30 grid place-items-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-primary">
                Featured Guide
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-display text-lg md:text-xl font-semibold group-hover:text-primary transition-colors">
                Qdrant + FastAPI + gRPC: A Production Guide
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Deploy Qdrant with gRPC and FastAPI using the singleton AsyncQdrantClient pattern — lifespan wiring, named vectors, and observability.
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform self-end" />
          </Link>

          <Link
            to={`/${lang}/blogs/multi-agent-eval-guide`}
            className="group glass rounded-2xl p-6 flex flex-col gap-4 hover:scale-[1.01] transition-spring border border-primary/20"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/30 to-primary/30 grid place-items-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-primary">
                Engineering Guide
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-display text-lg md:text-xl font-semibold group-hover:text-primary transition-colors">
                Building Evaluation Pipelines for Multi-Agent Workflows
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Judge models, trajectory grading, regression tests, and tracing with LangGraph and Langfuse — a production playbook for agentic AI.
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform self-end" />
          </Link>

          <Link
            to={`/${lang}/blogs/ai-engineer-job-requirements`}
            className="group glass rounded-2xl p-6 flex flex-col gap-4 hover:scale-[1.01] transition-spring border border-primary/20"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 grid place-items-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-primary">
                Career Guide
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-display text-lg md:text-xl font-semibold group-hover:text-primary transition-colors">
                AI Engineer Job Requirements: A 2026 Preparation Checklist
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Skills, portfolio expectations, and interview prep for AI engineer roles — the checklist I wish I had.
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform self-end" />
          </Link>
        </div>

        {error && (
          <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
            {t("blogs.error")}{" "}
            <a href={profile.social.medium} target="_blank" rel="noreferrer noopener" className="text-primary hover:underline">
              {t("blogs.visitMedium")}
            </a>
          </div>
        )}

        {!posts && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5 h-64 animate-pulse" />
            ))}
          </div>
        )}

        {posts && posts.length === 0 && (
          <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
            {t("blogs.empty")}
          </div>
        )}

        {posts && posts.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((p) => (
              <a key={p.link} href={p.link} target="_blank" rel="noreferrer noopener"
                aria-label={`${t("blogs.readFullPost")}: ${p.title}`}
                className="group glass rounded-2xl overflow-hidden hover:scale-[1.02] hover:-translate-y-1 transition-spring flex flex-col">
                <div className="aspect-[16/9] bg-muted relative overflow-hidden w-full">
                  {p.thumbnail ? (
                    <img src={p.thumbnail} alt={p.title} loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 w-full h-full grid place-items-center bg-gradient-to-br from-primary/20 to-secondary/20">
                      <BookOpen className="w-8 h-8 text-primary/60" />
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {new Date(p.pubDate).toLocaleDateString(i18n.resolvedLanguage, { year: "numeric", month: "short", day: "numeric" })}
                  </div>
                  <h3 className="font-display font-semibold text-base mt-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  {p.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">{p.description}…</p>
                  )}
                  {p.categories && p.categories.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.categories.slice(0, 3).map((c) => (
                        <span key={c} className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground">{c}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 pt-3 border-t border-border inline-flex items-center gap-1.5 text-xs text-primary font-medium">
                    <span>{t("blogs.readFullPost")}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

export default BlogsPage;
