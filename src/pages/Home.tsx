import { useTranslation } from "react-i18next";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Now } from "@/components/portfolio/Now";
import { Seo } from "@/components/Seo";

const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <Seo
        title={t("seo.home.title")}
        description={t("seo.home.description")}
        path="/"
        type="profile"
      />
      <Hero />
      <About />
      <Now />
    </>
  );
};

export default Home;
