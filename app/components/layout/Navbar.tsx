"use client";

import useCartStore from "@/app/stores/useCartStore";
import logo from "@/public/logo-color.svg";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";

import { logout } from "@/lib/actions";

import { homePageSections } from "@/constants/data";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { LogOut, ShoppingBag, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { LuShoppingBag } from "react-icons/lu";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

const Navbar = () => {
  const { cart, setCart } = useCartStore();
  const session = useSession();
  const router = useRouter();

  useLayoutEffect(() => {
    if (!session.data?.user) return;

    async function getCartItems() {
      const res = await fetch("/api/cart");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await res.json();
      console.log("cart", data.cartItems);
      setCart([...data.cartItems]);
    }

    getCartItems();
  }, [setCart, session]);

  const ScrollIntoView = (id: string) => {
    window.scrollTo({
      top: document.getElementById(id)!.offsetTop - 100,
      behavior: "smooth",
    });
  };

  return (
    <nav className="hidden lg:block sticky top-0 z-10 w-full">
      {/* Announcements */}

      <div className="h-[10dvh] w-full flex justify-between items-center px-10 py-3 sticky top-0 z-10 bg-ivory font-satoshi">
        <div className="w-1/3">
          <ul className="flex space-x-5 text-black-1 text-sm uppercase *:hover:text-darkTeal tracking-wide">
            <li className="relative cursor-pointer">
              <span className="flex items-center space-x-1 peer">
                <p>categories</p>
                <IoIosArrowDown />
              </span>

              <div className="absolute top-6 bg-ivory border py-6 rounded-lg opacity-0 hover:opacity-100 peer-hover:opacity-100 invisible hover:visible peer-hover:visible transition-all duration-300 ease-in-out shadow-xl w-[120px]">
                <ul className="space-y-3 cursor-auto *:cursor-pointer text-black-1 *:hover:text-darkTeal *:hover:font-semibold *:tracking-wide">
                  {homePageSections.map((item, _) => (
                    <li
                      key={_}
                      className="px-4 transition-all"
                    >
                      <Link href={`/productByCategory/${item.section}`}>
                        {item.section}s
                      </Link>
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
            <Image
              src={logo}
              alt="logo"
              className="h-7 max-w-fit"
            />
          </Link>
        </div>

        <div className="w-1/3 flex items-center justify-end">
          <ul className="flex gap-6 text-black-1 items-center justify-center *:cursor-pointer">
            <li className="relative">
              <Link href="/cart">
                <LuShoppingBag className="size-auto lg:size-6 stroke-darkTeal" />
                <div className="absolute -top-2 -right-2 size-5 flex items-center justify-center bg-roseGold rounded-full p-1 shadow-md">
                  <span className="text-[12px] text-ivory">{cart.length}</span>
                </div>
              </Link>
            </li>

            {/* check for the current user from session in next-auth, if user is logged in, redirect to user profile else redirect to sign-in page */}
            <li>
              {session.data?.user ? (
                <div className="font-dmSans flex items-center justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex gap-2 items-center font-satoshi capitalize">
                      {session.data?.user.image && (
                        <Image
                          src={session.data.user.image}
                          alt="user-image"
                          width={25}
                          height={25}
                          className="rounded-full"
                        />
                      )}
                      {session.data.user.name?.split(" ")[0]}
                      <IoIosArrowDown />
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
                        asChild
                        variant="destructive"
                      >
                        <button
                          className="w-full"
                          onClick={() => {
                            logout();
                            toast.success("You have been logged out");
                            router.refresh();
                            // router.push("/login");
                            // signOut().then(() => {});
                          }}
                        >
                          <LogOut /> Sign Out
                        </button>
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
