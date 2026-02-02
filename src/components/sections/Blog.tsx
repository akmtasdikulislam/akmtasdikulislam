import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/ui/SectionHeading";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  category: string;
  read_time: number;
  published_at: string | null;
  created_at: string;
}

// Fallback static data
const staticPosts = [
  {
    id: "getting-started-mern-stack",
    title: "Getting Started with MERN Stack Development",
    slug: "getting-started-mern-stack",
    excerpt: "A comprehensive guide to building full-stack applications with MongoDB, Express, React, and Node.js.",
    cover_image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
    category: "Development",
    read_time: 8,
    published_at: "2025-01-15",
    created_at: "2025-01-15",
  },
  {
    id: "mastering-n8n-automation",
    title: "Mastering n8n Automation Workflows",
    slug: "mastering-n8n-automation",
    excerpt: "Learn how to create powerful automation workflows with n8n and integrate AI capabilities.",
    cover_image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=600&h=400&fit=crop",
    category: "Automation",
    read_time: 6,
    published_at: "2025-01-10",
    created_at: "2025-01-10",
  },
  {
    id: "building-scalable-react-apps",
    title: "Building Scalable React Applications",
    slug: "building-scalable-react-apps",
    excerpt: "Best practices for structuring large-scale React applications with TypeScript and modern tooling.",
    cover_image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop",
    category: "React",
    read_time: 10,
    published_at: "2025-01-05",
    created_at: "2025-01-05",
  },
];

const Blog = () => {
  const { data: posts = staticPosts, isLoading: loading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error loading blogs:', error);
        toast.error('Failed to load blog posts');
        throw error;
      }
      return data as BlogPost[];
    },
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return '';
    }
  };

  const { data: sectionVisible } = useQuery<boolean>({
    queryKey: ['section_visibility', 'blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_visibility' as any)
        .select('is_visible')
        .eq('section_key', 'blogs')
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

  return (
    <section id="blog" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          badge="Blog"
          title="Blog &"
          highlight="Insights"
          description="Thoughts, tutorials, and insights from my development journey"
        />

        {/* Blog grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {posts.map((post, index) => (
            <Link key={post.id} to={`/blog/${post.slug}`}>
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all h-full"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.cover_image || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />

                  {/* Category badge - Matching Services section style */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 text-xs bg-secondary border border-transparent rounded-md text-muted-foreground tag-chip flex items-center gap-1.5 backdrop-blur-sm">
                      <FileText className="w-3 h-3" />
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.published_at || post.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.read_time} min read
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <span className="inline-flex items-center text-sm text-primary hover:underline">
                    Read More
                    <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Button variant="outline" size="lg" asChild>
            <Link to="/blogs">
              <FileText className="w-4 h-4" />
              View All Posts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
