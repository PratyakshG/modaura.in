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
