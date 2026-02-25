import SectionHeading from '@/components/ui/SectionHeading';
import { useSectionHeading } from '@/hooks/useHomepageContent';
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
  cover_image: string | null;
  photos: string[] | null;
  tags?: string[] | null;
  is_featured: boolean;
  display_order: number;
  is_visible: boolean;
}

const activityTypeColors: Record<string, string> = {
  conference: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  workshop: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  hackathon: 'bg-green-500/10 text-green-400 border-green-500/20',
  meetup: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  event: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  travel: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  default: 'bg-primary/10 text-primary border-primary/20',
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
        .from('activities' as any)
        .select('*')
        .eq('is_visible', true)
        .order('event_date', { ascending: false });

      if (error) {
        toast.error('Failed to load activities');
        throw error;
      }

      return (data as unknown as Activity[]) || [];
    },
    initialData: [],
  });

  const { data: heading, isLoading: headingLoading } = useSectionHeading('activities');

  if (headingLoading) return null;

  if (loading || !activities || activities.length === 0) {
    return null;
  }

  const getCoverImage = (activity: Activity) => {
    if (activity.cover_image) return activity.cover_image;
    if (activity.photos && activity.photos.length > 0) return activity.photos[0];
    return null;
  };

  const getAdditionalPhotos = (activity: Activity) => {
    if (!activity.photos || activity.photos.length === 0) return [];
    if (activity.cover_image) return activity.photos;
    return activity.photos.slice(1);
  };

  return (
    <section id="activities" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          badge={heading?.section_badge || 'Latest'}
          title={heading?.section_title || 'Activities'}
          highlight={heading?.section_highlight || "What's Up"}
          description={heading?.section_description || 'Conferences, events, and adventures'}
        />

        <div className="mt-16 max-w-6xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] bg-border md:-translate-x-1/2" />

          <div className="space-y-12">
            {activities.map((activity, index) => {
              const coverImage = getCoverImage(activity);
              const additionalPhotos = getAdditionalPhotos(activity);

              return (
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
                        <span>{format(new Date(activity.event_date), 'MMMM d, yyyy')}</span>
                      </div>

                      <div className={`bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all group w-full ${index % 2 === 0 ? 'text-left' : 'md:text-left'}`}>
                        {/* Cover Photo */}
                        {coverImage && (
                          <div className="relative">
                            <div className="h-56 overflow-hidden rounded-t-2xl">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <div className="cursor-pointer w-full h-full">
                                    <img
                                      src={coverImage}
                                      alt={activity.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none">
                                  <DialogTitle className="sr-only">{activity.title}</DialogTitle>
                                  <div className="relative w-full h-[85vh] flex items-center justify-center">
                                    <img
                                      src={coverImage}
                                      alt={activity.title}
                                      className="max-w-full max-h-full object-contain"
                                    />
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        )}

                        <div className="p-6">
                          {/* Header with Type Badge and Title */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium border tag-chip ${getActivityTypeColor(activity.activity_type)}`}>
                                  {getActivityTypeLabel(activity.activity_type)}
                                </span>
                                {activity.is_featured && (
                                  <span className="px-2 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 tag-chip">
                                    <Star className="w-3 h-3" />
                                    Featured
                                  </span>
                                )}
                              </div>
                              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{activity.title}</h3>
                            </div>
                          </div>

                          {/* Organization & Location */}
                          <div className="mt-2 text-muted-foreground">
                            <p className="text-sm">{activity.organization}</p>
                            {activity.location && (
                              <div className="flex items-center gap-1.5 mt-1 text-xs">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span>{activity.location}</span>
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          {activity.description && (
                            <p className="text-muted-foreground text-sm leading-relaxed mt-4">
                              {activity.description}
                            </p>
                          )}

                          {activity.tags && activity.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {activity.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-secondary rounded-md text-xs font-medium text-foreground/80 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Additional Photos */}
                          {additionalPhotos.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-medium text-muted-foreground">Photos</span>
                                <span className="text-xs text-muted-foreground">({additionalPhotos.length})</span>
                              </div>
                              <div className="flex gap-2 overflow-x-auto pb-1">
                                {additionalPhotos.slice(0, 4).map((photo, idx) => (
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
                                {additionalPhotos.length > 4 && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <div className="w-16 h-16 rounded-lg bg-secondary/50 flex items-center justify-center cursor-pointer flex-shrink-0 border border-border hover:border-primary/50 transition-all">
                                        <span className="text-xs font-medium">+{additionalPhotos.length - 4}</span>
                                      </div>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-6xl p-0 overflow-hidden bg-black/95 border-none">
                                      <DialogTitle className="sr-only">All Photos</DialogTitle>
                                      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[80vh] overflow-y-auto">
                                        {additionalPhotos.map((photo, idx) => (
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
                  </div>

                  {/* Empty space for opposite side on desktop */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Activities;
