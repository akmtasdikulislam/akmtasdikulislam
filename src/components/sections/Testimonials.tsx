import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import SectionHeading from '@/components/ui/SectionHeading';
import { useTestimonialsContent } from '@/hooks/useHomepageContent';
import Autoplay from 'embla-carousel-autoplay';
import { Quote, Star, User } from 'lucide-react';

const Testimonials = () => {
  const { data: testimonials = [], isLoading: loading } = useTestimonialsContent();

  if (loading || !testimonials || testimonials.length === 0) {
    return null;
  }

  // Filter visible ones just in case DB query didn't (though my query does)
  const displayTestimonials = testimonials.filter((t: any) => t.is_visible);

  if (displayTestimonials.length === 0) return null;

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
              {displayTestimonials.map((item: any) => (
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
                        {item.image_url ? (
                          <img
                            src={item.image_url}
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
