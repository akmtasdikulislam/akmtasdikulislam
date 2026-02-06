import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Image as ImageIcon, Plus, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const categories = ['Web App', 'Mobile App', 'SaaS', 'E-commerce', 'Landing Page', 'Dashboard', 'API', 'Other'];

const ProjectEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    slug: '',
    description: '',
    long_description: '',
    image: '',
    gallery: [] as string[],
    technologies: [] as string[], // Acts as "Tags"
    tech_stack: { frontend: [], backend: [], services: [] } as { frontend: string[]; backend: string[]; services: string[] },
    features: [] as { title: string; checked: boolean }[],
    challenges: [] as { challenge: string; solution: string }[],
    role: '',
    team: '',
    duration: '',
    category: 'Web App',
    live_url: '',
    github_url: '',
    featured: false,
    status: 'draft',
  });

  const [newTag, setNewTag] = useState('');
  const [newStackItem, setNewStackItem] = useState({ frontend: '', backend: '', services: '' });

  useEffect(() => {
    if (!isNew && id) {
      fetchProject();
    }
  }, [id, isNew]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const project = data as any;

      setFormData({
        title: project.title,
        subtitle: project.subtitle || '',
        slug: project.slug,
        description: project.description,
        long_description: project.long_description || '',
        image: project.image || '',
        gallery: project.gallery || [],
        technologies: project.technologies || [],
        tech_stack: project.tech_stack || { frontend: [], backend: [], services: [] },
        features: project.features || [],
        challenges: project.challenges || [],
        role: project.role || '',
        team: project.team || '',
        duration: project.duration || '',
        category: project.category,
        live_url: project.live_url || '',
        github_url: project.github_url || '',
        featured: project.featured,
        status: project.status,
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project');
      navigate('/admin/projects');
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cms-uploads')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: publicUrl }));
      toast.success('Image uploaded');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Tag Management
  const addTag = () => {
    if (newTag.trim() && !formData.technologies.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tag),
    }));
  };

  // Tech Stack Management
  const addStackItem = (category: 'frontend' | 'backend' | 'services') => {
    const val = newStackItem[category].trim();
    if (val && !formData.tech_stack[category].includes(val)) {
      setFormData(prev => ({
        ...prev,
        tech_stack: {
          ...prev.tech_stack,
          [category]: [...prev.tech_stack[category], val]
        }
      }));
      setNewStackItem(prev => ({ ...prev, [category]: '' }));
    }
  };

  const removeStackItem = (category: 'frontend' | 'backend' | 'services', item: string) => {
    setFormData(prev => ({
      ...prev,
      tech_stack: {
        ...prev.tech_stack,
        [category]: prev.tech_stack[category].filter(i => i !== item)
      }
    }));
  };

  // Feature Management
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { title: '', checked: true }]
    }));
  };

  const updateFeature = (index: number, field: 'title' | 'checked', value: any) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Challenge Management
  const addChallenge = () => {
    setFormData(prev => ({
      ...prev,
      challenges: [...prev.challenges, { challenge: '', solution: '' }]
    }));
  };

  const updateChallenge = (index: number, field: 'challenge' | 'solution', value: string) => {
    const newChallenges = [...formData.challenges];
    newChallenges[index] = { ...newChallenges[index], [field]: value };
    setFormData(prev => ({ ...prev, challenges: newChallenges }));
  };

  const removeChallenge = (index: number) => {
    setFormData(prev => ({
      ...prev,
      challenges: prev.challenges.filter((_, i) => i !== index)
    }));
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('cms-uploads')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('cms-uploads')
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...newUrls] }));
      toast.success(`${newUrls.length} images uploaded`);
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        ...formData,
        // Ensure JSON fields are properly formatted if needed, though supabase client handles objects fine
      };

      if (isNew) {
        const { error } = await supabase
          .from('projects')
          .insert([dataToSave]);

        if (error) throw error;
        toast.success('Project created');
      } else {
        const { error } = await supabase
          .from('projects')
          .update(dataToSave)
          .eq('id', id);

        if (error) throw error;
        toast.success('Project updated');
      }

      navigate('/admin/projects');
    } catch (error: any) {
      console.error('Error saving project:', error);
      if (error.code === '23505') {
        toast.error('A project with this slug already exists');
      } else {
        toast.error('Failed to save project');
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
    <div className="max-w-5xl mx-auto pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/projects')} className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">{isNew ? 'New Project' : 'Edit Project'}</h1>
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {isNew ? 'Create a new portfolio project' : 'Update project details'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <Button variant="outline" onClick={() => navigate('/admin/projects')} className="min-h-[44px]">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving} className="min-h-[44px]">
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">Save Changes</span>
                </span>
              )}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Basic Information */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" /> Basic Information
            </h2>

            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="E-Commerce Platform"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Full-featured online shopping experience"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="project-slug"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description for cards and previews..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="long_description">Overview / Full Description</Label>
                <Textarea
                  id="long_description"
                  value={formData.long_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, long_description: e.target.value }))}
                  placeholder="Detailed project overview..."
                  rows={6}
                />
              </div>
            </div>
          </div>

          {/* 2. Project Details */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" /> Project Details
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="Full Stack Developer"
                />
              </div>
              <div className="space-y-2">
                <Label>Team</Label>
                <Input
                  value={formData.team}
                  onChange={(e) => setFormData(prev => ({ ...prev, team: e.target.value }))}
                  placeholder="Solo Project"
                />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="3 months"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Project Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Live URL</Label>
                <Input
                  value={formData.live_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, live_url: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>GitHub URL</Label>
                <Input
                  value={formData.github_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
              />
              <Label htmlFor="featured">Feature this project on homepage</Label>
            </div>
          </div>

          {/* 3. Technology Stack */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" /> Tech Stack
            </h2>

            {/* General Tags */}
            <div className="space-y-3">
              <Label>Core Tags (Hero Section)</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="React, Node.js..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" onClick={addTag}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-secondary rounded-full text-sm flex items-center gap-2">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-border">
              {/* Frontend */}
              <div className="space-y-3">
                <Label className="text-primary">Frontend</Label>
                <div className="flex gap-2">
                  <Input
                    value={newStackItem.frontend}
                    onChange={(e) => setNewStackItem(prev => ({ ...prev, frontend: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStackItem('frontend'))}
                    placeholder="Add..."
                    className="h-8 text-sm"
                  />
                  <Button type="button" size="sm" variant="ghost" onClick={() => addStackItem('frontend')}><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="space-y-1">
                  {formData.tech_stack.frontend.map(item => (
                    <div key={item} className="flex items-center justify-between text-sm bg-muted/50 px-2 py-1 rounded">
                      {item}
                      <button type="button" onClick={() => removeStackItem('frontend', item)} className="text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Backend */}
              <div className="space-y-3">
                <Label className="text-primary">Backend</Label>
                <div className="flex gap-2">
                  <Input
                    value={newStackItem.backend}
                    onChange={(e) => setNewStackItem(prev => ({ ...prev, backend: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStackItem('backend'))}
                    placeholder="Add..."
                    className="h-8 text-sm"
                  />
                  <Button type="button" size="sm" variant="ghost" onClick={() => addStackItem('backend')}><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="space-y-1">
                  {formData.tech_stack.backend.map(item => (
                    <div key={item} className="flex items-center justify-between text-sm bg-muted/50 px-2 py-1 rounded">
                      {item}
                      <button type="button" onClick={() => removeStackItem('backend', item)} className="text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services/Tools */}
              <div className="space-y-3">
                <Label className="text-primary">Services & Tools</Label>
                <div className="flex gap-2">
                  <Input
                    value={newStackItem.services}
                    onChange={(e) => setNewStackItem(prev => ({ ...prev, services: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStackItem('services'))}
                    placeholder="Add..."
                    className="h-8 text-sm"
                  />
                  <Button type="button" size="sm" variant="ghost" onClick={() => addStackItem('services')}><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="space-y-1">
                  {formData.tech_stack.services.map(item => (
                    <div key={item} className="flex items-center justify-between text-sm bg-muted/50 px-2 py-1 rounded">
                      {item}
                      <button type="button" onClick={() => removeStackItem('services', item)} className="text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Media */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" /> Media
            </h2>
            <div className="space-y-4">
              <Label>Cover Image</Label>
              <div className="flex items-start gap-4">
                <div className="w-48 h-32 rounded-lg overflow-hidden bg-secondary flex items-center justify-center border border-border shrink-0">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <div className="flex gap-2">
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4.5. Gallery */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" /> Project Gallery
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Button type="button" variant="outline" className="relative cursor-pointer" disabled={uploading}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleGalleryUpload}
                      disabled={uploading}
                    />
                    <Plus className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Add Images'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Upload screenshots or additional images</p>
              </div>

              {formData.gallery.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
                  {formData.gallery.map((url, index) => (
                    <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border border-border bg-secondary">
                      <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-destructive/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                  No images in gallery
                </div>
              )}
            </div>
          </div>

          {/* 5. Key Features */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" /> Key Features
              </h2>
              <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                <Plus className="w-4 h-4 mr-2" /> Add Feature
              </Button>
            </div>

            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg border border-border/50">
                  <div className="cursor-pointer" onClick={() => updateFeature(index, 'checked', !feature.checked)}>
                    <CheckCircle2 className={`w-5 h-5 ${feature.checked ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <Input
                    value={feature.title}
                    onChange={(e) => updateFeature(index, 'title', e.target.value)}
                    placeholder="Feature description (e.g. Real-time notifications)"
                    className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 px-0"
                  />
                  <Button type="button" variant="ghost" onClick={() => removeFeature(index)} className="h-10 px-3 text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {formData.features.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4 italic">No features added yet.</p>
              )}
            </div>
          </div>

          {/* 6. Challenges & Solutions */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" /> Challenges & Solutions
              </h2>
              <Button type="button" variant="outline" size="sm" onClick={addChallenge}>
                <Plus className="w-4 h-4 mr-2" /> Add Challenge
              </Button>
            </div>

            <div className="space-y-4">
              {formData.challenges.map((item, index) => (
                <div key={index} className="p-4 bg-secondary/30 rounded-xl border border-border/50 space-y-3">
                  <div className="flex justify-between items-end gap-4">
                    <div className="w-full space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-destructive uppercase font-bold">Challenge</Label>
                        <Input
                          value={item.challenge}
                          onChange={(e) => updateChallenge(index, 'challenge', e.target.value)}
                          placeholder="Describe the challenge..."
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-primary uppercase font-bold">Solution</Label>
                        <Textarea
                          value={item.solution}
                          onChange={(e) => updateChallenge(index, 'solution', e.target.value)}
                          placeholder="How did you solve it?"
                          rows={2}
                          className="bg-background/50"
                        />
                      </div>
                    </div>
                    <Button type="button" variant="ghost" onClick={() => removeChallenge(index)} className="h-10 px-3 text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {formData.challenges.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4 italic">No challenges added yet.</p>
              )}
            </div>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default ProjectEditor;
