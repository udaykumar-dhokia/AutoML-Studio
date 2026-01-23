import type { Metadata } from "next";
import { Geist, Geist_Mono, Raleway } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ClientProviders } from "./providers";
import { Analytics } from "@vercel/analytics/next";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoML Studio - Train models with flow",
  description: "Build and deploy ML models quickly and easily.",
  icons: {
    icon: "/favicons/web/icons8-workflow-isometric-line-32.png",
  },
  openGraph: {
    title: "AutoML Studio - Train models with flow",
    description: "Build and deploy ML models quickly and easily.",
    url: "https://automlstudio.vercel.app",
    siteName: "AutoML Studio - Train models with flow",
    images: [
      {
        url: "https://automlstudio.vercel.app/banner.png",
        width: 1200,
        height: 630,
        alt: "AutoML Studio - Train models with flow",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoML Studio - Train models with flow",
    description: "Build and deploy ML models quickly and easily.",
    images: ["https://automlstudio.vercel.app/banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${raleway.variable} ${geistSans.variable} ${geistMono.variable} antialiased dark bg-radial from-primary/20 dark:via-black dark:to-black`}
      >
        {/* <ThemeProvider defaultTheme="system" attribute="class" enableSystem> */}

        <ClientProviders>
          {children}
          <Analytics />
        </ClientProviders>
        <Toaster />
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
