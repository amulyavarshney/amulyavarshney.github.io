import { useTranslation } from "react-i18next";
import { Projects } from "@/components/portfolio/Projects";
import { Seo } from "@/components/Seo";

const ProjectsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="pt-24">
      <Seo
        title={t("seo.projects.title")}
        description={t("seo.projects.description")}
        path="/projects"
      />
      <h1 className="sr-only">{t("seo.projects.title")}</h1>
      <Projects />
    </div>
  );
};

export default ProjectsPage;
