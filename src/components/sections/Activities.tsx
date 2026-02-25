import SectionHeading from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, MapPin, X } from 'lucide-react';
import { toast } from 'sonner';

interface Activity {
  id: string;
  title: string;
  organization: string;
  location: string | null;
  event_date: string;
  description: string | null;
  activity_type: string;
  cover_image: string | null;
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

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all h-full flex flex-col">
                {/* Cover Image */}
                {activity.cover_image ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={activity.cover_image}
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {activity.photos && activity.photos.length > 0 && (
                      <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded-full text-xs text-white flex items-center gap-1">
                        <span>{activity.photos.length} photos</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/30 flex items-center justify-center">
                    <span className="text-4xl opacity-30">
                      {activity.activity_type === 'conference' ? '🎤' :
                       activity.activity_type === 'hackathon' ? '💻' :
                       activity.activity_type === 'workshop' ? '🔧' :
                       activity.activity_type === 'travel' ? '✈️' : '🎉'}
                    </span>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  {/* Activity Type Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getActivityTypeColor(activity.activity_type)}`}>
                      {getActivityTypeLabel(activity.activity_type)}
                    </span>
                    {activity.is_featured && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors mb-2">
                    {activity.title}
                  </h3>

                  {/* Organization */}
                  <p className="text-muted-foreground text-sm mb-3">
                    {activity.organization}
                  </p>

                  {/* Date & Location */}
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{format(new Date(activity.event_date), 'MMMM d, yyyy')}</span>
                    </div>
                    {activity.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{activity.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {activity.description && (
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                      {activity.description}
                    </p>
                  )}

                  {/* Photos Gallery */}
                  {activity.photos && activity.photos.length > 0 && (
                    <div className="mt-auto pt-4 border-t border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium text-muted-foreground">Photos</span>
                        <span className="text-xs text-muted-foreground">({activity.photos.length})</span>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {activity.photos.slice(0, 4).map((photo, idx) => (
                          <Dialog key={idx}>
                            <DialogTrigger asChild>
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 border border-border hover:border-primary/50 transition-all">
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
                              <div className="w-16 h-16 rounded-lg bg-secondary/50 flex items-center justify-center cursor-pointer flex-shrink-0 border border-border hover:border-primary/50 transition-all">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;
