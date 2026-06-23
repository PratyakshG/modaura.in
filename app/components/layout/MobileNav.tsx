"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/ui/drawer";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

import logo from "@/public/logo-color.svg";
import Image from "next/image";
import { useState } from "react";
import { IoIosMenu } from "react-icons/io";

import useCartStore from "@/app/stores/useCartStore";

import { homePageSections } from "@/constants/data";
import { logout } from "@/lib/actions";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { LogOut, ShoppingBag, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsHandbagFill } from "react-icons/bs";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { VscAccount } from "react-icons/vsc";
import { toast } from "sonner";
import { Separator } from "../ui/separator";

const MobileNav = () => {
  const { cart } = useCartStore();
  const [open, setOpen] = useState(false);
  const session = useSession();
  const router = useRouter();

  const ScrollIntoView = (id: string) => {
    if (typeof window === "undefined") return; // SSR safety
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <nav className="block lg:hidden sticky top-0 z-10 bg-ivory">
      <div className="flex justify-between items-center px-4 py-4">
        <div className="w-1/3 relative flex items-center justify-start">
          <Drawer
            direction="left"
            open={open}
            onOpenChange={setOpen}
          >
            <DrawerTrigger>
              <IoIosMenu className="size-5 text-darkTeal" />
            </DrawerTrigger>
            <DrawerContent className="bg-darkTeal text-ivory">
              <DrawerClose className="flex items-end justify-end pt-5 pr-5">
                <IoClose size={24} />
              </DrawerClose>
              <DrawerHeader className="font-urbanist gap-2 *:text-lg *:font-normal *:text-ivory">
                <Accordion
                  type="single"
                  collapsible
                >
                  <AccordionItem
                    value="item-1"
                    className="px-0"
                  >
                    <AccordionTrigger className="text-lg py-0 font-normal *:stroke-ivory justify-start items-center *:translate-0 gap-1">
                      Categories
                    </AccordionTrigger>

                    {homePageSections.map((category, _) => (
                      <AccordionContent
                        key={_}
                        className="py-1 pl-3"
                        onClick={() => setOpen(false)}
                      >
                        <Link
                          href={`/productByCategory/${category.section}`}
                          className="text-lg"
                        >
                          {category.section}s
                        </Link>
                      </AccordionContent>
                    ))}
                  </AccordionItem>
                </Accordion>

                <Separator />

                <DrawerTitle
                  onClick={() => {
                    setOpen(false);
                    ScrollIntoView("popular-section");
                  }}
                >
                  Popular
                </DrawerTitle>
                <DrawerDescription className="hidden" />

                <Separator />

                <DrawerTitle
                  onClick={() => {
                    setOpen(false);
                    ScrollIntoView("latest-section");
                  }}
                >
                  Latest
                </DrawerTitle>
                <DrawerDescription className="hidden" />

                <Separator />
              </DrawerHeader>
              <DrawerFooter>
                <ul className="flex **:size-5 gap-3 **:stroke-1 **:fill-ivory">
                  <Link
                    href="https://www.instagram.com/_modaura.in/"
                    target="_blank"
                  >
                    <FaInstagram />
                  </Link>

                  <Link
                    href="https://www.facebook.com/people/ModAura/61574557487011/?ref=pl_edit_xav_ig_profile_page_web#"
                    target="_blank"
                  >
                    <FaFacebook />
                  </Link>
                </ul>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        <div className="w-1/3 flex items-center justify-center">
          <Link href="/">
            <Image
              src={logo}
              alt="logo"
              className="h-full"
            />
          </Link>
        </div>

        <div className="w-1/3 flex items-center justify-end">
          <ul className="flex gap-4 text-black-1 items-center justify-center *:cursor-pointer">
            <li className="relative">
              <Link href="/cart">
                <BsHandbagFill
                  size={22}
                  className="text-darkTeal"
                />
              </Link>
              <span className="absolute -top-1.5 -right-1.5 text-[10px] leading-2.5 bg-roseGold rounded-full p-1 text-ivory">
                {cart.length}
              </span>
            </li>
            <li>
              {session.data?.user ? (
                <div className="font-dmSans flex items-center justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex gap-1 items-center">
                      {session.data?.user.image && (
                        <Image
                          src={session.data.user.image}
                          alt="user-image"
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      )}
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User /> Profile
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link href="/orders">
                          <ShoppingBag /> Orders
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          logout();
                          toast.success("You have been logged out");
                          router.refresh();
                        }}
                      >
                        <LogOut /> Sign Out
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

export default MobileNav;
