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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Briefcase, Building2, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface WorkHistory {
  id: string;
  company: string;
  position: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  company_logo: string | null;
  technologies: string[];
  display_order: number;
  is_visible: boolean;
}

const emptyWorkHistory = {
  company: '',
  position: '',
  location: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
  company_logo: '',
  technologies: '',
  is_visible: true,
};

const WorkHistoryList = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyWorkHistory);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: sectionVisible = true } = useQuery({
    queryKey: ['section_visibility', 'work_history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_visibility' as any)
        .select('is_visible')
        .eq('section_key', 'work_history')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? data.is_visible : true;
    },
    staleTime: 0,
  });

  const { data: workHistory = [], isLoading: loading } = useQuery({
    queryKey: ['work_history_admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_history')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;

      return (data as WorkHistory[] || []).sort((a, b) => {
        const getEndTime = (item: WorkHistory) =>
          item.is_current ? 8640000000000000 : (item.end_date ? new Date(item.end_date).getTime() : 0);

        const endA = getEndTime(a);
        const endB = getEndTime(b);

        if (endA !== endB) {
          return endB - endA;
        }

        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
      });
    },
  });

  const toggleSectionVisibility = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from('section_visibility' as any)
        .upsert({ section_key: 'work_history', is_visible: checked }, { onConflict: 'section_key' });

      if (error) throw error;

      toast.success(`Experience section ${checked ? 'visible' : 'hidden'}`);
      queryClient.invalidateQueries({ queryKey: ['section_visibility', 'work_history'] });
    } catch (error) {
      console.error('Error updating section visibility:', error);
      toast.error('Failed to update section visibility');
    }
  };

  const handleOpenDialog = (item?: WorkHistory) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        company: item.company,
        position: item.position,
        location: item.location || '',
        start_date: item.start_date,
        end_date: item.end_date || '',
        is_current: item.is_current,
        description: item.description || '',
        company_logo: item.company_logo || '',
        technologies: item.technologies?.join(', ') || '',
        is_visible: item.is_visible,
      });
    } else {
      setEditingId(null);
      setFormData(emptyWorkHistory);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.company || !formData.position || !formData.start_date) {
      toast.error('Please fill in required fields');
      return;
    }

    setSaving(true);
    try {
      const technologies = Array.isArray(formData.technologies)
        ? formData.technologies
        : typeof formData.technologies === 'string'
          ? (formData.technologies as string).split(',').map((t: string) => t.trim()).filter((t: string) => t)
          : [];

      const payload = {
        company: formData.company,
        position: formData.position,
        location: formData.location || null,
        start_date: formData.start_date,
        end_date: formData.is_current ? null : (formData.end_date || null),
        is_current: formData.is_current,
        description: formData.description || null,
        company_logo: formData.company_logo || null,
        technologies,
        is_visible: formData.is_visible,
      };

      if (editingId) {
        const { error } = await supabase
          .from('work_history')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Work experience updated successfully');
      } else {
        const { error } = await supabase
          .from('work_history')
          .insert([{ ...payload, display_order: workHistory.length }]);
        if (error) throw error;
        toast.success('Work experience added successfully');
      }

      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['work_history_admin'] });
      queryClient.invalidateQueries({ queryKey: ['work_history'] }); // Refresh public view too
    } catch (error) {
      console.error('Error saving work history:', error);
      toast.error('Failed to save work experience');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('work_history')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['work_history_admin'] });
      queryClient.invalidateQueries({ queryKey: ['work_history'] });
      toast.success('Work experience deleted successfully');
    } catch (error) {
      console.error('Error deleting work history:', error);
      toast.error('Failed to delete work experience');
    } finally {
      setDeleteId(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `company-logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('cms-uploads')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, company_logo: urlData.publicUrl }));
      toast.success('Logo uploaded');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const toggleVisibility = async (item: WorkHistory) => {
    try {
      const { error } = await supabase
        .from('work_history')
        .update({ is_visible: !item.is_visible })
        .eq('id', item.id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['work_history_admin'] });
      queryClient.invalidateQueries({ queryKey: ['work_history'] });
      toast.success(`Experience ${!item.is_visible ? 'visible' : 'hidden'}`);
    } catch (error) {
      console.error('Error updating work history:', error);
      toast.error('Failed to update visibility');
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Work History</h1>
          <p className="text-muted-foreground mt-1">Manage your employment timeline</p>
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
          <Button onClick={() => handleOpenDialog()} className="min-h-[44px]">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>
      </div>

      {workHistory.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No work experience yet</p>
          <Button onClick={() => handleOpenDialog()}>Add your first experience</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {workHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-start gap-4 ${!item.is_visible ? 'opacity-60' : ''}`}
            >
              <div className="w-14 h-14 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                {item.company_logo ? (
                  <img src={item.company_logo} alt={item.company} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{item.position}</h3>
                  {item.is_current && (
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{item.company}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>
                    {format(new Date(item.start_date), 'MMM yyyy')} –{' '}
                    {item.is_current ? 'Present' : item.end_date ? format(new Date(item.end_date), 'MMM yyyy') : 'N/A'}
                  </span>
                  {item.location && <span>• {item.location}</span>}
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
                )}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.technologies.slice(0, 5).map((tech) => (
                      <span key={tech} className="text-xs px-2 py-0.5 bg-secondary rounded-md">
                        {tech}
                      </span>
                    ))}
                    {item.technologies.length > 5 && (
                      <span className="text-xs text-muted-foreground">+{item.technologies.length - 5} more</span>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-1.5 sm:flex sm:gap-2 flex-shrink-0">
                <div className="flex items-center gap-2 mr-2">
                  <Switch
                    checked={item.is_visible}
                    onCheckedChange={() => toggleVisibility(item)}
                  />
                </div>
                <Button variant="outline" size="icon" onClick={() => handleOpenDialog(item)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDeleteId(item.id)}
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label>Visibility</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_visible}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
                />
                <span className="text-sm text-muted-foreground">
                  {formData.is_visible ? 'Visible' : 'Hidden'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Position / Title *</Label>
              <Input
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="e.g., Senior Developer"
              />
            </div>

            <div className="space-y-2">
              <Label>Company *</Label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g., Google"
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Remote, New York, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  disabled={formData.is_current}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_current"
                checked={formData.is_current}
                onCheckedChange={(checked) => setFormData({ ...formData, is_current: !!checked })}
              />
              <Label htmlFor="is_current" className="text-sm cursor-pointer">
                I currently work here
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Company Logo</Label>
              <div className="flex items-center gap-4">
                {formData.company_logo && (
                  <img src={formData.company_logo} alt="Logo" className="w-12 h-12 object-cover rounded-lg" />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Technologies (comma-separated)</Label>
              <Input
                value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="React, Node.js, TypeScript"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What did you do at this role?"
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Experience?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
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

export default WorkHistoryList;
