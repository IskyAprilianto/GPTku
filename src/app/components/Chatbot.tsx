import { useState } from "react";

export default function Chatbot() {
  const [input, setInput] = useState(""); // Menyimpan input pengguna
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  ); // Menyimpan daftar pesan
  const [error, setError] = useState<string | null>(null); // Menyimpan status error
  const [isLoading, setIsLoading] = useState(false); // Status loading untuk menunggu balasan dari API

  // Fungsi untuk mengirim pesan
  const sendMessage = async () => {
    if (!input.trim()) return; // Abaikan input kosong

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]); // Menambahkan pesan pengguna ke daftar pesan

    setInput(""); // Kosongkan input
    setIsLoading(true); // Mulai proses pengiriman pesan

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }), // Mengirim pesan ke API
      });

      if (!response.ok) {
        throw new Error("Failed to connect to the API");
      }

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: data.reply || "No reply available" }, // Menambahkan balasan dari API ke daftar pesan
      ]);
      setError(null); // Menghapus error jika berhasil
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to connect to the chatbot. Please try again."); // Menampilkan pesan error
    } finally {
      setIsLoading(false); // Selesai pengiriman pesan
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          height: "300px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              marginBottom: "10px",
            }}
          >
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "10px", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)} // Mengatur input
          placeholder="Type a message"
          style={{
            width: "75%",
            padding: "10px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px",
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") sendMessage(); // Mengirim pesan ketika tombol Enter ditekan
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {isLoading ? "Sending..." : "Send"} {/* Tampilkan status loading */}
        </button>
      </div>
    </div>
  );
}
