import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Loading from "./loading";

const Header = dynamic(() => import("@/components/layout/header"), {
  loading: () => <div className="h-16 bg-white shadow-sm" /> // Placeholder for header
});

const Footer = dynamic(() => import("@/components/layout/footer"), {
  loading: () => <div className="h-16 bg-gray-50" /> // Placeholder for footer
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LocatePro - Business Location Intelligence",
  description: "Find the optimal location for your business with data-driven insights and advanced geospatial analytics",
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
          <Suspense fallback={<Loading />}>
            <main className="flex-grow">{children}</main>
          </Suspense>
          <Footer />
        </div>
      </body>
    </html>
  );
}
