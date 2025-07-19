import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const pincode = searchParams.get("pincode");
  const paymentMode = searchParams.get("paymentMode");

  const token = process.env.DELHIVERY_TOKEN;

  if (!token || !pincode) {
    return NextResponse.json(
      { error: "Missing token or pincode" },
      { status: 400 }
    );
  }

  const url = `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=E&ss=Delivered&d_pin=${pincode}&o_pin=110092&cgm=10&pt=${paymentMode}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: error ?? "Failed to fetch from Delhivery" },
      { status: 500 }
    );
  }
}
