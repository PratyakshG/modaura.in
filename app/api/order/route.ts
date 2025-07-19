import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
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

    await Order.create({
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
    });

    return NextResponse.json(
      { message: "Order placed successfully" },
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

export async function GET() {
  const session = await auth();

  if (!session || !session.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const res = await Order.find({ userId: session.user?.id });

  console.log(res);
  return NextResponse.json(res, { status: 200 });
}
