import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Dynamically import client components
import dynamic from "next/dynamic";

// Import header and footer with dynamic imports to avoid server component issues
const Header = dynamic(() => import("@/components/layout/header"), { ssr: true });
const Footer = dynamic(() => import("@/components/layout/footer"), { ssr: true });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LocatePro - Business Location Intelligence",
  description:
    "Find the optimal location for your business with data-driven insights and advanced geospatial analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
