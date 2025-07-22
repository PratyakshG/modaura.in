import nodemailer from "nodemailer";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const {
      userId,
      email,
      createdAt,
      items,
      amount,
      address: {
        name,
        phone_number,
        pincode,
        street,
        city,
        state,
        locality,
        landmark,
      },
    } = await request.json();

    if (
      !userId ||
      !email ||
      !createdAt ||
      !items ||
      !amount ||
      !name ||
      !phone_number ||
      !pincode ||
      !street ||
      !city ||
      !state
    ) {
      return NextResponse.json(
        { error: "All fields are required to place an order" },
        { status: 400 }
      );
    }

    await connectDB();

    const newOrder = await Order.create({
      userId,
      email,
      createdAt,
      items,
      amount,
      paymentMode: "COD",
      paymentStatus: "pending",
      address: {
        name,
        phone_number,
        pincode,
        street,
        city,
        state,
        locality,
        landmark,
      },
    });

    if (newOrder) {
      // console.log("order :", order);
      // console.log("order email:", order.email);
      // Send email only after payment is confirmed
      const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: Number(process.env.MAILTRAP_PORT),
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      });

      try {
        const mail = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: newOrder.email,
          subject: "Payment Confirmation - Modaura",
          text: `
    Thank you for your purchase!
    
    Order Details:
    - Order ID: ${newOrder._id.toString()}
    
    - Products: 
    ${newOrder.items
      .map(
        (item: { name: string; quantity: number }) =>
          `${item.name} x ${item.quantity}`
      )
      .join("\n")}
      
    - Price: Rs. ${newOrder.amount}
    
    Your products will be delivered in 3 - 7 business days.
    For any queries, please contact us at
    Email: modaura.in@gmail.com or Whatsapp: +91 8882300527
    
    Thank you for shopping with Modaura!
              `.trim(),
        });

        console.log("Email sent successfully:", mail.response);
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }

    return NextResponse.json(
      {
        dbOrderId: newOrder._id,
        orderAmount: amount,
        message: "Order placed successfully",
        email: newOrder.email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order Unsuccesful", error);
    return NextResponse.json(
      { error: "Failed to order products" },
      { status: 400 }
    );
  }
}

export async function GET() {
  const session = await auth();

  if (!session || !session.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const res = await Order.find({ userId: session.user?.id });

  console.log(res);
  return NextResponse.json(res, { status: 200 });
}
