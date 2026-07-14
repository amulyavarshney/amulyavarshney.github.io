import { useTranslation } from "react-i18next";
import { Portfolio } from "@/components/portfolio/Portfolio";
import { Skills } from "@/components/portfolio/Skills";
import { Achievements } from "@/components/portfolio/Achievements";
import { Volunteer } from "@/components/portfolio/Volunteer";
import { Certifications } from "@/components/portfolio/Certifications";
import { Seo } from "@/components/Seo";

const PortfolioPage = () => {
  const { t } = useTranslation();
  return (
    <div className="pt-24">
      <Seo
        title={t("seo.portfolio.title")}
        description={t("seo.portfolio.description")}
        path="/portfolio"
      />
      <h1 className="sr-only">{t("seo.portfolio.title")}</h1>
      <Portfolio />
      <Skills />
      <Certifications />
      <Achievements />
      <Volunteer />
    </div>
  );
};

export default PortfolioPage;
