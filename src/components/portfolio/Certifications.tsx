import { useTranslation } from "react-i18next";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { BadgeCheck } from "lucide-react";

type Cert = {
  name: string;
  issuer: string;
  logo?: string;
  issued: string;
  credentialId?: string;
  skills: string[];
};

export const Certifications = () => {
  const { t } = useTranslation();
  const items = t("certifications.items", { returnObjects: true }) as Cert[];
  const issuedLabel = t("certifications.issued");
  const credentialLabel = t("certifications.credential");
  const skillsLabel = t("certifications.skills");

  return (
    <Section
      id="certifications"
      eyebrow={t("certifications.eyebrow")}
      title={
        <>
          {t("certifications.titlePre")}{" "}
          <span className="gradient-text">{t("certifications.titleAccent")}</span>
        </>
      }
      subtitle={t("certifications.subtitle")}
    >
      <div className="grid md:grid-cols-2 gap-5">
        {items.map((c, i) => (
          <Reveal key={c.name} delay={i * 80}>
            <article className="glass rounded-2xl p-5 gradient-border relative overflow-hidden group hover:-translate-y-1 transition-spring h-full">
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-primary">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {issuedLabel} · {c.issued}
                </div>
                <h3 className="font-display font-semibold text-base mt-1 leading-tight">
                  {c.name}
                </h3>
                <div className="text-sm text-muted-foreground mt-0.5">{c.issuer}</div>
              </div>

              {c.credentialId && (
                <div className="relative mt-3 text-[11px] font-mono text-muted-foreground break-all">
                  <span className="opacity-70">{credentialLabel}:</span> {c.credentialId}
                </div>
              )}

              <div className="relative mt-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                  {skillsLabel}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] px-2 py-1 rounded-md glass font-mono"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};
