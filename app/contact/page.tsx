"use client";

import {
  User,
  Phone,
  Mail,
  MessageSquare,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, FormEvent } from "react";
import Image from "next/image";

export default function ContactPage() {
  // Animation variants as per design guide
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
        type: "spring",
        stiffness: 60,
        damping: 20,
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

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    budget: "",
    message: "",
  });

  // Add slider state for budget
  const [budgetValue, setBudgetValue] = useState(5000);

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectType, setRedirectType] = useState<"whatsapp" | "email" | null>(
    null
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWhatsApp = (e: FormEvent) => {
    e.preventDefault();
    setRedirectType("whatsapp");
    setIsRedirecting(true);
    const message =
      `Name: ${formData.name}%0A` +
      `Phone: ${formData.phone}%0A` +
      `Email: ${formData.email}%0A` +
      `Subject: ${formData.subject}%0A` +
      `Budget: ${formData.budget}%0A` +
      `Message: ${formData.message}`;

    setTimeout(() => {
      window.open(`https://wa.me/+923026478867?text=${message}`);
      setIsRedirecting(false);
    }, 1500);
  };

  const handleEmail = (e: FormEvent) => {
    e.preventDefault();
    setRedirectType("email");
    setIsRedirecting(true);
    const subject = encodeURIComponent(
      `New Contact Form Submission - ${formData.subject}`
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
        `Phone: ${formData.phone}\n` +
        `Email: ${formData.email}\n` +
        `Subject: ${formData.subject}\n` +
        `Budget: ${formData.budget}\n` +
        `Message: ${formData.message}`
    );

    setTimeout(() => {
      window.location.href = `mailto:locatepro.pk@gmail.com?subject=${subject}&body=${body}`;
      setIsRedirecting(false);
    }, 1500);
  };

  return (
    <main className="container mx-auto px-6 py-20 relative">
      {/* Background Arrow using Next.js Image and color tokens */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="w-full h-full text-primary/5 dark:text-primary/10"
          initial={{ filter: "blur(0px)" }}
          animate={{
            filter: [
              "blur(0px) drop-shadow(0 0 20px var(--primary))",
              "blur(0px) drop-shadow(0 0 10px var(--primary))",
              "blur(0px) drop-shadow(0 0 20px var(--primary))",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/arrow.svg"
            alt="background pattern"
            fill
            priority
            className="object-cover transition-opacity duration-300"
            style={{
              color: "var(--primary)",
              opacity: 0.15,
            }}
          />
        </motion.div>
      </div>

      {/* Background Effects as per design guide */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--background)] dark:to-[var(--background)] pointer-events-none z-0" />
      <div className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-[var(--primary)]/5 dark:bg-[var(--primary)]/10 blur-3xl z-0" />
      <div className="absolute bottom-1/3 -right-20 w-96 h-96 rounded-full bg-[var(--secondary)]/5 dark:bg-[var(--secondary)]/10 blur-3xl z-0" />

      <motion.div
        variants={textContainerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto relative z-10"
      >
        <motion.h1
          variants={textItemVariants}
          className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-[var(--foreground)] dark:text-[var(--foreground)] mb-6"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Starting a new project? Get in touch and let&apos;s talk all about it.
        </motion.h1>

        <motion.p
          variants={textItemVariants}
          className="text-xl text-[var(--muted-foreground)] max-w-3xl mb-4"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Call, email, meet or video call us – however you&apos;d prefer to work
          we&apos;d love to hear from you.
        </motion.p>

        <motion.p
          variants={textItemVariants}
          className="text-xl text-[var(--primary)] font-medium mb-12"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Email: locatepro.pk@gmail.com
        </motion.p>

        <motion.form
          variants={textItemVariants}
          className="space-y-6 bg-[var(--background)]/50 dark:bg-[var(--background)]/70 backdrop-blur-sm p-8 rounded-lg border border-[var(--border)] dark:border-[var(--border)] shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 group">
                <User
                  size={20}
                  className="text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] transition-all duration-200 text-[var(--foreground)] dark:text-[var(--foreground)]"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 group">
                <Phone
                  size={20}
                  className="text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] transition-all duration-200 text-[var(--foreground)] dark:text-[var(--foreground)]"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 group">
                <Mail
                  size={20}
                  className="text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] transition-all duration-200 text-[var(--foreground)] dark:text-[var(--foreground)]"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                />
              </div>
            </div>

            {/* Subject selector styled like POIMap category selector */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 group relative">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <path d="M12 20v-6M12 4v2m0 0a8 8 0 1 1 0 16a8 8 0 0 1 0-16z" />
                </svg>
                <div className="relative w-full">
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="appearance-none w-full p-3 pl-4 pr-10 rounded-lg bg-[var(--background)] border-2 border-[var(--border)] focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] transition-all duration-200 cursor-pointer hover:border-[var(--primary)]/50 text-[var(--foreground)] dark:text-[var(--foreground)] shadow-sm"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    <option value="">Select Subject</option>
                    <option value="consultation">Consultation</option>
                    <option value="partnership">Partnership</option>
                    <option value="general">General Inquiry</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
                  />
                </div>
              </div>
            </div>

            {/* Budget slider, full width */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="budget-slider"
                  className="flex items-center gap-2 text-[var(--muted-foreground)] font-medium"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-[var(--muted-foreground)]"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Budget Range:{" "}
                  <span className="ml-2 text-[var(--primary)] font-semibold">
                    ${budgetValue.toLocaleString()}
                  </span>
                </label>
                <input
                  id="budget-slider"
                  type="range"
                  min={1000}
                  max={20000}
                  step={500}
                  value={budgetValue}
                  onChange={(e) => {
                    setBudgetValue(Number(e.target.value));
                    setFormData((prev) => ({
                      ...prev,
                      budget: `$${Number(e.target.value).toLocaleString()}`,
                    }));
                  }}
                  className="w-full accent-[var(--primary)] h-2 bg-[var(--background)] rounded-lg appearance-none cursor-pointer border border-[var(--border)]"
                  style={{ accentColor: "var(--primary)" }}
                />
                <div
                  className="flex justify-between text-xs text-[var(--muted-foreground)]"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                  <span>$1,000</span>
                  <span>$20,000+</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2 group">
              <MessageSquare
                size={20}
                className="text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors mt-3"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] transition-all duration-200 text-[var(--foreground)] dark:text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              />
            </div>
          </div>

          <div className="flex justify-center gap-4 flex-col md:flex-row">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWhatsApp}
              className="px-10 py-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 dark:focus:ring-offset-[var(--background)]"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              <MessageCircle
                size={20}
                className="transition-transform group-hover:scale-110"
              />
              <span>Contact via WhatsApp</span>
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEmail}
              className="px-10 py-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[var(--primary)]/90 dark:hover:bg-[var(--primary)]/80 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 dark:focus:ring-offset-[var(--background)]"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              <Mail
                size={20}
                className="transition-transform group-hover:scale-110"
              />
              <span>Contact via Email</span>
            </motion.button>
          </div>
        </motion.form>
      </motion.div>

      <AnimatePresence>
        {isRedirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-[var(--background)]/80 dark:bg-[var(--background)]/80 backdrop-blur-sm z-20"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--background)] dark:bg-[var(--background)] p-8 rounded-lg shadow-lg border border-[var(--border)] flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full border-4 border-[var(--primary)]/30 border-t-[var(--primary)] animate-spin" />
              <span
                className="text-xl text-[var(--foreground)] font-medium"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                Redirecting to{" "}
                {redirectType === "whatsapp" ? "WhatsApp" : "Email"}...
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
