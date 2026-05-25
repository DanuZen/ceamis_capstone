"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Wallet, ShoppingBag, Target, Shield,
  ArrowRight, ArrowLeft, CheckCircle2, Sparkles,
  Home, Utensils, Car, Tv, Package, Smartphone, HeartPulse, GraduationCap,
  PiggyBank, TrendingUp, Unlock, Umbrella, Laptop, Plane,
  ShieldCheck, Scale, Rocket, Briefcase, Store
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { onboardingApi } from "@/lib/api";

const STEPS = [
  {
    id: 1, title: "Kenalan Dulu", subtitle: "Biar CEAMIS kenal kamu!", icon: User,
    accent: "var(--color-purple)", bg: "var(--color-purple)", textColor: "var(--color-white)"
  },
  {
    id: 2, title: "Pendapatan", subtitle: "Berapa pemasukan bulananmu?", icon: Wallet,
    accent: "var(--color-lime)", bg: "var(--color-lime)", textColor: "var(--color-navy)"
  },
  {
    id: 3, title: "Pengeluaran", subtitle: "Uangmu kemana aja?", icon: ShoppingBag,
    accent: "var(--color-pink)", bg: "var(--color-pink)", textColor: "var(--color-navy)"
  },
  {
    id: 4, title: "Tujuan", subtitle: "Mau ke mana duitmu?", icon: Target,
    accent: "var(--color-orange)", bg: "var(--color-orange)", textColor: "var(--color-navy)"
  },
  {
    id: 5, title: "Profil Risiko", subtitle: "Tipe investor apa kamu?", icon: Shield,
    accent: "var(--color-warning)", bg: "var(--color-warning)", textColor: "var(--color-navy)"
  },
];

const INCOME_SOURCES = [
  { id: "gaji", label: "Gaji", icon: Briefcase },
  { id: "freelance", label: "Freelance", icon: Laptop },
  { id: "bisnis", label: "Bisnis", icon: Store },
  { id: "uang_saku", label: "Uang Saku", icon: GraduationCap },
];

const EXPENSE_CATEGORIES = [
  { label: "Kos / Kontrakan", icon: Home },
  { label: "Makan & Minum", icon: Utensils },
  { label: "Transportasi", icon: Car },
  { label: "Hiburan", icon: Tv },
  { label: "Belanja Online", icon: Package },
  { label: "Pulsa & Internet", icon: Smartphone },
  { label: "Kesehatan", icon: HeartPulse },
  { label: "Pendidikan", icon: GraduationCap },
];

const FINANCIAL_GOALS = [
  { id: "tabungan",    label: "Menabung rutin",           desc: "Punya tabungan darurat 3-6 bulan", icon: PiggyBank },
  { id: "investasi",  label: "Mulai investasi",           desc: "Belajar & investasi kecil-kecilan", icon: TrendingUp },
  { id: "bebas_utang",label: "Bebas utang",               desc: "Melunasi semua utang", icon: Unlock },
  { id: "dana_darurat",label: "Dana darurat",             desc: "Siapkan untuk tak terduga", icon: Umbrella },
  { id: "beli_gadget", label: "Beli impian",              desc: "Nabung untuk sesuatu", icon: Laptop },
  { id: "traveling",  label: "Dana traveling",            desc: "Dana untuk jalan-jalan", icon: Plane },
];

const RISK_PROFILES = [
  {
    id: "konservatif", label: "Konservatif", icon: ShieldCheck,
    desc: "Aman dulu, baru untung. Prioritas tabungan.",
    color: "var(--color-lime)", tag: "AMAN & STABIL",
  },
  {
    id: "moderat", label: "Moderat", icon: Scale,
    desc: "Seimbang aman & cuan. Mix tabungan & investasi.",
    color: "var(--color-info)", tag: "BALANCED",
  },
  {
    id: "agresif", label: "Agresif", icon: Rocket,
    desc: "Berani ambil risiko untuk return lebih besar.",
    color: "var(--color-pink)", tag: "HIGH RETURN",
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
    setTimeout(() => { setCurrentStep(p => p + 1); setAnimating(false); }, 150);
  };
  const goPrev = () => {
    setAnimating(true);
    setTimeout(() => { setCurrentStep(p => p - 1); setAnimating(false); }, 150);
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
    <div style={{ height: "100vh", display: "flex", fontFamily: "var(--font-body)", background: "var(--color-bg)", overflow: "hidden" }}>
      <style dangerouslySetInnerHTML={{__html: `
        .selectable-card {
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .selectable-card:not(.selected):hover {
          transform: translate(-3px, -3px) !important;
          box-shadow: 5px 5px 0px var(--color-navy) !important;
        }
        .selectable-card.selected {
          transform: translate(2px, 2px) !important;
          box-shadow: 0px 0px 0px var(--color-navy) !important;
          border-color: var(--color-navy) !important;
        }
        .animate-float-slow {
          animation: float 5s ease-in-out infinite;
        }
      `}} />

      {/* LEFT PANEL */}
      <div style={{
        width: "520px", flexShrink: 0,
        background: step.bg,
        borderRight: "4px solid var(--color-navy)",
        display: "flex", flexDirection: "column",
        padding: "2.5rem",
        position: "relative", overflow: "hidden",
        transition: "background 0.4s ease",
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `linear-gradient(rgba(10, 25, 47, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(10, 25, 47, 0.05) 1px, transparent 1px)`,
          backgroundSize: "28px 28px", pointerEvents: "none"
        }} />
        <div className="animate-float-slow" style={{ position: "absolute", top: "-30px", right: "-30px", opacity: 0.15 }}>
          <Sparkles size={200} color={step.textColor} strokeWidth={1} />
        </div>
        <div style={{ position: "absolute", bottom: "-20px", left: "-40px", opacity: 0.08, transform: "rotate(-15deg)" }}>
          <step.icon size={320} color={step.textColor} strokeWidth={1} />
        </div>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", marginBottom: "auto", zIndex: 1 }}>
          <img src="/images/logo_ceamis.png" alt="CEAMIS" style={{ width: 56, height: 56, objectFit: "contain" }} />
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "2rem", letterSpacing: "2px", color: step.textColor }}>CEAMIS</span>
        </Link>

        {/* Step Info */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", zIndex: 1, margin: "2.5rem 0" }}>
          <div className="animate-bounce-in" key={currentStep} style={{ marginBottom: "1.75rem" }}>
            <div className="animate-float" style={{
              width: "88px", height: "88px", background: "var(--color-white)",
              borderRadius: "var(--radius-brutal)", border: "3px solid var(--color-navy)",
              boxShadow: "4px 4px 0px var(--color-navy)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transform: "rotate(-2deg)"
            }}>
              <step.icon size={48} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
          </div>

          <div className="badge-brutal" style={{ alignSelf: "flex-start", background: "var(--color-white)", color: "var(--color-navy)", marginBottom: "1rem", fontSize: "0.8rem", padding: "0.25rem 0.75rem", fontWeight: 800, letterSpacing: "1px" }}>
            LANGKAH {currentStep} DARI {STEPS.length}
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.8rem", fontWeight: 800, color: step.textColor, margin: "0 0 0.5rem 0", lineHeight: 1.1 }}>
            {step.title}
          </h1>
          <p style={{ color: step.textColor, opacity: 0.9, fontSize: "1.15rem", margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
            {step.subtitle}
          </p>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", zIndex: 1, marginTop: "auto" }}>
          {STEPS.map((s) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", opacity: currentStep >= s.id ? 1 : 0.5, transition: "opacity 0.3s" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: currentStep > s.id ? "var(--color-success)" : currentStep === s.id ? "var(--color-white)" : "transparent",
                border: "2px solid",
                borderColor: currentStep >= s.id ? "var(--color-navy)" : step.textColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: currentStep >= s.id ? "2px 2px 0px var(--color-navy)" : "none",
                transition: "all 0.3s",
              }}>
                {currentStep > s.id
                  ? <CheckCircle2 size={18} color="var(--color-navy)" strokeWidth={3} />
                  : <s.icon size={16} color={currentStep === s.id ? "var(--color-navy)" : step.textColor} />}
              </div>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: currentStep === s.id ? 800 : 600, color: step.textColor }}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--color-bg)", overflowY: "auto" }}>
        {/* Progress bar */}
        <div style={{ height: 8, background: "rgba(10, 25, 47, 0.05)", borderBottom: "3px solid var(--color-navy)", flexShrink: 0 }}>
          <div style={{ height: "100%", background: step.accent, width: `${progress}%`, transition: "width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)", borderRight: "3px solid var(--color-navy)" }} />
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem 2rem", overflowY: "auto" }}>
          <div
            style={{
              width: "100%", maxWidth: 640,
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(12px)" : "translateY(0)",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
          >
            {/* STEP 1 */}
            {currentStep === 1 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "0.25rem" }}>
                  Halo! Siapa namamu?
                </h2>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem", fontSize: "1rem", fontWeight: 500 }}>
                  Biar CEAMIS bisa kasih saran yang pas buat kamu.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
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
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "0.25rem" }}>
                  Berapa pendapatanmu?
                </h2>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem", fontSize: "1rem", fontWeight: 500 }}>
                  Tenang, data ini aman dan hanya untuk analisis pribadi kamu.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 800, letterSpacing: "1px", color: "var(--color-navy)", marginBottom: "0.75rem" }}>
                      SUMBER PENDAPATAN
                    </label>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                      {INCOME_SOURCES.map(src => {
                        const isSelected = formData.incomeSource === src.id;
                        return (
                          <button
                            key={src.id}
                            onClick={() => setFormData({ ...formData, incomeSource: src.id })}
                            className={`selectable-card ${isSelected ? 'selected' : ''}`}
                            style={{
                              padding: "0.6rem 1rem", borderRadius: "var(--radius-brutal-sm)", fontSize: "0.9rem", fontWeight: 700,
                              border: "2px solid var(--color-navy)",
                              background: isSelected ? step.accent : "var(--color-white)",
                              color: "var(--color-navy)",
                              cursor: "pointer",
                              boxShadow: "2px 2px 0px var(--color-navy)",
                              display: "flex", alignItems: "center", gap: "0.5rem"
                            }}
                          >
                            <src.icon size={16} strokeWidth={2.5} />
                            {src.label}
                          </button>
                        );
                      })}
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
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "0.25rem" }}>
                  Uangmu habis ke mana?
                </h2>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem", fontSize: "1rem", fontWeight: 500 }}>
                  Pilih kategori pengeluaran rutin kamu (bisa lebih dari satu).
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "1.5rem" }}>
                  {EXPENSE_CATEGORIES.map(cat => {
                    const sel = formData.topExpenses.includes(cat.label);
                    return (
                      <button
                        key={cat.label}
                        onClick={() => toggleExpense(cat.label)}
                        className={`selectable-card ${sel ? 'selected' : ''}`}
                        style={{
                          padding: "0.75rem", borderRadius: "var(--radius-brutal-sm)", fontSize: "0.85rem", fontWeight: 700,
                          background: sel ? step.accent : "var(--color-white)",
                          color: "var(--color-navy)",
                          cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem",
                          textAlign: "left",
                          border: "2px solid var(--color-navy)",
                          boxShadow: "2px 2px 0px var(--color-navy)",
                        }}
                      >
                        <span style={{ background: "var(--color-white)", borderRadius: "6px", padding: "6px", border: "1.5px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <cat.icon size={18} strokeWidth={2.5} color="var(--color-navy)" />
                        </span>
                        <span>{cat.label}</span>
                        {sel && <CheckCircle2 size={18} color="var(--color-navy)" style={{ marginLeft: "auto", flexShrink: 0 }} strokeWidth={3} />}
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
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "0.25rem" }}>
                  Mau ke mana duitmu?
                </h2>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem", fontSize: "1rem", fontWeight: 500 }}>
                  Pilih tujuan finansial kamu (bisa lebih dari satu).
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  {FINANCIAL_GOALS.map(goal => {
                    const sel = formData.goals.includes(goal.id);
                    return (
                      <button
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={`selectable-card ${sel ? 'selected' : ''}`}
                        style={{
                          padding: "1rem", borderRadius: "var(--radius-brutal-sm)", textAlign: "left",
                          background: sel ? step.accent : "var(--color-white)",
                          cursor: "pointer", display: "flex", alignItems: "flex-start", gap: "0.75rem",
                          border: "2px solid var(--color-navy)",
                          boxShadow: "3px 3px 0px var(--color-navy)",
                        }}
                      >
                        <span style={{ flexShrink: 0, background: "var(--color-white)", borderRadius: "6px", padding: "6px", border: "2px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <goal.icon size={20} strokeWidth={2.5} color="var(--color-navy)" />
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.95rem", color: "var(--color-navy)", lineHeight: 1.2 }}>{goal.label}</div>
                          <div style={{ fontSize: "0.75rem", color: sel ? "var(--color-navy)" : "var(--color-text-muted)", fontWeight: 600, marginTop: "0.25rem", lineHeight: 1.3 }}>{goal.desc}</div>
                        </div>
                        {sel && <CheckCircle2 size={18} color="var(--color-navy)" style={{ flexShrink: 0, marginTop: "2px" }} strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {currentStep === 5 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "0.25rem" }}>
                  Gaya finansialmu gimana?
                </h2>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem", fontSize: "1rem", fontWeight: 500 }}>
                  Pilih profil yang paling cocok dengan kepribadian finansialmu.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {RISK_PROFILES.map(profile => {
                    const sel = formData.riskProfile === profile.id;
                    return (
                      <button
                        key={profile.id}
                        onClick={() => setFormData({ ...formData, riskProfile: profile.id })}
                        className={`selectable-card ${sel ? 'selected' : ''}`}
                        style={{
                          padding: "1.25rem", borderRadius: "var(--radius-brutal)", textAlign: "left",
                          background: sel ? profile.color : "var(--color-white)",
                          cursor: "pointer", display: "flex", alignItems: "center", gap: "1.25rem",
                          border: "2px solid var(--color-navy)",
                          boxShadow: "4px 4px 0px var(--color-navy)",
                        }}
                      >
                        <span style={{ flexShrink: 0, background: "var(--color-white)", borderRadius: "10px", width: "52px", height: "52px", border: "2px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <profile.icon size={28} strokeWidth={2.5} color="var(--color-navy)" />
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.2rem", color: "var(--color-navy)" }}>{profile.label}</span>
                            <span className="badge-brutal" style={{ fontSize: "0.65rem", background: "var(--color-white)", color: "var(--color-navy)", padding: "0.15rem 0.5rem" }}>
                              {profile.tag}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "var(--color-navy)", fontWeight: 600, lineHeight: 1.4 }}>{profile.desc}</div>
                        </div>
                        {sel && <CheckCircle2 size={26} color="var(--color-navy)" style={{ flexShrink: 0 }} strokeWidth={3} />}
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
                  className="btn-brutal btn-brutal--secondary"
                  style={{
                    display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", fontSize: "0.95rem"
                  }}
                >
                  <ArrowLeft size={18} strokeWidth={2.5} /> Kembali
                </button>
              )}

              {currentStep < STEPS.length ? (
                <button
                  onClick={goNext}
                  disabled={!canProceed()}
                  className="btn-brutal"
                  style={{
                    flex: 1, 
                    background: step.accent,
                    color: "var(--color-navy)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    opacity: canProceed() ? 1 : 0.5,
                    padding: "0.75rem 1.25rem", fontSize: "0.95rem"
                  }}
                >
                  Lanjut <ArrowRight size={18} strokeWidth={2.5} />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  disabled={!canProceed() || isSubmitting}
                  className="btn-brutal"
                  style={{
                    flex: 1, 
                    background: step.accent,
                    color: "var(--color-navy)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                    opacity: canProceed() ? 1 : 0.5,
                    padding: "0.75rem 1.25rem", fontSize: "0.95rem"
                  }}
                >
                  <Sparkles size={20} strokeWidth={2.5} />
                  {isSubmitting ? "Menyimpan..." : "Masuk Dashboard!"}
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
      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 800, letterSpacing: "1px", color: "var(--color-navy)", marginBottom: "0.5rem" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {prefix && (
          <span style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", fontWeight: 800, color: "var(--color-navy)", fontSize: "0.95rem", zIndex: 1 }}>
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
            width: "100%", padding: prefix ? "0.75rem 1rem 0.75rem 3.2rem" : "0.75rem 1rem",
            background: "var(--color-white)",
            border: "2px solid var(--color-navy)",
            borderRadius: "var(--radius-brutal-sm)", color: "var(--color-navy)", fontSize: "0.95rem", fontWeight: 700,
            outline: "none", transition: "all 0.2s",
            boxShadow: focused ? `4px 4px 0px ${accent}` : "2px 2px 0px var(--color-navy)",
            boxSizing: "border-box",
            fontFamily: "var(--font-body)",
          }}
        />
      </div>
    </div>
  );
}

