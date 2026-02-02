import PasswordCrackLoader from "@/components/loaders/PasswordCrackLoader";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import { Button } from "@/components/ui/button";
import GlowingParticle from "@/components/ui/GlowingParticle";
import ProjectDetailsSidebar from "@/components/ui/ProjectDetailsSidebar";
import { supabase } from "@/integrations/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Github,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useParams } from "react-router-dom";

// Define strict types for the rich content
interface TechStack {
  frontend: string[];
  backend: string[];
  services: string[];
}

interface Feature {
  title: string;
  checked: boolean;
}

interface Challenge {
  challenge: string;
  solution: string;
}

interface ProjectData {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  long_description?: string;
  image: string;
  technologies: string[]; // General tags
  category: string;
  featured?: boolean;
  live_url?: string;
  github_url?: string;

  // Rich details
  role?: string;
  team?: string;
  duration?: string;

  // JSON fields
  tech_stack?: TechStack;
  features?: Feature[];
  challenges?: Challenge[];

  // Media (not yet in DB fully separate, using single image/gallery placeholder)
  screenshots?: { url: string; alt: string }[];
  gallery?: string[];
}

const ProjectDetail = () => {
  const { id } = useParams(); // 'id' contains the slug from the route /project/:id
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      setDataLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          // Transform/Validate data if necessary
          setProject(data as unknown as ProjectData);
        } else {
          console.error('Project not found');
          // navigate('/404'); // Optional: redirect if not found
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Handle initial loader completion
  const handleLoaderComplete = () => {
    setPageLoading(false);
  };

  if (pageLoading || dataLoading) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
        >
          <PasswordCrackLoader onComplete={handleLoaderComplete} />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <Button asChild><Link to="/#projects">Back to Projects</Link></Button>
      </div>
    )
  }

  // Normalize data for display
  const details = {
    role: project.role || 'Full Stack Developer',
    team: project.team || 'Solo Project',
    duration: project.duration || 'Unknown'
  };

  const techStack = project.tech_stack || { frontend: [], backend: [], services: [] };
  const features = project.features || [];
  const challenges = project.challenges || [];
  const gallery = project.gallery || [];

  // Fallback for screenshots if none (DB currently only has 'gallery' array of strings, we map it)
  // Or re-use the main image if gallery empty
  const galleryImages = (project as any).gallery && (project as any).gallery.length > 0
    ? (project as any).gallery.map((url: string, i: number) => ({ url, alt: `Screenshot ${i + 1}` }))
    : [{ url: project.image, alt: 'Main Screenshot' }];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <GlowingParticle />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20">
        {/* Hero image background */}
        <div className="absolute inset-0 h-[500px] overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-16">
          {/* Back link */}
          <Link
            to="/#projects"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            {/* Featured badge */}
            {project.featured && (
              <span className="inline-block px-3 py-1 text-xs bg-primary text-primary-foreground rounded-full mb-6">
                Featured Project
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-mono mb-4 leading-tight">
              {project.title}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6">
              {project.subtitle || project.description}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.technologies?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-secondary border border-border rounded-md text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              {project.live_url && (
                <Button asChild className="w-full sm:w-auto min-h-[48px]">
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                </Button>
              )}
              {project.github_url && (
                <Button variant="outline" asChild className="w-full sm:w-auto min-h-[48px]">
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                    View Code
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_350px] gap-12">
            {/* Main content */}
            <div className="space-y-12">
              {/* Mobile Project Details (Sidebar content moved here for mobile) */}
              <div className="lg:hidden mb-8">
                <ProjectDetailsSidebar
                  details={details}
                  techStack={techStack}
                />
              </div>

              {/* Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  Overview
                </h2>
                <div className="text-muted-foreground leading-relaxed font-mono whitespace-pre-wrap">
                  {project.long_description || project.description}
                </div>
              </motion.div>

              {/* Key Features */}
              {features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-primary" />
                    Key Features
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl"
                      >
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${feature.checked ? 'text-primary' : 'text-muted-foreground/30'}`} />
                        <span className="text-sm text-muted-foreground">
                          {feature.title}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Gallery Section */}
              {gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-1 h-6 bg-primary rounded-full" /> Project Gallery
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {gallery.map((img, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative aspect-video rounded-xl overflow-hidden cursor-pointer border border-border bg-secondary"
                        onClick={() => setSelectedImage(img)}
                      >
                        <img
                          src={img}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          loading="lazy"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Challenges & Solutions */}
              {challenges.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <code className="text-primary">&lt;/&gt;</code>
                    Challenges & Solutions
                  </h2>
                  <div className="space-y-4">
                    {challenges.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-card border border-border rounded-xl"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                          <span className="font-semibold text-destructive">
                            Challenge: {item.challenge}
                          </span>
                        </div>
                        <div className="ml-8">
                          <span className="text-muted-foreground font-mono text-sm">
                            <span className="text-primary font-semibold">Solution:</span>{" "}
                            {item.solution}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <ProjectDetailsSidebar
                details={details}
                techStack={techStack}
              />
            </aside>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {/* Lightbox Modal - Portaled to body to avoid z-index/stacking context issues */}
      {createPortal(
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
              onClick={() => setSelectedImage(null)}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20 z-50 rounded-full w-12 h-12 sm:w-14 sm:h-14 min-w-[48px] min-h-[48px]"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-8 h-8" />
              </Button>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center pointer-events-none"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage}
                  alt="Full View"
                  className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl pointer-events-auto"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* CTA Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Explore More <span className="text-gradient-green">Projects</span>
          </h2>
          <p className="text-muted-foreground mb-8 font-mono">
            Check out my other work and see what I can build for you.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild>
              <Link to="/#projects">View All Projects</Link>
            </Button>
            <Button variant="outline" asChild>
              <a
                href={project.github_url || 'https://github.com/akmtasdikulislam'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
                GitHub Profile
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Related projects - For now use same query or static/empty. Implementing generic fetch is better but keeping simple.*/}
      {/* <RelatedItems title="Related Projects" items={relatedProjects} />  -- Commenting out as we need to fetch related dynamically */}

      <Footer />
    </div>
  );
};

export default ProjectDetail;
