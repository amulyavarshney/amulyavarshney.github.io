import { useTranslation } from "react-i18next";
import { Services } from "@/components/portfolio/Services";
import { Testimonials } from "@/components/portfolio/Testimonials";
import { Seo } from "@/components/Seo";

const ServicesPage = () => {
  const { t } = useTranslation();
  return (
    <div className="pt-24">
      <Seo
        title={t("seo.services.title")}
        description={t("seo.services.description")}
        path="/services"
      />
      <h1 className="sr-only">{t("seo.services.title")}</h1>
      <Services />
      <Testimonials />
    </div>
  );
};

export default ServicesPage;
