import { motion } from "framer-motion";
import {
  Loader2,
  Map,
  BarChart,
  PieChart,
  Users,
  Sparkles,
  Database,
  CheckCircle2,
} from "lucide-react";

// Animation variants from design-guide
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.2 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 60, damping: 18 },
  },
};

export default function InsightsLoading() {
  return (
    <motion.section
      className="relative w-full min-h-screen flex flex-col items-center justify-center bg-background dark:bg-background z-10 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background effects for design system */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/70 dark:to-background/80 pointer-events-none z-0"
        variants={itemVariants}
      />
      <motion.div
        className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl z-0"
        variants={itemVariants}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-accent/5 dark:bg-accent/10 blur-3xl z-0"
        variants={itemVariants}
      />
      <motion.div
        className="absolute inset-0 bg-background/50 dark:bg-background/70 backdrop-blur-sm z-0"
        variants={itemVariants}
      />
      {/* Main loading content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 px-6 py-10 rounded-2xl shadow-xl border border-border dark:border-border bg-background/80 dark:bg-background/90 backdrop-blur-md"
        variants={containerVariants}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          variants={itemVariants}
        >
          <Sparkles className="text-primary animate-pulse" size={38} />
          <span
            className="text-2xl font-bold text-foreground tracking-tight"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Cooking up your insights…
          </span>
        </motion.div>
        <motion.div
          className="flex flex-col gap-4 w-full max-w-xs"
          variants={containerVariants}
        >
          {/* Step 1 */}
          <motion.div
            className="flex items-center gap-3"
            variants={itemVariants}
          >
            <Loader2 className="animate-spin text-primary" size={28} />
            <span
              className="text-base text-muted-foreground"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Fetching POI data
            </span>
          </motion.div>
          {/* Step 2 */}
          <motion.div
            className="flex items-center gap-3"
            variants={itemVariants}
          >
            <Database className="text-accent animate-bounce" size={26} />
            <span
              className="text-base text-muted-foreground"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Mixing location analytics
            </span>
          </motion.div>
          {/* Step 3 */}
          <motion.div
            className="flex items-center gap-3"
            variants={itemVariants}
          >
            <BarChart className="text-primary animate-pulse" size={26} />
            <span
              className="text-base text-muted-foreground"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Crunching numbers
            </span>
          </motion.div>
          {/* Step 4 */}
          <motion.div
            className="flex items-center gap-3"
            variants={itemVariants}
          >
            <Map className="text-secondary animate-fade-in" size={26} />
            <span
              className="text-base text-muted-foreground"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Drawing the map
            </span>
          </motion.div>
          {/* Step 5 */}
          <motion.div
            className="flex items-center gap-3"
            variants={itemVariants}
          >
            <PieChart className="text-accent animate-spin-slow" size={26} />
            <span
              className="text-base text-muted-foreground"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Plating beautiful charts
            </span>
          </motion.div>
          {/* Step 6 */}
          <motion.div
            className="flex items-center gap-3"
            variants={itemVariants}
          >
            <Users className="text-foreground animate-fade-in" size={26} />
            <span
              className="text-base text-primary font-semibold"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Almost ready to serve…
            </span>
          </motion.div>
        </motion.div>
        <motion.div
          className="flex flex-col items-center gap-1 mt-4"
          variants={itemVariants}
        >
          <CheckCircle2 className="text-primary animate-fade-in" size={22} />
          <span
            className="text-xs text-muted-foreground"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Designed with love by LocatePro · {new Date().getFullYear()}
          </span>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

// Add custom animation classes in your CSS for animate-spin-slow and animate-fade-in if not present.
