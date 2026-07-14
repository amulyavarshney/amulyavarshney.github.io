import { useTranslation } from "react-i18next";
import { Section } from "./Section";
import { BookOpen, Hammer, Sprout, Radio } from "lucide-react";
import { Reveal } from "./Reveal";

type NowItem = { title: string; text: string };

const ICONS = [Hammer, Sprout, BookOpen] as const;

export const Now = () => {
  const { t } = useTranslation();
  const items = t("now.items", { returnObjects: true }) as NowItem[];
  const updated = t("now.updated");

  return (
    <Section
      id="now"
      eyebrow={t("now.eyebrow")}
      title={
        <>
          {t("now.titlePre")} <span className="gradient-text">{t("now.titleAccent")}</span>
        </>
      }
      subtitle={t("now.subtitle")}
    >
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((it, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <Reveal key={it.title} delay={i * 90}>
              <div className="glass rounded-2xl p-5 h-full relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors" />
                <div className="relative flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="uppercase tracking-widest">{it.title}</span>
                </div>
                <p className="relative mt-3 text-sm leading-relaxed">{it.text}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
      <div className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground font-mono">
        <Radio className="w-3.5 h-3.5 text-accent animate-pulse" />
        {updated}
      </div>
    </Section>
  );
};
