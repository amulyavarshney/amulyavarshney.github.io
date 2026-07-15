import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/portfolio/Layout";
import { LanguageRoute, RootRedirect } from "@/i18n/LanguageRouter";
import Home from "./pages/Home";
import PortfolioPage from "./pages/PortfolioPage";
import ProjectsPage from "./pages/ProjectsPage";
import ServicesPage from "./pages/ServicesPage";
import PlaygroundPage from "./pages/PlaygroundPage";
import BlogsPage from "./pages/BlogsPage";
import AppliedAiEngineerRoadmap from "./pages/guides/AppliedAiEngineerRoadmap";
import QdrantFastapiGrpcGuide from "./pages/guides/QdrantFastapiGrpcGuide";
import AiEngineerJobRequirementsGuide from "./pages/guides/AiEngineerJobRequirementsGuide";
import MultiAgentEvalGuide from "./pages/guides/MultiAgentEvalGuide";
import ContactPage from "./pages/ContactPage";
import CaseStudyPage from "./pages/CaseStudyPage";
import NotFound from "./pages/NotFound.tsx";

const App = () => (
  <>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/:lang" element={<LanguageRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/case-study/:slug" element={<CaseStudyPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="playground" element={<PlaygroundPage />} />
            <Route path="blogs" element={<BlogsPage />} />
            <Route path="blogs/applied-ai-engineer-roadmap" element={<AppliedAiEngineerRoadmap />} />
            <Route path="blogs/qdrant-fastapi-grpc-guide" element={<QdrantFastapiGrpcGuide />} />
            <Route path="blogs/ai-engineer-job-requirements" element={<AiEngineerJobRequirementsGuide />} />
            <Route path="blogs/multi-agent-eval-guide" element={<MultiAgentEvalGuide />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;
