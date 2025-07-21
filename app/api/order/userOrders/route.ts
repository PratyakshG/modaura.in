import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const userOrders = await Order.find({
      userId: session.user?.id,
    }).sort({ createdAt: -1 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredOrders = userOrders.filter((order: any) => {
      if (order.paymentMode === "Pre-paid") {
        return order.paymentStatus === "completed";
      } else if (order.paymentMode === "COD") {
        return (
          order.paymentStatus === "completed" ||
          order.paymentStatus === "pending"
        );
      }
      return false; // exclude anything else
    });

    console.log(filteredOrders);
    return NextResponse.json(filteredOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
