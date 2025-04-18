"use client";

import { FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Animation variants per design guide
const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

// More subtle, vertical animation for cleaner appearance
const textItemVariants = {
  hidden: { y: 10, opacity: 0 },
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

const Footer = () => {
  // State to track hover for enhanced interactions
  const [hovered, setHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize animations only after mount to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <footer className="mt-14 bg-background dark:bg-background text-foreground dark:text-foreground py-4 md:py-6 relative overflow-hidden font-[family-name:var(--font-geist-sans)]">
      {/* Refined background effects - more subtle glowing circles */}
      <div className="absolute top-1/4 -left-24 w-72 h-72 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl z-0 pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-64 h-64 rounded-full bg-accent/5 dark:bg-accent/10 blur-3xl z-0 pointer-events-none" />

      {/* Subtle grid pattern overlay for texture */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.015] dark:opacity-[0.03] z-0 pointer-events-none" />

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-background/60 dark:bg-background/80 backdrop-blur-sm z-0 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col">
        {/* Main Content - More compact with better spacing */}
        <motion.div
          variants={textContainerVariants}
          initial="hidden"
          animate={isMounted ? "visible" : "hidden"}
          className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2 items-center"
        >
          {/* Left Column - Logo & Message */}
          <motion.div
            variants={textItemVariants}
            className="flex items-center gap-3 pl-0 md:pl-4 justify-center md:justify-start"
          >
            <Image
              src="/logo.svg"
              alt="LocatePro Logo"
              width={42}
              height={42}
              className="dark:invert"
              priority
            />{" "}
            <h2
              className="text-base md:text-lg font-bold leading-tight tracking-tight text-primary dark:text-primary"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              MAXIMIZE YOUR <br />
              BUSINESS EXPANSION <br />
              WITH DATA-DRIVEN INSIGHTS
            </h2>
          </motion.div>

          {/* Center Column - Enhanced Circle Button */}
          <motion.div
            variants={textItemVariants}
            className="flex items-center justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              animate={isMounted ? "pulse" : ""}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary/60 shadow-lg border border-primary/20"
              style={{ fontFamily: "var(--font-geist-sans)" }}
              aria-label="Get in touch"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-radial from-primary/20 to-transparent opacity-50"></div>
              <Image
                src="/world-map.svg"
                alt="World Map"
                width={160}
                height={94}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                  hovered ? "opacity-90 scale-105" : "opacity-40"
                }`}
                priority
              />
              {/* Light shine effect */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 to-transparent"
                animate={hovered ? { opacity: 0.6 } : { opacity: 0.2 }}
                transition={{ duration: 0.4 }}
              />{" "}
              <span className="relative z-10 font-bold tracking-wide text-primary-foreground drop-shadow-sm">
                <span className="text-primary-foreground">GET IN TOUCH</span>
              </span>
              <motion.span
                className="absolute inset-0 bg-secondary/50 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"
                aria-hidden="true"
              />
            </motion.button>
          </motion.div>

          {/* Right Column - Support Section */}
          <motion.div
            variants={textItemVariants}
            className="flex items-center justify-center md:justify-end md:pr-4"
          >
            <div className="text-center md:text-right">
              {" "}
              <h3 className="text-sm md:text-base font-medium mb-1 text-foreground dark:text-foreground">
                Got questions? <br />
                <span className="text-muted-foreground dark:text-muted-foreground">
                  Contact our dedicated support team
                </span>
              </h3>
              <a
                href="mailto:locatepro.pk@gmail.com"
                className="text-primary hover:text-primary/80 transition-colors underline-offset-2 focus:outline-none focus:ring-2 focus:ring-primary/60 font-medium text-sm"
              >
                locatepro.pk@gmail.com
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Section - More compact and refined */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-border/30 dark:border-border/20 mt-4 pt-4 px-0 md:px-4 space-y-2 md:space-y-0">
          {/* Spacer for alignment on desktop */}
          <div className="hidden md:block w-16" aria-hidden="true"></div>

          {/* Centered Content - More compact */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 text-sm">
            {/* Copyright and Terms */}
            <div className="text-center">
              <h3
                className="font-bold text-sm md:text-base text-primary dark:text-primary"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                COPYRIGHT 2025
              </h3>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-primary transition-colors text-xs md:text-sm"
              >
                Terms of Service
              </Link>
            </div>

            {/* Contact Information - More compact */}
            <div className="text-center">
              <h3
                className="font-bold text-sm md:text-base text-primary dark:text-primary"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                LAHORE
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                Lahore, PK
              </p>
            </div>

            <div className="text-center">
              <h3
                className="font-bold text-sm md:text-base text-primary dark:text-primary"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                CONTACT
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                locatepro.pk@gmail.com
              </p>
            </div>
          </div>

          {/* Social Icons with enhanced hover effects */}
          <motion.div className="w-full md:w-16 flex justify-center md:justify-end gap-3">
            <motion.div
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="https://www.linkedin.com/company/locatepro/"
                className="text-muted-foreground hover:text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/60 rounded-full flex items-center justify-center w-8 h-8 bg-foreground/5 hover:bg-foreground/10"
                aria-label="LocatePro LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
