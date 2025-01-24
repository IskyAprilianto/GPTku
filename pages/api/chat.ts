import { NextResponse } from "next/server";

// Endpoint untuk AIMLAPI
const AIMLAPI_BASE_URL =
  process.env.AIMLAPI_BASE_URL || "https://api.aimlapi.com/v1/chat";
const API_KEY = process.env.AIMLAPI_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validasi input
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
        model: "gpt-3.5-turbo", // Model yang digunakan
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
  } catch (error: unknown) {
    // Menangani error dengan aman
    if (error instanceof Error) {
      console.error("Error connecting to AIMLAPI:", error.message);
      return NextResponse.json(
        { error: "Failed to connect to AIMLAPI", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "An unexpected error occurred", details: String(error) },
        { status: 500 }
      );
    }
  }
}
