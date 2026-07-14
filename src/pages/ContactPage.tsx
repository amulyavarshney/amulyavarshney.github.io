import { useTranslation } from "react-i18next";
import { Contact } from "@/components/portfolio/Contact";
import { Seo } from "@/components/Seo";

const ContactPage = () => {
  const { t } = useTranslation();
  return (
    <div className="pt-24">
      <Seo
        title={t("seo.contact.title")}
        description={t("seo.contact.description")}
        path="/contact"
      />
      <h1 className="sr-only">{t("seo.contact.title")}</h1>
      <Contact />
    </div>
  );
};

export default ContactPage;
