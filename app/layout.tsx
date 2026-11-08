import type { Metadata } from "next";
// next/font/google requires network access; using local font variable instead
// import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProviders from "@/providers/QueryClient";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "sonner";

// Font loaded via globals.css @import at runtime; variable kept for Tailwind compatibility
const inter = { variable: "--font-sans" };

export const metadata: Metadata = {
  title: "KeySpace",
  description: "Find & List Rental Properties with Ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Navbar />
          <QueryProviders>
            {children}
            <Toaster position="top-right" />
          </QueryProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
