"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bot, Send, MessageSquare, Sparkles, RefreshCw, Zap } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useTransactions } from "@/context/TransactionContext";
import { useGuest } from "@/context/GuestContext";
import GuestLockOverlay from "@/components/ui/GuestLockOverlay";
import { useLanguage } from "@/context/LanguageContext";


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
  content: "", // Will be set via translation dynamically
};

// We will generate QUICK_QUESTIONS inside the component using t()

const AI_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000";

// ── Inline markdown renderer ─────────────────────────────────────────────────
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} style={{ fontWeight: 800, color: "inherit" }}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
      return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} style={{ background: "rgba(255,255,255,0.15)", padding: "0.1rem 0.35rem", borderRadius: "4px", fontFamily: "monospace", fontSize: "0.85rem" }}>{part.slice(1, -1)}</code>;
    return <span key={i}>{part}</span>;
  });
}

// ── Block-level markdown renderer ────────────────────────────────────────────
function renderMarkdown(text: string): React.ReactNode {
  const blocks = text.split(/\n{2,}/);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      {blocks.map((block, bi) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading
        if (trimmed.startsWith("### "))
          return <div key={bi} style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.15rem", color: "inherit", marginTop: "0.5rem", marginBottom: "0.25rem", letterSpacing: "0.5px" }}>{renderInline(trimmed.slice(4))}</div>;
        if (trimmed.startsWith("## "))
          return <div key={bi} style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "1.3rem", color: "inherit", borderBottom: "2px solid rgba(0,0,0,0.1)", paddingBottom: "0.25rem", marginTop: "0.75rem", marginBottom: "0.5rem" }}>{renderInline(trimmed.slice(3))}</div>;
        if (trimmed.startsWith("# "))
          return <div key={bi} style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "1.5rem", color: "inherit", marginTop: "1rem", marginBottom: "0.5rem" }}>{renderInline(trimmed.slice(2))}</div>;

        // List items
        const lines = trimmed.split("\n");
        const isBulletList = lines.every(l => /^[-*•]\s/.test(l.trim()));
        const isNumList    = lines.every(l => /^\d+\.\s/.test(l.trim()));

        if (isBulletList)
          return (
            <ul key={bi} style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {lines.map((l, li) => (
                <li key={li} style={{ fontSize: "1rem", lineHeight: 1.6 }}>{renderInline(l.replace(/^[-*•]\s/, "").trim())}</li>
              ))}
            </ul>
          );

        if (isNumList)
          return (
            <ol key={bi} style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {lines.map((l, li) => (
                <li key={li} style={{ fontSize: "1rem", lineHeight: 1.6 }}>{renderInline(l.replace(/^\d+\.\s/, "").trim())}</li>
              ))}
            </ol>
          );

        // Mixed lines (some list, some text) — render line by line
        const hasMixed = lines.some(l => /^[-*•\d]/.test(l.trim()));
        if (hasMixed)
          return (
            <div key={bi} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              {lines.map((l, li) => {
                const t2 = l.trim();
                if (/^[-*•]\s/.test(t2))
                  return <div key={li} style={{ display: "flex", gap: "0.5rem", fontSize: "0.9375rem", lineHeight: 1.55 }}><span style={{ flexShrink: 0, marginTop: "0.15rem" }}>•</span><span>{renderInline(t2.replace(/^[-*•]\s/, ""))}</span></div>;
                if (/^\d+\.\s/.test(t2))
                  return <div key={li} style={{ display: "flex", gap: "0.5rem", fontSize: "0.9375rem", lineHeight: 1.55 }}><span style={{ flexShrink: 0 }}>{t2.match(/^\d+/)![0]}.</span><span>{renderInline(t2.replace(/^\d+\.\s/, ""))}</span></div>;
                return <p key={li} style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.6 }}>{renderInline(t2)}</p>;
              })}
            </div>
          );

        // Regular paragraph
        return (
          <p key={bi} style={{ margin: 0, fontSize: "1rem", lineHeight: 1.7, color: "inherit" }}>
            {lines.map((l, li) => (
              <span key={li}>{renderInline(l)}{li < lines.length - 1 && <br />}</span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default function ChatbotPage() {
  const { userData } = useUser();
  const { transactions } = useTransactions();
  const { isGuest } = useGuest();
  const { t } = useLanguage();

  const QUICK_QUESTIONS = [
    t("dashboard.chatbot.qq1"),
    t("dashboard.chatbot.qq2"),
    t("dashboard.chatbot.qq3"),
    t("dashboard.chatbot.qq4")
  ];

  const [messages, setMessages]     = useState<ChatMessage[]>([]);
  const [input, setInput]           = useState("");
  const [isTyping, setIsTyping]     = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // ── Load history ─────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("ceamis_chat_history_v2");
    setMessages(saved ? JSON.parse(saved) : [{ ...INITIAL_MESSAGE, content: t("dashboard.chatbot.initialMessage") }]);
  }, [t]);

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
    fetch(`${AI_URL}/health`, { signal: AbortSignal.timeout(10000) })
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
          user_id: userData.id || "guest",
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
        content: t("dashboard.chatbot.connErrorText"),
        isError: true,
      }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }, [input, isTyping, messages, buildFinancialContext]);

  const resetChat = () => {
    setMessages([{ ...INITIAL_MESSAGE, content: t("dashboard.chatbot.initialMessage") }]);
    localStorage.removeItem("ceamis_chat_history_v2");
  };

  // ── Status badge ─────────────────────────────────────────────────────────
  const statusColor = isConnected === null ? "var(--color-purple)"
    : isConnected ? "#22c55e" : "var(--color-orange)";
  const statusLabel = isConnected === null ? t("dashboard.chatbot.connecting")
    : isConnected ? "Gemini + Groq" : t("dashboard.chatbot.offline");

  const pageContent = (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - var(--navbar-height) - 4rem)" }}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {/* Logo with status dot */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{
              width: "72px", height: "72px", background: "var(--color-lime)",
              borderRadius: "var(--radius-brutal-sm)", border: "3px solid var(--color-navy)",
              boxShadow: "4px 4px 0px var(--color-navy)", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <Bot size={40} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
            {/* Status dot: hijau=online, merah=offline, kuning=connecting */}
            <span style={{
              position: "absolute", top: "-3px", right: "-3px",
              width: "14px", height: "14px", borderRadius: "50%",
              background: isConnected === null ? "#eab308" : isConnected ? "#22c55e" : "#ef4444",
              border: "2.5px solid var(--color-white)",
              boxShadow: "0 0 0 1.5px var(--color-navy)",
              display: "inline-block",
            }} className={isConnected ? "animate-pulse" : ""} />
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", margin: 0, color: "var(--color-navy)", fontWeight: 800 }}>
              {t("dashboard.chatbot.title")}
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1rem", margin: 0, fontWeight: 500 }}>
              AI Financial Assistant
            </p>
          </div>
        </div>

        <button
          onClick={resetChat}
          className="btn-brutal"
          style={{ padding: "0.75rem 1.25rem", background: "var(--color-white)", color: "var(--color-navy)", border: "3px solid var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800, boxShadow: "4px 4px 0px var(--color-navy)" }}
        >
          <RefreshCw size={16} /> {t("dashboard.chatbot.newChat")}
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
        className="card-brutal no-scrollbar"
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
              borderRadius: "var(--radius-brutal-md)",
              border: msg.isError ? "3px dashed var(--color-orange)" : "3px solid var(--color-navy)",
              background: msg.role === "user"
                ? "var(--color-purple)"
                : msg.isError
                  ? "rgba(255,165,0,0.08)"
                  : "var(--color-white)",
              color: msg.role === "user" ? "var(--color-white)" : "var(--color-navy)",
              boxShadow: msg.isError ? "none" : (msg.role === "user" ? "4px 4px 0px var(--color-lime)" : "4px 4px 0px var(--color-purple)"),
            }}
          >
            {/* Bot label */}
            {msg.role === "assistant" && (
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "0.85rem", marginBottom: "0.6rem", color: msg.isError ? "var(--color-orange)" : "var(--color-purple)", display: "flex", alignItems: "center", gap: "0.4rem", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "2px solid rgba(0,0,0,0.05)", paddingBottom: "0.4rem" }}>
                <Bot size={16} strokeWidth={2.5} /> {msg.isError ? t("dashboard.chatbot.connError") : t("dashboard.chatbot.title")}
                {msg.triggered === "sensitive" && (
                  <span style={{ marginLeft: "0.4rem", fontSize: "0.6rem", background: "var(--color-orange)", color: "var(--color-navy)", padding: "0.05rem 0.3rem", borderRadius: "100px", fontWeight: 900 }}>⚠ {t("dashboard.chatbot.sensitive")}</span>
                )}
              </div>
            )}
            <div style={{ fontFamily: "var(--font-body)" }}>
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
              borderRadius: "var(--radius-brutal-md)", border: "3px solid var(--color-navy)",
              background: "var(--color-white)", boxShadow: "4px 4px 0px var(--color-purple)",
              display: "flex", alignItems: "center", gap: "1rem", position: "relative",
            }}
          >
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "0.85rem", color: "var(--color-purple)", display: "flex", alignItems: "center", gap: "0.5rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              <Bot size={16} strokeWidth={2.5} className="animate-pulse" />
              {t("dashboard.chatbot.camiThinking")}
            </div>
            <div style={{ display: "flex", gap: "0.4rem", paddingBottom: "0.2rem" }}>
              {[0, 0.2, 0.4].map((delay, i) => (
                <div key={i} style={{ width: "8px", height: "8px", background: i % 2 === 0 ? "var(--color-purple)" : "var(--color-lime)", borderRadius: "50%", border: "2px solid var(--color-navy)", animation: `bounce 0.6s infinite alternate ${delay}s` }} />
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
            placeholder={isTyping ? t("dashboard.chatbot.placeholderTyping") : t("dashboard.chatbot.placeholderReady")}
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
          {isTyping ? t("dashboard.chatbot.btnThinking") : t("dashboard.chatbot.btnSend")} <Send size={16} />
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

  return isGuest ? (
    <GuestLockOverlay featureName="Chatbot AI (CAMI)" variant="page">
      {pageContent}
    </GuestLockOverlay>
  ) : pageContent;
}
