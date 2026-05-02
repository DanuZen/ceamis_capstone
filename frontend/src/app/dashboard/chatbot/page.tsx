"use client";

import { useState } from "react";
import { Bot, Send, MessageSquare, Sparkles } from "lucide-react";

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
      {/* Header Area */}
      <div style={{ marginBottom: "3rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div style={{
          width: "72px",
          height: "72px",
          background: "var(--color-lime)",
          borderRadius: "var(--radius-brutal-sm)",
          border: "3px solid var(--color-navy)",
          boxShadow: "4px 4px 0px var(--color-navy)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <Bot size={40} color="var(--color-navy)" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", marginBottom: "0.25rem", color: "var(--color-navy)", fontWeight: 800 }}>
            Chatbot Finansial AI
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
            Konsultasi keuangan 24/7 dengan AI yang paham Gen-Z.
          </p>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="stagger-children" style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {quickQuestions.map((q) => (
          <button
            key={q}
            className="btn-brutal btn-brutal--secondary"
            onClick={() => handleQuickQuestion(q)}
            style={{ 
              fontSize: "0.875rem", 
              padding: "0.5rem 1rem", 
              background: "var(--color-white)", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem",
              fontWeight: 600
            }}
          >
            <Sparkles size={16} color="var(--color-purple)" />
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div
        className="card-brutal animate-bounce-in"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "1.5rem",
          background: "var(--color-white)",
          border: "3px solid var(--color-navy)",
        }}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`chat-bubble chat-bubble--${msg.role}`}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              padding: "1rem",
              borderRadius: "var(--radius-brutal-sm)",
              border: "2px solid var(--color-navy)",
              background: msg.role === "user" ? "var(--color-lime)" : "var(--color-purple)",
              color: msg.role === "user" ? "var(--color-navy)" : "var(--color-white)",
              boxShadow: "2px 2px 0px var(--color-navy)",
              fontFamily: "var(--font-body)",
              fontSize: "0.9375rem",
              lineHeight: 1.5,
              position: "relative"
            }}
          >
            {msg.role === "bot" && (
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.8125rem", marginBottom: "0.5rem", color: "var(--color-lime)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Bot size={14} /> CEAMIS Bot
              </div>
            )}
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <MessageSquare size={20} color="var(--color-text-muted)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
          <input
            className="input-brutal"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ketik pertanyaan keuanganmu..."
            style={{ 
              width: "100%", 
              paddingLeft: "3rem", 
              paddingTop: "1rem", 
              paddingBottom: "1rem", 
              fontSize: "1rem",
              border: "3px solid var(--color-navy)",
            }}
          />
        </div>
        <button 
          className="btn-brutal btn-brutal--primary" 
          onClick={handleSend}
          style={{
            padding: "0 2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1rem"
          }}
        >
          Kirim <Send size={18} />
        </button>
      </div>
    </div>
  );
}
