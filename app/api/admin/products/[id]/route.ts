import { connectDB } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-utils";
import Products from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required").optional(),
  category: z.string().min(1, "Category is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  details: z.string().min(1, "Details are required").optional(),
  price: z
    .object({
      mrp: z.number().positive("MRP must be positive"),
      sellingPrice: z.number().positive("Selling price must be positive"),
    })
    .optional(),
  images: z
    .array(z.string())
    .min(1, "At least one image is required")
    .optional(),
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

    const product = await Products.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
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
    const validatedData = ProductSchema.parse(body);

    const product = await Products.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { product, message: "Product updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
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

    const product = await Products.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
