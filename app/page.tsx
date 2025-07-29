"use client";

import Hero from "@/components/layout/Hero";
import HomePageSection from "@/components/layout/HomePageSections";
import Latest from "@/components/layout/Latest";
import Popular from "@/components/layout/Popular";
import { homePageSections } from "@/constants/data";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";
import tarnishBanner from "../public/images/tarnish-banner.jpg";
import useCartStore from "./stores/useCartStore";
import useProductStore from "./stores/useProductStore";

const Home = () => {
  const { setProducts, setLoading } = useProductStore();
  const { setCart } = useCartStore();
  const session = useSession();

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch(`/api/products?all=true`);
      const data = await res.json();
      setProducts(data);
    }

    fetchProducts();

    setLoading(false);
  }, [setProducts, setLoading]);

  //function to fetch cart items
  useEffect(() => {
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

  return (
    <>
      <Hero />
      <Popular />
      <Latest />
      <Image
        src={tarnishBanner}
        alt=""
        width={1440}
        height={300}
        loading="lazy"
        className="w-full rounded-md lg:rounded-xl shadow-md"
      />

      {homePageSections.map((item, index) => (
        <HomePageSection
          key={index}
          section={item.section}
          sectionId={item.sectionId}
        />
      ))}
    </>
  );
};

export default Home;
