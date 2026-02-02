import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/ui/SectionHeading";
import { useSectionHeading } from "@/hooks/useHomepageContent";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, FolderOpen, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  technologies: string[];
  live_url: string | null;
  github_url: string | null;
}

const Projects = () => {
  const { data: projects = [], isLoading: loading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        toast.error('Failed to load projects');
        throw error;
      }
      return data as Project[];
    },
  });

  const { data: sectionVisible } = useQuery<boolean>({
    queryKey: ['section_visibility', 'projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_visibility' as any)
        .select('is_visible')
        .eq('section_key', 'projects')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching section visibility:', error);
      }
      return data ? (data as any).is_visible : true;
    },
  });

  const { data: heading, isLoading: headingLoading } = useSectionHeading('projects');

  if (loading || headingLoading) {
    return null;
  }
  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          badge={heading?.section_badge || "Portfolio"}
          title={heading?.section_title || "Featured"}
          highlight={heading?.section_highlight || "Projects"}
          description={heading?.section_description || "Check out some of my recent work and side projects"}
        />

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects.map((project, index) => (
            <Link key={project.id} to={`/project/${project.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all h-full"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image || "https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=400&fit=crop"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

                  {/* Overlay buttons */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {project.live_url && (
                      <motion.a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </motion.a>
                    )}
                    {project.github_url && (
                      <motion.a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
                      >
                        <Github className="w-5 h-5" />
                      </motion.a>
                    )}
                    {!project.live_url && !project.github_url && (
                      <>
                        <motion.span
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </motion.span>
                        <motion.span
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
                        >
                          <Github className="w-5 h-5" />
                        </motion.span>
                      </>
                    )}
                  </div>

                  {/* Badge - Matching Services section style */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 text-xs bg-secondary border border-transparent rounded-md text-muted-foreground tag-chip flex items-center gap-1.5 backdrop-blur-sm">
                      <FolderOpen className="w-3 h-3" />
                      Project
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags - Matching Services section style */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-secondary border border-transparent rounded-md text-muted-foreground tag-chip"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Button variant="outline" size="lg" asChild>
            <Link to="/projects">
              <FolderOpen className="w-4 h-4" />
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
