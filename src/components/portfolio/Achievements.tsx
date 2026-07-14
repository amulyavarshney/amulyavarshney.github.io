import { useTranslation } from "react-i18next";
import { Section } from "./Section";
import { achievementIcons } from "@/data/portfolio";
import { Trophy, Zap, Award, Code2, Star, Target, Rocket, Sparkles } from "lucide-react";

const ICONS = { trophy: Trophy, zap: Zap, award: Award, code: Code2, star: Star, target: Target, rocket: Rocket, sparkles: Sparkles } as const;

type Item = { title: string; metric: string; note: string };

export const Achievements = () => {
  const { t } = useTranslation();
  const items = t("achievements.items", { returnObjects: true }) as Item[];
  return (
    <Section
      id="achievements"
      eyebrow={t("achievements.eyebrow")}
      title={<>{t("achievements.titlePre")} <span className="gradient-text">{t("achievements.titleAccent")}</span></>}
      subtitle={t("achievements.subtitle")}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((a, i) => {
          const Icon = ICONS[(achievementIcons[i] ?? "trophy") as keyof typeof ICONS] ?? Trophy;
          return (
            <div key={a.title} className="glass rounded-2xl p-5 gradient-border relative overflow-hidden group hover:-translate-y-1 transition-spring"
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/15 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary grid place-items-center glow mb-3">
                <Icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="relative font-display text-base font-bold gradient-text leading-tight">{a.metric}</div>
              <h3 className="relative text-sm font-semibold mt-1.5 leading-snug">{a.title}</h3>
              <p className="relative text-xs text-muted-foreground mt-1">{a.note}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
};
