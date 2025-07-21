import { CartItems } from "@/types/index";
import mongoose, { Schema } from "mongoose";
import { orderTypes } from "../types/index";

const OrderSchema = new Schema<orderTypes>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: {
    type: String,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  items: Array<CartItems>,
  amount: Number,
  paymentMode: {
    type: String,
    required: true,
    enum: ["COD", "Pre-paid"],
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  razorpayOrderId: { type: String, required: false },
  razorpayPaymentId: { type: String, required: false },
  address: {
    name: String,
    phone_number: String,
    pincode: String,
    street: String,
    city: String,
    state: String,
    locality: { type: String, required: false },
    landmark: { type: String, required: false },
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
