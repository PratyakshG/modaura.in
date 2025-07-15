"use client";

import Hero from "@/components/layout/Hero";
import HomePageSection from "@/components/layout/HomePageSections";
import Latest from "@/components/layout/Latest";
import Popular from "@/components/layout/Popular";
import { homePageSections } from "@/constants/data";
import { useEffect } from "react";
import useCartStore from "./stores/useCartStore";
import useProductStore from "./stores/useProductStore";

const Home = () => {
  const { setProducts, setLoading } = useProductStore();
  const { setCart } = useCartStore();

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
    async function getCartItems() {
      const res = await fetch("/api/cart");
      const data = await res.json();
      console.log(data.cartItems);
      setCart([...data.cartItems]);
    }
    getCartItems();
  }, [setCart]);

  return (
    <>
      <Hero />
      <Popular />
      <Latest />

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
