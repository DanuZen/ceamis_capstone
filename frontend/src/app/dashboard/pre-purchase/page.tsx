"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  ShoppingBag, 
  Utensils, 
  Film, 
  Car, 
  GraduationCap, 
  Package, 
  CheckCircle2, 
  Sliders, 
  PiggyBank, 
  TrendingDown, 
  Sparkles,
  Info,
  Clock,
  Plus,
  X,
  PieChart,
  Zap,
  ArrowLeft
} from "lucide-react";
import { useUser } from "@/context/UserContext";

// ── Types ─────────────────────────────────────────────

export interface RiskResult {
  check_id: string;
  planned_amount: number;
  category: string;
  merchant: string;
  risk_score: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  trigger_factors: string[];
  budget_limit: number;
  remaining_before: number;
  remaining_after: number;
  savings_delayed_days: number;
  savings_goal_title: string;
  recommended_action: "PROCEED" | "ADJUST" | "POSTPONE" | "INSTALLMENT";
  is_strict_overbudget: boolean;
  deficit_amount: number;
}

export interface WishlistItem {
  id: string;
  title: string;
  estimatedPrice: number;
  categoryName: string;
  notes?: string;
  readiness: "ready" | "overbudget";
  deficitAmount: number;
  savingsDelayedDays: number;
}

const CATEGORIES = [
  { 
    id: "shopping", 
    name: "Shopping & Fashion", 
    icon: ShoppingBag, 
    accentColor: "var(--color-navy)", 
    softBg: "rgba(184, 255, 0, 0.15)" 
  },
  { 
    id: "fnb", 
    name: "Makanan & Minuman", 
    icon: Utensils, 
    accentColor: "var(--color-navy)", 
    softBg: "rgba(255, 225, 0, 0.2)" 
  },
  { 
    id: "entertainment", 
    name: "Hiburan & Hobi", 
    icon: Film, 
    accentColor: "var(--color-navy)", 
    softBg: "rgba(88, 51, 238, 0.12)" 
  },
  { 
    id: "transport", 
    name: "Transportasi", 
    icon: Car, 
    accentColor: "var(--color-navy)", 
    softBg: "rgba(0, 229, 255, 0.15)" 
  },
  { 
    id: "education", 
    name: "Edukasi", 
    icon: GraduationCap, 
    accentColor: "var(--color-navy)", 
    softBg: "rgba(184, 255, 0, 0.15)" 
  },
  { 
    id: "other", 
    name: "Aksesoris & Lainnya", 
    icon: Package, 
    accentColor: "var(--color-navy)", 
    softBg: "rgba(10, 25, 47, 0.08)" 
  },
];

const QUICK_AMOUNTS = [50000, 100000, 250000, 500000, 1000000];

const BUDGET_STATUS = {
  monthlyWantsLimit: 1560000,
  monthlyWantsSpent: 1110000,
  monthlyWantsRemaining: 450000,
  activeSavingsGoal: "Dana Darurat 2026",
};

const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: "wish-1",
    title: "Sepatu Lari Nike Pegasus",
    estimatedPrice: 1200000,
    categoryName: "Shopping & Fashion",
    notes: "Untuk persiapan lomba lari 10K",
    readiness: "overbudget",
    deficitAmount: 750000,
    savingsDelayedDays: 21,
  },
  {
    id: "wish-2",
    title: "Kacamata Hitam Polarized",
    estimatedPrice: 250000,
    categoryName: "Aksesoris",
    notes: "Dipakai saat berkendara siang hari",
    readiness: "ready",
    deficitAmount: 0,
    savingsDelayedDays: 0,
  },
  {
    id: "wish-3",
    title: "Staycation Akhir Pekan",
    estimatedPrice: 800000,
    categoryName: "Liburan & Healing",
    notes: "Healing setelah submit capstone",
    readiness: "overbudget",
    deficitAmount: 350000,
    savingsDelayedDays: 10,
  },
];

const DEFAULT_INITIAL_RESULT: RiskResult = {
  check_id: "wish-1",
  planned_amount: 1200000,
  category: "Shopping & Fashion",
  merchant: "Sepatu Lari Nike Pegasus",
  risk_score: 0.92,
  risk_level: "HIGH",
  trigger_factors: [
    "PERINGATAN KETAT: Membeli item ini akan menjebol batas pos Keinginan sebesar -Rp 750.000.",
    "Efek Domino: Memaksa mengambil jatah tabungan bulan ini untuk menutupi defisit pos gaya hidup.",
    "Penundaan Target: Proyeksi pencapaian target \"Dana Darurat 2026\" terpaksa mundur 21 hari.",
  ],
  budget_limit: BUDGET_STATUS.monthlyWantsLimit,
  remaining_before: BUDGET_STATUS.monthlyWantsRemaining,
  remaining_after: BUDGET_STATUS.monthlyWantsRemaining - 1200000,
  savings_delayed_days: 21,
  savings_goal_title: BUDGET_STATUS.activeSavingsGoal,
  recommended_action: "POSTPONE",
  is_strict_overbudget: true,
  deficit_amount: 750000,
};

const AI_BASE = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000";

export default function PrePurchasePage() {
  const { userData } = useUser();

  // Active Tab: "wishlist" (default) vs "form" (Simulasi Cepat)
  const [activeTab, setActiveTab] = useState<"wishlist" | "form">("wishlist");
  const [wishlistFilter, setWishlistFilter] = useState<"all" | "ready" | "overbudget">("all");
  const [selectedWishlistId, setSelectedWishlistId] = useState<string | null>("wish-1");

  // Form inputs
  const [amount, setAmount] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("shopping");
  const [merchant, setMerchant] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Wishlist state & modal
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(INITIAL_WISHLIST);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("Shopping & Fashion");
  const [newNotes, setNewNotes] = useState("");

  // Evaluation & Results
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskResult | null>(DEFAULT_INITIAL_RESULT);
  const [userDecision, setUserDecision] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<string>("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setAmount(raw);
  };

  const currentCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  const generateDefaultTriggers = (price: number, remAfter: number): string[] => {
    if (remAfter < 0) {
      return [
        `PERINGATAN KETAT: Membeli item ini akan menjebol batas pos Keinginan sebesar -${formatRupiah(Math.abs(remAfter))}.`,
        "Efek Domino: Memaksa mengambil jatah tabungan bulan ini untuk menutupi defisit pos gaya hidup.",
        `Penundaan Target: Proyeksi pencapaian target "${BUDGET_STATUS.activeSavingsGoal}" terpaksa mundur ${Math.max(1, Math.round(Math.abs(remAfter) / 35000))} hari.`
      ];
    } else if (price > BUDGET_STATUS.monthlyWantsRemaining * 0.7) {
      return [
        `Perhatian: Pengeluaran ini menyerap ${Math.round((price / BUDGET_STATUS.monthlyWantsRemaining) * 100)}% sisa kuota pos Keinginan bulan ini.`,
        "Sisa pagu pos gaya hidup akan sangat minim hingga periode gajian berikutnya.",
        "Disarankan untuk menimbang kembali atau menunda belanja hingga mendekati akhir siklus anggaran."
      ];
    } else {
      return [
        `Aman! Sisa kuota pos Keinginan masih mencukupi (tersisa ${formatRupiah(remAfter)}).`,
        "Pembelian tidak mengganggu alokasi tabungan bulanan maupun pos kebutuhan pokok.",
        "Rencana belanja ini selaras dengan profil keuangan sehat Anda."
      ];
    }
  };

  // Submit Form Evaluasi (Manual Form)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/\D/g, ""));
    if (!numAmount || numAmount <= 0) return;

    setLoading(true);
    setUserDecision(null);
    setFeedbackSubmitted(false);
    setSelectedWishlistId(null);

    try {
      const res = await fetch(`${AI_BASE}/api/v1/pre-purchase/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userData?.id || "demo-user",
          category_id: selectedCategory,
          planned_amount: numAmount,
          merchant_name: merchant || undefined,
          notes: notes || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const pred = data.prediction || {};
        const bImpact = data.budget_impact || {};
        const sImpact = data.savings_impact || {};

        const remAfter = bImpact.remaining_after ?? (BUDGET_STATUS.monthlyWantsRemaining - numAmount);
        const isOver = remAfter < 0;

        setResult({
          check_id: data.check_id || `check-${Date.now()}`,
          planned_amount: data.planned_amount || numAmount,
          category: currentCategoryObj.name,
          merchant: merchant || "Rencana Belanja",
          risk_score: pred.risk_score ?? (isOver ? 0.92 : 0.18),
          risk_level: pred.risk_level ?? (isOver ? "HIGH" : "LOW"),
          trigger_factors: pred.trigger_factors || generateDefaultTriggers(numAmount, remAfter),
          budget_limit: bImpact.budget_limit ?? BUDGET_STATUS.monthlyWantsLimit,
          remaining_before: bImpact.remaining_before ?? BUDGET_STATUS.monthlyWantsRemaining,
          remaining_after: remAfter,
          savings_delayed_days: sImpact.delayed_days ?? (isOver ? Math.round(Math.abs(remAfter) / 35000) : 0),
          savings_goal_title: sImpact.goal_title ?? BUDGET_STATUS.activeSavingsGoal,
          recommended_action: data.recommended_action ?? (isOver ? "POSTPONE" : "PROCEED"),
          is_strict_overbudget: isOver,
          deficit_amount: isOver ? Math.abs(remAfter) : 0,
        });
        setLoading(false);
        return;
      }
    } catch (_) {
      // Offline fallback
    }

    const remBefore = BUDGET_STATUS.monthlyWantsRemaining;
    const remAfter = remBefore - numAmount;
    const isStrictOver = remAfter < 0;
    const deficit = isStrictOver ? Math.abs(remAfter) : 0;
    const delayed = isStrictOver ? Math.max(1, Math.round(deficit / 35000)) : 0;

    let rScore = 0.18;
    let rLevel: "LOW" | "MEDIUM" | "HIGH" = "LOW";
    if (isStrictOver) {
      rScore = 0.92;
      rLevel = "HIGH";
    } else if (numAmount > remBefore * 0.7) {
      rScore = 0.65;
      rLevel = "MEDIUM";
    }

    setResult({
      check_id: `manual-${Date.now()}`,
      planned_amount: numAmount,
      category: currentCategoryObj.name,
      merchant: merchant || "Rencana Belanja",
      risk_score: rScore,
      risk_level: rLevel,
      trigger_factors: generateDefaultTriggers(numAmount, remAfter),
      budget_limit: BUDGET_STATUS.monthlyWantsLimit,
      remaining_before: remBefore,
      remaining_after: remAfter,
      savings_delayed_days: delayed,
      savings_goal_title: BUDGET_STATUS.activeSavingsGoal,
      recommended_action: isStrictOver ? "POSTPONE" : (rLevel === "MEDIUM" ? "ADJUST" : "PROCEED"),
      is_strict_overbudget: isStrictOver,
      deficit_amount: deficit,
    });
    setLoading(false);
  };

  // Evaluate directly from wishlist item
  const handleSelectWishlist = (item: WishlistItem) => {
    setSelectedWishlistId(item.id);
    setUserDecision(null);
    setFeedbackSubmitted(false);

    const remBefore = BUDGET_STATUS.monthlyWantsRemaining;
    const remAfter = remBefore - item.estimatedPrice;
    const isStrictOver = remAfter < 0;
    const deficit = isStrictOver ? Math.abs(remAfter) : 0;
    const delayed = isStrictOver ? Math.max(1, Math.round(deficit / 35000)) : 0;

    let rScore = 0.15;
    let rLevel: "LOW" | "MEDIUM" | "HIGH" = "LOW";
    if (isStrictOver) {
      rScore = 0.92;
      rLevel = "HIGH";
    } else if (item.estimatedPrice > remBefore * 0.7) {
      rScore = 0.65;
      rLevel = "MEDIUM";
    }

    setResult({
      check_id: `wish-${item.id}`,
      planned_amount: item.estimatedPrice,
      category: item.categoryName,
      merchant: item.title,
      risk_score: rScore,
      risk_level: rLevel,
      trigger_factors: generateDefaultTriggers(item.estimatedPrice, remAfter),
      budget_limit: BUDGET_STATUS.monthlyWantsLimit,
      remaining_before: remBefore,
      remaining_after: remAfter,
      savings_delayed_days: delayed,
      savings_goal_title: BUDGET_STATUS.activeSavingsGoal,
      recommended_action: isStrictOver ? "POSTPONE" : (rLevel === "MEDIUM" ? "ADJUST" : "PROCEED"),
      is_strict_overbudget: isStrictOver,
      deficit_amount: deficit,
    });
  };

  // Delete Wishlist item
  const handleDeleteWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = wishlistItems.filter((it) => it.id !== id);
    setWishlistItems(updated);
    if (selectedWishlistId === id) {
      if (updated.length > 0) {
        handleSelectWishlist(updated[0]);
      } else {
        setSelectedWishlistId(null);
        setResult(null);
      }
    }
  };

  // Add Wishlist item
  const handleAddWishlist = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(newPrice.replace(/\D/g, ""));
    if (!newTitle.trim() || !numPrice || numPrice <= 0) return;

    const remBefore = BUDGET_STATUS.monthlyWantsRemaining;
    const remAfter = remBefore - numPrice;
    const isStrictOver = remAfter < 0;
    const deficit = isStrictOver ? Math.abs(remAfter) : 0;
    const delayed = isStrictOver ? Math.max(1, Math.round(deficit / 35000)) : 0;

    const newItem: WishlistItem = {
      id: `wish-${Date.now()}`,
      title: newTitle.trim(),
      estimatedPrice: numPrice,
      categoryName: newCategory,
      notes: newNotes.trim() || undefined,
      readiness: isStrictOver ? "overbudget" : "ready",
      deficitAmount: deficit,
      savingsDelayedDays: delayed,
    };

    const nextList = [newItem, ...wishlistItems];
    setWishlistItems(nextList);
    setIsWishlistModalOpen(false);
    setNewTitle("");
    setNewPrice("");
    setNewNotes("");
    setActiveTab("wishlist");
    handleSelectWishlist(newItem);
  };

  // Decision recorder
  const handleDecision = async (decision: "PROCEED" | "ADJUST" | "POSTPONE" | "INSTALLMENT") => {
    setUserDecision(decision);
    try {
      await fetch(`${AI_BASE}/api/v1/pre-purchase/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          check_id: result?.check_id,
          decision: decision,
          adjusted_amount: adjustAmount ? parseFloat(adjustAmount) : undefined,
        }),
      });
    } catch (_) {}
  };

  const isFormValid = amount && parseFloat(amount.replace(/\D/g, "")) > 0;
  const spentRatio = ((BUDGET_STATUS.monthlyWantsSpent / BUDGET_STATUS.monthlyWantsLimit) * 100).toFixed(0);

  // Filtered Wishlist
  const readyCount = wishlistItems.filter((i) => i.readiness === "ready").length;
  const overCount = wishlistItems.filter((i) => i.readiness === "overbudget").length;

  const filteredWishlist = wishlistItems.filter((item) => {
    if (wishlistFilter === "ready") return item.readiness === "ready";
    if (wishlistFilter === "overbudget") return item.readiness === "overbudget";
    return true;
  });

  return (
    <div style={{ width: "100%", paddingBottom: "1.75rem" }} className="space-y-3.5">
      
      {/* ── 1. Compact Header Banner ─────────────────────────── */}
      <div 
        style={{
          background: "var(--color-lime)",
          border: "2px solid var(--color-navy)",
          boxShadow: "3px 3px 0px var(--color-navy)",
          borderRadius: "14px",
        }}
        className="p-3.5 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#0A192F] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1.5">
            <Sparkles size={12} className="text-[#B8FF00]" />
            Fitur Inti CEAMIS 2.0 • AI Engine
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-[#0A192F] leading-tight">
            Smart Wishlist & Cek Risiko Pra-Pembelian
          </h1>
          <p className="text-[#0A192F]/85 font-medium text-xs md:text-sm mt-0.5 max-w-xl line-clamp-1 md:line-clamp-2">
            Simulasikan rencana belanja dan kelola wishlist impian. AI mengevaluasi sisa kuota pos keinginan (Wants) & dampak penundaan tabungan sebelum kamu checkout.
          </p>
        </div>

        <div 
          style={{
            background: "#FFFFFF",
            border: "2px solid var(--color-navy)",
            boxShadow: "2px 2px 0px var(--color-navy)",
            borderRadius: "10px",
          }}
          className="px-3 py-2 flex items-center gap-2.5 shrink-0"
        >
          <ShieldCheck size={24} className="text-[#1d4ed8]" />
          <div>
            <div className="text-[10px] font-bold uppercase text-gray-500 leading-tight">Target Tabungan Aktif</div>
            <div className="text-xs font-black text-[#0A192F]">{BUDGET_STATUS.activeSavingsGoal}</div>
          </div>
        </div>
      </div>

      {/* ── 2. Compact Pos Keinginan Quota & Action Strip ───── */}
      <div 
        style={{
          background: "#FFFFFF",
          border: "2px solid var(--color-navy)",
          boxShadow: "3px 3px 0px var(--color-navy)",
          borderRadius: "12px",
        }}
        className="p-3 md:p-3.5 space-y-2"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div 
              style={{
                background: "var(--color-lime)",
                border: "1.5px solid var(--color-navy)",
                borderRadius: "6px",
              }}
              className="w-7 h-7 flex items-center justify-center shrink-0"
            >
              <PieChart size={15} color="var(--color-navy)" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#0A192F]">
                Pos Alokasi Keinginan (Wants)
              </span>
              <span className="bg-[#B8FF00] text-[#0A192F] border border-[#0A192F] px-2 py-0.2 rounded text-[10px] font-black">
                {spentRatio}% Terpakai
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsWishlistModalOpen(true)}
              style={{
                background: "var(--color-lime)",
                color: "var(--color-navy)",
                border: "1.8px solid var(--color-navy)",
                boxShadow: "2px 2px 0px var(--color-navy)",
                borderRadius: "8px",
              }}
              className="px-2.5 py-1 text-xs font-black transition-all hover:translate-x-0.5 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} strokeWidth={3} />
              Tambah Wishlist Impian
            </button>

            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "form" ? "wishlist" : "form")}
              style={{
                background: activeTab === "form" ? "var(--color-navy)" : "#FFFFFF",
                color: activeTab === "form" ? "var(--color-lime)" : "var(--color-navy)",
                border: "1.8px solid var(--color-navy)",
                boxShadow: "2px 2px 0px var(--color-navy)",
                borderRadius: "8px",
              }}
              className="px-2.5 py-1 text-xs font-black transition-all hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
            >
              <Zap size={13} />
              {activeTab === "form" ? "Daftar Wishlist" : "Simulasi Cepat"}
            </button>
          </div>
        </div>

        {/* Quota Numbers & Progress */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="text-xs font-bold text-gray-600">
            Sisa Kuota Belanja: <strong className="text-sm font-black text-[#0A192F]">{formatRupiah(BUDGET_STATUS.monthlyWantsRemaining)}</strong> dari {formatRupiah(BUDGET_STATUS.monthlyWantsLimit)}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-36 sm:w-52 h-2 bg-slate-200 border border-[#0A192F] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#0A192F] transition-all"
                style={{ width: `${spentRatio}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-gray-500">
              Uji Otomatis
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Main 2-Column Grid (2 Large Enclosing Cards) ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
        
        {/* ── CARD BESAR 1: Wishlist & Form Belanja (5 cols) ── */}
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
                    background: "var(--color-lime)",
                    border: "2px solid var(--color-navy)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "2px 2px 0px var(--color-navy)",
                    flexShrink: 0
                  }}
                >
                  <ShoppingBag size={17} color="var(--color-navy)" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 900, color: "var(--color-navy)", margin: 0, lineHeight: 1.2 }}>
                    {activeTab === "wishlist" ? "Daftar Wishlist Impian" : "Form Rencana Belanja"}
                  </h3>
                  <p style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 600, margin: "2px 0 0 0" }}>
                    {activeTab === "wishlist" ? "Pilih barang impian untuk evaluasi instan" : "Simulasikan rencana belanja baru"}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                {activeTab === "wishlist" ? (
                  <button
                    type="button"
                    onClick={() => setIsWishlistModalOpen(true)}
                    style={{
                      background: "var(--color-lime)",
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
                  >
                    <Plus size={13} strokeWidth={3} />
                    Tambah
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "form" ? "wishlist" : "form")}
                  style={{
                    background: activeTab === "form" ? "var(--color-navy)" : "#F8FAFC",
                    color: activeTab === "form" ? "var(--color-lime)" : "var(--color-navy)",
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
                >
                  {activeTab === "form" ? <><ShoppingBag size={12} /> Wishlist</> : <><Zap size={12} /> Form</>}
                </button>
              </div>
            </div>

            {activeTab === "wishlist" ? (
              /* Wishlist View */
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                {/* Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2.5 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => setWishlistFilter("all")}
                    style={{
                      background: wishlistFilter === "all" ? "var(--color-navy)" : "#FFFFFF",
                      color: wishlistFilter === "all" ? "var(--color-lime)" : "var(--color-navy)",
                      border: "1.8px solid var(--color-navy)",
                      boxShadow: wishlistFilter === "all" ? "2px 2px 0px var(--color-navy)" : "none",
                      borderRadius: "8px",
                    }}
                    className="px-2.5 py-1 text-xs font-black transition-all shrink-0 cursor-pointer"
                  >
                    Semua ({wishlistItems.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setWishlistFilter("ready")}
                    style={{
                      background: wishlistFilter === "ready" ? "var(--color-navy)" : "#FFFFFF",
                      color: wishlistFilter === "ready" ? "var(--color-lime)" : "#16A34A",
                      border: "1.8px solid var(--color-navy)",
                      boxShadow: wishlistFilter === "ready" ? "2px 2px 0px var(--color-navy)" : "none",
                      borderRadius: "8px",
                    }}
                    className="px-2.5 py-1 text-xs font-black transition-all shrink-0 cursor-pointer"
                  >
                    Aman Dibeli ({readyCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setWishlistFilter("overbudget")}
                    style={{
                      background: wishlistFilter === "overbudget" ? "var(--color-navy)" : "#FFFFFF",
                      color: wishlistFilter === "overbudget" ? "var(--color-lime)" : "#DC2626",
                      border: "1.8px solid var(--color-navy)",
                      boxShadow: wishlistFilter === "overbudget" ? "2px 2px 0px var(--color-navy)" : "none",
                      borderRadius: "8px",
                    }}
                    className="px-2.5 py-1 text-xs font-black transition-all shrink-0 cursor-pointer"
                  >
                    Overbudget ({overCount})
                  </button>
                </div>

                {/* Wishlist Items List */}
                <div className="space-y-2" style={{ flex: 1 }}>
                  {filteredWishlist.length === 0 ? (
                    <div 
                      style={{
                        background: "#F8FAFC",
                        border: "2px dashed var(--color-navy)",
                        borderRadius: "12px",
                      }}
                      className="p-6 text-center text-xs font-bold text-gray-500"
                    >
                      Tidak ada item wishlist pada kategori ini.
                    </div>
                  ) : (
                    filteredWishlist.map((item) => {
                      const isReady = item.readiness === "ready";
                      const isSelected = selectedWishlistId === item.id;

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectWishlist(item)}
                          style={{
                            background: isSelected ? "#FFFFFF" : "#F8FAFC",
                            border: isSelected ? "2.5px solid var(--color-navy)" : "2px solid var(--color-navy)",
                            boxShadow: isSelected ? "3px 3px 0px var(--color-lime)" : "2px 2px 0px var(--color-navy)",
                            borderRadius: "12px",
                            transform: isSelected ? "translate(-1px, -1px)" : "none",
                          }}
                          className="p-3 cursor-pointer transition-all hover:bg-white hover:translate-x-0.5 space-y-2"
                        >
                          {/* Top: Icon + Title & Category + Delete */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div 
                                style={{
                                  background: isSelected ? "var(--color-lime)" : "#FFFFFF",
                                  border: "1.5px solid var(--color-navy)",
                                  borderRadius: "8px",
                                }}
                                className="w-7 h-7 flex items-center justify-center shrink-0"
                              >
                                <ShoppingBag size={14} color="var(--color-navy)" strokeWidth={2.4} />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-black text-xs md:text-sm text-[#0A192F] leading-tight truncate">
                                  {item.title}
                                </h3>
                                <p className="text-[10px] text-gray-500 font-bold truncate mt-0.5">
                                  {item.categoryName} {item.notes ? `• ${item.notes}` : ""}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleDeleteWishlist(item.id, e)}
                              title="Hapus wishlist"
                              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all shrink-0 cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          {/* Bottom: Price + Readiness Badge + Mini CTA */}
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/70">
                            <div className="font-black text-xs md:text-sm text-[#0A192F]">
                              {formatRupiah(item.estimatedPrice)}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span
                                style={{
                                  background: isReady ? "#DCFCE7" : "#FEE2E2",
                                  border: isReady ? "1.2px solid #16A34A" : "1.2px solid #DC2626",
                                  color: isReady ? "#16A34A" : "#DC2626",
                                  borderRadius: "6px",
                                }}
                                className="px-2 py-0.5 text-[9px] font-black"
                              >
                                {isReady ? "AMAN DIBELI" : `OVERBUDGET (-${formatRupiah(item.deficitAmount)})`}
                              </span>

                              <span
                                style={{
                                  background: isSelected ? "var(--color-navy)" : "var(--color-lime)",
                                  color: isSelected ? "var(--color-lime)" : "var(--color-navy)",
                                  border: "1.2px solid var(--color-navy)",
                                  borderRadius: "6px",
                                }}
                                className="px-2 py-0.5 text-[9px] font-black flex items-center gap-0.5 shrink-0"
                              >
                                {isSelected ? "Sedang Diuji" : "Cek ➔"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              /* Quick Form Mode */
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Nominal Input */}
                  <div>
                    <label className="block text-[11px] font-black uppercase text-[#0A192F] mb-1">
                      NOMINAL RENCANA BELANJA (RP) <span className="text-red-500">*</span>
                    </label>
                    
                    <div 
                      style={{
                        background: "#FFFFFF",
                        border: "2px solid var(--color-navy)",
                        borderRadius: "10px",
                        boxShadow: "2px 2px 0px var(--color-navy)",
                      }}
                      className="relative flex items-center overflow-hidden"
                    >
                      <span 
                        style={{
                          background: "var(--color-lime)",
                          borderRight: "1.8px solid var(--color-navy)",
                        }}
                        className="px-3 py-2 font-black text-sm text-[#0A192F] select-none shrink-0"
                      >
                        Rp
                      </span>
                      <input
                        type="text"
                        required
                        value={amount ? Number(amount.replace(/\D/g, "")).toLocaleString("id-ID") : ""}
                        onChange={handleAmountChange}
                        placeholder="Contoh: 350.000"
                        className="w-full px-2.5 py-2 bg-transparent font-black text-base text-[#0A192F] placeholder:text-gray-400 focus:outline-none"
                      />
                    </div>

                    {/* Quick Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {QUICK_AMOUNTS.map((q) => {
                        const isPillActive = amount === q.toString();
                        return (
                          <button
                            type="button"
                            key={q}
                            onClick={() => setAmount(q.toString())}
                            style={{
                              background: isPillActive ? "var(--color-lime)" : "#FFFFFF",
                              color: "var(--color-navy)",
                              border: "1.5px solid var(--color-navy)",
                              borderRadius: "6px",
                            }}
                            className="px-2 py-0.5 text-[10px] font-bold hover:bg-[#B8FF00] cursor-pointer"
                          >
                            {formatRupiah(q)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Picker */}
                  <div>
                    <label className="block text-[11px] font-black uppercase text-[#0A192F] mb-1">
                      KATEGORI PENGELUARAN
                    </label>
                    
                    <div className="grid grid-cols-2 gap-1.5">
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = selectedCategory === cat.id;

                        return (
                          <button
                            type="button"
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            style={{
                              background: isSelected ? "var(--color-navy)" : "#FFFFFF",
                              color: isSelected ? "var(--color-lime)" : "var(--color-navy)",
                              border: "1.5px solid var(--color-navy)",
                              boxShadow: isSelected ? "2px 2px 0px var(--color-lime)" : "1px 1px 0px var(--color-navy)",
                              borderRadius: "8px",
                            }}
                            className="px-2 py-1.5 flex items-center gap-1.5 text-left font-black text-[10px] transition-all hover:bg-slate-50 cursor-pointer"
                          >
                            <div 
                              style={{
                                background: isSelected ? "var(--color-lime)" : "#F1F5F9",
                                border: "1px solid var(--color-navy)",
                                borderRadius: "4px",
                              }}
                              className="w-5 h-5 flex items-center justify-center shrink-0"
                            >
                              <Icon size={12} color="var(--color-navy)" strokeWidth={2.4} />
                            </div>
                            <span className="truncate">{cat.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Merchant & Notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#0A192F] mb-1">
                        NAMA TOKO / MERCHANT
                      </label>
                      <input
                        type="text"
                        value={merchant}
                        onChange={(e) => setMerchant(e.target.value)}
                        placeholder="Shopee, Uniqlo..."
                        style={{
                          background: "#F8FAFC",
                          border: "1.5px solid var(--color-navy)",
                          borderRadius: "8px",
                        }}
                        className="w-full px-2.5 py-1.5 font-bold text-xs text-[#0A192F] focus:outline-none focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#0A192F] mb-1">
                        CATATAN / ALASAN
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Diskon 30%, rusak..."
                        style={{
                          background: "#F8FAFC",
                          border: "1.5px solid var(--color-navy)",
                          borderRadius: "8px",
                        }}
                        className="w-full px-2.5 py-1.5 font-medium text-xs text-[#0A192F] focus:outline-none focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !amount}
                    style={{
                      background: "var(--color-lime)",
                      border: "2px solid var(--color-navy)",
                      boxShadow: "3px 3px 0px var(--color-navy)",
                      borderRadius: "10px",
                    }}
                    className="w-full py-2.5 font-black text-xs md:text-sm text-[#0A192F] flex items-center justify-center gap-2 hover:translate-x-0.5 hover:shadow-[4px_4px_0px_#0A192F] active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Menganalisis..." : "Evaluasi Risiko Sekarang"}
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Footer Card 1: Cara Kerja AI Guardrail */}
          <div 
            style={{
              marginTop: "auto",
              paddingTop: "0.85rem",
            }}
          >
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
                <Info size={13} color="var(--color-navy)" strokeWidth={2.5} />
              </div>
              <div className="text-[11px] leading-tight">
                <span className="font-black text-[#0A192F]">Cara Kerja AI Guardrail: </span>
                <span className="text-gray-700 font-medium">
                  Model menguji rencana belanja terhadap median pengeluaran, sisa kuota Wants, dan penundaan target tabungan.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── CARD BESAR 2: Hasil Evaluasi & AI Guardrail (7 cols) ── */}
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
          }}
          className="lg:col-span-7"
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
            {/* Header Card 2 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div 
                  style={{
                    width: "34px",
                    height: "34px",
                    background: result ? (result.risk_level === "HIGH" ? "#DC2626" : result.risk_level === "MEDIUM" ? "#FBBF24" : "var(--color-lime)") : "var(--color-lime)",
                    border: "2px solid var(--color-navy)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "2px 2px 0px var(--color-navy)",
                    flexShrink: 0
                  }}
                >
                  <ShieldAlert size={17} color={result && result.risk_level === "HIGH" ? "#FFFFFF" : "var(--color-navy)"} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 900, color: "var(--color-navy)", margin: 0, lineHeight: 1.2 }}>
                    Hasil Evaluasi Risiko & AI Guardrail
                  </h3>
                  <p style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 600, margin: "2px 0 0 0" }}>
                    Analisis risiko otomatis, dampak alokasi pos, dan rekomendasi intervensi
                  </p>
                </div>
              </div>

              {result && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span 
                    style={{
                      background: "var(--color-navy)",
                      color: "var(--color-lime)",
                      border: "1.5px solid var(--color-navy)",
                      borderRadius: "6px",
                      padding: "2px 8px",
                      fontSize: "0.72rem",
                      fontWeight: 900,
                    }}
                  >
                    {result.merchant} • {formatRupiah(result.planned_amount)}
                  </span>
                </div>
              )}
            </div>

            {!result ? (
              /* Empty State inside Card 2 */
              <div 
                style={{
                  background: "#F8FAFC",
                  border: "2px dashed var(--color-navy)",
                  borderRadius: "12px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "3.5rem 1.5rem",
                  minHeight: "380px",
                }}
                className="space-y-3"
              >
                <div 
                  style={{
                    background: "var(--color-lime)",
                    border: "2px solid var(--color-navy)",
                    borderRadius: "12px",
                    boxShadow: "3px 3px 0px var(--color-navy)",
                  }}
                  className="w-12 h-12 flex items-center justify-center"
                >
                  <ShieldAlert size={28} color="var(--color-navy)" strokeWidth={2.4} />
                </div>

                <div className="max-w-sm space-y-1">
                  <h3 className="text-lg font-black text-[#0A192F]">
                    Hasil Evaluasi Akan Tampil Di Sini
                  </h3>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    Pilih salah satu item wishlist di samping atau isi form belanja untuk melihat rekomendasi AI.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-[#FEF08A] border border-[#0A192F] rounded shadow-[1px_1px_0px_#0A192F]">
                    Uji Kuota Pos Keinginan
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-[#B8FF00] border border-[#0A192F] rounded shadow-[1px_1px_0px_#0A192F]">
                    Dampak Target Tabungan
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-black bg-[#E0F2FE] border border-[#0A192F] rounded shadow-[1px_1px_0px_#0A192F]">
                    Intervensi Anti-Impulsif
                  </span>
                </div>
              </div>
            ) : (
              /* Result View inside Card 2 */
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", flex: 1, justifyContent: "space-between" }}>
                {/* 1. Risk Level Banner */}
                <div
                  style={{
                    border: "2px solid var(--color-navy)",
                    boxShadow: "3px 3px 0px var(--color-navy)",
                    borderRadius: "12px",
                    background: result.risk_level === "HIGH" 
                      ? "#DC2626" 
                      : result.risk_level === "MEDIUM" 
                      ? "#FBBF24" 
                      : "var(--color-lime)"
                  }}
                  className={`p-3.5 md:p-4 ${result.risk_level === "HIGH" ? "text-white" : "text-[#0A192F]"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-1 bg-[#0A192F] text-white px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1">
                        {result.risk_level === "HIGH" && <AlertTriangle size={11} className="text-[#EF4444]" />}
                        {result.risk_level === "MEDIUM" && <AlertTriangle size={11} className="text-[#FBBF24]" />}
                        {result.risk_level === "LOW" && <CheckCircle2 size={11} className="text-[#A3E635]" />}
                        Tingkat Risiko: {result.risk_level === "HIGH" ? "Risiko Tinggi (Overbudget)" : result.risk_level === "MEDIUM" ? "Risiko Sedang" : "Risiko Rendah (Aman)"}
                      </div>
                      <h3 className="text-lg md:text-xl font-black leading-tight">
                        {result.risk_level === "HIGH" && "Peringatan: Potensi Menjebol Anggaran!"}
                        {result.risk_level === "MEDIUM" && "Perhatian: Penggunaan Kuota Menipis"}
                        {result.risk_level === "LOW" && "Rencana Belanja Ini Aman Diwujudkan"}
                      </h3>
                      <p className={`text-xs font-medium mt-0.5 ${result.risk_level === "HIGH" ? "text-white/90" : "text-[#0A192F]/85"}`}>
                        Skor Risiko AI: {(result.risk_score * 100).toFixed(0)}% • Rekomendasi:{" "}
                        <strong className="underline uppercase">{result.recommended_action}</strong>
                      </p>
                    </div>

                    <div className="bg-white text-[#0A192F] border-2 border-[#0A192F] px-3 py-1.5 rounded-xl font-black text-center shrink-0 shadow-[2px_2px_0px_#0A192F]">
                      <div className="text-[9px] uppercase text-gray-500 font-bold">Skor Risiko</div>
                      <div className="text-xl font-black">{(result.risk_score * 100).toFixed(0)}%</div>
                    </div>
                  </div>

                  {/* Visual Gauge Bar */}
                  <div className="mt-2.5 pt-2 border-t border-black/20">
                    <div className="flex justify-between text-[10px] font-bold mb-1">
                      <span>Aman (0%)</span>
                      <span>Moderat (50%)</span>
                      <span>Kritis (100%)</span>
                    </div>
                    <div className="h-2 bg-white/50 border border-[#0A192F] rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-[#0A192F] transition-all duration-700"
                        style={{ width: `${Math.min(100, Math.max(5, result.risk_score * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. XAI Trigger Factors Card */}
                <div 
                  style={{
                    background: "#F8FAFC",
                    border: "2px solid var(--color-navy)",
                    boxShadow: "2.5px 2.5px 0px var(--color-navy)",
                    borderRadius: "12px",
                  }}
                  className="p-3 md:p-3.5 space-y-2"
                >
                  <h4 className="text-xs font-black text-[#0A192F] uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders size={14} className="text-[#1d4ed8]" />
                    Alasan & Faktor Pemicu Risiko (XAI Explanation)
                  </h4>
                  <ul className="space-y-1.5">
                    {result.trigger_factors.map((factor, idx) => (
                      <li
                        key={idx}
                        className="p-2 px-2.5 bg-white border border-black rounded-lg text-xs font-bold text-black flex items-start gap-2 shadow-[1px_1px_0px_#000]"
                      >
                        <span className="w-4 h-4 rounded-full bg-[#0A192F] text-white font-black text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Dampak Pos Anggaran & Efek Domino Tabungan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Budget Impact */}
                  <div 
                    style={{
                      background: "#F8FAFC",
                      border: "2px solid var(--color-navy)",
                      boxShadow: "2px 2px 0px var(--color-navy)",
                      borderRadius: "12px",
                    }}
                    className="p-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-500 mb-1">
                        <TrendingDown size={13} className="text-[#EF4444]" />
                        Dampak Pos Anggaran
                      </div>
                      <div className="text-sm font-black text-[#0A192F]">
                        {result.remaining_after < 0 
                          ? `- ${formatRupiah(Math.abs(result.remaining_after))} (DEFISIT)`
                          : formatRupiah(result.remaining_after)}
                      </div>
                      <div className="text-[10px] text-gray-600 mt-0.5">
                        Sisa setelah belanja (sebelumnya: {formatRupiah(result.remaining_before)})
                      </div>
                    </div>

                    <div className="mt-2">
                      <div className="w-full bg-gray-200 border border-black h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            result.remaining_after < 0
                              ? "bg-red-500"
                              : result.remaining_after < result.budget_limit * 0.2
                              ? "bg-amber-400"
                              : "bg-[#B8FF00]"
                          }`}
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(100, (result.remaining_after / result.budget_limit) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Savings Impact */}
                  <div 
                    style={{
                      background: "#F8FAFC",
                      border: "2px solid var(--color-navy)",
                      boxShadow: "2px 2px 0px var(--color-navy)",
                      borderRadius: "12px",
                    }}
                    className="p-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-500 mb-1">
                        <PiggyBank size={13} className="text-[#1d4ed8]" />
                        Efek Domino Tabungan
                      </div>
                      <div className="text-sm font-black text-[#0A192F]">
                        {result.savings_delayed_days > 0 
                          ? `Tertunda ${result.savings_delayed_days} Hari` 
                          : "Tabungan Aman (0 Hari)"}
                      </div>
                      <div className="text-[10px] text-gray-600 mt-0.5">
                        Target: <strong>{result.savings_goal_title}</strong>
                      </div>
                    </div>

                    <div className="mt-2 text-[10px] font-bold text-gray-700 bg-white px-2 py-1 rounded border border-slate-200">
                      Beban harian: ~{formatRupiah(35000)}/hari
                    </div>
                  </div>
                </div>

                {/* 4. Action Decision Buttons */}
                <div 
                  style={{
                    background: "#F8FAFC",
                    border: "2px solid var(--color-navy)",
                    boxShadow: "2.5px 2.5px 0px var(--color-navy)",
                    borderRadius: "12px",
                    marginTop: "auto",
                  }}
                  className="p-3 md:p-3.5 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#0A192F]">
                      Tentukan Keputusan Anda:
                    </h4>
                    {userDecision && (
                      <span className="text-[10px] font-black bg-[#B8FF00] text-[#0A192F] px-2 py-0.5 rounded border border-[#0A192F]">
                        Tercatat: {userDecision}
                      </span>
                    )}
                  </div>

                  {!userDecision ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleDecision("PROCEED")}
                        style={{
                          background: "var(--color-lime)",
                          border: "1.8px solid var(--color-navy)",
                          boxShadow: "2px 2px 0px var(--color-navy)",
                          borderRadius: "8px",
                        }}
                        className="py-2 px-2.5 font-black text-xs text-[#0A192F] flex items-center justify-center gap-1.5 hover:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        <CheckCircle2 size={14} />
                        Wujudkan Impian
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDecision("ADJUST")}
                        style={{
                          background: "#FFE100",
                          border: "1.8px solid var(--color-navy)",
                          boxShadow: "2px 2px 0px var(--color-navy)",
                          borderRadius: "8px",
                        }}
                        className="py-2 px-2.5 font-black text-xs text-[#0A192F] flex items-center justify-center gap-1.5 hover:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        <Sliders size={14} />
                        Sesuaikan
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDecision("POSTPONE")}
                        style={{
                          background: "#FFFFFF",
                          border: "1.8px solid var(--color-navy)",
                          boxShadow: "2px 2px 0px var(--color-navy)",
                          borderRadius: "8px",
                        }}
                        className="py-2 px-2.5 font-black text-xs text-[#0A192F] flex items-center justify-center gap-1.5 hover:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        <Clock size={14} />
                        Tunda Pembelian
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-white border border-black rounded-lg space-y-2">
                      <div className="flex items-center gap-2 font-black text-xs text-[#0A192F]">
                        <CheckCircle2 size={16} className="text-[#16A34A]" />
                        Keputusan: <span className="uppercase text-[#1d4ed8] font-black">{userDecision}</span>
                      </div>

                      {!feedbackSubmitted ? (
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-gray-700">
                            Apakah analisis ini membantu?
                          </span>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => setFeedbackSubmitted(true)}
                              className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-black rounded text-[10px] font-black shadow-[1px_1px_0px_#000] cursor-pointer"
                            >
                              Ya, Membantu
                            </button>
                            <button
                              type="button"
                              onClick={() => setFeedbackSubmitted(true)}
                              className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-black rounded text-[10px] font-black shadow-[1px_1px_0px_#000] cursor-pointer"
                            >
                              Kurang
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[10px] font-bold text-green-800 bg-green-50 p-1.5 rounded border border-green-200">
                          Terima kasih atas umpan balik Anda!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 4. Compact Add Wishlist Modal ────────────────────── */}
      {isWishlistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            style={{
              background: "#FFFFFF",
              border: "3px solid var(--color-navy)",
              boxShadow: "6px 6px 0px var(--color-navy)",
              borderRadius: "16px",
            }}
            className="w-full max-w-md p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-2.5 border-b-2 border-slate-100">
              <div className="flex items-center gap-2">
                <div 
                  style={{
                    background: "var(--color-lime)",
                    border: "1.8px solid var(--color-navy)",
                    borderRadius: "8px",
                  }}
                  className="w-8 h-8 flex items-center justify-center"
                >
                  <Plus size={18} color="var(--color-navy)" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0A192F]">Tambah Wishlist Impian</h3>
                  <p className="text-[10px] text-gray-500 font-bold">Uji kelayakan belanja terhadap kuota Wants</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsWishlistModalOpen(false)}
                className="p-1 text-gray-400 hover:text-black hover:bg-slate-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddWishlist} className="space-y-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-[#0A192F] mb-1">
                  Nama Barang / Impian <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: AirPods Pro, Jaket Uniqlo..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    background: "#F8FAFC",
                    border: "2px solid var(--color-navy)",
                    borderRadius: "8px",
                  }}
                  className="w-full px-3 py-2 text-xs font-bold text-[#0A192F] focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-[#0A192F] mb-1">
                  Perkiraan Harga (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: 750.000"
                  value={newPrice ? Number(newPrice.replace(/\D/g, "")).toLocaleString("id-ID") : ""}
                  onChange={(e) => setNewPrice(e.target.value.replace(/\D/g, ""))}
                  style={{
                    background: "#F8FAFC",
                    border: "2px solid var(--color-navy)",
                    borderRadius: "8px",
                  }}
                  className="w-full px-3 py-2 text-xs font-bold text-[#0A192F] focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-[#0A192F] mb-1">
                  Kategori
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{
                    background: "#F8FAFC",
                    border: "2px solid var(--color-navy)",
                    borderRadius: "8px",
                  }}
                  className="w-full px-3 py-2 text-xs font-bold text-[#0A192F] focus:outline-none"
                >
                  <option value="Shopping & Fashion">Shopping & Fashion</option>
                  <option value="Aksesoris">Aksesoris</option>
                  <option value="Makanan & Minuman">Makanan & Minuman</option>
                  <option value="Hiburan & Hobi">Hiburan & Hobi</option>
                  <option value="Liburan & Healing">Liburan & Healing</option>
                  <option value="Transportasi">Transportasi</option>
                  <option value="Edukasi">Edukasi</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-[#0A192F] mb-1">
                  Catatan / Alasan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: Hadiah ulang tahun, perlengkapan kerja..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  style={{
                    background: "#F8FAFC",
                    border: "2px solid var(--color-navy)",
                    borderRadius: "8px",
                  }}
                  className="w-full px-3 py-2 text-xs font-medium text-[#0A192F] focus:outline-none focus:bg-white"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsWishlistModalOpen(false)}
                  style={{
                    border: "2px solid var(--color-navy)",
                    borderRadius: "8px",
                  }}
                  className="flex-1 py-2 text-xs font-black text-[#0A192F] bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    background: "var(--color-lime)",
                    border: "2px solid var(--color-navy)",
                    boxShadow: "2px 2px 0px var(--color-navy)",
                    borderRadius: "8px",
                  }}
                  className="flex-1 py-2 text-xs font-black text-[#0A192F] hover:translate-x-0.5 cursor-pointer"
                >
                  Simpan Wishlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
