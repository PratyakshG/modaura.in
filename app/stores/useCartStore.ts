import { CartItems, productTypes } from "@/types/index";
import mongoose from "mongoose";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStateTypes {
  cart: Array<CartItems & productTypes>;
  setCart: (cartItems: Array<CartItems & productTypes>) => void;
  addToCart: (_id: mongoose.Types.ObjectId) => void;
  removeFromCart: (productId: mongoose.Types.ObjectId) => void;
  updateQuantity: (
    productId: mongoose.Types.ObjectId,
    quantity: number
  ) => void;
  clearCart: () => void;
}

const getProduct = async (_id: mongoose.Types.ObjectId) => {
  try {
    const res = await fetch(`/api/products?id=${_id}`);
    if (!res.ok) throw new Error("Failed to fetch product");
    const product = await res.json();
    return product;
  } catch (err) {
    console.error("getProduct error:", err);
    return null;
  }
};

const useCartStore = create(
  persist<CartStateTypes>(
    (set) => ({
      cart: [],

      setCart: (items) => set({ cart: [...items] }),

      addToCart: (_id) => {
        getProduct(_id).then((product) => {
          set((state) => {
            const exists = state.cart.find((item) => item._id === product._id);
            if (exists) {
              return {
                cart: state.cart.map((item) =>
                  item._id === product?._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ),
              };
            } else {
              return { cart: [...state.cart, { ...product, quantity: 1 }] };
            }
          });
        });
      },

      removeFromCart: (_id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== _id),
        })),

      updateQuantity: (_id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === _id ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    { name: "cartStorage" }
  )
);

export default useCartStore;
