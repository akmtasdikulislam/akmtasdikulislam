import SectionHeading from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Award, Calendar, ExternalLink, FileImage } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  badge_image: string | null;
  certificate_image: string | null;
  description: string | null;
  display_order: number;
  is_visible: boolean;
}

const Certifications = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: certifications, isLoading: loading } = useQuery<Certification[]>({
    queryKey: ['certifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (error) {
        toast.error('Failed to load certifications');
        throw error;
      }
      return data as Certification[];
    },
    initialData: [], // Provide initial data to ensure 'certifications' is always an array
  });

  const { data: sectionVisible } = useQuery<boolean>({
    queryKey: ['section_visibility', 'certifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_visibility')
        .select('is_visible')
        .eq('section_key', 'certifications')
        .single();

      // PGRST116 is the error code for "No rows found"
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching section visibility:', error);
      }
      // If data is null (no setting found) or is_visible is true, default to true
      return data ? data.is_visible : true;
    },
    initialData: true, // Default to true if the query hasn't run or no data is found
  });

  if (!sectionVisible) return null;

  if (loading || certifications.length === 0) {
    return null;
  }

  return (
    <section id="certifications" className="py-24 relative overflow-hidden bg-secondary/10">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          badge="Credentials"
          title="My"
          highlight="Certifications"
          description="Professional certifications and badges I've earned"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all group flex flex-col h-full"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-secondary/50 p-2 flex-shrink-0 flex items-center justify-center border border-border overflow-hidden">
                  {cert.badge_image ? (
                    <img
                      src={cert.badge_image}
                      alt={cert.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Award className="w-8 h-8 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">{cert.issuer}</p>
                </div>
              </div>

              {cert.description && (
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {cert.description}
                </p>
              )}

              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-4 flex-wrap">
                <div className="flex flex-col text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>Issued {format(new Date(cert.issue_date), 'MMM yyyy')}</span>
                  </div>
                  {cert.credential_id && (
                    <span className="mt-1 font-mono opacity-70">ID: {cert.credential_id}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {cert.certificate_image && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 px-2 gap-1.5">
                          <FileImage className="w-3 h-3" />
                          <span className="text-xs">View</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/90 border-none">
                        <DialogTitle className="sr-only">Certificate View</DialogTitle>
                        <div className="relative w-full h-[80vh] flex items-center justify-center p-4">
                          <img
                            src={cert.certificate_image}
                            alt={`${cert.title} Certificate`}
                            className="max-w-full max-h-full object-contain rounded-md"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {cert.credential_url && (
                    <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5"
                      >
                        <span className="text-xs">Verify</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
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

export default Certifications;
