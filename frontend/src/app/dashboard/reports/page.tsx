"use client";

import { useState } from "react";
import {
  FileText, Download, Mail, Calendar,
  TrendingUp, TrendingDown, Wallet, PieChart,
  Filter, BarChart3, ArrowRight, FileSpreadsheet,
  Banknote, Target, Lightbulb
} from "lucide-react";

import { useTransactions } from "@/context/TransactionContext";
import { useLanguage } from "@/context/LanguageContext";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const CATEGORY_COLORS: Record<string, string> = {
  "Makanan & Minuman": "orange",
  "Transportasi": "purple",
  "Belanja": "lime",
  "Hiburan": "pink",
  "Kesehatan": "purple",
  "Lainnya": "orange",
  "default": "lime"
};

export default function ReportsPage() {
  const { transactions } = useTransactions();
  const { t, language } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());

  const formatRupiah = (num: number) => `Rp ${num.toLocaleString("id-ID")}`;

  // Filter transactions by selected month and year
  const currentMonthStr = MONTHS[selectedMonth];
  const currentYearStr = selectedYear.toString();
  
  const filteredTransactions = transactions.filter(tx => {
    return tx.date.includes(currentMonthStr) && tx.date.includes(currentYearStr);
  });

  const income = filteredTransactions.filter(tx => tx.type === "pemasukan").reduce((sum, tx) => sum + tx.amount, 0);
  const expense = filteredTransactions.filter(tx => tx.type === "pengeluaran").reduce((sum, tx) => sum + tx.amount, 0);
  const savings = income - expense;
  const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : "0";

  // Category breakdown
  const categoryMap = new Map<string, number>();
  filteredTransactions.filter(tx => tx.type === "pengeluaran").forEach(tx => {
    categoryMap.set(tx.category, (categoryMap.get(tx.category) || 0) + tx.amount);
  });

  const CATEGORY_DATA = Array.from(categoryMap.entries()).map(([name, amount]) => ({
    name,
    amount,
    percentage: expense > 0 ? Math.round((amount / expense) * 100) : 0,
    color: CATEGORY_COLORS[name] || CATEGORY_COLORS["default"]
  })).sort((a, b) => b.amount - a.amount);

  const MONTHLY_SUMMARY = {
    income,
    expense,
    savings,
    savingsRate,
    transactions: filteredTransactions.length,
    topCategory: CATEGORY_DATA.length > 0 ? CATEGORY_DATA[0].name : "None",
  };

  const handleExportExcel = () => {
    const monthName = MONTHS[selectedMonth];
    const headers = ["Kategori", "Jumlah (Rp)", "Persentase (%)"];
    const rows = CATEGORY_DATA.map(c => [c.name, c.amount.toString(), c.percentage.toString()]);

    const summaryRows = [
      [],
      [`Laporan Keuangan — ${monthName} ${selectedYear}`],
      [],
      ["Ringkasan", "Jumlah (Rp)"],
      ["Pemasukan", MONTHLY_SUMMARY.income.toString()],
      ["Pengeluaran", MONTHLY_SUMMARY.expense.toString()],
      ["Tabungan", MONTHLY_SUMMARY.savings.toString()],
      ["Rasio Tabungan", `${MONTHLY_SUMMARY.savingsRate}%`],
      ["Total Transaksi", MONTHLY_SUMMARY.transactions.toString()],
      [],
      ["Detail Pengeluaran per Kategori"],
      headers,
      ...rows,
    ];

    const csvContent = summaryRows.map(row => row.join(",")).join("\n");
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Laporan_CEAMIS_${monthName}_${selectedYear}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ paddingBottom: "3rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{
            width: "72px", height: "72px", background: "var(--color-lime)",
            borderRadius: "var(--radius-brutal-sm)", border: "3px solid var(--color-navy)",
            boxShadow: "4px 4px 0px var(--color-navy)", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <FileText size={40} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", marginBottom: "0.25rem", color: "var(--color-navy)", fontWeight: 800 }}>
              {t("dashboard.reports.title")}
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
              {t("dashboard.reports.desc")}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button className="btn-brutal" style={{
            background: "var(--color-white)", padding: "0.75rem 1.25rem", fontWeight: 800,
            display: "flex", alignItems: "center", gap: "0.5rem",
            boxShadow: "3px 3px 0px var(--color-navy)",
          }}>
            <Download size={16} /> {t("dashboard.reports.exportPdf")}
          </button>
          <button onClick={handleExportExcel} className="btn-brutal" style={{
            background: "var(--color-lime)", padding: "0.75rem 1.25rem", fontWeight: 800,
            display: "flex", alignItems: "center", gap: "0.5rem",
            boxShadow: "3px 3px 0px var(--color-navy)",
          }}>
            <FileSpreadsheet size={16} /> {t("dashboard.reports.exportExcel")}
          </button>
          <button className="btn-brutal" style={{
            background: "var(--color-navy)", color: "var(--color-white)",
            padding: "0.75rem 1.25rem", fontWeight: 800,
            display: "flex", alignItems: "center", gap: "0.5rem",
            boxShadow: "3px 3px 0px var(--color-purple)",
          }}>
            <Mail size={16} /> {t("dashboard.reports.sendEmail")}
          </button>
        </div>
      </div>

      {/* Month Selector */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ 
          display: "flex", 
          overflowX: "auto", 
          border: "3px solid var(--color-navy)", 
          borderRadius: "var(--radius-brutal-sm)", 
          boxShadow: "4px 4px 0px var(--color-navy)",
          background: "var(--color-white)",
          width: "max-content",
          maxWidth: "100%",
          scrollbarWidth: "none", /* Firefox */
          msOverflowStyle: "none",  /* IE and Edge */
        }} className="no-scrollbar">
          {MONTHS.map((month, idx) => (
            <button key={month} onClick={() => setSelectedMonth(idx)} style={{
              padding: "0.75rem 1.25rem", 
              fontSize: "0.85rem", 
              fontWeight: 800,
              background: selectedMonth === idx ? "var(--color-purple)" : "transparent",
              color: selectedMonth === idx ? "var(--color-white)" : "var(--color-navy)",
              border: "none",
              borderRight: idx < MONTHS.length - 1 ? "3px solid var(--color-navy)" : "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              flexShrink: 0,
            }}>
              {t(`dashboard.reports.months.${month}`).slice(0, 3)}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.75rem", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Calendar size={14} /> {t("dashboard.reports.period")}: {t(`dashboard.reports.months.${MONTHS[selectedMonth]}`)} {selectedYear}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }} className="stagger-children">
        <div className="card-brutal" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "var(--radius-brutal-sm)",
              background: "var(--color-lime)", border: "2px solid var(--color-navy)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "2px 2px 0px var(--color-navy)",
            }}>
              <TrendingUp size={20} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-text-muted)" }}>{t("dashboard.reports.income")}</span>
          </div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 800, color: "var(--color-navy)" }}>
            {formatRupiah(MONTHLY_SUMMARY.income)}
          </div>
        </div>

        <div className="card-brutal" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "var(--radius-brutal-sm)",
              background: "var(--color-orange)", border: "2px solid var(--color-navy)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "2px 2px 0px var(--color-navy)",
            }}>
              <TrendingDown size={20} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-text-muted)" }}>{t("dashboard.reports.expense")}</span>
          </div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 800, color: "var(--color-navy)" }}>
            {formatRupiah(MONTHLY_SUMMARY.expense)}
          </div>
        </div>

        <div className="card-brutal" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "var(--radius-brutal-sm)",
              background: "var(--color-purple)", border: "2px solid var(--color-navy)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "2px 2px 0px var(--color-navy)",
            }}>
              <Wallet size={20} color="var(--color-white)" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-text-muted)" }}>{t("dashboard.reports.savings")}</span>
          </div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 800, color: "var(--color-navy)" }}>
            {formatRupiah(MONTHLY_SUMMARY.savings)}
          </div>
          <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-purple)", marginTop: "0.25rem" }}>
            {MONTHLY_SUMMARY.savingsRate}% {t("dashboard.reports.savingsRate")}
          </div>
        </div>

        <div className="card-brutal" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "var(--radius-brutal-sm)",
              background: "var(--color-white)", border: "2px solid var(--color-navy)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "2px 2px 0px var(--color-navy)",
            }}>
              <BarChart3 size={20} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-text-muted)" }}>{t("dashboard.reports.transactions")}</span>
          </div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 800, color: "var(--color-navy)" }}>
            {MONTHLY_SUMMARY.transactions}
          </div>
          <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
            {t("dashboard.reports.totalRecords")}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
        {/* Category Breakdown */}
        <div className="card-brutal" style={{ padding: "2rem" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", margin: "0 0 1.5rem 0", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <PieChart size={22} color="var(--color-purple)" /> {t("dashboard.reports.expenseByCategory")}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {CATEGORY_DATA.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>
                {t("dashboard.reports.noExpense")}
              </div>
            )}
            {CATEGORY_DATA.map((cat) => (
              <div key={cat.name}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{cat.name}</span>
                  <span style={{ fontWeight: 800, fontFamily: "var(--font-heading)", fontSize: "0.9375rem" }}>
                    {formatRupiah(cat.amount)}
                  </span>
                </div>
                <div style={{ width: "100%", height: "16px", background: "var(--color-bg)", border: "2px solid var(--color-navy)", borderRadius: "100px", overflow: "hidden" }}>
                  <div style={{
                    width: `${cat.percentage}%`, height: "100%",
                    background: `var(--color-${cat.color})`, borderRadius: "100px",
                    transition: "width 0.5s ease",
                  }} />
                </div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", marginTop: "0.15rem" }}>
                  {cat.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Preview / Email Preview */}
        <div className="card-brutal" style={{ padding: "2rem", background: "var(--color-navy)", color: "var(--color-white)" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", margin: "0 0 1rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Mail size={22} color="var(--color-lime)" /> {t("dashboard.reports.emailPreviewTitle")}
          </h3>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", marginBottom: "1.5rem" }}>
            {t("dashboard.reports.emailPreviewDesc")}
          </p>

          {/* Email Preview Card */}
          <div style={{
            background: "var(--color-white)", color: "var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
            border: "3px solid var(--color-white)", padding: "1.5rem",
          }}>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>From: noreply@ceamis.id</div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>Subject: {t("dashboard.reports.title")} {t(`dashboard.reports.months.${MONTHS[selectedMonth]}`)} {selectedYear}</div>
            <div style={{ borderTop: "2px dashed var(--color-border-light)", paddingTop: "1rem" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.125rem", fontWeight: 800, marginBottom: "1rem" }}>
                {t("dashboard.reports.summaryTitle")}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}><Banknote size={14} color="var(--color-navy)" /> {t("dashboard.reports.income")}</span>
                  <span style={{ fontWeight: 800 }}>{formatRupiah(MONTHLY_SUMMARY.income)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}><TrendingDown size={14} color="var(--color-navy)" /> {t("dashboard.reports.expense")}</span>
                  <span style={{ fontWeight: 800 }}>{formatRupiah(MONTHLY_SUMMARY.expense)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid var(--color-navy)", paddingTop: "0.5rem", marginTop: "0.25rem" }}>
                  <span style={{ fontWeight: 800, display: "flex", alignItems: "center", gap: "0.35rem" }}><Target size={14} color="var(--color-navy)" /> {t("dashboard.reports.sisa")}</span>
                  <span style={{ fontWeight: 900, color: "var(--color-purple)", fontSize: "1rem" }}>{formatRupiah(MONTHLY_SUMMARY.savings)}</span>
                </div>
              </div>
              <div style={{ marginTop: "1rem", padding: "0.75rem", background: "var(--color-bg)", borderRadius: "var(--radius-brutal-sm)", border: "2px dashed var(--color-navy)", fontSize: "0.8rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.35rem" }}><Lightbulb size={14} color="var(--color-navy)" style={{ flexShrink: 0, marginTop: "2px" }} /><span><strong>Insight:</strong> {CATEGORY_DATA.length > 0 ? `${t("dashboard.reports.insightMsgPrefix")} ${MONTHLY_SUMMARY.topCategory} ${t("dashboard.reports.insightMsgSuffix")} (${CATEGORY_DATA[0]?.percentage}%).` : t("dashboard.reports.insightMsgEmpty")}</span></div>
              </div>
            </div>
          </div>

          <button className="btn-brutal" style={{
            width: "100%", marginTop: "1.5rem", padding: "1rem",
            background: "var(--color-lime)", color: "var(--color-navy)", fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            boxShadow: "4px 4px 0px var(--color-white)",
          }}>
            <Mail size={16} /> {t("dashboard.reports.sendToMyEmail")}
          </button>
        </div>
      </div>
    </div>
  );
}
