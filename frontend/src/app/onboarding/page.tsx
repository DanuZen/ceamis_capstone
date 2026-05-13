"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Wallet, ShoppingBag, Target, Shield,
  ArrowRight, ArrowLeft, CheckCircle2, Sparkles,
  ChevronRight, Zap
} from "lucide-react";

const STEPS = [
  { id: 1, title: "Kenalan Dulu", icon: User, color: "purple" },
  { id: 2, title: "Pendapatan", icon: Wallet, color: "lime" },
  { id: 3, title: "Pengeluaran", icon: ShoppingBag, color: "orange" },
  { id: 4, title: "Tujuan Finansial", icon: Target, color: "purple" },
  { id: 5, title: "Profil Risiko", icon: Shield, color: "lime" },
];

const EXPENSE_CATEGORIES = [
  "Kos / Kontrakan", "Makan & Minum", "Transportasi",
  "Hiburan & Streaming", "Belanja Online", "Pulsa & Internet",
  "Kesehatan", "Pendidikan"
];

const FINANCIAL_GOALS = [
  { id: "tabungan", label: "Menabung rutin", desc: "Punya tabungan darurat 3-6 bulan", icon: "💰" },
  { id: "investasi", label: "Mulai investasi", desc: "Belajar dan mulai investasi kecil-kecilan", icon: "📈" },
  { id: "bebas_utang", label: "Bebas utang", desc: "Melunasi semua utang yang ada", icon: "🔓" },
  { id: "dana_darurat", label: "Dana darurat", desc: "Siapkan dana untuk keadaan tidak terduga", icon: "🛡️" },
  { id: "beli_gadget", label: "Beli gadget / barang impian", desc: "Nabung untuk beli sesuatu yang diinginkan", icon: "🎯" },
  { id: "traveling", label: "Dana traveling", desc: "Kumpulkan dana untuk jalan-jalan", icon: "✈️" },
];

const RISK_PROFILES = [
  {
    id: "konservatif",
    label: "Konservatif",
    desc: "Aman dulu, baru untung. Prioritas ke tabungan dan dana darurat.",
    emoji: "🛡️",
    color: "lime",
  },
  {
    id: "moderat",
    label: "Moderat",
    desc: "Seimbang antara aman dan cuan. Mix tabungan dan investasi ringan.",
    emoji: "⚖️",
    color: "purple",
  },
  {
    id: "agresif",
    label: "Agresif",
    desc: "Berani ambil risiko untuk return lebih besar. Cocok yang udah paham.",
    emoji: "🚀",
    color: "orange",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    income: "",
    incomeSource: "gaji",
    topExpenses: [] as string[],
    monthlyExpense: "",
    goals: [] as string[],
    riskProfile: "",
  });

  const progress = (currentStep / STEPS.length) * 100;

  const toggleExpense = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      topExpenses: prev.topExpenses.includes(cat)
        ? prev.topExpenses.filter(c => c !== cat)
        : [...prev.topExpenses, cat]
    }));
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

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

  const handleFinish = () => {
    // In production, this would send data to the backend
    console.log("Onboarding data:", formData);
    router.push("/dashboard");
  };

  const cardStyle: React.CSSProperties = {
    background: "var(--color-white)",
    border: "4px solid var(--color-navy)",
    borderRadius: "var(--radius-brutal)",
    padding: "3rem",
    boxShadow: "10px 10px 0px var(--color-navy)",
    width: "100%",
    maxWidth: "640px",
    position: "relative",
    overflow: "hidden",
  };

  return (
    <div style={{ width: "100%", maxWidth: "700px", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
      {/* Top Bar */}
      <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "64px", height: "64px", display: "flex",
            alignItems: "center", justifyContent: "center"
          }}>
            <img src="/images/logo_ceamis.png" alt="CEAMIS Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <span style={{ fontWeight: 900, fontSize: "1.25rem", letterSpacing: "2px", color: "var(--color-navy)" }}>CEAMIS</span>
        </Link>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-text-muted)" }}>
          Step {currentStep} / {STEPS.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ width: "100%", height: "12px", background: "var(--color-bg)", border: "2px solid var(--color-navy)", borderRadius: "100px", overflow: "hidden" }}>
        <div style={{
          width: `${progress}%`, height: "100%", background: `var(--color-${STEPS[currentStep - 1].color})`,
          transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)", borderRadius: "100px",
        }} />
      </div>

      {/* Step Indicators */}
      <div style={{ display: "flex", gap: "0.5rem", width: "100%", justifyContent: "center" }}>
        {STEPS.map((step) => (
          <div key={step.id} style={{
            display: "flex", alignItems: "center", gap: "0.35rem",
            padding: "0.3rem 0.6rem", borderRadius: "var(--radius-brutal-sm)",
            border: `2px solid ${currentStep >= step.id ? "var(--color-navy)" : "var(--color-border-light)"}`,
            background: currentStep === step.id ? `var(--color-${step.color})` : currentStep > step.id ? "var(--color-lime)" : "var(--color-white)",
            opacity: currentStep >= step.id ? 1 : 0.5,
            fontSize: "0.7rem", fontWeight: 800, color: "var(--color-navy)",
            transition: "all 0.3s",
          }}>
            {currentStep > step.id ? <CheckCircle2 size={12} /> : <step.icon size={12} />}
            <span style={{ display: currentStep === step.id ? "inline" : "none" }}>{step.title}</span>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div style={cardStyle}>
        {/* Step 1 — Kenalan */}
        {currentStep === 1 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <div style={{
                width: "48px", height: "48px", background: "var(--color-purple)",
                borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)",
                boxShadow: "3px 3px 0px var(--color-navy)", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <User size={24} color="var(--color-white)" strokeWidth={2.5} />
              </div>
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", margin: 0, color: "var(--color-navy)" }}>
                  Kenalan dulu, yuk! 👋
                </h2>
              </div>
            </div>
            <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem", fontSize: "1rem" }}>
              Biar CEAMIS bisa kasih saran yang pas buat kamu.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.9rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                  NAMA KAMU
                </label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-brutal"
                  placeholder="Masukkan nama kamu..."
                  style={{ border: "3px solid var(--color-navy)", padding: "1rem", fontSize: "1.125rem", width: "100%", boxShadow: "4px 4px 0px var(--color-navy)", background: "var(--color-bg)" }}
                />
              </div>
              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.9rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                  UMUR
                </label>
                <input
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="input-brutal"
                  type="number"
                  placeholder="Contoh: 21"
                  style={{ border: "3px solid var(--color-navy)", padding: "1rem", fontSize: "1.125rem", width: "100%", boxShadow: "4px 4px 0px var(--color-navy)", background: "var(--color-bg)" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Pendapatan */}
        {currentStep === 2 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <div style={{
                width: "48px", height: "48px", background: "var(--color-lime)",
                borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)",
                boxShadow: "3px 3px 0px var(--color-navy)", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <Wallet size={24} color="var(--color-navy)" strokeWidth={2.5} />
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", margin: 0, color: "var(--color-navy)" }}>
                Berapa pendapatanmu? 💸
              </h2>
            </div>
            <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem", fontSize: "1rem" }}>
              Tenang, data ini aman dan cuma buat analisis pribadi kamu.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.9rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                  SUMBER PENDAPATAN UTAMA
                </label>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {["gaji", "freelance", "bisnis", "uang_saku"].map((src) => (
                    <button
                      key={src}
                      onClick={() => setFormData({ ...formData, incomeSource: src })}
                      className="btn-brutal"
                      style={{
                        padding: "0.6rem 1.25rem", fontSize: "0.9rem", fontWeight: 800,
                        background: formData.incomeSource === src ? "var(--color-lime)" : "var(--color-white)",
                        transform: formData.incomeSource === src ? "translate(-2px, -2px)" : "none",
                        boxShadow: formData.incomeSource === src ? "4px 4px 0px var(--color-navy)" : "2px 2px 0px var(--color-navy)",
                      }}
                    >
                      {src === "gaji" && "💼 Gaji"}
                      {src === "freelance" && "💻 Freelance"}
                      {src === "bisnis" && "🏪 Bisnis"}
                      {src === "uang_saku" && "🎓 Uang Saku"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.9rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                  PENDAPATAN BULANAN (RP)
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.125rem", fontWeight: 800, color: "var(--color-navy)" }}>Rp</span>
                  <input
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                    className="input-brutal"
                    type="number"
                    placeholder="0"
                    style={{ border: "3px solid var(--color-navy)", padding: "1rem 1rem 1rem 3rem", fontSize: "1.125rem", width: "100%", fontWeight: 800, boxShadow: "4px 4px 0px var(--color-navy)", background: "var(--color-bg)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Pengeluaran */}
        {currentStep === 3 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <div style={{
                width: "48px", height: "48px", background: "var(--color-orange)",
                borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)",
                boxShadow: "3px 3px 0px var(--color-navy)", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <ShoppingBag size={24} color="var(--color-navy)" strokeWidth={2.5} />
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", margin: 0, color: "var(--color-navy)" }}>
                Uangmu habis ke mana? 🤔
              </h2>
            </div>
            <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem", fontSize: "1rem" }}>
              Pilih kategori pengeluaran rutin utama kamu (bisa lebih dari satu).
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {EXPENSE_CATEGORIES.map((cat) => {
                const selected = formData.topExpenses.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleExpense(cat)}
                    className="btn-brutal"
                    style={{
                      padding: "1rem", fontSize: "0.9rem", fontWeight: 800, textAlign: "left",
                      background: selected ? "var(--color-orange)" : "var(--color-white)",
                      color: selected ? "var(--color-white)" : "var(--color-navy)",
                      transform: selected ? "translate(-2px, -2px)" : "none",
                      boxShadow: selected ? "4px 4px 0px var(--color-navy)" : "2px 2px 0px var(--color-navy)",
                      display: "flex", alignItems: "center", gap: "0.5rem",
                    }}
                  >
                    {selected ? <CheckCircle2 size={16} /> : <ChevronRight size={16} />}
                    {cat}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.9rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                ESTIMASI PENGELUARAN BULANAN (RP)
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.125rem", fontWeight: 800, color: "var(--color-navy)" }}>Rp</span>
                <input
                  value={formData.monthlyExpense}
                  onChange={(e) => setFormData({ ...formData, monthlyExpense: e.target.value })}
                  className="input-brutal"
                  type="number"
                  placeholder="0"
                  style={{ border: "3px solid var(--color-navy)", padding: "1rem 1rem 1rem 3rem", fontSize: "1.125rem", width: "100%", fontWeight: 800, boxShadow: "4px 4px 0px var(--color-navy)", background: "var(--color-bg)" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — Tujuan Finansial */}
        {currentStep === 4 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <div style={{
                width: "48px", height: "48px", background: "var(--color-purple)",
                borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)",
                boxShadow: "3px 3px 0px var(--color-navy)", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <Target size={24} color="var(--color-white)" strokeWidth={2.5} />
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", margin: 0, color: "var(--color-navy)" }}>
                Mau ke mana duitmu? 🎯
              </h2>
            </div>
            <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem", fontSize: "1rem" }}>
              Pilih tujuan finansial kamu (bisa lebih dari satu).
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {FINANCIAL_GOALS.map((goal) => {
                const selected = formData.goals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className="btn-brutal"
                    style={{
                      padding: "1.25rem", textAlign: "left",
                      background: selected ? "var(--color-purple)" : "var(--color-white)",
                      color: selected ? "var(--color-white)" : "var(--color-navy)",
                      transform: selected ? "translate(-2px, -2px)" : "none",
                      boxShadow: selected ? "4px 4px 0px var(--color-navy)" : "2px 2px 0px var(--color-navy)",
                      display: "flex", alignItems: "center", gap: "1rem",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>{goal.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1rem" }}>{goal.label}</div>
                      <div style={{ fontSize: "0.8rem", opacity: 0.8, fontWeight: 500, marginTop: "0.15rem" }}>{goal.desc}</div>
                    </div>
                    {selected && <CheckCircle2 size={20} style={{ marginLeft: "auto" }} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5 — Profil Risiko */}
        {currentStep === 5 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <div style={{
                width: "48px", height: "48px", background: "var(--color-lime)",
                borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)",
                boxShadow: "3px 3px 0px var(--color-navy)", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <Shield size={24} color="var(--color-navy)" strokeWidth={2.5} />
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", margin: 0, color: "var(--color-navy)" }}>
                Gaya finansialmu gimana? 🧠
              </h2>
            </div>
            <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem", fontSize: "1rem" }}>
              Pilih profil yang paling cocok dengan kepribadian finansialmu.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {RISK_PROFILES.map((profile) => {
                const selected = formData.riskProfile === profile.id;
                return (
                  <button
                    key={profile.id}
                    onClick={() => setFormData({ ...formData, riskProfile: profile.id })}
                    className="btn-brutal"
                    style={{
                      padding: "1.5rem", textAlign: "left",
                      background: selected ? `var(--color-${profile.color})` : "var(--color-white)",
                      color: selected && profile.color !== "lime" ? "var(--color-white)" : "var(--color-navy)",
                      transform: selected ? "translate(-3px, -3px)" : "none",
                      boxShadow: selected ? "6px 6px 0px var(--color-navy)" : "3px 3px 0px var(--color-navy)",
                      display: "flex", alignItems: "center", gap: "1.25rem",
                      border: selected ? "3px solid var(--color-navy)" : "3px solid var(--color-navy)",
                    }}
                  >
                    <span style={{ fontSize: "2.5rem" }}>{profile.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 900, fontSize: "1.25rem", fontFamily: "var(--font-heading)" }}>{profile.label}</div>
                      <div style={{ fontSize: "0.9rem", opacity: 0.85, fontWeight: 500, marginTop: "0.25rem", lineHeight: 1.4 }}>{profile.desc}</div>
                    </div>
                    {selected && <CheckCircle2 size={24} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", gap: "1rem", width: "100%", maxWidth: "640px" }}>
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="btn-brutal"
            style={{
              padding: "1rem 1.5rem", fontWeight: 800, fontSize: "1rem",
              background: "var(--color-white)", display: "flex", alignItems: "center", gap: "0.5rem",
              boxShadow: "4px 4px 0px var(--color-navy)",
            }}
          >
            <ArrowLeft size={18} /> Kembali
          </button>
        )}
        
        {currentStep < STEPS.length ? (
          <button
            onClick={() => canProceed() && setCurrentStep(prev => prev + 1)}
            className="btn-brutal"
            style={{
              flex: 1, padding: "1rem 1.5rem", fontWeight: 800, fontSize: "1rem",
              background: canProceed() ? "var(--color-navy)" : "var(--color-border-light)",
              color: canProceed() ? "var(--color-white)" : "var(--color-text-muted)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              boxShadow: canProceed() ? "4px 4px 0px var(--color-purple)" : "none",
              cursor: canProceed() ? "pointer" : "not-allowed",
              opacity: canProceed() ? 1 : 0.6,
            }}
          >
            Lanjut <ArrowRight size={18} />
          </button>
        ) : (
          <button
            onClick={() => canProceed() && handleFinish()}
            className="btn-brutal"
            style={{
              flex: 1, padding: "1rem 1.5rem", fontWeight: 900, fontSize: "1.125rem",
              background: canProceed() ? "var(--color-lime)" : "var(--color-border-light)",
              color: "var(--color-navy)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
              boxShadow: canProceed() ? "6px 6px 0px var(--color-navy)" : "none",
              cursor: canProceed() ? "pointer" : "not-allowed",
              opacity: canProceed() ? 1 : 0.6,
            }}
          >
            <Sparkles size={20} /> Masuk ke Dashboard!
          </button>
        )}
      </div>
    </div>
  );
}
