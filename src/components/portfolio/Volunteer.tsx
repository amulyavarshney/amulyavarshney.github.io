import { useTranslation } from "react-i18next";
import { Section } from "./Section";
import { Reveal } from "./Reveal";


type Item = {
  role: string;
  org: string;
  period: string;
  cause?: string;
  bullets: string[];
};

export const Volunteer = () => {
  const { t } = useTranslation();
  const items = t("volunteer.items", { returnObjects: true }) as Item[];

  return (
    <Section
      id="volunteer"
      eyebrow={t("volunteer.eyebrow")}
      title={
        <>
          {t("volunteer.titlePre")}{" "}
          <span className="gradient-text">{t("volunteer.titleAccent")}</span>
        </>
      }
      subtitle={t("volunteer.subtitle")}
    >
      <div className="relative">
        {/* vertical spine */}
        <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-secondary/30 to-transparent" />

        <ol className="space-y-6">
          {items.map((v, i) => {
            const side = i % 2 === 0 ? "md:pr-[52%]" : "md:pl-[52%]";
            return (
              <li key={`${v.org}-${i}`} className="relative">
                <Reveal delay={i * 60}>
                  <div className={`relative pl-12 md:pl-0 ${side}`}>
                    {/* dot */}
                    <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-4 w-3 h-3 rounded-full bg-gradient-to-br from-primary to-secondary ring-4 ring-background glow" />
                    <div className="glass rounded-2xl p-5 gradient-border group hover:-translate-y-0.5 transition-spring">
                      <div>
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <h3 className="font-display text-base font-semibold leading-tight">
                            {v.role}
                          </h3>
                          <span className="text-sm text-primary font-medium">
                            @ {v.org}
                          </span>
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground font-mono">
                          <span>{v.period}</span>
                          {v.cause && (
                            <>
                              <span aria-hidden>•</span>
                              <span>{v.cause}</span>
                            </>
                          )}
                        </div>
                        <ul className="mt-3 space-y-1.5">
                          {v.bullets.map((b, bi) => (
                            <li
                              key={bi}
                              className="text-sm text-muted-foreground leading-relaxed pl-4 relative"
                            >
                              <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-primary/60" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
};
