import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import authorPhotoFallback from "@/assets/author-photo.png";

interface AuthorProfile {
  name: string;
  title: string;
  bio: string | null;
  avatar_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  email: string | null;
}

interface AuthorCardProps {
  showSocials?: boolean;
}

const AuthorCard = ({ showSocials = true }: AuthorCardProps) => {
  const [profile, setProfile] = useState<AuthorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('author_profile')
          .select('*')
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching author profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Fallback values
  const name = profile?.name || "Akm Tasdikul Islam";
  const role = profile?.title || "Full-Stack Developer";
  const avatarUrl = profile?.avatar_url || authorPhotoFallback;

  const socials = [
    { 
      icon: Github, 
      href: profile?.github_url || "https://github.com/akmtasdikulislam", 
      label: "GitHub",
      show: true
    },
    { 
      icon: Linkedin, 
      href: profile?.linkedin_url || "https://linkedin.com/in/akmtasdikulislam", 
      label: "LinkedIn",
      show: true
    },
    { 
      icon: Mail, 
      href: profile?.email ? `mailto:${profile.email}` : "mailto:akmtasdikulislam@gmail.com", 
      label: "Email",
      show: true
    },
  ].filter(s => s.show && s.href);

  if (loading) {
    return (
      <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl animate-pulse">
        <div className="w-14 h-14 rounded-full bg-secondary" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-secondary rounded w-32" />
          <div className="h-3 bg-secondary rounded w-24" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl"
    >
      <div className="w-14 h-14 rounded-full border-2 border-primary/30 overflow-hidden bg-secondary">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
      {showSocials && socials.length > 0 && (
        <div className="flex gap-2">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <social.icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AuthorCard;
