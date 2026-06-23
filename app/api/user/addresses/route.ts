import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { Address } from "@/types/index";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ addresses: user.addresses || [] });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      phone_number,
      pincode,
      street,
      city,
      state,
      locality,
      landmark,
    } = body;

    // Validation
    if (!name || !phone_number || !pincode || !street || !city || !state) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newAddress = {
      _id: new Types.ObjectId(),
      name,
      phone_number,
      pincode,
      street,
      city,
      state,
      locality: locality || "",
      landmark: landmark || "",
    };

    if (!user.addresses) {
      user.addresses = [];
    }

    user.addresses.push(newAddress);
    await user.save();

    return NextResponse.json({ address: newAddress }, { status: 201 });
  } catch (error) {
    console.error("Error adding address:", error);
    return NextResponse.json(
      { error: "Failed to add address" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      addressId,
      name,
      phone_number,
      pincode,
      street,
      city,
      state,
      locality,
      landmark,
    } = body;

    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID required" },
        { status: 400 },
      );
    }

    if (!name || !phone_number || !pincode || !street || !city || !state) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const addressIndex = user.addresses?.findIndex(
      (addr: Address) => addr._id?.toString() === addressId,
    );

    if (addressIndex === -1 || addressIndex === undefined) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    user.addresses[addressIndex] = {
      _id: user.addresses[addressIndex]._id,
      name,
      phone_number,
      pincode,
      street,
      city,
      state,
      locality: locality || "",
      landmark: landmark || "",
    };

    await user.save();

    return NextResponse.json({ address: user.addresses[addressIndex] });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { addressId } = body;

    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID required" },
        { status: 400 },
      );
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.addresses = user.addresses?.filter(
      (addr: Address) => addr._id?.toString() !== addressId,
    );

    await user.save();

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 },
    );
  }
}
