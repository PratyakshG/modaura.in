import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AmountStateTypes {
  subTotal: number;
  discount: number;
  totalAmount: number;

  setSubTotal: (value: number) => void;
  setDiscount: (value: number) => void;
  setTotalAmount: (value: number) => void;
}

const useAmountStore = create(
  persist<AmountStateTypes>(
    (set) => ({
      subTotal: 0,
      discount: 0,
      totalAmount: 0,

      setSubTotal: (value) => set({ subTotal: value }),

      setDiscount: (value) => set({ discount: value }),

      setTotalAmount: (value) => set({ totalAmount: value }),
    }),
    { name: "modauraCartPrice" }
  )
);

export default useAmountStore;
