import SectionHeading from '@/components/ui/SectionHeading';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Star } from 'lucide-react';
import { toast } from 'sonner';

interface Activity {
  id: string;
  title: string;
  organization: string;
  location: string | null;
  event_date: string;
  description: string | null;
  activity_type: string;
  photos: string[] | null;
  is_featured: boolean;
  display_order: number;
  is_visible: boolean;
}

const activityTypeColors: Record<string, string> = {
  conference: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  workshop: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  hackathon: 'bg-green-500/20 text-green-400 border-green-500/30',
  meetup: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  event: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  travel: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  default: 'bg-primary/20 text-primary border-primary/30',
};

const getActivityTypeColor = (type: string) => {
  return activityTypeColors[type.toLowerCase()] || activityTypeColors.default;
};

const getActivityTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    conference: 'Conference',
    workshop: 'Workshop',
    hackathon: 'Hackathon',
    meetup: 'Meetup',
    event: 'Event',
    travel: 'Travel',
  };
  return labels[type] || type;
};

const Activities = () => {
  const { data: activities, isLoading: loading } = useQuery<Activity[]>({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('is_visible', true)
        .order('event_date', { ascending: false });

      if (error) {
        toast.error('Failed to load activities');
        throw error;
      }

      return data as Activity[] || [];
    },
  });

  const { data: sectionVisible = true } = useQuery<boolean>({
    queryKey: ['section_visibility', 'activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_visibility' as any)
        .select('is_visible')
        .eq('section_key', 'activities')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching section visibility:', error);
      }
      return data ? data.is_visible : true;
    },
    initialData: true,
    staleTime: 0,
  });

  if (sectionVisible === false) return null;

  if (loading || !activities || activities.length === 0) {
    return null;
  }

  return (
    <section id="activities" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          badge="Latest"
          title="Activities"
          highlight="What's Up"
          description="Conferences, events, and adventures"
        />

        <div className="mt-16 max-w-6xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] bg-border md:-translate-x-1/2" />

          <div className="space-y-12">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
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
                  <div className={`flex flex-col items-start ${index % 2 === 0 ? '' : 'md:items-end'
                    }`}>
                    {/* Date Bubble */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full text-xs font-medium text-primary mb-3 border border-primary/20 w-fit`}>
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(activity.event_date), 'MMM yyyy')}</span>
                    </div>

                    <div className={`bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all group w-full ${index % 2 === 0 ? 'text-left' : 'md:text-left'}`}>
                      {/* Activity Type & Featured */}
                      <div className="flex items-start gap-2 flex-wrap">
                        <div className={`px-2.5 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getActivityTypeColor(activity.activity_type)}`}>
                          {getActivityTypeLabel(activity.activity_type)}
                        </div>
                        {activity.is_featured && (
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0">
                            <Star className="w-3 h-3" />
                            <span>Featured</span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <div className="mt-3">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{activity.title}</h3>
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <span>{activity.organization}</span>
                          </div>
                          {activity.location && (
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span>{activity.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      {activity.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed mt-4">
                          {activity.description}
                        </p>
                      )}

                      {/* Photos Gallery - Prominent Display */}
                      {activity.photos && activity.photos.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-muted-foreground">Photos</span>
                            <span className="text-xs text-muted-foreground">{activity.photos.length} photo(s)</span>
                          </div>
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            {activity.photos.slice(0, 4).map((photo, idx) => (
                              <Dialog key={idx}>
                                <DialogTrigger asChild>
                                  <div className="relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 border border-border hover:border-primary/50 transition-all group-hover:scale-105">
                                    <img
                                      src={photo}
                                      alt={`Activity photo ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none">
                                  <DialogTitle className="sr-only">Activity Photo</DialogTitle>
                                  <div className="relative w-full h-[85vh] flex items-center justify-center">
                                    <img
                                      src={photo}
                                      alt={`Activity photo ${idx + 1}`}
                                      className="max-w-full max-h-full object-contain"
                                    />
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ))}
                            {activity.photos.length > 4 && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <div className="w-20 h-20 rounded-lg bg-secondary/50 flex items-center justify-center cursor-pointer flex-shrink-0 border border-border hover:border-primary/50 transition-all">
                                    <span className="text-xs font-medium">+{activity.photos.length - 4}</span>
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-6xl p-0 overflow-hidden bg-black/95 border-none">
                                  <DialogTitle className="sr-only">All Photos</DialogTitle>
                                  <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[80vh] overflow-y-auto">
                                    {activity.photos.map((photo, idx) => (
                                      <Dialog key={idx}>
                                        <DialogTrigger asChild>
                                          <div className="relative aspect-square rounded-lg overflow-hidden cursor-pointer">
                                            <img
                                              src={photo}
                                              alt={`Activity photo ${idx + 1}`}
                                              className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                                            />
                                          </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none">
                                          <DialogTitle className="sr-only">Activity Photo {idx + 1}</DialogTitle>
                                          <div className="relative w-full h-[85vh] flex items-center justify-center">
                                            <img
                                              src={photo}
                                              alt={`Activity photo ${idx + 1}`}
                                              className="max-w-full max-h-full object-contain"
                                            />
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                    ))}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
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

export default Activities;
