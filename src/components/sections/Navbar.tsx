import { Button } from "@/components/ui/button";
import { useNavbarContent } from "@/hooks/useHomepageContent";
import { AnimatePresence, motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { data, isLoading } = useNavbarContent();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, path: string) => {
    if (!isHomePage) {
      e.preventDefault();
      navigate(path);
    }
    setIsMobileMenuOpen(false);
  };

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isHomePage) {
      e.preventDefault();
      navigate(`/${href}`);
    }
    setIsMobileMenuOpen(false);
  };

  // Show loading state or fallback
  if (isLoading || !data) {
    return (
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border"
            : "bg-transparent"
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
            <div className="w-32 h-8 bg-muted animate-pulse rounded" />
            <div className="hidden md:flex gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-16 h-4 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        </div>
      </motion.nav>
    );
  }

  const { navbar, navLinks } = data;

  // @ts-ignore - dynamic icon lookup
  const LogoIcon = LucideIcons[navbar.logo_icon_name] || LucideIcons.Terminal;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* Logo */}
          <a
            href={isHomePage ? "#home" : "/"}
            className="flex items-center gap-2 group min-h-[44px]"
            onClick={(e) => {
              if (!isHomePage) {
                e.preventDefault();
                navigate("/");
              }
            }}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:glow-green-sm transition-all">
              <LogoIcon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-wider">
              {navbar.logo_text}<span className="text-primary">.</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={isHomePage ? link.href : link.path}
                onClick={(e) => handleNavClick(e, link.href, link.path)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors relative group py-2"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="glow" asChild>
              <a
                href={isHomePage ? navbar.cta_button_href : `/${navbar.cta_button_href}`}
                onClick={(e) => handleContactClick(e, navbar.cta_button_href)}
              >
                <LogoIcon className="w-4 h-4" />
                {navbar.cta_button_text}
              </a>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border"
          >
            <div className="container mx-auto px-4 sm:px-6 py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={isHomePage ? link.href : link.path}
                  onClick={(e) => handleNavClick(e, link.href, link.path)}
                  className="text-base py-3 px-2 text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center rounded-lg hover:bg-secondary/50"
                >
                  {link.label}
                </a>
              ))}
              <Button variant="glow" asChild className="mt-4 w-full min-h-[44px]">
                <a
                  href={isHomePage ? navbar.cta_button_href : `/${navbar.cta_button_href}`}
                  onClick={(e) => handleContactClick(e, navbar.cta_button_href)}
                >
                  <LogoIcon className="w-4 h-4" />
                  {navbar.cta_button_text}
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
