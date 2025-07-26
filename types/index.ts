import mongoose from "mongoose";

export interface UserTypes {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;

  cartItems: [CartItems];
}

export interface productTypes {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  description: string;
  details: string;
  price: {
    mrp: number;
    sellingPrice: number;
  };
  images: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItems {
  _id: mongoose.Types.ObjectId;
  quantity: number;
}

export interface orderTypes {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  items: [CartItems & productTypes];
  amount: number;
  paymentMode: "COD" | "Pre-paid";
  paymentStatus: "pending" | "completed" | "failed";
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  address: {
    name: string;
    phone_number: string;
    pincode: string;
    street: string;
    city: string;
    state: string;
    locality?: string;
    landmark?: string;
  };
}
