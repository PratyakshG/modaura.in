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
  images: z
    .string()
    .transform((str) =>
      typeof str === "string" ? str.split(",").map((s) => s.trim()) : [],
    ),
});

function parseCSV(csv: string): string[][] {
  const lines = csv.trim().split("\n");
  return lines.map((line) => line.split(",").map((cell) => cell.trim()));
}

export async function POST(req: NextRequest) {
  try {
    const { isAdmin } = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const contentType = req.headers.get("content-type");

    let products: Record<string, unknown>[] = [];

    if (contentType?.includes("application/json")) {
      const body = await req.json();
      products = Array.isArray(body) ? body : [body];
    } else if (contentType?.includes("text/csv")) {
      const csv = await req.text();
      const rows = parseCSV(csv);

      if (rows.length < 2) {
        return NextResponse.json(
          { error: "CSV must have headers and at least one data row" },
          { status: 400 },
        );
      }

      const headers = rows[0];
      products = rows.slice(1).map((row) => {
        const obj: Record<string, unknown> = {};
        headers.forEach((header, index) => {
          obj[header.toLowerCase()] = row[index];
        });
        return obj;
      });
    } else if (contentType?.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json(
          { error: "No file provided" },
          { status: 400 },
        );
      }

      const csv = await file.text();
      const rows = parseCSV(csv);

      if (rows.length < 2) {
        return NextResponse.json(
          { error: "CSV must have headers and at least one data row" },
          { status: 400 },
        );
      }

      const headers = rows[0];
      products = rows.slice(1).map((row) => {
        const obj: Record<string, unknown> = {};
        headers.forEach((header, index) => {
          const key = header.toLowerCase().replace(/\s+/g, "");
          obj[key] = row[index];
        });
        return obj;
      });
    }

    const results = {
      successful: [] as Record<string, unknown>[],
      failed: [] as { row: number; error: string }[],
    };

    for (let i = 0; i < products.length; i++) {
      try {
        const product = products[i] as Record<string, string>;

        const validatedData = ProductSchema.parse({
          name: product.name,
          category: product.category,
          description: product.description,
          details: product.details,
          price: {
            mrp: parseFloat(product.mrp) || 0,
            sellingPrice:
              parseFloat(product.sellingprice || product.selling_price) || 0,
          },
          images: product.images || "",
        });

        const existingProduct = await Products.findOne({
          name: validatedData.name,
        });
        if (existingProduct) {
          results.failed.push({
            row: i + 2,
            error: "Product with this name already exists",
          });
          continue;
        }

        const newProduct = await Products.create(validatedData);
        results.successful.push(newProduct);
      } catch (error) {
        const errorMessage =
          error instanceof z.ZodError ? error.message : "error";
        results.failed.push({
          row: i + 2,
          error: errorMessage,
        });
      }
    }

    return NextResponse.json(
      {
        message: `Bulk upload completed: ${results.successful.length} successful, ${results.failed.length} failed`,
        results,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in bulk upload:", error);
    return NextResponse.json(
      { error: "Failed to process bulk upload" },
      { status: 500 },
    );
  }
}
