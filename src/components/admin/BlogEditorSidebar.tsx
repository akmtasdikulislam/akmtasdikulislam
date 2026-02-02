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
import { supabase } from '@/integrations/supabase/client';
import { Image as ImageIcon, Plus, Star, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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

interface BlogEditorSidebarProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  categories: string[];
}

const BlogEditorSidebar = ({ formData, setFormData, categories }: BlogEditorSidebarProps) => {
  const [newTag, setNewTag] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `blogs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cms-uploads')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, cover_image: publicUrl }));
      toast.success('Cover image uploaded');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  return (
    <div className="w-80 shrink-0 border-l border-border bg-card/30 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Cover Image */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Cover Image</Label>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary border border-border">
            {formData.cover_image ? (
              <>
                <img
                  src={formData.cover_image}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setFormData(prev => ({ ...prev, cover_image: '' }))}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/80 flex items-center justify-center hover:bg-background"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ImageIcon className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Upload cover</span>
                  </>
                )}
              </label>
            )}
          </div>
          <Input
            value={formData.cover_image}
            onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
            placeholder="Or paste image URL..."
            className="text-xs"
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug" className="text-sm font-medium">URL Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="blog-post-slug"
            className="text-sm"
          />
          <p className="text-xs text-muted-foreground">/blog/{formData.slug || 'slug'}</p>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Category</Label>
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

        {/* Tags */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Tags</Label>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag"
              className="text-sm"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" variant="outline" size="icon" onClick={addTag}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-secondary rounded-full text-xs flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Featured */}
        <div className="flex items-center justify-between py-3 border-y border-border">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="featured" className="text-sm">Featured post</Label>
          </div>
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
          />
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Post Stats</Label>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-muted-foreground text-xs">Read Time</p>
              <p className="font-medium">{formData.read_time} min</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-muted-foreground text-xs">Words</p>
              <p className="font-medium">{formData.content.trim().split(/\s+/).filter(Boolean).length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditorSidebar;
