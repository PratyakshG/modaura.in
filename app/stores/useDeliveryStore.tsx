import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DeliveryStateTypes {
  pincode: string;
  paymentMethod: string;
  deliveryCharge: number;

  setPincode: (value: string) => void;
  setDeliveryCharge: (value: number) => void;
  setPaymentMethod: (value: string) => void;
}

const useDeliveryStore = create(
  persist<DeliveryStateTypes>(
    (set) => ({
      pincode: "",
      deliveryCharge: 0,
      paymentMethod: "COD",

      setPincode: (value) => set({ pincode: value }),

      setDeliveryCharge: (value) => set({ deliveryCharge: value }),
      setPaymentMethod: (value) => set({ paymentMethod: value }),
    }),
    { name: "deliveryStorage" }
  )
);

export default useDeliveryStore;
