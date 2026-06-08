import { connectDB } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-utils";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { isAdmin } = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const query: Record<string, unknown> = {};
    if (status) query.paymentStatus = status;

    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    const total = await Order.countDocuments(query);

    return NextResponse.json(
      {
        orders,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
