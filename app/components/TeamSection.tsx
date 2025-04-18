"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  linkedinUrl: string; // Add this line
}

export default function TeamSection() {
  const [isMounted, setIsMounted] = useState(false);

  // Initialize animations only after mount to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.18, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 18 },
    },
  };

  const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.1 } },
  };

  const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1.1 } },
  };

  // Team members array
  const teamMembers: TeamMember[] = [
    {
      name: "Rusham Elahi",
      role: "Chief Data Scientist",
      bio: "Leading our data intelligence efforts with expertise in spatial analytics, machine learning, and predictive modeling for business location optimization.",
      imageUrl:
        "https://poi-next-app.vercel.app/_next/image?url=%2Fimages%2Frusham.jpg&w=1920&q=75",
      linkedinUrl: "https://www.linkedin.com/in/rusham-elahi-38511a229/"
    },
    {
      name: "Syeda Wafa Zahra",
      role: "Urban Planning Expert",
      bio: "Shaping urban development with expertise in land use, infrastructure, and sustainable growth to optimize spaces for better living and working environments.",
      imageUrl:
        "/tehreem.jpeg",
      linkedinUrl: "https://www.linkedin.com/in/wafa-zahra-ba8b40354/"
    },
    {
      name: "Tehreem Fatima",
      role: "GIS Specialist",
      bio: "Leveraging GIS expertise and spatial data analysis to provide actionable insights for urban, environmental, and business planning.",
      imageUrl:
        "/wafa.jpeg",
      linkedinUrl: "https://www.linkedin.com/in/tehreem-fatima-72873b213/"
    },
    // More team members can be added here in the future
  ];

  return (
    <motion.section
      className="relative w-full min-h-screen flex items-center bg-background dark:bg-background z-10 overflow-hidden py-20"
      initial="hidden"
      animate={isMounted ? "visible" : "hidden"}
      variants={containerVariants}
      id="team"
    >
      {/* Background effects */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/70 dark:to-background/80 pointer-events-none z-0"
        variants={fadeIn}
      />
      <motion.div
        className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl z-0"
        variants={scaleIn}
      />{" "}
      <motion.div
        className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-accent/5 dark:bg-accent/10 blur-3xl z-0"
        variants={scaleIn}
      />
      <motion.div
        className="absolute inset-0 bg-background/50 dark:bg-background/70 backdrop-blur-sm z-0"
        variants={fadeIn}
      />
      {/* SVG Background Decoration */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-[0.06] dark:opacity-[0.09]"
        variants={fadeIn}
      >
        {/* Animated abstract flowing lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M0,500 Q250,400 500,500 T1000,500 M0,600 Q250,500 500,600 T1000,600"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeDasharray="12,16"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0.7, 1],
              opacity: [0, 0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <motion.path
            d="M0,400 Q250,300 500,400 T1000,400 M0,700 Q250,800 500,700 T1000,700"
            fill="none"
            stroke="var(--secondary)"
            strokeWidth="1.5"
            strokeDasharray="10,14"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0.8, 1],
              opacity: [0, 0.3, 0.2, 0.3],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          {/* Add a third, subtle animated line for more depth */}
          <motion.path
            d="M0,550 Q300,650 700,550 T1000,550"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1"
            strokeDasharray="8,12"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0.6, 1],
              opacity: [0, 0.18, 0.1, 0.18],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </svg>

        {/* Animated circular decoration elements */}
        <motion.div
          className="absolute top-[30%] left-[10%] w-16 h-16 rounded-full bg-primary/30 dark:bg-primary/40 blur-2xl"
          initial={{ scale: 0.7, opacity: 0.5 }}
          animate={{
            scale: [0.7, 1.1, 0.9, 1.05, 0.7],
            opacity: [0.5, 0.8, 0.6, 0.8, 0.5],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[18%] right-[14%] w-24 h-24 rounded-full bg-accent/20 dark:bg-accent/30 blur-3xl"
          initial={{ scale: 0.8, opacity: 0.4 }}
          animate={{
            scale: [0.8, 1.2, 1, 1.1, 0.8],
            opacity: [0.4, 0.7, 0.5, 0.7, 0.4],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
        <motion.div
          className="absolute top-[60%] left-[45%] w-10 h-10 rounded-full bg-secondary/30 dark:bg-secondary/40 blur-xl"
          initial={{ scale: 0.6, opacity: 0.3 }}
          animate={{
            scale: [0.6, 1.1, 0.8, 1, 0.6],
            opacity: [0.3, 0.6, 0.4, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </motion.div>
      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          className="max-w-4xl mx-auto text-center mb-16"
          variants={itemVariants}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-foreground dark:text-foreground mb-6 drop-shadow-2xl"
            style={{ fontFamily: "var(--font-geist-sans)" }}
            variants={itemVariants}
          >
            Our Team
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-geist-sans)" }}
            variants={itemVariants}
          >
            Meet the experts behind LocatePro&apos;s data-driven location
            intelligence
          </motion.p>
        </motion.div>{" "}
        {/* Team members grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto"
          variants={containerVariants}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="relative group"
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              {/* Card background with glass effect */}
              <motion.div
                className="absolute inset-0 bg-background/30 dark:bg-background/20 backdrop-blur-md rounded-2xl border border-border dark:border-border/40 shadow-xl z-0 overflow-hidden"
                initial={{ borderRadius: "1rem" }}
                whileHover={{
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  borderColor: "var(--primary)",
                  transition: { duration: 0.2 },
                }}
              >
                {/* Animated background pattern */}
                <svg
                  className="absolute w-full h-full opacity-[0.03] dark:opacity-[0.05] z-0"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M0,0 L100,0 L100,100 L0,100 Z"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="0.5"
                    strokeDasharray="8,8"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: 0.4,
                      transition: {
                        duration: 3,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse",
                      },
                    }}
                  />
                </svg>

                {/* Subtle gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background/0 to-accent/5 dark:from-primary/10 dark:via-background/0 dark:to-accent/10 z-0" />
              </motion.div>

              {/* Card content wrapper */}
              <motion.div
                className="relative z-10 flex flex-col items-center p-6"
                variants={fadeIn}
              >
                {/* Member image with animated container */}
                <motion.div
                  className="relative w-56 h-56 mb-6 rounded-xl overflow-hidden"
                  variants={scaleIn}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Decorative corner accents */}
                  <svg
                    className="absolute top-0 left-0 w-12 h-12 z-10 pointer-events-none"
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      d="M2 8 L2 2 L8 2"
                      stroke="var(--primary)"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </svg>
                  <svg
                    className="absolute top-0 right-0 w-12 h-12 z-10 pointer-events-none"
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      d="M16 2 L22 2 L22 8"
                      stroke="var(--primary)"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                  </svg>
                  <svg
                    className="absolute bottom-0 left-0 w-12 h-12 z-10 pointer-events-none"
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      d="M2 16 L2 22 L8 22"
                      stroke="var(--primary)"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                    />
                  </svg>
                  <svg
                    className="absolute bottom-0 right-0 w-12 h-12 z-10 pointer-events-none"
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      d="M16 22 L22 22 L22 16"
                      stroke="var(--primary)"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 1.1 }}
                    />
                  </svg>

                  {/* Gradient overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-80 transition-all duration-300 ease-in-out z-10"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.6 }}
                  />

                  {/* Ring effect on hover */}
                  <motion.div
                    className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/60 rounded-xl z-10"
                    initial={{ opacity: 0 }}
                    whileHover={{
                      opacity: 1,
                      boxShadow: "inset 0 0 20px rgba(var(--primary-rgb), 0.2)",
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Member image */}
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    width={256}
                    height={256}
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    priority
                    style={{ filter: "contrast(1.05)" }}
                  />

                  {/* Radial gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-background/30 via-transparent to-transparent mix-blend-overlay" />
                </motion.div>

                {/* Member info with enhanced typography */}
                <motion.div
                  className="flex flex-col items-center text-center space-y-2 px-4"
                  variants={itemVariants}
                >
                  <motion.h3
                    className="text-2xl font-bold leading-tight tracking-tight text-foreground dark:text-foreground drop-shadow-sm"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                    variants={itemVariants}
                  >
                    {member.name}
                  </motion.h3>

                  {/* Decorative line with enhanced gradient and animation */}
                  <motion.div
                    className="h-0.5 w-24 bg-gradient-to-r from-primary/80 via-accent to-secondary/80"
                    variants={itemVariants}
                    whileHover={{
                      width: "7rem",
                      transition: { duration: 0.3 },
                    }}
                    whileInView={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      transition: {
                        duration: 7,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }}
                    style={{ backgroundSize: "200% 100%" }}
                  />

                  <motion.h4
                    className="text-base md:text-lg font-medium text-primary dark:text-primary mb-2"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                    variants={itemVariants}
                  >
                    {member.role}
                  </motion.h4>

                  <motion.p
                    className="text-sm md:text-base text-muted-foreground dark:text-muted-foreground max-w-sm leading-relaxed"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                    variants={fadeIn}
                  >
                    {member.bio}
                  </motion.p>

                  {/* LinkedIn button with enhanced style */}
                  <motion.a
                    href={member.linkedinUrl}  // Update this line
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 px-5 py-2 bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary dark:text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/60 active:scale-95 hover:shadow-md hover:shadow-primary/20"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 4px 12px rgba(var(--primary-rgb), 0.25)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="inline-block align-middle"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <span className="text-sm font-semibold">LinkedIn</span>
                  </motion.a>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        {/* Decorative elements */}
        <motion.div
          className="pointer-events-none select-none"
          variants={containerVariants}
        >
          {/* Top left floating dot */}
          <motion.div
            className="absolute top-10 left-10 w-8 h-8 rounded-full bg-primary/20 dark:bg-primary/30 blur-2xl z-10"
            variants={scaleIn}
            animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0.7, 1] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 2,
            }}
          />
          {/* Bottom right accent ring */}
          <motion.div
            className="absolute bottom-10 right-10 w-24 h-24 rounded-full border-4 border-accent/40 dark:border-accent/60 blur-md z-10"
            style={{ borderStyle: "dashed" }}
            variants={scaleIn}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
