import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Section } from "./Section";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

type Item = { name: string; role: string; organization: string; quote: string };

export const Testimonials = () => {
  const { t } = useTranslation();
  const items = t("testimonials.items", { returnObjects: true }) as Item[];
  const [i, setI] = useState(0);
  const item = items[i];
  const next = () => setI((v) => (v + 1) % items.length);
  const prev = () => setI((v) => (v - 1 + items.length) % items.length);
  const initials = item.name.split(" ").map((s) => s[0]).slice(0, 2).join("");

  return (
    <Section
      id="testimonials"
      eyebrow={t("testimonials.eyebrow")}
      title={<>{t("testimonials.titlePre")} <span className="gradient-text">{t("testimonials.titleAccent")}</span></>}
      subtitle={t("testimonials.subtitle")}
    >
      <div className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden max-w-3xl mx-auto gradient-border">
        <Quote className="absolute top-6 left-6 w-10 h-10 text-primary/15" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-3xl rounded-full" />
        <p className="relative text-lg sm:text-xl leading-relaxed font-display text-balance text-center">
          "{item.quote}"
        </p>
        <div className="relative flex items-center justify-center gap-3 mt-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary grid place-items-center font-display font-semibold text-primary-foreground">
            {initials}
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm">{item.name}</div>
            <div className="text-xs text-muted-foreground">{item.role} · {item.organization}</div>
          </div>
        </div>
        <div className="relative flex items-center justify-center gap-3 mt-6">
          <button onClick={prev} aria-label={t("testimonials.prev")} className="w-9 h-9 rounded-full glass grid place-items-center hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1.5">
            {items.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)} aria-label={`${t("testimonials.next")} ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"}`} />
            ))}
          </div>
          <button onClick={next} aria-label={t("testimonials.next")} className="w-9 h-9 rounded-full glass grid place-items-center hover:text-primary transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Section>
  );
};
