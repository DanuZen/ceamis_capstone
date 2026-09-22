"use client";

import { useState, useEffect } from "react";
import { List, ShieldAlert, Wallet, TrendingUp, TrendingDown, Filter, Sparkles, Check, ArrowUpRight, CreditCard } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTransactions } from "@/context/TransactionContext";
import { useLanguage } from "@/context/LanguageContext";
import { translateCategoryName, translateTransactionDesc } from "@/lib/translateCategory";
import PageBanner from "@/components/layout/PageBanner";

export default function HistoryPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [filter, setFilter] = useState<"semua" | "pemasukan" | "pengeluaran">("semua");
  const { transactions } = useTransactions();
  const { t } = useLanguage();

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
        setTimeout(() => setShowTipsBubble(false), 300); // Wait for animation
      };
      window.addEventListener("click", closeBubble);
      return () => window.removeEventListener("click", closeBubble);
    }, 100);
    return () => clearTimeout(timer);
  }, [showTipsBubble, isClosingBubble]);

  // Sync character pose
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("cami-force-open", { detail: showTipsBubble && !isClosingBubble }));
    return () => {
      window.dispatchEvent(new CustomEvent("cami-force-open", { detail: false }));
    };
  }, [showTipsBubble, isClosingBubble]);

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
      {/* Header Banner */}
      <PageBanner
        badgeText="RIWAYAT LENGKAP"
        title="Riwayat Transaksi"
        description="Telusuri seluruh rekam jejak arus kas masuk dan keluar dengan filter waktu & kategori terperinci."
        rightCard={{
          icon: <List size={24} className="text-[#0A192F]" />,
          label: "TOTAL CATATAN",
          value: `${transactions.length} Entri`,
        }}
        className="mb-4"
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Top Row: 4 Stats Cards — same tokens as /dashboard */}
      <div className="dashboard-bento-grid stagger-children" style={{ marginBottom: "1rem" }}>

        {/* Card 1: PEMASUKAN */}
        <div style={{
          background: "#FFFFFF",
          border: "2.5px solid var(--color-navy)",
          borderRadius: "16px",
          boxShadow: "4px 4px 0px var(--color-navy)",
          padding: "1.15rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#475569", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              {t("dashboard.history.income")}
            </span>
            <div style={{ width: "28px", height: "28px", background: "var(--color-lime)", border: "1.5px solid var(--color-navy)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={16} color="var(--color-navy)" strokeWidth={3} />
            </div>
          </div>
          <div style={{ margin: "0.65rem 0" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 900, color: "var(--color-navy)" }}>
              Rp {totalPemasukan.toLocaleString("id-ID")}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: "999px", padding: "2px 8px", fontSize: "0.68rem", fontWeight: 700, color: "var(--color-navy)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <TrendingUp size={13} strokeWidth={2.5} /> Pemasukan
            </span>
            <span style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 600 }}>
              {transactions.filter(tx => tx.type === "pemasukan").length} transaksi
            </span>
          </div>
        </div>

        {/* Card 2: PENGELUARAN */}
        <div style={{
          background: "#FFFFFF",
          border: "2.5px solid var(--color-navy)",
          borderRadius: "16px",
          boxShadow: "4px 4px 0px var(--color-navy)",
          padding: "1.15rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#475569", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              {t("dashboard.history.expense")}
            </span>
            <div style={{ width: "28px", height: "28px", background: "#FFE100", border: "1.5px solid var(--color-navy)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowUpRight size={16} color="var(--color-navy)" strokeWidth={3} />
            </div>
          </div>
          <div style={{ margin: "0.65rem 0" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 900, color: "var(--color-navy)" }}>
              Rp {totalPengeluaran.toLocaleString("id-ID")}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.72rem", color: "#475569", fontWeight: 700 }}>
              {totalPemasukan > 0 ? Math.round((totalPengeluaran / totalPemasukan) * 100) : 0}% dari pemasukan
            </span>
            <span style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 600 }}>
              {transactions.filter(tx => tx.type === "pengeluaran").length} pos belanja
            </span>
          </div>
        </div>

        {/* Card 3: SISA SALDO */}
        <div style={{
          background: "#FFFFFF",
          border: "2.5px solid var(--color-navy)",
          borderRadius: "16px",
          boxShadow: "4px 4px 0px var(--color-navy)",
          padding: "1.15rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#475569", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              {t("dashboard.history.balance")}
            </span>
            <div style={{ width: "28px", height: "28px", background: "#E0F2FE", border: "1.5px solid var(--color-navy)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CreditCard size={16} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ margin: "0.65rem 0" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 900, color: sisaSaldo >= 0 ? "var(--color-navy)" : "var(--color-danger)" }}>
              Rp {sisaSaldo.toLocaleString("id-ID")}
            </span>
          </div>
          <div>
            <div style={{ width: "100%", height: "7px", background: "#E2E8F0", borderRadius: "999px", border: "1.5px solid var(--color-navy)", overflow: "hidden", marginBottom: "0.35rem" }}>
              <div style={{ width: `${totalPemasukan > 0 ? Math.min(100, Math.round((sisaSaldo / totalPemasukan) * 100)) : 0}%`, height: "100%", background: sisaSaldo >= 0 ? "var(--color-lime)" : "var(--color-danger)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.72rem", color: "#475569", fontWeight: 700 }}>
                {totalPemasukan > 0 ? Math.min(100, Math.round((sisaSaldo / totalPemasukan) * 100)) : 0}% Tersedia
              </span>
              <span style={{ fontSize: "0.72rem", color: "#475569", fontWeight: 700 }}>
                {sisaSaldo >= 0 ? "Saldo Aman" : "Melebihi"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: TOTAL TRANSAKSI */}
        <div style={{
          background: "#FFFFFF",
          border: "2.5px solid var(--color-navy)",
          borderRadius: "16px",
          boxShadow: "4px 4px 0px var(--color-navy)",
          padding: "1.15rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#475569", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              {t("dashboard.history.totalMonth")}
            </span>
            <div style={{ width: "28px", height: "28px", background: "#DBEAFE", border: "1.5px solid var(--color-navy)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <List size={16} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ margin: "0.65rem 0" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 900, color: "var(--color-navy)" }}>
              {transactions.length} Trx
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ background: sisaSaldo >= 0 ? "var(--color-lime)" : "#FEE2E2", border: "1.5px solid var(--color-navy)", borderRadius: "6px", padding: "2px 7px", fontSize: "0.65rem", fontWeight: 900, color: "var(--color-navy)", letterSpacing: "0.3px" }}>
              {topCategories[0] ? `TOP: ${topCategories[0].name.toUpperCase()}` : "BELUM ADA DATA"}
            </span>
            <span style={{ fontSize: "0.72rem", color: sisaSaldo >= 0 ? "#16A34A" : "#DC2626", fontWeight: 800 }}>
              {sisaSaldo >= 0 ? "Terkendali" : "Perlu Hemat"}
            </span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
        {/* Main List Area (Left) */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="card-brutal" style={{ background: "var(--color-white)", border: "2.5px solid var(--color-navy)", borderRadius: "16px", padding: "1.25rem 1.5rem", boxShadow: "4px 4px 0px var(--color-navy)", minHeight: "520px", height: "100%", flex: 1, display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
            
            {/* Header List & Filters */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.1rem", flexWrap: "wrap", gap: "0.5rem", paddingBottom: "0.85rem", borderBottom: "2px dashed rgba(10, 25, 47, 0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{
                  width: "34px", height: "34px", background: "var(--color-white)", border: "2px solid var(--color-navy)",
                  borderRadius: "8px", boxShadow: "2px 2px 0px var(--color-navy)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Filter size={16} color="var(--color-navy)" strokeWidth={2.5} />
                </div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", margin: 0, color: "var(--color-navy)", fontWeight: 900 }}>
                  {searchQuery ? `${t("dashboard.history.search")}"${searchQuery}"` : t("dashboard.history.transactionList")}
                </h2>
              </div>
              
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
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
                      gap: "0.3rem",
                      padding: "0.35rem 0.75rem", 
                      borderRadius: "8px", 
                      background: filter === item.id ? "var(--color-navy)" : "var(--color-white)",
                      color: filter === item.id ? "var(--color-white)" : "var(--color-navy)",
                      fontWeight: 800,
                      fontSize: "0.78rem",
                      border: "2px solid var(--color-navy)",
                      boxShadow: filter === item.id ? "2px 2px 0px var(--color-purple)" : "2px 2px 0px var(--color-navy)",
                      cursor: "pointer",
                      textTransform: "capitalize",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <item.icon size={13} color={filter === item.id ? "var(--color-white)" : "var(--color-navy)"} strokeWidth={2.5} />
                    {t(`dashboard.history.${item.id === "semua" ? "all" : item.id === "pemasukan" ? "income" : "expense"}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction List */}
            <div className="stagger-children no-scrollbar" style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1, overflowY: "auto", paddingRight: "0.5rem" }}>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="card-brutal"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem 1rem",
                      background: "var(--color-white)",
                      border: "2px solid var(--color-navy)",
                      borderRadius: "12px",
                      boxShadow: "2px 2px 0px var(--color-navy)",
                      transition: "transform 0.15s"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "8px",
                          border: "1.5px solid var(--color-navy)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: tx.type === "pemasukan" ? "var(--color-lime)" : "var(--color-orange)",
                          boxShadow: "1.5px 1.5px 0px var(--color-navy)",
                          flexShrink: 0
                        }}
                      >
                        {tx.type === "pemasukan" ? <Wallet size={16} color="var(--color-navy)" /> : <ShieldAlert size={16} color="var(--color-navy)" />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--color-navy)", lineHeight: 1.2 }}>
                          {translateTransactionDesc(tx.desc || tx.description || "", t)}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", display: "flex", gap: "0.4rem", alignItems: "center", fontWeight: 600, marginTop: "2px" }}>
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
                        fontSize: "1rem",
                        color: tx.type === "pemasukan" ? "var(--color-navy)" : "var(--color-danger)",
                        whiteSpace: "nowrap"
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
        <div className="lg:col-span-4 flex flex-col">
          <div className="card-brutal" style={{ padding: "1.25rem 1.5rem", background: "var(--color-white)", minHeight: "520px", height: "100%", flex: 1, display: "flex", flexDirection: "column", border: "2.5px solid var(--color-navy)", borderRadius: "16px", boxShadow: "4px 4px 0px var(--color-navy)", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{
                  width: "34px", height: "34px", background: "var(--color-purple)", border: "2px solid var(--color-navy)",
                  borderRadius: "8px", boxShadow: "2px 2px 0px var(--color-navy)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <TrendingUp size={16} color="var(--color-white)" strokeWidth={2.5} />
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", margin: 0, color: "var(--color-navy)", fontWeight: 900 }}>
                  {t("dashboard.history.topCategories")}
                </h3>
              </div>
            </div>
            
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
              {/* Insight box removed, replaced by CAMI bubble */}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* CAMI Tips Bubble Overlay */}
      {showTipsBubble && (
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
                  <Sparkles size={14} color="#1d4ed8" /> {t("dashboard.history.aiInsight")}
                </div>
              </div>
              <p style={{ fontSize: "0.95rem", color: "var(--color-navy)", margin: 0, lineHeight: 1.5, fontWeight: 700 }}>
                "{t("dashboard.history.mockInsight").replace(/^"|"$/g, '')}"
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
