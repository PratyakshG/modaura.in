import useCartStore from "@/app/stores/useCartStore";
import { auth } from "@/auth"; // Auth.js v5 auth method
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  console.log("cart :", useCartStore.getState().cart);
  const { cartItems } = await req.json();
  await connectDB();

  await User.findOneAndUpdate(
    { email: session.user.email },
    { cartItems: cartItems },
  );

  return NextResponse.json(cartItems);
}

export async function GET() {
  const session = await auth();
  if (!session || !session.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const user = await User.findOne({ email: session.user.email });

  return NextResponse.json({ cartItems: user?.cartItems || [] });
}
