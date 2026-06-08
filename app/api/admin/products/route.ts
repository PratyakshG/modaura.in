import { connectDB } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-utils";
import Products from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  details: z.string().min(1, "Details are required"),
  price: z.object({
    mrp: z.number().positive("MRP must be positive"),
    sellingPrice: z.number().positive("Selling price must be positive"),
  }),
  images: z.array(z.string()).min(1, "At least one image is required"),
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
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (search)
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];

    const skip = (page - 1) * limit;
    const products = await Products.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await Products.countDocuments(query);

    return NextResponse.json(
      {
        products,
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
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
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
    const validatedData = ProductSchema.parse(body);

    const existingProduct = await Products.findOne({
      name: validatedData.name,
    });
    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this name already exists" },
        { status: 409 },
      );
    }

    const newProduct = await Products.create(validatedData);

    return NextResponse.json(
      { product: newProduct, message: "Product created successfully" },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
