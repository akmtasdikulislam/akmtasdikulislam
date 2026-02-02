import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Terminal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { name: "Home", href: "#home", path: "/" },
  { name: "About", href: "#about", path: "/#about" },
  { name: "Expertise", href: "#expertise", path: "/#expertise" },
  { name: "Services", href: "#services", path: "/#services" },
  { name: "Projects", href: "#projects", path: "/#projects" },
  { name: "Blog", href: "#blog", path: "/#blog" },
  { name: "Contact", href: "#contact", path: "/#contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    if (!isHomePage) {
      e.preventDefault();
      // Navigate to home page with hash
      navigate(link.path);
    }
    // On home page, let the default anchor behavior work
    setIsMobileMenuOpen(false);
  };

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHomePage) {
      e.preventDefault();
      navigate("/#contact");
    }
    setIsMobileMenuOpen(false);
  };

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
          {/* Logo - Updated with bolder text */}
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
              <Terminal className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-wider">
              AKM<span className="text-primary">.</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={isHomePage ? link.href : link.path}
                onClick={(e) => handleNavClick(e, link)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors relative group py-2"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Button - Primary green */}
          <div className="hidden md:block">
            <Button variant="glow" asChild>
              <a
                href={isHomePage ? "#contact" : "/#contact"}
                onClick={handleContactClick}
              >
                <Terminal className="w-4 h-4" />
                Hire Me
              </a>
            </Button>
          </div>

          {/* Mobile Menu Toggle - Minimum 44x44px touch target */}
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
                  key={link.name}
                  href={isHomePage ? link.href : link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className="text-base py-3 px-2 text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center rounded-lg hover:bg-secondary/50"
                >
                  {link.name}
                </a>
              ))}
              <Button variant="glow" asChild className="mt-4 w-full min-h-[44px]">
                <a
                  href={isHomePage ? "#contact" : "/#contact"}
                  onClick={handleContactClick}
                >
                  <Terminal className="w-4 h-4" />
                  Hire Me
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
