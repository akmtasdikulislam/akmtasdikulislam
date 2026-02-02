import { motion } from "framer-motion";
import { Calendar, Code2, Users } from "lucide-react";

interface ProjectDetails {
  duration: string;
  team: string;
  role: string;
}

interface TechStack {
  frontend: string[];
  backend: string[];
  services: string[];
}

interface Screenshot {
  url: string;
  alt: string;
}

interface ProjectDetailsSidebarProps {
  details: ProjectDetails;
  techStack: TechStack;
  screenshots?: Screenshot[];
}

const ProjectDetailsSidebar = ({
  details,
  techStack,
}: ProjectDetailsSidebarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sticky top-24 bg-card border border-border rounded-xl p-6 space-y-6"
    >
      {/* Project Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Project Details</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-medium">{details.duration}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Team</p>
              <p className="font-medium">{details.team}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Code2 className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="font-medium">{details.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-semibold mb-4">Tech Stack</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-primary mb-2">Frontend</p>
            <div className="flex flex-wrap gap-2">
              {techStack.frontend.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs bg-primary/10 border border-primary/30 rounded-md text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-primary mb-2">Backend</p>
            <div className="flex flex-wrap gap-2">
              {techStack.backend.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs bg-primary/10 border border-primary/30 rounded-md text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-primary mb-2">Services</p>
            <div className="flex flex-wrap gap-2">
              {techStack.services.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs bg-primary/10 border border-primary/30 rounded-md text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetailsSidebar;
