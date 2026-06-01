"use client";

import { useState } from "react";
import { List, ShieldAlert, Wallet, TrendingUp, TrendingDown, Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTransactions } from "@/context/TransactionContext";
import { useLanguage } from "@/context/LanguageContext";
import { translateCategoryName } from "@/lib/translateCategory";

export default function HistoryPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [filter, setFilter] = useState<"semua" | "pemasukan" | "pengeluaran">("semua");
  const { transactions } = useTransactions();
  const { t } = useLanguage();

  const filteredTransactions = transactions.filter(tx => {
    if (filter !== "semua" && tx.type !== filter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (tx.desc?.toLowerCase() || "").includes(q) || (tx.category?.toLowerCase() || "").includes(q);
    }
    return true;
  });

  const totalPemasukan = transactions
    .filter(tx => tx.type === "pemasukan")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalPengeluaran = transactions
    .filter(tx => tx.type === "pengeluaran")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const sisaSaldo = totalPemasukan - totalPengeluaran;

  const categoryCounts = transactions
    .filter(tx => tx.type === "pengeluaran")
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map((entry, index) => ({
      name: entry[0],
      count: entry[1],
      color: index === 0 ? "var(--color-lime)" : index === 1 ? "var(--color-orange)" : "var(--color-purple)"
    }));

  return (
    <div style={{ paddingBottom: "3rem" }}>
      {/* Header Area */}
      <div style={{ marginBottom: "3rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div style={{
          width: "72px",
          height: "72px",
          background: "var(--color-orange)",
          borderRadius: "var(--radius-brutal-sm)",
          border: "3px solid var(--color-navy)",
          boxShadow: "4px 4px 0px var(--color-navy)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <List size={40} color="var(--color-navy)" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", marginBottom: "0.25rem", color: "var(--color-navy)", fontWeight: 800 }}>
            {t("dashboard.history.title")}
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
            {t("dashboard.history.desc")}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Top Row: 4 Stats Cards */}
      <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{ background: "var(--color-lime)", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <TrendingUp size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem" }}>Rp {totalPemasukan.toLocaleString("id-ID")}</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{t("dashboard.history.income")}</div>
          </div>
        </div>
        
        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{ background: "var(--color-orange)", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <TrendingDown size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem" }}>Rp {totalPengeluaran.toLocaleString("id-ID")}</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{t("dashboard.history.expense")}</div>
          </div>
        </div>

        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{ background: "var(--color-purple)", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <Wallet size={24} color="var(--color-white)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem" }}>Rp {sisaSaldo.toLocaleString("id-ID")}</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{t("dashboard.history.balance")}</div>
          </div>
        </div>

        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{ background: "var(--color-white)", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <List size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem" }}>{transactions.length} Trx</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{t("dashboard.history.totalMonth")}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "2rem", alignItems: "stretch" }}>
        {/* Main List Area (Left) */}
        <div style={{ flex: "1 1 65%", minWidth: "300px" }}>
          <div className="card-brutal" style={{ background: "var(--color-white)", border: "4px solid var(--color-navy)", padding: "2rem", boxShadow: "8px 8px 0px var(--color-navy)", height: "100%", minHeight: "60vh" }}>
            
            {/* Header List & Filters */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem", paddingBottom: "1.5rem", borderBottom: "3px dashed rgba(10, 25, 47, 0.1)" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", margin: 0, color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.75rem", fontWeight: 900 }}>
                <div style={{
                  width: "44px", height: "44px", background: "var(--color-white)", border: "2.5px solid var(--color-navy)",
                  borderRadius: "var(--radius-brutal-sm)", boxShadow: "3px 3px 0px var(--color-navy)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Filter size={22} color="var(--color-navy)" strokeWidth={2.5} />
                </div>
                {searchQuery ? `${t("dashboard.history.search")}"${searchQuery}"` : t("dashboard.history.transactionList")}
              </h2>
              
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {[
                  { id: "semua", icon: Filter },
                  { id: "pemasukan", icon: TrendingUp },
                  { id: "pengeluaran", icon: TrendingDown }
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setFilter(item.id as any)}
                    className="btn-brutal"
                    style={{ 
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.6rem 1.25rem", 
                      borderRadius: "var(--radius-brutal-sm)", 
                      background: filter === item.id ? "var(--color-navy)" : "var(--color-white)",
                      color: filter === item.id ? "var(--color-white)" : "var(--color-navy)",
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      border: "2px solid var(--color-navy)",
                      boxShadow: filter === item.id ? "4px 4px 0px var(--color-purple)" : "4px 4px 0px var(--color-navy)",
                      cursor: "pointer",
                      textTransform: "capitalize",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <item.icon size={18} color={filter === item.id ? "var(--color-white)" : "var(--color-navy)"} strokeWidth={2.5} />
                    {t(`dashboard.history.${item.id === "semua" ? "all" : item.id === "pemasukan" ? "income" : "expense"}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction List */}
            <div className="stagger-children" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="card-brutal"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem 1.5rem",
                      background: "var(--color-white)",
                      border: "3px solid var(--color-navy)",
                      boxShadow: "4px 4px 0px var(--color-navy)",
                      transition: "transform 0.2s"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "var(--radius-brutal-sm)",
                          border: "2px solid var(--color-navy)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: tx.type === "pemasukan" ? "var(--color-lime)" : "var(--color-orange)",
                          boxShadow: "2px 2px 0px var(--color-navy)",
                        }}
                      >
                        {tx.type === "pemasukan" ? <Wallet size={20} color="var(--color-navy)" /> : <ShieldAlert size={20} color="var(--color-navy)" />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "1.0625rem", color: "var(--color-navy)" }}>
                          {tx.desc}
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", display: "flex", gap: "0.5rem", alignItems: "center", fontWeight: 600 }}>
                          <span>{tx.date}</span>
                          <span style={{ opacity: 0.3 }}>•</span>
                          <span style={{ color: "var(--color-purple)" }}>{translateCategoryName(tx.category, t)}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 900,
                        fontSize: "1.25rem",
                        color: tx.type === "pemasukan" ? "var(--color-navy)" : "var(--color-danger)",
                      }}
                    >
                      {tx.type === "pemasukan" ? "+" : "-"}Rp {Math.abs(tx.amount).toLocaleString("id-ID")}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "3rem", textAlign: "center", border: "3px dashed var(--color-navy)", borderRadius: "var(--radius-brutal)", color: "var(--color-text-muted)", fontWeight: 700 }}>
                  {searchQuery ? `${t("dashboard.history.noSearchData")} "${searchQuery}".` : t("dashboard.history.noData")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info (Right) */}
        <div style={{ flex: "1 1 25%", minWidth: "280px" }}>
          <div className="card-brutal" style={{ padding: "1.5rem", background: "var(--color-white)", height: "100%", minHeight: "60vh", display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", fontWeight: 900 }}>
              <div style={{
                width: "40px", height: "40px", background: "var(--color-purple)", border: "2.5px solid var(--color-navy)",
                borderRadius: "var(--radius-brutal-sm)", boxShadow: "3px 3px 0px var(--color-navy)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <TrendingUp size={20} color="var(--color-white)" strokeWidth={2.5} />
              </div>
              {t("dashboard.history.topCategories")}
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {topCategories.length > 0 ? topCategories.map((cat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: cat.color, border: "2px solid var(--color-navy)" }}></div>
                    <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-navy)" }}>{translateCategoryName(cat.name, t)}</span>
                  </div>
                  <span style={{ fontWeight: 800, color: "var(--color-text-muted)" }}>{cat.count}</span>
                </div>
              )) : (
                <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                  {t("dashboard.history.noExpenseData")}
                </div>
              )}
            </div>

            <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
              <div style={{ padding: "1.25rem", background: "var(--color-bg)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)" }}>
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", fontWeight: 900 }}>{t("dashboard.history.aiInsight")}</h4>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.4, fontWeight: 500 }}>
                  {t("dashboard.history.mockInsight")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
