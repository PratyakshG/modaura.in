"use client";

import React from "react";
import Announcements from "./Announcements";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <Announcements />
      <Navbar />
      <MobileNav />
    </>
  );
};

export default Header;
