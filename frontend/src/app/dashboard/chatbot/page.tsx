"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bot, Send, MessageSquare, Sparkles, RefreshCw, Zap } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useTransactions } from "@/context/TransactionContext";

// ── Tipe ─────────────────────────────────────────────────────────────────────
type Role = "user" | "assistant";

interface ChatMessage {
  id: number;
  role: Role;
  content: string;
  triggered?: string; // "ok" | "sensitive" | "off_topic" | "crisis_filter"
  isError?: boolean;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 1,
  role: "assistant",
  content: "Halo! Aku **CAMI** — AI Financial Assistant dari CEAMIS. Tanya apa aja soal keuangan kamu, aku siap bantu dengan bahasa yang santai tapi tetap akurat! 💚",
};

const QUICK_QUESTIONS = [
  "Gimana cara mulai nabung?",
  "Apa itu emergency fund?",
  "Tips kurangi pengeluaran impulsif",
  "Berapa ideal rasio tabungan?",
];

const AI_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000";

// ── Markdown bold sederhana ───────────────────────────────────────────────────
function renderMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

export default function ChatbotPage() {
  const { userData } = useUser();
  const { transactions } = useTransactions();

  const [messages, setMessages]     = useState<ChatMessage[]>([]);
  const [input, setInput]           = useState("");
  const [isTyping, setIsTyping]     = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // ── Load history ─────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("ceamis_chat_history_v2");
    setMessages(saved ? JSON.parse(saved) : [INITIAL_MESSAGE]);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ceamis_chat_history_v2", JSON.stringify(messages));
    }
  }, [messages]);

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Ping AI service sekali saat mount ───────────────────────────────────
  useEffect(() => {
    fetch(`${AI_URL}/health`, { signal: AbortSignal.timeout(3000) })
      .then(r => setIsConnected(r.ok))
      .catch(() => setIsConnected(false));
  }, []);

  // ── Build financial_context dari UserContext + Transactions ──────────────
  const buildFinancialContext = useCallback(() => {
    const thisMonth = new Date().toLocaleDateString("id-ID", { month: "short", year: "numeric" });
    const monthlyTx = transactions.filter(tx => tx.date.includes(thisMonth.split(" ")[0]));
    const income    = monthlyTx.filter(tx => tx.type === "pemasukan").reduce((s, tx) => s + tx.amount, 0);
    const expense   = monthlyTx.filter(tx => tx.type === "pengeluaran").reduce((s, tx) => s + tx.amount, 0);
    const savingRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

    return {
      user_name:        userData.name,
      health_score:     userData.healthScore,
      risk_profile:     null,                    // akan diisi setelah Model 3 integrasi
      monthly_income:   income,
      monthly_expense:  expense,
      saving_rate_pct:  savingRate,
      streak:           userData.streak,
      level:            userData.level,
    };
  }, [userData, transactions]);

  // ── Send message ─────────────────────────────────────────────────────────
  const handleSend = useCallback(async (text?: string) => {
    const msgText = (text || input).trim();
    if (!msgText || isTyping) return;

    const userMsg: ChatMessage = { id: Date.now(), role: "user", content: msgText };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Format history untuk API (hanya role + content, exclude error messages)
      const history = [...messages, userMsg]
        .filter(m => !m.isError)
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch(`${AI_URL}/api/v1/chat`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages:          history,
          financial_context: buildFinancialContext(),
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setMessages(prev => [...prev, {
        id:        Date.now() + 1,
        role:      "assistant",
        content:   data.reply,
        triggered: data.triggered,
      }]);
      setIsConnected(true);

    } catch {
      setIsConnected(false);
      setMessages(prev => [...prev, {
        id:      Date.now() + 1,
        role:    "assistant",
        content: "Waduh, koneksi ke AI service lagi bermasalah nih. Pastiin AI service udah jalan di `http://localhost:8000` ya!",
        isError: true,
      }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }, [input, isTyping, messages, buildFinancialContext]);

  const resetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    localStorage.removeItem("ceamis_chat_history_v2");
  };

  // ── Status badge ─────────────────────────────────────────────────────────
  const statusColor = isConnected === null ? "var(--color-purple)"
    : isConnected ? "#22c55e" : "var(--color-orange)";
  const statusLabel = isConnected === null ? "Connecting..."
    : isConnected ? "Gemini + Groq" : "Offline (fallback)";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - var(--navbar-height) - 4rem)" }}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{
            width: "72px", height: "72px", background: "var(--color-lime)",
            borderRadius: "var(--radius-brutal-sm)", border: "3px solid var(--color-navy)",
            boxShadow: "4px 4px 0px var(--color-navy)", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Bot size={40} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
              <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", margin: 0, color: "var(--color-navy)", fontWeight: 800 }}>
                CAMI
              </h1>
              {/* Status indicator */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.2rem 0.6rem", background: "var(--color-bg)", border: "2px solid var(--color-navy)", borderRadius: "100px", boxShadow: "2px 2px 0px var(--color-navy)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: statusColor, display: "inline-block" }} className={isConnected ? "animate-pulse" : ""} />
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--color-navy)" }}>{statusLabel}</span>
              </div>
            </div>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1rem", margin: 0, fontWeight: 500 }}>
              AI Financial Assistant · Powered by Gemini 1.5 Flash
            </p>
          </div>
        </div>

        <button
          onClick={resetChat}
          className="btn-brutal"
          style={{ padding: "0.75rem 1.25rem", background: "var(--color-white)", color: "var(--color-navy)", border: "3px solid var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800, boxShadow: "4px 4px 0px var(--color-navy)" }}
        >
          <RefreshCw size={16} /> Chat Baru
        </button>
      </div>

      {/* ── Quick Questions ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "1rem" }}>
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            className="btn-brutal"
            onClick={() => handleSend(q)}
            disabled={isTyping}
            style={{
              fontSize: "0.8rem", padding: "0.45rem 0.9rem",
              background: "var(--color-white)", display: "flex", alignItems: "center", gap: "0.4rem",
              fontWeight: 600, opacity: isTyping ? 0.5 : 1, cursor: isTyping ? "not-allowed" : "pointer",
              border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)",
            }}
          >
            <Sparkles size={13} color="var(--color-purple)" /> {q}
          </button>
        ))}
      </div>

      {/* ── Chat Messages ─────────────────────────────────────────────────── */}
      <div
        className="card-brutal"
        style={{
          flex: 1, overflowY: "auto", padding: "1.25rem",
          display: "flex", flexDirection: "column", gap: "1.25rem",
          marginBottom: "1rem", background: "var(--color-white)",
          border: "3px solid var(--color-navy)",
          boxShadow: "inset 2px 2px 0px rgba(0,0,0,0.04)",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="animate-slide-up"
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "82%",
              padding: "0.875rem 1.125rem",
              borderRadius: "var(--radius-brutal-sm)",
              border: msg.isError ? "3px dashed var(--color-orange)" : "3px solid var(--color-navy)",
              background: msg.role === "user"
                ? "var(--color-lime)"
                : msg.isError
                  ? "rgba(255,165,0,0.08)"
                  : "var(--color-navy)",
              color: msg.role === "user" ? "var(--color-navy)" : "var(--color-white)",
              boxShadow: msg.isError ? "none" : "4px 4px 0px var(--color-navy)",
            }}
          >
            {/* Bot label */}
            {msg.role === "assistant" && (
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.7rem", marginBottom: "0.4rem", color: msg.isError ? "var(--color-orange)" : "var(--color-lime)", display: "flex", alignItems: "center", gap: "0.3rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                <Bot size={11} strokeWidth={3} /> {msg.isError ? "CONNECTION ERROR" : "CAMI"}
                {msg.triggered === "sensitive" && (
                  <span style={{ marginLeft: "0.4rem", fontSize: "0.6rem", background: "var(--color-orange)", color: "var(--color-navy)", padding: "0.05rem 0.3rem", borderRadius: "100px", fontWeight: 900 }}>⚠ SENSITIF</span>
                )}
              </div>
            )}
            <div style={{ fontSize: "0.9375rem", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>
              {renderMarkdown(msg.content)}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div
            className="animate-slide-up"
            style={{
              alignSelf: "flex-start", padding: "1rem 1.5rem",
              borderRadius: "var(--radius-brutal-sm)", border: "3px solid var(--color-navy)",
              background: "var(--color-navy)", boxShadow: "6px 6px 0px var(--color-purple)",
              display: "flex", flexDirection: "column", gap: "0.6rem", position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "2px", background: "rgba(182,255,68,0.3)", boxShadow: "0 0 12px var(--color-lime)", animation: "scan 2s linear infinite" }} />
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "0.75rem", color: "var(--color-lime)", display: "flex", alignItems: "center", gap: "0.4rem", textTransform: "uppercase", letterSpacing: "2px" }}>
              <Bot size={14} strokeWidth={3} className="animate-pulse" />
              <Zap size={12} fill="var(--color-lime)" /> CAMI MIKIR...
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[0, 0.2, 0.4].map((delay, i) => (
                <div key={i} style={{ width: "10px", height: "10px", background: i % 2 === 0 ? "var(--color-lime)" : "var(--color-purple)", borderRadius: "var(--radius-brutal-sm)", border: "2px solid rgba(255,255,255,0.3)", animation: `bounce 0.6s infinite alternate ${delay}s` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ─────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <MessageSquare size={18} color="var(--color-text-muted)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            ref={inputRef}
            className="input-brutal"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            disabled={isTyping}
            placeholder={isTyping ? "CAMI sedang berpikir..." : "Tanya apa saja soal finansialmu..."}
            style={{
              width: "100%", paddingLeft: "3rem", paddingTop: "1rem", paddingBottom: "1rem",
              fontSize: "1rem", border: "3px solid var(--color-navy)",
              background: isTyping ? "var(--color-bg)" : "var(--color-white)",
              cursor: isTyping ? "not-allowed" : "text",
            }}
          />
        </div>
        <button
          className="btn-brutal btn-brutal--primary"
          onClick={() => handleSend()}
          disabled={isTyping || !input.trim()}
          style={{
            padding: "0 2rem", display: "flex", alignItems: "center", gap: "0.6rem",
            fontSize: "1rem", fontWeight: 800,
            opacity: (isTyping || !input.trim()) ? 0.6 : 1,
            cursor: (isTyping || !input.trim()) ? "not-allowed" : "pointer",
          }}
        >
          {isTyping ? "Mikir..." : "Kirim"} <Send size={16} />
        </button>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0%   { transform: translateY(-10px); opacity: 0; }
          50%  { opacity: 1; }
          100% { transform: translateY(80px); opacity: 0; }
        }
        @keyframes bounce {
          to { transform: translateY(-7px); filter: brightness(1.3); }
        }
      `}</style>
    </div>
  );
}
