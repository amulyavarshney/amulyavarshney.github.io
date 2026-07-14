import { useTranslation } from "react-i18next";
import { Section } from "./Section";

import { experienceStacks, experienceMeta } from "@/data/portfolio";
import { GraduationCap, Briefcase, MapPin } from "lucide-react";

type Edu = { institution: string; degree: string; duration: string; grade: string; courses: string[] };
type Exp = { role: string; company: string; location: string; duration: string; highlights: string[] };

export const Portfolio = () => {
  const { t } = useTranslation();
  const education = t("education", { returnObjects: true }) as Edu[];
  const experience = t("experience", { returnObjects: true }) as Exp[];
  return (
    <Section
      id="portfolio"
      eyebrow={t("portfolio.eyebrow")}
      title={<>{t("portfolio.titlePre")} <span className="gradient-text">{t("portfolio.titleAccent")}</span></>}
      subtitle={t("portfolio.subtitle")}
    >
      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10">
        <div className="lg:sticky lg:top-24 lg:self-start">

          <div className="flex items-center gap-2 mb-5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <GraduationCap className="w-4 h-4 text-primary" />
            {t("portfolio.education")}
          </div>
          <div className="space-y-4">
            {education.map((e) => (
              <div key={e.institution} className="glass rounded-2xl p-6 gradient-border relative">
                <div className="text-xs font-mono text-primary">{e.duration}</div>
                <h3 className="font-display font-semibold text-lg mt-1.5 leading-tight">{e.degree}</h3>
                <div className="text-sm text-muted-foreground mt-1">{e.institution}</div>
                <div className="mt-3 inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {e.grade}
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {e.courses.map((c) => (
                    <span key={c} className="text-[11px] px-2 py-1 rounded-md bg-muted text-muted-foreground">{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <Briefcase className="w-4 h-4 text-secondary" />
            {t("portfolio.experience")}
          </div>
          <ol className="relative space-y-6 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-primary before:via-secondary before:to-accent">
            {experience.map((x, idx) => {
              const current = experienceMeta[idx]?.current;
              const stack = experienceStacks[idx] ?? [];
              return (
                <li key={x.company + x.role} className="relative pl-12">
                  <span className={`absolute left-3.5 top-3 w-3 h-3 rounded-full ring-4 ring-background ${current ? "bg-accent animate-pulse" : "bg-primary"}`} />
                  <div className="glass rounded-2xl p-5 hover:translate-x-1 transition-spring relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
                    <div className="relative">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <h3 className="font-display font-semibold text-base">{x.role}</h3>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-primary font-medium text-sm">{x.company}</span>
                        {current && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/30 uppercase">{t("common.current")}</span>}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1 font-mono">
                        <span>{x.duration}</span>
                        <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {x.location}</span>
                      </div>
                    </div>
                    <ul className="relative mt-3 space-y-1.5 text-sm text-muted-foreground">
                      {x.highlights.map((h, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary mt-1.5 shrink-0">▸</span>
                          <span className="leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="relative mt-4 flex flex-wrap gap-1.5">
                      {stack.map((tag) => (
                        <span key={tag} className="text-[11px] px-2 py-1 rounded-md glass font-mono">{tag}</span>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Section>
  );
};
