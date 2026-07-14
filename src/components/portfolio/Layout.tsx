import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/portfolio/Navbar";
import { Footer } from "@/components/portfolio/Footer";
import { ScrollProgress } from "@/components/portfolio/ScrollProgress";
import { CommandPalette } from "@/components/portfolio/CommandPalette";

export const Layout = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return (
    <main className="min-h-screen relative flex flex-col">
      <ScrollProgress />
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <CommandPalette />
    </main>
  );
};

