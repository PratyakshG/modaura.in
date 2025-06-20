import type { Metadata } from "next";
import { Geist, Geist_Mono, Urbanist, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const satoshi = localFont({
  src: "../public/fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
});

const melodrama = localFont({
  src: "../public/fonts/Melodrama-Variable.ttf",
  variable: "--font-melodrama",
});

export const metadata: Metadata = {
  title: "Modaura - Artificial Jewelry",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${satoshi.variable} ${urbanist.variable} ${melodrama.variable} ${dmSans.variable} bg-ivory antialiased relative`}
      >
        <Navbar />
        <main className="font-dmSans min-h-screen w-screen overflow-hidden flex flex-col space-y-10 lg:space-y-16 px-5 lg:px-10 items-start justify-start">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
