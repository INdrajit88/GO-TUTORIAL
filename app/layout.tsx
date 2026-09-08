import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import { Hero } from "@/components/Hero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TableOfContents } from "@/components/TableOfContents";
import { ThemeProvider } from "@/components/theme-provider";
import { TutorialProgressBar } from "@/components/TutorialProgressBar";
import { contents, site } from "@/content/tutorialData";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Resolves the canonical URL in production. Automatically detects Vercel system
 * environment variables (VERCEL_PROJECT_PRODUCTION_URL or VERCEL_URL) if
 * NEXT_PUBLIC_SITE_URL is not manually configured.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: `%s — ${site.brand}`,
  },
  description: site.description,
  applicationName: site.brand,
  keywords: [
    "Keploy",
    "Go",
    "Golang",
    "Echo",
    "PostgreSQL",
    "Docker Compose",
    "API testing",
    "test generation",
    "mocks",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "article",
    locale: "en_US",
    url: "/",
    siteName: site.brand,
    title: site.title,
    description: site.description,
    images: [
      {
        url: "/screenshots/08-keploy-flow.webp",
        width: 1184,
        height: 1328,
        alt: "Keploy Record and Replay Architecture Workflow",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/screenshots/08-keploy-flow.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#141414" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      // next-themes sets the class and the color-scheme on <html> before
      // hydration, so React has to be told not to flag that as a mismatch.
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground min-h-dvh">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="focus:not-sr-only focus:bg-card focus:text-foreground sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:border focus:border-border focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
          >
            Skip to content
          </a>

          <SiteHeader />
          <Hero />

          <main id="main" className="container-page py-12 lg:py-16">
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12">
              <div className="min-w-0">
                <TutorialProgressBar />
                <TableOfContents items={contents} variant="inline" />
                {children}
              </div>

              <TableOfContents items={contents} variant="sidebar" />
            </div>
          </main>

          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
