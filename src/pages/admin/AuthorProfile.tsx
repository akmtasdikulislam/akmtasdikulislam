import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Save, Upload, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AuthorProfileData {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  avatar_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  email: string | null;
}

const AuthorProfile = () => {
  const [profile, setProfile] = useState<AuthorProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('author_profile')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load author profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('author_profile')
        .update({
          name: profile.name,
          title: profile.title,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          github_url: profile.github_url,
          linkedin_url: profile.linkedin_url,
          email: profile.email,
        })
        .eq('id', profile.id);

      if (error) throw error;
      toast.success('Author profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save author profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `author-avatar-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('cms-uploads')
        .getPublicUrl(filePath);

      setProfile(prev => prev ? { ...prev, avatar_url: urlData.publicUrl } : null);
      toast.success('Avatar uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No author profile found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Author Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your blog author information</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6 space-y-6"
      >
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-secondary border-2 border-border overflow-hidden">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Author avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-10 h-10 text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </Label>
            <p className="text-xs text-muted-foreground mt-2">
              Recommended: Square image, at least 200x200px
            </p>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Your name"
          />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title / Role</Label>
          <Input
            id="title"
            value={profile.title}
            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
            placeholder="e.g., Full Stack Developer"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="A short bio about yourself"
            rows={3}
          />
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <Label>Social Links</Label>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Github className="w-5 h-5 text-muted-foreground" />
            </div>
            <Input
              value={profile.github_url || ''}
              onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
              placeholder="GitHub URL"
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Linkedin className="w-5 h-5 text-muted-foreground" />
            </div>
            <Input
              value={profile.linkedin_url || ''}
              onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
              placeholder="LinkedIn URL"
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <Input
              value={profile.email || ''}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="Email address"
              className="flex-1"
            />
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} disabled={saving} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </motion.div>
    </div>
  );
};

export default AuthorProfile;
