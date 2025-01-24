import Chatbot from "@/app/components/Chatbot"; // Alias @ mengarah ke folder src

export default function Home() {
  return (
    <main>
      <h1>Welcome to the Chatbot</h1>
      <Chatbot /> {/* Menampilkan komponen Chatbot */}
    </main>
  );
}
