import { create } from "zustand";
// import { persist } from "zustand/middleware";

type AmountStateTypes = {
  subTotal: number;
  discount: number;
  totalAmount: number;
  paymentSuccess: boolean;

  setSubTotal: (value: number) => void;
  setDiscount: (value: number) => void;
  setTotalAmount: (value: number) => void;
  setPaymentSuccess: (value: boolean) => void;

  promoCode: string;
  setPromoCode: (value: string) => void;

  promoDiscount: number;
  setPromoDiscount: (value: number) => void;

  additionalDiscount: number;
  setAdditionalDiscount: (value: number) => void;
};

const useAmountStore = create<AmountStateTypes>()((set) => ({
  subTotal: 0,
  setSubTotal: (value) => set({ subTotal: value }),

  discount: 0,
  setDiscount: (value) => set({ discount: value }),

  totalAmount: 0,
  setTotalAmount: (value) => set({ totalAmount: value }),

  paymentSuccess: false,
  setPaymentSuccess: (value) => set({ paymentSuccess: value }),

  promoCode: "",
  setPromoCode: (value) => set({ promoCode: value }),

  promoDiscount: 0,
  setPromoDiscount: (value) => set({ promoDiscount: value }),

  additionalDiscount: 0,
  setAdditionalDiscount: (value) => set({ additionalDiscount: value }),
}));

export default useAmountStore;
