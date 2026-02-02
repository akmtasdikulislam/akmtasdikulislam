import HackerTextLoader from '@/components/loaders/HackerTextLoader';
import CustomCursor from '@/components/ui/CustomCursor';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  Briefcase,
  FileText,
  FolderKanban,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Quote,
  Terminal,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
  { icon: FileText, label: 'Blog Posts', path: '/admin/blogs' },

  { icon: Award, label: 'Certifications', path: '/admin/certifications' },
  { icon: Briefcase, label: 'Work History', path: '/admin/work-history' },
  { icon: Quote, label: 'Testimonials', path: '/admin/testimonials' },
];

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/auth');
    }
  }, [user, isAdmin, loading, navigate]);

  // Page loader - hide when auth check completes
  useEffect(() => {
    if (!loading && user && isAdmin) {
      // Loader will hide itself via onComplete callback
    }
  }, [loading, user, isAdmin]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <>
      <CustomCursor />
      {/* Hacker Text Loader */}
      <AnimatePresence>
        {pageLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
          >
            <HackerTextLoader onComplete={() => setPageLoading(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-background flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:transform-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <Link to="/admin" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-lg">CMS Admin</span>
              </Link>
              <button
                className="lg:hidden text-muted-foreground hover:text-foreground"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path ||
                  (item.path !== '/admin' && location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border space-y-2">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-lg transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">View Portfolio</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col min-h-screen min-w-0">
          {/* Mobile header */}
          <header className="lg:hidden sticky top-0 z-30 bg-background border-b border-border p-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold">CMS Admin</span>
            <div className="w-6" />
          </header>

          {/* Page content */}
          <div className="flex-1 p-6 lg:p-8 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
