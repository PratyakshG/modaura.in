// these are the providers we'll need when we setup the file upload from client-side

"use client";

import { productTypes } from "@/types/index";
import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import useProductStore from "../stores/useProductStore";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
// const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

export default function Providers({
  children,
  products,
}: {
  children: React.ReactNode;
  products: productTypes[];
}) {
  //   const authenticator = async () => {
  //     try {
  //       //configured url for imagekit authentication
  //       const response = await fetch("/api/imagekit-auth");

  //       if (!response.ok) {
  //         const errorText = await response.text();
  //         throw new Error(
  //           `Request failed with status ${response.status}: ${errorText}`
  //         );
  //       }

  //       const data = await response.json();
  //       const { signature, expire, token } = data;
  //       return { signature, expire, token };
  //     } catch (error) {
  //       console.log(error);
  //       throw new Error("Imagekit Authentication request failed");
  //     }
  //   };

  const { setProducts, setLoading } = useProductStore();

  useEffect(() => {
    setProducts(products);
    setLoading(false);
  }, [products, setProducts, setLoading]);

  return (
    <SessionProvider>
      <ImageKitProvider
        urlEndpoint={urlEndpoint}
        // publicKey={publicKey}
        // authenticator={authenticator}
      >
        {children}
      </ImageKitProvider>
    </SessionProvider>
  );
}
