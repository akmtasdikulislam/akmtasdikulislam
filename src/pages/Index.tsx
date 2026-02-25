import About from "@/components/sections/About";
import Activities from "@/components/sections/Activities";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import Expertise from "@/components/sections/Expertise";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Navbar from "@/components/sections/Navbar";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import WhyChooseMe from "@/components/sections/WhyChooseMe";
import GlowingParticle from "@/components/ui/GlowingParticle";

import Certifications from "@/components/sections/Certifications";
import EmploymentTimeline from "@/components/sections/EmploymentTimeline";
import Testimonials from "@/components/sections/Testimonials";

import { useAllSectionVisibilities } from "@/hooks/useHomepageContent";

const Index = () => {
  const { data: visibilities } = useAllSectionVisibilities();
  const isVisible = (key: string) => visibilities ? visibilities[key] !== false : true;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <GlowingParticle />
      {isVisible('navbar') && <Navbar />}
      {isVisible('hero') && <Hero />}
      {isVisible('about') && <About />}
      {isVisible('expertise') && <Expertise />}
      {isVisible('why_choose_me') && <WhyChooseMe />}
      {isVisible('services') && <Services />}
      {isVisible('projects') && <Projects />}
      {isVisible('blogs') && <Blog />}
      {isVisible('work_history') && <EmploymentTimeline />}
      {isVisible('certifications') && <Certifications />}
      {isVisible('activities') && <Activities />}
      {isVisible('testimonials') && <Testimonials />}
      {isVisible('contact') && <Contact />}
      {isVisible('footer') && <Footer />}
    </div>
  );
};

export default Index;
