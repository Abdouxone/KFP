//Next.js
import type { Metadata } from "next";
import { Barlow } from "next/font/google";

// Global CSS
import "./globals.css";

// Theme Provider
import { ThemeProvider } from "next-themes";

// CLerk Provider
import { ClerkProvider } from "@clerk/nextjs";

//Toast
import { Toaster } from "sonner";
import ModalProvider from "@/providers/modal-provider";

// // Fonts
// const geistSansFont = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMonoFont = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const BarlowFont = Barlow({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-barlow",
});

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`  ${BarlowFont.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ModalProvider>{children}</ModalProvider>
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
