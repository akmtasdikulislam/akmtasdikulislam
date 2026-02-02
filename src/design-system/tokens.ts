// Design System Tokens
// Centralized design tokens for consistent styling across the application

export const spacing = {
  section: {
    py: "py-24",
    pySm: "py-16",
    pyLg: "py-32",
  },
  container: "container mx-auto px-4",
  gap: {
    xs: "gap-2",
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-12",
  },
} as const;

export const typography = {
  heading: {
    h1: "text-4xl md:text-5xl lg:text-6xl font-bold",
    h2: "text-3xl md:text-4xl lg:text-5xl font-bold",
    h3: "text-2xl md:text-3xl font-semibold",
    h4: "text-xl md:text-2xl font-semibold",
    h5: "text-lg font-semibold",
    h6: "text-base font-semibold",
  },
  body: {
    lg: "text-lg",
    base: "text-base",
    sm: "text-sm",
    xs: "text-xs",
  },
  special: {
    mono: "font-mono",
    gradient: "text-gradient-green",
    muted: "text-muted-foreground",
  },
} as const;

export const cardStyles = {
  base: "bg-card border border-border rounded-2xl overflow-hidden",
  hover: "hover:border-primary/30 transition-all",
  interactive: "hover:border-primary/30 transition-all hover:-translate-y-2",
  featured: "bg-card border border-primary/20 rounded-2xl overflow-hidden",
} as const;

export const tagStyles = {
  default: "px-2 py-1 text-xs bg-secondary border border-transparent rounded-md text-muted-foreground tag-chip",
  primary: "px-2 py-1 text-xs bg-primary/10 border border-primary/30 rounded-md text-primary",
  accent: "px-2 py-1 text-xs bg-accent/10 border border-accent/30 rounded-md text-accent",
} as const;

export const badgeStyles = {
  featured: "inline-flex items-center gap-2 px-4 py-1.5 text-xs uppercase tracking-widest text-primary border border-primary/30 rounded-full bg-primary/5",
  category: "px-3 py-1 text-xs bg-primary text-primary-foreground rounded-full",
} as const;

export const sectionStyles = {
  background: {
    grid: "bg-grid-pattern opacity-20",
    dot: "bg-dot-pattern opacity-20",
    dashed: "bg-dashed-grid",
    cross: "bg-cross-pattern opacity-20",
  },
} as const;
