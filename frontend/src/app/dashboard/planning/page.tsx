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
import { translateCategoryName } from "@/lib/translateCategory";
import { getDebts, getRiskProfile, saveRiskProfile } from "./actions";

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
  const { t } = useLanguage();
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

  // ── Model 3 state ──────────────────────────────────────────────────────────
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);
  const [riskLoading, setRiskLoading] = useState(false);

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
        display: "flex", flexDirection: "column", gap: "1.25rem", padding: "1.5rem",
        background: isOverBudget ? "#fff5f5" : "var(--color-white)",
        border: `3px solid ${isOverBudget ? "#e74c3c" : "var(--color-navy)"}`,
        borderRadius: "var(--radius-brutal-sm)",
        boxShadow: isOverBudget ? "6px 6px 0px #e74c3c" : "6px 6px 0px var(--color-navy)",
        transition: "all 0.3s"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ transform: "scale(1.2)", transformOrigin: "left center" }}>
            <IconBox iconKey={item.icon} size={20} bg={isOverBudget ? "#e74c3c" : item.type === "needs" ? "var(--color-lime)" : item.type === "wants" ? "var(--color-orange)" : "var(--color-purple)"} />
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 900, fontSize: "1.1rem", color: isOverBudget ? "#e74c3c" : "var(--color-navy)" }}>{translateCategoryName(item.name, t)}</span>
            {isEditingCategory && (
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input 
                  type="text" 
                  value={item.allocated === 0 ? "" : item.allocated.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} 
                  onChange={e => {
                    const unformatted = e.target.value.replace(/\D/g, "");
                    const val = parseInt(unformatted) || 0;
                    handleAdjustAllocation(item.id, val);
                  }}
                  className="input-brutal"
                  style={{ width: "130px", padding: "0.4rem 0.6rem", fontSize: "0.85rem", border: "2.5px solid var(--color-navy)", fontWeight: 800 }}
                  placeholder="0"
                />
                <button 
                  type="button"
                  onClick={() => handleDeleteCategory(item.id, item.type)}
                  className="btn-brutal"
                  style={{ background: "#ffebee", border: "2.5px solid var(--color-navy)", cursor: "pointer", padding: "0.4rem 0.5rem", color: "#e74c3c", display: "flex", alignItems: "center", justifyContent: "center" }}
                  title="Hapus Kategori"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <span style={{ fontWeight: 900, fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: isOverBudget ? "#e74c3c" : "var(--color-navy)" }}>
              {formatRp(item.spent)} <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 700 }}>/ {formatRp(item.allocated)}</span>
            </span>
            <span style={{ fontSize: "0.9rem", fontWeight: 800, color: isOverBudget ? "#e74c3c" : "var(--color-navy)" }}>{pct}%</span>
          </div>
          <div style={{ width: "100%", height: "16px", background: "var(--color-bg)", border: `2.5px solid ${isOverBudget ? "#e74c3c" : "var(--color-navy)"}`, borderRadius: "100px", overflow: "hidden", position: "relative" }}>
            <div style={{
              width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: "100px",
              background: isOverBudget ? "#e74c3c" : isNearLimit ? "var(--color-orange)" : `var(--color-${item.type === "needs" ? "lime" : item.type === "wants" ? "orange" : "purple"})`,
              transition: "width 0.5s ease", borderRight: pct > 0 ? `2.5px solid ${isOverBudget ? "#c0392b" : "var(--color-navy)"}` : "none"
            }} />
          </div>
          {isOverBudget && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#e74c3c", padding: "0.4rem 0.75rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid #c0392b", marginTop: "0.25rem" }}>
              <AlertTriangle size={14} color="white" />
              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "white" }}>{t("dashboard.planning.overBudgetWarning") || "Spending exceeds allocation limit!"}</span>
            </div>
          )}
          {isNearLimit && (
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#e67e22", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <AlertTriangle size={12} /> {t("dashboard.planning.approachingLimit") || "Approaching limit"} ({pct}%)
            </span>
          )}
        </div>
      </div>
    );
  };


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

      {/* Top Row: 4 Stats Cards */}
      <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>

        {/* Risk Profile Card - FIRST */}
        {(() => {
          // Inline color map — no external dependency needed
          const COLOR_MAP: Record<string, { bg: string; icon: string; text: string }> = {
            "Konservatif": { bg: "var(--color-lime)",   icon: "var(--color-navy)",  text: "#4a7c00" },
            "Moderat":     { bg: "var(--color-purple)", icon: "var(--color-white)", text: "var(--color-purple)" },
            "Agresif":     { bg: "var(--color-orange)", icon: "var(--color-navy)",  text: "#b85c00" },
          };
          const profile = riskResult?.risk_profile ?? "";
          const colors = COLOR_MAP[profile];
          return (
            <div className="card-brutal" style={{
              display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem",
              background: "var(--color-white)",
              border: "3px solid var(--color-navy)",
              boxShadow: "4px 4px 0px var(--color-navy)",
              borderRadius: "var(--radius-brutal-sm)", transition: "all 0.3s"
            }}>
              <div style={{
                background: colors ? colors.bg : "var(--color-bg)",
                width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)",
                boxShadow: "2px 2px 0px var(--color-navy)", flexShrink: 0
              }}>
                <Brain size={24} color={colors ? colors.icon : "var(--color-text-muted)"} strokeWidth={2.5} />
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.25rem", color: colors ? colors.text : "var(--color-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {profile || "—"}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 700 }}>{t("dashboard.planning.riskProfileLabel") || "Profil Risiko"}</div>
              </div>
            </div>
          );
        })()}

        {[
          { label: t("dashboard.planning.needs"), amount: badgeNeedsRp, color: "lime", Icon: Home },
          { label: t("dashboard.planning.wants"), amount: badgeWantsRp, color: "orange", Icon: Gamepad2 },
          { label: t("dashboard.planning.savings"), amount: badgeSavingsRp, color: "purple", Icon: Banknote },
        ].map((s, idx) => (
          <div key={idx} className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem", background: "var(--color-white)", border: "3px solid var(--color-navy)", boxShadow: "4px 4px 0px var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", transition: "transform 0.2s" }}>
            <div style={{ background: `var(--color-${s.color})`, width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)", flexShrink: 0 }}>
              <s.Icon size={24} color={s.color === "lime" ? "var(--color-navy)" : "var(--color-white)"} strokeWidth={2.5} />
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.25rem", color: "var(--color-navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{formatRp(s.amount)}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 700 }}>{s.label}</div>
            </div>
          </div>
        ))}

      </div>

      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "1.25rem", alignItems: "stretch" }}>
        
        {/* ── Sidebar (Left) ──────────────────────────────────────── */}
        <div style={{ flex: "1 1 calc(75% - 0.3125rem)", minWidth: "320px", display: "flex", flexDirection: "column", gap: "1.25rem", order: 2 }}>
          {/* ── BUDGET VIEW ────────────────────── */}
          <div className="card-brutal animate-slide-up" style={{ background: "var(--color-white)", border: "4px solid var(--color-navy)", padding: "2rem", boxShadow: "8px 8px 0px var(--color-navy)", height: "800px", maxHeight: "800px", display: "flex", flexDirection: "column" }}>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem", paddingBottom: "1.5rem", borderBottom: "3px dashed rgba(10, 25, 47, 0.1)" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", margin: 0, color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: "36px", height: "36px", background: "var(--color-bg)", borderRadius: "var(--radius-brutal-sm)", border: "2.5px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0px var(--color-navy)" }}>
                  <Target size={20} color="var(--color-navy)" strokeWidth={2.5} />
                </div>
                {t("dashboard.planning.categoryBudget")}
              </h3>
              
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {[
                  { id: "needs", label: "Needs", icon: Home, color: "lime" },
                  { id: "wants", label: "Wants", icon: Gamepad2, color: "orange" },
                  { id: "savings", label: "Save", icon: Banknote, color: "purple" }
                ].map((item) => {
                  const typeItems = budgetWithSpent.filter(b => b.type === item.id);
                  const hasOverBudget = typeItems.some(b => b.spent > b.allocated && b.allocated > 0);
                  const hasNearLimit = typeItems.some(b => {
                    const pct = b.allocated > 0 ? Math.round((b.spent / b.allocated) * 100) : 0;
                    return pct >= 80 && b.spent <= b.allocated;
                  });
                  const hasAnyWarning = hasOverBudget || hasNearLimit;

                  return (
                    <button 
                      key={item.id}
                      onClick={() => setActiveFilter(item.id as any)}
                      className="btn-brutal"
                      style={{ 
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.6rem 1.25rem", 
                        borderRadius: "var(--radius-brutal-sm)", 
                        background: activeFilter === item.id ? `var(--color-${item.color})` : "var(--color-white)",
                        color: activeFilter === item.id && item.color !== "lime" && item.color !== "orange" ? "var(--color-white)" : "var(--color-navy)",
                        fontWeight: 900, fontSize: "0.95rem",
                        border: hasOverBudget ? "2.5px solid #e74c3c" : "2.5px solid var(--color-navy)",
                        boxShadow: hasOverBudget 
                          ? "4px 4px 0px #e74c3c"
                          : activeFilter === item.id ? `4px 4px 0px var(--color-navy)` : "2px 2px 0px var(--color-navy)",
                        transform: activeFilter === item.id ? "translate(-2px, -2px)" : "none",
                        transition: "all 0.2s"
                      }}
                    >
                      <item.icon size={16} /> {item.label}
                      {hasAnyWarning && (
                        <span style={{
                          position: "absolute",
                          top: "-6px",
                          right: "-6px",
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          background: hasOverBudget ? "#e74c3c" : "#e67e22",
                          border: "2px solid var(--color-white)",
                          boxShadow: "0 0 0 2px " + (hasOverBudget ? "#e74c3c" : "#e67e22"),
                          animation: "pulse-border 1.2s ease-in-out infinite",
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }} title={hasOverBudget 
                          ? (t("dashboard.planning.overBudgetWarning") || "Over budget!") 
                          : (t("dashboard.planning.approachingLimit") || "Approaching limit")} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                {activeFilter === "needs" && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.85rem", background: "var(--color-white)", padding: "0.5rem 1rem 0.5rem 0.5rem", border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", boxShadow: "4px 4px 0px var(--color-navy)" }}>
                    <div style={{ background: "var(--color-lime)", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)" }}>
                      <AlertTriangle size={22} color="var(--color-navy)" strokeWidth={2.5} />
                    </div>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", margin: 0, color: "var(--color-navy)", fontWeight: 900 }}>
                      {t("dashboard.planning.needs") || "Kebutuhan"}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <div style={{ background: "var(--color-lime)", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", fontWeight: 800, fontSize: "0.85rem", color: "var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
                        {badgeNeeds}%
                      </div>
                      <div style={{ background: "var(--color-bg)", padding: "0.2rem 0.75rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", fontWeight: 700, fontSize: "0.82rem", color: "var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
                        {formatRp(badgeNeedsRp)}
                      </div>
                    </div>
                  </div>
                )}
                {activeFilter === "wants" && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.85rem", background: "var(--color-white)", padding: "0.5rem 1rem 0.5rem 0.5rem", border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", boxShadow: "4px 4px 0px var(--color-navy)" }}>
                    <div style={{ background: "var(--color-orange)", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)" }}>
                      <Sparkles size={22} color="var(--color-white)" strokeWidth={2.5} />
                    </div>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", margin: 0, color: "var(--color-navy)", fontWeight: 900 }}>
                      {t("dashboard.transactions.wants") || "Keinginan"}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <div style={{ background: "var(--color-orange)", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", fontWeight: 800, fontSize: "0.85rem", color: "var(--color-white)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
                        {badgeWants}%
                      </div>
                      <div style={{ background: "var(--color-bg)", padding: "0.2rem 0.75rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", fontWeight: 700, fontSize: "0.82rem", color: "var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
                        {formatRp(badgeWantsRp)}
                      </div>
                    </div>
                  </div>
                )}
                {activeFilter === "savings" && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.85rem", background: "var(--color-white)", padding: "0.5rem 1rem 0.5rem 0.5rem", border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", boxShadow: "4px 4px 0px var(--color-navy)" }}>
                    <div style={{ background: "var(--color-purple)", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)" }}>
                      <ShieldCheck size={22} color="var(--color-white)" strokeWidth={2.5} />
                    </div>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", margin: 0, color: "var(--color-navy)", fontWeight: 900 }}>
                      {t("dashboard.transactions.save")}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <div style={{ background: "var(--color-purple)", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", fontWeight: 800, fontSize: "0.85rem", color: "var(--color-white)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
                        {badgeSavings}%
                      </div>
                      <div style={{ background: "var(--color-bg)", padding: "0.2rem 0.75rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", fontWeight: 700, fontSize: "0.82rem", color: "var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
                        {formatRp(badgeSavingsRp)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button onClick={() => setIsEditingCategory(!isEditingCategory)} className="btn-brutal" style={{
                  padding: "0.75rem 1.25rem", fontWeight: 900, fontSize: "0.95rem",
                  background: isEditingCategory ? "var(--color-lime)" : "var(--color-bg)", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem",
                  boxShadow: "4px 4px 0px var(--color-navy)", border: "3px solid var(--color-navy)", transition: "all 0.2s"
                }} title={t("dashboard.planning.editAllocation") || "Edit Alokasi Budget"}>
                  {isEditingCategory ? <CheckCircle2 size={18} /> : <Edit3 size={18} />} 
                  {isEditingCategory ? t("dashboard.planning.saveBtn") : t("dashboard.planning.editBtn")}
                </button>
                <button onClick={() => setShowAddCategory(!showAddCategory)} className="btn-brutal" style={{
                  padding: "0.75rem 1.25rem", fontWeight: 900, fontSize: "0.95rem",
                  background: showAddCategory ? "var(--color-orange)" : "var(--color-navy)",
                  color: "var(--color-white)", display: "flex", alignItems: "center", gap: "0.5rem",
                  boxShadow: "4px 4px 0px var(--color-navy)", border: "3px solid var(--color-navy)"
                }}>
                  <Plus size={18} style={{ transform: showAddCategory ? "rotate(45deg)" : "none", transition: "transform 0.2s" }} /> 
                  {showAddCategory ? (t("dashboard.planning.cancelBtn") || "Batal") : t("dashboard.planning.addCategory")}
                </button>
              </div>
            </div>

            {showAddCategory && (
              <div className="card-brutal animate-bounce-in" style={{ padding: "2rem", marginBottom: "2.5rem", background: "var(--color-white)", boxShadow: "6px 6px 0px var(--color-navy)", overflow: "visible", border: "3px dashed var(--color-navy)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", alignItems: "flex-end" }}>
                  <div>
                    <label style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "0.85rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>ICON</label>
                    <IconPicker 
                      value={newCategory.icon} 
                      onChange={v => setNewCategory({ ...newCategory, icon: v })} 
                      options={ICON_OPTIONS.map(opt => ({ ...opt, label: t(`dashboard.planning.icons.${opt.key}`) || opt.label }))} 
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", alignItems: "flex-end" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "0.85rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>{t("dashboard.planning.categoryName") || "NAMA KATEGORI"}</label>
                      <input 
                        value={newCategory.name} 
                        onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} 
                        className="input-brutal" 
                        placeholder={t("dashboard.planning.exampleCategory") || "Contoh: Belanja Online"} 
                        style={{ border: "3px solid var(--color-navy)", padding: "0.85rem", width: "100%", boxShadow: "3px 3px 0px var(--color-navy)", outline: "none", fontWeight: 800, fontSize: "1rem" }} 
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "0.85rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>{t("dashboard.planning.allocationRp") || "ALOKASI (RP)"}</label>
                      <input 
                        value={newCategory.allocated ? newCategory.allocated.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""} 
                        onChange={e => {
                          const unformatted = e.target.value.replace(/\D/g, "");
                          setNewCategory({ ...newCategory, allocated: unformatted });
                        }} 
                        className="input-brutal" 
                        type="text" 
                        placeholder="0" 
                        style={{ border: "3px solid var(--color-navy)", padding: "0.85rem", width: "100%", fontWeight: 900, boxShadow: "3px 3px 0px var(--color-navy)", fontSize: "1rem" }} 
                      />
                    </div>
                    <button onClick={handleAddCategory} className="btn-brutal" style={{
                      padding: "0.85rem 2rem", background: "var(--color-navy)", color: "var(--color-white)", fontWeight: 900, fontSize: "1rem",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "4px 4px 0px var(--color-lime)", border: "3px solid var(--color-navy)"
                    }}>
                      {t("dashboard.planning.saveBtn") || "Simpan"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ flex: 1, overflowY: "auto", paddingRight: "0.5rem" }} className="no-scrollbar">
              {searchQuery && filteredBudget.length === 0 ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                  <SearchX size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
                  <p style={{ fontSize: "1.125rem", fontWeight: 700 }}>
                    {t("dashboard.planning.searchNoResult")} "{searchQuery}" {t("dashboard.planning.searchNoResultSuffix")}
                  </p>
                </div>
              ) : (
                <>
                  {activeFilter === "needs" && (
                    <div style={{ marginBottom: "3rem" }}>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
                        {needsBudget.map((item) => renderBudgetRow(item))}
                      </div>
                    </div>
                  )}

                  {activeFilter === "wants" && (
                    <div style={{ marginBottom: "3rem" }}>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
                        {wantsBudget.map((item) => renderBudgetRow(item))}
                      </div>
                    </div>
                  )}

                  {activeFilter === "savings" && (
                    <div style={{ marginBottom: "2rem" }}>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
                        {savingsBudget.map((item) => renderBudgetRow(item))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Main Area (Right) ──────────────────────────────────────── */}
        <div style={{ flex: "0 0 calc(25% - 0.9375rem)", minWidth: "250px", display: "flex", flexDirection: "column", gap: "1.25rem", order: 1 }}>
          {/* ── Model 3: Risk Profile Card ──────────────────────────────────────── */}
          <div className="card-brutal animate-bounce-in" style={{ overflow: "hidden",
            background: "var(--color-white)",
            border: "4px solid var(--color-navy)",
            boxShadow: "8px 8px 0px var(--color-navy)",
            padding: 0,
            height: "800px",
            maxHeight: "800px",
            display: "flex",
            flexDirection: "column"
          }}>
            {/* Card Header */}
            <div style={{ padding: "1.5rem 2rem", background: "var(--color-purple)", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", borderBottom: "4px solid var(--color-navy)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div style={{ width: "48px", height: "48px", background: "var(--color-lime)", borderRadius: "var(--radius-brutal-sm)", border: "2.5px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0px var(--color-navy)" }}>
                  <Brain size={28} color="var(--color-navy)" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "1.35rem", color: "var(--color-white)" }}>{t("dashboard.planning.riskProfileTitle")}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--color-white)", fontWeight: 700, opacity: 0.9 }}>{t("dashboard.planning.riskProfileSubtitle") || "Model 3 · Risk Profile Classifier"}</div>
                </div>
              </div>
            </div>

            {/* Loading */}
            {riskLoading && (
              <div style={{ padding: "3rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", background: "var(--color-white)", flex: 1 }}>
                <Loader size={48} color="var(--color-purple)" style={{ animation: "spin 1s linear infinite" }} />
                <span style={{ fontWeight: 800, color: "var(--color-navy)", fontSize: "1.1rem" }}>{t("dashboard.planning.aiLoading")}</span>
              </div>
            )}

            {/* Result */}
            {riskResult && !riskLoading && (() => {
              const info = PROFILE_INFO[riskResult.risk_profile];
              return (
                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "stretch", background: "var(--color-white)", flex: 1 }}>
                  {/* Info */}
                  <div style={{ display: "flex", flexDirection: "column", flex: 1, width: "100%" }}>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", color: "var(--color-navy)", fontWeight: 900, marginBottom: "0.5rem", textTransform: "capitalize" }}>
                      {riskResult.risk_profile}
                    </h3>
                    <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: "var(--color-navy)", marginBottom: "1.5rem", fontWeight: 600 }}>
                      {riskResult.description}
                    </p>
                    {/* Probability bars */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem", marginTop: "auto" }}>
                      {(["Konservatif","Moderat","Agresif"] as const).map(p => {
                        const prob = Math.round((riskResult.probabilities[p] || 0) * 100);
                        const isActive = riskResult.risk_profile === p;
                        return (
                          <div key={p} style={{ width: "100%" }}>
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

                    <div style={{ background: "var(--color-white)", border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal)", padding: "1.5rem", boxShadow: "6px 6px 0px var(--color-navy)", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                      <div style={{ background: info.color, padding: "0.5rem", borderRadius: "8px", border: "2px solid var(--color-navy)", flexShrink: 0 }}>
                        <Sparkles size={24} color={info.accentColor} />
                      </div>
                      <div>
                        <h4 style={{ margin: "0 0 0.5rem 0", fontFamily: "var(--font-heading)", fontWeight: 900, color: "var(--color-navy)", fontSize: "1.1rem" }}>{t("dashboard.planning.aiSuggestionLabel")}</h4>
                        <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.6, color: "var(--color-navy)", fontWeight: 600 }}>{riskResult.suggestion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Empty state */}
            {!riskResult && !riskLoading && (
              <div style={{ padding: "4rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--color-white)", flex: 1 }}>
                <div style={{ background: "var(--color-bg)", padding: "1.5rem", borderRadius: "50%", border: "3px dashed var(--color-navy)", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Brain size={48} color="var(--color-navy)" strokeWidth={2} style={{ opacity: 0.6 }} />
                </div>
                <p style={{ margin: 0, marginBottom: "1.5rem", fontWeight: 800, fontSize: "1.1rem", color: "var(--color-navy)", opacity: 0.8, textAlign: "center", maxWidth: "80%" }}>
                  {t("dashboard.planning.clickToStart") || "Klik 'Mulai Analisis' untuk mengetahui profil risiko keuanganmu!"}
                </p>
                <button
                  onClick={() => fetchRiskProfile()}
                  className="btn-brutal"
                  style={{ padding: "0.75rem 1.5rem", background: "var(--color-orange)", color: "var(--color-navy)", fontWeight: 900, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "4px 4px 0px var(--color-navy)", border: "3px solid var(--color-navy)" }}
                >
                  <Sparkles size={20} /> {t("dashboard.planning.analyzeProfile") || "Analisis Profil Saya"}
                </button>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );

  return isGuest ? (
    <GuestLockOverlay featureName="Perencanaan Keuangan" variant="page">
      {pageContent}
    </GuestLockOverlay>
  ) : pageContent;
}
