import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Eye, FileText, FolderKanban, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Stats {
  totalProjects: number;
  publishedProjects: number;
  totalPosts: number;
  publishedPosts: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    publishedProjects: 0,
    totalPosts: 0,
    publishedPosts: 0,
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch projects stats
      const { data: projects } = await supabase
        .from('projects')
        .select('id, title, status, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5);

      // Fetch blog posts stats
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('id, title, status, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5);

      const projectsList = projects || [];
      const postsList = posts || [];

      setStats({
        totalProjects: projectsList.length,
        publishedProjects: projectsList.filter(p => p.status === 'published').length,
        totalPosts: postsList.length,
        publishedPosts: postsList.filter(p => p.status === 'published').length,
      });

      setRecentProjects(projectsList.slice(0, 3));
      setRecentPosts(postsList.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Published Projects',
      value: stats.publishedProjects,
      icon: Eye,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Total Blog Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Published Posts',
      value: stats.publishedPosts,
      icon: Eye,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to your CMS admin panel</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-primary" />
              Recent Projects
            </h2>
            <Link
              to="/admin/projects/new"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Plus className="w-4 h-4" />
              New
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">No projects yet</p>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/admin/projects/${project.id}`}
                  className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <span className="font-medium truncate">{project.title}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'published'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                    }`}>
                    {project.status}
                  </span>
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/admin/projects"
            className="mt-4 block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all projects →
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Recent Blog Posts
            </h2>
            <Link
              to="/admin/blogs/new"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Plus className="w-4 h-4" />
              New
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">No blog posts yet</p>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/admin/blogs/${post.id}`}
                  className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <span className="font-medium truncate">{post.title}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${post.status === 'published'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                    }`}>
                    {post.status}
                  </span>
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/admin/blogs"
            className="mt-4 block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all posts →
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

