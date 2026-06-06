"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, MessageSquare, Sparkles, RefreshCw, Bot } from "lucide-react";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useTransactions } from "@/context/TransactionContext";
import { useGuest } from "@/context/GuestContext";
import { useLanguage } from "@/context/LanguageContext";

type Role = "user" | "assistant";
interface ChatMessage {
  id: number;
  role: Role;
  content: string;
  triggered?: string;
  isError?: boolean;
}

const AI_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000";

// ── Inline markdown renderer ──────────────────────────────────────────────────
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} style={{ fontWeight: 800 }}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
      return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} style={{ background: "rgba(88,51,238,0.1)", padding: "0.1rem 0.3rem", borderRadius: "4px", fontSize: "0.82rem" }}>{part.slice(1, -1)}</code>;
    return <span key={i}>{part}</span>;
  });
}

function renderMarkdown(text: string): React.ReactNode {
  const blocks = text.split(/\n{2,}/);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {blocks.map((block, bi) => {
        const trimmed = block.trim();
        if (!trimmed) return null;
        const lines = trimmed.split("\n");
        const isBullet = lines.every(l => /^[-*•]\s/.test(l.trim()));
        if (isBullet)
          return (
            <ul key={bi} style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {lines.map((l, li) => <li key={li} style={{ fontSize: "0.9rem", lineHeight: 1.55 }}>{renderInline(l.replace(/^[-*•]\s/, "").trim())}</li>)}
            </ul>
          );
        return <p key={bi} style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.65 }}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}

export default function FloatingChatWidget() {
  const pathname = usePathname();
  const { userData } = useUser();
  const { transactions } = useTransactions();
  const { isGuest } = useGuest();
  const { t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [forceOpenPose, setForceOpenPose] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const QUICK_QUESTIONS = [
    t("dashboard.chatbot.qq1"),
    t("dashboard.chatbot.qq2"),
    t("dashboard.chatbot.qq3"),
  ];

  // Auto-close chat widget on any page navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const saved = localStorage.getItem("ceamis_chat_history_v2");
    setMessages(saved ? JSON.parse(saved) : [{ id: 1, role: "assistant" as Role, content: t("dashboard.chatbot.initialMessage") }]);
  }, [t]);

  useEffect(() => {
    if (messages.length > 0) localStorage.setItem("ceamis_chat_history_v2", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    const handleForceOpen = (e: any) => {
      const newValue = !!e.detail;
      if (newValue) {
        setIsOpen(false); // Auto-close main chat panel if an insight bubble appears
      }
      setForceOpenPose(prev => {
        if (prev !== newValue) {
          setIsClicking(true);
          setTimeout(() => setIsClicking(false), 400);
        }
        return newValue;
      });
    };
    
    const handleCloseChat = () => setIsOpen(false);

    window.addEventListener("cami-force-open", handleForceOpen);
    window.addEventListener("cami-close-chat", handleCloseChat);
    
    return () => {
      window.removeEventListener("cami-force-open", handleForceOpen);
      window.removeEventListener("cami-close-chat", handleCloseChat);
    };
  }, []);

  useEffect(() => {
    fetch(`${AI_URL}/health`, { signal: AbortSignal.timeout(8000) })
      .then(r => setIsConnected(r.ok))
      .catch(() => setIsConnected(false));
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const buildFinancialContext = useCallback(() => {
    const thisMonth = new Date().toLocaleDateString("id-ID", { month: "short", year: "numeric" });
    const monthlyTx = transactions.filter(tx => tx.date.includes(thisMonth.split(" ")[0]));
    const income = monthlyTx.filter(tx => tx.type === "pemasukan").reduce((s, tx) => s + tx.amount, 0);
    const expense = monthlyTx.filter(tx => tx.type === "pengeluaran").reduce((s, tx) => s + tx.amount, 0);
    return {
      user_name: userData.name,
      health_score: userData.healthScore,
      monthly_income: income,
      monthly_expense: expense,
      saving_rate_pct: income > 0 ? Math.round(((income - expense) / income) * 100) : 0,
      streak: userData.streak,
      level: userData.level,
    };
  }, [userData, transactions]);

  // Sembunyikan di halaman chatbot penuh (setelah semua hooks)
  const isOnChatbotPage = pathname === "/dashboard/chatbot";

  const handleSend = useCallback(async (text?: string) => {
    const msgText = (text || input).trim();
    if (!msgText || isTyping) return;
    const userMsg: ChatMessage = { id: Date.now(), role: "user", content: msgText };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    try {
      const history = [...messages, userMsg].filter(m => !m.isError).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch(`${AI_URL}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userData.id || "guest", messages: history, financial_context: buildFinancialContext() }),
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "assistant", content: data.reply, triggered: data.triggered }]);
      setIsConnected(true);
      if (!isOpen) setHasUnread(true);
    } catch {
      setIsConnected(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "assistant", content: t("dashboard.chatbot.connErrorText"), isError: true }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, messages, buildFinancialContext, isOpen, t]);

  const resetChat = () => {
    setMessages([{ id: 1, role: "assistant", content: t("dashboard.chatbot.initialMessage") }]);
    localStorage.removeItem("ceamis_chat_history_v2");
  };

  const statusDot = isConnected === null ? "#eab308" : isConnected ? "#22c55e" : "#ef4444";

  if (isOnChatbotPage) return null;

  return (
    <>
      <style>{`
        @keyframes widget-slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cami-float {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes cami-bounce-open {
          0%   { transform: scale(1) rotate(0deg); }
          30%  { transform: scale(1.12) rotate(-3deg); }
          60%  { transform: scale(0.94) rotate(2deg); }
          80%  { transform: scale(1.04) rotate(-1deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes cami-bounce-close {
          0%   { transform: scale(1) rotate(0deg); }
          40%  { transform: scale(0.9) rotate(3deg); }
          70%  { transform: scale(1.03) rotate(-1deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .cami-character-wrapper {
          transition: transform 0.3s ease;
        }
      `}</style>

      {/* ── CAMI Character FAB ─────────────────────────────────── */}
      <div
        className="cami-character-wrapper"
        style={{
          position: "fixed", bottom: "-440px", right: "-220px", zIndex: 1000,
          display: "flex", flexDirection: "column", alignItems: "center",
          cursor: isGuest ? "not-allowed" : "pointer",
          opacity: isGuest ? 0.5 : 1,
          userSelect: "none",
        }}
        onClick={() => {
          if (isGuest) return;
          setIsClicking(true);
          setTimeout(() => setIsClicking(false), 400);
          setIsOpen(o => !o);
        }}
        title={isGuest ? "Login untuk menggunakan CAMI" : "Tanya CAMI — AI Financial Assistant"}
      >
        {/* Character image */}
        <div style={{ position: "relative" }}>
          <img
            src={(isOpen || forceOpenPose) ? "/images/cami-pose-buka.png" : "/images/cami-pose-tutup.png"}
            alt="CAMI"
            style={{
              width: "700px",
              height: "700px",
              objectFit: "contain",
              objectPosition: "top",
              animation: isClicking
                ? ((isOpen || forceOpenPose)
                  ? "cami-bounce-open 0.4s cubic-bezier(0.34,1.56,0.64,1)"
                  : "cami-bounce-close 0.4s cubic-bezier(0.34,1.56,0.64,1)")
                : "none",
              filter: "drop-shadow(0px 0px 15px rgba(255,255,255,0.8)) drop-shadow(0px 12px 24px rgba(10,25,47,0.6))",
              transition: "src 0.2s ease",
              display: "block",
            }}
          />
          {/* Unread badge */}
          {hasUnread && !isOpen && (
            <span style={{
              position: "absolute", top: "4px", right: "0px",
              width: "20px", height: "20px", borderRadius: "50%",
              background: "var(--color-orange)", border: "2.5px solid var(--color-navy)",
              fontSize: "0.65rem", fontWeight: 900, color: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "2px 2px 0px var(--color-navy)",
            }}>!</span>
          )}
          {/* Status dot */}
          <span style={{
            position: "absolute", bottom: "8px", right: "4px",
            width: "12px", height: "12px", borderRadius: "50%",
            background: statusDot, border: "2.5px solid white",
            boxShadow: "1px 1px 0px var(--color-navy)",
          }} />
        </div>
      </div>

      {/* ── Chat Panel ───────────────────────────────────────────── */}
      {isOpen && !isGuest && (
        <div style={{
          position: "fixed", bottom: "40px", right: "240px", zIndex: 1010,
          animation: "widget-slide-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
          {/* Speech bubble tail — shadow layer */}
          <div style={{
            position: "absolute", bottom: "117px", right: "-20px",
            width: "24px", height: "24px",
            background: "var(--color-navy)",
            transform: "rotate(45deg)",
            zIndex: 998,
          }} />
          {/* Speech bubble tail — main layer */}
          <div style={{
            position: "absolute", bottom: "125px", right: "-12px",
            width: "24px", height: "24px",
            background: "#F5F3FF",
            borderRight: "3px solid var(--color-navy)",
            borderTop: "3px solid var(--color-navy)",
            transform: "rotate(45deg)",
            zIndex: 1001,
          }} />

          {/* Panel */}
          <div
            style={{
              width: "650px", height: "calc(100vh - 80px)", maxHeight: "650px",
              background: "#F5F3FF",
              border: "3px solid var(--color-navy)",
              borderRadius: "var(--radius-brutal-lg)",
              boxShadow: "8px 8px 0px var(--color-navy)",
              display: "flex", flexDirection: "column", overflow: "hidden",
              position: "relative", zIndex: 1000,
            }}
          >
          {/* Panel Header — purple gradient */}
          <div style={{
            background: "linear-gradient(135deg, var(--color-purple) 0%, #7C3AED 100%)",
            padding: "0.875rem 1.25rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: "3px solid var(--color-lime)", flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  width: "38px", height: "38px", background: "var(--color-lime)",
                  border: "2.5px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
                  boxShadow: "3px 3px 0px var(--color-navy)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Bot size={20} color="var(--color-navy)" strokeWidth={2.5} />
                </div>
                <span style={{
                  position: "absolute", top: "-3px", right: "-3px",
                  width: "10px", height: "10px", borderRadius: "50%",
                  background: statusDot, border: "2px solid var(--color-navy)",
                }} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "0.95rem", color: "var(--color-lime)", lineHeight: 1, letterSpacing: "0.5px" }}>
                  {t("dashboard.chatbot.title")}
                </div>
                <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.75)", fontWeight: 600, marginTop: "0.2rem" }}>
                  AI Financial Assistant
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                onClick={resetChat}
                title="Reset chat"
                style={{
                  background: "rgba(204,255,0,0.15)", border: "2px solid var(--color-lime)",
                  borderRadius: "var(--radius-brutal-sm)", width: "30px", height: "30px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "var(--color-lime)", transition: "all 0.15s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(204,255,0,0.3)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(204,255,0,0.15)")}
              >
                <RefreshCw size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="no-scrollbar"
            style={{
              flex: 1, overflowY: "auto", padding: "1rem",
              display: "flex", flexDirection: "column", gap: "0.875rem",
              background: "#F5F3FF",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="animate-slide-up"
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                  padding: "0.7rem 0.9rem",
                  borderRadius: "var(--radius-brutal-sm)",
                  border: msg.isError
                    ? "2px dashed var(--color-orange)"
                    : msg.role === "user"
                      ? "2.5px solid var(--color-navy)"
                      : "2.5px solid var(--color-navy)",
                  background: msg.role === "user"
                    ? "var(--color-purple)"
                    : msg.isError
                      ? "#FFF7ED"
                      : "var(--color-white)",
                  color: msg.role === "user" ? "var(--color-white)" : "var(--color-navy)",
                  boxShadow: msg.isError
                    ? "2px 2px 0px var(--color-orange)"
                    : msg.role === "user"
                      ? "3px 3px 0px var(--color-navy)"
                      : "3px 3px 0px var(--color-purple)",
                }}
              >
                {msg.role === "assistant" && (
                  <div style={{
                    fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "0.7rem",
                    color: msg.isError ? "var(--color-orange)" : "var(--color-purple)",
                    marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.3rem",
                    textTransform: "uppercase", letterSpacing: "0.8px",
                    borderBottom: "1.5px solid rgba(98,54,255,0.12)", paddingBottom: "0.3rem",
                  }}>
                    <Bot size={12} strokeWidth={2.5} />
                    {msg.isError ? t("dashboard.chatbot.connError") : t("dashboard.chatbot.title")}
                  </div>
                )}
                <div style={{ fontFamily: "var(--font-body)" }}>
                  {renderMarkdown(msg.content)}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{
                alignSelf: "flex-start", padding: "0.7rem 1rem",
                border: "2.5px solid var(--color-navy)", background: "var(--color-white)",
                borderRadius: "var(--radius-brutal-sm)", boxShadow: "3px 3px 0px var(--color-purple)",
                display: "flex", alignItems: "center", gap: "0.75rem",
              }}>
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "0.7rem", color: "var(--color-purple)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                  {t("dashboard.chatbot.camiThinking")}
                </span>
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", border: "2px solid var(--color-navy)", background: i % 2 === 0 ? "var(--color-purple)" : "var(--color-lime)", animation: `dot-bounce 0.6s infinite alternate ${d}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: "0.75rem", borderTop: "3px solid var(--color-navy)",
            background: "var(--color-white)", display: "flex", gap: "0.5rem", flexShrink: 0,
          }}>
            <div style={{ flex: 1, position: "relative" }}>
              <MessageSquare size={15} color="var(--color-purple)" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.5 }} />
              <input
                ref={inputRef}
                className="input-brutal"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                disabled={isTyping}
                placeholder={isTyping ? t("dashboard.chatbot.placeholderTyping") : t("dashboard.chatbot.placeholderReady")}
                style={{
                  width: "100%", paddingLeft: "2.25rem", paddingTop: "0.6rem", paddingBottom: "0.6rem",
                  fontSize: "0.875rem", border: "2.5px solid var(--color-navy)",
                  background: isTyping ? "#F5F3FF" : "var(--color-white)",
                  cursor: isTyping ? "not-allowed" : "text",
                  boxShadow: "2px 2px 0px var(--color-navy)",
                }}
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={isTyping || !input.trim()}
              style={{
                padding: "0 1rem", display: "flex", alignItems: "center", gap: "0.4rem",
                fontSize: "0.875rem", fontWeight: 800, flexShrink: 0,
                opacity: (isTyping || !input.trim()) ? 0.4 : 1,
                cursor: (isTyping || !input.trim()) ? "not-allowed" : "pointer",
                background: "var(--color-lime)",
                color: "var(--color-navy)",
                border: "2.5px solid var(--color-navy)",
                boxShadow: (isTyping || !input.trim()) ? "none" : "3px 3px 0px var(--color-navy)",
                borderRadius: "var(--radius-brutal-sm)",
                transition: "all 0.15s ease",
              }}
            >
              <Send size={15} strokeWidth={2.5} />
            </button>
          </div>
          </div>
        </div>
      )}
    </>
  );
}
