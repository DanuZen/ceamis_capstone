"use client";

import { useState } from "react";
import {
  FileText, Download, Mail, Calendar,
  TrendingUp, TrendingDown, Wallet, PieChart,
  Filter, BarChart3, ArrowRight, FileSpreadsheet,
  Banknote, Target, Lightbulb
} from "lucide-react";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const CATEGORY_DATA = [
  { name: "Makanan & Minuman", amount: 850000, percentage: 35, color: "orange" },
  { name: "Transportasi", amount: 450000, percentage: 18, color: "purple" },
  { name: "Belanja", amount: 380000, percentage: 16, color: "lime" },
  { name: "Hiburan", amount: 300000, percentage: 12, color: "pink" },
  { name: "Kesehatan", amount: 250000, percentage: 10, color: "purple" },
  { name: "Lainnya", amount: 220000, percentage: 9, color: "orange" },
];

const MONTHLY_SUMMARY = {
  income: 4500000,
  expense: 2450000,
  savings: 2050000,
  savingsRate: 45.6,
  transactions: 42,
  topCategory: "Makanan & Minuman",
};

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(4); // May (0-indexed)
  const [selectedYear] = useState(2026);

  const formatRupiah = (num: number) => `Rp ${num.toLocaleString("id-ID")}`;

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
              Laporan Keuangan
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
              Rangkuman keuanganmu dalam satu tampilan. Export atau kirim via email!
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button className="btn-brutal" style={{
            background: "var(--color-white)", padding: "0.75rem 1.25rem", fontWeight: 800,
            display: "flex", alignItems: "center", gap: "0.5rem",
            boxShadow: "3px 3px 0px var(--color-navy)",
          }}>
            <Download size={16} /> Export PDF
          </button>
          <button onClick={handleExportExcel} className="btn-brutal" style={{
            background: "var(--color-lime)", padding: "0.75rem 1.25rem", fontWeight: 800,
            display: "flex", alignItems: "center", gap: "0.5rem",
            boxShadow: "3px 3px 0px var(--color-navy)",
          }}>
            <FileSpreadsheet size={16} /> Export Excel
          </button>
          <button className="btn-brutal" style={{
            background: "var(--color-navy)", color: "var(--color-white)",
            padding: "0.75rem 1.25rem", fontWeight: 800,
            display: "flex", alignItems: "center", gap: "0.5rem",
            boxShadow: "3px 3px 0px var(--color-purple)",
          }}>
            <Mail size={16} /> Kirim via Email
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
              {month.slice(0, 3)}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.75rem", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Calendar size={14} /> Periode: {MONTHS[selectedMonth]} {selectedYear}
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
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-text-muted)" }}>PEMASUKAN</span>
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
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-text-muted)" }}>PENGELUARAN</span>
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
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-text-muted)" }}>TABUNGAN</span>
          </div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 800, color: "var(--color-navy)" }}>
            {formatRupiah(MONTHLY_SUMMARY.savings)}
          </div>
          <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-purple)", marginTop: "0.25rem" }}>
            {MONTHLY_SUMMARY.savingsRate}% dari pemasukan
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
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-text-muted)" }}>TRANSAKSI</span>
          </div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 800, color: "var(--color-navy)" }}>
            {MONTHLY_SUMMARY.transactions}
          </div>
          <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
            total pencatatan
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
        {/* Category Breakdown */}
        <div className="card-brutal" style={{ padding: "2rem" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", margin: "0 0 1.5rem 0", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <PieChart size={22} color="var(--color-purple)" /> Pengeluaran per Kategori
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
            <Mail size={22} color="var(--color-lime)" /> Preview Laporan Email
          </h3>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", marginBottom: "1.5rem" }}>
            Laporan ini akan dikirim secara berkala ke email terdaftar kamu.
          </p>

          {/* Email Preview Card */}
          <div style={{
            background: "var(--color-white)", color: "var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
            border: "3px solid var(--color-white)", padding: "1.5rem",
          }}>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>From: noreply@ceamis.id</div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>Subject: Laporan Keuangan {MONTHS[selectedMonth]} {selectedYear}</div>
            <div style={{ borderTop: "2px dashed var(--color-border-light)", paddingTop: "1rem" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.125rem", fontWeight: 800, marginBottom: "1rem" }}>
                Ringkasan Keuanganmu
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}><Banknote size={14} color="var(--color-navy)" /> Pemasukan</span>
                  <span style={{ fontWeight: 800 }}>{formatRupiah(MONTHLY_SUMMARY.income)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}><TrendingDown size={14} color="var(--color-navy)" /> Pengeluaran</span>
                  <span style={{ fontWeight: 800 }}>{formatRupiah(MONTHLY_SUMMARY.expense)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid var(--color-navy)", paddingTop: "0.5rem", marginTop: "0.25rem" }}>
                  <span style={{ fontWeight: 800, display: "flex", alignItems: "center", gap: "0.35rem" }}><Target size={14} color="var(--color-navy)" /> Sisa</span>
                  <span style={{ fontWeight: 900, color: "var(--color-purple)", fontSize: "1rem" }}>{formatRupiah(MONTHLY_SUMMARY.savings)}</span>
                </div>
              </div>
              <div style={{ marginTop: "1rem", padding: "0.75rem", background: "var(--color-bg)", borderRadius: "var(--radius-brutal-sm)", border: "2px dashed var(--color-navy)", fontSize: "0.8rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.35rem" }}><Lightbulb size={14} color="var(--color-navy)" style={{ flexShrink: 0, marginTop: "2px" }} /><span><strong>Insight:</strong> Pengeluaran F&B kamu masih yang terbesar ({CATEGORY_DATA[0].percentage}%). Coba kurangi 10% bulan depan ya!</span></div>
              </div>
            </div>
          </div>

          <button className="btn-brutal" style={{
            width: "100%", marginTop: "1.5rem", padding: "1rem",
            background: "var(--color-lime)", color: "var(--color-navy)", fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            boxShadow: "4px 4px 0px var(--color-white)",
          }}>
            <Mail size={16} /> Kirim ke Email Saya
          </button>
        </div>
      </div>
    </div>
  );
}
