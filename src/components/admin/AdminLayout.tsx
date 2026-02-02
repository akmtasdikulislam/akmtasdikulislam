import HackerTextLoader from '@/components/loaders/HackerTextLoader';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Award,
    Briefcase,
    ChevronDown,
    ChevronRight,
    Code,
    FileText,
    FolderKanban,
    Home,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquare, // For Services or Contact
    Phone,
    Quote,
    Settings,
    Target,
    Terminal,
    User,
    X,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  icon: any;
  label: string;
  path: string;
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    ],
  },
  {
    title: 'Site Sections',
    items: [
      { icon: LayoutDashboard, label: 'Navbar', path: '/admin/homepage/navbar' },
      { icon: Home, label: 'Hero Section', path: '/admin/homepage/hero' },
      { icon: MessageSquare, label: 'About', path: '/admin/homepage/about' },
      { icon: Target, label: 'Why Choose Me', path: '/admin/homepage/why-choose-me' },
      { icon: Code, label: 'Expertise', path: '/admin/homepage/expertise' },
      { icon: Zap, label: 'Services', path: '/admin/homepage/services' },
      { icon: Quote, label: 'Testimonials', path: '/admin/testimonials' },
      { icon: Phone, label: 'Contact', path: '/admin/homepage/contact' },
      { icon: Terminal, label: 'Footer', path: '/admin/homepage/footer' },
    ],
  },
  {
    title: 'Collections',
    items: [
      { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
      { icon: FileText, label: 'Blog Posts', path: '/admin/blogs' },
    ],
  },
  {
    title: 'Professional',
    items: [
      { icon: User, label: 'Author Profile', path: '/admin/author' },
      { icon: Award, label: 'Certifications', path: '/admin/certifications' },
      { icon: Briefcase, label: 'Work History', path: '/admin/work-history' },
    ],
  },
  {
    title: 'System',
    items: [
      { icon: Settings, label: 'Site Settings', path: '/admin/homepage/settings' },
    ],
  },
];

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Overview', 'Site Sections', 'Collections', 'Professional', 'System']);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/auth');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/auth');
  };

  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
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

      <div className="h-screen bg-background flex overflow-hidden">
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
                <span className="font-bold text-lg">CMS Panel</span>
              </Link>
              <button
                className="lg:hidden text-muted-foreground hover:text-foreground"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
              {navSections.map((section) => {
                const isExpanded = expandedSections.includes(section.title);

                return (
                  <div key={section.title}>
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors mb-2"
                    >
                      <span>{section.title}</span>
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-1 overflow-hidden"
                        >
                          {section.items.map((item) => {
                            const isOverview = item.path === '/admin/homepage';
                            const isActive = isOverview
                              ? location.pathname === item.path
                              : location.pathname === item.path ||
                              (item.path !== '/admin' && location.pathname.startsWith(item.path));

                            return (
                              <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm",
                                  isActive
                                    ? "bg-primary/10 text-primary border border-primary/30"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                              >
                                <item.icon className="w-4 h-4 flex-shrink-0" />
                                <span className="font-medium">{item.label}</span>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
        <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
          {/* Mobile header */}
          <header className="lg:hidden sticky top-0 z-30 bg-background border-b border-border p-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold">CMS Panel</span>
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
