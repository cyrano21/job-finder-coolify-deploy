import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import EnhancedNavigation from "./components/EnhancedNavigation";
import "./globals.css";
import "./globals-enhanced.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Finder - Votre assistant intelligent pour l'emploi",
  description: "Générateur de CV, lettres de motivation et recherche d'emploi avec IA",
};

import { CVsProvider } from './modules/cv/utils/cvs-context'
import { CoverLettersProvider } from './modules/lettre/utils/cover-letters-context'
import { UserProvider } from './modules/user-context'

import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`} suppressHydrationWarning>
          <UserProvider>
            <CVsProvider>
              <CoverLettersProvider>
                <EnhancedNavigation />
                {children}
              </CoverLettersProvider>
            </CVsProvider>
          </UserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
