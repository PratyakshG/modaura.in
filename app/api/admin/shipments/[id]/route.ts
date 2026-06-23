import { connectDB } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-utils";
import Shipment from "@/models/Shipment";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ShipmentUpdateSchema = z.object({
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
  notes: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { isAdmin } = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const shipment = await Shipment.findById(id).populate(
      "orderId",
      "email amount address",
    );
    if (!shipment) {
      return NextResponse.json(
        { error: "Shipment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ shipment }, { status: 200 });
  } catch (error) {
    console.error("Error fetching shipment:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipment" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { isAdmin } = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const body = await req.json();
    const validatedData = ShipmentUpdateSchema.parse(body);

    const shipment = await Shipment.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!shipment) {
      return NextResponse.json(
        { error: "Shipment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { shipment, message: "Shipment updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Error updating shipment:", error);
    return NextResponse.json(
      { error: "Failed to update shipment" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { isAdmin } = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const shipment = await Shipment.findByIdAndDelete(id);

    if (!shipment) {
      return NextResponse.json(
        { error: "Shipment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Shipment deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting shipment:", error);
    return NextResponse.json(
      { error: "Failed to delete shipment" },
      { status: 500 },
    );
  }
}
