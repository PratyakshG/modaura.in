/* eslint-disable @typescript-eslint/no-explicit-any */

import { productTypes } from "@/types/index";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductStateTypes {
  products: Array<productTypes>;
  setProducts: (items: Array<productTypes>) => void;
  addProduct: (product: productTypes) => void;
  removeProduct: (productId: string) => void;
  clearProducts: () => void;
  loading: boolean;
  setLoading: (status: boolean) => void;
}

const useProductStore = create<ProductStateTypes>()(
  persist(
    (set) => ({
      products: [],
      loading: true,

      setLoading: (status) => set({ loading: status }),

      // Set all products at once
      setProducts: (items) => set({ products: items }),

      // Add a single product
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, product],
        })),

      // Remove a product by ID
      removeProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((item: any) => item.id !== productId),
        })),

      // Clear all products
      clearProducts: () => set({ products: [] }),
    }),
    {
      name: "productStore",
    }
  )
);

export default useProductStore;
