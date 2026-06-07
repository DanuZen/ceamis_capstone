"use client";

import { useState, useEffect } from "react";
import {
  FileText, Download, Mail, Calendar,
  TrendingUp, TrendingDown, Wallet, PieChart,
  Filter, BarChart3, ArrowRight, FileSpreadsheet,
  Banknote, Target, Lightbulb, Loader2, Sparkles
} from "lucide-react";
import * as XLSX from "xlsx-js-style";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useTransactions } from "@/context/TransactionContext";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { translateCategoryName } from "@/lib/translateCategory";
import { useToast } from "@/components/ui/Toast";

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
  const { showToast } = useToast();
  const { transactions } = useTransactions();
  const { userData } = useUser();
  const { t, language } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

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
  const categoryColors = ["lime", "purple", "orange", "pink"];
  
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

      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }} className="stagger-children">
        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{ background: "var(--color-lime)", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)", flexShrink: 0 }}>
            <TrendingUp size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div style={{ minWidth: 0, overflow: "hidden" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {formatRupiah(MONTHLY_SUMMARY.income)}
            </div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {t("dashboard.reports.income")}
            </div>
          </div>
        </div>

        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{ background: "var(--color-orange)", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)", flexShrink: 0 }}>
            <TrendingDown size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div style={{ minWidth: 0, overflow: "hidden" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {formatRupiah(MONTHLY_SUMMARY.expense)}
            </div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {t("dashboard.reports.expense")}
            </div>
          </div>
        </div>

        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{ background: "var(--color-purple)", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)", flexShrink: 0 }}>
            <Wallet size={24} color="var(--color-white)" strokeWidth={2.5} />
          </div>
          <div style={{ minWidth: 0, overflow: "hidden" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {formatRupiah(MONTHLY_SUMMARY.savings)}
            </div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {t("dashboard.reports.savings")}
            </div>
          </div>
        </div>

        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{ background: "var(--color-white)", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)", flexShrink: 0 }}>
            <BarChart3 size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div style={{ minWidth: 0, overflow: "hidden" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {MONTHLY_SUMMARY.transactions} Trx
            </div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {t("dashboard.reports.totalRecords")}
            </div>
          </div>
        </div>
      </div>


      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", alignItems: "stretch" }}>
        {/* Income Category Breakdown */}
        <div className="card-brutal" style={{ padding: "2rem", height: "700px", minHeight: "700px", maxHeight: "700px", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", margin: "0 0 1.5rem 0", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "36px", height: "36px", background: "var(--color-lime)", borderRadius: "var(--radius-brutal-sm)", border: "2.5px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0px var(--color-navy)", flexShrink: 0 }}>
              <PieChart size={20} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
            {t("dashboard.reports.incomeByCategory") || "Pemasukan per Kategori"}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1, minHeight: 0, overflowY: "auto", paddingRight: "0.5rem" }} className="no-scrollbar">
            {INCOME_CATEGORY_DATA.length === 0 && (
              <div style={{ color: "var(--color-navy)", opacity: 0.7, textAlign: "center", margin: "auto", fontSize: "0.95rem" }}>
                {t("dashboard.reports.noIncome") || "Belum ada pemasukan di bulan ini."}
              </div>
            )}
            {INCOME_CATEGORY_DATA.map((cat) => (
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

        {/* Category Breakdown */}
        <div className="card-brutal" style={{ padding: "2rem", height: "700px", minHeight: "700px", maxHeight: "700px", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", margin: "0 0 1.5rem 0", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "36px", height: "36px", background: "var(--color-purple)", borderRadius: "var(--radius-brutal-sm)", border: "2.5px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0px var(--color-navy)", flexShrink: 0 }}>
              <PieChart size={20} color="var(--color-white)" strokeWidth={2.5} />
            </div>
            {t("dashboard.reports.expenseByCategory")}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1, minHeight: 0, overflowY: "auto", paddingRight: "0.5rem" }} className="no-scrollbar">
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
        <div className="card-brutal" style={{ padding: "2rem", background: "var(--color-navy)", color: "var(--color-white)", display: "flex", flexDirection: "column", height: "700px", minHeight: "700px", maxHeight: "700px" }}>
          {/* Period Selector inside header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--color-white)" }}>
              <div style={{ background: "var(--color-lime)", borderRadius: "6px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Calendar size={18} color="var(--color-navy)" />
              </div>
              {t("dashboard.reports.summaryTitle")}
            </h3>
            {/* Compact dropdowns */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {/* Month Dropdown */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => { setIsMonthDropdownOpen(p => !p); setIsYearDropdownOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.35rem",
                    padding: "0.35rem 0.75rem", fontFamily: "var(--font-heading)", fontWeight: 800,
                    fontSize: "0.8rem", background: "var(--color-lime)", color: "var(--color-navy)",
                    border: "2.5px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
                    boxShadow: "2px 2px 0px rgba(0,0,0,0.3)", cursor: "pointer",
                  }}
                >
                  {t(`dashboard.reports.months.${MONTHS[selectedMonth]}`).slice(0, 3).toUpperCase()}
                  <span style={{ fontSize: "0.55rem" }}>▼</span>
                </button>
                {isMonthDropdownOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 200,
                    background: "var(--color-white)", border: "3px solid var(--color-navy)",
                    borderRadius: "var(--radius-brutal-sm)", boxShadow: "6px 6px 0px var(--color-navy)",
                    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                    minWidth: "200px", overflow: "hidden"
                  }}>
                    {MONTHS.map((month, idx) => (
                      <button key={month} onClick={() => { setSelectedMonth(idx); setIsMonthDropdownOpen(false); }}
                        style={{
                          padding: "0.55rem 0.5rem", fontSize: "0.75rem", fontWeight: 800,
                          fontFamily: "var(--font-heading)",
                          background: selectedMonth === idx ? "var(--color-purple)" : "var(--color-white)",
                          color: selectedMonth === idx ? "var(--color-white)" : "var(--color-navy)",
                          border: "none", borderRight: "2px solid var(--color-navy)",
                          borderBottom: "2px solid var(--color-navy)",
                          cursor: "pointer", textTransform: "uppercase"
                        }}
                        onMouseEnter={e => { if (selectedMonth !== idx) e.currentTarget.style.background = "var(--color-bg)"; }}
                        onMouseLeave={e => { if (selectedMonth !== idx) e.currentTarget.style.background = "var(--color-white)"; }}
                      >
                        {t(`dashboard.reports.months.${month}`).slice(0, 3)}
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
                    display: "flex", alignItems: "center", gap: "0.35rem",
                    padding: "0.35rem 0.75rem", fontFamily: "var(--font-heading)", fontWeight: 800,
                    fontSize: "0.8rem", background: "rgba(255,255,255,0.15)", color: "var(--color-white)",
                    border: "2.5px solid rgba(255,255,255,0.5)", borderRadius: "var(--radius-brutal-sm)",
                    cursor: "pointer",
                  }}
                >
                  {selectedYear}
                  <span style={{ fontSize: "0.55rem", opacity: 0.7 }}>▼</span>
                </button>
                {isYearDropdownOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 200,
                    background: "var(--color-white)", border: "3px solid var(--color-navy)",
                    borderRadius: "var(--radius-brutal-sm)", boxShadow: "6px 6px 0px var(--color-navy)",
                    overflow: "hidden", minWidth: "90px"
                  }}>
                    {[new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2].map(yr => (
                      <button key={yr} onClick={() => { setSelectedYear(yr); setIsYearDropdownOpen(false); }}
                        style={{
                          display: "block", width: "100%", padding: "0.55rem 1rem",
                          fontSize: "0.85rem", fontWeight: 800, fontFamily: "var(--font-heading)",
                          background: selectedYear === yr ? "var(--color-purple)" : "var(--color-white)",
                          color: selectedYear === yr ? "var(--color-white)" : "var(--color-navy)",
                          border: "none", borderBottom: "2px solid var(--color-navy)",
                          cursor: "pointer", textAlign: "left"
                        }}
                        onMouseEnter={e => { if (selectedYear !== yr) e.currentTarget.style.background = "var(--color-bg)"; }}
                        onMouseLeave={e => { if (selectedYear !== yr) e.currentTarget.style.background = "var(--color-white)"; }}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div style={{ height: "1.5rem" }} />

          {/* Summary Card */}
          <div style={{
            background: "var(--color-white)", color: "var(--color-navy)", borderRadius: "12px",
            border: "3px solid rgba(255,255,255,0.9)", padding: "1.5rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)", flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem"
          }}>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 900, marginBottom: "0.25rem", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ background: "var(--color-lime)", borderRadius: "4px", width: "10px", height: "10px", display: "inline-block", border: "1.5px solid var(--color-navy)", flexShrink: 0 }} />
              {t("dashboard.reports.summaryTitle")}
            </div>

            {/* Income row */}
            <div style={{ background: "#f0fdf4", border: "2px solid var(--color-navy)", borderRadius: "8px", padding: "0.75rem 1rem", boxShadow: "2px 2px 0px var(--color-navy)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#16a34a", fontWeight: 800, textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.8px", marginBottom: "0.3rem" }}>
                <Banknote size={13} /> {t("dashboard.reports.income")}
              </div>
              <div style={{ fontWeight: 900, color: "var(--color-navy)", fontSize: "1.05rem", fontFamily: "var(--font-heading)", wordBreak: "break-all" }}>
                {formatRupiah(MONTHLY_SUMMARY.income)}
              </div>
            </div>

            {/* Expense row */}
            <div style={{ background: "#fff7ed", border: "2px solid var(--color-navy)", borderRadius: "8px", padding: "0.75rem 1rem", boxShadow: "2px 2px 0px var(--color-navy)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#ea580c", fontWeight: 800, textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.8px", marginBottom: "0.3rem" }}>
                <TrendingDown size={13} /> {t("dashboard.reports.expense")}
              </div>
              <div style={{ fontWeight: 900, color: "var(--color-navy)", fontSize: "1.05rem", fontFamily: "var(--font-heading)", wordBreak: "break-all" }}>
                {formatRupiah(MONTHLY_SUMMARY.expense)}
              </div>
            </div>

            {/* Remaining row */}
            <div style={{ background: savings >= 0 ? "var(--color-lime)" : "#fee2e2", border: "3px solid var(--color-navy)", borderRadius: "8px", padding: "0.85rem 1rem", boxShadow: "3px 3px 0px var(--color-navy)", marginTop: "0.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-navy)", fontWeight: 800, textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.8px", marginBottom: "0.3rem" }}>
                <Target size={13} color="var(--color-navy)" /> {t("dashboard.reports.sisa")}
              </div>
              <div style={{ fontWeight: 900, color: "var(--color-navy)", fontSize: "1.15rem", fontFamily: "var(--font-heading)", wordBreak: "break-all" }}>
                {formatRupiah(MONTHLY_SUMMARY.savings)}
              </div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--color-navy)", opacity: 0.6, marginTop: "0.25rem" }}>
                Rasio tabungan: {MONTHLY_SUMMARY.savingsRate}%
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexDirection: "column", marginTop: "1.5rem" }}>
            <button onClick={handleExportPdf} className="btn-brutal" style={{
              background: "var(--color-white)", color: "var(--color-navy)", padding: "1rem", fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              border: "3px solid var(--color-navy)",
              boxShadow: "4px 4px 0px rgba(0,0,0,0.5)", width: "100%", fontSize: "0.9rem"
            }}>
              <Download size={18} color="var(--color-navy)" /> {t("dashboard.reports.exportPdf")}
            </button>
            <button onClick={handleExportExcel} className="btn-brutal" style={{
              background: "var(--color-lime)", color: "var(--color-navy)", padding: "1rem", fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              border: "3px solid var(--color-navy)",
              boxShadow: "4px 4px 0px rgba(0,0,0,0.5)", width: "100%", fontSize: "0.9rem"
            }}>
              <FileSpreadsheet size={18} color="var(--color-navy)" /> {t("dashboard.reports.exportExcel")}
            </button>
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
                <div style={{ fontSize: "0.85rem", fontWeight: 900, color: "var(--color-orange)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Sparkles size={14} /> INSIGHT CAMI
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
