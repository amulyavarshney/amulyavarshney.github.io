import { LangLink as Link } from "@/components/LangLink";
import { Github, Linkedin, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { profile, navItems } from "@/data/portfolio";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="relative border-t border-border py-10">
      <div className="container">
        <div className="grid sm:grid-cols-3 gap-8 items-start">
          <div>
            <div className="font-display font-semibold">Amulya Varshney</div>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{t("footer.tagline")}</p>
          </div>

          <nav aria-label="Footer">
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">{t("footer.navigate")}</div>
            <ul className="grid grid-cols-2 gap-1.5 text-sm">
              {navItems.map((n) => (
                <li key={n.id}>
                  <Link to={n.path} className="text-muted-foreground hover:text-primary transition-colors">
                    {t(n.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">{t("footer.connect")}</div>
            <div className="flex gap-2">
              <a href={profile.social.github} target="_blank" rel="noreferrer noopener" aria-label="GitHub"
                 className="w-9 h-9 rounded-lg glass grid place-items-center hover:text-primary transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href={profile.social.linkedin} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn"
                 className="w-9 h-9 rounded-lg glass grid place-items-center hover:text-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href={profile.social.medium} target="_blank" rel="noreferrer noopener" aria-label="Medium"
                 className="w-9 h-9 rounded-lg glass grid place-items-center hover:text-primary transition-colors">
                <BookOpen className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-wrap justify-between items-center gap-3 text-xs text-muted-foreground">
          <div>{t("footer.copy", { year: new Date().getFullYear() })}</div>
          <div className="font-mono">{t("footer.version")}</div>
        </div>
      </div>
    </footer>
  );
};
