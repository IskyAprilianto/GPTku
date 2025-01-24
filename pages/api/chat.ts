import { NextApiRequest, NextApiResponse } from "next";

const AIMLAPI_BASE_URL =
  process.env.AIMLAPI_BASE_URL || "https://api.aimlapi.com/v1/chat";
const API_KEY = process.env.AIMLAPI_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { message } = req.body;

      // Validasi input
      if (!message || typeof message !== "string") {
        return res
          .status(400)
          .json({ error: "Message is required and must be a string" });
      }

      // Kirim permintaan POST ke AIMLAPI
      const response = await fetch(AIMLAPI_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          message: message,
          model: "gpt-3.5-turbo", // Model yang digunakan
        }),
      });

      // Periksa respons dari AIMLAPI
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from AIMLAPI:", errorData);
        return res.status(response.status).json({
          error: errorData.message || "Failed to connect to AIMLAPI",
          details: errorData,
        });
      }

      const data = await response.json();
      return res
        .status(200)
        .json({ reply: data.reply || "No reply available" });
    } catch (error: unknown) {
      console.error("Error connecting to AIMLAPI:", error);
      return res.status(500).json({
        error: "Failed to connect to AIMLAPI",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
