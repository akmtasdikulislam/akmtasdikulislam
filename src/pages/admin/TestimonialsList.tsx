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
import { motion } from 'framer-motion';
import { Edit, Plus, Quote, Star, Trash2, User } from 'lucide-react';
import { useState } from 'react';
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
  display_order: number;
  is_visible: boolean;
}

const emptyTestimonial = {
  name: '',
  position: '',
  company: '',
  content: '',
  avatar_url: '',
  rating: 5,
  is_featured: false,
  is_visible: true,
};

const TestimonialsList = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyTestimonial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: sectionVisible = true } = useQuery({
    queryKey: ['section_visibility', 'testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_visibility' as any)
        .select('is_visible')
        .eq('section_key', 'testimonials')
        .single(); // Ensure single row fetch

      if (error && error.code !== 'PGRST116') throw error;
      return data ? data.is_visible : true;
    },
    initialData: true,
    staleTime: 0,
  });

  const { data: testimonials = [], isLoading: loading } = useQuery({
    queryKey: ['testimonials_admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const toggleSectionVisibility = async (checked: boolean) => {
    try {
      console.log('Attempting to update section visibility:', { section_key: 'testimonials', is_visible: checked });

      const { data, error } = await supabase
        .from('section_visibility' as any)
        .upsert({ section_key: 'testimonials', is_visible: checked }, { onConflict: 'section_key' })
        .select();

      console.log('Upsert result:', { data, error });

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Section visibility updated successfully');
      toast.success(`Testimonials section ${checked ? 'visible' : 'hidden'}`);
      queryClient.invalidateQueries({ queryKey: ['section_visibility', 'testimonials'] });
    } catch (error) {
      console.error('Error updating section visibility:', error);
      toast.error('Failed to update section visibility');
    }
  };

  const handleOpenDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingId(testimonial.id);
      setFormData({
        name: testimonial.name,
        position: testimonial.position || '',
        company: testimonial.company || '',
        content: testimonial.content,
        avatar_url: testimonial.avatar_url || '',
        rating: testimonial.rating,
        is_featured: testimonial.is_featured,
        is_visible: testimonial.is_visible,
      });
    } else {
      setEditingId(null);
      setFormData(emptyTestimonial);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.content) {
      toast.error('Please fill in required fields');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        position: formData.position || null,
        company: formData.company || null,
        content: formData.content,
        avatar_url: formData.avatar_url || null,
        rating: formData.rating,
        is_featured: formData.is_featured,
        is_visible: formData.is_visible,
      };

      if (editingId) {
        const { error } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Testimonial updated successfully');
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([{ ...payload, display_order: testimonials.length }]);
        if (error) throw error;
        toast.success('Testimonial added successfully');
      }

      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['testimonials_admin'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      toast.success('Testimonial deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['testimonials_admin'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
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
      const fileName = `testimonial-avatar-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('cms-uploads')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, avatar_url: urlData.publicUrl }));
      toast.success('Avatar uploaded');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const toggleFeatured = async (testimonial: Testimonial) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_featured: !testimonial.is_featured })
        .eq('id', testimonial.id);

      if (error) throw error;
      toast.success(`Testimonial ${!testimonial.is_featured ? 'featured' : 'unfeatured'}`);
      queryClient.invalidateQueries({ queryKey: ['testimonials_admin'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
    }
  };

  const toggleVisibility = async (t: Testimonial) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_visible: !t.is_visible })
        .eq('id', t.id);

      if (error) throw error;
      toast.success(`Testimonial ${!t.is_visible ? 'visible' : 'hidden'}`);
      queryClient.invalidateQueries({ queryKey: ['testimonials_admin'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    } catch (error) {
      console.error('Error updating testimonial:', error);
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
          <h1 className="text-2xl sm:text-3xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground mt-1">Manage client testimonials and reviews</p>
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
            Add Testimonial
          </Button>
        </div>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <Quote className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No testimonials yet</p>
          <Button onClick={() => handleOpenDialog()}>Add your first testimonial</Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-card border border-border rounded-xl p-6 relative ${!testimonial.is_visible ? 'opacity-60' : ''}`}
            >
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <Switch
                  checked={testimonial.is_visible}
                  onCheckedChange={() => toggleVisibility(testimonial)}
                />
                {testimonial.is_featured && (
                  <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Quote icon */}
              <Quote className="w-8 h-8 text-primary/30 mb-4" />

              {/* Content */}
              <p className="text-muted-foreground line-clamp-4 mb-4">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
                      }`}
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
                  {testimonial.avatar_url ? (
                    <img src={testimonial.avatar_url} alt={testimonial.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{testimonial.name}</p>
                  {(testimonial.position || testimonial.company) && (
                    <p className="text-xs text-muted-foreground truncate">
                      {[testimonial.position, testimonial.company].filter(Boolean).join(' at ')}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFeatured(testimonial)}
                >
                  <Star className={`w-4 h-4 mr-1 ${testimonial.is_featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                  {testimonial.is_featured ? 'Unfeature' : 'Feature'}
                </Button>
                <div className="flex-1" />
                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(testimonial)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(testimonial.id)}
                  className="text-destructive hover:bg-destructive/10"
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
            <DialogTitle>{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
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
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Client name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Position</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g., CEO"
                />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g., Acme Inc"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Testimonial Content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="What did they say about you?"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: i + 1 })}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${i < formData.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Avatar</Label>
              <div className="flex items-center gap-4">
                {formData.avatar_url && (
                  <img src={formData.avatar_url} alt="Avatar" className="w-12 h-12 object-cover rounded-full" />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: !!checked })}
              />
              <Label htmlFor="is_featured" className="text-sm cursor-pointer">
                Feature this testimonial
              </Label>
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
            <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
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

export default TestimonialsList;
