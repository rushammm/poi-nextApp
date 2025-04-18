"use client";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import {
  Sparkles,
  BarChart,
  MapPin,
  Target,
  Lightbulb,
  TrendingUp,
  RefreshCw,
  LucideProps,
} from "lucide-react";

const FEATURES = [
  {
    title: "AI-Powered Location Optimization",
    description:
      "Utilize intelligent algorithms to identify the most strategic locations for business success.",
    icon: (props: LucideProps) => <Sparkles {...props} />,
  },
  {
    title: "Real-Time Data Integration",
    description:
      "Get instantly updated data feeds to make timely and informed business decisions.",
    icon: (props: LucideProps) => <BarChart {...props} />,
  },
  {
    title: "Business Density Mapping",
    description:
      "Visualize competitor presence and business saturation to assess location opportunities.",
    icon: (props: LucideProps) => <MapPin {...props} />,
  },
  {
    title: "Customizable Expansion Recommendations",
    description:
      "Tailor your growth strategy with recommendations based on your industry and preferences.",
    icon: (props: LucideProps) => <Target {...props} />,
  },
  {
    title: "Actionable Insights for Smarter Decisions",
    description:
      "Turn raw data into meaningful insights that drive confident, data-backed choices.",
    icon: (props: LucideProps) => <Lightbulb {...props} />,
  },
  {
    title: "Scalable for Various Business Sizes",
    description:
      "Whether you're a startup or enterprise, the platform adapts to fit your expansion needs.",
    icon: (props: LucideProps) => <TrendingUp {...props} />,
  },
  {
    title: "Regular Data Updates",
    description:
      "Stay ahead with frequent updates that reflect the latest shifts in market conditions.",
    icon: (props: LucideProps) => <RefreshCw {...props} />,
  },
];

// Animation variants
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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 20,
    },
  },
};

// Custom variants for the rotating card effect
const cardVariants = {
  initial: (direction: number) => ({
    rotateY: direction >= 0 ? "30deg" : "-30deg",
    x: direction >= 0 ? 100 : -100,
    opacity: 0,
    scale: 0.9,
  }),
  animate: {
    rotateY: "0deg",
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      duration: 0.7,
    },
  },
  exit: (direction: number) => ({
    rotateY: direction >= 0 ? "-30deg" : "30deg",
    x: direction >= 0 ? -100 : 100,
    opacity: 0,
    scale: 0.9,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 35,
      duration: 0.5,
    },
  }),
};

// Feature content animation
const featureContentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3,
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
};

export default function FeatureSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const [direction, setDirection] = useState(1); // Track direction of navigation: 1 for forward, -1 for backward

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      if (typeof lenis.destroy === "function") lenis.destroy();
    };
  }, []);

  // Enhanced scroll handler with precise calculations and direction detection
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // Check if section is in view
      if (rect.top < viewportHeight * 0.8 && !hasEntered) {
        setHasEntered(true);
      }

      // Calculate scroll position relative to the section with improved precision
      const scrollTop =
        window.scrollY - (rect.top + window.scrollY - viewportHeight / 2);

      // Smoother progress calculation with easing
      const rawProgress = Math.max(
        0,
        Math.min(1, scrollTop / (sectionHeight * 0.75))
      );

      // Apply subtle easing to make progress feel more natural
      const easedProgress = Math.pow(rawProgress, 1.1);
      setScrollProgress(easedProgress);

      // Calculate active index with prevention of flickering
      const total = FEATURES.length;
      const segmentSize = 1 / total;
      let idx = Math.floor(easedProgress / segmentSize);

      // More sophisticated threshold to prevent flickering
      const remainder = easedProgress % segmentSize;
      const threshold = 0.15; // Increased threshold for smoother transitions
      if (remainder < threshold && idx > 0 && easedProgress < 0.97) idx--;
      if (idx >= total) idx = total - 1;

      // Determine direction of navigation for card rotation
      if (idx !== activeIndex) {
        setDirection(idx > activeIndex ? 1 : -1);
        setActiveIndex(idx);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initialize on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasEntered, activeIndex]);

  // Use Framer Motion's useScroll for parallax effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Transform values for parallax effects
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.3, 0.1]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[200vh] py-32 md:py-48 bg-background dark:bg-background"
    >
      {/* Section Heading with enhanced animations */}
      <motion.div
        initial="hidden"
        animate={hasEntered ? "visible" : "hidden"}
        variants={textContainerVariants}
        className="text-center max-w-4xl mx-auto mb-24 px-6 relative z-10"
      >
        <motion.h2
          variants={textItemVariants}
          className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-foreground"
        >
          Power Your Growth with <br className="hidden md:inline" />
          <span className="text-primary relative">
            Data-Driven Expansion
            <motion.span
              className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 dark:bg-primary/40 rounded-full"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 1, ease: "easeOut" }}
            />
          </span>
        </motion.h2>
        <motion.p
          variants={textItemVariants}
          className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
        >
          Unlock real-time insights, smart location analysis, and seamless
          workflows — everything you need to grow with confidence and clarity.
        </motion.p>
      </motion.div>

      {/* Enhanced Background decoration with scroll-based animations */}
      {/* 10x Dev: Scattered, animated, glassy glowing blobs with theme-aware gradients */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ opacity: bgOpacity }}
      >
        {/* Blob 1 */}
        <motion.div
          className="absolute top-[18%] left-[12%] w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 dark:from-primary/30 dark:via-primary/20 dark:to-accent/30 shadow-2xl shadow-primary/20 filter blur-[100px] saturate-150"
          style={{
            scale: bgScale,
            rotateZ: useTransform(scrollYProgress, [0, 1], [0, 22]),
            opacity: 0.85,
            mixBlendMode: "lighten",
          }}
          animate={{
            y: [0, 24, -18, 0],
            x: [0, 12, -8, 0],
            scale: [1, 1.08, 0.97, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
        {/* Blob 2 */}
        <motion.div
          className="absolute bottom-[22%] right-[16%] w-[32rem] h-[32rem] rounded-full bg-gradient-to-tr from-accent/20 via-primary/10 to-background/20 dark:from-accent/30 dark:via-primary/20 dark:to-background/30 shadow-2xl shadow-accent/20 filter blur-[120px] saturate-150"
          style={{
            scale: bgScale,
            rotateZ: useTransform(scrollYProgress, [0, 1], [0, -18]),
            opacity: 0.7,
            mixBlendMode: "lighten",
          }}
          animate={{
            y: [0, -18, 22, 0],
            x: [0, -16, 10, 0],
            scale: [1, 0.95, 1.07, 1],
          }}
          transition={{
            duration: 17,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
        {/* Blob 3 */}
        <motion.div
          className="absolute top-[55%] left-[55%] w-[20rem] h-[20rem] rounded-full bg-gradient-to-tl from-primary/10 via-accent/10 to-secondary/20 dark:from-primary/20 dark:via-accent/20 dark:to-secondary/30 shadow-xl shadow-secondary/20 filter blur-[80px] saturate-150"
          style={{
            scale: bgScale,
            rotateZ: useTransform(scrollYProgress, [0, 1], [0, 30]),
            opacity: 0.6,
            mixBlendMode: "lighten",
          }}
          animate={{
            y: [0, 10, -14, 0],
            x: [0, 8, -12, 0],
            scale: [1, 1.04, 0.98, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
        {/* Subtle glassy overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/80 dark:from-transparent dark:via-background/40 dark:to-background/90 backdrop-blur-[2px]" />
      </motion.div>

      <div
        ref={contentRef}
        className="container mx-auto px-6 flex flex-col md:flex-row-reverse items-start justify-between gap-8 md:gap-12 max-w-7xl min-h-[600vh]"
      >
        {/* Sticky Card with enhanced counter-rotating visual effect */}
        <div className="w-full md:w-2/3 lg:w-3/5 sticky top-1/4 self-start z-10 h-[480px] px-4 md:px-6">
          <div className="w-full h-full perspective-[1200px] transform-gpu">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 w-full h-[300px] rounded-2xl bg-background/80 backdrop-blur-xl dark:bg-background/60 border border-border/70 dark:border-border/40 shadow-xl p-8 md:p-10 flex flex-col items-start gap-8 transform-gpu"
                style={{
                  fontFamily: "var(--font-geist-sans)",
                  transformStyle: "preserve-3d",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex + "-content"}
                    className="w-full h-full flex flex-col gap-8"
                    variants={featureContentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {/* Feature icon */}
                    <motion.div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary">
                      {FEATURES[activeIndex].icon({
                        size: 28,
                        className: "text-primary",
                      })}
                    </motion.div>

                    <div>
                      <h3
                        className="text-3xl font-bold text-foreground mb-3"
                        style={{ fontFamily: "var(--font-geist-sans)" }}
                      >
                        {FEATURES[activeIndex].title}
                      </h3>
                      <p
                        className="text-lg text-muted-foreground"
                        style={{ fontFamily: "var(--font-geist-sans)" }}
                      >
                        {FEATURES[activeIndex].description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Enhanced progress indicator */}
          <div className="absolute -bottom-16 left-0 w-full flex justify-between items-center px-4 opacity-80">
            {FEATURES.map((_, i) => (
              <motion.div
                key={i}
                className="h-1 bg-primary/30 dark:bg-primary/50 rounded-full"
                style={{
                  width: `${100 / FEATURES.length - 3}%`,
                  opacity: i <= activeIndex ? 1 : 0.4,
                  backgroundColor:
                    i <= activeIndex
                      ? "var(--primary)"
                      : "rgba(var(--primary), 0.3)",
                }}
                animate={{
                  opacity: i <= activeIndex ? 1 : 0.4,
                  scale: i === activeIndex ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 0.5,
                  scale: {
                    repeat: i === activeIndex ? Infinity : 0,
                    repeatDelay: 2,
                  },
                }}
              />
            ))}
          </div>

          {/* Mobile progress bar with enhanced styling */}
          <div className="md:hidden w-full flex flex-col items-center mt-24 z-20">
            <div className="w-full max-w-sm bg-muted-foreground/10 dark:bg-muted-foreground/20 h-2 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-primary rounded-full"
                style={{
                  width: `${(activeIndex / (FEATURES.length - 1)) * 100}%`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              {activeIndex + 1} of {FEATURES.length}
            </p>
          </div>
        </div>

        {/* Enhanced Scroll Progress visualization */}
        <div className="hidden md:flex flex-col items-center h-[500vh] w-24 relative">
          {/* Progress Bar Track with improved styling */}
          <div className="absolute ml-6 left-1/2 -translate-x-1/2 top-0 h-[499vh] w-10 bg-gradient-to-b from-primary/5 via-background/40 to-primary/5 dark:from-primary/10 dark:via-background/30 dark:to-primary/10 rounded-full shadow-inner overflow-hidden border border-primary/10 dark:border-primary/20"></div>{" "}
          {/* 10x Dev Polished Dots: Ultra-refined, glassy, and interactive */}
          <div className="absolute ml-6 left-1/2 -translate-x-1/2 top-0 h-full flex flex-col justify-between w-32 z-20 pointer-events-none select-none">
            {FEATURES.map((feature, i) => {
              const segmentSize = 1 / FEATURES.length;
              const segmentMiddle = segmentSize * i + segmentSize / 2;
              const isActive = activeIndex === i;
              const isHot = Math.abs(scrollProgress - segmentMiddle) < 0.13;
              const completionPercentage = Math.min(
                1,
                Math.max(0, (scrollProgress - segmentSize * i) / segmentSize)
              );

              return (
                <motion.div
                  key={i}
                  className="relative flex items-center justify-center w-full h-20"
                  animate={{
                    scale: isActive ? 1.18 : isHot ? 1.08 : 1,
                    y: isActive ? 0 : isHot ? -4 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 22,
                  }}
                  style={{ zIndex: isActive ? 30 : isHot ? 20 : 10 }}
                >
                  {/* Feature label: glassy, floating, with subtle shadow
                  <motion.div
                    className="absolute -right-36 whitespace-nowrap bg-white/70 dark:bg-background/80 backdrop-blur-lg px-5 py-2 rounded-2xl text-base font-semibold border border-border/40 shadow-2xl shadow-primary/10 text-primary/90 dark:text-primary/80 pointer-events-auto"
                    initial={{ opacity: 0, x: 24, filter: "blur(2px)" }}
                    animate={{
                      opacity: isActive ? 1 : isHot ? 0.85 : isNear ? 0.5 : 0,
                      x: isActive ? 0 : isHot ? 8 : isNear ? 16 : 24,
                      filter: isActive ? "blur(0px)" : "blur(2px)",
                      scale: isActive ? 1.08 : 1,
                    }}
                    whileHover={{
                      opacity: 1,
                      x: 0,
                      scale: 1.12,
                      filter: "blur(0px)",
                      transition: { duration: 0.18 },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 320,
                      damping: 24,
                      opacity: { duration: 0.18 },
                    }}
                  >
                    <span className="text-primary font-mono mr-1">
                      {i + 1}.
                    </span>
                    <span className="tracking-tight">
                      {feature.title.split(" ")[0]}
                    </span>
                  </motion.div> */}

                  {/* Dot container: glass, glow, and 3D */}
                  <motion.div
                    className="w-[48px] h-[48px] rounded-full flex items-center justify-center relative shadow-xl shadow-primary/10 bg-gradient-to-br from-background/80 via-white/60 to-primary/10 border border-primary/20 dark:from-background/70 dark:via-background/60 dark:to-primary/20"
                    style={{
                      boxShadow: isActive
                        ? "0 0 32px 8px var(--primary), 0 2px 16px 0 rgba(0,0,0,0.10)"
                        : isHot
                        ? "0 0 16px 4px var(--primary), 0 1px 8px 0 rgba(0,0,0,0.08)"
                        : "0 1px 4px 0 rgba(0,0,0,0.06)",
                      zIndex: isActive ? 40 : 10,
                      filter: isActive
                        ? "drop-shadow(0 0 8px var(--primary))"
                        : isHot
                        ? "drop-shadow(0 0 4px var(--primary))"
                        : "none",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                    }}
                    whileHover={{
                      scale: 1.22,
                      boxShadow:
                        "0 0 40px 12px var(--primary), 0 2px 24px 0 rgba(0,0,0,0.13)",
                      transition: { duration: 0.18 },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 18,
                    }}
                  >
                    {/* Progress ring: glassy, animated, with subtle gradient */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(
                          var(--primary) ${
                            i < activeIndex
                              ? 360
                              : isActive
                              ? completionPercentage * 360
                              : 0
                          }deg, 
                          rgba(var(--primary-rgb), 0.10) 0deg
                        )`,
                        opacity: i <= activeIndex ? 0.95 : 0.25,
                        filter: "blur(1.5px)",
                      }}
                      animate={{
                        rotate: [0, i <= activeIndex ? 360 : 0],
                      }}
                      transition={{
                        rotate: {
                          duration: i <= activeIndex ? 1.2 : 0,
                          ease: "easeInOut",
                          delay: i * 0.07,
                        },
                      }}
                    />
                    {/* Outer ring: neon pulse, glass border */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary/80 dark:border-primary/70"
                      style={{
                        boxShadow: isActive
                          ? "0 0 32px 8px var(--primary), 0 0 0 2px var(--primary)/40"
                          : isHot
                          ? "0 0 16px 4px var(--primary)"
                          : "none",
                        border: isActive
                          ? "2.5px solid var(--primary)"
                          : "2px solid var(--primary)",
                        opacity: isActive ? 1 : 0.7,
                        filter: isActive ? "blur(0.5px)" : "blur(1.5px)",
                      }}
                      animate={
                        isActive
                          ? {
                              boxShadow: [
                                "0 0 16px 2px var(--primary)",
                                "0 0 32px 8px var(--primary)",
                                "0 0 16px 2px var(--primary)",
                              ],
                            }
                          : {}
                      }
                      transition={{
                        boxShadow: {
                          duration: 2.2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        },
                      }}
                    />
                    {/* Inner dot: glass, gradient, and subtle shine */}
                    <motion.div
                      className="w-[26px] h-[26px] rounded-full z-10 border-2 border-white/40 dark:border-white/20 shadow-inner"
                      style={{
                        background: isActive
                          ? "linear-gradient(135deg, var(--primary) 0%, #fff 100%)"
                          : i < activeIndex
                          ? "linear-gradient(135deg, var(--primary) 0%, #e0e7ff 100%)"
                          : "linear-gradient(135deg, #e0e7ff 0%, #f3f4f6 100%)",
                        opacity: isActive ? 1 : 0.85,
                        boxShadow: isActive
                          ? "0 0 12px 2px var(--primary)"
                          : "0 0 4px 1px var(--primary)/30",
                        filter: isActive
                          ? "brightness(1.1)"
                          : "brightness(0.97)",
                      }}
                      animate={
                        isActive
                          ? {
                              scale: [1, 1.13, 1],
                            }
                          : {}
                      }
                      transition={{
                        scale: {
                          duration: 2.2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        },
                      }}
                    >
                      {/* Shine effect */}
                      <motion.div
                        className="absolute left-1 top-1 w-3 h-3 rounded-full bg-white/70 pointer-events-none"
                        style={{
                          filter: "blur(2px)",
                          opacity: isActive ? 0.7 : 0.3,
                        }}
                        animate={
                          isActive
                            ? {
                                scale: [1, 1.2, 1],
                                opacity: [0.7, 1, 0.7],
                              }
                            : {}
                        }
                        transition={{
                          scale: {
                            duration: 2.2,
                            repeat: Infinity,
                            repeatType: "reverse",
                          },
                          opacity: {
                            duration: 2.2,
                            repeat: Infinity,
                            repeatType: "reverse",
                          },
                        }}
                      />
                    </motion.div>
                    {/* Central pulse dot: white, soft, glowing */}
                    {isActive && (
                      <motion.div
                        className="absolute w-[10px] h-[10px] rounded-full bg-white/90 shadow-lg z-20"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [0, 1.1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.6,
                          repeat: Infinity,
                          repeatDelay: 0.4,
                        }}
                        style={{
                          filter: "blur(1px)",
                        }}
                      />
                    )}
                    {/* Number indicator: glassy, floating, mono
                    <motion.div
                      className="absolute -bottom-7 text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-white/60 dark:bg-background/70 shadow border border-border/30"
                      animate={{
                        opacity: isActive ? 1 : isHot ? 0.7 : 0.35,
                        scale: isActive ? 1.13 : 1,
                        y: isActive ? 2 : 0,
                      }}
                      style={{
                        color: isActive
                          ? "var(--primary)"
                          : "var(--muted-foreground)",
                        letterSpacing: "0.04em",
                        backdropFilter: "blur(2px)",
                      }}
                    >
                      {i + 1}
                    </motion.div> */}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
