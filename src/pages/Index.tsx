import About from "@/components/sections/About";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import Expertise from "@/components/sections/Expertise";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Navbar from "@/components/sections/Navbar";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import WhyChooseMe from "@/components/sections/WhyChooseMe";
import CustomCursor from "@/components/ui/CustomCursor";
import GlowingParticle from "@/components/ui/GlowingParticle";

import Certifications from "@/components/sections/Certifications";
import EmploymentTimeline from "@/components/sections/EmploymentTimeline";
import Testimonials from "@/components/sections/Testimonials";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <CustomCursor />
      <GlowingParticle />
      <Navbar />
      <Hero />
      <About />
      <Expertise />
      <EmploymentTimeline />
      <Certifications />
      <WhyChooseMe />
      <Services />
      <Projects />
      <Blog />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
