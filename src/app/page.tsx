import { HeroSection } from "@/components/sections/Hero";
import { AboutSection } from "@/components/sections/About";
import { SkillsSection } from "@/components/sections/Skills";
import { PortfolioSection } from "@/components/sections/Portfolio";
import { ServicesSection } from "@/components/sections/Services";
import { ContactSection } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-black text-white">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <PortfolioSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
