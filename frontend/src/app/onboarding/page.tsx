"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Wallet, ShoppingBag, Target, Shield,
  ArrowRight, ArrowLeft, CheckCircle2, Sparkles,
  Home, Utensils, Car, Tv, Package, Smartphone, HeartPulse, GraduationCap,
  PiggyBank, TrendingUp, Unlock, Umbrella, Laptop, Plane,
  ShieldCheck, Scale, Rocket, Briefcase, Store,
  Users, MapPin, AlertCircle, Brain, ChevronDown
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
    id: 5, title: "Kebiasaan Menabung", subtitle: "Gimana cara kamu simpan uang?", icon: Shield,
    accent: "var(--color-warning)", bg: "var(--color-warning)", textColor: "var(--color-navy)"
  },
  {
    id: 6, title: "Psikologi Keuangan", subtitle: "Bantu AI memahami mindsetmu!", icon: Brain,
    accent: "#00E5FF", bg: "#00E5FF", textColor: "var(--color-navy)"
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

const RISK_PROFILES = []; // Not used directly anymore

const CITY_TIERS = [
  { id: 1, label: "Kota Besar / Metro" },
  { id: 2, label: "Kota Menengah" },
  { id: 3, label: "Kota Kecil / Kabupaten" },
];
const TANGGUNGAN_OPTIONS = [
  { id: 0, label: "Tidak ada" },
  { id: 1, label: "1 orang" },
  { id: 2, label: "2 orang" },
  { id: 3, label: "3+ orang" },
];
const TOLERANSI_RUGI = [
  { id: 0, label: "Jual semua", desc: "Panik, langsung amankan sisa dana" },
  { id: 1, label: "Tunggu & pantau", desc: "Tenang, tunggu harganya naik lagi" },
  { id: 2, label: "Beli lagi", desc: "Mumpung murah (buy the dip!)" },
];
const SAVE_HABIT_OPTIONS = [
  { id: 1, label: "Tidak pernah" },
  { id: 2, label: "Jarang" },
  { id: 3, label: "Kadang-kadang" },
  { id: 4, label: "Sering" },
  { id: 5, label: "Selalu (rutin)" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth/register");
      } else {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router, supabase]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [formData, setFormData] = useState({
    name: "", age: "", income: "", incomeSource: "gaji",
    topExpenses: [] as string[], monthlyExpense: "",
    goals: [] as string[], riskProfile: "moderat",
    tanggunganKeluarga: 0, cityTier: 1, toleransiRugi: 1, 
    saveHabit: 3, punyaTabungan: true, jumlahTabunganBulan: "0",
    selfControl: 3, scfHorizon: 3, finGoals: 3,
  });

  const step = STEPS[currentStep - 1];
  const progress = (currentStep / STEPS.length) * 100;

  if (isCheckingAuth) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg)", fontFamily: "var(--font-body)" }}>
        <div style={{ fontWeight: 800, color: "var(--color-navy)", fontSize: "1.2rem" }}>Memuat CEAMIS...</div>
      </div>
    );
  }

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
      case 5: return !formData.punyaTabungan || (formData.punyaTabungan && formData.jumlahTabunganBulan !== "0" && formData.jumlahTabunganBulan !== "");
      case 6: return true; // Default selected 3
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
          risk_profile: "moderat", // Fallback, no longer directly chosen
          tanggungan_keluarga: formData.tanggunganKeluarga,
          city_tier_enc: formData.cityTier,
          toleransi_rugi_enc: formData.toleransiRugi,
          save_habit: formData.saveHabit,
          punya_tabungan: formData.punyaTabungan,
          jumlah_tabungan_bulan: formData.punyaTabungan ? parseFloat(formData.jumlahTabunganBulan || "0") : 0,
        });
        // Hapus cache user agar di-fetch ulang dari server saat login
        localStorage.removeItem("ceamis_user");
        localStorage.removeItem("ceamis_transactions");
        
        // Simpan jawaban risk profile ke local storage agar bisa dibaca model 3 di Planning
        localStorage.setItem("ceamis_risk_answers", JSON.stringify({
          SELFCONTROL_1: formData.selfControl,
          SCFHORIZON: formData.scfHorizon,
          FINGOALS: formData.finGoals
        }));
      }
      
      setIsSubmitting(false);
      
      if (user) {
        // Langsung masuk ke dashboard, lewati popup verifikasi email
        router.push("/dashboard");
      } else {
        router.push("/auth/register");
      }
    } catch (err) {
      console.error("Onboarding save error:", err);
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
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "auto", zIndex: 1 }}>
          <img src="/images/logo_white.png" alt="CEAMIS" style={{ width: 56, height: 56, objectFit: "contain" }} />
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "2rem", letterSpacing: "2px", color: step.textColor }}>CEAMIS</span>
        </div>

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
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 800, letterSpacing: "1px", color: "var(--color-navy)", marginBottom: "0.75rem" }}>
                      JUMLAH TANGGUNGAN KELUARGA
                    </label>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                      {TANGGUNGAN_OPTIONS.map(opt => {
                        const isSelected = formData.tanggunganKeluarga === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setFormData({ ...formData, tanggunganKeluarga: opt.id })}
                            className={`selectable-card ${isSelected ? 'selected' : ''}`}
                            style={{
                              padding: "0.6rem 1rem", borderRadius: "var(--radius-brutal-sm)", fontSize: "0.9rem", fontWeight: 700,
                              border: "2px solid var(--color-navy)",
                              background: isSelected ? step.accent : "var(--color-white)",
                              color: isSelected ? step.textColor : "var(--color-navy)",
                              cursor: "pointer",
                              boxShadow: "2px 2px 0px var(--color-navy)",
                              display: "flex", alignItems: "center", gap: "0.5rem"
                            }}
                          >
                            <Users size={16} strokeWidth={2.5} />
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
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
                              color: isSelected ? step.textColor : "var(--color-navy)",
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
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 800, letterSpacing: "1px", color: "var(--color-navy)", marginBottom: "0.75rem" }}>
                      LOKASI TEMPAT TINGGAL
                    </label>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                      {CITY_TIERS.map(tier => {
                        const isSelected = formData.cityTier === tier.id;
                        return (
                          <button
                            key={tier.id}
                            onClick={() => setFormData({ ...formData, cityTier: tier.id })}
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
                            <MapPin size={16} strokeWidth={2.5} />
                            {tier.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
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
                          color: sel ? step.textColor : "var(--color-navy)",
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
                        {sel && <CheckCircle2 size={18} color={step.textColor} style={{ marginLeft: "auto", flexShrink: 0 }} strokeWidth={3} />}
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
                          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.95rem", color: sel ? step.textColor : "var(--color-navy)", lineHeight: 1.2 }}>{goal.label}</div>
                          <div style={{ fontSize: "0.75rem", color: sel ? step.textColor : "var(--color-text-muted)", fontWeight: 600, marginTop: "0.25rem", lineHeight: 1.3 }}>{goal.desc}</div>
                        </div>
                        {sel && <CheckCircle2 size={18} color={step.textColor} style={{ flexShrink: 0, marginTop: "2px" }} strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
                
                <div style={{ marginTop: "2rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 800, letterSpacing: "1px", color: "var(--color-navy)", marginBottom: "0.75rem" }}>
                    TOLERANSI RISIKO INVESTASI
                  </label>
                  <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem", fontSize: "0.9rem", fontWeight: 500 }}>
                    Jika investasimu tiba-tiba turun 20% dalam seminggu, apa yang akan kamu lakukan?
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                    {TOLERANSI_RUGI.map(opt => {
                      const isSelected = formData.toleransiRugi === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setFormData({ ...formData, toleransiRugi: opt.id })}
                          className={`selectable-card ${isSelected ? 'selected' : ''}`}
                          style={{
                            padding: "0.85rem", borderRadius: "var(--radius-brutal-sm)", fontSize: "0.85rem", fontWeight: 700,
                            border: "2px solid var(--color-navy)",
                            background: isSelected ? step.accent : "var(--color-white)",
                            color: isSelected ? step.textColor : "var(--color-navy)",
                            cursor: "pointer",
                            boxShadow: "2px 2px 0px var(--color-navy)",
                            display: "flex", flexDirection: "column", gap: "0.5rem", textAlign: "left"
                          }}
                        >
                          <AlertCircle size={18} strokeWidth={2.5} color={isSelected ? step.textColor : "var(--color-text-muted)"} />
                          <span style={{ fontWeight: 800, fontSize: "0.9rem" }}>{opt.label}</span>
                          <span style={{ fontSize: "0.7rem", color: isSelected ? step.textColor : "var(--color-text-muted)", fontWeight: 600 }}>{opt.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {currentStep === 5 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "0.25rem" }}>
                  Kebiasaan Menabung
                </h2>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem", fontSize: "1rem", fontWeight: 500 }}>
                  Gimana cara kamu menyimpan uang saat ini?
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "1px", color: "var(--color-navy)", marginBottom: "0.75rem" }}>
                      SEBERAPA RUTIN KAMU MENABUNG SETIAP BULAN?
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {SAVE_HABIT_OPTIONS.map(opt => {
                        const isSelected = formData.saveHabit === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setFormData({ ...formData, saveHabit: opt.id })}
                            className={`selectable-card ${isSelected ? 'selected' : ''}`}
                            style={{
                              padding: "0.6rem 1rem", borderRadius: "100px", fontSize: "0.85rem", fontWeight: 700,
                              border: "2px solid var(--color-navy)",
                              background: isSelected ? step.accent : "var(--color-white)",
                              color: isSelected ? step.textColor : "var(--color-navy)",
                              cursor: "pointer",
                            }}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "1px", color: "var(--color-navy)", marginBottom: "0.75rem" }}>
                      APAKAH SAAT INI KAMU PUNYA TABUNGAN / DANA DARURAT?
                    </label>
                    <div style={{ display: "flex", gap: "1rem", marginBottom: formData.punyaTabungan ? "1rem" : "0" }}>
                      <button
                        onClick={() => setFormData({ ...formData, punyaTabungan: true })}
                        className={`selectable-card ${formData.punyaTabungan ? 'selected' : ''}`}
                        style={{
                          flex: 1, padding: "0.75rem", borderRadius: "var(--radius-brutal-sm)", fontSize: "0.9rem", fontWeight: 800,
                          border: "2px solid var(--color-navy)",
                          background: formData.punyaTabungan ? step.accent : "var(--color-white)",
                          color: formData.punyaTabungan ? step.textColor : "var(--color-navy)", cursor: "pointer", boxShadow: "2px 2px 0px var(--color-navy)"
                        }}
                      >
                        Ya, Punya
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, punyaTabungan: false, jumlahTabunganBulan: "0" })}
                        className={`selectable-card ${!formData.punyaTabungan ? 'selected' : ''}`}
                        style={{
                          flex: 1, padding: "0.75rem", borderRadius: "var(--radius-brutal-sm)", fontSize: "0.9rem", fontWeight: 800,
                          border: "2px solid var(--color-navy)",
                          background: !formData.punyaTabungan ? "var(--color-orange)" : "var(--color-white)",
                          color: !formData.punyaTabungan ? "var(--color-white)" : "var(--color-navy)", cursor: "pointer", boxShadow: "2px 2px 0px var(--color-navy)"
                        }}
                      >
                        Belum Ada
                      </button>
                    </div>

                    {formData.punyaTabungan && (
                      <div className="animate-fade-in">
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 800, letterSpacing: "1px", color: "var(--color-navy)", marginBottom: "0.5rem" }}>
                          CUKUP UNTUK BERAPA BULAN PENGELUARAN?
                        </label>
                        <CustomSelect
                          value={formData.jumlahTabunganBulan}
                          onChange={(v) => setFormData({ ...formData, jumlahTabunganBulan: v })}
                          accent={step.accent}
                          textColor={step.textColor}
                          disabledOption="Pilih opsi..."
                          options={[
                            { key: "0.5", label: "< 1 Bulan" },
                            { key: "1.5", label: "1 - 2 Bulan" },
                            { key: "4", label: "3 - 5 Bulan" },
                            { key: "7", label: "> 6 Bulan" }
                          ]}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6 */}
            {currentStep === 6 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "0.25rem" }}>
                  Psikologi Keuangan
                </h2>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem", fontSize: "1rem", fontWeight: 500 }}>
                  Bantu AI kami memahami cara kamu berpikir tentang uang.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "1px", color: "var(--color-navy)", marginBottom: "0.75rem" }}>
                      SEBERAPA BAIK KAMU BISA MENAHAN GODAAN BELANJA IMPULSIF?
                    </label>
                    <CustomSelect 
                      value={formData.selfControl.toString()} 
                      onChange={v => setFormData({ ...formData, selfControl: parseInt(v) })}
                      accent={step.accent}
                      textColor={step.textColor} 
                      options={[
                        { key: "1", label: "Sangat Buruk" },
                        { key: "2", label: "Buruk" },
                        { key: "3", label: "Cukup" },
                        { key: "4", label: "Baik" },
                        { key: "5", label: "Sangat Baik" }
                      ]}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "1px", color: "var(--color-navy)", marginBottom: "0.75rem" }}>
                      SEBERAPA JAUH KE DEPAN KAMU MERENCANAKAN KEUANGANMU?
                    </label>
                    <CustomSelect 
                      value={formData.scfHorizon.toString()} 
                      onChange={v => setFormData({ ...formData, scfHorizon: parseInt(v) })}
                      accent={step.accent}
                      textColor={step.textColor} 
                      options={[
                        { key: "1", label: "Tidak merencanakan" },
                        { key: "2", label: "Bulan depan" },
                        { key: "3", label: "1 tahun" },
                        { key: "4", label: "Beberapa tahun (2-4)" },
                        { key: "5", label: "5 - 10 tahun" },
                        { key: "6", label: "Lebih dari 10 tahun" }
                      ]}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "1px", color: "var(--color-navy)", marginBottom: "0.75rem" }}>
                      SEBERAPA SPESIFIK DAN JELAS TARGET KEUANGANMU SAAT INI?
                    </label>
                    <CustomSelect 
                      value={formData.finGoals.toString()} 
                      onChange={v => setFormData({ ...formData, finGoals: parseInt(v) })}
                      accent={step.accent}
                      textColor={step.textColor} 
                      options={[
                        { key: "1", label: "Tidak punya" },
                        { key: "2", label: "Ada tapi samar" },
                        { key: "3", label: "Cukup jelas" },
                        { key: "4", label: "Sangat spesifik" }
                      ]}
                    />
                  </div>
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
                    color: step.textColor,
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
  
  const isMoney = prefix === "Rp";
  
  const displayValue = isMoney && value
    ? value.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isMoney) {
      const unformatted = e.target.value.replace(/\D/g, "");
      onChange(unformatted);
    } else {
      onChange(e.target.value);
    }
  };

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
          type={isMoney ? "text" : type}
          value={displayValue}
          onChange={handleChange}
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

const CustomSelect = ({ value, onChange, options, disabledOption, accent = "var(--color-purple)", textColor = "var(--color-white)" }: { value: string, onChange: (val: string) => void, options: {key:string, label:string}[], disabledOption?: string, accent?: string, textColor?: string }) => {
  const [open, setOpen] = useState(false);
  const selectedOpt = options.find(o => o.key === value);
  const hasSelection = !!selectedOpt && value !== "0" && value !== "";

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        style={{ 
          width: "100%", padding: "0.85rem", borderRadius: "var(--radius-brutal-sm)",
          border: "2px solid var(--color-navy)", fontSize: "0.95rem", fontWeight: 700,
          background: open || hasSelection ? accent : "var(--color-white)", 
          color: open || hasSelection ? textColor : "var(--color-navy)",
          boxShadow: open || hasSelection ? `4px 4px 0px ${accent}` : "2px 2px 0px var(--color-navy)", 
          outline: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
          fontFamily: "var(--font-body)", transition: "all 0.2s"
        }}
      >
        <span>
          {selectedOpt?.label || disabledOption || "Pilih opsi..."}
        </span>
        <ChevronDown size={18} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      
      {open && (
        <div className="no-scrollbar" style={{
          position: "absolute", top: "100%", left: 0, width: "100%", marginTop: "0.5rem",
          background: "var(--color-white)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
          boxShadow: `4px 4px 0px ${accent}`, zIndex: 10, maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column"
        }}>
          {disabledOption && (
            <div style={{ padding: "0.75rem 1rem", fontSize: "0.9rem", color: "var(--color-text-muted)", fontWeight: 700, borderBottom: "1px solid rgba(10,25,47,0.05)" }}>
              {disabledOption}
            </div>
          )}
          {options.map(opt => {
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => { onChange(opt.key); setOpen(false); }}
                style={{
                  padding: "0.75rem 1rem", display: "flex", alignItems: "center", border: "none",
                  background: value === opt.key ? accent : "transparent",
                  color: value === opt.key ? textColor : "var(--color-navy)",
                  fontWeight: value === opt.key ? 800 : 700, textAlign: "left", cursor: "pointer", borderBottom: "1px solid rgba(10,25,47,0.05)",
                  fontSize: "0.95rem", fontFamily: "var(--font-body)"
                }}
                onMouseEnter={(e) => { if(value !== opt.key) e.currentTarget.style.background = "var(--color-bg)" }}
                onMouseLeave={(e) => { if(value !== opt.key) e.currentTarget.style.background = "transparent" }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
};

