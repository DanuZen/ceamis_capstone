"use client";

import { useState } from "react";

type Message = {
  id: number;
  role: "user" | "bot";
  text: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: "bot",
    text: "Halo! Aku CEAMIS Bot. Tanya apa aja soal keuangan kamu — aku siap bantu!",
  },
];

const quickQuestions = [
  "Gimana cara mulai nabung?",
  "Apa itu emergency fund?",
  "Tips mengurangi impulsif belanja",
  "Berapa ideal rasio tabungan?",
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: messages.length + 1,
      role: "user",
      text: input,
    };

    const botMsg: Message = {
      id: messages.length + 2,
      role: "bot",
      text: "Pertanyaan bagus! Sayangnya aku masih dalam tahap development. Nanti aku bakal bisa jawab pertanyaan keuangan kamu pakai AI yang canggih. Stay tuned!",
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const handleQuickQuestion = (q: string) => {
    setInput(q);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - var(--navbar-height) - 4rem)" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", marginBottom: "0.5rem" }}>
          Chatbot Finansial AI
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>
          Konsultasi keuangan 24/7 dengan AI yang paham Gen-Z.
        </p>
      </div>

      {/* Quick Questions */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
        {quickQuestions.map((q) => (
          <button
            key={q}
            className="btn-brutal btn-brutal--secondary btn-brutal--sm"
            onClick={() => handleQuickQuestion(q)}
            style={{ fontSize: "0.8125rem" }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div
        className="card-brutal"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          marginBottom: "1rem",
          background: "var(--color-bg)",
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble chat-bubble--${msg.role}`}>
            {msg.role === "bot" && (
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                CEAMIS Bot
              </div>
            )}
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <input
          className="input-brutal"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ketik pertanyaan keuanganmu..."
          style={{ flex: 1 }}
        />
        <button className="btn-brutal btn-brutal--primary" onClick={handleSend}>
          Kirim
        </button>
      </div>
    </div>
  );
}
