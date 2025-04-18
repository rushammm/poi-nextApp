# LocatePro Design System Guide

## Overview

LocatePro is a modern web application that helps businesses find optimal expansion locations through AI-powered analytics. This design system guide outlines the visual language, components, and best practices to maintain consistency across the application.

## Theme System

LocatePro uses a dual theme system (light and dark) with seamless transitions.

### Color Tokens

All colors are defined as CSS variables and accessed through Tailwind utility classes:

- `--background`: Main page background
- `--foreground`: Primary text color
- `--primary`: Brand primary color (used for CTAs, highlights)
- `--primary-foreground`: Text on primary color background
- `--secondary`: Supporting color for UI elements
- `--accent`: Used for embellishments and attention-drawing elements
- `--muted-foreground`: Subdued text color for less important content
- `--border`: Color for dividers and borders

### Dark Mode Implementation

Dark mode is enabled by default in the layout.tsx component:

```tsx
<body className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}>
```

All components should include appropriate dark mode variants:

```tsx
// Example of dark mode class usage
className = "bg-background dark:bg-background";
className = "text-foreground dark:text-foreground";
className = "border-border dark:border-border";
```

For opacity variations in dark mode:

```tsx
className = "bg-primary/5 dark:bg-primary/10";
```

## Typography

### Font Family

Using Geist Sans as the primary font and Geist Mono for monospaced content:

```tsx
// Font definition in layout.tsx
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

Access these fonts using:

```tsx
style={{ fontFamily: "var(--font-geist-sans)" }}
// or
className="font-[family-name:var(--font-geist-sans)]"
```

### Text Hierarchy

- Headings: Large, bold with tight tracking

  ```tsx
  className =
    "text-5xl md:text-6xl font-bold leading-tight tracking-tight text-foreground dark:text-foreground";
  ```

- Body: Clean, readable with appropriate spacing
  ```tsx
  className = "text-xl text-muted-foreground max-w-3xl";
  ```

## Animations and Transitions

### Framer Motion Integration

Used for sophisticated animations:

```tsx
import { motion, Variants, useScroll, useTransform } from "framer-motion";
```

### Common Animation Patterns

#### Text Entry Animations

```tsx
const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const textItemVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 20,
    },
  },
};
```

#### Scroll-Based Animations

```tsx
const { scrollY } = useScroll();
const svgOpacity = useTransform(
  scrollY,
  [0, 300], // scroll position range
  [1, 0]    // output value range
);

// Apply to element
style={{ opacity: svgOpacity }}
```

#### Path Animations

```tsx
const pathColorTransition = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 0.8,
    transition: {
      pathLength: { type: "spring", duration: 2.5, bounce: 0.2 },
      opacity: { duration: 1.5 },
    },
  },
};
```

#### Interactive Elements

```tsx
<motion.button
  className="px-10 py-4 bg-primary text-primary-foreground rounded-lg"
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
```

## UI Components

### Buttons

```tsx
<button className="px-10 py-4 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200">
  <Calendar size={20} />
  <span>Schedule Appointment</span>
</button>
```

### Background Effects

#### Gradient Overlays

```tsx
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/70 dark:to-background/80 pointer-events-none" />
```

#### Glowing Elements

```tsx
<div className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
```

#### Backdrop Blur

```tsx
<div className="absolute inset-0 bg-background/50 dark:bg-background/70 backdrop-blur-sm" />
```

### SVG Styling

#### Map Visualizations

```tsx
<svg
  viewBox="0 0 1200 600"
  className="absolute w-full h-full opacity-20 dark:opacity-25"
  style={{ filter: "drop-shadow(0 0 10px var(--secondary))" }}
>
```

#### Animated Paths

```tsx
<motion.path
  d="M400,300 C500,250 550,350 600,300 C650,250 700,350 750,300 C800,250 850,350 900,300"
  stroke="var(--secondary)"
  strokeWidth="1.5"
  fill="none"
  strokeDasharray="5,5"
  strokeLinecap="round"
  variants={pathAnimation}
/>
```

## Layout

### Container System

```tsx
<div className="container mx-auto px-6 relative z-10">
  <div className="max-w-4xl mx-0 flex flex-col">{/* Content */}</div>
</div>
```

### Responsive Design

- Mobile-first approach with breakpoint modifiers
- Primary breakpoints: `md:` (768px and up), `lg:` (1024px and up)

### Z-Index Management

- Background elements: `z-0`
- Content containers: `z-10`
- UI overlays: `z-20+`

## Best Practices

1. Always include dark mode variants for color-related classes
2. Use relative units (rem, em) for spacing and typography
3. Utilize CSS variables for theming consistency
4. Implement responsive designs for all screen sizes
5. Apply proper semantic HTML elements
6. Include appropriate transitions for state changes
7. Maintain accessibility through proper contrast ratios and focus states
8. Use framer-motion for complex animations

## Component Guidelines

### HeroSection

- Full-screen height with scroll fade effects
- Animated SVG map background with theme-aware styling
- Left-aligned content with staggered animations
- Interactive button with hover/tap effects

### Navbar

- Fixed position with backdrop blur
- Theme toggle with smooth transitions
- Responsive mobile menu

### FeatureSection

- Grid-based card layout
- Theme-aware illustrations or icons
- Consistent spacing and alignment
