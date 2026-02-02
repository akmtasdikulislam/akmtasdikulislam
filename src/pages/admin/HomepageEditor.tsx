import { useAllHomepageContent } from '@/hooks/useHomepageContent';
import { motion } from 'framer-motion';
import { BookOpen, Edit, Home, Layout, MessageSquare, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomepageEditor = () => {
    const { isLoading } = useAllHomepageContent();

    const sections = [
        {
            title: 'Hero Section',
            description: 'Edit main banner with name, roles, profile photo, tech logos, and stats',
            icon: Home,
            path: '/admin/homepage/hero',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
        },
        {
            title: 'Navbar',
            description: 'Configure logo, navigation links, and CTA button',
            icon: Layout,
            path: '/admin/homepage/navbar',
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
        },
        {
            title: 'About Section',
            description: 'Manage about content, highlights, interests, and core values',
            icon: BookOpen,
            path: '/admin/homepage/about',
            color: 'text-green-500',
            bg: 'bg-green-500/10',
        },
        {
            title: 'Footer',
            description: 'Edit footer content, social links, and copyright text',
            icon: MessageSquare,
            path: '/admin/homepage/footer',
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
        },
        {
            title: 'General Settings',
            description: 'Site metadata, SEO settings, and favicon',
            icon: Settings,
            path: '/admin/homepage/settings',
            color: 'text-pink-500',
            bg: 'bg-pink-500/10',
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Homepage Content</h1>
                <p className="text-muted-foreground mt-1">
                    Manage all homepage sections and settings
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section, index) => (
                    <motion.div
                        key={section.path}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link
                            to={section.path}
                            className="block p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-lg ${section.bg} flex items-center justify-center`}>
                                    <section.icon className={`w-6 h-6 ${section.color}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold mb-1 flex items-center gap-2">
                                        {section.title}
                                        <Edit className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {section.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 p-6 bg-muted/50 border border-border rounded-xl">
                <h3 className="font-semibold mb-2">Quick Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Changes are saved immediately and visible on the homepage</li>
                    <li>• Use drag-and-drop to reorder items in lists</li>
                    <li>• Upload images directly or use external URLs</li>
                    <li>• Preview your changes before saving</li>
                </ul>
            </div>
        </div>
    );
};

export default HomepageEditor;
