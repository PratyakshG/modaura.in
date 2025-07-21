import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  console.log("webhook called");

  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.log("Invalid signature", expectedSignature, signature);
      return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log("Received event:", event);
    await connectDB();

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      console.log("payment", payment);

      const order = await Order.findOneAndUpdate(
        {
          razorpayOrderId: payment.order_id,
        },
        {
          razorpayPaymentId: payment.id,
          paymentStatus: "completed",
        },
        { new: true }
      );

      if (!order) {
        console.error("No matching order found");
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      console.log("Order found:", order._id, order.email);

      if (order) {
        console.log("order :", order);
        console.log("order email:", order.email);
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
            from: '"Modaura" <no-reply@modaura.in',
            to: order.email,
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

          console.log("Email sent successfully:", mail.response);
        } catch (error) {
          console.error("Error sending email:", error);
        }
      }
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
