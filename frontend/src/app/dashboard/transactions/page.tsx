"use client";

import { Wallet, Plus, Coffee, Utensils, Car, ShoppingBag, Zap, Sparkles, TrendingUp, ArrowRight, Tag, Home, Gamepad2, Banknote, Brain, RefreshCw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTransactions, TransactionType } from "@/context/TransactionContext";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";

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

export default function TransactionsPage() {
  const { addTransaction, transactions } = useTransactions();
  const { userData } = useUser();
  const { t } = useLanguage();

  const [desc, setDesc]       = useState("");
  const [amount, setAmount]   = useState("");
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

  // Auto-update category when type or tag changes
  useEffect(() => {
    if (type === "pemasukan") {
      setCategory(CATEGORY_OPTIONS.pemasukan[0]);
    } else {
      setCategory(CATEGORY_OPTIONS[tag][0]);
    }
  }, [type, tag]);

  // ── Hitung category_breakdown dari transaksi yang ada ─────────────────────
  const buildCategoryBreakdown = useCallback(() => {
    const breakdown: Record<string, number> = {};
    transactions
      .filter(tx => tx.type === "pengeluaran")
      .forEach(tx => {
        breakdown[tx.category] = (breakdown[tx.category] || 0) + tx.amount;
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
        `${process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000"}/api/v1/predict/spending-cluster`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id:            userData.id || "guest",
            category_breakdown: breakdown,
            total_transactions: transactions.filter(tx => tx.type === "pengeluaran").length,
          }),
        }
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      // Map respons API → state lokal
      setCluster({
        cluster_label:      data.cluster_label   || data.cluster_label,
        dominant_category:  data.dominant_category,
        insight:            data.insight,
        needs_ratio:        data.needs_ratio      ?? MOCK_CLUSTER.needs_ratio,
        wants_ratio:        data.wants_ratio      ?? MOCK_CLUSTER.wants_ratio,
        savings_ratio:      data.savings_ratio    ?? MOCK_CLUSTER.savings_ratio,
        trend:              data.trend            ?? "stable",
        is_mock:            data.is_mock          ?? true,
      });
    } catch {
      // API belum ready → tetap pakai mock, tidak crash
      setCluster(MOCK_CLUSTER);
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
        background: "var(--color-navy)", color: "var(--color-white)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Mock badge */}
        {cluster.is_mock && (
          <div style={{
            position: "absolute", top: "0.75rem", right: "0.75rem",
            fontSize: "0.6rem", fontWeight: 800, padding: "0.15rem 0.5rem",
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "100px", color: "rgba(255,255,255,0.5)",
          }}>
            {t("dashboard.transactions.demoData")}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
          {/* Cluster label + icon — tanpa skor bulat */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            <div style={{
              width: "72px", height: "72px",
              background: clusterAccentColor,
              borderRadius: "var(--radius-brutal-sm)",
              border: "3px solid var(--color-white)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Brain size={36} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: "0.65rem", fontWeight: 800, opacity: 0.6, textAlign: "center" }}>
              {t("dashboard.transactions.aiPattern")}
            </span>
          </div>

          {/* Main info */}
          <div style={{ flex: 1, minWidth: "200px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800 }}>
                {t("dashboard.transactions.spendingPattern")} {loadingCluster ? "..." : (cluster.is_mock ? t("dashboard.transactions.mockClusterLabel") : cluster.cluster_label)}
              </span>
              {!loadingCluster && (
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.25rem",
                  padding: "0.2rem 0.5rem", background: trendColor,
                  color: "var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
                  fontSize: "0.7rem", fontWeight: 800, border: "1.5px solid var(--color-navy)",
                }}>
                  <TrendingUp size={10} /> {trendLabel}
                </div>
              )}
            </div>

            <p style={{ fontSize: "0.9rem", opacity: 0.85, margin: "0 0 0.75rem 0", lineHeight: 1.5 }}>
              {loadingCluster ? t("dashboard.transactions.analyzing") : (cluster.is_mock ? t("dashboard.transactions.mockInsight") : cluster.insight)}
            </p>

            {/* Dominant category badge */}
            {!loadingCluster && cluster.dominant_category && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>{t("dashboard.transactions.dominant")}</span>
                <span style={{
                  fontSize: "0.7rem", fontWeight: 800, padding: "0.15rem 0.5rem",
                  background: clusterAccentColor, color: "var(--color-navy)",
                  borderRadius: "100px", border: "1.5px solid rgba(255,255,255,0.3)",
                }}>
                  {cluster.is_mock ? t("dashboard.transactions.mockDominantCategory") : cluster.dominant_category}
                </span>
              </div>
            )}

            {/* Needs / Wants / Savings bar */}
            <div style={{ display: "flex", height: "12px", borderRadius: "100px", border: "1.5px solid var(--color-white)", overflow: "hidden" }}>
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
                boxShadow: "3px 3px 0px var(--color-white)", whiteSpace: "nowrap",
              }}>
                {t("dashboard.transactions.manageBudget")} <ArrowRight size={16} />
              </button>
            </Link>
            <button
              onClick={fetchCluster}
              disabled={loadingCluster}
              className="btn-brutal"
              style={{
                background: "rgba(255,255,255,0.1)", color: "var(--color-white)",
                padding: "0.5rem 1.25rem", fontWeight: 700, fontSize: "0.8rem",
                display: "flex", alignItems: "center", gap: "0.4rem",
                border: "2px solid rgba(255,255,255,0.3)", boxShadow: "none",
                opacity: loadingCluster ? 0.5 : 1, cursor: loadingCluster ? "wait" : "pointer",
              }}
            >
              <RefreshCw size={13} className={loadingCluster ? "animate-spin" : ""} />
              {loadingCluster ? t("dashboard.transactions.analyzing") : t("dashboard.transactions.refreshInsight")}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2.5rem", alignItems: "start" }}>
        {/* Quick Input Section */}
        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="card-brutal" style={{ background: "var(--color-white)", border: "4px solid var(--color-navy)", padding: "2rem", boxShadow: "8px 8px 0px var(--color-navy)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <Zap size={28} color="var(--color-orange)" fill="var(--color-orange)" />
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "var(--color-navy)", margin: 0, fontWeight: 900 }}>{t("dashboard.transactions.quickInputTitle")}</h3>
            </div>
            <p style={{ fontSize: "1rem", color: "var(--color-text-muted)", marginBottom: "2rem", lineHeight: 1.5, fontWeight: 500 }}>
              {t("dashboard.transactions.quickInputDesc")}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {[
                { label: t("dashboard.transactions.quickCoffeeLabel"), amount: "25000", desc: t("dashboard.transactions.quickCoffeeDesc"), color: "var(--color-purple)", icon: Coffee, type: "wants" as const },
                { label: t("dashboard.transactions.quickFoodLabel"), amount: "35000", desc: t("dashboard.transactions.quickFoodDesc"), color: "var(--color-orange)", icon: Utensils, type: "needs" as const },
                { label: t("dashboard.transactions.quickGasLabel"), amount: "20000", desc: t("dashboard.transactions.quickGasDesc"), color: "var(--color-lime)", icon: Car, type: "needs" as const },
                { label: t("dashboard.transactions.quickSnackLabel"), amount: "15000", desc: t("dashboard.transactions.quickSnackDesc"), color: "var(--color-pink)", icon: ShoppingBag, type: "wants" as const },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => { handleQuickInput(btn.desc, btn.amount); setTag(btn.type); }}
                  className="btn-brutal"
                  style={{
                    background: "var(--color-white)", padding: "1.25rem",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem",
                    border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
                    boxShadow: "4px 4px 0px var(--color-navy)", transition: "all 0.1s", position: "relative",
                  }}
                >
                  <div style={{
                    position: "absolute", top: "0.4rem", right: "0.4rem",
                    fontSize: "0.6rem", fontWeight: 800, padding: "0.1rem 0.35rem",
                    background: btn.type === "needs" ? "var(--color-lime)" : "var(--color-orange)",
                    border: "1.5px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
                    color: "var(--color-navy)",
                  }}>
                    {btn.type === "needs" ? "NEED" : "WANT"}
                  </div>
                  <div style={{ background: btn.color, padding: "0.75rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0px var(--color-navy)" }}>
                    <btn.icon size={24} color="var(--color-navy)" />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: "0.9375rem", color: "var(--color-navy)" }}>{btn.label}</span>
                </button>
              ))}
            </div>

            <div style={{ marginTop: "2rem", padding: "1.25rem", background: "var(--color-bg)", border: "2px dashed var(--color-navy)", borderRadius: "var(--radius-brutal-sm)" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "0.5rem" }}>{t("dashboard.transactions.tipsTitle")}</div>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.4 }}>
                {t("dashboard.transactions.tipsDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="card-brutal" style={{ background: "var(--color-white)", border: "4px solid var(--color-navy)", padding: "2.5rem", boxShadow: "10px 10px 0px var(--color-purple)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
              <Plus size={28} color="var(--color-white)" fill="var(--color-purple)" style={{ background: "var(--color-purple)", borderRadius: "var(--radius-brutal-sm)", padding: "4px", border: "2px solid var(--color-navy)" }} />
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", color: "var(--color-navy)", margin: 0, fontWeight: 900 }}>{t("dashboard.transactions.formTitle")}</h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!desc || !amount) return;
                addTransaction({ description: desc, amount: parseFloat(amount), type, category, tag });
                alert(t("dashboard.transactions.savedSuccess"));
                setDesc(""); setAmount("");
              }}
              style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
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
                      onChange={(e) => setAmount(e.target.value)}
                      className="input-brutal"
                      type="number"
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
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TransactionType)}
                    className="input-brutal"
                    style={{ border: "3px solid var(--color-navy)", padding: "1rem", fontSize: "1.125rem", width: "100%", height: "auto", boxShadow: "4px 4px 0px var(--color-navy)", fontWeight: 700, background: "var(--color-bg)" }}
                  >
                    <option value="pengeluaran">{t("dashboard.transactions.expense")}</option>
                    <option value="pemasukan">{t("dashboard.transactions.income")}</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem" }}>
                <div>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                    {t("dashboard.transactions.categoryLabel")}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="input-brutal"
                    style={{ border: "3px solid var(--color-navy)", padding: "1rem", fontSize: "1.125rem", width: "100%", height: "auto", boxShadow: "4px 4px 0px var(--color-navy)", fontWeight: 700, background: "var(--color-bg)" }}
                  >
                    {(type === "pemasukan" ? CATEGORY_OPTIONS.pemasukan : CATEGORY_OPTIONS[tag]).map((catOption) => (
                      <option key={catOption} value={catOption}>{catOption}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                    <Tag size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "0.25rem" }} />{t("dashboard.transactions.priorityLabel")}
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
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
              </div>

              <button
                type="submit"
                className="btn-brutal btn-brutal--primary"
                style={{
                  marginTop: "1.5rem", padding: "1.25rem", fontSize: "1.25rem", fontWeight: 900,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                  background: "var(--color-navy)", color: "var(--color-white)",
                  boxShadow: "6px 6px 0px var(--color-lime)"
                }}
              >
                {t("dashboard.transactions.saveTransaction")} <Sparkles size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
