import SectionHeading from '@/components/ui/SectionHeading';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from "@tanstack/react-query";
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Briefcase, Building2, Calendar, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface WorkHistory {
  id: string;
  company: string;
  position: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  company_logo: string | null;
  technologies: string[];
  is_visible: boolean;
}

const EmploymentTimeline = () => {
  const { data: workHistory, isLoading: loading } = useQuery<WorkHistory[]>({
    queryKey: ['work_history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_history')
        .select('*')
        .eq('is_visible', true);

      if (error) {
        toast.error('Failed to load work history');
        throw error;
      }

      return (data as WorkHistory[] || []).sort((a, b) => {
        const getEndTime = (item: WorkHistory) =>
          item.is_current ? 8640000000000000 : (item.end_date ? new Date(item.end_date).getTime() : 0);

        const endA = getEndTime(a);
        const endB = getEndTime(b);

        if (endA !== endB) {
          return endB - endA;
        }

        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
      });
    },
  });

  const { data: sectionVisible } = useQuery<boolean>({
    queryKey: ['section_visibility', 'work_history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_visibility' as any)
        .select('is_visible')
        .eq('section_key', 'work_history')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine
        console.error('Error fetching section visibility:', error);
      }
      return data ? data.is_visible : true; // Default to visible if no setting or error
    },
    initialData: true, // Assume visible until data is fetched
    staleTime: 0,
  });

  if (sectionVisible === false) return null;

  if (loading || !workHistory || workHistory.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          badge="Work History"
          title="Professional"
          highlight="Experience"
          description="My career journey and professional milestones"
        />

        <div className="mt-16 max-w-6xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] bg-border md:-translate-x-1/2" />

          <div className="space-y-12">
            {workHistory.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col md:flex-row gap-8 relative ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-[28px] md:left-1/2 top-0 w-4 h-4 rounded-full bg-background border-4 border-primary z-10 -translate-x-1/2 md:-translate-x-1/2 shadow-[0_0_0_4px_rgba(var(--background),1)]" />

                {/* Content Card */}
                <div className={`flex-1 ml-16 md:ml-0 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right md:items-end'
                  }`}>
                  <div className={`flex flex-col ${index % 2 === 0 ? 'items-start' : 'md:items-end'
                    }`}>
                    {/* Date Bubble (Mobile only - Desktop handled differently or same?) */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full text-xs font-medium text-primary mb-3 border border-primary/20`}>
                      <Calendar className="w-3 h-3" />
                      <span>
                        {format(new Date(job.start_date), 'MMM yyyy')} -{' '}
                        {job.is_current ? 'Present' : job.end_date ? format(new Date(job.end_date), 'MMM yyyy') : 'N/A'}
                      </span>
                    </div>

                    <div className={`bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all group w-full ${index % 2 === 0 ? 'text-left' : 'md:text-left' /* Always left text inside card for readability */
                      }`}>
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-lg bg-secondary/30 flex items-center justify-center p-2 border border-border flex-shrink-0">
                          {job.company_logo ? (
                            <img src={job.company_logo} alt={job.company} className="w-full h-full object-contain" />
                          ) : (
                            <Building2 className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{job.position}</h3>
                          <div className="flex flex-col gap-1 mt-1">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                              <Briefcase className="w-3 h-3 flex-shrink-0" />
                              <span>{job.company}</span>
                            </div>
                            {job.location && (
                              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span>{job.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="h-2" />

                      {job.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          {job.description}
                        </p>
                      )}

                      {job.technologies && job.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {job.technologies.map(tech => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-secondary rounded-md text-xs font-medium text-foreground/80 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Empty space for opposite side on desktop */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmploymentTimeline;
