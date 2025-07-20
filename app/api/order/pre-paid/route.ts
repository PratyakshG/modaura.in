import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const {
      userId,
      createdAt,
      items,
      amount,
      address: {
        name,
        phone_number,
        pincode,
        street,
        city,
        state,
        locality,
        landmark,
      },
    } = await request.json();

    if (
      !userId ||
      !createdAt ||
      !items ||
      !amount ||
      !name ||
      !phone_number ||
      !pincode ||
      !street ||
      !city ||
      !state
    ) {
      return NextResponse.json(
        { error: "All fields are required to place an order" },
        { status: 400 }
      );
    }

    await connectDB();

    //create razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.ceil(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // add razorpay details to order schema
    const newOrder = await Order.create({
      userId,
      razorpayOrderID: razorpayOrder.id,
      createdAt,
      items,
      amount,
      paymentMode: "Pre-paid",
      paymentStatus: "pending",
      address: {
        name,
        phone_number,
        pincode,
        street,
        city,
        state,
        locality,
        landmark,
      },
    });

    return NextResponse.json(
      {
        orderId: newOrder._id,
        orderAmount: amount,
        message: "Order placed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order Unsuccesful", error);
    return NextResponse.json(
      { error: "Failed to order products" },
      { status: 400 }
    );
  }
}
