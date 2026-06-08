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
  addresses?: [Address];
}

export interface Address {
  name: string;
  phone_number: string;
  pincode: string;
  street: string;
  city: string;
  state: string;
  locality?: string;
  landmark?: string;
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

export interface shipmentTypes {
  _id?: ObjectId;
  orderId: ObjectId;
  trackingNumber: string;
  carrier:
    | "FedEx"
    | "UPS"
    | "DHL"
    | "India Post"
    | "Flipkart Logistics"
    | "Delhivery";
  status:
    | "pending"
    | "shipped"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
