import { Github, Linkedin, BookOpen, ArrowRight, Sparkles, Download } from "lucide-react";
import { LangLink as Link } from "@/components/LangLink";
import { useTranslation } from "react-i18next";
import { profile } from "@/data/portfolio";
import { ParticleField } from "./ParticleField";
import { Typewriter } from "./Typewriter";
import { Tilt3D } from "./Tilt3D";
import amulyaPhoto from "@/assets/amulya.png";

export const Hero = () => {
  const { t } = useTranslation();
  const phrases = t("hero.phrases", { returnObjects: true }) as string[];
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">
      <div className="absolute inset-0 hero-bg" />
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0">
        <ParticleField />
      </div>

      <div className="container relative z-10 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
        <div className="space-y-7 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {t("common.available")}
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-balance break-words">
            {t("hero.iAm")} <span className="gradient-text">{profile.name}</span>
            <br />
            <span className="text-foreground/90">{t("hero.iBuild")}</span>
            <span className="block mt-2 min-h-[1.2em] break-words">
              <Typewriter phrases={phrases} />
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">{t("hero.bio")}</p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium glow hover:scale-[1.03] transition-spring text-sm"
            >
              {t("common.viewProjects")}{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/playground"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass hover:bg-card transition-colors font-medium text-sm"
            >
              <Sparkles className="w-4 h-4 text-primary" /> {t("common.explorePlayground")}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass hover:bg-card transition-colors font-medium text-sm"
            >
              {t("common.contactMe")}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass hover:bg-card transition-colors font-medium text-sm text-muted-foreground"
              aria-label={t("hero.requestCvTitle")}
              title={t("hero.requestCvTitle")}
            >
              <Download className="w-4 h-4" /> {t("common.requestCv")}
            </Link>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <a
              href={profile.social.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              className="w-11 h-11 rounded-xl glass grid place-items-center hover:text-primary hover:scale-110 transition-spring"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="w-11 h-11 rounded-xl glass grid place-items-center hover:text-primary hover:scale-110 transition-spring"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={profile.social.medium}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Medium"
              className="w-11 h-11 rounded-xl glass grid place-items-center hover:text-primary hover:scale-110 transition-spring"
            >
              <BookOpen className="w-4 h-4" />
            </a>
            <span className="text-xs text-muted-foreground ml-2">{profile.location}</span>
          </div>
        </div>

        <ProfileShowcase />
      </div>
    </section>
  );
};

const ProfileShowcase = () => {
  return (
    <Tilt3D max={8} glare={false} className="relative w-full max-w-sm mx-auto animate-fade-in">
      {/* Ambient glows */}
      <div className="absolute -inset-10 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 blur-3xl opacity-60 pointer-events-none" />

      {/* Oval / egg-shaped portrait */}
      <div
        className="relative tilt-card-inner mx-auto w-[78%] aspect-[3/4] bg-card shadow-2xl ring-1 ring-border overflow-hidden"
        style={{ borderRadius: "50% / 42%" }}
      >
        <img
          src={amulyaPhoto}
          alt={`${profile.name} portrait`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        {/* Subtle gradient frame */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: "inherit",
            background: "linear-gradient(180deg, transparent 55%, hsl(var(--background)/0.55) 100%)",
          }}
        />
        {/* Thin gradient outline */}
        <div
          aria-hidden
          className="absolute -inset-[2px] pointer-events-none opacity-70"
          style={{
            borderRadius: "inherit",
            padding: "2px",
            background: "var(--gradient-aurora)",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      </div>

      {/* Status badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 tilt-card-inner">
        <div className="glass-strong rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-xs font-medium whitespace-nowrap">AI Engineer · Available</span>
        </div>
      </div>

      {/* Floating accent dots */}
      <div className="absolute top-6 -left-2 w-3 h-3 rounded-full bg-primary/70 blur-[1px] animate-pulse" />
      <div
        className="absolute top-1/3 -right-1 w-2 h-2 rounded-full bg-secondary/70 blur-[1px] animate-pulse"
        style={{ animationDelay: "0.6s" }}
      />
      <div
        className="absolute bottom-12 -left-3 w-2 h-2 rounded-full bg-accent/70 blur-[1px] animate-pulse"
        style={{ animationDelay: "1.2s" }}
      />
    </Tilt3D>
  );
};
