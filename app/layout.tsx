import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { DM_Sans, Urbanist } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { Toaster } from "sonner";
import Announcements from "./components/layout/Announcements";
import Footer from "./components/layout/Footer";
import MobileNav from "./components/layout/MobileNav";
import Navbar from "./components/layout/Navbar";
import Providers from "./components/Providers";
import "./globals.css";
import { fetchAllProducts } from "@/lib/helper";

const urbanist = Urbanist({
  variable: "--font-urbanist",
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
  title: "Modaura | Anti-Tarnished Artificial Jewellery - Shop Now",
  description:
    "Shop for the latest collection of anti-tarnished artificial jewelry at MODAURA. Premium, elegant and affordable designs, for everyday and office.",
  keywords: [
    "jewelry",
    "anti-tarnished",
    "anti-tarnished jewelry",
    "artificial jewelry",
    "trending jewelry",
    "fashion jewelry",
    "online store",
    "earrings",
    "necklaces",
    "bracelets",
    "rings",
  ],
  alternates: {
    canonical: "https://www.modaura.in",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allProducts = await fetchAllProducts();

  return (
    <html lang="en">
      <body
        className={`${satoshi.variable} ${urbanist.variable} ${melodrama.variable} ${dmSans.variable} bg-ivory antialiased relative flex flex-col items-center w-screen min-h-dvh`}
      >
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <Providers products={allProducts}>
          <Announcements />
          <Navbar />
          <MobileNav />
          <main className="font-dmSans min-h-fit w-screen flex flex-col space-y-10 lg:space-y-16 px-5 lg:px-10 items-start justify-start">
            {children}
          </main>
          <Footer />
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
