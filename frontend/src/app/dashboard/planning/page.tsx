"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Target, Wallet, ShieldCheck, PiggyBank,
  TrendingUp, ArrowRight, Plus, CheckCircle2,
  Edit3, Trash2, Sparkles, AlertTriangle,
  Home, Gamepad2, Banknote, Utensils, Car,
  Smartphone, Tv, ShoppingCart, Coffee, Candy,
  Shield, Laptop, Plane, GraduationCap,
  Brain, ChevronDown, Loader, SearchX
} from "lucide-react";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useTransactions } from "@/context/TransactionContext";
import { useGuest } from "@/context/GuestContext";
import GuestLockOverlay from "@/components/ui/GuestLockOverlay";
import { useLanguage } from "@/context/LanguageContext";

// ── Icon Mapping (replaces emojis) ──────────────
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  home: Home, utensils: Utensils, car: Car, smartphone: Smartphone, tv: Tv,
  cart: ShoppingCart, coffee: Coffee, candy: Candy, shield: Shield, laptop: Laptop,
  plane: Plane, target: Target, graduation: GraduationCap, piggybank: PiggyBank,
};

const IconBox = ({ iconKey, size = 20, bg }: { iconKey: string; size?: number; bg?: string }) => {
  const Icon = ICON_MAP[iconKey] || Target;
  return (
    <div style={{
      width: `${size + 16}px`, height: `${size + 16}px`, minWidth: `${size + 16}px`,
      display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: "var(--radius-brutal-sm)", border: "2.5px solid var(--color-navy)",
      background: bg || "var(--color-bg)", boxShadow: "2px 2px 0px var(--color-navy)",
    }}>
      <Icon size={size} color="var(--color-navy)" strokeWidth={2.5} />
    </div>
  );
};

const IconPicker = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: {key:string, label:string}[] }) => {
  const [open, setOpen] = useState(false);
  const selectedOpt = options.find(o => o.key === value) || options[0];
  const SelectedIcon = ICON_MAP[selectedOpt.key] || Target;

  return (
    <div style={{ position: "relative" }}>
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        className="input-brutal"
        style={{ 
          border: "3px solid var(--color-navy)", padding: "0.75rem", fontSize: "0.9rem", fontWeight: 800, 
          width: "100%", minWidth: "120px", boxShadow: "3px 3px 0px var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "var(--color-white)", cursor: "pointer"
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <SelectedIcon size={16} color="var(--color-navy)" strokeWidth={2.5} /> {selectedOpt.label}
        </span>
        <ChevronDown size={16} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, width: "100%", marginTop: "0.5rem",
          background: "var(--color-white)", border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
          boxShadow: "4px 4px 0px var(--color-navy)", zIndex: 10, maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column"
        }}>
          {options.map(opt => {
            const Icon = ICON_MAP[opt.key] || Target;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => { onChange(opt.key); setOpen(false); }}
                style={{
                  padding: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", border: "none",
                  background: value === opt.key ? "var(--color-purple)" : "transparent",
                  color: value === opt.key ? "var(--color-white)" : "var(--color-navy)",
                  fontWeight: 800, textAlign: "left", cursor: "pointer", borderBottom: "2px solid rgba(10,25,47,0.05)"
                }}
                onMouseEnter={(e) => { if(value !== opt.key) e.currentTarget.style.background = "var(--color-bg)" }}
                onMouseLeave={(e) => { if(value !== opt.key) e.currentTarget.style.background = "transparent" }}
              >
                <Icon size={16} color={value === opt.key ? "var(--color-white)" : "var(--color-navy)"} strokeWidth={2.5} /> {opt.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
};

// ── Budget Allocation Data ──────────────────────────
interface BudgetCategory {
  id: string;
  name: string;
  type: "needs" | "wants" | "savings";
  allocated: number;
  spent: number;
  icon: string;
}

const DEFAULT_BUDGET: BudgetCategory[] = [
  // Needs
  { id: "makan", name: "Makan & Minum", type: "needs", allocated: 0, spent: 0, icon: "utensils" },
  { id: "transport", name: "Transportasi", type: "needs", allocated: 0, spent: 0, icon: "car" },
  { id: "tagihan", name: "Tagihan & Utilitas", type: "needs", allocated: 0, spent: 0, icon: "home" },
  // Wants
  { id: "hiburan", name: "Hiburan & Rekreasi", type: "wants", allocated: 0, spent: 0, icon: "tv" },
  { id: "belanja", name: "Belanja & Lifestyle", type: "wants", allocated: 0, spent: 0, icon: "cart" },
  { id: "kopi", name: "Kopi & Jajan", type: "wants", allocated: 0, spent: 0, icon: "coffee" },
  // Savings
  { id: "darurat", name: "Dana Darurat", type: "savings", allocated: 0, spent: 0, icon: "shield" },
  { id: "investasi", name: "Investasi Saham", type: "savings", allocated: 0, spent: 0, icon: "target" },
];

// ── Savings Targets ─────────────────────────────────
interface SavingsTarget {
  id: number;
  name: string;
  target: number;
  current: number;
  icon: string;
  color: string;
  deadline: string;
}

const DEFAULT_TARGETS: SavingsTarget[] = [];

const ICON_OPTIONS = [
  { key: "target", label: "Target" },
  { key: "piggybank", label: "Tabungan" },
  { key: "home", label: "Rumah" },
  { key: "car", label: "Kendaraan" },
  { key: "laptop", label: "Laptop" },
  { key: "plane", label: "Travel" },
  { key: "smartphone", label: "Gadget" },
  { key: "graduation", label: "Pendidikan" },
];

// ── Model 3: Risk Profile ─────────────────────────────────────────────────────
const PROFILE_INFO: Record<string, { description: string; suggestion: string; color: string; accentColor: string }> = {
  "Konservatif": {
    description: "Kamu lebih nyaman dengan pendekatan keuangan yang aman dan stabil. Fokus utamamu saat ini adalah memastikan kebutuhan dasar terpenuhi dan mulai membangun kebiasaan menabung.",
    suggestion: "Mulai dengan menetapkan target tabungan kecil yang realistis. Prioritaskan dana darurat minimal 1 bulan pengeluaran sebelum memikirkan hal lain.",
    color: "var(--color-lime)",
    accentColor: "var(--color-navy)",
  },
  "Moderat": {
    description: "Kamu sudah cukup sadar finansial dan mulai berani mengelola keuangan lebih aktif. Kamu punya keseimbangan antara keamanan dan keinginan berkembang.",
    suggestion: "Tetapkan target tabungan yang lebih ambisius dan mulai pisahkan pos pengeluaran dengan lebih terstruktur. Dana darurat 3 bulan adalah target berikutnya.",
    color: "var(--color-purple)",
    accentColor: "var(--color-white)",
  },
  "Agresif": {
    description: "Kamu sangat goal-oriented dan punya disiplin finansial yang tinggi. Kamu siap untuk mengoptimalkan keuangan secara penuh dan mengejar target tabungan yang ambisius.",
    suggestion: "Maksimalkan saving rate kamu dan buat target tabungan yang spesifik dengan deadline jelas. Kamu sudah siap untuk strategi keuangan yang lebih advanced.",
    color: "var(--color-orange)",
    accentColor: "var(--color-navy)",
  },
};

const RISK_QUIZ = [
  { id: "saving_rate",       label: "Berapa % income yang kamu tabung tiap bulan?",      options: [{label:"< 5%",v:0.03},{label:"5–15%",v:0.10},{label:"15–30%",v:0.22},{label:"> 30%",v:0.40}] },
  { id: "emergency_fund",    label: "Punya dana darurat berapa bulan pengeluaran?",      options: [{label:"Belum ada",v:0},{label:"1–2 bulan",v:1.5},{label:"3–5 bulan",v:4},{label:"> 6 bulan",v:7}] },
  { id: "investment_rate",   label: "Apakah kamu rutin investasi?",                     options: [{label:"Belum sama sekali",v:0},{label:"Sesekali",v:0.03},{label:"Rutin 5–10%",v:0.07},{label:"Rutin > 10%",v:0.15}] },
  { id: "financial_goals",   label: "Seberapa jelas target keuangan kamu?",              options: [{label:"Belum punya",v:0},{label:"Ada tapi abstrak",v:1},{label:"Cukup jelas",v:2},{label:"Sangat spesifik",v:3}] },
  { id: "budget_discipline", label: "Seberapa disiplin kamu mengikuti budget bulanan?", options: [{label:"Jarang",v:0.3},{label:"Kadang-kadang",v:0.55},{label:"Sering",v:0.75},{label:"Selalu",v:0.95}] },
];

interface RiskResult {
  risk_profile: "Konservatif" | "Moderat" | "Agresif";
  confidence: number;
  probabilities: { Konservatif: number; Moderat: number; Agresif: number };
  description: string;
  suggestion: string;
  is_mock: boolean;
}

export default function PlanningPage() {
  const { transactions } = useTransactions();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { isGuest } = useGuest();
  const { t } = useLanguage();
  const [budget, setBudget] = useState<BudgetCategory[]>([]);
  const [targets, setTargets] = useState<SavingsTarget[]>([]);
  const [activeView, setActiveView] = useState<"budget" | "targets">("budget");
  const [showAddTarget, setShowAddTarget] = useState(false);
  const [newTarget, setNewTarget] = useState({ name: "", target: "", icon: "target", deadline: "" });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState<{name: string; type: "needs"|"wants"|"savings"; allocated: string; icon: string}>({ name: "", type: "needs", allocated: "", icon: "home" });
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Model 3 state ──────────────────────────────────────────────────────────
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);
  const [riskLoading, setRiskLoading] = useState(false);
  const [showRiskQuiz, setShowRiskQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const fetchRiskProfile = useCallback(async (answers: Record<string, number>) => {
    setRiskLoading(true);
    setShowRiskQuiz(false);
    try {
      const payload = {
        saving_rate:       answers["saving_rate"]       ?? 0.10,
        emergency_fund:    answers["emergency_fund"]    ?? 0,
        investment_rate:   answers["investment_rate"]   ?? 0,
        financial_goals:   answers["financial_goals"]   ?? 0,
        budget_discipline: answers["budget_discipline"] ?? 0.5,
      };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000"}/api/v1/predict/risk-profile`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
      );
      if (!res.ok) throw new Error("API error");
      const data: RiskResult = await res.json();
      setRiskResult(data);
      localStorage.setItem("ceamis_risk_profile", JSON.stringify(data));
    } catch {
      // fallback: derive dari jawaban secara lokal
      const score = Object.values(answers).reduce((a, b) => a + b, 0);
      const profile = score < 1.5 ? "Konservatif" : score < 4 ? "Moderat" : "Agresif";
      const info = PROFILE_INFO[profile];
      setRiskResult({
        risk_profile: profile as RiskResult["risk_profile"],
        confidence: 0.75,
        probabilities: { Konservatif: profile==="Konservatif"?0.75:0.15, Moderat: profile==="Moderat"?0.75:0.15, Agresif: profile==="Agresif"?0.75:0.10 },
        description: info.description,
        suggestion: info.suggestion,
        is_mock: true,
      });
    } finally {
      setRiskLoading(false);
    }
  }, []);

  // Load cached risk result
  useEffect(() => {
    const cached = localStorage.getItem("ceamis_risk_profile");
    if (cached) setRiskResult(JSON.parse(cached));
  }, []);

  useEffect(() => {
    const savedBudget = localStorage.getItem("ceamis_budget");
    const savedTargets = localStorage.getItem("ceamis_targets");
    if (savedBudget) {
      setBudget(JSON.parse(savedBudget));
    } else {
      setBudget(DEFAULT_BUDGET);
    }
    if (savedTargets) {
      setTargets(JSON.parse(savedTargets));
    } else {
      setTargets(DEFAULT_TARGETS);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("ceamis_budget", JSON.stringify(budget));
      localStorage.setItem("ceamis_targets", JSON.stringify(targets));
    }
  }, [budget, targets, isLoaded]);

  // Calculate dynamic spending from transactions
  const today = new Date();
  const currentMonthStr = today.toLocaleDateString("id-ID", { month: "short" });
  const currentYearStr = today.getFullYear().toString();
  
  const filteredTransactions = transactions.filter(tx => {
    return tx.date.includes(currentMonthStr) && tx.date.includes(currentYearStr);
  });

  const dynamicIncome = filteredTransactions.filter(tx => tx.type === "pemasukan").reduce((sum, tx) => sum + tx.amount, 0);
  const income = dynamicIncome > 0 ? dynamicIncome : 4500000;

  const budgetWithSpent = budget.map(b => {
    const spent = filteredTransactions
      .filter(tx => tx.type === "pengeluaran" && tx.category.toLowerCase().includes(b.name.split(" ")[0].toLowerCase()))
      .reduce((sum, tx) => sum + tx.amount, 0);
    return { ...b, spent };
  });

  const filteredBudget = budgetWithSpent.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const needsBudget = filteredBudget.filter(b => b.type === "needs");
  const wantsBudget = filteredBudget.filter(b => b.type === "wants");
  const savingsBudget = filteredBudget.filter(b => b.type === "savings");
  
  const filteredTargets = targets.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const totalNeeds = budgetWithSpent.filter(b => b.type === "needs").reduce((s, b) => s + b.allocated, 0);
  const totalWants = budgetWithSpent.filter(b => b.type === "wants").reduce((s, b) => s + b.allocated, 0);
  const totalSavings = budgetWithSpent.filter(b => b.type === "savings").reduce((s, b) => s + b.allocated, 0);
  
  const totalSpentNeeds = budgetWithSpent.filter(b => b.type === "needs").reduce((s, b) => s + b.spent, 0);
  const totalSpentWants = budgetWithSpent.filter(b => b.type === "wants").reduce((s, b) => s + b.spent, 0);
  const totalSpentSavings = budgetWithSpent.filter(b => b.type === "savings").reduce((s, b) => s + b.spent, 0);
  
  const totalAllocated = totalNeeds + totalWants + totalSavings;
  
  const needsPercent = totalAllocated > 0 ? Math.round((totalNeeds / totalAllocated) * 100) : 0;
  const wantsPercent = totalAllocated > 0 ? Math.round((totalWants / totalAllocated) * 100) : 0;
  const savingsPercent = totalAllocated > 0 ? Math.round((totalSavings / totalAllocated) * 100) : 0;

  const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  const emergencyFundTarget = totalNeeds * 6;
  const emergencyFundCurrent = targets.find(t => t.name === "Dana Darurat")?.current || 0;
  const emergencyMonths = Math.floor(emergencyFundCurrent / (totalNeeds > 0 ? totalNeeds : 1));

  const handleAddTarget = () => {
    if (!newTarget.name || !newTarget.target) return;
    setTargets([...targets, {
      id: Date.now(), name: newTarget.name, target: parseInt(newTarget.target),
      current: 0, icon: newTarget.icon, color: "purple", deadline: newTarget.deadline || "TBD"
    }]);
    setNewTarget({ name: "", target: "", icon: "target", deadline: "" });
    setShowAddTarget(false);
  };

  const handleAddCategory = () => {
    if (!newCategory.name) return;
    setBudget([...budget, {
      id: Date.now().toString(),
      name: newCategory.name,
      type: newCategory.type,
      allocated: parseInt(newCategory.allocated) || 0,
      spent: 0,
      icon: newCategory.icon
    }]);
    setNewCategory({ name: "", type: "needs", allocated: "", icon: "home" });
    setShowAddCategory(false);
  };

  const deleteTarget = (id: number) => setTargets(targets.filter(t => t.id !== id));

  const handleUpdateAllocation = (id: string, newAmount: number) => {
    setBudget(budget.map(b => b.id === id ? { ...b, allocated: newAmount } : b));
  };

  // ── Budget category row ───────────────
  const BudgetRow = ({ item }: { item: BudgetCategory }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(item.allocated.toString());

    const pct = item.allocated > 0 ? Math.round((item.spent / item.allocated) * 100) : 0;
    const isOverBudget = item.spent > item.allocated && item.allocated > 0;

    const handleSave = () => {
      handleUpdateAllocation(item.id, parseInt(editValue) || 0);
      setIsEditing(false);
    };

    return (
      <div style={{
        display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem",
        background: "var(--color-white)", border: "2.5px solid var(--color-navy)",
        borderRadius: "var(--radius-brutal-sm)", boxShadow: "3px 3px 0px var(--color-navy)",
      }}>
        <IconBox iconKey={item.icon} size={20} bg={item.type === "needs" ? "var(--color-lime)" : item.type === "wants" ? "var(--color-orange)" : "var(--color-purple)"} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem", alignItems: "center" }}>
            <span style={{ fontWeight: 800, fontSize: "0.9375rem" }}>{item.name}</span>
            {isEditing ? (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input 
                  type="number" 
                  value={editValue} 
                  onChange={e => setEditValue(e.target.value)}
                  className="input-brutal"
                  style={{ width: "100px", padding: "0.2rem 0.5rem", fontSize: "0.8rem", border: "2px solid var(--color-navy)" }}
                  autoFocus
                />
                <button onClick={handleSave} className="btn-brutal" style={{ padding: "0.2rem 0.5rem", background: "var(--color-lime)" }}>OK</button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span 
                  style={{ fontWeight: 800, fontFamily: "var(--font-heading)", fontSize: "0.9375rem", color: isOverBudget ? "var(--color-danger, #e74c3c)" : "var(--color-navy)" }}
                >
                  {formatRp(item.spent)} / {formatRp(item.allocated)}
                </span>
                <button 
                  onClick={() => setIsEditing(true)}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "var(--color-navy)", padding: "0.2rem", opacity: 0.6, transition: "opacity 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "0.6"}
                  title="Ubah Alokasi Budget"
                >
                  <Edit3 size={16} />
                </button>
              </div>
            )}
          </div>
          <div style={{ width: "100%", height: "12px", background: "var(--color-bg)", border: "2px solid var(--color-navy)", borderRadius: "100px", overflow: "hidden" }}>
            <div style={{
              width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: "100px",
              background: isOverBudget ? "var(--color-danger, #e74c3c)" : pct > 80 ? "var(--color-orange)" : `var(--color-${item.type === "needs" ? "lime" : item.type === "wants" ? "orange" : "purple"})`,
              transition: "width 0.5s ease", borderRight: pct > 0 ? "2px solid var(--color-navy)" : "none"
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)" }}>{pct}% terpakai</span>
            {isOverBudget && (
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--color-danger, #e74c3c)", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                <AlertTriangle size={12} /> Over budget!
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const allAnswered = RISK_QUIZ.every(q => quizAnswers[q.id] !== undefined);

  const pageContent = (
    <div style={{ paddingBottom: "3rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div style={{
          width: "72px", height: "72px", background: "var(--color-purple)",
          borderRadius: "var(--radius-brutal-sm)", border: "3px solid var(--color-navy)",
          boxShadow: "4px 4px 0px var(--color-navy)", display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <Target size={40} color="var(--color-white)" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", marginBottom: "0.25rem", color: "var(--color-navy)", fontWeight: 800 }}>
            {t("dashboard.planning.title")}
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 600 }}>
            {t("dashboard.planning.desc")}
          </p>
        </div>
      </div>

      {/* ── Model 3: Risk Profile Card ──────────────────────────────────────── */}
      <div className="card-brutal animate-bounce-in" style={{ marginBottom: "2.5rem", overflow: "hidden",
        background: "var(--color-white)",
        border: riskResult ? `4px solid ${PROFILE_INFO[riskResult.risk_profile]?.color ?? "var(--color-navy)"}` : "4px solid var(--color-navy)",
        boxShadow: riskResult ? `8px 8px 0px ${PROFILE_INFO[riskResult.risk_profile]?.color ?? "var(--color-navy)"}` : "8px 8px 0px var(--color-navy)",
        padding: 0
      }}>
        {/* Card Header */}
        <div style={{ padding: "1.5rem 2rem", background: "var(--color-purple)", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", borderBottom: "4px solid var(--color-navy)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div style={{ width: "48px", height: "48px", background: "var(--color-lime)", borderRadius: "var(--radius-brutal-sm)", border: "2.5px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0px var(--color-navy)" }}>
              <Brain size={28} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "1.35rem", color: "var(--color-white)" }}>Profil Risiko Keuangan</div>
              <div style={{ fontSize: "0.85rem", color: "var(--color-white)", fontWeight: 700, opacity: 0.9 }}>Model 3 · Risk Profile Classifier · Akurasi 97.91%</div>
            </div>
          </div>
          <button
            onClick={() => setShowRiskQuiz(v => !v)}
            className="btn-brutal"
            style={{ padding: "0.75rem 1.5rem", background: "var(--color-white)", color: "var(--color-navy)", fontWeight: 900, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "4px 4px 0px var(--color-navy)" }}
          >
            {riskResult ? "Isi Ulang" : "Mulai Analisis"} <ChevronDown size={18} style={{ transform: showRiskQuiz ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
        </div>

        {/* Quiz */}
        {showRiskQuiz && (
          <div style={{ padding: "2rem", background: "var(--color-bg)", borderTop: "3px solid var(--color-navy)" }}>
            <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", marginBottom: "2rem", fontWeight: 700 }}>
              Jawab 5 pertanyaan berikut untuk mendapatkan profil risiko keuanganmu dari AI.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {RISK_QUIZ.map((q) => (
                <div key={q.id}>
                  <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--color-navy)", marginBottom: "0.75rem" }}>{q.label}</div>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    {q.options.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt.v }))}
                        className="btn-brutal"
                        style={{
                          padding: "0.6rem 1.25rem", fontSize: "0.9rem", fontWeight: 800,
                          background: quizAnswers[q.id] === opt.v ? "var(--color-purple)" : "var(--color-white)",
                          color: quizAnswers[q.id] === opt.v ? "var(--color-white)" : "var(--color-navy)",
                          boxShadow: quizAnswers[q.id] === opt.v ? "4px 4px 0px var(--color-navy)" : "4px 4px 0px var(--color-navy)",
                          border: "2.5px solid var(--color-navy)",
                          transform: quizAnswers[q.id] === opt.v ? "translate(-2px,-2px)" : "none",
                        }}
                      >{opt.label}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => fetchRiskProfile(quizAnswers)}
              disabled={!allAnswered}
              className="btn-brutal"
              style={{
                marginTop: "2.5rem", padding: "1rem 2.5rem", fontWeight: 900, fontSize: "1.1rem",
                background: allAnswered ? "var(--color-lime)" : "var(--color-bg)",
                color: allAnswered ? "var(--color-navy)" : "var(--color-text-muted)",
                boxShadow: allAnswered ? "6px 6px 0px var(--color-navy)" : "none",
                border: allAnswered ? "3px solid var(--color-navy)" : "3px dashed var(--color-text-light)",
                cursor: allAnswered ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", gap: "0.75rem",
              }}
            >
              <Sparkles size={20} /> Analisis Profil Saya
            </button>
          </div>
        )}

        {/* Loading */}
        {riskLoading && (
          <div style={{ padding: "3rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", background: "var(--color-white)" }}>
            <Loader size={32} color="var(--color-purple)" style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ fontWeight: 800, color: "var(--color-navy)", fontSize: "1.1rem" }}>AI sedang memproses datamu...</span>
          </div>
        )}

        {/* Result */}
        {riskResult && !riskLoading && !showRiskQuiz && (() => {
          const info = PROFILE_INFO[riskResult.risk_profile];
          return (
            <div style={{ padding: "2rem", display: "grid", gridTemplateColumns: "auto 1fr", gap: "2rem", alignItems: "start", background: "var(--color-white)" }}>
              {/* Profile Badge */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                <div style={{
                  width: "100px", height: "100px", background: info.color,
                  borderRadius: "var(--radius-brutal-sm)", border: "3px solid var(--color-navy)",
                  boxShadow: "6px 6px 0px var(--color-navy)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                }}>
                  <Shield size={40} color={info.accentColor} strokeWidth={2.5} />
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "1.1rem", color: "var(--color-navy)", textAlign: "center" }}>
                  {riskResult.risk_profile}
                </div>
                {riskResult.is_mock && (
                  <span className="badge-brutal" style={{ fontSize: "0.7rem", background: "var(--color-bg)" }}>ESTIMASI</span>
                )}
              </div>

              {/* Info */}
              <div>
                <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: "var(--color-navy)", marginBottom: "1.5rem", fontWeight: 600 }}>
                  {riskResult.description}
                </p>
                <div style={{ background: "var(--color-white)", border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal)", padding: "1.5rem", marginBottom: "2rem", boxShadow: "6px 6px 0px var(--color-navy)", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ background: info.color, padding: "0.5rem", borderRadius: "8px", border: "2px solid var(--color-navy)", flexShrink: 0 }}>
                    <Sparkles size={24} color={info.accentColor} />
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 0.5rem 0", fontFamily: "var(--font-heading)", fontWeight: 900, color: "var(--color-navy)", fontSize: "1.1rem" }}>Saran AI:</h4>
                    <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.6, color: "var(--color-navy)", fontWeight: 600 }}>{riskResult.suggestion}</p>
                  </div>
                </div>

                {/* Probability bars */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {(["Konservatif","Moderat","Agresif"] as const).map(p => {
                    const prob = Math.round((riskResult.probabilities[p] || 0) * 100);
                    const isActive = riskResult.risk_profile === p;
                    return (
                      <div key={p} style={{ flex: "1 1 100px" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "0.4rem", display: "flex", justifyContent: "space-between" }}>
                          <span>{p}</span><span>{prob}%</span>
                        </div>
                        <div style={{ height: "12px", background: "var(--color-bg)", border: "2px solid var(--color-navy)", borderRadius: "100px", overflow: "hidden" }}>
                          <div style={{ width: `${prob}%`, height: "100%", background: isActive ? PROFILE_INFO[p].color : "var(--color-text-light)", transition: "width 0.8s ease", borderRight: prob > 0 ? "2px solid var(--color-navy)" : "none" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Empty state */}
        {!riskResult && !riskLoading && !showRiskQuiz && (
          <div style={{ padding: "4rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--color-white)" }}>
            <div style={{ background: "var(--color-bg)", padding: "1.5rem", borderRadius: "50%", border: "3px dashed var(--color-navy)", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Brain size={48} color="var(--color-navy)" strokeWidth={2} style={{ opacity: 0.6 }} />
            </div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: "1.1rem", color: "var(--color-navy)", opacity: 0.8 }}>Klik <strong>&quot;Mulai Analisis&quot;</strong> untuk mengetahui profil risiko keuanganmu!</p>
          </div>
        )}
      </div>

      {/* Overview Cards — 50/30/20 Rule */}
      <div className="card-brutal animate-bounce-in" style={{ padding: "2.5rem", marginBottom: "3rem", background: "var(--color-white)", border: "4px solid var(--color-navy)", boxShadow: "8px 8px 0px var(--color-navy)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "2rem" }}>
          <div style={{ background: "var(--color-purple)", padding: "0.5rem", borderRadius: "8px", border: "2.5px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <Sparkles size={28} color="var(--color-white)" />
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", margin: 0, color: "var(--color-navy)", fontWeight: 900 }}>Ringkasan Alokasi</h2>
        </div>

        <div style={{ display: "flex", height: "56px", borderRadius: "var(--radius-brutal)", border: "4px solid var(--color-navy)", overflow: "hidden", marginBottom: "2.5rem", boxShadow: "4px 4px 0px rgba(10,25,47,0.2)" }}>
          <div style={{ width: `${needsPercent}%`, background: "var(--color-lime)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1rem", color: "var(--color-navy)", borderRight: needsPercent > 0 ? "4px solid var(--color-navy)" : "none", transition: "width 0.5s ease" }}>
            {needsPercent > 10 ? `Needs ${needsPercent}%` : ''}
          </div>
          <div style={{ width: `${wantsPercent}%`, background: "var(--color-orange)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1rem", color: "var(--color-navy)", borderRight: wantsPercent > 0 ? "4px solid var(--color-navy)" : "none", transition: "width 0.5s ease" }}>
            {wantsPercent > 10 ? `Wants ${wantsPercent}%` : ''}
          </div>
          <div style={{ width: `${savingsPercent}%`, background: "var(--color-purple)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1rem", color: "var(--color-white)", transition: "width 0.5s ease" }}>
            {savingsPercent > 10 ? `Save ${savingsPercent}%` : ''}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          {[
            { label: "Kebutuhan (Needs)", amount: totalNeeds, spent: totalSpentNeeds, color: "lime", Icon: Home },
            { label: "Keinginan (Wants)", amount: totalWants, spent: totalSpentWants, color: "orange", Icon: Gamepad2 },
            { label: "Tabungan (Savings)", amount: totalSavings, spent: totalSpentSavings, color: "purple", Icon: Banknote },
          ].map(s => (
            <div key={s.label} className="card-brutal" style={{
              background: "var(--color-white)", padding: "1.75rem", border: "3px solid var(--color-navy)",
              boxShadow: `6px 6px 0px var(--color-${s.color})`, display: "flex", flexDirection: "column"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                <div style={{ background: `var(--color-${s.color})`, padding: "0.6rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)" }}>
                  <s.Icon size={28} color={s.color === "purple" ? "var(--color-white)" : "var(--color-navy)"} strokeWidth={2.5} />
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--color-navy)" }}>{s.label}</div>
              </div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 900, color: "var(--color-navy)" }}>{formatRp(s.amount)}</div>
              {s.spent > 0 && (
                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--color-navy)", marginTop: "1rem", background: "var(--color-bg)", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "2px dashed var(--color-navy)", display: "inline-block", alignSelf: "flex-start" }}>
                  Terpakai: {formatRp(s.spent)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tab Switch */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <button onClick={() => setActiveView("budget")} className="btn-brutal" style={{
          padding: "0.8rem 1.75rem", fontWeight: 900, fontSize: "1.05rem",
          background: activeView === "budget" ? "var(--color-navy)" : "var(--color-white)",
          color: activeView === "budget" ? "var(--color-white)" : "var(--color-navy)",
          display: "flex", alignItems: "center", gap: "0.6rem",
          boxShadow: activeView === "budget" ? "6px 6px 0px var(--color-lime)" : "4px 4px 0px var(--color-navy)",
          transform: activeView === "budget" ? "translate(-2px, -2px)" : "none",
        }}>
          <Wallet size={20} /> Alokasi Budget
        </button>
        <button onClick={() => setActiveView("targets")} className="btn-brutal" style={{
          padding: "0.8rem 1.75rem", fontWeight: 900, fontSize: "1.05rem",
          background: activeView === "targets" ? "var(--color-navy)" : "var(--color-white)",
          color: activeView === "targets" ? "var(--color-white)" : "var(--color-navy)",
          display: "flex", alignItems: "center", gap: "0.6rem",
          boxShadow: activeView === "targets" ? "6px 6px 0px var(--color-purple)" : "4px 4px 0px var(--color-navy)",
          transform: activeView === "targets" ? "translate(-2px, -2px)" : "none",
        }}>
          <PiggyBank size={20} /> Target Tabungan
        </button>
      </div>

      {/* ── BUDGET VIEW ────────────────────── */}
      {activeView === "budget" && (
        <div className="animate-slide-up">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", margin: 0, color: "var(--color-navy)" }}>
              Kategori Budget
            </h3>
            <button onClick={() => setShowAddCategory(!showAddCategory)} className="btn-brutal" style={{
              padding: "0.75rem 1.25rem", fontWeight: 900, fontSize: "0.95rem",
              background: showAddCategory ? "var(--color-orange)" : "var(--color-navy)",
              color: "var(--color-white)", display: "flex", alignItems: "center", gap: "0.5rem",
              boxShadow: "4px 4px 0px var(--color-navy)",
            }}>
              <Plus size={18} style={{ transform: showAddCategory ? "rotate(45deg)" : "none", transition: "transform 0.2s" }} /> 
              {showAddCategory ? "Batal" : "Tambah Kategori"}
            </button>
          </div>

          {showAddCategory && (
            <div className="card-brutal animate-bounce-in" style={{ padding: "2rem", marginBottom: "2.5rem", background: "var(--color-white)", boxShadow: "6px 6px 0px var(--color-purple)", overflow: "visible" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "flex-end" }}>
                <div>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "0.85rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>TIPE</label>
                  <select value={newCategory.type} onChange={e => setNewCategory({ ...newCategory, type: e.target.value as any })} className="input-brutal" style={{ border: "3px solid var(--color-navy)", padding: "0.75rem", fontSize: "0.9rem", fontWeight: 800, minWidth: "120px", boxShadow: "3px 3px 0px var(--color-navy)" }}>
                    <option value="needs">Needs</option>
                    <option value="wants">Wants</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "0.85rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>ICON</label>
                  <IconPicker 
                    value={newCategory.icon} 
                    onChange={v => setNewCategory({ ...newCategory, icon: v })} 
                    options={ICON_OPTIONS} 
                  />
                </div>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "0.85rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>NAMA KATEGORI</label>
                  <input value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} className="input-brutal" placeholder="Contoh: Belanja Online" style={{ border: "3px solid var(--color-navy)", padding: "0.75rem", width: "100%", boxShadow: "3px 3px 0px var(--color-navy)" }} />
                </div>
                <div style={{ flex: 1, minWidth: "150px" }}>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "0.85rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>ALOKASI (RP)</label>
                  <input value={newCategory.allocated} onChange={e => setNewCategory({ ...newCategory, allocated: e.target.value })} className="input-brutal" type="number" placeholder="0" style={{ border: "3px solid var(--color-navy)", padding: "0.75rem", width: "100%", fontWeight: 900, boxShadow: "3px 3px 0px var(--color-navy)" }} />
                </div>
                <button onClick={handleAddCategory} className="btn-brutal" style={{
                  padding: "0.8rem 1.5rem", background: "var(--color-navy)", color: "var(--color-white)", fontWeight: 900,
                  display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "4px 4px 0px var(--color-lime)"
                }}>
                  <Plus size={18} /> Simpan
                </button>
              </div>
            </div>
          )}

          <div style={{ padding: "1.5rem" }}>
            {searchQuery && filteredBudget.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                <SearchX size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
                <p style={{ fontSize: "1.125rem", fontWeight: 700 }}>
                  Pencarian untuk "{searchQuery}" tidak ditemukan.
                </p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "2.5rem" }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", marginBottom: "1rem", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800 }}>
                    <AlertTriangle size={20} color="var(--color-danger, #e74c3c)" /> Kebutuhan (Needs) 50%
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {needsBudget.map((item) => <BudgetRow key={item.id} item={item} />)}
                  </div>
                </div>

                <div style={{ marginBottom: "2.5rem" }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", marginBottom: "1rem", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800 }}>
                    <Sparkles size={20} color="var(--color-purple)" /> Keinginan (Wants) 30%
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {wantsBudget.map((item) => <BudgetRow key={item.id} item={item} />)}
                  </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", marginBottom: "1rem", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800 }}>
                    <ShieldCheck size={20} color="var(--color-lime)" /> Tabungan (Savings) 20%
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {savingsBudget.map((item) => <BudgetRow key={item.id} item={item} />)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── TARGETS VIEW ───────────────────── */}
      {activeView === "targets" && (
        <div className="animate-slide-up">
          {/* Emergency Fund */}
          <div className="card-brutal" style={{
            padding: "2.5rem", marginBottom: "3rem",
            background: "var(--color-white)", border: "4px solid var(--color-navy)",
            boxShadow: `8px 8px 0px ${emergencyMonths >= 3 ? "var(--color-lime)" : "var(--color-orange)"}`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
              <div style={{ width: "80px", height: "80px", background: emergencyMonths >= 3 ? "var(--color-lime)" : "var(--color-orange)", borderRadius: "var(--radius-brutal-sm)", border: "3px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "4px 4px 0px var(--color-navy)" }}>
                <ShieldCheck size={44} color="var(--color-navy)" strokeWidth={2.5} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 900, color: "var(--color-navy)", marginBottom: "0.5rem" }}>
                  Dana Darurat: {emergencyMonths} bulan pengeluaran tersimpan
                </div>
                <div style={{ fontSize: "1rem", color: "var(--color-text-muted)", fontWeight: 700 }}>
                  Idealnya 3–6 bulan. Target: {formatRp(emergencyFundTarget)} | Terkumpul: {formatRp(emergencyFundCurrent)}
                </div>
              </div>
              <div style={{
                fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 900,
                color: "var(--color-white)", padding: "1rem 2rem",
                background: "var(--color-navy)", border: "3px solid var(--color-navy)",
                borderRadius: "var(--radius-brutal)", boxShadow: `6px 6px 0px ${emergencyMonths >= 3 ? "var(--color-lime)" : "var(--color-orange)"}`,
              }}>
                {Math.round((emergencyFundCurrent / (emergencyFundTarget || 1)) * 100)}%
              </div>
            </div>
          </div>

          {/* Savings Targets Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", margin: 0, color: "var(--color-navy)" }}>
              Target Tabungan
            </h3>
            <button onClick={() => setShowAddTarget(!showAddTarget)} className="btn-brutal" style={{
              padding: "0.75rem 1.25rem", fontWeight: 900, fontSize: "0.95rem",
              background: showAddTarget ? "var(--color-orange)" : "var(--color-navy)",
              color: "var(--color-white)", display: "flex", alignItems: "center", gap: "0.5rem",
              boxShadow: "4px 4px 0px var(--color-navy)",
            }}>
              <Plus size={18} style={{ transform: showAddTarget ? "rotate(45deg)" : "none", transition: "transform 0.2s" }} /> 
              {showAddTarget ? "Batal" : "Tambah Target"}
            </button>
          </div>

          {/* Add Target Form */}
          {showAddTarget && (
            <div className="card-brutal animate-bounce-in" style={{ padding: "2rem", marginBottom: "2.5rem", background: "var(--color-white)", boxShadow: "6px 6px 0px var(--color-purple)", overflow: "visible" }}>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr auto", gap: "1.5rem", alignItems: "end" }}>
                <div>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "0.85rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>ICON</label>
                  <IconPicker 
                    value={newTarget.icon} 
                    onChange={v => setNewTarget({ ...newTarget, icon: v })} 
                    options={ICON_OPTIONS} 
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "0.85rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>NAMA TARGET</label>
                  <input value={newTarget.name} onChange={e => setNewTarget({ ...newTarget, name: e.target.value })} className="input-brutal" placeholder="Contoh: Dana Nikah" style={{ border: "3px solid var(--color-navy)", padding: "0.75rem", width: "100%", boxShadow: "3px 3px 0px var(--color-navy)" }} />
                </div>
                <div>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "0.85rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>TARGET (RP)</label>
                  <input value={newTarget.target} onChange={e => setNewTarget({ ...newTarget, target: e.target.value })} className="input-brutal" type="number" placeholder="0" style={{ border: "3px solid var(--color-navy)", padding: "0.75rem", width: "100%", fontWeight: 900, boxShadow: "3px 3px 0px var(--color-navy)" }} />
                </div>
                <button onClick={handleAddTarget} className="btn-brutal" style={{
                  padding: "0.8rem 1.5rem", background: "var(--color-navy)", color: "var(--color-white)", fontWeight: 900,
                  display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "4px 4px 0px var(--color-lime)"
                }}>
                  <Plus size={18} /> Simpan
                </button>
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            {searchQuery && filteredTargets.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", padding: "3rem", textAlign: "center", border: "3px dashed var(--color-navy)", borderRadius: "var(--radius-brutal)", background: "var(--color-white)" }}>
                <SearchX size={48} color="var(--color-text-muted)" style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
                <p style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-navy)" }}>Pencarian untuk "{searchQuery}" tidak ditemukan.</p>
              </div>
            ) : (
              filteredTargets.map(t => {
                const pct = t.target > 0 ? Math.round((t.current / t.target) * 100) : 0;
                const remaining = t.target - t.current;
                return (
                  <div key={t.id} className="card-brutal" style={{ padding: "2rem", position: "relative", background: "var(--color-white)", boxShadow: `6px 6px 0px var(--color-${t.color})` }}>
                    <button onClick={() => deleteTarget(t.id)} style={{
                      position: "absolute", top: "1rem", right: "1rem", background: "var(--color-bg)",
                      border: "2px solid var(--color-navy)", borderRadius: "6px", cursor: "pointer", padding: "0.4rem", transition: "transform 0.2s"
                    }} className="hover:scale-110">
                    <Trash2 size={16} color="var(--color-navy)" />
                  </button>

                  <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem" }}>
                    <IconBox iconKey={t.icon} size={32} bg={`var(--color-${t.color})`} />
                    <div>
                      <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", fontWeight: 900, color: "var(--color-navy)" }}>{t.name}</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text-muted)" }}>Target: {t.deadline}</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <span style={{ fontWeight: 900, fontSize: "1.1rem", fontFamily: "var(--font-heading)" }}>{formatRp(t.current)}</span>
                      <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--color-text-muted)" }}>{formatRp(t.target)}</span>
                    </div>
                    <div className="progress-brutal" style={{ height: "24px", border: "2.5px solid var(--color-navy)", background: "var(--color-bg)" }}>
                      <div className="progress-brutal__fill" style={{ width: `${pct}%`, background: `var(--color-${t.color})`, borderRight: pct > 0 ? "2.5px solid var(--color-navy)" : "none" }} />
                      <div className="progress-brutal__label" style={{ fontSize: "0.85rem", fontWeight: 900 }}>{pct}%</div>
                    </div>
                  </div>

                  <div style={{ fontSize: "0.95rem", color: "var(--color-navy)", fontWeight: 700 }}>
                    Kurang <span style={{ fontWeight: 900, color: `var(--color-${t.color})`, padding: "0 0.2rem" }}>{formatRp(remaining)}</span> lagi!
                  </div>
                </div>
              );
            })
          )}
        </div>
        </div>
      )}
    </div>
  );

  return isGuest ? (
    <GuestLockOverlay featureName="Perencanaan Keuangan" variant="page">
      {pageContent}
    </GuestLockOverlay>
  ) : pageContent;
}
