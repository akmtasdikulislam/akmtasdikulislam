import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import SectionHeading from '@/components/ui/SectionHeading';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import Autoplay from 'embla-carousel-autoplay';
import { Quote, Star, User } from 'lucide-react';
import { toast } from 'sonner';

interface Testimonial {
  id: string;
  name: string;
  position: string | null;
  company: string | null;
  content: string;
  avatar_url: string | null;
  rating: number;
  is_featured: boolean;
  is_visible: boolean;
}

const Testimonials = () => {
  const { data: testimonials = [], isLoading: loading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (error) {
        toast.error('Failed to load testimonials');
        throw error;
      }
      return data as Testimonial[];
    },
  });

  const { data: sectionVisible } = useQuery({
    queryKey: ['section_visibility', 'testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_visibility')
        .select('is_visible')
        .eq('section_key', 'testimonials')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching section visibility:', error);
      }
      return data ? data.is_visible : true;
    },
    initialData: true,
  });

  if (!sectionVisible) return null;

  if (loading || testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-secondary/10">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          badge="Testimonials"
          title="Client"
          highlight="Stories"
          description="What others say about working with me"
        />

        <div className="mt-12 max-w-5xl mx-auto">
          <Carousel
            opts={{
              align: 'center',
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 5000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((item) => (
                <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/2 p-2">
                  <div className="h-full p-8 bg-card border border-border rounded-2xl flex flex-col relative group hover:border-primary/50 transition-colors">
                    <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10 group-hover:text-primary/20 transition-colors" />

                    <div className="flex gap-1 mb-6">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < item.rating ? 'text-primary fill-primary' : 'text-muted/30'
                            }`}
                        />
                      ))}
                    </div>

                    <blockquote className="flex-1 text-muted-foreground leading-relaxed mb-6 font-medium">
                      "{item.content}"
                    </blockquote>

                    <div className="flex items-center gap-4 mt-auto">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary border border-border flex-shrink-0">
                        {item.avatar_url ? (
                          <img
                            src={item.avatar_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="font-bold text-foreground">{item.name}</div>
                        {(item.position || item.company) && (
                          <div className="text-sm text-primary/80">
                            {[item.position, item.company].filter(Boolean).join(' at ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="-left-12" />
              <CarouselNext className="-right-12" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
