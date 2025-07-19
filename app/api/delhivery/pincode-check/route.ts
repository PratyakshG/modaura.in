import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const pincode = searchParams.get("pincode");

  const token = process.env.DELHIVERY_TOKEN;

  if (!token || !pincode) {
    return NextResponse.json(
      { error: "Missing token or pincode" },
      { status: 400 }
    );
  }

  const url = `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: error ?? "Failed to fetch from Delhivery" },
      { status: 500 }
    );
  }
}
