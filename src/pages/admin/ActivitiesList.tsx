import SectionHeadingEditor from '@/components/admin/SectionHeadingEditor';
import SectionVisibilityToggle from '@/components/admin/SectionVisibilityToggle';
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
import { Calendar, Edit, Eye, EyeOff, MapPin, Plus, Star, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Activity {
  id: string;
  title: string;
  organization: string;
  location: string | null;
  event_date: string;
  description: string | null;
  activity_type: string;
  cover_image: string | null;
  photos: string[] | null;
  tags?: string[] | null;
  is_featured: boolean;
  display_order: number;
  is_visible: boolean;
}

const emptyActivity = {
  title: '',
  organization: '',
  location: '',
  event_date: '',
  description: '',
  activity_type: 'event',
  cover_image: '',
  photos: [] as string[],
  tags: '',
  is_featured: false,
  is_visible: true,
} as {
  title: string;
  organization: string;
  location: string;
  event_date: string;
  description: string;
  activity_type: string;
  cover_image: string;
  photos: string[];
  tags: string;
  is_featured: boolean;
  is_visible: boolean;
};

const activityTypes = [
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'meetup', label: 'Meetup' },
  { value: 'event', label: 'Event' },
  { value: 'travel', label: 'Travel' },
];

const ActivitiesList = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyActivity);
  const [lastSnapshot, setLastSnapshot] = useState(emptyActivity);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const { data: activities = [], isLoading: loading } = useQuery<Activity[]>({
    queryKey: ['activities_admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities' as any)
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;

      return (data as unknown as Activity[]) || [];
    },
    refetchOnWindowFocus: false,
  });


  const handleOpenDialog = (item?: Activity) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        organization: item.organization,
        location: item.location || '',
        event_date: item.event_date,
        description: item.description || '',
        activity_type: item.activity_type,
        cover_image: item.cover_image || '',
        photos: item.photos || [],
        tags: item.tags?.join(', ') || '',
        is_featured: item.is_featured,
        is_visible: item.is_visible,
      });
      setLastSnapshot({
        title: item.title,
        organization: item.organization,
        location: item.location || '',
        event_date: item.event_date,
        description: item.description || '',
        activity_type: item.activity_type,
        cover_image: item.cover_image || '',
        photos: item.photos || [],
        tags: item.tags?.join(', ') || '',
        is_featured: item.is_featured,
        is_visible: item.is_visible,
      });
    } else {
      setEditingId(null);
      setFormData(emptyActivity);
      setLastSnapshot(emptyActivity);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.organization || !formData.event_date) {
      toast.error('Please fill in required fields');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        organization: formData.organization,
        location: formData.location || null,
        event_date: formData.event_date,
        description: formData.description || null,
        activity_type: formData.activity_type,
        cover_image: formData.cover_image || null,
        photos: formData.photos.length > 0 ? formData.photos : null,
        tags: formData.tags
          ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
          : null,
        is_featured: formData.is_featured,
        is_visible: formData.is_visible,
      };

      if (editingId) {
        const { error } = await supabase
          .from('activities' as any)
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Activity updated successfully');
      } else {
        const { error } = await supabase
          .from('activities' as any)
          .insert([{ ...payload, display_order: activities.length }]);
        if (error) throw error;
        toast.success('Activity added successfully');
      }

      setLastSnapshot(formData);
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['activities_admin'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error('Failed to save activity');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('activities' as any)
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['activities_admin'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Activity deleted successfully');
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
    } finally {
      setDeleteId(null);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `cover-${Date.now()}.${fileExt}`;
      const filePath = `activities/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('cms-uploads')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, cover_image: urlData.publicUrl }));
      toast.success('Cover image uploaded');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload cover image');
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhoto(true);
    try {
      const newPhotos: string[] = [...formData.photos];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `photo-${Date.now()}-${i}.${fileExt}`;
        const filePath = `activities/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('cms-uploads')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('cms-uploads')
          .getPublicUrl(filePath);

        newPhotos.push(urlData.publicUrl);
      }

      setFormData(prev => ({ ...prev, photos: newPhotos }));
      toast.success(`${files.length} photo(s) uploaded`);
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Failed to upload photos');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      if (editingId) {
        setFormData(lastSnapshot);
      } else {
        setFormData(emptyActivity);
      }
    }
    setDialogOpen(open);
  };

  const toggleVisibility = async (item: Activity) => {
    try {
      const { error } = await supabase
        .from('activities' as any)
        .update({ is_visible: !item.is_visible })
        .eq('id', item.id);

      if (error) throw error;
      if (editingId === item.id) {
        setFormData(prev => ({ ...prev, is_visible: !item.is_visible }));
        setLastSnapshot(prev => ({ ...prev, is_visible: !item.is_visible }));
      }
      queryClient.invalidateQueries({ queryKey: ['activities_admin'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success(`Activity ${!item.is_visible ? 'visible' : 'hidden'}`);
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error('Failed to update visibility');
    }
  };

  const toggleFeatured = async (item: Activity) => {
    try {
      const { error } = await supabase
        .from('activities' as any)
        .update({ is_featured: !item.is_featured })
        .eq('id', item.id);

      if (error) throw error;
      if (editingId === item.id) {
        setFormData(prev => ({ ...prev, is_featured: !item.is_featured }));
        setLastSnapshot(prev => ({ ...prev, is_featured: !item.is_featured }));
      }
      queryClient.invalidateQueries({ queryKey: ['activities_admin'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success(`Activity ${!item.is_featured ? 'featured' : 'unfeatured'}`);
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error('Failed to update featured status');
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
    <div className="space-y-6 w-full pb-20">
      <div className="max-w-6xl mx-auto w-full px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Activities</h1>
            <p className="text-muted-foreground mt-1">Manage your latest activities and events</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <SectionVisibilityToggle sectionKey="activities" label="Activities section" />
            <Button onClick={() => handleOpenDialog()} className="min-h-[44px]">
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4">
        <SectionHeadingEditor
          sectionKey="activities"
          defaultValues={{
            section_badge: 'Latest',
            section_title: 'Activities',
            section_highlight: "What's Up",
            section_description: 'Conferences, events, and adventures'
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto w-full px-4">
        {activities.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No activities yet</p>
            <Button onClick={() => handleOpenDialog()}>Add your first activity</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-start gap-4 ${!item.is_visible ? 'opacity-60' : ''}`}
              >
                <div className="w-full sm:w-32 h-24 rounded-lg bg-secondary overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {item.cover_image ? (
                    <img
                      src={item.cover_image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Calendar className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.is_featured && (
                    <span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded-full flex items-center gap-1 whitespace-nowrap">
                      <Star className="w-3 h-3" /> Featured
                    </span>
                  )}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${item.is_visible
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {item.is_visible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                  <p className="text-sm text-muted-foreground">{item.organization}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(item.event_date), 'MMM d, yyyy')}</span>
                    {item.location && (
                      <>
                        <span>•</span>
                        <MapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                      </>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
                  )}
                  {item.photos && item.photos.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs px-2 py-0.5 bg-secondary rounded-md">
                        {item.photos.length} photo(s)
                      </span>
                    </div>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.slice(0, 5).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-secondary rounded-md">
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 5 && (
                        <span className="text-xs text-muted-foreground">+{item.tags.length - 5} more</span>
                      )}
                    </div>
                  )}
                </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleFeatured(item)}
                  title={item.is_featured ? 'Unfeature' : 'Feature'}
                  className="min-h-[44px] min-w-[44px]"
                >
                  <Star className={`w-4 h-4 ${item.is_featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleVisibility(item)}
                  title={item.is_visible ? 'Hide' : 'Show'}
                  className="min-h-[44px] min-w-[44px]"
                >
                  {item.is_visible ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleOpenDialog(item)}
                  className="min-h-[44px] min-w-[44px]"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDeleteId(item.id)}
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground min-h-[44px] min-w-[44px]"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Activity' : 'Add Activity'}</DialogTitle>
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

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: !!checked })}
              />
              <Label htmlFor="is_featured" className="text-sm cursor-pointer">
                Mark as Featured
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Activity Type *</Label>
              <select
                value={formData.activity_type}
                onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
              >
                {activityTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Attended React Conf 2024"
              />
            </div>

            <div className="space-y-2">
              <Label>Organization *</Label>
              <Input
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g., React Conf, Google Developers"
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div className="space-y-2">
              <Label>Event Date *</Label>
              <Input
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Cover Photo (optional)</Label>
              <div className="flex items-center gap-4">
                {formData.cover_image && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                    <img src={formData.cover_image} alt="Cover" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, cover_image: '' }))}
                      className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={uploading}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">This will be the first image shown in the gallery</p>
            </div>

            <div className="space-y-2">
              <Label>Additional Photos</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.photos.map((photo, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
              />
              <p className="text-xs text-muted-foreground">You can select multiple photos at once</p>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the activity..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({
                  ...formData,
                  tags: e.target.value
                })}
                placeholder="e.g., leadership, discipline"
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
            <AlertDialogTitle>Delete Activity?</AlertDialogTitle>
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

export default ActivitiesList;
