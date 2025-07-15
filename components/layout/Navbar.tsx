"use client";

import useCartStore from "@/app/stores/useCartStore";
import logo from "@/public/logo-color.svg";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";

import { logout } from "@/lib/actions";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { homePageSections } from "@/constants/data";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { LuShoppingBag } from "react-icons/lu";

const Navbar = () => {
  const { cart } = useCartStore();
  const session = useSession();
  const router = useRouter();

  const ScrollIntoView = (id: string) => {
    window.scrollTo({
      top: document.getElementById(id)!.offsetTop - 100,
      behavior: "smooth",
    });
  };

  return (
    <nav className="hidden lg:block sticky top-0 z-10">
      {/* Announcements */}

      <div className="h-[10dvh] flex justify-center items-center px-10 py-3 sticky top-0 z-10 bg-ivory font-urbanist">
        <div className="w-1/3">
          <ul className="flex space-x-5 text-black-1 text-sm uppercase *:hover:text-darkTeal tracking-wide">
            <li className="relative cursor-pointer">
              <span className="flex items-center space-x-1 peer">
                <p>categories</p>
                <IoIosArrowDown />
              </span>

              <div className="absolute top-6 bg-ivory border px-4 py-6 rounded-lg opacity-0 hover:opacity-100 peer-hover:opacity-100 invisible hover:visible peer-hover:visible transition-all duration-300 ease-in-out shadow-xl">
                <ul className="space-y-2 cursor-auto *:cursor-pointer text-black-1 *:hover:text-darkTeal *:tracking-wide">
                  {homePageSections.map((item, _) => (
                    <li onClick={() => ScrollIntoView(item.sectionId)} key={_}>
                      {item.section}s
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li
              className="cursor-pointer"
              onClick={() => ScrollIntoView("popular-section")}
            >
              popular
            </li>

            <li
              className="cursor-pointer"
              onClick={() => ScrollIntoView("latest-section")}
            >
              latest
            </li>
          </ul>
        </div>

        {/* Logo */}
        <div className="w-1/3 flex items-center justify-center">
          <Link href="/">
            <Image src={logo} alt="logo" className="h-7" />
          </Link>
        </div>

        <div className="w-1/3 flex items-center justify-end">
          <ul className="flex gap-6 text-black-1 items-center justify-center *:cursor-pointer">
            <li className="relative">
              <Link href="/cart">
                <LuShoppingBag className="size-auto lg:size-6 stroke-darkTeal" />
              </Link>
              <div className="absolute -top-2 -right-2 size-5 flex items-center justify-center bg-roseGold rounded-full p-1 shadow-md">
                <span className="text-[12px] text-ivory">{cart.length}</span>
              </div>
            </li>

            {/* 
              check for the current user from session in next-auth, if user is logged in, redirect to user profile else redirect to sign-in page
            */}
            <li>
              {session.data?.user ? (
                <div className="font-dmSans flex items-center justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex gap-2 items-center font-satoshi">
                      {session.data?.user.image && (
                        <Image
                          src={session.data.user.image}
                          alt="user-image"
                          width={25}
                          height={25}
                          className="rounded-full"
                        />
                      )}
                      {session.data.user.name}
                      <IoIosArrowDown />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          logout();
                          router.refresh();
                        }}
                      >
                        Sign Out
                      </DropdownMenuItem>
                      <DropdownMenuArrow />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link href="/login">
                  <VscAccount className="size-6 fill-darkTeal" />
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
