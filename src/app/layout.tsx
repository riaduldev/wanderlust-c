import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toast";

const JosefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-josefin-sans",
});

export const metadata: Metadata = {
  title: "Wanderlast — Discover Your Next Adventure",
  description:
    "Explore breathtaking destinations and create unforgettable memories with our curated travel experiences.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${JosefinSans.variable} h-full antialiased`}>
      <body
        className="flex min-h-full flex-col font-sans"
        suppressHydrationWarning
      >
        <Navbar />

        <main className="flex-1">{children}</main>

        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
