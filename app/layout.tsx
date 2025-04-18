import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider } from "next-themes";
import ThemeSwitcher from "./components/ThemeSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LocatePro – AI-Powered Business Location Analytics",
  description:
    "LocatePro helps businesses find optimal expansion locations using AI-powered analytics, interactive maps, and real-time insights.",
  applicationName: "LocatePro",
  keywords: [
    "business analytics",
    "location intelligence",
    "AI",
    "maps",
    "expansion",
    "data visualization",
    "insights",
    "LocatePro",
  ],
  authors: [{ name: "LocatePro Team", url: "https://locatepro.ai" }],
  creator: "LocatePro",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
    { rel: "manifest", url: "/site.webmanifest" },
  ],
  openGraph: {
    title: "LocatePro – AI-Powered Business Location Analytics",
    description:
      "Discover the best places to grow your business with LocatePro's interactive analytics and location intelligence.",
    url: "https://locatepro.ai",
    siteName: "LocatePro",
    // images: [
    //   {
    //     url: "/og-image.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "LocatePro – AI-Powered Business Location Analytics",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LocatePro – AI-Powered Business Location Analytics",
    description:
      "Find optimal business locations with AI-driven analytics and interactive maps.",
    creator: "@locatepro",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="apple-mobile-web-app-title" content="Locatepro" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
          <Footer />
          <ThemeSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}
