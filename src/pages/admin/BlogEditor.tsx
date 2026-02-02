import BlogEditorSidebar from '@/components/admin/BlogEditorSidebar';
import TipTapEditor from '@/components/editor/TipTapEditor';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Save } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const categories = ['Technology', 'Web Development', 'Tutorial', 'Career', 'Automation', 'Design', 'Other'];

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  tags: string[];
  read_time: number;
  featured: boolean;
  status: string;
}

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category: 'Technology',
    tags: [],
    read_time: 0,
    featured: false,
    status: 'draft',
  });

  useEffect(() => {
    if (!isNew && id) {
      fetchPost();
    }
  }, [id, isNew]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        cover_image: data.cover_image || '',
        category: data.category,
        tags: data.tags || [],
        read_time: data.read_time || 0,
        featured: data.featured,
        status: data.status,
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load blog post');
      navigate('/admin/blogs');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const calculateReadTime = useCallback((content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    if (content.trim().length === 0) return 0;
    return Math.ceil(words / wordsPerMinute);
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug,
    }));
  };

  const handleContentChange = useCallback((content: string, textContent: string) => {
    setFormData(prev => ({
      ...prev,
      content,
      read_time: calculateReadTime(textContent),
    }));
  }, [calculateReadTime]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      toast.error('Title, excerpt, and content are required');
      return;
    }

    setSaving(true);
    try {
      const shouldSetPublishedAt = formData.status === 'published';

      const dataToSave: Record<string, any> = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image: formData.cover_image || null,
        category: formData.category,
        tags: formData.tags,
        read_time: formData.read_time,
        featured: formData.featured,
        status: formData.status,
      };

      if (shouldSetPublishedAt) {
        dataToSave.published_at = new Date().toISOString();
      }

      if (isNew) {
        const { error } = await supabase
          .from('blog_posts')
          .insert([dataToSave as any]);

        if (error) throw error;
        toast.success('Blog post created');
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .update(dataToSave as any)
          .eq('id', id);

        if (error) throw error;
        toast.success('Blog post updated');
      }

      navigate('/admin/blogs');
    } catch (error: any) {
      console.error('Error saving post:', error);
      if (error.code === '23505') {
        toast.error('A post with this slug already exists');
      } else {
        toast.error('Failed to save blog post');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-b border-border bg-card/50">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blogs')} className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold truncate">{isNew ? 'New Blog Post' : 'Edit Blog Post'}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {formData.read_time} min read • {formData.status === 'published' ? 'Published' : 'Draft'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-xs sm:text-sm"
            >
              {sidebarOpen ? <EyeOff className="w-4 h-4 sm:mr-2" /> : <Eye className="w-4 h-4 sm:mr-2" />}
              <span className="hidden sm:inline">{sidebarOpen ? 'Hide' : 'Show'} Settings</span>
            </Button>

            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-24 sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => handleSubmit()} disabled={saving} className="min-h-[44px]">
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">{isNew ? 'Publish' : 'Save'}</span>
                </span>
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Editor panel - shows real-time preview */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
            {/* Title input styled as heading */}
            <div className="mb-6">
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Post title..."
                className="w-full text-2xl sm:text-3xl md:text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/40"
              />
            </div>

            {/* Excerpt input */}
            <div className="mb-8 pb-6 border-b border-border">
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Write a brief summary that appears in previews and SEO..."
                className="w-full text-lg text-muted-foreground bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/40"
                rows={2}
              />
            </div>

            {/* TipTap Editor with real-time preview */}
            <div className="prose-container">
              <TipTapEditor
                content={formData.content}
                onChange={handleContentChange}
                placeholder="Start typing or press '/' for commands..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <BlogEditorSidebar
            formData={formData}
            setFormData={setFormData}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
};

export default BlogEditor;
