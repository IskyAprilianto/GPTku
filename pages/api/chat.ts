import { NextResponse } from "next/server";

// Endpoint untuk AIMLAPI (dapat disesuaikan dengan .env.local)
const AIMLAPI_BASE_URL =
  process.env.AIMLAPI_BASE_URL || "https://api.aimlapi.com/v1/chat";
const API_KEY = process.env.AIMLAPI_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validasi input: Pastikan pesan tersedia dan berupa string
    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // Kirim permintaan POST ke AIMLAPI
    const response = await fetch(AIMLAPI_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        message: body.message,
        model: "gpt-3.5-turbo", // Model yang digunakan, pastikan sesuai dokumentasi AIMLAPI
      }),
    });

    // Periksa respons dari AIMLAPI
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from AIMLAPI:", errorData);
      return NextResponse.json(
        {
          error: errorData.message || "Failed to connect to AIMLAPI",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ reply: data.reply || "No reply available" });
  } catch (error: any) {
    console.error("Error connecting to AIMLAPI:", error);
    return NextResponse.json(
      { error: "Failed to connect to AIMLAPI", details: error.message },
      { status: 500 }
    );
  }
}
