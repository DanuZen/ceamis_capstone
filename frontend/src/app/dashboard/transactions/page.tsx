"use client";

import { Wallet, Plus, Coffee, Utensils, Car, ShoppingBag, Zap, Sparkles, TrendingUp, ArrowRight, Tag, Home, Gamepad2, Banknote, Brain, RefreshCw, ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTransactions, TransactionType } from "@/context/TransactionContext";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/Toast";

// ── Tipe response Model 2 (Spending Pattern Clustering) ──────────────────────
interface SpendingClusterResult {
  cluster_label: string;   // "Si Impulsif" | "Si Hemat" | "Si Boros"
  dominant_category: string;
  insight: string;
  needs_ratio: number;     // 0–100
  wants_ratio: number;     // 0–100
  savings_ratio: number;   // 0–100
  trend: "improving" | "stable" | "declining";
  is_mock: boolean;
}

// ── Fallback data saat API belum ready ────────────────────────────────────────
const MOCK_CLUSTER: SpendingClusterResult = {
  cluster_label: "Si Hemat",
  dominant_category: "Makanan & Minuman",
  insight: "Pengeluaran kamu terdistribusi cukup merata. Pola keuangan kamu terkontrol — pertahankan!",
  needs_ratio: 62,
  wants_ratio: 28,
  savings_ratio: 10,
  trend: "improving",
  is_mock: true,
};

const CLUSTER_COLORS: Record<string, string> = {
  "Si Hemat":    "var(--color-lime)",
  "Si Impulsif": "var(--color-orange)",
  "Si Boros":    "var(--color-pink)",
};

const CustomSelect = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: {key:string, label:string}[] }) => {
  const [open, setOpen] = useState(false);
  const selectedOpt = options.find(o => o.key === value) || options[0];

  return (
    <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        className="input-brutal"
        style={{ 
          border: "3px solid var(--color-navy)", padding: "1rem", fontSize: "1.125rem", fontWeight: 700, 
          width: "100%", boxShadow: "4px 4px 0px var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "var(--color-bg)", cursor: "pointer", flex: 1
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-navy)" }}>
          {selectedOpt?.label || value}
        </span>
        <ChevronDown size={20} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: "var(--color-navy)" }} />
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
                  padding: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", border: "none",
                  background: value === opt.key ? "var(--color-purple)" : "transparent",
                  color: value === opt.key ? "var(--color-white)" : "var(--color-navy)",
                  fontWeight: 800, textAlign: "left", cursor: "pointer", borderBottom: "2px solid rgba(10,25,47,0.05)",
                  fontSize: "1rem"
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

export default function TransactionsPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { addTransaction, transactions } = useTransactions();
  const { userData, updateUserData } = useUser();

  const [desc, setDesc]       = useState("");
  const [amount, setAmount]   = useState("");  // stored as formatted string e.g. "100.000.000"
  const [amountRaw, setAmountRaw] = useState(""); // unformatted for parse
  const [type, setType]       = useState<TransactionType>("pengeluaran");
  const [tag, setTag]         = useState<"needs" | "wants" | "save">("needs");

  const CATEGORY_OPTIONS = {
    pemasukan: [t("dashboard.transactions.catSalary"), t("dashboard.transactions.catBonus"), t("dashboard.transactions.catBusiness"), t("dashboard.transactions.catOther")],
    needs: [t("dashboard.transactions.catFood"), t("dashboard.transactions.catTransport"), t("dashboard.transactions.catHealth"), t("dashboard.transactions.catBills"), t("dashboard.transactions.catHome")],
    wants: [t("dashboard.transactions.catShopping"), t("dashboard.transactions.catEntertainment"), t("dashboard.transactions.catHobby"), t("dashboard.transactions.catSnacks"), t("dashboard.transactions.catHoliday")],
    save: [t("dashboard.transactions.catEmergency"), t("dashboard.transactions.catMutualFund"), t("dashboard.transactions.catStock"), t("dashboard.transactions.catDream"), t("dashboard.transactions.catVehicle")]
  };

  const [category, setCategory] = useState(CATEGORY_OPTIONS.needs[0]);

  // ── Model 2 state ──────────────────────────────────────────────────────────
  const [cluster, setCluster]     = useState<SpendingClusterResult>(MOCK_CLUSTER);
  const [loadingCluster, setLoadingCluster] = useState(false);

  const [dynamicNeeds, setDynamicNeeds] = useState<string[]>([]);
  const [dynamicWants, setDynamicWants] = useState<string[]>([]);
  const [dynamicSavings, setDynamicSavings] = useState<string[]>([]);

  useEffect(() => {
    try {
      const budgetData = localStorage.getItem("ceamis_budget");
      if (budgetData) {
        const parsed = JSON.parse(budgetData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDynamicNeeds(parsed.filter((b: any) => b.type === "needs").map((b: any) => b.name));
          setDynamicWants(parsed.filter((b: any) => b.type === "wants").map((b: any) => b.name));
          setDynamicSavings(parsed.filter((b: any) => b.type === "savings").map((b: any) => b.name));
        }
      }
    } catch (e) {}
  }, []);

  const currentCategoryOptions = {
    ...CATEGORY_OPTIONS,
    needs: dynamicNeeds.length > 0 ? dynamicNeeds : CATEGORY_OPTIONS.needs,
    wants: dynamicWants.length > 0 ? dynamicWants : CATEGORY_OPTIONS.wants,
    save: dynamicSavings.length > 0 ? dynamicSavings : CATEGORY_OPTIONS.save
  };

  // Auto-update category when type or tag changes
  useEffect(() => {
    if (type === "pemasukan") {
      setCategory(currentCategoryOptions.pemasukan[0]);
    } else {
      setCategory(currentCategoryOptions[tag]?.[0] || "");
    }
  }, [type, tag, dynamicNeeds, dynamicWants, dynamicSavings]);

  // ── Hitung category_breakdown dari transaksi yang ada ─────────────────────
  const buildCategoryBreakdown = useCallback(() => {
    const breakdown: Record<string, number> = {};
    transactions
      .filter(tx => tx.type === "pengeluaran")
      .forEach(tx => {
        const catStr = tx.category.toLowerCase();
        let mlCat = "cat_kebutuhan_pokok"; // default
        
        if (catStr.includes("makan") || catStr.includes("food") || catStr.includes("snack") || catStr.includes("cemil") || catStr.includes("minum")) mlCat = "cat_f&b";
        else if (catStr.includes("transport") || catStr.includes("kendaraan") || catStr.includes("vehicle") || catStr.includes("bensin")) mlCat = "cat_transportasi";
        else if (catStr.includes("sehat") || catStr.includes("health") || catStr.includes("medis") || catStr.includes("obat")) mlCat = "cat_kesehatan";
        else if (catStr.includes("tagih") || catStr.includes("bill") || catStr.includes("listrik") || catStr.includes("air") || catStr.includes("home") || catStr.includes("rumah")) mlCat = "cat_tagihan";
        else if (catStr.includes("hibur") || catStr.includes("entertain") || catStr.includes("holiday") || catStr.includes("libur")) mlCat = "cat_hiburan";
        else if (catStr.includes("hobi") || catStr.includes("hobby")) mlCat = "cat_hobi";
        else if (catStr.includes("belanja") || catStr.includes("shop") || catStr.includes("baju") || catStr.includes("fashion")) mlCat = "cat_fashion";
        else if (catStr.includes("elektronik") || catStr.includes("gadget") || catStr.includes("hp")) mlCat = "cat_elektronik";
        else if (catStr.includes("didik") || catStr.includes("school") || catStr.includes("sekolah") || catStr.includes("edu")) mlCat = "cat_pendidikan";
        
        breakdown[mlCat] = (breakdown[mlCat] || 0) + tx.amount;
      });
    return breakdown;
  }, [transactions]);

  // ── Fetch Model 2 dari AI service ─────────────────────────────────────────
  const fetchCluster = useCallback(async () => {
    const breakdown = buildCategoryBreakdown();
    if (Object.keys(breakdown).length === 0) return; // tidak ada data transaksi

    setLoadingCluster(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000"}/api/v1/analyze`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id:            userData.id || "guest"
          }),
        }
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      // Map respons API → state lokal
      const rData = data.data;
      if (rData) {
        const topCategory = Object.keys(breakdown).length > 0 
          ? Object.keys(breakdown).reduce((a, b) => breakdown[a] > breakdown[b] ? a : b) 
          : "Lainnya";
          
        setCluster({
          cluster_label:      rData.persona || MOCK_CLUSTER.cluster_label,
          dominant_category:  topCategory,
          insight:            rData.description || MOCK_CLUSTER.insight,
          needs_ratio:        rData.metrics_summary?.wants_ratio !== undefined ? 100 - Math.round(rData.metrics_summary.wants_ratio * 100) - Math.round(rData.metrics_summary.saving_rate * 100) : MOCK_CLUSTER.needs_ratio,
          wants_ratio:        rData.metrics_summary?.wants_ratio !== undefined ? Math.round(rData.metrics_summary.wants_ratio * 100) : MOCK_CLUSTER.wants_ratio,
          savings_ratio:      rData.metrics_summary?.saving_rate !== undefined ? Math.round(rData.metrics_summary.saving_rate * 100) : MOCK_CLUSTER.savings_ratio,
          trend:              "stable",
          is_mock:            false,
        });

        // Update label user di seluruh aplikasi (Header & Dashboard)
        if (rData.persona) {
          updateUserData({ label: rData.persona });
          // Simpan di key terpisah agar tidak ditimpa saat refreshUser() fetch dari API
          localStorage.setItem("ceamis_cluster_label", rData.persona);
        }
      } else {
        throw new Error("Invalid API format");
      }
    } catch {
      // API belum ready → pakai mock, tetapi tetap update label
      setCluster(MOCK_CLUSTER);
      updateUserData({ label: MOCK_CLUSTER.cluster_label });
      localStorage.setItem("ceamis_cluster_label", MOCK_CLUSTER.cluster_label);
    } finally {
      setLoadingCluster(false);
    }
  }, [buildCategoryBreakdown, transactions]);

  // Auto-fetch saat transaksi berubah
  useEffect(() => {
    fetchCluster();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions.length]);

  const handleQuickInput = (presetDesc: string, presetAmount: string) => {
    setDesc(presetDesc);
    setAmount(presetAmount);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
  };

  const trendLabel = cluster.trend === "improving"
    ? t("dashboard.transactions.trendImproving") : cluster.trend === "declining"
    ? t("dashboard.transactions.trendDeclining") : t("dashboard.transactions.trendStable");
  const trendColor = cluster.trend === "improving"
    ? "var(--color-lime)" : cluster.trend === "declining"
    ? "var(--color-pink)" : "var(--color-purple)";
  const clusterAccentColor = CLUSTER_COLORS[cluster.cluster_label] ?? "var(--color-lime)";

  return (
    <div style={{ paddingBottom: "3rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div style={{
          width: "72px", height: "72px", background: "var(--color-lime)",
          borderRadius: "var(--radius-brutal-sm)", border: "3px solid var(--color-navy)",
          boxShadow: "4px 4px 0px var(--color-navy)", display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <Wallet size={40} color="var(--color-navy)" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", marginBottom: "0.25rem", color: "var(--color-navy)", fontWeight: 800 }}>
            {t("dashboard.transactions.title")}
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
            {t("dashboard.transactions.desc")}
          </p>
        </div>
      </div>

      {/* ── Model 2: Spending Cluster Insight Card ─────────────────────────── */}
      <div className="card-brutal animate-bounce-in" style={{
        padding: "1.5rem", marginBottom: "2rem",
        background: "var(--color-white)", color: "var(--color-navy)",
        border: "4px solid var(--color-navy)", boxShadow: "8px 8px 0px var(--color-navy)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
          {/* Cluster label + icon — tanpa skor bulat */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            <div style={{
              width: "72px", height: "72px",
              background: clusterAccentColor,
              borderRadius: "var(--radius-brutal-sm)",
              border: "3px solid var(--color-navy)",
              boxShadow: "4px 4px 0px var(--color-navy)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Brain size={36} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
          </div>

          {/* Main info */}
          <div style={{ flex: 1, minWidth: "200px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800 }}>
                {t("dashboard.transactions.spendingPattern")} {loadingCluster ? "..." : cluster.cluster_label}
              </span>
              {!loadingCluster && (
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.25rem",
                  padding: "0.2rem 0.5rem", background: trendColor,
                  color: cluster.trend === "stable" ? "var(--color-white)" : "var(--color-navy)", 
                  borderRadius: "var(--radius-brutal-sm)",
                  fontSize: "0.7rem", fontWeight: 800, border: "1.5px solid var(--color-navy)",
                }}>
                  <TrendingUp size={10} /> {trendLabel}
                </div>
              )}
            </div>

            <p style={{ fontSize: "0.9rem", opacity: 0.85, margin: "0 0 0.75rem 0", lineHeight: 1.5 }}>
              {loadingCluster ? t("dashboard.transactions.analyzing") : cluster.insight}
            </p>

            {/* Needs / Wants / Savings bar */}
            <div style={{ display: "flex", height: "12px", borderRadius: "100px", border: "1.5px solid var(--color-navy)", overflow: "hidden" }}>
              <div style={{ width: `${cluster.needs_ratio}%`,   background: "var(--color-lime)"   }} title="Needs"    />
              <div style={{ width: `${cluster.wants_ratio}%`,   background: "var(--color-orange)" }} title="Wants"    />
              <div style={{ width: `${cluster.savings_ratio}%`, background: "var(--color-purple)" }} title="Savings"  />
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.35rem", fontSize: "0.7rem", fontWeight: 700 }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Home size={10} /> {t("dashboard.transactions.needs")} {cluster.needs_ratio}%</span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Gamepad2 size={10} /> {t("dashboard.transactions.wants")} {cluster.wants_ratio}%</span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Banknote size={10} /> {t("dashboard.transactions.save")} {cluster.savings_ratio}%</span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "stretch" }}>
            <Link href="/dashboard/planning" style={{ textDecoration: "none" }}>
              <button className="btn-brutal" style={{
                background: "var(--color-lime)", color: "var(--color-navy)",
                padding: "0.75rem 1.25rem", fontWeight: 800,
                display: "flex", alignItems: "center", gap: "0.5rem",
                boxShadow: "3px 3px 0px var(--color-navy)", whiteSpace: "nowrap",
              }}>
                {t("dashboard.transactions.manageBudget")} <ArrowRight size={16} />
              </button>
            </Link>
            <button
              onClick={fetchCluster}
              disabled={loadingCluster}
              className="btn-brutal"
              style={{
                background: "var(--color-bg)", color: "var(--color-navy)",
                padding: "0.5rem 1.25rem", fontWeight: 700, fontSize: "0.8rem",
                display: "flex", alignItems: "center", gap: "0.4rem",
                border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)",
                opacity: loadingCluster ? 0.5 : 1, cursor: loadingCluster ? "wait" : "pointer",
              }}
            >
              <RefreshCw size={13} className={loadingCluster ? "animate-spin" : ""} />
              {loadingCluster ? "Menganalisis..." : "Analisis Lagi"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "2.5rem", alignItems: "stretch" }}>
        {/* Quick Input Section */}
        <div className="animate-slide-up" style={{ flex: "1 1 300px", maxWidth: "100%", animationDelay: "100ms", display: "flex", flexDirection: "column" }}>
          <div className="card-brutal" style={{ background: "var(--color-white)", border: "4px solid var(--color-navy)", padding: "2.5rem", boxShadow: "10px 10px 0px var(--color-navy)", display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <Zap size={28} color="var(--color-white)" fill="var(--color-orange)" style={{ background: "var(--color-orange)", borderRadius: "var(--radius-brutal-sm)", padding: "4px", border: "2px solid var(--color-navy)" }} />
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "var(--color-navy)", margin: 0, fontWeight: 900 }}>{t("dashboard.transactions.quickInputTitle")}</h3>
            </div>
            <p style={{ fontSize: "1rem", color: "var(--color-text-muted)", marginBottom: "2rem", lineHeight: 1.5, fontWeight: 500 }}>
              {t("dashboard.transactions.quickInputDesc")}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {[
                { label: t("dashboard.transactions.quickCoffeeLabel"), amount: "25000", desc: t("dashboard.transactions.quickCoffeeDesc"), color: "var(--color-orange)", icon: Coffee, type: "wants" as const },
                { label: t("dashboard.transactions.quickSnackLabel"), amount: "15000", desc: t("dashboard.transactions.quickSnackDesc"), color: "var(--color-orange)", icon: ShoppingBag, type: "wants" as const },
                { label: t("dashboard.transactions.quickFoodLabel"), amount: "35000", desc: t("dashboard.transactions.quickFoodDesc"), color: "var(--color-lime)", icon: Utensils, type: "needs" as const },
                { label: t("dashboard.transactions.quickGasLabel"), amount: "20000", desc: t("dashboard.transactions.quickGasDesc"), color: "var(--color-lime)", icon: Car, type: "needs" as const },
                { label: "Tabungan", amount: "50000", desc: "Tabungan Darurat", color: "var(--color-purple)", icon: Wallet, type: "save" as const },
                { label: "Investasi", amount: "100000", desc: "Beli Reksadana", color: "var(--color-purple)", icon: TrendingUp, type: "save" as const },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => { handleQuickInput(btn.desc, btn.amount); setTag(btn.type); }}
                  className="btn-brutal"
                  style={{
                    background: "var(--color-white)", padding: "1rem",
                    display: "flex", flexDirection: "row", alignItems: "center", gap: "1rem",
                    border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
                    boxShadow: "4px 4px 0px var(--color-navy)", transition: "all 0.1s", position: "relative",
                    justifyContent: "flex-start", width: "100%"
                  }}
                >
                  <div style={{ background: btn.color, padding: "0.6rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0px var(--color-navy)" }}>
                    <btn.icon size={22} color={btn.color === "var(--color-lime)" ? "var(--color-navy)" : "var(--color-white)"} />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--color-navy)", flex: 1, textAlign: "left" }}>{btn.label}</span>
                  <div style={{
                    fontSize: "0.65rem", fontWeight: 800, padding: "0.25rem 0.5rem",
                    background: btn.color,
                    border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
                    color: btn.color === "var(--color-lime)" ? "var(--color-navy)" : "var(--color-white)",
                    boxShadow: "2px 2px 0px var(--color-navy)"
                  }}>
                    {btn.type === "needs" ? "NEED" : btn.type === "wants" ? "WANT" : "SAVE"}
                  </div>
                </button>
              ))}
            </div>

            <div style={{ marginTop: "auto", paddingTop: "2rem", width: "100%" }}>
              <div style={{ padding: "1.25rem", background: "var(--color-bg)", border: "3px solid var(--color-navy)", boxShadow: "4px 4px 0px var(--color-navy)", borderRadius: "var(--radius-brutal-sm)" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "0.5rem" }}>{t("dashboard.transactions.tipsTitle")}</div>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.4 }}>
                  {t("dashboard.transactions.tipsDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="animate-slide-up" style={{ flex: "1.7 1 450px", maxWidth: "100%", animationDelay: "200ms", display: "flex", flexDirection: "column" }}>
          <div className="card-brutal" style={{ background: "var(--color-white)", border: "4px solid var(--color-navy)", padding: "2.5rem", boxShadow: "10px 10px 0px var(--color-navy)", display: "flex", flexDirection: "column", overflow: "visible", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <Plus size={28} color="var(--color-white)" fill="var(--color-purple)" style={{ background: "var(--color-purple)", borderRadius: "var(--radius-brutal-sm)", padding: "4px", border: "2px solid var(--color-navy)" }} />
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", color: "var(--color-navy)", margin: 0, fontWeight: 900 }}>{t("dashboard.transactions.formTitle")}</h3>
            </div>
            <p style={{ fontSize: "1rem", color: "var(--color-text-muted)", marginBottom: "2rem", lineHeight: 1.5, fontWeight: 500 }}>
              Catat secara manual detail transaksi pemasukan, pengeluaran, atau tabunganmu di sini.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!desc || !amount) return;
                addTransaction({ description: desc, amount: parseFloat(amountRaw.replace(/\./g, "")), type, category, tag });
                showToast(t("dashboard.transactions.savedSuccess") || "Transaksi aman tersimpan, cuy!", "success");
                setDesc(""); setAmount(""); setAmountRaw("");
              }}
              style={{ display: "flex", flexDirection: "column", gap: "1.5rem", flex: 1 }}
            >
              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                  {type === "pemasukan" ? t("dashboard.transactions.formIncomeLabel") : tag === "save" ? t("dashboard.transactions.formSaveLabel") : t("dashboard.transactions.formExpenseLabel")}
                </label>
                <input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="input-brutal"
                  placeholder={
                    type === "pemasukan" ? t("dashboard.transactions.formIncomePlaceholder") :
                    tag === "save" ? t("dashboard.transactions.formSavePlaceholder") :
                    t("dashboard.transactions.formExpensePlaceholder")
                  }
                  style={{ border: "3px solid var(--color-navy)", padding: "1rem", fontSize: "1.125rem", width: "100%", boxShadow: "4px 4px 0px var(--color-navy)", background: "var(--color-bg)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem" }}>
                <div>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                    {t("dashboard.transactions.amountLabel")}
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.125rem", fontWeight: 800, color: "var(--color-navy)" }}>Rp</span>
                    <input
                      value={amount}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        setAmountRaw(raw);
                        setAmount(raw ? raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "");
                      }}
                      className="input-brutal"
                      type="text"
                      inputMode="numeric"
                      min="0"
                      placeholder="0"
                      style={{ border: "3px solid var(--color-navy)", padding: "1rem 1rem 1rem 3rem", fontSize: "1.125rem", width: "100%", fontWeight: 800, boxShadow: "4px 4px 0px var(--color-navy)", background: "var(--color-bg)" }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                    {t("dashboard.transactions.typeLabel")}
                  </label>
                  <CustomSelect
                    value={type}
                    onChange={(v) => setType(v as TransactionType)}
                    options={[
                      { key: "pengeluaran", label: t("dashboard.transactions.expense") },
                      { key: "pemasukan", label: t("dashboard.transactions.income") }
                    ]}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: type === "pemasukan" ? "1fr" : "1.5fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                    {t("dashboard.transactions.categoryLabel")}
                  </label>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <CustomSelect
                      value={category}
                      onChange={(v) => handleCategoryChange(v)}
                      options={(type === "pemasukan" ? currentCategoryOptions.pemasukan : currentCategoryOptions[tag]).map(cat => ({ key: cat, label: cat }))}
                    />
                  </div>
                </div>

                {type !== "pemasukan" && (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                      <Tag size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "0.25rem" }} />{t("dashboard.transactions.priorityLabel")}
                    </label>
                    <div style={{ display: "flex", gap: "0.5rem", flex: 1 }}>
                      <button type="button" onClick={() => setTag("needs")} className="btn-brutal" style={{
                        flex: 1, padding: "0.75rem 0.25rem", fontWeight: 800, fontSize: "0.85rem",
                        background: tag === "needs" ? "var(--color-lime)" : "var(--color-white)",
                        transform: tag === "needs" ? "translate(-2px, -2px)" : "none",
                        boxShadow: tag === "needs" ? "4px 4px 0px var(--color-navy)" : "2px 2px 0px var(--color-navy)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem",
                      }}>
                        <Home size={12} /> Need
                      </button>
                      <button type="button" onClick={() => setTag("wants")} className="btn-brutal" style={{
                        flex: 1, padding: "0.75rem 0.25rem", fontWeight: 800, fontSize: "0.85rem",
                        background: tag === "wants" ? "var(--color-orange)" : "var(--color-white)",
                        color: tag === "wants" ? "var(--color-white)" : "var(--color-navy)",
                        transform: tag === "wants" ? "translate(-2px, -2px)" : "none",
                        boxShadow: tag === "wants" ? "4px 4px 0px var(--color-navy)" : "2px 2px 0px var(--color-navy)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem",
                      }}>
                        <Gamepad2 size={12} /> Want
                      </button>
                      <button type="button" onClick={() => setTag("save")} className="btn-brutal" style={{
                        flex: 1, padding: "0.75rem 0.25rem", fontWeight: 800, fontSize: "0.85rem",
                        background: tag === "save" ? "var(--color-purple)" : "var(--color-white)",
                        color: tag === "save" ? "var(--color-white)" : "var(--color-navy)",
                        transform: tag === "save" ? "translate(-2px, -2px)" : "none",
                        boxShadow: tag === "save" ? "4px 4px 0px var(--color-navy)" : "2px 2px 0px var(--color-navy)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem",
                      }}>
                        <Banknote size={12} /> Save
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
                <button
                  type="submit"
                  className="btn-brutal btn-brutal--primary"
                  style={{
                    width: "100%", padding: "1.25rem", fontSize: "1.25rem", fontWeight: 900,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                    background: "var(--color-lime)", color: "var(--color-navy)",
                    boxShadow: "6px 6px 0px var(--color-navy)"
                  }}
                >
                  {t("dashboard.transactions.saveTransaction")} <Sparkles size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
