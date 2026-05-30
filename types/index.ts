import { ObjectId } from "mongoose";

export interface UserTypes {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  cartItems: [CartItems];
  isAdmin?: boolean;
}

export interface productTypes {
  _id: ObjectId;
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
  _id: ObjectId;
  quantity: number;
}

export interface orderTypes {
  _id: ObjectId;
  userId: ObjectId;
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
