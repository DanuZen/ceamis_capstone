"use client";

import { useState, useEffect } from "react";
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ceamis_chat_history");
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages(initialMessages);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ceamis_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        role: "bot",
        text: "Pertanyaan bagus! Sayangnya aku masih dalam tahap development. Nanti aku bakal bisa jawab pertanyaan keuangan kamu pakai AI yang canggih. Stay tuned!",
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const resetChat = () => {
    setMessages(initialMessages);
    localStorage.removeItem("ceamis_chat_history");
  };

  const handleQuickQuestion = (q: string) => {
    setInput(q);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - var(--navbar-height) - 4rem)" }}>
      {/* Header Area */}
      <div style={{ marginBottom: "3rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
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

        <button 
          onClick={resetChat}
          className="btn-brutal" 
          style={{ 
            padding: "0.75rem 1.5rem", 
            background: "var(--color-white)", 
            color: "var(--color-navy)", 
            border: "3px solid var(--color-navy)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 800,
            boxShadow: "4px 4px 0px var(--color-navy)"
          }}
        >
          <MessageSquare size={18} /> Chat Baru
        </button>
      </div>

      {/* Quick Questions */}
      <div className="stagger-children" style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {quickQuestions.map((q) => (
          <button
            key={q}
            className="btn-brutal btn-brutal--secondary"
            onClick={() => handleQuickQuestion(q)}
            disabled={isTyping}
            style={{ 
              fontSize: "0.875rem", 
              padding: "0.5rem 1rem", 
              background: "var(--color-white)", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem",
              fontWeight: 600,
              opacity: isTyping ? 0.5 : 1,
              cursor: isTyping ? "not-allowed" : "pointer"
            }}
          >
            <Sparkles size={16} color="var(--color-purple)" />
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
          gap: "1.5rem",
          marginBottom: "1.5rem",
          background: "var(--color-white)",
          border: "3px solid var(--color-navy)",
          boxShadow: "inset 4px 4px 0px rgba(0,0,0,0.05)"
        }}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`chat-bubble chat-bubble--${msg.role} animate-slide-up`}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              padding: "1rem 1.25rem",
              borderRadius: "var(--radius-brutal-sm)",
              border: "3px solid var(--color-navy)",
              background: msg.role === "user" ? "var(--color-lime)" : "var(--color-purple)",
              color: msg.role === "user" ? "var(--color-navy)" : "var(--color-white)",
              boxShadow: "4px 4px 0px var(--color-navy)",
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              lineHeight: 1.5,
              position: "relative"
            }}
          >
            {msg.role === "bot" && (
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.75rem", marginBottom: "0.5rem", color: "var(--color-lime)", display: "flex", alignItems: "center", gap: "0.25rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                <Bot size={12} strokeWidth={3} /> CEAMIS Bot
              </div>
            )}
            {msg.text}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div 
            className="animate-slide-up"
            style={{
              alignSelf: "flex-start",
              padding: "1.25rem 1.75rem",
              borderRadius: "var(--radius-brutal-sm)",
              border: "3px solid var(--color-navy)",
              background: "var(--color-navy)",
              color: "var(--color-white)",
              boxShadow: "6px 6px 0px var(--color-purple)",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Scanline Effect */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "2px",
              background: "rgba(182, 255, 68, 0.3)",
              boxShadow: "0 0 15px var(--color-lime)",
              animation: "scan 2s linear infinite",
              zIndex: 1
            }} />

            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "0.875rem", color: "var(--color-lime)", display: "flex", alignItems: "center", gap: "0.5rem", textTransform: "uppercase", letterSpacing: "2px", position: "relative", zIndex: 2 }}>
              <Bot size={16} strokeWidth={3} className="animate-pulse" /> AI MENGANALISA...
            </div>
            
            <div style={{ display: "flex", gap: "0.6rem", padding: "0.25rem 0", position: "relative", zIndex: 2 }}>
              <div className="dot-blink" style={{ width: "12px", height: "12px", background: "var(--color-lime)", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", animation: "bounce 0.6s infinite alternate" }} />
              <div className="dot-blink" style={{ width: "12px", height: "12px", background: "var(--color-purple)", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-white)", animation: "bounce 0.6s infinite alternate 0.2s" }} />
              <div className="dot-blink" style={{ width: "12px", height: "12px", background: "var(--color-lime)", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", animation: "bounce 0.6s infinite alternate 0.4s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <MessageSquare size={20} color="var(--color-text-muted)" style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)" }} />
          <input
            className="input-brutal"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isTyping}
            placeholder={isTyping ? "AI sedang berfikir..." : "Tanya apa saja soal finansialmu..."}
            style={{ 
              width: "100%", 
              paddingLeft: "3.5rem", 
              paddingTop: "1.25rem", 
              paddingBottom: "1.25rem", 
              fontSize: "1rem",
              border: "3px solid var(--color-navy)",
              background: isTyping ? "var(--color-bg)" : "var(--color-white)",
              cursor: isTyping ? "not-allowed" : "text"
            }}
          />
        </div>
        <button 
          className="btn-brutal btn-brutal--primary" 
          onClick={handleSend}
          disabled={isTyping || !input.trim()}
          style={{
            padding: "0 2.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "1rem",
            opacity: (isTyping || !input.trim()) ? 0.6 : 1,
            cursor: (isTyping || !input.trim()) ? "not-allowed" : "pointer"
          }}
        >
          {isTyping ? "Mikir..." : "Kirim"} <Send size={18} />
        </button>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-10px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(80px); opacity: 0; }
        }
        @keyframes bounce {
          to { transform: translateY(-8px); filter: brightness(1.2); }
        }
      `}</style>
    </div>
  );
}
