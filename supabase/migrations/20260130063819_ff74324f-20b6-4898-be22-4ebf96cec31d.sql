-- Create author_profile table for managing blog author info
CREATE TABLE public.author_profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Akm Tasdikul Islam',
  title TEXT NOT NULL DEFAULT 'Full Stack Developer',
  bio TEXT DEFAULT 'Passionate about building beautiful and functional web applications.',
  avatar_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.author_profile ENABLE ROW LEVEL SECURITY;

-- RLS policies for author_profile
CREATE POLICY "Author profile is viewable by everyone" 
ON public.author_profile FOR SELECT USING (true);

CREATE POLICY "Admins can update author profile" 
ON public.author_profile FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert author profile" 
ON public.author_profile FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default author profile
INSERT INTO public.author_profile (name, title, bio) VALUES 
('Akm Tasdikul Islam', 'Full Stack Developer', 'Passionate about building beautiful and functional web applications.');

-- Create certifications table
CREATE TABLE public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  badge_image TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for certifications
CREATE POLICY "Certifications are viewable by everyone" 
ON public.certifications FOR SELECT USING (true);

CREATE POLICY "Admins can create certifications" 
ON public.certifications FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update certifications" 
ON public.certifications FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete certifications" 
ON public.certifications FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create work_history table
CREATE TABLE public.work_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  company_logo TEXT,
  technologies TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.work_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for work_history
CREATE POLICY "Work history is viewable by everyone" 
ON public.work_history FOR SELECT USING (true);

CREATE POLICY "Admins can create work history" 
ON public.work_history FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update work history" 
ON public.work_history FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete work history" 
ON public.work_history FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  company TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- RLS policies for testimonials
CREATE POLICY "Testimonials are viewable by everyone" 
ON public.testimonials FOR SELECT USING (true);

CREATE POLICY "Admins can create testimonials" 
ON public.testimonials FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update testimonials" 
ON public.testimonials FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete testimonials" 
ON public.testimonials FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_author_profile_updated_at
BEFORE UPDATE ON public.author_profile
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at
BEFORE UPDATE ON public.certifications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_work_history_updated_at
BEFORE UPDATE ON public.work_history
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();