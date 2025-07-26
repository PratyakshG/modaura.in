import { connectDB } from "@/lib/db";
import Products from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      category,
      description,
      details,
      price: { mrp, sellingPrice },
      images,
    } = await request.json();

    if (
      !name ||
      !category ||
      !description ||
      !details ||
      !mrp ||
      !sellingPrice ||
      !images
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingProduct = await Products.findOne({ name });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Product already uploaded" },
        { status: 400 }
      );
    }

    await Products.create({
      name,
      category,
      description,
      details,
      price: {
        mrp,
        sellingPrice,
      },
      images,
    });

    return NextResponse.json(
      { message: "Product uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Product Upload Unsuccesful", error);
    return NextResponse.json(
      { error: "Failed to upload product" },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const allFlag = url.searchParams.get("all");
    const category = url.searchParams.get("category");

    if (id) {
      const product = await Products.findById(id);
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(product, { status: 200 });
    }

    if (category) {
      const product = await Products.find();
      const res = product.filter((item) => {
        return item.category.toUpperCase() == category.toUpperCase();
      });
      return NextResponse.json(res, { status: 200 });
    }

    if (allFlag === "true") {
      const products = await Products.find();
      return NextResponse.json(products, { status: 200 });
    }

    return NextResponse.json(
      { error: "Provide 'id' or 'all=true' query parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.log("Product Fetch Failed", error);
    return NextResponse.json(
      { error: "Failed to fetch product(s)" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, name, category, description, details, price, images } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      { name, category, description, details, price, images },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.log("Product Update Failed", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const deletedProduct = await Products.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Product Delete Failed", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
