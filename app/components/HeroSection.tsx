"use client";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";

export default function HeroSection() {
  const [isClient, setIsClient] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Set up scroll animations
  const { scrollY } = useScroll();
  const svgOpacity = useTransform(
    scrollY,
    [0, 300], // start fading at scroll position 0, fully faded at 300px
    [1, 0] // opacity from 1 to 0
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const mapVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
        delay: 0.2,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden bg-background dark:bg-background pt-32 md:pt-40"
    >
      {/* Background map SVG with enhanced animations and scroll fade */}
      {isClient && (
        <motion.div
          className="fixed inset-0 z-0"
          ref={svgRef}
          variants={mapVariants}
          initial="hidden"
          animate="visible"
          style={{ opacity: svgOpacity }}
          transition={{ delay: 1.2, duration: 1.2 }} // Reveal background last
        >
          {/* Gradient overlay for left-to-right (25%) fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/70 dark:to-background/80 pointer-events-none z-10" />
          {/* Subtle background glow effects using theme colors */}
          <div className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-accent/5 dark:bg-accent/10 blur-3xl" />
          <div className="absolute top-2/3 right-10 w-72 h-72 rounded-full bg-secondary/5 dark:bg-secondary/10 blur-3xl" />
          <div className="absolute inset-0 bg-background/50 dark:bg-background/70 backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                className="relative w-full h-full flex items-center justify-center"
                initial={{ scale: 1.1, x: -20 }}
                animate={{
                  scale: 1,
                  x: 0,
                  transition: {
                    duration: 2,
                    ease: "easeOut",
                  },
                }}
              >
                <Image
                  src="/world-map.svg"
                  alt="World map"
                  width={1920}
                  height={1080}
                  className="fixed top-24 inset-0 w-full h-full object-cover opacity-40 dark:opacity-30"
                  style={{
                    filter: "drop-shadow(0 0 24px var(--primary)) blur(0.5px)",
                    zIndex: 1,
                  }}
                  aria-hidden="true"
                  priority
                />
                {/* Custom SVG with theme colors, left empty for design cleanliness */}
                <motion.div
                  className="absolute inset-0 w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.7, 0.5],
                    transition: {
                      duration: 3,
                      times: [0, 0.7, 1],
                    },
                  }}
                >
                  <svg
                    viewBox="0 0 1200 600"
                    className="absolute w-full h-full opacity-20 dark:opacity-25"
                    style={{ filter: "drop-shadow(0 0 10px var(--secondary))" }}
                    aria-hidden="true"
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      <div className="container mx-auto px-6 relative z-10 antialiased">
        <div className="max-w-4xl mx-0 flex flex-col">
          {/* Left-aligned text content without card design */}
          {isClient && (
            <motion.div
              className="flex flex-col space-y-8"
              variants={textContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                className="text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-[-0.04em] text-foreground dark:text-foreground bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text drop-shadow-xl"
                variants={textItemVariants}
                transition={{ delay: 0.1, duration: 0.7, type: "spring" }}
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                }}
              >
                <span className="block text-primary dark:text-primary drop-shadow-lg">
                  Strategic Locations
                </span>
                <span
                  className="block text-foreground/70 font-light tracking-wide mt-2 antialiased"
                  style={{
                    fontSize: "2.2rem",
                    letterSpacing: "0.01em",
                    fontFamily: "var(--font-geist-sans)",
                  }}
                >
                  for Maximum Growth
                </span>
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-[400] leading-relaxed tracking-wide antialiased"
                variants={textItemVariants}
                transition={{ delay: 0.5, duration: 0.7, type: "spring" }}
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  opacity: 0.92,
                  lineHeight: 1.6,
                  letterSpacing: "0.01em",
                }}
              >
                Our AI algorithm pinpoints{" "}
                <span className="font-semibold text-primary">
                  optimal expansion locations
                </span>
                , analyzing demographics, competition, and market trends to
                increase your success rate by{" "}
                <span className="font-semibold text-accent">35%</span>.
              </motion.p>
              <motion.div
                className="pt-4"
                variants={textItemVariants}
                transition={{ delay: 0.9, duration: 0.7, type: "spring" }}
              >
                <Link href="#schedule">
                  <motion.button
                    className="px-10 py-4 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Calendar size={20} />
                    <span>Schedule Appointment</span>
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          )}

          {/* Animated location points */}
          {isClient && (
            <div className="absolute inset-0 pointer-events-none">
              {[
                {
                  x: "15%",
                  y: "30%",
                  delay: 1.5,
                  size: "md",
                  color: "primary",
                },
                {
                  x: "85%",
                  y: "20%",
                  delay: 1.7,
                  size: "lg",
                  color: "secondary",
                },
                { x: "70%", y: "80%", delay: 1.9, size: "sm", color: "accent" },
                { x: "25%", y: "75%", delay: 2.1, size: "md", color: "border" },
                {
                  x: "50%",
                  y: "40%",
                  delay: 2.3,
                  size: "lg",
                  color: "primary",
                },
              ].map((point, i) => (
                <motion.div
                  key={i}
                  className={`absolute rounded-full bg-${point.color} ${
                    point.size === "sm"
                      ? "w-2 h-2"
                      : point.size === "md"
                      ? "w-3 h-3"
                      : "w-4 h-4"
                  }`}
                  style={{
                    left: point.x,
                    top: point.y,
                    boxShadow: `0 0 10px var(--${point.color})`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.3, 1],
                    opacity: [0, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 2.5,
                    delay: point.delay,
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 4,
                  }}
                  aria-hidden="true"
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* <div className="h-screen"></div> */}
    </section>
  );
}
