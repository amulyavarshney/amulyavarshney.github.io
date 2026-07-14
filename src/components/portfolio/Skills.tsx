import { useTranslation } from "react-i18next";
import { Section } from "./Section";
import { skillLists } from "@/data/portfolio";

export const Skills = () => {
  const { t } = useTranslation();
  const categories = t("skills.categories", { returnObjects: true }) as string[];
  return (
    <Section
      id="skills"
      eyebrow={t("skills.eyebrow")}
      title={<>{t("skills.titlePre")} <span className="gradient-text">{t("skills.titleAccent")}</span></>}
      subtitle={t("skills.subtitle")}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((name, i) => {
          const list = skillLists[i] ?? [];
          return (
            <div key={name} className="glass rounded-2xl p-6 gradient-border relative overflow-hidden group" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold">{name}</h3>
                <span className="text-[10px] font-mono text-muted-foreground">{list.length} {t("common.skills")}</span>
              </div>
              <div className="relative flex flex-wrap gap-1.5">
                {list.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1.5 rounded-lg bg-muted/60 hover:bg-primary/15 hover:text-primary hover:scale-105 transition-spring cursor-default font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};
