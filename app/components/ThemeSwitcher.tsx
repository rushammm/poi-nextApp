"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

const switcherVariants = {
  initial: { opacity: 0, y: 40, scale: 0.9 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
  exit: { opacity: 0, y: 40, scale: 0.9, transition: { duration: 0.2 } },
};

const iconVariants = {
  initial: { rotate: 0, scale: 0.8 },
  animate: {
    rotate: 360,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 16 },
  },
  exit: { rotate: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const tooltipVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 180, damping: 18 },
  },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15 } },
};

export default function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  const isDark = resolvedTheme === "dark";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-8 right-8 z-20"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={switcherVariants}
      >
        {/* Animated ring accent */}
        <motion.div
          className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary/30 dark:border-primary/40 blur-lg pointer-events-none"
          style={{ zIndex: 0 }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        />
        {/* Animated glow */}
        <motion.div
          className="absolute inset-0 w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 blur-2xl pointer-events-none"
          style={{ zIndex: 0 }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.8, 1] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 2,
          }}
        />
        {/* Glassy floating button */}
        <motion.button
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          title={`Switch to ${isDark ? "light" : "dark"} mode`}
          className="relative w-14 h-14 rounded-full bg-background/80 dark:bg-background/70 border border-border dark:border-border shadow-xl flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 transition-all duration-200 group backdrop-blur-lg"
          style={{
            fontFamily: "var(--font-geist-sans)",
            boxShadow: "0 4px 24px 0 var(--primary, #26413C, 0.10)",
          }}
          onClick={() => setTheme(isDark ? "light" : "dark")}
          tabIndex={0}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          whileHover={{
            scale: 1.07,
            boxShadow: "0 6px 32px 0 var(--primary, #26413C, 0.18)",
          }}
          whileTap={{ scale: 0.96 }}
        >
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={iconVariants}
            className="flex items-center justify-center"
          >
            {isDark ? (
              <Moon
                size={28}
                className="text-primary transition-colors duration-200"
                strokeWidth={2.2}
              />
            ) : (
              <Sun
                size={28}
                className="text-accent transition-colors duration-200"
                strokeWidth={2.2}
              />
            )}
          </motion.span>
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.span
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tooltipVariants}
                className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 pointer-events-none text-xs px-3 py-1 rounded-lg bg-foreground text-background dark:bg-background dark:text-foreground shadow-lg font-medium select-none"
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  whiteSpace: "nowrap",
                  zIndex: 30,
                  letterSpacing: "0.01em",
                }}
                role="tooltip"
              >
                {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
