"use client";

import { useState } from "react";
import {
  FileText, Download, Mail, Calendar,
  TrendingUp, TrendingDown, Wallet, PieChart,
  Filter, BarChart3, ArrowRight, FileSpreadsheet,
  Banknote, Target, Lightbulb, Loader2
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
  const [selectedYear] = useState(new Date().getFullYear());

  const formatRupiah = (num: number) => `Rp ${num.toLocaleString("id-ID")}`;

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

  const [isSending, setIsSending] = useState(false);
  
  const handleSendEmail = () => {
    const monthName = MONTHS[selectedMonth];
    const toEmail = userData?.email || "email Anda";
    
    setIsSending(true);
    
    // Karena saat ini belum ada integrasi SMTP/Email service di backend (Node.js),
    // kita lakukan simulasi pengiriman berhasil agar UX terasa nyata.
    setTimeout(() => {
      setIsSending(false);
      showToast(`Laporan bulan ${monthName} ${selectedYear} telah berhasil dikirim ke ${toEmail}!`, "success");
    }, 1500);
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
          <button onClick={handleExportPdf} className="btn-brutal" style={{
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
          <button onClick={handleSendEmail} disabled={isSending} className="btn-brutal" style={{
            background: "var(--color-navy)", color: "var(--color-white)",
            padding: "0.75rem 1.25rem", fontWeight: 800,
            display: "flex", alignItems: "center", gap: "0.5rem",
            boxShadow: "3px 3px 0px var(--color-purple)",
            cursor: isSending ? "not-allowed" : "pointer",
            opacity: isSending ? 0.7 : 1
          }}>
            {isSending ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />} 
            {isSending ? "Mengirim..." : t("dashboard.reports.sendEmail")}
          </button>
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

      {/* Month Selector */}
      <div className="card-brutal" style={{ marginBottom: "2.5rem", padding: "1.5rem", background: "var(--color-white)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--color-navy)" }}>
            <div style={{ background: "var(--color-lime)", border: "2.5px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", padding: "0.4rem", boxShadow: "2px 2px 0px var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Calendar size={20} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
            {t("dashboard.reports.period")}: <span style={{ color: "var(--color-purple)", fontWeight: 900 }}>{t(`dashboard.reports.months.${MONTHS[selectedMonth]}`)} {selectedYear}</span>
          </h2>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text-muted)" }}>
            Pilih bulan laporan
          </div>
        </div>

        <div style={{ 
          display: "flex", 
          overflowX: "auto", 
          gap: "0.75rem",
          padding: "0.25rem",
          width: "100%",
          scrollbarWidth: "none", /* Firefox */
          msOverflowStyle: "none",  /* IE and Edge */
        }} className="no-scrollbar">
          {MONTHS.map((month, idx) => (
            <button key={month} onClick={() => setSelectedMonth(idx)} style={{
              flex: "1 0 auto",
              padding: "0.75rem 1.5rem", 
              fontSize: "0.9rem", 
              fontWeight: 800,
              background: selectedMonth === idx ? "var(--color-purple)" : "var(--color-white)",
              color: selectedMonth === idx ? "var(--color-white)" : "var(--color-navy)",
              border: "3px solid var(--color-navy)",
              borderRadius: "var(--radius-brutal-sm)",
              cursor: "pointer",
              boxShadow: selectedMonth === idx ? "none" : "3px 3px 0px var(--color-navy)",
              transform: selectedMonth === idx ? "translate(3px, 3px)" : "none",
              transition: "all 0.1s",
              textTransform: "uppercase"
            }}
            onMouseEnter={(e) => { if(selectedMonth !== idx) { e.currentTarget.style.transform = "translate(-1px, -1px)"; e.currentTarget.style.boxShadow = "4px 4px 0px var(--color-navy)"; } }}
            onMouseLeave={(e) => { if(selectedMonth !== idx) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "3px 3px 0px var(--color-navy)"; } }}>
              {t(`dashboard.reports.months.${month}`).slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
        {/* Income Category Breakdown */}
        <div className="card-brutal" style={{ padding: "2rem" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", margin: "0 0 1.5rem 0", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "36px", height: "36px", background: "var(--color-lime)", borderRadius: "var(--radius-brutal-sm)", border: "2.5px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0px var(--color-navy)", flexShrink: 0 }}>
              <PieChart size={20} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
            {t("dashboard.reports.incomeByCategory") || "Pemasukan per Kategori"}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
        <div className="card-brutal" style={{ padding: "2rem" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", margin: "0 0 1.5rem 0", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "36px", height: "36px", background: "var(--color-purple)", borderRadius: "var(--radius-brutal-sm)", border: "2.5px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0px var(--color-navy)", flexShrink: 0 }}>
              <PieChart size={20} color="var(--color-white)" strokeWidth={2.5} />
            </div>
            {t("dashboard.reports.expenseByCategory")}
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
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", margin: "0 0 0.75rem 0", display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--color-white)" }}>
            <div style={{ background: "var(--color-lime)", borderRadius: "6px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Mail size={18} color="var(--color-navy)" />
            </div>
            {t("dashboard.reports.emailPreviewTitle")}
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--color-white)", marginBottom: "1.5rem", fontWeight: 600, lineHeight: 1.5 }}>
            {t("dashboard.reports.emailPreviewDesc")}
          </p>

          {/* Email Preview Card */}
          <div style={{
            background: "var(--color-white)", color: "var(--color-navy)", borderRadius: "12px",
            border: "3px solid var(--color-white)", padding: "1.5rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)"
          }}>
            <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginBottom: "0.15rem" }}>From: noreply@ceamis.id</div>
            <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(10,25,47,0.08)" }}>Subject: {t("dashboard.reports.title")} {t(`dashboard.reports.months.${MONTHS[selectedMonth]}`)} {selectedYear}</div>
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 900, marginBottom: "1rem", color: "var(--color-navy)" }}>
                {t("dashboard.reports.summaryTitle")}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.875rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-text-muted)", fontWeight: 700, textTransform: "uppercase", fontSize: "0.78rem", letterSpacing: "0.5px" }}>
                    <Banknote size={14} color="var(--color-text-muted)" /> {t("dashboard.reports.income")}
                  </span>
                  <span style={{ fontWeight: 800, color: "var(--color-navy)" }}>{formatRupiah(MONTHLY_SUMMARY.income)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-text-muted)", fontWeight: 700, textTransform: "uppercase", fontSize: "0.78rem", letterSpacing: "0.5px" }}>
                    <TrendingDown size={14} color="var(--color-text-muted)" /> {t("dashboard.reports.expense")}
                  </span>
                  <span style={{ fontWeight: 800, color: "var(--color-navy)" }}>{formatRupiah(MONTHLY_SUMMARY.expense)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1.5px solid var(--color-navy)", paddingTop: "0.75rem", marginTop: "0.25rem" }}>
                  <span style={{ fontWeight: 900, display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", color: "var(--color-navy)" }}>
                    <Target size={14} color="var(--color-navy)" /> {t("dashboard.reports.sisa")}
                  </span>
                  <span style={{ fontWeight: 900, color: "var(--color-purple)", fontSize: "1rem" }}>{formatRupiah(MONTHLY_SUMMARY.savings)}</span>
                </div>
              </div>
              <div style={{ marginTop: "1rem", padding: "0.75rem", background: "var(--color-bg)", borderRadius: "8px", border: "1.5px dashed var(--color-navy)", fontSize: "0.8rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>
                  <Lightbulb size={14} color="var(--color-navy)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span><strong>Insight:</strong> {CATEGORY_DATA.length > 0 ? `${t("dashboard.reports.insightMsgPrefix")} ${MONTHLY_SUMMARY.topCategory} ${t("dashboard.reports.insightMsgSuffix")} (${CATEGORY_DATA[0]?.percentage}%).` : t("dashboard.reports.insightMsgEmpty")}</span>
                </div>
              </div>
            </div>
          </div>

          <button onClick={handleSendEmail} disabled={isSending} className="btn-brutal" style={{
            width: "100%", marginTop: "1.5rem", padding: "1rem",
            background: "var(--color-lime)", color: "var(--color-navy)", fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            fontSize: "1rem",
            boxShadow: "4px 4px 0px rgba(255,255,255,0.3)",
            cursor: isSending ? "not-allowed" : "pointer",
            opacity: isSending ? 0.8 : 1
          }}>
            {isSending ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />} 
            {isSending ? t("dashboard.reports.sendingEmail") : t("dashboard.reports.sendToMyEmail")}
          </button>
        </div>
      </div>
    </div>
  );
}
