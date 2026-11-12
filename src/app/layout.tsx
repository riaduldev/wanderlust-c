import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";

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
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
