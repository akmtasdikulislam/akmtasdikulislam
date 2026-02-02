import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Activity, Eye, FileText, FolderKanban, Plus, ShieldCheck, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Stats {
  totalProjects: number;
  publishedProjects: number;
  totalPosts: number;
  publishedPosts: number;
  totalVisitors: number;
  avgLoadTime: number;
  uniqueSessions: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    publishedProjects: 0,
    totalPosts: 0,
    publishedPosts: 0,
    totalVisitors: 0,
    avgLoadTime: 0,
    uniqueSessions: 0,
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [visitorLogs, setVisitorLogs] = useState<any[]>([]);
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
        .order('updated_at', { ascending: false });

      // Fetch blog posts stats
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('id, title, status, updated_at')
        .order('updated_at', { ascending: false });

      // Fetch analytics stats
      const { data: analyticsRow } = await supabase
        .from('analytics_visitor_logs')
        .select('load_time_ms, session_id');
      
      const { data: logs } = await supabase
        .from('analytics_visitor_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      const projectsList = projects || [];
      const postsList = posts || [];
      const analyticsList = analyticsRow || [];
      
      const totalLoadTime = analyticsList.reduce((acc, curr) => acc + (curr.load_time_ms || 0), 0);
      const uniqueSessions = new Set(analyticsList.map(v => v.session_id)).size;

      setStats({
        totalProjects: projectsList.length,
        publishedProjects: projectsList.filter(p => p.status === 'published').length,
        totalPosts: postsList.length,
        publishedPosts: postsList.filter(p => p.status === 'published').length,
        totalVisitors: analyticsList.length,
        avgLoadTime: analyticsList.length > 0 ? Math.round(totalLoadTime / analyticsList.length) : 0,
        uniqueSessions: uniqueSessions,
      });

      setRecentProjects(projectsList.slice(0, 3));
      setRecentPosts(postsList.slice(0, 3));
      setVisitorLogs(logs || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Unique Visits',
      value: stats.uniqueSessions,
      icon: Eye,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Avg Load Time',
      value: `${stats.avgLoadTime}ms`,
      icon: Zap,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
    {
      label: 'Total Pages View',
      value: stats.totalVisitors,
      icon: FileText,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Security Status',
      value: 'Healthy',
      icon: ShieldCheck,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
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

      {/* Visitor Logs & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Visitor Activity
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-3 font-medium">Page</th>
                  <th className="pb-3 font-medium">Device / OS</th>
                  <th className="pb-3 font-medium">Load Time</th>
                  <th className="pb-3 font-medium text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visitorLogs.map((log) => (
                  <tr key={log.id} className="group">
                    <td className="py-4">
                      <span className="font-medium text-foreground">{log.page_path}</span>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]" title={log.referrer}>
                        from: {log.referrer}
                      </p>
                    </td>
                    <td className="py-4 text-muted-foreground">
                      <div className="flex flex-col">
                        <span className="truncate max-w-[150px]" title={log.user_agent}>
                          {log.user_agent?.split(') ')[0]?.split(' (')[1] || 'Unknown'}
                        </span>
                        <span className="text-xs">{log.screen_resolution}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        log.load_time_ms < 500 ? 'bg-green-500/10 text-green-500' :
                        log.load_time_ms < 1000 ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {log.load_time_ms ? `${log.load_time_ms}ms` : '--'}
                      </span>
                    </td>
                    <td className="py-4 text-right text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
                {visitorLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                      No visitor logs yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Security Overview
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-secondary/30 rounded-lg border border-border">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Database (RLS)</span>
                <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-500 rounded">Enabled</span>
              </div>
              <p className="text-xs text-muted-foreground">Row-level security protecting all user data.</p>
            </div>

            <div className="p-4 bg-secondary/30 rounded-lg border border-border">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Auth Status</span>
                <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-500 rounded">Encrypted</span>
              </div>
              <p className="text-xs text-muted-foreground">Admin sessions secured with Supabase Auth.</p>
            </div>

            <div className="p-4 bg-secondary/30 rounded-lg border border-border">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">SSL / HTTPS</span>
                <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-500 rounded">Active</span>
              </div>
              <p className="text-xs text-muted-foreground">All connections are end-to-end encrypted.</p>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold mb-3">System Health</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                API Performance: Optimal
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

