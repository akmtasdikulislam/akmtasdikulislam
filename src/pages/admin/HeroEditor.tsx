import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useHeroContent } from '@/hooks/useHomepageContent';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Plus, Save, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

const HeroEditor = () => {
    const { data, isLoading } = useHeroContent();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [heroData, setHeroData] = useState({
        name: '',
        greeting_badge: '',
        description: '',
        profile_photo_url: '',
    });

    const [roles, setRoles] = useState<Array<{ id?: string; role_text: string; display_order: number }>>([]);

    useEffect(() => {
        if (data) {
            setHeroData({
                name: data.hero.name,
                greeting_badge: data.hero.greeting_badge,
                description: data.hero.description,
                profile_photo_url: data.hero.profile_photo_url || '',
            });
            setRoles(data.roles);
        }
    }, [data]);

    const updateHeroMutation = useMutation({
        mutationFn: async (updatedData: typeof heroData) => {
            const { data: result, error } = await supabase
                .from('homepage_hero')
                .update(updatedData)
                .eq('id', data!.hero.id)
                .select()
                .single();

            if (error) throw error;
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'hero'] });
            toast({
                title: 'Success',
                description: 'Hero section updated successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update hero section',
                variant: 'destructive',
            });
        },
    });

    const updateRolesMutation = useMutation({
        mutationFn: async (updatedRoles: typeof roles) => {
            // Delete all existing roles
            await supabase.from('homepage_hero_roles').delete().neq('id', '00000000-0000-0000-0000-000000000000');

            // Insert new roles
            const { error } = await supabase
                .from('homepage_hero_roles')
                .insert(updatedRoles.map((role, index) => ({
                    role_text: role.role_text,
                    display_order: index,
                })));

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'hero'] });
            toast({
                title: 'Success',
                description: 'Roles updated successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update roles',
                variant: 'destructive',
            });
        },
    });

    const handleSaveHero = () => {
        updateHeroMutation.mutate(heroData);
    };

    const handleSaveRoles = () => {
        updateRolesMutation.mutate(roles);
    };

    const addRole = () => {
        setRoles([...roles, { role_text: '', display_order: roles.length }]);
    };

    const removeRole = (index: number) => {
        setRoles(roles.filter((_, i) => i !== index));
    };

    const updateRole = (index: number, value: string) => {
        const updated = [...roles];
        updated[index].role_text = value;
        setRoles(updated);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Hero Section</h1>
                <p className="text-muted-foreground mt-1">
                    Edit the main banner content on your homepage
                </p>
            </div>

            {/* Basic Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p   -6"
            >
                <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                            id="name"
                            value={heroData.name}
                            onChange={(e) => setHeroData({ ...heroData, name: e.target.value })}
                            placeholder="Akm Tasdikul Islam"
                        />
                    </div>

                    <div>
                        <Label htmlFor="greeting">Greeting Badge</Label>
                        <Input
                            id="greeting"
                            value={heroData.greeting_badge}
                            onChange={(e) => setHeroData({ ...heroData, greeting_badge: e.target.value })}
                            placeholder="Available for Freelance & Remote Work"
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={heroData.description}
                            onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                            placeholder="Your professional description..."
                            rows={4}
                        />
                    </div>

                    <div>
                        <Label htmlFor="photo">Profile Photo URL</Label>
                        <div className="flex gap-2">
                            <Input
                                id="photo"
                                value={heroData.profile_photo_url}
                                onChange={(e) => setHeroData({ ...heroData, profile_photo_url: e.target.value })}
                                placeholder="https://..."
                            />
                            <Button variant="outline" size="icon">
                                <Upload className="w-4 h-4" />
                            </Button>
                        </div>
                        {heroData.profile_photo_url && (
                            <div className="mt-2">
                                <img
                                    src={heroData.profile_photo_url}
                                    alt="Profile preview"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-primary/30"
                                />
                            </div>
                        )}
                    </div>

                    <Button onClick={handleSaveHero} disabled={updateHeroMutation.isPending}>
                        {updateHeroMutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Basic Info
                            </>
                        )}
                    </Button>
                </div>
            </motion.div>

            {/* Typewriter Roles */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-xl p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Typewriter Roles</h2>
                    <Button onClick={addRole} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Role
                    </Button>
                </div>

                <div className="space-y-3">
                    {roles.map((role, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={role.role_text}
                                onChange={(e) => updateRole(index, e.target.value)}
                                placeholder="e.g., Full Stack Developer"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => removeRole(index)}
                                disabled={roles.length === 1}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <Button onClick={handleSaveRoles} disabled={updateRolesMutation.isPending} className="mt-4">
                    {updateRolesMutation.isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Roles
                        </>
                    )}
                </Button>
            </motion.div>

            {/* Preview Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-muted/50 border border-border rounded-xl p-6"
            >
                <h3 className="font-semibold mb-4">Preview</h3>
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        {heroData.greeting_badge}
                    </div>
                    <h1 className="text-4xl font-bold">
                        Hi, I'm <span className="text-primary">{heroData.name}</span>
                    </h1>
                    <div className="text-xl text-muted-foreground font-mono">
                        <span className="text-primary">&gt;</span> {roles[0]?.role_text || 'Add a role'}
                    </div>
                    <p className="text-muted-foreground leading-relaxed max-w-lg">
                        {heroData.description}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default HeroEditor;
