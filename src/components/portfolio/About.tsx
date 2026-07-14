import { useTranslation, Trans } from "react-i18next";
import { Section } from "./Section";
import { Terminal } from "lucide-react";

type Stat = { label: string; value: string; sub: string };

export const About = () => {
  const { t } = useTranslation();
  const stats = t("stats", { returnObjects: true }) as Stat[];
  return (
    <Section
      id="about"
      eyebrow={t("about.eyebrow")}
      title={<>{t("about.titlePre")} <span className="gradient-text">{t("about.titleAccent")}</span></>}
      subtitle={t("about.subtitle")}
    >
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="glass rounded-3xl p-7 sm:p-9 space-y-5 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <Terminal className="w-4 h-4 text-primary" />
            <span>{t("about.path")}</span>
            <div className="ml-auto flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-accent/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-primary/60" />
            </div>
          </div>
          <p className="relative text-base sm:text-lg leading-relaxed">{t("hero.bio")}</p>
          <p className="relative text-sm sm:text-base text-muted-foreground leading-relaxed">
            <Trans
              i18nKey="about.paragraph"
              values={{ a: t("about.llmops"), b: t("about.agents"), c: t("about.evals") }}
              components={{
                1: <span className="text-primary font-medium" />,
                2: <span className="text-secondary font-medium" />,
                3: <span className="text-accent font-medium" />,
              }}
            >
              {t("about.paragraph", {
                a: t("about.llmops"),
                b: t("about.agents"),
                c: t("about.evals"),
              })}
            </Trans>
          </p>
          <div className="relative font-mono text-xs text-muted-foreground pt-2 border-t border-border">
            <span className="text-primary">$</span> {t("about.currentlyAt")} —&nbsp;
            <span className="text-foreground font-semibold">{t("about.currentlyAtValue")}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <div key={s.label} className="glass rounded-2xl p-4 hover:scale-[1.03] transition-spring relative overflow-hidden group"
              style={{ animationDelay: `${i * 80}ms` }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/10 to-secondary/10 transition-opacity" />
              <div className="relative">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">{s.label}</div>
                <div className="font-display text-2xl font-bold gradient-text mt-1">{s.value}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
