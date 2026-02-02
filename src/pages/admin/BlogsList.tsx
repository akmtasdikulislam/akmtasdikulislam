import ProfileDropdown from '@/components/admin/ProfileDropdown';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Edit, ExternalLink, Eye, EyeOff, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  category: string;
  status: string;
  featured: boolean;
  read_time: number;
  created_at: string;
  published_at: string | null;
}

const BlogsList = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: sectionVisible = true } = useQuery({
    queryKey: ['section_visibility', 'blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_visibility' as any)
        .select('is_visible')
        .eq('section_key', 'blogs')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? data.is_visible : true;
    },
    staleTime: 0,
  });

  const { data: posts = [], isLoading: loading } = useQuery({
    queryKey: ['blogs_admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const toggleSectionVisibility = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from('section_visibility' as any)
        .upsert({ section_key: 'blogs', is_visible: checked }, { onConflict: 'section_key' });

      if (error) throw error;

      toast.success(`Blog section ${checked ? 'visible' : 'hidden'}`);
      queryClient.invalidateQueries({ queryKey: ['section_visibility', 'blogs'] });
    } catch (error) {
      console.error('Error updating section visibility:', error);
      toast.error('Failed to update section visibility');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast.success('Blog post deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['blogs_admin'] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete blog post');
    } finally {
      setDeleteId(null);
    }
  };

  const toggleStatus = async (post: BlogPost) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    const publishedAt = newStatus === 'published' ? new Date().toISOString() : null;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ status: newStatus, published_at: publishedAt })
        .eq('id', post.id);

      if (error) throw error;

      toast.success(`Post ${newStatus === 'published' ? 'published' : 'unpublished'}`);
      queryClient.invalidateQueries({ queryKey: ['blogs_admin'] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground mt-1">Manage your blog content</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded-lg border border-border">
            <Switch
              checked={sectionVisible}
              onCheckedChange={toggleSectionVisibility}
            />
            <span className="text-sm font-medium">
              {sectionVisible ? 'Section Visible' : 'Section Hidden'}
            </span>
          </div>
          <ProfileDropdown />
          <Button asChild className="min-h-[44px]">
            <Link to="/admin/blogs/new" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <p className="text-muted-foreground mb-4">
            {posts.length === 0 ? 'No blog posts yet' : 'No posts match your search'}
          </p>
          {posts.length === 0 && (
            <Button asChild>
              <Link to="/admin/blogs/new">Create your first post</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 w-full max-w-full overflow-hidden min-w-0"
            >
              {/* Thumbnail */}
              <div className="w-full sm:w-24 h-24 sm:h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                {post.cover_image ? (
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No image
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold truncate">{post.title}</h3>
                  {post.featured && (
                    <span className="text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs px-2 py-1 bg-secondary rounded-md">
                    {post.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${post.status === 'published'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                    }`}>
                    {post.status}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(post.created_at), 'MMM d, yyyy')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {post.read_time} min read
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-1.5 sm:flex sm:gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleStatus(post)}
                  title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                >
                  {post.status === 'published' ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                {post.status === 'published' && (
                  <Button variant="outline" size="icon" asChild>
                    <Link to={`/blog/${post.slug}`} target="_blank">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="icon" asChild>
                  <Link to={`/admin/blogs/${post.id}`}>
                    <Edit className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDeleteId(post.id)}
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogsList;
