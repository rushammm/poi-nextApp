'use client';

import Link from 'next/link';
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsOfService() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20
      }
    }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <Link 
        href="/" 
        className="absolute left-8 top-8 text-foreground hover:text-foreground/80 transition-colors"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.div>
      </Link>

      <motion.div 
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-2 text-foreground tracking-tight">
          Terms of Service
        </motion.h1>
        <motion.p variants={itemVariants} className="text-muted-foreground mb-8">
          Last Updated: April 18th, 2025
        </motion.p>

        <div className="space-y-8">
          <section>
            <motion.p variants={itemVariants} className="text-muted-foreground mb-6">
              Welcome to LocatePro. These Terms of Service govern your use of our platform and services. 
              By accessing or using LocatePro, you agree to be bound by these terms.
            </motion.p>
          </section>

          <section>
            <motion.h2 variants={itemVariants} className="text-2xl font-semibold mb-4 text-foreground">
              1. Acceptance of Terms
            </motion.h2>
            <motion.p variants={itemVariants} className="text-muted-foreground">
              By accessing or using LocatePro, you acknowledge that you have read, understood, and agree 
              to comply with these Terms of Service and all applicable laws and regulations.
            </motion.p>
          </section>

          <section>
            <motion.h2 variants={itemVariants} className="text-2xl font-semibold mb-4 text-foreground">
              2. Changes to Terms
            </motion.h2>
            <motion.p variants={itemVariants} className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Changes will be effective immediately 
              upon posting on this page. Your continued use of LocatePro after any modifications indicates 
              your acceptance of the updated terms.
            </motion.p>
          </section>

          <section>
            <motion.h2 variants={itemVariants} className="text-2xl font-semibold mb-4 text-foreground">
              3. Use of the Service
            </motion.h2>
            <motion.p variants={itemVariants} className="text-muted-foreground">
              You agree to use LocatePro only for lawful purposes and in accordance with these Terms. 
              You must not misuse our services or infringe on any intellectual property rights.
            </motion.p>
          </section>

          <section>
            <motion.h2 variants={itemVariants} className="text-2xl font-semibold mb-4 text-foreground">
              5. Intellectual Property
            </motion.h2>
            <motion.p variants={itemVariants} className="text-muted-foreground">
              All content, features, and functionality of LocatePro, including but not limited to text, 
              graphics, logos, and software, are owned by LocatePro or its licensors and protected by 
              intellectual property laws.
            </motion.p>
          </section>

          <section>
            <motion.p variants={itemVariants} className="text-2xl font-semibold mb-4 text-foreground">
              6. Limitation of Liability
            </motion.p>
            <motion.p variants={itemVariants} className="text-muted-foreground">
              LocatePro shall not be liable for any indirect, incidental, special, or consequential damages. 
              Our liability is limited to the amount paid for the service, where applicable.
            </motion.p>
          </section>

          <section>
            <motion.h2 variants={itemVariants} className="text-2xl font-semibold mb-4 text-foreground">
              7. Termination
            </motion.h2>
            <motion.p variants={itemVariants} className="text-muted-foreground">
              We reserve the right to suspend or terminate your access to LocatePro at our sole discretion, 
              without notice, for conduct that we believe violates these Terms or is harmful to other users, 
              us, or third parties.
            </motion.p>
          </section>

          <section>
            <motion.h2 variants={itemVariants} className="text-2xl font-semibold mb-4 text-foreground">
              8. No Warranties
            </motion.h2>
            <motion.p variants={itemVariants} className="text-muted-foreground">
              LocatePro is provided &quot;as is&quot; without any warranties of any kind, either express or implied. 
              We do not guarantee that our services will be uninterrupted, timely, secure, or error-free.
            </motion.p>
          </section>

          <section>
            <motion.h2 variants={itemVariants} className="text-2xl font-semibold mb-4 text-foreground">
              Contact Us
            </motion.h2>
            <motion.div variants={itemVariants} className="text-muted-foreground space-y-2">
              <p className="font-[family-name:var(--font-geist-sans)] font-medium">LocatePro Support Team</p>
              <p>Email: locatepro.pk@gmail.com</p>
              <p>Phone: +92 302 6478867</p>
            </motion.div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
