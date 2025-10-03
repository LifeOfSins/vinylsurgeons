import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Softball Training in Pittsburgh, PA!",
  description: "Improve your game with private softball lessons in Pittsburgh. Hitting, fielding & skill development from a former collegiate player. Book today!",
  keywords: ['softball lessons Pittsburgh', 'private softball coach Pittsburgh', 'softball hitting lessons Pittsburgh', 'youth softball training Pittsburgh PA'],
  icons: {
    icon: '/logo.png',
  },
  other: {
    'apple-mobile-web-app-title': 'DeGori Proformance',
  },

  openGraph: {
    title: "DeGori Proformance - Personal Softball Training",
  description: "Improve your game with private softball lessons in Pittsburgh. Hitting, fielding & skill development from a former collegiate player. Book today!",
    url: 'https://degoriproformance.com',
    siteName: 'DeGori Proformance',
    images: [
      {
        url: 'https://degoriproformance.com/logo.png', // Must be an absolute URL
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body className={cn('text-base antialiased isolate bg-background', inter.className)}>{children}</body>
    </html>
  );
}
