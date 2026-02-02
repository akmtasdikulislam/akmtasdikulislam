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
import { motion } from 'framer-motion';
import { Edit, ExternalLink, Eye, EyeOff, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  category: string;
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

const ProjectsList = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: sectionVisible = true } = useQuery({
    queryKey: ['section_visibility', 'projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_visibility' as any)
        .select('is_visible')
        .eq('section_key', 'projects')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? data.is_visible : true;
    },
    staleTime: 0, // Ensure fresh data
  });

  const { data: projects = [], isLoading: loading } = useQuery({
    queryKey: ['projects_admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
  });

  const toggleSectionVisibility = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from('section_visibility' as any)
        .upsert({ section_key: 'projects', is_visible: checked }, { onConflict: 'section_key' });

      if (error) throw error;

      toast.success(`Projects section ${checked ? 'visible' : 'hidden'}`);
      queryClient.invalidateQueries({ queryKey: ['section_visibility', 'projects'] });
    } catch (error) {
      console.error('Error updating section visibility:', error);
      toast.error('Failed to update section visibility');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast.success('Project deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['projects_admin'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    } finally {
      setDeleteId(null);
    }
  };

  const toggleStatus = async (project: Project) => {
    const newStatus = project.status === 'published' ? 'draft' : 'published';

    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', project.id);

      if (error) throw error;

      toast.success(`Project ${newStatus === 'published' ? 'published' : 'unpublished'}`);
      queryClient.invalidateQueries({ queryKey: ['projects_admin'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-2xl sm:text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio projects</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded-lg border border-border">
            <Switch
              checked={sectionVisible}
              onCheckedChange={toggleSectionVisibility}
            />
            <span className="text-sm font-medium">
              {sectionVisible ? 'Section Visible' : 'Section Hidden'}
            </span>
          </div>
          <Button asChild className="min-h-[44px]">
            <Link to="/admin/projects/new" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <p className="text-muted-foreground mb-4">
            {projects.length === 0 ? 'No projects yet' : 'No projects match your search'}
          </p>
          {projects.length === 0 && (
            <Button asChild>
              <Link to="/admin/projects/new">Create your first project</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full max-w-full overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="w-full sm:w-20 md:w-24 h-32 sm:h-20 md:h-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No image
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start sm:items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-base sm:text-lg break-words">{project.title}</h3>
                  {project.featured && (
                    <span className="text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded-full whitespace-nowrap flex-shrink-0">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 break-words">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 bg-secondary rounded-md whitespace-nowrap">
                    {project.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${project.status === 'published'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                    }`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleStatus(project)}
                  title={project.status === 'published' ? 'Unpublish' : 'Publish'}
                  className="min-h-[44px] min-w-[44px]"
                >
                  {project.status === 'published' ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                {project.status === 'published' && (
                  <Button variant="outline" size="icon" asChild className="min-h-[44px] min-w-[44px]">
                    <Link to={`/project/${project.slug}`} target="_blank">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="icon" asChild className="min-h-[44px] min-w-[44px]">
                  <Link to={`/admin/projects/${project.id}`}>
                    <Edit className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDeleteId(project.id)}
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground min-h-[44px] min-w-[44px]"
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
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The project will be permanently deleted.
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

export default ProjectsList;
