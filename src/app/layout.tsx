//Next.js
import type { Metadata } from "next";
import { Geist, Geist_Mono, Barlow } from "next/font/google";

// Global CSS
import "./globals.css";

// Theme Provider
import { ThemeProvider } from "next-themes";

// Fonts
const geistSansFont = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMonoFont = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BarlowFont = Barlow({
  subsets: ["latin"],
  weight: ['500','700'],
  variable: "--font-barlow"
})


//MetaDATA
export const metadata: Metadata = {
  title: "KFP WEBSITE",
  description: "Welcome to KFP ditrubution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSansFont.variable} ${geistMonoFont.variable} ${BarlowFont.variable} antialiased`}>
          <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          >
          {children}
         </ThemeProvider>
      </body>
    </html>
  );
}
