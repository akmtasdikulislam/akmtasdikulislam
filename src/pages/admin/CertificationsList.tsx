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
import { Award, Edit, ExternalLink, GripVertical, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
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

const emptyCertification = {
  title: '',
  issuer: '',
  issue_date: '',
  expiry_date: '',
  credential_id: '',
  credential_url: '',
  badge_image: '',
  certificate_image: '',
  description: '',
  is_visible: true,
};

const CertificationsList = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyCertification);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);

  const { data: sectionVisible = true } = useQuery({
    queryKey: ['section_visibility', 'certifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_visibility' as any)
        .select('is_visible')
        .eq('section_key', 'certifications')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? data.is_visible : true;
    },
    staleTime: 0,
  });

  const { data: certifications = [], isLoading: loading } = useQuery({
    queryKey: ['certifications_admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return (data as Certification[]) || [];
    },
  });

  const toggleSectionVisibility = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from('section_visibility' as any)
        .upsert({ section_key: 'certifications', is_visible: checked }, { onConflict: 'section_key' });

      if (error) throw error;

      toast.success(`Certifications section ${checked ? 'visible' : 'hidden'}`);
      queryClient.invalidateQueries({ queryKey: ['section_visibility', 'certifications'] });
    } catch (error) {
      console.error('Error updating section visibility:', error);
      toast.error('Failed to update section visibility');
    }
  };

  const handleOpenDialog = (certification?: Certification) => {
    if (certification) {
      setEditingId(certification.id);
      setFormData({
        title: certification.title,
        issuer: certification.issuer,
        issue_date: certification.issue_date,
        expiry_date: certification.expiry_date || '',
        credential_id: certification.credential_id || '',
        credential_url: certification.credential_url || '',
        badge_image: certification.badge_image || '',
        certificate_image: certification.certificate_image || '',
        description: certification.description || '',
        is_visible: certification.is_visible,
      });
    } else {
      setEditingId(null);
      setFormData(emptyCertification);
    }
    setDialogOpen(true);
  };

  // ... (handleSave, handleDelete, uploads... keep existing)

  const handleSave = async () => {
    if (!formData.title || !formData.issuer || !formData.issue_date) {
      toast.error('Please fill in required fields');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        issuer: formData.issuer,
        issue_date: formData.issue_date,
        expiry_date: formData.expiry_date || null,
        credential_id: formData.credential_id || null,
        credential_url: formData.credential_url || null,
        badge_image: formData.badge_image || null,
        certificate_image: formData.certificate_image || null,
        description: formData.description || null,
        is_visible: formData.is_visible,
      };

      if (editingId) {
        const { error } = await supabase
          .from('certifications')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Certification updated successfully');
      } else {
        const { error } = await supabase
          .from('certifications')
          .insert([{ ...payload, display_order: certifications.length }]);
        if (error) throw error;
        toast.success('Certification added successfully');
      }

      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['certifications_admin'] });
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
    } catch (error) {
      console.error('Error saving certification:', error);
      toast.error('Failed to save certification');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['certifications_admin'] });
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast.success('Certification deleted successfully');
    } catch (error) {
      console.error('Error deleting certification:', error);
      toast.error('Failed to delete certification');
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
      const fileName = `cert-badge-${Date.now()}.${fileExt}`;
      const filePath = `certifications/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('cms-uploads')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, badge_image: urlData.publicUrl }));
      toast.success('Badge image uploaded');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleCertificateImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCert(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `cert-full-${Date.now()}.${fileExt}`;
      const filePath = `certifications/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('cms-uploads')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, certificate_image: urlData.publicUrl }));
      toast.success('Certificate image uploaded');
    } catch (error) {
      console.error('Error uploading certificate image:', error);
      toast.error('Failed to upload certificate image');
    } finally {
      setUploadingCert(false);
    }
  };

  const toggleVisibility = async (cert: Certification) => {
    try {
      const { error } = await supabase
        .from('certifications')
        .update({ is_visible: !cert.is_visible })
        .eq('id', cert.id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['certifications_admin'] });
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast.success(`Certification ${!cert.is_visible ? 'visible' : 'hidden'}`);
    } catch (error) {
      console.error('Error updating certification:', error);
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
          <h1 className="text-2xl sm:text-3xl font-bold">Certifications & Badges</h1>
          <p className="text-muted-foreground mt-1">Manage your certifications and achievements</p>
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
            Add Certification
          </Button>
        </div>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No certifications yet</p>
          <Button onClick={() => handleOpenDialog()}>Add your first certification</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${!cert.is_visible ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-3 flex-shrink-0">
                <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                  {cert.badge_image ? (
                    <img src={cert.badge_image} alt={cert.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Award className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{cert.title}</h3>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Issued: {format(new Date(cert.issue_date), 'MMM yyyy')}</span>
                  {cert.expiry_date && (
                    <span>Expires: {format(new Date(cert.expiry_date), 'MMM yyyy')}</span>
                  )}
                  {cert.credential_id && <span>ID: {cert.credential_id}</span>}
                  {cert.certificate_image && (
                    <span className="flex items-center gap-1 text-primary">
                      <ImageIcon className="w-3 h-3" />
                      Has Image
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 sm:flex sm:gap-2 flex-shrink-0">
                <div className="flex items-center gap-2 mr-2">
                  <Switch
                    checked={cert.is_visible}
                    onCheckedChange={() => toggleVisibility(cert)}
                  />
                </div>
                {cert.credential_url && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="icon" onClick={() => handleOpenDialog(cert)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDeleteId(cert.id)}
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
            <DialogTitle>{editingId ? 'Edit Certification' : 'Add Certification'}</DialogTitle>
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
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., AWS Solutions Architect"
              />
            </div>

            <div className="space-y-2">
              <Label>Issuing Organization *</Label>
              <Input
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                placeholder="e.g., Amazon Web Services"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Issue Date *</Label>
                <Input
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Credential ID</Label>
              <Input
                value={formData.credential_id}
                onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                placeholder="Certificate ID or number"
              />
            </div>

            <div className="space-y-2">
              <Label>Credential URL</Label>
              <Input
                value={formData.credential_url}
                onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Badge Image</Label>
                <div className="flex flex-col gap-2">
                  {formData.badge_image && (
                    <img src={formData.badge_image} alt="Badge" className="w-16 h-16 object-cover rounded-lg" />
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
                <Label>Certificate Image</Label>
                <div className="flex flex-col gap-2">
                  {formData.certificate_image && (
                    <img src={formData.certificate_image} alt="Cert" className="w-16 h-16 object-cover rounded-lg" />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleCertificateImageUpload}
                    disabled={uploadingCert}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the certification"
                rows={3}
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
            <AlertDialogTitle>Delete Certification?</AlertDialogTitle>
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

export default CertificationsList;
