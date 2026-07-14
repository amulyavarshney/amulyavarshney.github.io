import { useTranslation } from "react-i18next";
import { Section } from "./Section";
import { serviceIcons } from "@/data/portfolio";
import { Bot, Brain, Layers, Server, Cloud, GraduationCap, ArrowUpRight } from "lucide-react";
import { Tilt3D } from "./Tilt3D";
import { Reveal } from "./Reveal";

const ICONS = { bot: Bot, brain: Brain, layers: Layers, server: Server, cloud: Cloud, "graduation-cap": GraduationCap } as const;
type Item = { title: string; description: string };

export const Services = () => {
  const { t } = useTranslation();
  const items = t("services.items", { returnObjects: true }) as Item[];
  return (
    <Section
      id="services"
      eyebrow={t("services.eyebrow")}
      title={<>{t("services.titlePre")} <span className="gradient-text">{t("services.titleAccent")}</span></>}
      subtitle={t("services.subtitle")}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 perspective-1000">
        {items.map((s, i) => {
          const Icon = ICONS[(serviceIcons[i] ?? "bot") as keyof typeof ICONS] ?? Bot;
          return (
            <Reveal key={s.title} delay={i * 80}>
              <Tilt3D max={10} className="h-full">
                <div className="glass rounded-2xl p-6 relative overflow-hidden group transition-spring h-full">
                  <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-gradient-to-br from-primary/15 to-secondary/15 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-start justify-between tilt-card-inner">
                    <div className="w-12 h-12 rounded-xl glass-strong grid place-items-center group-hover:glow transition-all animate-float" style={{ animationDelay: `${i * 0.15}s` }}>
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
                  </div>
                  <h3 className="relative font-display font-semibold text-base mt-4 tilt-card-inner">{s.title}</h3>
                  <p className="relative text-sm text-muted-foreground mt-2 leading-relaxed">{s.description}</p>
                </div>
              </Tilt3D>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
};
