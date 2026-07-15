import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Now } from "@/components/portfolio/Now";
import { Seo } from "@/components/Seo";
import {
  personJsonLd,
  websiteJsonLd,
  profilePageJsonLd,
  homeFaqJsonLd,
  KNOWS_ABOUT,
} from "@/lib/site";

const Home = () => {
  const { t } = useTranslation();
  const { lang = "en" } = useParams<{ lang: string }>();

  return (
    <>
      <Seo
        title={t("seo.home.title")}
        description={t("seo.home.description")}
        path="/"
        type="profile"
        keywords={[...KNOWS_ABOUT, "Amulya Varshney", "Bangalore"]}
        jsonLd={[
          personJsonLd(lang),
          websiteJsonLd(lang),
          profilePageJsonLd(lang),
          homeFaqJsonLd(lang),
        ]}
      />
      <Hero />
      <About />
      <Now />
    </>
  );
};

export default Home;
