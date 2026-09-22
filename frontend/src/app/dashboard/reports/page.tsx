"use client";

import { useState, useEffect } from "react";
import {
  FileText, Download, Mail, Calendar,
  TrendingUp, TrendingDown, Wallet, PieChart,
  Filter, BarChart3, ArrowRight, FileSpreadsheet,
  Banknote, Target, Lightbulb, Loader2, Sparkles,
  Check, ArrowUpRight
} from "lucide-react";
import * as XLSX from "xlsx-js-style";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useTransactions } from "@/context/TransactionContext";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { translateCategoryName } from "@/lib/translateCategory";
import { useToast } from "@/components/ui/Toast";
import PageBanner from "@/components/layout/PageBanner";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const CATEGORY_COLORS: Record<string, string> = {
  "Makanan & Minuman": "red",
  "Transportasi": "blue",
  "Belanja": "yellow",
  "Hiburan": "lime",
  "Kesehatan": "red",
  "Lainnya": "blue",
  "default": "lime"
};

export default function ReportsPage() {
  const { showToast } = useToast();
  const { transactions } = useTransactions();
  const { userData } = useUser();
  const { t, language } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [categoryTab, setCategoryTab] = useState<"expense" | "income">("expense");

  const formatRupiah = (num: number) => `Rp ${num.toLocaleString("id-ID")}`;

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

  // Filter transactions by selected month and year
  const currentMonthStr = MONTHS[selectedMonth];
  const currentYearStr = selectedYear.toString();
  
  const filteredTransactions = transactions.filter(tx => {
    const d = new Date(tx.created_at);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const income = filteredTransactions.filter(tx => tx.type === "pemasukan").reduce((sum, tx) => sum + tx.amount, 0);
  const expense = filteredTransactions.filter(tx => tx.type === "pengeluaran").reduce((sum, tx) => sum + tx.amount, 0);
  const savings = income - expense;
  const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : "0";

  // Category breakdown
  const categoryMap = new Map<string, number>();
  const categoryColors = ["lime", "blue", "yellow", "red"];
  
  filteredTransactions.filter(tx => tx.type === "pengeluaran").forEach(tx => {
    const translatedName = translateCategoryName(tx.category, t);
    categoryMap.set(translatedName, (categoryMap.get(translatedName) || 0) + tx.amount);
  });

  const CATEGORY_DATA = Array.from(categoryMap.entries()).map(([name, amount], index) => ({
    name,
    amount,
    percentage: expense > 0 ? Math.round((amount / expense) * 100) : 0,
    color: CATEGORY_COLORS[name] || categoryColors[index % categoryColors.length]
  })).sort((a, b) => b.amount - a.amount);

  // Income category breakdown
  const incomeCategoryMap = new Map<string, number>();
  filteredTransactions.filter(tx => tx.type === "pemasukan").forEach(tx => {
    const translatedName = translateCategoryName(tx.category, t);
    incomeCategoryMap.set(translatedName, (incomeCategoryMap.get(translatedName) || 0) + tx.amount);
  });

  const INCOME_CATEGORY_DATA = Array.from(incomeCategoryMap.entries()).map(([name, amount], index) => ({
    name,
    amount,
    percentage: income > 0 ? Math.round((amount / income) * 100) : 0,
    color: CATEGORY_COLORS[name] || categoryColors[index % categoryColors.length]
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
    
    const ws: any = {};
    const range = { s: { c: 0, r: 0 }, e: { c: 2, r: 0 } };

    const addCell = (r: number, c: number, value: any, style: any = {}) => {
      const cellRef = XLSX.utils.encode_cell({ c, r });
      ws[cellRef] = { v: value, t: typeof value === "number" ? "n" : "s", s: style };
      if (c > range.e.c) range.e.c = c;
      if (r > range.e.r) range.e.r = r;
    };

    // Styles
    const titleStyle = { font: { bold: true, sz: 14, color: { rgb: "0F172A" } } };
    const subtitleStyle = { font: { bold: true, sz: 12, color: { rgb: "475569" } } };
    const headerStyle = { 
      font: { bold: true, color: { rgb: "FFFFFF" } }, 
      fill: { fgColor: { rgb: "0F172A" } }, // Navy
      alignment: { horizontal: "center", vertical: "center" },
      border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
    };
    const rowStyle = { 
      border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
    };
    const numStyle = { 
      ...rowStyle, 
      numFmt: '"Rp"#,##0', 
      alignment: { horizontal: "right" }
    };

    let rowIdx = 0;
    
    addCell(rowIdx, 0, "LAPORAN KEUANGAN CEAMIS", titleStyle); rowIdx++;
    addCell(rowIdx, 0, `Periode: ${monthName} ${selectedYear}`, subtitleStyle); rowIdx += 2;
    
    // SUMMARY
    addCell(rowIdx, 0, "RINGKASAN", titleStyle); rowIdx++;
    addCell(rowIdx, 0, "Total Pemasukan", headerStyle);
    addCell(rowIdx, 1, "Total Pengeluaran", headerStyle);
    addCell(rowIdx, 2, "Sisa Tabungan", headerStyle);
    rowIdx++;
    addCell(rowIdx, 0, MONTHLY_SUMMARY.income, numStyle);
    addCell(rowIdx, 1, MONTHLY_SUMMARY.expense, numStyle);
    addCell(rowIdx, 2, MONTHLY_SUMMARY.savings, numStyle);
    rowIdx += 2;

    addCell(rowIdx, 0, "Rasio Tabungan", rowStyle);
    addCell(rowIdx, 1, `${MONTHLY_SUMMARY.savingsRate}%`, { ...rowStyle, alignment: { horizontal: "right" } }); rowIdx++;
    addCell(rowIdx, 0, "Total Transaksi", rowStyle);
    addCell(rowIdx, 1, MONTHLY_SUMMARY.transactions, { ...rowStyle, alignment: { horizontal: "right" } }); rowIdx += 2;

    // INCOME DETAILS
    addCell(rowIdx, 0, "DETAIL PEMASUKAN PER KATEGORI", titleStyle); rowIdx++;
    addCell(rowIdx, 0, "Kategori", headerStyle);
    addCell(rowIdx, 1, "Jumlah (Rp)", headerStyle);
    addCell(rowIdx, 2, "Persentase (%)", headerStyle);
    rowIdx++;
    
    INCOME_CATEGORY_DATA.forEach(cat => {
      addCell(rowIdx, 0, cat.name, rowStyle);
      addCell(rowIdx, 1, cat.amount, numStyle);
      addCell(rowIdx, 2, `${cat.percentage}%`, { ...rowStyle, alignment: { horizontal: "center" } });
      rowIdx++;
    });
    rowIdx++;

    // EXPENSE DETAILS
    addCell(rowIdx, 0, "DETAIL PENGELUARAN PER KATEGORI", titleStyle); rowIdx++;
    
    addCell(rowIdx, 0, "Kategori", headerStyle);
    addCell(rowIdx, 1, "Jumlah (Rp)", headerStyle);
    addCell(rowIdx, 2, "Persentase (%)", headerStyle);
    rowIdx++;
    
    CATEGORY_DATA.forEach(cat => {
      addCell(rowIdx, 0, cat.name, rowStyle);
      addCell(rowIdx, 1, cat.amount, numStyle);
      addCell(rowIdx, 2, `${cat.percentage}%`, { ...rowStyle, alignment: { horizontal: "center" } });
      rowIdx++;
    });

    ws["!ref"] = XLSX.utils.encode_range(range);
    ws["!cols"] = [ { wch: 35 }, { wch: 25 }, { wch: 15 } ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, `Laporan_CEAMIS_${monthName}_${selectedYear}.xlsx`);
  };

  const handleExportPdf = () => {
    const monthName = MONTHS[selectedMonth];
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // Navy
    doc.setFont("helvetica", "bold");
    doc.text("Laporan Keuangan CEAMIS", 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105); // Slate
    doc.setFont("helvetica", "normal");
    doc.text(`Periode: ${monthName} ${selectedYear}`, 14, 30);
    
    // Summary
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text("Ringkasan", 14, 45);
    
    autoTable(doc, {
      startY: 50,
      head: [["Deskripsi", "Jumlah"]],
      body: [
        ["Total Pemasukan", formatRupiah(MONTHLY_SUMMARY.income)],
        ["Total Pengeluaran", formatRupiah(MONTHLY_SUMMARY.expense)],
        ["Sisa Tabungan", formatRupiah(MONTHLY_SUMMARY.savings)],
        ["Rasio Tabungan", `${MONTHLY_SUMMARY.savingsRate}%`],
        ["Total Transaksi", MONTHLY_SUMMARY.transactions.toString()]
      ],
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold" },
      theme: "grid"
    });
    
    // Income Details
    let finalY = (doc as any).lastAutoTable.finalY || 50;
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text("Detail Pemasukan per Kategori", 14, finalY + 15);
    
    autoTable(doc, {
      startY: finalY + 20,
      head: [["Kategori", "Jumlah (Rp)", "Persentase (%)"]],
      body: INCOME_CATEGORY_DATA.map(c => [c.name, formatRupiah(c.amount), `${c.percentage}%`]),
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold" },
      theme: "grid"
    });

    // Expense Details
    finalY = (doc as any).lastAutoTable.finalY || 50;
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text("Detail Pengeluaran per Kategori", 14, finalY + 15);
    
    autoTable(doc, {
      startY: finalY + 20,
      head: [["Kategori", "Jumlah (Rp)", "Persentase (%)"]],
      body: CATEGORY_DATA.map(c => [c.name, formatRupiah(c.amount), `${c.percentage}%`]),
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold" },
      theme: "grid"
    });
    
    doc.save(`Laporan_CEAMIS_${monthName}_${selectedYear}.pdf`);
  };

  return (
    <div style={{ paddingBottom: "3rem" }}>
      {/* Header Banner */}
      <PageBanner
        badgeText="LAPORAN ANALITIK"
        title="Laporan & Ekspor Keuangan"
        description="Analisis mendalam performa keuangan bulanan, visualisasi kategori pengeluaran, dan unduh laporan PDF resmi."
        rightCard={{
          icon: <FileText size={24} className="text-[#0A192F]" />,
          label: "PERIODE LAPORAN",
          value: `${MONTHS[selectedMonth]} ${selectedYear}`,
        }}
        className="mb-4"
      />

      {/* Summary Cards */}
      <div className="dashboard-bento-grid stagger-children" style={{ marginBottom: "1.5rem" }}>
        {/* Card 1: Pemasukan */}
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
              {t("dashboard.reports.income")}
            </span>
            <div style={{ width: "28px", height: "28px", background: "var(--color-lime)", border: "1.5px solid var(--color-navy)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={16} color="var(--color-navy)" strokeWidth={3} />
            </div>
          </div>
          <div style={{ margin: "0.65rem 0" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 900, color: "var(--color-navy)" }}>
              {formatRupiah(MONTHLY_SUMMARY.income)}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: "999px", padding: "2px 8px", fontSize: "0.68rem", fontWeight: 700, color: "var(--color-navy)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <TrendingUp size={13} strokeWidth={2.5} /> {MONTHS[selectedMonth]}
            </span>
            <span style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 600 }}>
              {filteredTransactions.filter(tx => tx.type === "pemasukan").length} transaksi
            </span>
          </div>
        </div>

        {/* Card 2: Pengeluaran */}
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
              {t("dashboard.reports.expense")}
            </span>
            <div style={{ width: "28px", height: "28px", background: "#FFE100", border: "1.5px solid var(--color-navy)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowUpRight size={16} color="var(--color-navy)" strokeWidth={3} />
            </div>
          </div>
          <div style={{ margin: "0.65rem 0" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 900, color: "var(--color-navy)" }}>
              {formatRupiah(MONTHLY_SUMMARY.expense)}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.72rem", color: "#475569", fontWeight: 700 }}>
              {MONTHLY_SUMMARY.income > 0 ? Math.round((MONTHLY_SUMMARY.expense / MONTHLY_SUMMARY.income) * 100) : 0}% beban rasio
            </span>
            <span style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 600 }}>
              {filteredTransactions.filter(tx => tx.type === "pengeluaran").length} pos belanja
            </span>
          </div>
        </div>

        {/* Card 3: Tabungan / Surplus */}
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
              {t("dashboard.reports.savings")}
            </span>
            <div style={{ width: "28px", height: "28px", background: "#E0F2FE", border: "1.5px solid var(--color-navy)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Wallet size={16} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ margin: "0.65rem 0" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 900, color: MONTHLY_SUMMARY.savings >= 0 ? "var(--color-navy)" : "var(--color-danger)" }}>
              {formatRupiah(MONTHLY_SUMMARY.savings)}
            </span>
          </div>
          <div>
            <div style={{ width: "100%", height: "7px", background: "#E2E8F0", borderRadius: "999px", border: "1.5px solid var(--color-navy)", overflow: "hidden", marginBottom: "0.35rem" }}>
              <div style={{ width: `${Math.min(100, Math.max(0, parseFloat(MONTHLY_SUMMARY.savingsRate)))}%`, height: "100%", background: MONTHLY_SUMMARY.savings >= 0 ? "var(--color-lime)" : "var(--color-danger)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.72rem", color: "#475569", fontWeight: 700 }}>
                Rasio: {MONTHLY_SUMMARY.savingsRate}%
              </span>
              <span style={{ fontSize: "0.72rem", color: MONTHLY_SUMMARY.savings >= 0 ? "#16A34A" : "#DC2626", fontWeight: 700 }}>
                {MONTHLY_SUMMARY.savings >= 0 ? "Surplus Aman" : "Defisit"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Transaksi */}
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
              {t("dashboard.reports.totalRecords")}
            </span>
            <div style={{ width: "28px", height: "28px", background: "#DBEAFE", border: "1.5px solid var(--color-navy)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BarChart3 size={16} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ margin: "0.65rem 0" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 900, color: "var(--color-navy)" }}>
              {MONTHLY_SUMMARY.transactions} Trx
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ background: "var(--color-lime)", border: "1.5px solid var(--color-navy)", borderRadius: "6px", padding: "2px 7px", fontSize: "0.65rem", fontWeight: 900, color: "var(--color-navy)", letterSpacing: "0.3px" }}>
              {MONTHLY_SUMMARY.topCategory !== "None" ? `TOP: ${MONTHLY_SUMMARY.topCategory.toUpperCase()}` : "BELUM ADA"}
            </span>
            <span style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 600 }}>
              {currentYearStr}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
        {/* ── CARD BESAR 1: Breakdown Kategori Keuangan (6 cols) ── */}
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
            minHeight: "540px",
          }}
          className="lg:col-span-6"
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {/* Header Card 1 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div 
                  style={{
                    width: "34px",
                    height: "34px",
                    background: categoryTab === "expense" ? "var(--color-orange)" : "var(--color-lime)",
                    border: "2px solid var(--color-navy)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "2px 2px 0px var(--color-navy)",
                    flexShrink: 0
                  }}
                >
                  <PieChart size={17} color={categoryTab === "expense" ? "#FFFFFF" : "var(--color-navy)"} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 900, color: "var(--color-navy)", margin: 0, lineHeight: 1.2 }}>
                    {categoryTab === "expense" ? t("dashboard.reports.expenseByCategory") : (t("dashboard.reports.incomeByCategory") || "Pemasukan per Kategori")}
                  </h3>
                  <p style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 600, margin: "2px 0 0 0" }}>
                    {categoryTab === "expense" ? "Sebaran alokasi pengeluaran bulanan" : "Sumber dan aliran dana masuk"}
                  </p>
                </div>
              </div>

              {/* Filter Tabs */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <button
                  type="button"
                  onClick={() => setCategoryTab("expense")}
                  style={{
                    background: categoryTab === "expense" ? "var(--color-navy)" : "#F8FAFC",
                    color: categoryTab === "expense" ? "#FFFFFF" : "var(--color-navy)",
                    border: "1.5px solid var(--color-navy)",
                    boxShadow: categoryTab === "expense" ? "2px 2px 0px var(--color-purple)" : "2px 2px 0px var(--color-navy)",
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
                  <TrendingDown size={12} />
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryTab("income")}
                  style={{
                    background: categoryTab === "income" ? "var(--color-navy)" : "#F8FAFC",
                    color: categoryTab === "income" ? "var(--color-lime)" : "var(--color-navy)",
                    border: "1.5px solid var(--color-navy)",
                    boxShadow: categoryTab === "income" ? "2px 2px 0px var(--color-purple)" : "2px 2px 0px var(--color-navy)",
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
                  <Banknote size={12} />
                  Pemasukan
                </button>
              </div>
            </div>

            {/* Category Data List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", flex: 1, minHeight: 0, overflowY: "auto", paddingRight: "0.4rem" }} className="no-scrollbar">
              {categoryTab === "expense" ? (
                CATEGORY_DATA.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>
                    {t("dashboard.reports.noExpense")}
                  </div>
                ) : (
                  CATEGORY_DATA.map((cat) => (
                    <div key={cat.name} style={{ background: "#F8FAFC", border: "1.5px solid var(--color-navy)", borderRadius: "10px", padding: "0.65rem 0.85rem", boxShadow: "2px 2px 0px var(--color-navy)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.875rem", color: "var(--color-navy)" }}>{cat.name}</span>
                        <span style={{ fontWeight: 900, fontFamily: "var(--font-heading)", fontSize: "0.875rem", color: "var(--color-navy)" }}>
                          {formatRupiah(cat.amount)}
                        </span>
                      </div>
                      <div style={{ width: "100%", height: "12px", background: "#E2E8F0", border: "1.5px solid var(--color-navy)", borderRadius: "100px", overflow: "hidden" }}>
                        <div style={{
                          width: `${cat.percentage}%`, height: "100%",
                          background: `var(--color-${cat.color})`, borderRadius: "100px",
                          transition: "width 0.5s ease",
                        }} />
                      </div>
                      <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--color-text-muted)", marginTop: "0.2rem" }}>
                        {cat.percentage}% dari total pengeluaran
                      </div>
                    </div>
                  ))
                )
              ) : (
                INCOME_CATEGORY_DATA.length === 0 ? (
                  <div style={{ color: "var(--color-navy)", opacity: 0.7, textAlign: "center", margin: "auto", fontSize: "0.95rem" }}>
                    {t("dashboard.reports.noIncome") || "Belum ada pemasukan di bulan ini."}
                  </div>
                ) : (
                  INCOME_CATEGORY_DATA.map((cat) => (
                    <div key={cat.name} style={{ background: "#F8FAFC", border: "1.5px solid var(--color-navy)", borderRadius: "10px", padding: "0.65rem 0.85rem", boxShadow: "2px 2px 0px var(--color-navy)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                        <span style={{ fontWeight: 800, fontSize: "0.875rem", color: "var(--color-navy)" }}>{cat.name}</span>
                        <span style={{ fontWeight: 900, fontFamily: "var(--font-heading)", fontSize: "0.875rem", color: "var(--color-navy)" }}>
                          {formatRupiah(cat.amount)}
                        </span>
                      </div>
                      <div style={{ width: "100%", height: "12px", background: "#E2E8F0", border: "1.5px solid var(--color-navy)", borderRadius: "100px", overflow: "hidden" }}>
                        <div style={{
                          width: `${cat.percentage}%`, height: "100%",
                          background: `var(--color-${cat.color})`, borderRadius: "100px",
                          transition: "width 0.5s ease",
                        }} />
                      </div>
                      <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--color-text-muted)", marginTop: "0.2rem" }}>
                        {cat.percentage}% dari total pemasukan
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
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
                <BarChart3 size={13} color="var(--color-navy)" strokeWidth={2.5} />
              </div>
              <div className="text-[11px] leading-tight">
                <span className="font-black text-[#0A192F]">Distribusi Pos Anggaran: </span>
                <span className="text-gray-700 font-medium">
                  Pengeluaran diklasifikasikan otomatis untuk mendeteksi deviasi anggaran bulanan secara akurat.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── CARD BESAR 2: Ringkasan & Ekspor Laporan (6 cols) ── */}
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
            minHeight: "540px",
          }}
          className="lg:col-span-6"
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
            {/* Header Card 2 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
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
                  <Calendar size={17} color="#FFFFFF" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 900, color: "var(--color-navy)", margin: 0, lineHeight: 1.2 }}>
                    {t("dashboard.reports.summaryTitle")}
                  </h3>
                  <p style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 600, margin: "2px 0 0 0" }}>
                    Rekapitulasi total kas & ekspor dokumen
                  </p>
                </div>
              </div>

              {/* Month & Year Selectors */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                {/* Month Dropdown */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => { setIsMonthDropdownOpen(p => !p); setIsYearDropdownOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.3rem",
                      padding: "0.3rem 0.6rem", fontFamily: "var(--font-heading)", fontWeight: 900,
                      fontSize: "0.72rem", background: "var(--color-lime)", color: "var(--color-navy)",
                      border: "1.5px solid var(--color-navy)", borderRadius: "6px",
                      boxShadow: "2px 2px 0px var(--color-navy)", cursor: "pointer",
                    }}
                  >
                    {t(`dashboard.reports.months.${MONTHS[selectedMonth]}`).slice(0, 3).toUpperCase()}
                    <span style={{ fontSize: "0.5rem" }}>▼</span>
                  </button>
                  {isMonthDropdownOpen && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 200,
                      background: "var(--color-white)", border: "2px solid var(--color-navy)",
                      borderRadius: "8px", boxShadow: "4px 4px 0px var(--color-navy)",
                      overflow: "hidden", minWidth: "120px"
                    }}>
                      {MONTHS.map((month, idx) => (
                        <button key={month} onClick={() => { setSelectedMonth(idx); setIsMonthDropdownOpen(false); }}
                          style={{
                            display: "block", width: "100%", padding: "0.4rem 0.8rem",
                            fontSize: "0.75rem", fontWeight: 800,
                            background: selectedMonth === idx ? "var(--color-navy)" : "var(--color-white)",
                            color: selectedMonth === idx ? "var(--color-white)" : "var(--color-navy)",
                            border: "none", borderBottom: "1px solid #E2E8F0",
                            cursor: "pointer", textAlign: "left"
                          }}
                        >
                          {t(`dashboard.reports.months.${month}`)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Year Dropdown */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => { setIsYearDropdownOpen(p => !p); setIsMonthDropdownOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.3rem",
                      padding: "0.3rem 0.6rem", fontFamily: "var(--font-heading)", fontWeight: 900,
                      fontSize: "0.72rem", background: "#F1F5F9", color: "var(--color-navy)",
                      border: "1.5px solid var(--color-navy)", borderRadius: "6px",
                      boxShadow: "2px 2px 0px var(--color-navy)", cursor: "pointer",
                    }}
                  >
                    {selectedYear}
                    <span style={{ fontSize: "0.5rem" }}>▼</span>
                  </button>
                  {isYearDropdownOpen && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 200,
                      background: "var(--color-white)", border: "2px solid var(--color-navy)",
                      borderRadius: "8px", boxShadow: "4px 4px 0px var(--color-navy)",
                      overflow: "hidden", minWidth: "90px"
                    }}>
                      {[new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2].map(yr => (
                        <button key={yr} onClick={() => { setSelectedYear(yr); setIsYearDropdownOpen(false); }}
                          style={{
                            display: "block", width: "100%", padding: "0.4rem 0.8rem",
                            fontSize: "0.75rem", fontWeight: 800,
                            background: selectedYear === yr ? "var(--color-purple)" : "var(--color-white)",
                            color: selectedYear === yr ? "var(--color-white)" : "var(--color-navy)",
                            border: "none", borderBottom: "1px solid #E2E8F0",
                            cursor: "pointer", textAlign: "left"
                          }}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Breakdown Metrics */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "0.5rem 0" }}>
              {/* Income row */}
              <div style={{ background: "#F0FDF4", border: "2px solid var(--color-navy)", borderRadius: "10px", padding: "0.75rem 1rem", boxShadow: "2px 2px 0px var(--color-navy)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#16A34A", fontWeight: 900, textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                    <Banknote size={13} /> {t("dashboard.reports.income")}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 700 }}>Dana Masuk</span>
                </div>
                <div style={{ fontWeight: 900, color: "var(--color-navy)", fontSize: "1.25rem", fontFamily: "var(--font-heading)" }}>
                  {formatRupiah(MONTHLY_SUMMARY.income)}
                </div>
              </div>

              {/* Expense row */}
              <div style={{ background: "#FFF7ED", border: "2px solid var(--color-navy)", borderRadius: "10px", padding: "0.75rem 1rem", boxShadow: "2px 2px 0px var(--color-navy)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#EA580C", fontWeight: 900, textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                    <TrendingDown size={13} /> {t("dashboard.reports.expense")}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 700 }}>Total Realisasi</span>
                </div>
                <div style={{ fontWeight: 900, color: "var(--color-navy)", fontSize: "1.25rem", fontFamily: "var(--font-heading)" }}>
                  {formatRupiah(MONTHLY_SUMMARY.expense)}
                </div>
              </div>

              {/* Remaining / Net row */}
              <div style={{ background: savings >= 0 ? "rgba(184, 255, 0, 0.25)" : "#FEE2E2", border: "2px solid var(--color-navy)", borderRadius: "10px", padding: "0.75rem 1rem", boxShadow: "2px 2px 0px var(--color-navy)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--color-navy)", fontWeight: 900, textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.5px" }}>
                    <Target size={13} color="var(--color-navy)" /> {t("dashboard.reports.sisa")}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "var(--color-navy)", fontWeight: 800, background: "var(--color-white)", padding: "1px 6px", borderRadius: "4px", border: "1px solid var(--color-navy)" }}>
                    Rasio Tabungan: {MONTHLY_SUMMARY.savingsRate}%
                  </span>
                </div>
                <div style={{ fontWeight: 900, color: "var(--color-navy)", fontSize: "1.35rem", fontFamily: "var(--font-heading)" }}>
                  {formatRupiah(MONTHLY_SUMMARY.savings)}
                </div>
              </div>
            </div>

            {/* Export Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "1rem" }}>
              <button 
                onClick={handleExportPdf} 
                className="btn-brutal" 
                style={{
                  background: "var(--color-white)", color: "var(--color-navy)", padding: "0.75rem 1rem", fontWeight: 900,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                  border: "2px solid var(--color-navy)", borderRadius: "10px",
                  boxShadow: "3px 3px 0px var(--color-navy)", width: "100%", fontSize: "0.82rem",
                  cursor: "pointer"
                }}
              >
                <Download size={15} color="var(--color-navy)" strokeWidth={2.5} /> 
                {t("dashboard.reports.exportPdf")}
              </button>
              <button 
                onClick={handleExportExcel} 
                className="btn-brutal" 
                style={{
                  background: "var(--color-lime)", color: "var(--color-navy)", padding: "0.75rem 1rem", fontWeight: 900,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                  border: "2px solid var(--color-navy)", borderRadius: "10px",
                  boxShadow: "3px 3px 0px var(--color-navy)", width: "100%", fontSize: "0.82rem",
                  cursor: "pointer"
                }}
              >
                <FileSpreadsheet size={15} color="var(--color-navy)" strokeWidth={2.5} /> 
                {t("dashboard.reports.exportExcel")}
              </button>
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
                  <Sparkles size={14} color="#1d4ed8" /> INSIGHT CAMI
                </div>
              </div>
              <p style={{ fontSize: "0.95rem", color: "var(--color-navy)", margin: 0, lineHeight: 1.5, fontWeight: 700 }}>
                "{CATEGORY_DATA.length > 0 ? `${t("dashboard.reports.insightMsgPrefix")} ${MONTHLY_SUMMARY.topCategory} ${t("dashboard.reports.insightMsgSuffix")} (${CATEGORY_DATA[0]?.percentage}%).` : t("dashboard.reports.insightMsgEmpty").replace(/^"|"$/g, '')}"
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
