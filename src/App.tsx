import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import CursorProvider from "@/contexts/CursorProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout";
import LoadingScreen from "./components/ui/LoadingScreen";
import AuthorProfile from "./pages/admin/AuthorProfile";
import BlogEditor from "./pages/admin/BlogEditor";
import BlogsList from "./pages/admin/BlogsList";
import CertificationsList from "./pages/admin/CertificationsList";
import Dashboard from "./pages/admin/Dashboard";
import ProjectEditor from "./pages/admin/ProjectEditor";
import ProjectsList from "./pages/admin/ProjectsList";
import TestimonialsList from "./pages/admin/TestimonialsList";



import AboutEditor from "./pages/admin/AboutEditor";
import ContactEditor from "./pages/admin/ContactEditor";
import ExpertiseEditor from "./pages/admin/ExpertiseEditor";
import FooterEditor from "./pages/admin/FooterEditor";
import GeneralSettings from "./pages/admin/GeneralSettings";
import HeroEditor from "./pages/admin/HeroEditor";
import HomepageEditor from "./pages/admin/HomepageEditor";
import NavbarEditor from "./pages/admin/NavbarEditor";
import ServicesEditor from "./pages/admin/ServicesEditor";
import TestimonialsEditor from "./pages/admin/TestimonialsEditor";
import WorkHistoryList from "./pages/admin/WorkHistoryList";
import AdminAuth from "./pages/AdminAuth";
import AllBlogs from "./pages/AllBlogs";
import AllProjects from "./pages/AllProjects";
import BlogPost from "./pages/BlogPost";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

// Track if this is the very first time the app is loading in this browser session (reset on refresh)
let isInitialAppLoad = true;

const AppContent = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(() => {
    // Only show loader if it's the initial load AND we are landing on the homepage
    return isInitialAppLoad && window.location.pathname === '/';
  });
  const isHomepage = location.pathname === '/';

  useEffect(() => {
    // Mark as loaded after the first mount of the app
    isInitialAppLoad = false;
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/projects" element={<AllProjects />} />
        <Route path="/blogs" element={<AllBlogs />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/project/:id" element={<ProjectDetail />} />

        {/* Admin Routes */}
        <Route path="/admin/auth" element={<AdminAuth />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/:id" element={<ProjectEditor />} />
          <Route path="blogs" element={<BlogsList />} />
          <Route path="blogs/:id" element={<BlogEditor />} />

          <Route path="author" element={<AuthorProfile />} />
          <Route path="certifications" element={<CertificationsList />} />
          <Route path="work-history" element={<WorkHistoryList />} />
          <Route path="testimonials" element={<TestimonialsList />} />


          {/* Homepage Content Routes */}
          <Route path="homepage" element={<HomepageEditor />} />
          <Route path="homepage/hero" element={<HeroEditor />} />
          <Route path="homepage/navbar" element={<NavbarEditor />} />
          <Route path="homepage/about" element={<AboutEditor />} />
          <Route path="homepage/footer" element={<FooterEditor />} />
          <Route path="homepage/settings" element={<GeneralSettings />} />
          <Route path="homepage/expertise" element={<ExpertiseEditor />} />
          <Route path="homepage/services" element={<ServicesEditor />} />
          <Route path="homepage/testimonials" element={<TestimonialsEditor />} />
          <Route path="homepage/contact" element={<ContactEditor />} />
        </Route>

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <CursorProvider>
              <AppContent />
            </CursorProvider>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
