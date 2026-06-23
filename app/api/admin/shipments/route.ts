import { connectDB } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-utils";
import Shipment from "@/models/Shipment";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ShipmentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  trackingNumber: z.string().min(1, "Tracking number is required"),
  carrier: z.enum([
    "FedEx",
    "UPS",
    "DHL",
    "India Post",
    "Flipkart Logistics",
    "Delhivery",
  ]),
  status: z
    .enum([
      "pending",
      "shipped",
      "in_transit",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ])
    .optional(),
  estimatedDeliveryDate: z.string().datetime().optional(),
  actualDeliveryDate: z.string().datetime().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    country: z.string().optional(),
  }),
  notes: z.string().optional(),
});

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
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const shipments = await Shipment.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("orderId", "email amount");

    const total = await Shipment.countDocuments(query);

    return NextResponse.json(
      {
        shipments,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching shipments:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipments" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { isAdmin } = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const validatedData = ShipmentSchema.parse(body);

    const existingShipment = await Shipment.findOne({
      trackingNumber: validatedData.trackingNumber,
    });
    if (existingShipment) {
      return NextResponse.json(
        { error: "Shipment with this tracking number already exists" },
        { status: 409 },
      );
    }

    const newShipment = await Shipment.create(validatedData);

    return NextResponse.json(
      { shipment: newShipment, message: "Shipment created successfully" },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Error creating shipment:", error);
    return NextResponse.json(
      { error: "Failed to create shipment" },
      { status: 500 },
    );
  }
}
