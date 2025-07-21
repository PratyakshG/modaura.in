import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    await connectDB();

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      console.log(payment);

      const order = await Order.findOneAndUpdate(
        {
          razorpayOrderId: payment.order_id,
        },
        {
          razorpayPaymentId: payment.id,
          paymentStatus: "completed",
        }
      );

      if (order) {
        // Send email only after payment is confirmed
        const transporter = nodemailer.createTransport({
          host: process.env.MAILTRAP_HOST,
          port: Number(process.env.MAILTRAP_PORT),
          auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
          },
        });

        await transporter.sendMail({
          from: '"Modaura" <modaura.in@gmail.com>',
          to: order.userId.email,
          subject: "Payment Confirmation - Modaura",
          text: `
Thank you for your purchase!

Order Details:
- Order ID: ${order._id.toString()}
- Product: ${order.items
            .map(
              (item: { name: string; quantity: number }) =>
                `${item.name} x ${item.quantity}`
            )
            .join("\n")}
- Price: Rs. ${order.amount}

Your products will be delivered in 3 - 7 business days.
For any queries, please contact us at
Email: modaura.in@gmail.com or Whatsapp: +91 8882300527

Thank you for shopping with Modaura!
          `.trim(),
        });
      }

      console.log(order);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
