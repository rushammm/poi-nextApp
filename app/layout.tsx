import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LocatePro",
  description:
    "Finding optimal locations for business expansion.",
  keywords: [
    "POI",
    "Locations",
    "portfolio",
    "web design",
    "interactive design",
    "creative portfolio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          min-h-screen
          bg-background
          text-foreground
          selection:bg-rose-200
          selection:text-rose-900
        `}
      >
        <div className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute" />
        {children}
      </body>
    </html>
  );
}
