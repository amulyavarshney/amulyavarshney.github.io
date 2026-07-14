import { useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Target, Wrench, LineChart, Lightbulb, Layers } from "lucide-react";
import { LangLink as Link } from "@/components/LangLink";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/portfolio/Reveal";
import { caseStudies } from "@/data/caseStudies";

const CaseStudyPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const cs = caseStudies.find((c) => c.slug === slug);

  if (!cs) return <Navigate to={`/${i18n.language || "en"}/projects`} replace />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: cs.title,
    headline: cs.title,
    description: cs.tagline,
    author: { "@type": "Person", name: "Amulya Varshney" },
    keywords: cs.stack.join(", "),
  };

  return (
    <article className="pt-24 pb-20">
      <Seo
        title={`${cs.title} — Case Study`}
        description={cs.tagline}
        path={`/projects/case-study/${cs.slug}`}
        type="article"
        jsonLd={jsonLd}
      />

      <div className="container max-w-4xl">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> All projects
        </Link>

        <Reveal>
          <header className="mb-10">
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs font-mono text-primary mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Case Study
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-balance">
              {cs.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{cs.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-muted-foreground">
              <span>{cs.role}</span>
              <span>·</span>
              <span>{cs.period}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {cs.stack.map((s) => (
                <span key={s} className="text-[11px] px-2 py-1 rounded-md glass font-mono">
                  {s}
                </span>
              ))}
            </div>
          </header>
        </Reveal>

        <Reveal delay={80}>
          <section className="glass rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold mb-3">
              <Target className="w-5 h-5 text-primary" /> Problem
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {cs.problem}
            </p>
          </section>
        </Reveal>

        <Reveal delay={120}>
          <section className="glass rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold mb-3">
              <Wrench className="w-5 h-5 text-secondary" /> Approach
            </h2>
            <ul className="space-y-2.5">
              {cs.approach.map((a) => (
                <li key={a} className="flex gap-3 text-sm sm:text-base leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-muted-foreground">{a}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal delay={160}>
          <section className="glass rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold mb-4">
              <Layers className="w-5 h-5 text-accent" /> Architecture
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {cs.architecture.map((a) => (
                <div key={a.title} className="rounded-xl border border-border p-4 bg-card/50">
                  <div className="text-xs uppercase tracking-widest font-mono text-primary mb-1">
                    {a.title}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a.description}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={200}>
          <section className="glass rounded-2xl p-6 sm:p-8 mb-6">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold mb-4">
              <LineChart className="w-5 h-5 text-primary" /> Impact
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {cs.metrics.map((m) => (
                <div key={m.label} className="rounded-xl border border-border p-4 bg-card/50">
                  <div className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
                    {m.label}
                  </div>
                  <div className="font-display text-xl sm:text-2xl font-bold gradient-text mt-1">
                    {m.value}
                  </div>
                  {m.sub && (
                    <div className="text-[11px] text-muted-foreground mt-0.5">{m.sub}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={240}>
          <section className="glass rounded-2xl p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold mb-3">
              <Lightbulb className="w-5 h-5 text-secondary" /> Learnings
            </h2>
            <ul className="space-y-2.5">
              {cs.learnings.map((l) => (
                <li key={l} className="flex gap-3 text-sm sm:text-base leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <span className="text-muted-foreground">{l}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      </div>
    </article>
  );
};

export default CaseStudyPage;
