"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Wallet, ShoppingBag, Target, Shield,
  ArrowRight, ArrowLeft, CheckCircle2, Sparkles, ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { onboardingApi } from "@/lib/api";

const STEPS = [
  {
    id: 1, title: "Kenalan Dulu", subtitle: "Biar CEAMIS kenal kamu!", icon: User,
    accent: "#a78bfa", bg: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)", emoji: "👋"
  },
  {
    id: 2, title: "Pendapatan", subtitle: "Berapa pemasukan bulananmu?", icon: Wallet,
    accent: "#34d399", bg: "linear-gradient(135deg, #059669 0%, #0d9488 100%)", emoji: "💸"
  },
  {
    id: 3, title: "Pengeluaran", subtitle: "Uangmu kemana aja?", icon: ShoppingBag,
    accent: "#fb923c", bg: "linear-gradient(135deg, #ea580c 0%, #dc2626 100%)", emoji: "🛍️"
  },
  {
    id: 4, title: "Tujuan", subtitle: "Mau ke mana duitmu?", icon: Target,
    accent: "#60a5fa", bg: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)", emoji: "🎯"
  },
  {
    id: 5, title: "Profil Risiko", subtitle: "Tipe investor apa kamu?", icon: Shield,
    accent: "#facc15", bg: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", emoji: "🧠"
  },
];

const EXPENSE_CATEGORIES = [
  { label: "Kos / Kontrakan", emoji: "🏠" },
  { label: "Makan & Minum", emoji: "🍜" },
  { label: "Transportasi", emoji: "🚗" },
  { label: "Hiburan & Streaming", emoji: "🎬" },
  { label: "Belanja Online", emoji: "📦" },
  { label: "Pulsa & Internet", emoji: "📱" },
  { label: "Kesehatan", emoji: "💊" },
  { label: "Pendidikan", emoji: "📚" },
];

const FINANCIAL_GOALS = [
  { id: "tabungan",    label: "Menabung rutin",           desc: "Punya tabungan darurat 3-6 bulan", emoji: "💰" },
  { id: "investasi",  label: "Mulai investasi",           desc: "Belajar dan mulai investasi kecil-kecilan", emoji: "📈" },
  { id: "bebas_utang",label: "Bebas utang",               desc: "Melunasi semua utang yang ada", emoji: "🔓" },
  { id: "dana_darurat",label: "Dana darurat",             desc: "Siapkan untuk keadaan tidak terduga", emoji: "🛡️" },
  { id: "beli_gadget", label: "Beli gadget / impian",     desc: "Nabung untuk beli sesuatu yang diinginkan", emoji: "🎯" },
  { id: "traveling",  label: "Dana traveling",            desc: "Kumpulkan dana untuk jalan-jalan", emoji: "✈️" },
];

const RISK_PROFILES = [
  {
    id: "konservatif", label: "Konservatif", emoji: "🛡️",
    desc: "Aman dulu, baru untung. Prioritas ke tabungan dan dana darurat.",
    color: "#059669", tag: "AMAN & STABIL",
  },
  {
    id: "moderat", label: "Moderat", emoji: "⚖️",
    desc: "Seimbang antara aman dan cuan. Mix tabungan dan investasi ringan.",
    color: "#2563eb", tag: "BALANCED",
  },
  {
    id: "agresif", label: "Agresif", emoji: "🚀",
    desc: "Berani ambil risiko untuk return lebih besar. Cocok yang udah paham.",
    color: "#dc2626", tag: "HIGH RETURN",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [formData, setFormData] = useState({
    name: "", age: "", income: "", incomeSource: "gaji",
    topExpenses: [] as string[], monthlyExpense: "",
    goals: [] as string[], riskProfile: "",
  });

  const step = STEPS[currentStep - 1];
  const progress = (currentStep / STEPS.length) * 100;

  const goNext = () => {
    if (!canProceed()) return;
    setAnimating(true);
    setTimeout(() => { setCurrentStep(p => p + 1); setAnimating(false); }, 200);
  };
  const goPrev = () => {
    setAnimating(true);
    setTimeout(() => { setCurrentStep(p => p - 1); setAnimating(false); }, 200);
  };

  const toggleExpense = (cat: string) =>
    setFormData(p => ({ ...p, topExpenses: p.topExpenses.includes(cat) ? p.topExpenses.filter(c => c !== cat) : [...p.topExpenses, cat] }));

  const toggleGoal = (goal: string) =>
    setFormData(p => ({ ...p, goals: p.goals.includes(goal) ? p.goals.filter(g => g !== goal) : [...p.goals, goal] }));

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.name.trim() !== "" && formData.age !== "";
      case 2: return formData.income !== "";
      case 3: return formData.topExpenses.length > 0;
      case 4: return formData.goals.length > 0;
      case 5: return formData.riskProfile !== "";
      default: return false;
    }
  };

  const handleFinish = async () => {
    if (!canProceed()) return;
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await onboardingApi.save({
          user_id: user.id,
          name: formData.name,
          age: parseInt(formData.age),
          income: parseFloat(formData.income),
          income_source: formData.incomeSource,
          top_expenses: formData.topExpenses,
          monthly_expense: parseFloat(formData.monthlyExpense || "0"),
          goals: formData.goals,
          risk_profile: formData.riskProfile,
        });
      }
    } catch (err) {
      console.error("Onboarding save error:", err);
    } finally {
      setIsSubmitting(false);
      router.push("/dashboard");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "var(--font-body, 'Inter', sans-serif)", background: "#0f172a" }}>
      {/* LEFT PANEL */}
      <div style={{
        width: "380px", flexShrink: 0,
        background: step.bg,
        display: "flex", flexDirection: "column",
        padding: "2.5rem",
        position: "relative", overflow: "hidden",
        transition: "background 0.5s ease",
      }}>
        {/* Background decoration */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", marginBottom: "3rem" }}>
          <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,0.25)" }}>
            <img src="/images/logo_ceamis.png" alt="CEAMIS" style={{ width: 28, height: 28, objectFit: "contain" }} />
          </div>
          <span style={{ fontWeight: 900, fontSize: "1.1rem", letterSpacing: "3px", color: "white" }}>CEAMIS</span>
        </Link>

        {/* Step Info */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>{step.emoji}</div>
          <div style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "3px", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>
            LANGKAH {currentStep} DARI {STEPS.length}
          </div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "white", margin: "0 0 0.75rem 0", lineHeight: 1.1 }}>
            {step.title}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1rem", margin: 0, lineHeight: 1.6 }}>
            {step.subtitle}
          </p>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {STEPS.map((s) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", opacity: currentStep >= s.id ? 1 : 0.35, transition: "opacity 0.3s" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: currentStep > s.id ? "rgba(255,255,255,0.9)" : currentStep === s.id ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
                border: "2px solid rgba(255,255,255,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s",
              }}>
                {currentStep > s.id
                  ? <CheckCircle2 size={14} color="#059669" strokeWidth={3} />
                  : <s.icon size={12} color="white" />}
              </div>
              <span style={{ fontSize: "0.8rem", fontWeight: currentStep === s.id ? 800 : 500, color: currentStep === s.id ? "white" : "rgba(255,255,255,0.6)" }}>
                {s.title}
              </span>
              {currentStep === s.id && (
                <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "white" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0f172a", overflowY: "auto" }}>
        {/* Progress bar */}
        <div style={{ height: 4, background: "rgba(255,255,255,0.07)" }}>
          <div style={{ height: "100%", background: step.accent, width: `${progress}%`, transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)" }} />
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2.5rem" }}>
          <div
            style={{
              width: "100%", maxWidth: 560,
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(12px)" : "translateY(0)",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
          >
            {/* STEP 1 */}
            {currentStep === 1 && (
              <div>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "white", marginBottom: "0.5rem" }}>
                  Halo! Siapa namamu? 👋
                </h2>
                <p style={{ color: "#64748b", marginBottom: "2.5rem", fontSize: "0.95rem" }}>
                  Biar CEAMIS bisa kasih saran yang pas buat kamu.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <InputField
                    label="NAMA KAMU" placeholder="Masukkan nama kamu..."
                    value={formData.name} onChange={v => setFormData({ ...formData, name: v })}
                    accent={step.accent}
                  />
                  <InputField
                    label="UMUR" placeholder="Contoh: 21" type="number"
                    value={formData.age} onChange={v => setFormData({ ...formData, age: v })}
                    accent={step.accent}
                  />
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "white", marginBottom: "0.5rem" }}>
                  Berapa pendapatanmu? 💸
                </h2>
                <p style={{ color: "#64748b", marginBottom: "2.5rem", fontSize: "0.95rem" }}>
                  Tenang, data ini aman dan hanya untuk analisis pribadi kamu.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "2px", color: "#64748b", marginBottom: "0.75rem" }}>
                      SUMBER PENDAPATAN
                    </label>
                    <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                      {[
                        { id: "gaji", label: "💼 Gaji" },
                        { id: "freelance", label: "💻 Freelance" },
                        { id: "bisnis", label: "🏪 Bisnis" },
                        { id: "uang_saku", label: "🎓 Uang Saku" },
                      ].map(src => (
                        <button
                          key={src.id}
                          onClick={() => setFormData({ ...formData, incomeSource: src.id })}
                          style={{
                            padding: "0.6rem 1.25rem", borderRadius: 10, fontSize: "0.875rem", fontWeight: 700,
                            border: `2px solid ${formData.incomeSource === src.id ? step.accent : "rgba(255,255,255,0.1)"}`,
                            background: formData.incomeSource === src.id ? `${step.accent}22` : "rgba(255,255,255,0.04)",
                            color: formData.incomeSource === src.id ? step.accent : "#94a3b8",
                            cursor: "pointer", transition: "all 0.2s",
                          }}
                        >{src.label}</button>
                      ))}
                    </div>
                  </div>
                  <InputField
                    label="PENDAPATAN BULANAN (RP)" placeholder="0" type="number"
                    value={formData.income} onChange={v => setFormData({ ...formData, income: v })}
                    accent={step.accent} prefix="Rp"
                  />
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "white", marginBottom: "0.5rem" }}>
                  Uangmu habis ke mana? 🛍️
                </h2>
                <p style={{ color: "#64748b", marginBottom: "2rem", fontSize: "0.95rem" }}>
                  Pilih kategori pengeluaran rutin kamu (bisa lebih dari satu).
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "1.5rem" }}>
                  {EXPENSE_CATEGORIES.map(cat => {
                    const sel = formData.topExpenses.includes(cat.label);
                    return (
                      <button
                        key={cat.label}
                        onClick={() => toggleExpense(cat.label)}
                        style={{
                          padding: "0.875rem 1rem", borderRadius: 12, fontSize: "0.875rem", fontWeight: 700,
                          border: `2px solid ${sel ? step.accent : "rgba(255,255,255,0.08)"}`,
                          background: sel ? `${step.accent}22` : "rgba(255,255,255,0.04)",
                          color: sel ? step.accent : "#94a3b8",
                          cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem",
                          transition: "all 0.2s", textAlign: "left",
                        }}
                      >
                        <span style={{ fontSize: "1.1rem" }}>{cat.emoji}</span>
                        <span>{cat.label}</span>
                        {sel && <CheckCircle2 size={14} style={{ marginLeft: "auto", flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
                <InputField
                  label="ESTIMASI PENGELUARAN BULANAN (RP)" placeholder="0" type="number"
                  value={formData.monthlyExpense} onChange={v => setFormData({ ...formData, monthlyExpense: v })}
                  accent={step.accent} prefix="Rp"
                />
              </div>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <div>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "white", marginBottom: "0.5rem" }}>
                  Mau ke mana duitmu? 🎯
                </h2>
                <p style={{ color: "#64748b", marginBottom: "2rem", fontSize: "0.95rem" }}>
                  Pilih tujuan finansial kamu (bisa lebih dari satu).
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {FINANCIAL_GOALS.map(goal => {
                    const sel = formData.goals.includes(goal.id);
                    return (
                      <button
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        style={{
                          padding: "1rem 1.25rem", borderRadius: 12, textAlign: "left",
                          border: `2px solid ${sel ? step.accent : "rgba(255,255,255,0.08)"}`,
                          background: sel ? `${step.accent}18` : "rgba(255,255,255,0.04)",
                          cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem",
                          transition: "all 0.2s",
                        }}
                      >
                        <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{goal.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: "0.9rem", color: sel ? step.accent : "white" }}>{goal.label}</div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.15rem" }}>{goal.desc}</div>
                        </div>
                        {sel && <CheckCircle2 size={18} color={step.accent} style={{ flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {currentStep === 5 && (
              <div>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "white", marginBottom: "0.5rem" }}>
                  Gaya finansialmu gimana? 🧠
                </h2>
                <p style={{ color: "#64748b", marginBottom: "2rem", fontSize: "0.95rem" }}>
                  Pilih profil yang paling cocok dengan kepribadian finansialmu.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {RISK_PROFILES.map(profile => {
                    const sel = formData.riskProfile === profile.id;
                    return (
                      <button
                        key={profile.id}
                        onClick={() => setFormData({ ...formData, riskProfile: profile.id })}
                        style={{
                          padding: "1.25rem 1.5rem", borderRadius: 16, textAlign: "left",
                          border: `2px solid ${sel ? profile.color : "rgba(255,255,255,0.08)"}`,
                          background: sel ? `${profile.color}18` : "rgba(255,255,255,0.04)",
                          cursor: "pointer", display: "flex", alignItems: "center", gap: "1.25rem",
                          transition: "all 0.25s",
                          boxShadow: sel ? `0 0 0 4px ${profile.color}22` : "none",
                        }}
                      >
                        <span style={{ fontSize: "2.2rem", flexShrink: 0 }}>{profile.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                            <span style={{ fontWeight: 900, fontSize: "1.05rem", color: sel ? profile.color : "white" }}>{profile.label}</span>
                            <span style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "1.5px", color: profile.color, background: `${profile.color}22`, padding: "2px 8px", borderRadius: 4 }}>
                              {profile.tag}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5 }}>{profile.desc}</div>
                        </div>
                        {sel && <CheckCircle2 size={20} color={profile.color} style={{ flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* NAV BUTTONS */}
            <div style={{ display: "flex", gap: "1rem", marginTop: "2.5rem" }}>
              {currentStep > 1 && (
                <button
                  onClick={goPrev}
                  style={{
                    padding: "0.875rem 1.5rem", borderRadius: 12, fontWeight: 700, fontSize: "0.9rem",
                    background: "rgba(255,255,255,0.06)", color: "#94a3b8",
                    border: "1.5px solid rgba(255,255,255,0.1)", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    transition: "all 0.2s",
                  }}
                >
                  <ArrowLeft size={16} /> Kembali
                </button>
              )}

              {currentStep < STEPS.length ? (
                <button
                  onClick={goNext}
                  disabled={!canProceed()}
                  style={{
                    flex: 1, padding: "0.875rem 1.5rem", borderRadius: 12,
                    fontWeight: 800, fontSize: "1rem",
                    background: canProceed() ? step.accent : "rgba(255,255,255,0.06)",
                    color: canProceed() ? "#0f172a" : "#334155",
                    border: "none", cursor: canProceed() ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    transition: "all 0.25s",
                    boxShadow: canProceed() ? `0 8px 24px ${step.accent}44` : "none",
                    transform: canProceed() ? "translateY(0)" : "none",
                  }}
                >
                  Lanjut <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  disabled={!canProceed() || isSubmitting}
                  style={{
                    flex: 1, padding: "0.875rem 1.5rem", borderRadius: 12,
                    fontWeight: 900, fontSize: "1rem",
                    background: canProceed() ? "linear-gradient(135deg, #a78bfa, #60a5fa)" : "rgba(255,255,255,0.06)",
                    color: canProceed() ? "white" : "#334155",
                    border: "none", cursor: canProceed() ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                    transition: "all 0.25s",
                    boxShadow: canProceed() ? "0 8px 32px rgba(167,139,250,0.4)" : "none",
                  }}
                >
                  <Sparkles size={20} />
                  {isSubmitting ? "Menyimpan..." : "Masuk ke Dashboard!"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Reusable Input Component ──────────────────────────────────────────────────

function InputField({
  label, placeholder, value, onChange, type = "text", accent, prefix,
}: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; type?: string;
  accent: string; prefix?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "2px", color: focused ? accent : "#64748b", marginBottom: "0.6rem", transition: "color 0.2s" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {prefix && (
          <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontWeight: 800, color: "#475569", fontSize: "0.95rem" }}>
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            width: "100%", padding: prefix ? "1rem 1rem 1rem 3rem" : "1rem",
            background: "rgba(255,255,255,0.05)",
            border: `2px solid ${focused ? accent : "rgba(255,255,255,0.08)"}`,
            borderRadius: 12, color: "white", fontSize: "1rem", fontWeight: 600,
            outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
            boxShadow: focused ? `0 0 0 4px ${accent}22` : "none",
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}
