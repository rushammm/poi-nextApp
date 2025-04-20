"use client";
import {
  Menu,
  Home,
  Star,
  LetterText,
  Phone,
  X,
  Map,
  Compass,
  BarChart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isNavHovered, setIsNavHovered] = useState(false);

  // Animation variants - refined for subtlety
  const navVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 20,
        duration: 0.4,
      },
    },
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: -10 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    }),
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
    tap: { scale: 0.97 },
  };

  const iconVariants = {
    initial: { rotate: 0 },
    hover: { rotate: 5, transition: { type: "spring", stiffness: 400 } },
  };

  const logoVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };
  const items = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Team", icon: Star, href: "/team" },
    { name: "Insights", icon: BarChart, href: "/insights" },
    { name: "Location Prediction", icon: Map, href: "/locationpred" },
    { name: "Terms & Conditions", icon: LetterText, href: "/terms" },
    { name: "Contact", icon: Phone, href: "/contact" },
  ];

  return (
    <motion.header
      className="relative z-50 px-4 py-4"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <motion.div
        className="relative"
        onHoverStart={() => setIsNavHovered(true)}
        onHoverEnd={() => setIsNavHovered(false)}
      >
        {/* Subtle radial hallow border - design guide compliant */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[50%] h-[6px] pointer-events-none z-10"
          style={{
            background: isNavHovered
              ? `radial-gradient(ellipse at center, 
                  var(--primary, #6366f1) 0%,
                  rgba(var(--primary-rgb,99,102,241),0.10) 60%,
                  transparent 100%)`
              : "transparent",
            opacity: isNavHovered ? 0.22 : 0,
            filter: isNavHovered ? "blur(1.5px)" : "none",
            transition:
              "background 0.3s cubic-bezier(.4,2,.6,1), filter 0.3s cubic-bezier(.4,2,.6,1)",
          }}
          initial={{ scaleX: 0.8, scaleY: 0.7, opacity: 0 }}
          animate={{
            scaleX: isNavHovered ? 1 : 0.8,
            scaleY: isNavHovered ? 1 : 0.7,
            opacity: isNavHovered ? 0.22 : 0,
          }}
          transition={{
            duration: 0.5,
            ease: [0.19, 1, 0.22, 1],
          }}
        />

        <motion.nav
          className={`
            flex flex-wrap justify-between items-center w-full 
            px-4 sm:px-6 lg:px-8 py-3 sm:py-4
            rounded-xl transition-all duration-300
            bg-background/30 dark:bg-background/40
            backdrop-blur-md
            border-b border-border/20 dark:border-border/20
            shadow-sm
            text-foreground dark:text-foreground
            relative
          `}
        >
          {/* Logo section - clean and minimal with hover effect */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover="hover"
            initial="initial"
          >
            <motion.div
              className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/5 dark:bg-primary/10 overflow-hidden"
              variants={logoVariants}
            >
              <Image
                src="/logo.svg"
                alt="LocatePro Logo"
                width={28}
                height={28}
                className="object-cover"
                priority
              />
            </motion.div>
            <div className="flex flex-col">
              <motion.span
                className="text-base font-medium tracking-tight md:text-lg"
                initial={{ y: 0 }}
                whileHover={{
                  y: -1,
                  color: "var(--primary)",
                  transition: { type: "spring", stiffness: 200 },
                }}
              >
                LocatePro
              </motion.span>
              <span className="text-xs text-muted-foreground hidden sm:inline-block">
                Expansion Optimized
              </span>
            </div>
          </motion.div>

          {/* Desktop menu - refined and minimal with enhanced interactions */}
          <ul className="hidden md:flex md:items-center gap-1 lg:gap-6">
            {items.map((item, i) => (
              <motion.li
                key={item.name}
                custom={i}
                variants={menuItemVariants}
                initial="closed"
                animate="open"
                className="relative"
                onHoverStart={() => setHoverIndex(i)}
                onHoverEnd={() => setHoverIndex(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-background/20 transition-colors duration-200"
                >
                  <motion.div
                    initial="initial"
                    animate={hoverIndex === i ? "hover" : "initial"}
                    variants={iconVariants}
                  >
                    <item.icon
                      size={15}
                      className={`transition-colors duration-200 ${
                        hoverIndex === i
                          ? "text-primary"
                          : "text-foreground/70 dark:text-foreground/70"
                      }`}
                    />
                  </motion.div>
                  <motion.span
                    className="text-sm"
                    initial={{ y: 0 }}
                    animate={{
                      y: hoverIndex === i ? -1 : 0,
                      color: hoverIndex === i ? "var(--primary)" : "",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {item.name}
                  </motion.span>
                </Link>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px bg-primary/40 dark:bg-primary/50"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoverIndex === i ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ transformOrigin: "left" }}
                />
              </motion.li>
            ))}
          </ul>

          {/* Mobile menu button - simplified with micro-animation */}
          <motion.button
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="md:hidden p-2 rounded-md bg-background/10 text-foreground"
            aria-label="Toggle Menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* CTA Button - desktop with enhanced micro-interactions */}
          <motion.button
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="hidden md:flex items-center gap-2 px-4 py-2 
              bg-primary/90 text-primary-foreground 
              rounded-md text-sm font-medium
              transition-all duration-200"
          >
            <motion.div variants={iconVariants}>
              <Map size={15} />
            </motion.div>
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Get Started
            </motion.span>
          </motion.button>
        </motion.nav>
      </motion.div>

      {/* Mobile menu - with enhanced micro-interactions */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -5 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -5 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <motion.ul
              className="flex flex-col gap-1 mt-2 p-3 
                bg-background/40 dark:bg-background/50 
                backdrop-blur-md
                border border-border/20 dark:border-border/20
                rounded-xl"
              initial={{ x: -5 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.2, staggerChildren: 0.05 }}
            >
              {items.map((item, i) => (
                <motion.li
                  key={item.name}
                  custom={i}
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  whileHover={{
                    backgroundColor: "rgba(var(--background), 0.2)",
                  }}
                  className="rounded-md"
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <motion.div
                      initial={{ rotate: 0 }}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <item.icon size={16} className="text-foreground/70" />
                    </motion.div>
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {item.name}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
              <motion.li
                custom={items.length}
                variants={menuItemVariants}
                initial="closed"
                animate="open"
              >
                <motion.button
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 
                    bg-primary/90 text-primary-foreground 
                    rounded-md text-sm
                    transition-all duration-200"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Compass size={16} />
                  </motion.div>
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Get Started
                  </motion.span>
                </motion.button>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
