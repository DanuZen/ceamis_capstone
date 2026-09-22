"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Target, Wallet, ShieldCheck, PiggyBank,
  TrendingUp, ArrowRight, Plus, CheckCircle2,
  Edit3, Trash2, Sparkles, AlertTriangle,
  Home, Gamepad2, Banknote, Utensils, Car,
  Smartphone, Tv, ShoppingCart, Coffee, Candy,
  Shield, Laptop, Plane, GraduationCap,
  Brain, ChevronDown, Loader, SearchX, Wand2
} from "lucide-react";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useTransactions } from "@/context/TransactionContext";
import { useGuest } from "@/context/GuestContext";
import { useUser } from "@/context/UserContext";
import GuestLockOverlay from "@/components/ui/GuestLockOverlay";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";
import { onboardingApi } from "@/lib/api";
import { translateCategoryName, translateRiskProfile } from "@/lib/translateCategory";
import { getDebts, getRiskProfile, saveRiskProfile } from "./actions";
import PageBanner from "@/components/layout/PageBanner";

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
      <Icon size={size} color={bg === "var(--color-lime)" || !bg || bg === "var(--color-bg)" ? "var(--color-navy)" : "var(--color-white)"} strokeWidth={2.5} />
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
        <div className="no-scrollbar" style={{
          position: "absolute", top: "100%", left: 0, width: "100%", marginTop: "0.5rem",
          background: "var(--color-white)", border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
          boxShadow: "4px 4px 0px var(--color-navy)", zIndex: 10, maxHeight: "250px", overflowY: "auto", display: "flex", flexDirection: "column"
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

const TypePicker = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: {key:string, label:string}[] }) => {
  const [open, setOpen] = useState(false);
  const selectedOpt = options.find(o => o.key === value) || options[0];

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
          {selectedOpt.label}
        </span>
        <ChevronDown size={16} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      
      {open && (
        <div className="no-scrollbar" style={{
          position: "absolute", top: "100%", left: 0, width: "100%", marginTop: "0.5rem",
          background: "var(--color-white)", border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
          boxShadow: "4px 4px 0px var(--color-navy)", zIndex: 10, maxHeight: "250px", overflowY: "auto", display: "flex", flexDirection: "column"
        }}>
          {options.map(opt => {
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
                {opt.label}
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

// ── Per-Profile Budget Presets ──────────────────────
const RISK_BUDGET_CONFIG: Record<string, {
  ratios: { needs: number; wants: number; savings: number };
  needsCategories: { id: string; name: string; icon: string }[];
  wantsCategories: { id: string; name: string; icon: string }[];
  savingsCategories: { id: string; name: string; icon: string }[];
}> = {
  "Konservatif": {
    ratios: { needs: 0.50, wants: 0.20, savings: 0.30 },
    needsCategories: [
      { id: "makan", name: "Makan & Minum", icon: "utensils" },
      { id: "transport", name: "Transportasi", icon: "car" },
      { id: "tagihan", name: "Tagihan & Utilitas", icon: "home" },
    ],
    wantsCategories: [
      { id: "hiburan", name: "Hiburan & Rekreasi", icon: "tv" },
      { id: "belanja", name: "Belanja & Lifestyle", icon: "cart" },
    ],
    savingsCategories: [
      { id: "darurat", name: "Dana Darurat", icon: "shield" },
      { id: "deposito", name: "Deposito", icon: "piggybank" },
      { id: "reksadana_pasar_uang", name: "Reksadana Pasar Uang", icon: "target" },
    ],
  },
  "Moderat": {
    ratios: { needs: 0.50, wants: 0.30, savings: 0.20 },
    needsCategories: [
      { id: "makan", name: "Makan & Minum", icon: "utensils" },
      { id: "transport", name: "Transportasi", icon: "car" },
      { id: "tagihan", name: "Tagihan & Utilitas", icon: "home" },
    ],
    wantsCategories: [
      { id: "hiburan", name: "Hiburan & Rekreasi", icon: "tv" },
      { id: "belanja", name: "Belanja & Lifestyle", icon: "cart" },
      { id: "kopi", name: "Kopi & Jajan", icon: "coffee" },
    ],
    savingsCategories: [
      { id: "reksadana_tetap", name: "Reksadana Pendapatan Tetap", icon: "target" },
      { id: "emas", name: "Emas", icon: "shield" },
      { id: "saham_bluechip", name: "Saham Blue Chip", icon: "piggybank" },
    ],
  },
  "Agresif": {
    ratios: { needs: 0.40, wants: 0.20, savings: 0.40 },
    needsCategories: [
      { id: "makan", name: "Makan & Minum", icon: "utensils" },
      { id: "transport", name: "Transportasi", icon: "car" },
      { id: "tagihan", name: "Tagihan & Utilitas", icon: "home" },
    ],
    wantsCategories: [
      { id: "hiburan", name: "Hiburan & Rekreasi", icon: "tv" },
      { id: "belanja", name: "Belanja & Lifestyle", icon: "cart" },
    ],
    savingsCategories: [
      { id: "saham_growth", name: "Saham Growth", icon: "target" },
      { id: "reksadana_saham", name: "Reksa Dana Saham", icon: "piggybank" },
      { id: "kripto", name: "Kripto", icon: "shield" },
    ],
  },
};

// ── Shared Risk Profile Colors ──────────────────────
const COLOR_MAP: Record<string, { bg: string; icon: string; text: string }> = {
  "Konservatif": { bg: "var(--color-lime)", icon: "var(--color-navy)",  text: "#15803d" },
  "Moderat":     { bg: "var(--color-blue)", icon: "var(--color-white)", text: "#1d4ed8" },
  "Agresif":     { bg: "var(--color-red)",  icon: "var(--color-white)", text: "#dc2626" },
};

// Fallback default (Moderat)
const DEFAULT_BUDGET: BudgetCategory[] = [
  { id: "makan", name: "Makan & Minum", type: "needs", allocated: 0, spent: 0, icon: "utensils" },
  { id: "transport", name: "Transportasi", type: "needs", allocated: 0, spent: 0, icon: "car" },
  { id: "tagihan", name: "Tagihan & Utilitas", type: "needs", allocated: 0, spent: 0, icon: "home" },
  { id: "hiburan", name: "Hiburan & Rekreasi", type: "wants", allocated: 0, spent: 0, icon: "tv" },
  { id: "belanja", name: "Belanja & Lifestyle", type: "wants", allocated: 0, spent: 0, icon: "cart" },
  { id: "kopi", name: "Kopi & Jajan", type: "wants", allocated: 0, spent: 0, icon: "coffee" },
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

const DEFAULT_TARGETS: SavingsTarget[] = [
  { id: 1, name: "Dana Darurat", target: 30000000, current: 0, icon: "shield", color: "purple", deadline: "TBD" },
  { id: 2, name: "Investasi Saham", target: 100000000, current: 0, icon: "target", color: "purple", deadline: "TBD" }
];

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

// ── Risk Profile Analysis ────────────────────────────────────────────────────
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
    color: "var(--color-blue)",
    accentColor: "var(--color-white)",
  },
  "Agresif": {
    description: "Kamu sangat goal-oriented dan punya disiplin finansial yang tinggi. Kamu siap untuk mengoptimalkan keuangan secara penuh dan mengejar target tabungan yang ambisius.",
    suggestion: "Maksimalkan saving rate kamu dan buat target tabungan yang spesifik dengan deadline jelas. Kamu sudah siap untuk strategi keuangan yang lebih advanced.",
    color: "var(--color-red)",
    accentColor: "var(--color-white)",
  },
};

// Kuis dipindahkan ke onboarding

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
  const { userData } = useUser();
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  const [budget, setBudget] = useState<BudgetCategory[]>([]);
  const [targets, setTargets] = useState<SavingsTarget[]>([]);
  const [activeView, setActiveView] = useState<"budget" | "targets">("budget");
  const [showAddTarget, setShowAddTarget] = useState(false);
  const [newTarget, setNewTarget] = useState({ name: "", target: "", icon: "target", deadline: "" });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"needs" | "wants" | "savings">("needs");
  const [newCategory, setNewCategory] = useState<{name: string; allocated: string; icon: string}>({ name: "", allocated: "", icon: "home" });
  const [isLoaded, setIsLoaded] = useState(false);
  const [baseIncome, setBaseIncome] = useState<number>(0);
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  // ── Risk Profile state ────────────────────────────────────────────────────
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);
  const [riskLoading, setRiskLoading] = useState(false);

  const [showTipsBubble, setShowTipsBubble] = useState(true);
  const [isClosingBubble, setIsClosingBubble] = useState(false);

  // Ensure main chat is closed when landing here to prioritize insight
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("cami-close-chat"));
  }, []);

  // Global click to close bubble
  useEffect(() => {
    if (!showTipsBubble || isClosingBubble) return;
    const timer = setTimeout(() => {
      const closeBubble = () => {
        setIsClosingBubble(true);
        setTimeout(() => setShowTipsBubble(false), 300);
      };
      window.addEventListener("click", closeBubble);
      return () => window.removeEventListener("click", closeBubble);
    }, 100);
    return () => clearTimeout(timer);
  }, [showTipsBubble, isClosingBubble]);

  // Sync character pose
  useEffect(() => {
    // Only force open if we have an insight to show
    const shouldOpen = showTipsBubble && !isClosingBubble && !!riskResult;
    window.dispatchEvent(new CustomEvent("cami-force-open", { detail: shouldOpen }));
    return () => {
      window.dispatchEvent(new CustomEvent("cami-force-open", { detail: false }));
    };
  }, [showTipsBubble, isClosingBubble, riskResult]);

  const fetchRiskProfile = useCallback(async () => {
    setRiskLoading(true);
    try {
      // 1. Get Onboarding data
      const onboardingData = await onboardingApi.get(userData.id);
      const inc = onboardingData?.income || 0;
      
      // 2. Calculate transaction metrics
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthTxns = transactions.filter(t => {
        const d = new Date(t.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
      const totalExpense = monthTxns.filter(t => t.type === "pengeluaran").reduce((acc, t) => acc + t.amount, 0);
      
      const expense_ratio = inc > 0 ? Math.min(totalExpense / inc, 1.0) : 0;
      const saving_rate = inc > 0 ? Math.max((inc - totalExpense) / inc, 0) : 0;
      const disposable_ratio = 1 - expense_ratio;
      
      // 3. Calculate DTI Ratio from cached debts
      let totalDebt = 0;
      try {
        const savedDebts = await getDebts(userData.id);
        if (savedDebts && savedDebts.length > 0) {
          totalDebt = savedDebts.filter((d: any) => d.type === "hutang" && d.status === "unpaid").reduce((acc: number, d: any) => acc + d.amount, 0);
        }
      } catch (e) {}
      const dti_ratio = (inc > 0 && totalDebt > 0) ? Math.min(totalDebt / (inc * 12), 1.0) : 0;

      // 4. Encode occupation
      const isStudent = onboardingData?.income_source === "uang_saku" ? 1 : 0;
      const isSelfEmployed = onboardingData?.income_source === "bisnis" || onboardingData?.income_source === "freelance" ? 1 : 0;
      const isProfessional = onboardingData?.income_source === "gaji" ? 1 : 0;

      // Retrieve answers from Prisma
      let answers: any = {};
      try {
        const cachedRisk = await getRiskProfile(userData.id);
        if (cachedRisk && cachedRisk.answers) {
          answers = JSON.parse(cachedRisk.answers);
        }
      } catch (e) {}

      // 5. Construct payload
      const payload = {
        saving_rate:       saving_rate,
        dti_ratio:         dti_ratio,
        disposable_ratio:  disposable_ratio,
        expense_ratio:     expense_ratio,
        ceamis_score:      (userData.healthScore || 50) / 100,

        punya_tabungan:        onboardingData?.punya_tabungan ? 1 : 0,
        jumlah_tabungan_bulan: onboardingData?.jumlah_tabungan_bulan || 0,

        SAVEHABIT:     onboardingData?.save_habit || 3,
        SELFCONTROL_1: answers["SELFCONTROL_1"] || 3,
        SCFHORIZON:    answers["SCFHORIZON"] || 3,
        FINGOALS:      answers["FINGOALS"] || 3,

        toleransi_rugi_enc:  onboardingData?.toleransi_rugi_enc || 1,
        tujuan_keuangan_enc: (onboardingData?.goals && onboardingData.goals.length > 0) ? 1 : 0,
        tanggungan_keluarga: onboardingData?.tanggungan_keluarga || 0,
        Age:                 onboardingData?.age || 20,
        city_tier_enc:       onboardingData?.city_tier_enc || 1,

        occ_Professional:  isProfessional,
        occ_Retired:       0,
        occ_Self_Employed: isSelfEmployed,
        occ_Student:       isStudent,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000"}/api/v1/predict/risk-profile`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
      );
      if (!res.ok) throw new Error("API error");
      const data: RiskResult = await res.json();
      setRiskResult(data);
      if (userData?.id && !isGuest) {
        await saveRiskProfile(userData.id, {
          profile: data.risk_profile,
          answers: JSON.stringify(answers),
          aiRecommendation: JSON.stringify({
            confidence: data.confidence,
            probabilities: data.probabilities,
            description: data.description,
            suggestion: data.suggestion
          })
        });
      }
    } catch {
      // fallback: derive dari jawaban secara lokal (mock)
      let answers: any = {};
      try {
        const cachedAnswers = localStorage.getItem("ceamis_risk_answers");
        if (cachedAnswers) answers = JSON.parse(cachedAnswers);
      } catch (e) {}
      
      const score = Object.values(answers).reduce((a: any, b: any) => a + b, 0) as number;
      const profile = score < 6 ? "Konservatif" : score < 11 ? "Moderat" : "Agresif";
      const info = PROFILE_INFO[profile];
      const mockData = {
        risk_profile: profile as RiskResult["risk_profile"],
        confidence: 0.75,
        probabilities: { Konservatif: profile==="Konservatif"?0.75:0.15, Moderat: profile==="Moderat"?0.75:0.15, Agresif: profile==="Agresif"?0.75:0.10 },
        description: info.description,
        suggestion: info.suggestion,
        is_mock: true,
      };
      setRiskResult(mockData);
      if (userData?.id && !isGuest) {
        await saveRiskProfile(userData.id, {
          profile: mockData.risk_profile,
          answers: JSON.stringify(answers),
          aiRecommendation: JSON.stringify({
            confidence: mockData.confidence,
            probabilities: mockData.probabilities,
            description: mockData.description,
            suggestion: mockData.suggestion
          })
        });
      }
    } finally {
      setRiskLoading(false);
    }
  }, []);

  // Load cached risk result
  useEffect(() => {
    const loadCachedRisk = async () => {
      const cached = userData?.id ? await getRiskProfile(userData.id) : null;
      if (cached) {
        try {
          const aiRec = cached.aiRecommendation ? JSON.parse(cached.aiRecommendation) : {};
          const parsed = {
            risk_profile: cached.profile,
            confidence: aiRec.confidence || 0,
            probabilities: aiRec.probabilities || { Konservatif: 0, Moderat: 0, Agresif: 0 },
            description: aiRec.description || "",
            suggestion: aiRec.suggestion || "",
            is_mock: false
          };
          setRiskResult(parsed as RiskResult);
        } catch (e) {}
      }
    };
    loadCachedRisk();
  }, [userData?.id]);

  useEffect(() => {
    const initData = async () => {
      let income = 0;
      if (!isGuest && userData?.id) {
        try {
          const data = await onboardingApi.get(userData.id);
          if (data && data.income) {
            income = data.income;
            setBaseIncome(data.income);
          }
        } catch (e) {
          console.error("Failed to fetch onboarding for budget", e);
        }
      }

      const savedBudget = localStorage.getItem("ceamis_budget");
      const savedTargets = localStorage.getItem("ceamis_targets");
      
      let initialBudget: BudgetCategory[] = [];
      let initialTargets = savedTargets ? JSON.parse(savedTargets) : [...DEFAULT_TARGETS];

      if (savedBudget) {
        initialBudget = JSON.parse(savedBudget);

        // --- FIX: Auto-distribute if any category total is 0 ---
        const dynInc = transactions.filter(tx => tx.type === "pemasukan").reduce((s, tx) => s + tx.amount, 0);
        const effInc = dynInc > 0 ? dynInc : (income > 0 ? income : 4500000);
        
        const rRatios = getRiskTargetRatios();
        (["needs", "wants", "savings"] as const).forEach(type => {
          const typeItems = initialBudget.filter(b => b.type === type);
          const typeSum = typeItems.reduce((s, b) => s + b.allocated, 0);
          if (typeSum === 0 && typeItems.length > 0) {
            const cap = Math.round(effInc * rRatios[type] / 100);
            const perItem = Math.floor(cap / typeItems.length);
            const rem = cap % typeItems.length;
            let dCount = 0;
            initialBudget = initialBudget.map(b => {
              if (b.type === type) {
                const amt = dCount === 0 ? perItem + rem : perItem;
                dCount++;
                return { ...b, allocated: amt };
              }
              return b;
            });
          }
        });
      } else {
        // Get risk profile from DB, fallback to "Moderat"
        let riskProfile: "Konservatif" | "Moderat" | "Agresif" = "Moderat";
        try {
          const cachedProfile = userData?.id ? await getRiskProfile(userData.id) : null;
          if (cachedProfile && cachedProfile.profile in RISK_BUDGET_CONFIG) {
            riskProfile = cachedProfile.profile as "Konservatif" | "Moderat" | "Agresif";
          }
        } catch (e) {}

        const config = RISK_BUDGET_CONFIG[riskProfile];
        const { needs: pNeeds, wants: pWants, savings: pSavings } = config.ratios;

        const needsTotal = income * pNeeds;
        const wantsTotal = income * pWants;
        const savingsTotal = income * pSavings;

        // Build budget from per-profile category presets
        initialBudget = [
          ...config.needsCategories.map(c => ({
            ...c, type: "needs" as const, spent: 0,
            allocated: income > 0 ? Math.round(needsTotal / config.needsCategories.length) : 0,
          })),
          ...config.wantsCategories.map(c => ({
            ...c, type: "wants" as const, spent: 0,
            allocated: income > 0 ? Math.round(wantsTotal / config.wantsCategories.length) : 0,
          })),
          ...config.savingsCategories.map(c => ({
            ...c, type: "savings" as const, spent: 0,
            allocated: income > 0 ? Math.round(savingsTotal / config.savingsCategories.length) : 0,
          })),
        ];
      }

      // Auto-sync missing targets from savings budgets (budget -> targets)
      initialBudget.filter((b: any) => b.type === "savings").forEach((b: any) => {
        if (!initialTargets.find((t: any) => t.name === b.name)) {
          initialTargets.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: b.name,
            target: b.allocated > 0 ? b.allocated * 12 : 0,
            current: 0,
            icon: b.icon,
            color: "purple",
            deadline: "TBD"
          });
        }
      });

      // Auto-sync missing savings budgets from targets (targets -> budget)
      initialTargets.forEach((t: any) => {
        if (!initialBudget.find((b: any) => b.type === "savings" && b.name === t.name)) {
          initialBudget.push({
            id: Date.now().toString() + Math.floor(Math.random() * 1000),
            name: t.name,
            type: "savings",
            allocated: 0,
            spent: 0,
            icon: t.icon
          });
        }
      });

      setBudget(initialBudget);
      setTargets(initialTargets);
      setIsLoaded(true);
    };

    initData();
  }, [isGuest, userData?.id]);

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
  const income = dynamicIncome > 0 ? dynamicIncome : (baseIncome > 0 ? baseIncome : 4500000);

  // Auto-balance if cap changes (due to income or risk profile changes)
  useEffect(() => {
    if (!isLoaded || budget.length === 0) return;
    
    let needsUpdate = false;
    let newBudget = [...budget];
    const rRatios = getRiskTargetRatios();

    (["needs", "wants", "savings"] as const).forEach(type => {
      const typeItems = newBudget.filter(b => b.type === type);
      if (typeItems.length === 0) return;

      const currentSum = typeItems.reduce((s, b) => s + b.allocated, 0);
      const cap = Math.round(income * rRatios[type] / 100);
      
      const difference = cap - currentSum;
      if (difference !== 0) {
        needsUpdate = true;
        let amountToDistribute = difference; 
        let itemsToModify = [...typeItems];
        let attempts = 0;

        while (Math.abs(amountToDistribute) > 0 && attempts < 10 && itemsToModify.length > 0) {
          const perItem = Math.trunc(amountToDistribute / itemsToModify.length);
          const remainder = amountToDistribute % itemsToModify.length;
          let nextItemsToModify: typeof itemsToModify = [];
          let distributedThisRound = 0;

          for (let i = 0; i < itemsToModify.length; i++) {
            const it = itemsToModify[i];
            const currentIdx = newBudget.findIndex(b => b.id === it.id);
            const currentAlloc = newBudget[currentIdx].allocated;
            
            let change = perItem;
            if (i === 0) change += remainder;

            let nextAlloc = currentAlloc + change;
            if (nextAlloc < 0) {
              change = -currentAlloc;
              nextAlloc = 0;
            } else {
              nextItemsToModify.push(it);
            }

            newBudget[currentIdx] = { ...newBudget[currentIdx], allocated: nextAlloc };
            distributedThisRound += change;
          }
          amountToDistribute -= distributedThisRound;
          itemsToModify = nextItemsToModify;
          attempts++;
        }
      }
    });

    if (needsUpdate) {
      setBudget(newBudget);
    }
  }, [isLoaded, income, budget]);

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
  
  // Percentages for allocation bars (from actual totals)
  const needsPercent = totalAllocated > 0 ? Math.round((totalNeeds / totalAllocated) * 100) : 0;
  const wantsPercent = totalAllocated > 0 ? Math.round((totalWants / totalAllocated) * 100) : 0;
  const savingsPercent = totalAllocated > 0 ? Math.round((totalSavings / totalAllocated) * 100) : 0;

  // Target percentages from risk profile (for header badge display)
  const getRiskTargetRatios = () => {
    if (riskResult?.risk_profile) {
      const config = RISK_BUDGET_CONFIG[riskResult.risk_profile];
      if (config) return {
        needs: Math.round(config.ratios.needs * 100),
        wants: Math.round(config.ratios.wants * 100),
        savings: Math.round(config.ratios.savings * 100),
      };
    }
    return { needs: 50, wants: 30, savings: 20 }; // Moderat fallback
  };
  const riskRatios = getRiskTargetRatios();
  const badgeNeeds   = riskRatios.needs;
  const badgeWants   = riskRatios.wants;
  const badgeSavings = riskRatios.savings;

  // Badge amounts: always calculate from income × ratio as the absolute limit
  const badgeNeedsRp   = Math.round(income * riskRatios.needs / 100);
  const badgeWantsRp   = Math.round(income * riskRatios.wants / 100);
  const badgeSavingsRp = Math.round(income * riskRatios.savings / 100);

  const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  const emergencyFundTarget = totalNeeds * 6;
  const emergencyFundCurrent = targets.find(t => t.name === "Dana Darurat")?.current || 0;
  const emergencyMonths = Math.floor(emergencyFundCurrent / (totalNeeds > 0 ? totalNeeds : 1));

  const handleAddTarget = () => {
    if (!newTarget.name || !newTarget.target) return;
    const newId = Date.now();
    setTargets([...targets, {
      id: newId, name: newTarget.name, target: parseInt(newTarget.target),
      current: 0, icon: newTarget.icon, color: "purple", deadline: newTarget.deadline || "TBD"
    }]);
    setBudget([...budget, {
      id: newId.toString(),
      name: newTarget.name,
      type: "savings",
      allocated: 0,
      spent: 0,
      icon: newTarget.icon
    }]);
    setNewTarget({ name: "", target: "", icon: "target", deadline: "" });
    setShowAddTarget(false);
  };

  const handleAddCategory = () => {
    if (!newCategory.name) return;
    setBudget([...budget, {
      id: Date.now().toString(),
      name: newCategory.name,
      type: activeFilter,
      allocated: parseInt(newCategory.allocated) || 0,
      spent: 0,
      icon: newCategory.icon
    }]);
    setNewCategory({ name: "", allocated: "", icon: "home" });
    setShowAddCategory(false);
  };

  const handleDeleteCategory = (id: string, type: string) => {
    const typeItems = budget.filter(b => b.type === type);
    if (typeItems.length <= 1) {
      showToast(t("dashboard.planning.cannotDeleteLast") || "Cannot delete the last category. At least one category must remain.", "error");
      return;
    }
    setBudget(budget.filter(b => b.id !== id));
  };

  const handleAdjustAllocation = (id: string, newValue: number) => {
    const typeItems = budget.filter(b => b.type === activeFilter);
    const targetItem = typeItems.find(b => b.id === id);
    if (!targetItem) return;

    const cap = Math.round(income * riskRatios[activeFilter] / 100);
    const clampedValue = Math.max(0, Math.min(newValue, cap));
    const difference = clampedValue - targetItem.allocated;
    
    if (difference === 0) return;

    let otherItems = typeItems.filter(b => b.id !== id);
    if (otherItems.length === 0) {
      setBudget(budget.map(b => b.id === id ? { ...b, allocated: clampedValue } : b));
      return;
    }

    let amountToDistribute = -difference; 
    let newBudget = [...budget];
    let itemsToModify = [...otherItems];
    let attempts = 0;

    while (Math.abs(amountToDistribute) > 0 && attempts < 10 && itemsToModify.length > 0) {
      const perItem = Math.trunc(amountToDistribute / itemsToModify.length);
      const remainder = amountToDistribute % itemsToModify.length;
      
      let nextItemsToModify: typeof itemsToModify = [];
      let distributedThisRound = 0;

      for (let i = 0; i < itemsToModify.length; i++) {
        const it = itemsToModify[i];
        const currentIdx = newBudget.findIndex(b => b.id === it.id);
        const currentAlloc = newBudget[currentIdx].allocated;
        
        let change = perItem;
        if (i === 0) change += remainder;

        let nextAlloc = currentAlloc + change;
        if (nextAlloc < 0) {
          change = -currentAlloc;
          nextAlloc = 0;
        } else {
          nextItemsToModify.push(it);
        }

        newBudget[currentIdx] = { ...newBudget[currentIdx], allocated: nextAlloc };
        distributedThisRound += change;
      }

      amountToDistribute -= distributedThisRound;
      itemsToModify = nextItemsToModify;
      attempts++;
    }

    const targetIdx = newBudget.findIndex(b => b.id === id);
    newBudget[targetIdx] = { ...newBudget[targetIdx], allocated: clampedValue + amountToDistribute };

    setBudget(newBudget);
  };

  const renderBudgetRow = (item: BudgetCategory) => {
    const pct = item.allocated > 0 ? Math.round((item.spent / item.allocated) * 100) : 0;
    const isOverBudget = item.spent > item.allocated && item.allocated > 0;
    const isNearLimit = pct >= 80 && !isOverBudget;

    return (
      <div key={item.id} className="card-brutal" style={{
        display: "flex", flexDirection: "column", gap: "0.65rem", padding: "0.85rem 1rem",
        background: isOverBudget ? "#fff5f5" : "#F8FAFC",
        border: `2px solid ${isOverBudget ? "#e74c3c" : "var(--color-navy)"}`,
        borderRadius: "12px",
        boxShadow: isOverBudget ? "2px 2px 0px #e74c3c" : "2px 2px 0px var(--color-navy)",
        transition: "all 0.2s"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ flexShrink: 0 }}>
            <IconBox iconKey={item.icon} size={18} bg={isOverBudget ? "#e74c3c" : item.type === "needs" ? "var(--color-lime)" : item.type === "wants" ? "var(--color-orange)" : "var(--color-purple)"} />
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 900, fontSize: "0.95rem", color: isOverBudget ? "#e74c3c" : "var(--color-navy)" }}>{translateCategoryName(item.name, t)}</span>
            {isEditingCategory && (
              <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                <input 
                  type="text" 
                  value={item.allocated === 0 ? "" : item.allocated.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} 
                  onChange={e => {
                    const unformatted = e.target.value.replace(/\D/g, "");
                    const val = parseInt(unformatted) || 0;
                    handleAdjustAllocation(item.id, val);
                  }}
                  className="input-brutal"
                  style={{ width: "120px", padding: "0.3rem 0.5rem", fontSize: "0.8rem", border: "1.8px solid var(--color-navy)", borderRadius: "6px", fontWeight: 800 }}
                  placeholder="0"
                />
                <button 
                  type="button"
                  onClick={() => handleDeleteCategory(item.id, item.type)}
                  className="btn-brutal"
                  style={{ background: "#ffebee", border: "1.8px solid var(--color-navy)", borderRadius: "6px", cursor: "pointer", padding: "0.3rem 0.4rem", color: "#e74c3c", display: "flex", alignItems: "center", justifyContent: "center" }}
                  title="Hapus Kategori"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <span style={{ fontWeight: 800, fontFamily: "var(--font-heading)", fontSize: "0.92rem", color: isOverBudget ? "#e74c3c" : "var(--color-navy)" }}>
              {formatRp(item.spent)} <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 700 }}>/ {formatRp(item.allocated)}</span>
            </span>
            <span style={{ fontSize: "0.82rem", fontWeight: 900, color: isOverBudget ? "#e74c3c" : "var(--color-navy)" }}>{pct}%</span>
          </div>
          <div style={{ width: "100%", height: "10px", background: "var(--color-bg)", border: `1.5px solid ${isOverBudget ? "#e74c3c" : "var(--color-navy)"}`, borderRadius: "100px", overflow: "hidden", position: "relative" }}>
            <div style={{
              width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: "100px",
              background: isOverBudget ? "#e74c3c" : isNearLimit ? "var(--color-orange)" : `var(--color-${item.type === "needs" ? "lime" : item.type === "wants" ? "orange" : "purple"})`,
              transition: "width 0.5s ease", borderRight: pct > 0 ? `1.5px solid ${isOverBudget ? "#c0392b" : "var(--color-navy)"}` : "none"
            }} />
          </div>
          {isOverBudget && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "#e74c3c", padding: "0.3rem 0.6rem", borderRadius: "6px", border: "1.5px solid #c0392b", marginTop: "0.2rem" }}>
              <AlertTriangle size={12} color="white" />
              <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "white" }}>{t("dashboard.planning.overBudgetWarning") || "Spending exceeds allocation limit!"}</span>
            </div>
          )}
          {isNearLimit && (
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#e67e22", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <AlertTriangle size={11} /> {t("dashboard.planning.approachingLimit") || "Approaching limit"} ({pct}%)
            </span>
          )}
        </div>
      </div>
    );
  };

  const getTranslatedSug = (p: string, defaultSug: string) => {
    if (language === "id") return defaultSug;
    if (p === "Konservatif") return t("dashboard.planning.profileConservativeSug");
    if (p === "Moderat") return t("dashboard.planning.profileModerateSug");
    if (p === "Agresif") return t("dashboard.planning.profileAggressiveSug");
    return defaultSug;
  };

  const pageContent = (
    <div style={{ paddingBottom: "3rem" }}>
      {/* Header Banner */}
      <PageBanner
        badgeText="PERENCANAAN STRATEGIS"
        title={t("dashboard.planning.title") || "Perencanaan Keuangan"}
        description={t("dashboard.planning.desc") || "Kelola anggaran dan target tabungan kamu. Keuangan terencana bikin hidup lebih tenang!"}
        rightCard={{
          icon: <Target size={24} className="text-[#0A192F]" />,
          label: "TOTAL POS ANGGARAN",
          value: `${budgetWithSpent.length} Kategori`,
        }}
        className="mb-4"
      />

      {/* Top Row: 4 Stats Cards */}
      <div className="dashboard-bento-grid stagger-children" style={{ marginBottom: "1.5rem" }}>

        {/* Risk Profile Card - FIRST */}
        {(() => {
          const profile = riskResult?.risk_profile ?? "";
          const colors = COLOR_MAP[profile];
          return (
            <div
              style={{
                background: "#FFFFFF",
                border: "2.5px solid var(--color-navy)",
                borderRadius: "16px",
                boxShadow: "4px 4px 0px var(--color-navy)",
                padding: "1.15rem 1.25rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#475569", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                  {t("dashboard.planning.riskProfileLabel") || "PROFIL RISIKO"}
                </span>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    background: colors ? colors.bg : "#E2E8F0",
                    border: "1.5px solid var(--color-navy)",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Brain size={16} color={colors ? colors.icon : "var(--color-navy)"} strokeWidth={2.5} />
                </div>
              </div>

              <div style={{ margin: "0.65rem 0" }}>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 900, color: colors ? colors.text : "var(--color-navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
                  {translateRiskProfile(profile, t) || "Moderat"}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ background: colors ? colors.bg : "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: "999px", padding: "2px 8px", fontSize: "0.68rem", fontWeight: 700, color: "var(--color-navy)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Sparkles size={12} strokeWidth={2.5} /> Analisis Finansial
                </span>
                <span style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 600 }}>
                  Toleransi Risiko
                </span>
              </div>
            </div>
          );
        })()}

        {[
          { id: "needs", label: t("dashboard.planning.needs") || "Kebutuhan", amount: badgeNeedsRp, color: "lime", Icon: Home, badgeColor: "var(--color-lime)", ratio: "50%" },
          { id: "wants", label: t("dashboard.planning.wants") || "Keinginan", amount: badgeWantsRp, color: "yellow", Icon: Gamepad2, badgeColor: "#FFE100", ratio: "30%" },
          { id: "savings", label: t("dashboard.planning.savings") || "Tabungan", amount: badgeSavingsRp, color: "blue", Icon: Banknote, badgeColor: "#DBEAFE", ratio: "20%" },
        ].map((s, idx) => {
          const isActive = activeFilter === s.id;
          const typeItems = budgetWithSpent.filter(b => b.type === s.id);
          const totalSpent = typeItems.reduce((acc, curr) => acc + (curr.spent || 0), 0);
          const hasOverBudget = typeItems.some(b => b.spent > b.allocated && b.allocated > 0);
          const hasNearLimit = typeItems.some(b => {
            const pct = b.allocated > 0 ? Math.round((b.spent / b.allocated) * 100) : 0;
            return pct >= 80 && b.spent <= b.allocated;
          });
          const hasAnyWarning = hasOverBudget || hasNearLimit;

          return (
            <div 
              key={idx} 
              onClick={() => setActiveFilter(activeFilter === s.id ? "all" : (s.id as any))}
              style={{ 
                position: "relative",
                cursor: "pointer",
                background: isActive ? "#F8FAFC" : "#FFFFFF", 
                border: hasOverBudget ? "2.5px solid #e74c3c" : isActive ? "2.5px solid var(--color-navy)" : "2.5px solid var(--color-navy)", 
                boxShadow: isActive ? "2px 2px 0px var(--color-navy)" : "4px 4px 0px var(--color-navy)", 
                transform: isActive ? "translate(2px, 2px)" : "none", 
                borderRadius: "16px",
                padding: "1.15rem 1.25rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.15s ease" 
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#475569", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                    {s.label} ({s.ratio})
                  </span>
                  {isActive && (
                    <span style={{ background: "var(--color-navy)", color: "#FFFFFF", fontSize: "0.6rem", fontWeight: 800, padding: "1px 5px", borderRadius: "4px" }}>
                      AKTIF
                    </span>
                  )}
                </div>
                <div 
                  style={{ 
                    width: "28px", 
                    height: "28px", 
                    background: s.badgeColor, 
                    border: "1.5px solid var(--color-navy)", 
                    borderRadius: "6px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center" 
                  }}
                >
                  <s.Icon size={16} color="var(--color-navy)" strokeWidth={2.5} />
                </div>
              </div>

              <div style={{ margin: "0.65rem 0" }}>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 900, color: "var(--color-navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
                  {formatRp(s.amount)}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.72rem", color: hasOverBudget ? "#DC2626" : "#475569", fontWeight: 700 }}>
                  Terpakai: {formatRp(totalSpent)}
                </span>
                <span style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 600 }}>
                  {typeItems.length} pos
                </span>
              </div>

              {hasAnyWarning && (
                <span style={{ position: "absolute", top: "-6px", right: "-6px", width: "14px", height: "14px", borderRadius: "50%", background: hasOverBudget ? "#e74c3c" : "#e67e22", border: "2px solid var(--color-white)", boxShadow: "0 0 0 2px " + (hasOverBudget ? "#e74c3c" : "#e67e22"), animation: "pulse-border 1.2s ease-in-out infinite", display: "flex", alignItems: "center", justifyContent: "center" }} title={hasOverBudget ? (t("dashboard.planning.overBudgetWarning") || "Over budget!") : (t("dashboard.planning.approachingLimit") || "Approaching limit")} />
              )}
            </div>
          );
        })}

      </div>

      {/* ── Main 2-Column Grid (2 Large Enclosing Cards) ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
        
        {/* ── CARD BESAR 1: Risk Profile Card (5 cols) ── */}
        <div 
          style={{
            background: "#FFFFFF",
            border: "2.5px solid var(--color-navy)",
            borderRadius: "16px",
            boxShadow: "4px 4px 0px var(--color-navy)",
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
            height: "100%",
            minHeight: "560px",
          }}
          className="lg:col-span-5"
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {/* Header Card 1 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div 
                  style={{
                    width: "34px",
                    height: "34px",
                    background: "var(--color-purple)",
                    border: "2px solid var(--color-navy)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "2px 2px 0px var(--color-navy)",
                    flexShrink: 0
                  }}
                >
                  <Brain size={17} color="var(--color-white)" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 900, color: "var(--color-navy)", margin: 0, lineHeight: 1.2 }}>
                    {t("dashboard.planning.riskProfileTitle")}
                  </h3>
                  <p style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 600, margin: "2px 0 0 0" }}>
                    {t("dashboard.planning.riskProfileSubtitle") || "Klasifikasi Kepribadian Finansial"}
                  </p>
                </div>
              </div>

              {riskResult && (
                <button
                  type="button"
                  onClick={() => fetchRiskProfile()}
                  style={{
                    background: "var(--color-white)",
                    color: "var(--color-navy)",
                    border: "1.5px solid var(--color-navy)",
                    boxShadow: "2px 2px 0px var(--color-navy)",
                    borderRadius: "6px",
                    padding: "0.3rem 0.6rem",
                    fontSize: "0.72rem",
                    fontWeight: 900,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem"
                  }}
                  title="Analisis Ulang"
                >
                  <Sparkles size={12} />
                  Analisis Ulang
                </button>
              )}
            </div>

            {/* Loading */}
            {riskLoading && (
              <div style={{ padding: "3rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem", flex: 1 }}>
                <Loader size={36} color="var(--color-purple)" style={{ animation: "spin 1s linear infinite" }} />
                <span style={{ fontWeight: 800, color: "var(--color-navy)", fontSize: "0.95rem" }}>{t("dashboard.planning.aiLoading")}</span>
              </div>
            )}

            {/* Result */}
            {riskResult && !riskLoading && (() => {
              const info = PROFILE_INFO[riskResult.risk_profile];
              
              const getTranslatedProfile = (p: string) => {
                return translateRiskProfile(p, t);
              };

              const getTranslatedDesc = (p: string, defaultDesc: string) => {
                if (language === "id") return defaultDesc;
                if (p === "Konservatif") return t("dashboard.planning.profileConservativeDesc");
                if (p === "Moderat") return t("dashboard.planning.profileModerateDesc");
                if (p === "Agresif") return t("dashboard.planning.profileAggressiveDesc");
                return defaultDesc;
              };

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1, justifyContent: "space-between" }}>
                  {/* Banner Profile */}
                  <div 
                    style={{
                      background: info?.color || "var(--color-blue)",
                      border: "2px solid var(--color-navy)",
                      borderRadius: "12px",
                      padding: "1rem",
                      boxShadow: "2px 2px 0px var(--color-navy)",
                      color: info?.accentColor || (riskResult.risk_profile === "Konservatif" ? "var(--color-navy)" : "#FFFFFF"),
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <span style={{ 
                        fontSize: "0.68rem", 
                        fontWeight: 900, 
                        textTransform: "uppercase", 
                        letterSpacing: "0.5px", 
                        background: riskResult.risk_profile === "Konservatif" ? "rgba(10,25,47,0.12)" : "rgba(255,255,255,0.2)", 
                        color: info?.accentColor || (riskResult.risk_profile === "Konservatif" ? "var(--color-navy)" : "#FFFFFF"),
                        padding: "2px 8px", 
                        borderRadius: "4px" 
                      }}>
                        PROFIL RISIKO FINANSIAL
                      </span>
                    </div>
                    <h4 style={{ 
                      fontFamily: "var(--font-heading)", 
                      fontSize: "1.4rem", 
                      fontWeight: 900, 
                      margin: "0 0 0.35rem 0", 
                      textTransform: "capitalize",
                      color: info?.accentColor || (riskResult.risk_profile === "Konservatif" ? "var(--color-navy)" : "#FFFFFF")
                    }}>
                      {getTranslatedProfile(riskResult.risk_profile)}
                    </h4>
                    <p style={{ 
                      fontSize: "0.78rem", 
                      lineHeight: 1.45, 
                      margin: 0, 
                      fontWeight: 600, 
                      opacity: 0.95,
                      color: info?.accentColor || (riskResult.risk_profile === "Konservatif" ? "var(--color-navy)" : "#FFFFFF")
                    }}>
                      {getTranslatedDesc(riskResult.risk_profile, riskResult.description)}
                    </p>
                  </div>

                  {/* Probability bars */}
                  <div 
                    style={{
                      background: "#F8FAFC",
                      border: "2px solid var(--color-navy)",
                      borderRadius: "12px",
                      padding: "0.85rem 1rem",
                      boxShadow: "2px 2px 0px var(--color-navy)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.6rem",
                    }}
                  >
                    <span style={{ fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", color: "var(--color-navy)", letterSpacing: "0.5px" }}>
                      DISTRIBUSI PROFIL RISIKO
                    </span>
                    {(["Konservatif","Moderat","Agresif"] as const).map(p => {
                      const prob = Math.round((riskResult.probabilities[p] || 0) * 100);
                      const isActive = riskResult.risk_profile === p;
                      return (
                        <div key={p} style={{ width: "100%" }}>
                          <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "0.25rem", display: "flex", justifyContent: "space-between" }}>
                            <span>{getTranslatedProfile(p)}</span><span>{prob}%</span>
                          </div>
                          <div style={{ height: "10px", background: "var(--color-white)", border: "1.5px solid var(--color-navy)", borderRadius: "100px", overflow: "hidden" }}>
                            <div style={{ width: `${prob}%`, height: "100%", background: isActive ? PROFILE_INFO[p].color : "var(--color-text-light)", transition: "width 0.8s ease", borderRight: prob > 0 ? "1.5px solid var(--color-navy)" : "none" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Empty state */}
            {!riskResult && !riskLoading && (
              <div style={{ padding: "3rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center" }}>
                <div style={{ background: "var(--color-bg)", width: "56px", height: "56px", borderRadius: "50%", border: "2px dashed var(--color-navy)", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Brain size={28} color="var(--color-navy)" strokeWidth={2} style={{ opacity: 0.6 }} />
                </div>
                <p style={{ margin: "0 0 1rem 0", fontWeight: 800, fontSize: "0.85rem", color: "var(--color-navy)", opacity: 0.8, maxWidth: "80%" }}>
                  {t("dashboard.planning.clickToStart") || "Klik 'Mulai Analisis' untuk mengetahui profil risiko keuanganmu!"}
                </p>
                <button
                  onClick={() => fetchRiskProfile()}
                  className="btn-brutal"
                  style={{ padding: "0.6rem 1.25rem", background: "var(--color-orange)", color: "var(--color-navy)", fontWeight: 900, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem", boxShadow: "3px 3px 0px var(--color-navy)", border: "2px solid var(--color-navy)", borderRadius: "8px", cursor: "pointer" }}
                >
                  <Sparkles size={16} /> {t("dashboard.planning.analyzeProfile") || "Analisis Profil Saya"}
                </button>
              </div>
            )}
          </div>

          {/* Footer Card 1 */}
          <div style={{ marginTop: "auto", paddingTop: "0.85rem" }}>
            <div 
              style={{
                background: "rgba(184, 255, 0, 0.14)",
                border: "1.8px solid var(--color-navy)",
                boxShadow: "2px 2px 0px var(--color-navy)",
                borderRadius: "10px",
                padding: "0.6rem 0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem"
              }}
            >
              <div 
                style={{
                  background: "var(--color-lime)",
                  border: "1.2px solid var(--color-navy)",
                  borderRadius: "6px",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <Sparkles size={12} color="var(--color-navy)" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-navy)", lineHeight: 1.3 }}>
                Rasio alokasi optimal (Needs / Wants / Savings) disesuaikan berdasarkan kepribadian finansial kamu.
              </span>
            </div>
          </div>
        </div>

        {/* ── CARD BESAR 2: Budget Allocation View (7 cols) ── */}
        <div 
          style={{
            background: "#FFFFFF",
            border: "2.5px solid var(--color-navy)",
            borderRadius: "16px",
            boxShadow: "4px 4px 0px var(--color-navy)",
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
            height: "100%",
            minHeight: "560px",
          }}
          className="lg:col-span-7"
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            {/* Header Card 2 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div 
                  style={{
                    width: "34px",
                    height: "34px",
                    background: activeFilter === "needs" ? "var(--color-lime)" : activeFilter === "wants" ? "var(--color-orange)" : "var(--color-purple)",
                    border: "2px solid var(--color-navy)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "2px 2px 0px var(--color-navy)",
                    flexShrink: 0
                  }}
                >
                  {activeFilter === "needs" ? (
                    <AlertTriangle size={17} color="var(--color-navy)" strokeWidth={2.5} />
                  ) : activeFilter === "wants" ? (
                    <Sparkles size={17} color="var(--color-white)" strokeWidth={2.5} />
                  ) : (
                    <ShieldCheck size={17} color="var(--color-white)" strokeWidth={2.5} />
                  )}
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 900, color: "var(--color-navy)", margin: 0, lineHeight: 1.2 }}>
                    {activeFilter === "needs" ? (t("dashboard.planning.needs") || "Kebutuhan") : activeFilter === "wants" ? (t("dashboard.transactions.wants") || "Keinginan") : t("dashboard.transactions.save")}
                  </h3>
                  <p style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 600, margin: "2px 0 0 0" }}>
                    Kelola alokasi kategori pengeluaran dan target batas anggaran
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                <button onClick={() => setIsEditingCategory(!isEditingCategory)} className="btn-brutal" style={{
                  padding: "0.35rem 0.75rem", fontWeight: 800, fontSize: "0.75rem", borderRadius: "8px",
                  background: isEditingCategory ? "var(--color-lime)" : "#F8FAFC", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.35rem",
                  boxShadow: "2px 2px 0px var(--color-navy)", border: "1.8px solid var(--color-navy)", cursor: "pointer"
                }} title={t("dashboard.planning.editAllocation") || "Edit Alokasi Budget"}>
                  {isEditingCategory ? <CheckCircle2 size={14} /> : <Edit3 size={14} />} 
                  {isEditingCategory ? t("dashboard.planning.saveBtn") : t("dashboard.planning.editBtn")}
                </button>
                <button onClick={() => setShowAddCategory(!showAddCategory)} className="btn-brutal" style={{
                  padding: "0.35rem 0.75rem", fontWeight: 800, fontSize: "0.75rem", borderRadius: "8px",
                  background: showAddCategory ? "var(--color-orange)" : "var(--color-navy)",
                  color: "var(--color-white)", display: "flex", alignItems: "center", gap: "0.35rem",
                  boxShadow: "2px 2px 0px var(--color-navy)", border: "1.8px solid var(--color-navy)", cursor: "pointer"
                }}>
                  <Plus size={14} style={{ transform: showAddCategory ? "rotate(45deg)" : "none", transition: "transform 0.2s" }} /> 
                  {showAddCategory ? (t("dashboard.planning.cancelBtn") || "Batal") : t("dashboard.planning.addCategory")}
                </button>
              </div>
            </div>

            {showAddCategory && (
              <div className="card-brutal animate-bounce-in" style={{ padding: "1rem", marginBottom: "1rem", background: "#F8FAFC", boxShadow: "2px 2px 0px var(--color-navy)", border: "2px dashed var(--color-navy)", borderRadius: "12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", alignItems: "flex-end" }}>
                  <div>
                    <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.72rem", display: "block", marginBottom: "0.35rem", color: "var(--color-navy)" }}>ICON</label>
                    <IconPicker 
                      value={newCategory.icon} 
                      onChange={v => setNewCategory({ ...newCategory, icon: v })} 
                      options={ICON_OPTIONS.map(opt => ({ ...opt, label: t(`dashboard.planning.icons.${opt.key}`) || opt.label }))} 
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.72rem", display: "block", marginBottom: "0.35rem", color: "var(--color-navy)" }}>{t("dashboard.planning.categoryName") || "NAMA KATEGORI"}</label>
                    <input 
                      value={newCategory.name} 
                      onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} 
                      className="input-brutal" 
                      placeholder={t("dashboard.planning.exampleCategory") || "Contoh: Belanja Online"} 
                      style={{ border: "1.8px solid var(--color-navy)", padding: "0.5rem 0.75rem", width: "100%", borderRadius: "8px", boxShadow: "2px 2px 0px var(--color-navy)", outline: "none", fontWeight: 800, fontSize: "0.85rem" }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.72rem", display: "block", marginBottom: "0.35rem", color: "var(--color-navy)" }}>{t("dashboard.planning.allocationRp") || "ALOKASI (RP)"}</label>
                    <input 
                      value={newCategory.allocated ? newCategory.allocated.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""} 
                      onChange={e => {
                        const unformatted = e.target.value.replace(/\D/g, "");
                        setNewCategory({ ...newCategory, allocated: unformatted });
                      }} 
                      className="input-brutal" 
                      type="text" 
                      placeholder="0" 
                      style={{ border: "1.8px solid var(--color-navy)", padding: "0.5rem 0.75rem", width: "100%", borderRadius: "8px", fontWeight: 800, boxShadow: "2px 2px 0px var(--color-navy)", fontSize: "0.85rem" }} 
                    />
                  </div>
                  <div>
                    <button onClick={handleAddCategory} className="btn-brutal" style={{
                      padding: "0.55rem 1.25rem", background: "var(--color-navy)", color: "var(--color-white)", fontWeight: 900, fontSize: "0.82rem",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem", boxShadow: "2px 2px 0px var(--color-lime)", border: "1.8px solid var(--color-navy)", borderRadius: "8px", width: "100%", cursor: "pointer"
                    }}>
                      {t("dashboard.planning.saveBtn") || "Simpan"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ flex: 1, minHeight: "360px", maxHeight: "480px", overflowY: "auto", paddingRight: "0.4rem" }} className="no-scrollbar">
              {searchQuery && filteredBudget.length === 0 ? (
                <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                  <SearchX size={36} style={{ margin: "0 auto 0.75rem", opacity: 0.3 }} />
                  <p style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                    {t("dashboard.planning.searchNoResult")} "{searchQuery}" {t("dashboard.planning.searchNoResultSuffix")}
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.75rem" }}>
                  {activeFilter === "needs" && needsBudget.map((item) => renderBudgetRow(item))}
                  {activeFilter === "wants" && wantsBudget.map((item) => renderBudgetRow(item))}
                  {activeFilter === "savings" && savingsBudget.map((item) => renderBudgetRow(item))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CAMI Tips Bubble Overlay */}
      {showTipsBubble && riskResult && !riskLoading && (
        <>
          <style>{`
            @keyframes pop-bubble {
              0% { transform: scale(0.8) translateY(10px); opacity: 0; }
              100% { transform: scale(1) translateY(0); opacity: 1; }
            }
            @keyframes pop-bubble-out {
              0% { transform: scale(1) translateY(0); opacity: 1; }
              100% { transform: scale(0.8) translateY(10px); opacity: 0; }
            }
          `}</style>
          <div style={{
            position: "fixed", bottom: "160px", right: "260px", zIndex: 990,
            animation: isClosingBubble
              ? "pop-bubble-out 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
              : "pop-bubble 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            width: "300px", cursor: "pointer", transition: "transform 0.2s"
          }} 
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {/* Tail Shadow */}
            <div style={{
              position: "absolute", bottom: "32px", right: "-20px",
              width: "24px", height: "24px",
              background: "var(--color-navy)",
              transform: "rotate(45deg)",
              zIndex: 989,
            }} />
            {/* Tail Main */}
            <div style={{
              position: "absolute", bottom: "40px", right: "-12px",
              width: "24px", height: "24px",
              background: "#FFF7ED",
              borderRight: "3px solid var(--color-navy)",
              borderTop: "3px solid var(--color-navy)",
              transform: "rotate(45deg)",
              zIndex: 991,
            }} />
            {/* Bubble content */}
            <div style={{
              position: "relative", zIndex: 990,
              background: "#FFF7ED", border: "3px solid var(--color-navy)",
              borderRadius: "var(--radius-brutal-sm)", padding: "1.25rem",
              boxShadow: "6px 6px 0px var(--color-navy)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 900, color: "#1d4ed8", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Sparkles size={14} color="#1d4ed8" /> INSIGHT CAMI
                </div>
              </div>
              <p style={{ fontSize: "0.95rem", color: "var(--color-navy)", margin: 0, lineHeight: 1.5, fontWeight: 700 }}>
                "{getTranslatedSug(riskResult.risk_profile, riskResult.suggestion).replace(/^"|"$/g, '')}"
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return isGuest ? (
    <GuestLockOverlay featureName="Perencanaan Keuangan" variant="page">
      {pageContent}
    </GuestLockOverlay>
  ) : pageContent;
}
