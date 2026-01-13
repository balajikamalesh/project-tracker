import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import { cn } from "@/lib/utils";
import QueryProvider from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";


const inter = Inter({
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Trackly  |  Dashboard",
  description: "A project management tool to track your tasks efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(inter.className, "antialiased min-h-screen" )}
      >
        <NextTopLoader height={2} showSpinner={false} />
        <QueryProvider>
          <Toaster />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
