import { useState } from "react";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Section } from "./Section";
import { profile } from "@/data/portfolio";
import { useToast } from "@/hooks/use-toast";
import { Github, Linkedin, BookOpen, Send, Loader2, CheckCircle2, Shield } from "lucide-react";

const REASON_KEYS = ["Collaboration", "Job Opportunity", "Freelance", "Mentorship", "Speaking", "Other"] as const;

export const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reasonLabels = t("contact.reasons", { returnObjects: true }) as Record<string, string>;
  const bestFits = t("contact.bestFitsList", { returnObjects: true }) as string[];

  const schema = z.object({
    name: z.string().trim().min(2, t("contact.errors.name")).max(80),
    organization: z.string().trim().max(120).optional().or(z.literal("")),
    subject: z.string().trim().min(3, t("contact.errors.subject")).max(140),
    message: z.string().trim().min(20, t("contact.errors.message")).max(2000),
    reason: z.enum(REASON_KEYS),
    website: z.string().max(0, t("contact.errors.spam")).optional().or(z.literal("")),
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fieldErrors[i.path[0] as string] = i.message));
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setState("loading");
    await new Promise((r) => setTimeout(r, 1100));
    try {
      const queued = JSON.parse(localStorage.getItem("contact-queue") ?? "[]");
      queued.push({ ...parsed.data, ts: Date.now() });
      localStorage.setItem("contact-queue", JSON.stringify(queued));
    } catch {}
    setState("sent");
    toast({ title: t("contact.toastTitle"), description: t("contact.toastDesc") });
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setState("idle"), 3000);
  };

  return (
    <Section
      id="contact"
      eyebrow={t("contact.eyebrow")}
      title={<>{t("contact.titlePre")} <span className="gradient-text">{t("contact.titleAccent")}</span></>}
      subtitle={t("contact.subtitle")}
    >
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <form onSubmit={onSubmit} className="glass rounded-2xl p-6 sm:p-8 gradient-border space-y-4" noValidate>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={`${t("contact.name")} ${t("contact.required")}`} name="name" error={errors.name} placeholder={t("contact.namePlaceholder")} />
            <Field label={t("contact.organization")} name="organization" error={errors.organization} placeholder={t("contact.organizationPlaceholder")} />
          </div>
          <Field label={`${t("contact.subject")} ${t("contact.required")}`} name="subject" error={errors.subject} placeholder={t("contact.subjectPlaceholder")} />
          <div>
            <label htmlFor="reason" className="block text-xs font-medium mb-1.5">{t("contact.reason")} {t("contact.required")}</label>
            <select
              id="reason"
              name="reason"
              defaultValue="Collaboration"
              className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {REASON_KEYS.map((r) => <option key={r} value={r}>{reasonLabels[r] ?? r}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block text-xs font-medium mb-1.5">{t("contact.message")} {t("contact.required")}</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder={t("contact.messagePlaceholder")}
              className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
            />
            {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
              <Shield className="w-3 h-3" /> {t("contact.spamNote")}
            </p>
            <button
              type="submit"
              disabled={state !== "idle"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm glow hover:scale-[1.03] transition-spring disabled:opacity-70 disabled:hover:scale-100"
            >
              {state === "loading" && <><Loader2 className="w-4 h-4 animate-spin" /> {t("contact.sending")}</>}
              {state === "sent" && <><CheckCircle2 className="w-4 h-4" /> {t("contact.sent")}</>}
              {state === "idle" && <><Send className="w-4 h-4" /> {t("contact.send")}</>}
            </button>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display font-semibold mb-3">{t("contact.findOnline")}</h3>
            <div className="space-y-2">
              <SocialRow href={profile.social.github} icon={<Github className="w-4 h-4" />} label="GitHub" handle="@amulyavarshney" />
              <SocialRow href={profile.social.linkedin} icon={<Linkedin className="w-4 h-4" />} label="LinkedIn" handle="in/varamu" />
              <SocialRow href={profile.social.medium} icon={<BookOpen className="w-4 h-4" />} label="Medium" handle="@amulyavarshney7" />
            </div>
          </div>
          <div className="glass rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/15 blur-3xl rounded-full" />
            <h3 className="relative font-display font-semibold mb-2">{t("contact.bestFits")}</h3>
            <ul className="relative text-sm text-muted-foreground space-y-1.5">
              {bestFits.map((b) => (<li key={b}>▸ {b}</li>))}
            </ul>
          </div>
        </aside>
      </div>
    </Section>
  );
};

const Field = ({ label, name, error, placeholder }: { label: string; name: string; error?: string; placeholder?: string }) => (
  <div>
    <label htmlFor={name} className="block text-xs font-medium mb-1.5">{label}</label>
    <input id={name} name={name} placeholder={placeholder}
      className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

const SocialRow = ({ href, icon, label, handle }: { href: string; icon: React.ReactNode; label: string; handle: string }) => (
  <a href={href} target="_blank" rel="noreferrer noopener" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors group">
    <div className="w-9 h-9 rounded-lg glass grid place-items-center text-primary group-hover:scale-110 transition-spring">{icon}</div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-muted-foreground font-mono truncate">{handle}</div>
    </div>
  </a>
);
