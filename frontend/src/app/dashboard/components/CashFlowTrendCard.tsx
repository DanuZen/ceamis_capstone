"use client";

import React, { useState } from "react";
import { Check, Info, TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";

type FilterPeriod = "hari" | "minggu" | "bulan" | "tahun";

interface DataPoint {
  label: string;
  fullLabel: string;
  income: number;
  expense: number;
  incomePercent: number;
  expensePercent: number;
  isCurrent?: boolean;
}

const DATA_BY_PERIOD: Record<FilterPeriod, {
  title: string;
  subtitle: string;
  yScale: string[];
  averageLimit: number;
  paguLinePercent: number;
  currentBadge?: string;
  points: DataPoint[];
  defaultBanner: {
    label: string;
    value: string;
    safeLimit: string;
    status: "AMAN" | "HEMAT" | "WASPADA" | "PRIMA";
  };
}> = {
  hari: {
    title: "Tren Arus Kas 24 Jam Terakhir",
    subtitle: "Rincian jam ke jam pemasukan & pengeluaran hari ini",
    yScale: ["500k", "300k", "150k", "0"],
    averageLimit: 150000,
    paguLinePercent: 45,
    currentBadge: "KINI",
    points: [
      { label: "00:00", fullLabel: "00:00 - 04:00", income: 0, expense: 0, incomePercent: 0, expensePercent: 0 },
      { label: "06:00", fullLabel: "06:00 (Sarapan)", income: 0, expense: 35000, incomePercent: 0, expensePercent: 12 },
      { label: "10:00", fullLabel: "10:00 (Kopi & Snack)", income: 0, expense: 48000, incomePercent: 0, expensePercent: 16 },
      { label: "13:00", fullLabel: "13:00 (Makan Siang Ramen)", income: 0, expense: 142000, incomePercent: 0, expensePercent: 48 },
      { label: "17:00", fullLabel: "17:00 (Reimburse & Bensin)", income: 450000, expense: 50000, incomePercent: 90, expensePercent: 17 },
      { label: "20:00", fullLabel: "20:00 (Cafe / Malam)", income: 0, expense: 72000, incomePercent: 0, expensePercent: 24, isCurrent: true },
      { label: "23:59", fullLabel: "23:59 (Penutupan Hari)", income: 0, expense: 0, incomePercent: 0, expensePercent: 0 },
    ],
    defaultBanner: {
      label: "Total pengeluaran hari ini",
      value: "Rp 347.000",
      safeLimit: "Batas aman: Rp 450.000",
      status: "AMAN",
    },
  },
  minggu: {
    title: "Tren Arus Kas 7 Hari Terakhir",
    subtitle: "Perbandingan Pemasukan (Hijau) vs Pengeluaran (Kuning)",
    yScale: ["2.5jt", "1.5jt", "800k", "0"],
    averageLimit: 250000,
    paguLinePercent: 45,
    currentBadge: "HARI INI",
    points: [
      { label: "Sen", fullLabel: "Senin, 15 Sep 2026", income: 1550000, expense: 1050000, incomePercent: 62, expensePercent: 42 },
      { label: "Sel", fullLabel: "Selasa, 16 Sep 2026", income: 950000, expense: 1350000, incomePercent: 38, expensePercent: 54 },
      { label: "Rab", fullLabel: "Rabu, 17 Sep 2026", income: 2350000, expense: 870000, incomePercent: 94, expensePercent: 35 },
      { label: "Kam", fullLabel: "Kamis, 18 Sep 2026", income: 1100000, expense: 1200000, incomePercent: 44, expensePercent: 48 },
      { label: "Jum", fullLabel: "Jumat, 19 Sep 2026", income: 950000, expense: 1550000, incomePercent: 38, expensePercent: 62 },
      { label: "Sab", fullLabel: "Sabtu, 20 Sep 2026 (Hari ini)", income: 1380000, expense: 1780000, incomePercent: 55, expensePercent: 72, isCurrent: true },
      { label: "Min", fullLabel: "Minggu, 21 Sep 2026", income: 700000, expense: 600000, incomePercent: 28, expensePercent: 24 },
    ],
    defaultBanner: {
      label: "Rata-rata belanja harian kamu",
      value: "Rp 142.000 / hari",
      safeLimit: "Batas aman: Rp 250.000",
      status: "AMAN",
    },
  },
  bulan: {
    title: "Tren Arus Kas 4 Minggu Terakhir",
    subtitle: "Rasio akumulasi arus kas mingguan periode September 2026",
    yScale: ["3.0jt", "2.0jt", "1.0jt", "0"],
    averageLimit: 1250000,
    paguLinePercent: 55,
    currentBadge: "AKTIF",
    points: [
      { label: "Mgg 1", fullLabel: "Minggu 1 (1 - 7 Sep)", income: 1800000, expense: 1250000, incomePercent: 60, expensePercent: 42 },
      { label: "Mgg 2", fullLabel: "Minggu 2 (8 - 14 Sep)", income: 2200000, expense: 1450000, incomePercent: 73, expensePercent: 48 },
      { label: "Mgg 3", fullLabel: "Minggu 3 (15 - 21 Sep)", income: 1400000, expense: 980000, incomePercent: 47, expensePercent: 33 },
      { label: "Mgg 4", fullLabel: "Minggu 4 (22 - 30 Sep)", income: 2600000, expense: 1150000, incomePercent: 87, expensePercent: 38, isCurrent: true },
    ],
    defaultBanner: {
      label: "Rata-rata pengeluaran mingguan",
      value: "Rp 1.207.500 / minggu",
      safeLimit: "Target pagu: Rp 1.350.000",
      status: "HEMAT",
    },
  },
  tahun: {
    title: "Tren Arus Kas Bulanan (Tahun 2026)",
    subtitle: "Riwayat perbandingan pendapatan vs belanja per bulan",
    yScale: ["6.0jt", "4.0jt", "2.0jt", "0"],
    averageLimit: 3800000,
    paguLinePercent: 63,
    currentBadge: "BERJALAN",
    points: [
      { label: "Jan", fullLabel: "Januari 2026", income: 5200000, expense: 4100000, incomePercent: 87, expensePercent: 68 },
      { label: "Feb", fullLabel: "Februari 2026", income: 5200000, expense: 3800000, incomePercent: 87, expensePercent: 63 },
      { label: "Mar", fullLabel: "Maret 2026", income: 5500000, expense: 4500000, incomePercent: 92, expensePercent: 75 },
      { label: "Apr", fullLabel: "April 2026 (THR)", income: 6200000, expense: 4900000, incomePercent: 100, expensePercent: 82 },
      { label: "Mei", fullLabel: "Mei 2026", income: 5200000, expense: 3700000, incomePercent: 87, expensePercent: 62 },
      { label: "Jun", fullLabel: "Juni 2026", income: 5400000, expense: 3900000, incomePercent: 90, expensePercent: 65 },
      { label: "Jul", fullLabel: "Juli 2026", income: 5200000, expense: 3600000, incomePercent: 87, expensePercent: 60 },
      { label: "Ags", fullLabel: "Agustus 2026", income: 5200000, expense: 3500000, incomePercent: 87, expensePercent: 58 },
      { label: "Sep", fullLabel: "September 2026 (Berjalan)", income: 5200000, expense: 1450000, incomePercent: 87, expensePercent: 24, isCurrent: true },
    ],
    defaultBanner: {
      label: "Surplus kumulatif tahun 2026",
      value: "+Rp 16.250.000",
      safeLimit: "Tabungan rata-rata 31%/bulan",
      status: "PRIMA",
    },
  },
};

export default function CashFlowTrendCard() {
  const [activeFilter, setActiveFilter] = useState<FilterPeriod>("minggu");
  const [showIncome, setShowIncome] = useState(true);
  const [showExpense, setShowExpense] = useState(true);
  const [showPagu, setShowPagu] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const currentDataset = DATA_BY_PERIOD[activeFilter];
  const activePoint = hoveredIndex !== null ? currentDataset.points[hoveredIndex] : (selectedIndex !== null ? currentDataset.points[selectedIndex] : null);

  // Dynamic banner calculation based on selection or defaults
  const bannerContent = activePoint
    ? {
        label: `${activePoint.fullLabel}`,
        value: `Pemasukan: Rp ${activePoint.income.toLocaleString("id-ID")} | Pengeluaran: Rp ${activePoint.expense.toLocaleString("id-ID")}`,
        safeLimit: `Selisih: ${activePoint.income >= activePoint.expense ? "+" : "-"}Rp ${Math.abs(activePoint.income - activePoint.expense).toLocaleString("id-ID")}`,
        status: (activePoint.income >= activePoint.expense ? "AMAN" : "WASPADA") as "AMAN" | "WASPADA",
      }
    : currentDataset.defaultBanner;

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "2.5px solid var(--color-navy)",
        borderRadius: "16px",
        boxShadow: "4px 4px 0px var(--color-navy)",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flex: "1 1 58%",
        minWidth: "320px",
        boxSizing: "border-box",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        {/* Header & Filter Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "0.85rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.2rem",
                  fontWeight: 900,
                  color: "var(--color-navy)",
                  margin: 0,
                  letterSpacing: "-0.3px",
                }}
              >
                {currentDataset.title}
              </h2>
            </div>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#475569",
                fontWeight: 600,
                margin: "0.25rem 0 0 0",
              }}
            >
              {currentDataset.subtitle}
            </p>
          </div>

          {/* Time Filter Segment Buttons */}
          <div
            style={{
              display: "flex",
              border: "2px solid var(--color-navy)",
              borderRadius: "10px",
              overflow: "hidden",
              background: "#F1F5F9",
              boxShadow: "2px 2px 0px var(--color-navy)",
            }}
          >
            {(["hari", "minggu", "bulan", "tahun"] as const).map((tab) => {
              const isActive = activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveFilter(tab);
                    setHoveredIndex(null);
                    setSelectedIndex(null);
                  }}
                  style={{
                    border: "none",
                    borderLeft: tab !== "hari" ? "1.5px solid var(--color-navy)" : "none",
                    background: isActive ? "var(--color-lime)" : "transparent",
                    color: "var(--color-navy)",
                    padding: "5px 12px",
                    fontSize: "0.75rem",
                    fontWeight: isActive ? 900 : 700,
                    cursor: "pointer",
                    textTransform: "capitalize",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab === "hari" ? "Hari" : tab === "minggu" ? "Minggu" : tab === "bulan" ? "Bulan" : "Tahun"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Legend Toggles */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            margin: "0.85rem 0 1.25rem 0",
            flexWrap: "wrap",
          }}
        >
          {/* Pemasukan Toggle */}
          <button
            onClick={() => setShowIncome(!showIncome)}
            title="Klik untuk tampilkan/sembunyikan Pemasukan"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              background: showIncome ? "#F0FDF4" : "#F8FAFC",
              border: "1.5px solid var(--color-navy)",
              borderRadius: "8px",
              padding: "4px 10px",
              cursor: "pointer",
              boxShadow: showIncome ? "1.5px 1.5px 0px var(--color-navy)" : "none",
              transition: "all 0.15s ease",
              opacity: showIncome ? 1 : 0.6,
            }}
          >
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "3px",
                background: "var(--color-lime)",
                border: "1.5px solid var(--color-navy)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {showIncome && <Check size={10} color="var(--color-navy)" strokeWidth={3} />}
            </span>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--color-navy)" }}>
              Pemasukan
            </span>
          </button>

          {/* Pengeluaran Toggle */}
          <button
            onClick={() => setShowExpense(!showExpense)}
            title="Klik untuk tampilkan/sembunyikan Pengeluaran"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              background: showExpense ? "#FEFCE8" : "#F8FAFC",
              border: "1.5px solid var(--color-navy)",
              borderRadius: "8px",
              padding: "4px 10px",
              cursor: "pointer",
              boxShadow: showExpense ? "1.5px 1.5px 0px var(--color-navy)" : "none",
              transition: "all 0.15s ease",
              opacity: showExpense ? 1 : 0.6,
            }}
          >
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "3px",
                background: "#FFE100",
                border: "1.5px solid var(--color-navy)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {showExpense && <Check size={10} color="var(--color-navy)" strokeWidth={3} />}
            </span>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--color-navy)" }}>
              Pengeluaran
            </span>
          </button>

          {/* Pagu Rerata Toggle */}
          <button
            onClick={() => setShowPagu(!showPagu)}
            title="Klik untuk aktifkan/nonaktifkan garis acuan Pagu Rerata"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              background: showPagu ? "#EFF6FF" : "#FFFFFF",
              border: "1.5px solid var(--color-navy)",
              borderRadius: "8px",
              padding: "4px 10px",
              cursor: "pointer",
              boxShadow: showPagu ? "1.5px 1.5px 0px var(--color-navy)" : "none",
              transition: "all 0.15s ease",
              opacity: showPagu ? 1 : 0.7,
            }}
          >
            <span
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "3px",
                background: showPagu ? "#0095FF" : "#FFFFFF",
                border: "1.5px solid var(--color-navy)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {showPagu && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
            </span>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--color-navy)" }}>
              Pagu Rerata {showPagu ? "(Aktif)" : ""}
            </span>
          </button>

          {/* Reset selection button if item is selected */}
          {selectedIndex !== null && (
            <button
              onClick={() => setSelectedIndex(null)}
              style={{
                border: "1px solid #94A3B8",
                background: "#F8FAFC",
                color: "#64748B",
                borderRadius: "6px",
                padding: "2px 8px",
                fontSize: "0.7rem",
                fontWeight: 700,
                cursor: "pointer",
                marginLeft: "auto",
              }}
            >
              Reset Pilihan
            </button>
          )}
        </div>

        {/* Dual Bar Chart Area with Y-axis and dynamic columns */}
        <div
          style={{
            position: "relative",
            minHeight: "220px",
            flex: 1,
            marginTop: "1.25rem",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          {/* Y-Axis guide lines */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              pointerEvents: "none",
            }}
          >
            {currentDataset.yScale.map((val, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", width: "100%" }}>
                <span
                  style={{
                    width: "36px",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    color: "#64748B",
                  }}
                >
                  {val}
                </span>
                <div
                  style={{
                    flex: 1,
                    borderBottom: i === currentDataset.yScale.length - 1 ? "2px solid var(--color-navy)" : "1px dashed #CBD5E1",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Pagu Rerata Reference Line (if toggled) */}
          {showPagu && (
            <div
              style={{
                position: "absolute",
                left: "36px",
                right: 0,
                bottom: `${currentDataset.paguLinePercent}%`,
                borderTop: "2px dashed #FF5100",
                zIndex: 2,
                pointerEvents: "none",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  background: "#FF5100",
                  color: "#FFFFFF",
                  fontSize: "0.6rem",
                  fontWeight: 900,
                  padding: "1px 6px",
                  borderRadius: "4px",
                  border: "1px solid var(--color-navy)",
                  transform: "translateY(-50%)",
                  letterSpacing: "0.4px",
                }}
              >
                Pagu Acuan
              </span>
            </div>
          )}

          {/* Dynamic Columns */}
          <div
            style={{
              flex: 1,
              marginLeft: "40px",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-end",
              height: "100%",
              zIndex: 3,
              paddingBottom: "2px",
            }}
          >
            {currentDataset.points.map((col, idx) => {
              const isHovered = hoveredIndex === idx;
              const isSelected = selectedIndex === idx;
              const isFocused = isHovered || isSelected;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedIndex(selectedIndex === idx ? null : idx)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    cursor: "pointer",
                    padding: "0 4px",
                    transition: "transform 0.15s ease",
                    transform: isFocused ? "translateY(-4px)" : "none",
                  }}
                >
                  {/* Interactive Floating Tooltip (Shown on hover or active selection) */}
                  {isFocused && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "100%",
                        marginBottom: "12px",
                        background: "#FFFFFF",
                        border: "2px solid var(--color-navy)",
                        borderRadius: "10px",
                        boxShadow: "3px 3px 0px var(--color-navy)",
                        padding: "0.5rem 0.75rem",
                        zIndex: 50,
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                        minWidth: "160px",
                        textAlign: "left",
                        transform: "translateX(-50%)",
                        left: "50%",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 900,
                          color: "var(--color-navy)",
                          borderBottom: "1px solid #E2E8F0",
                          paddingBottom: "3px",
                          marginBottom: "4px",
                        }}
                      >
                        {col.fullLabel}
                      </div>
                      {showIncome && (
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-navy)" }}>
                          <span>Pemasukan:</span>
                          <span style={{ color: "#16A34A", fontWeight: 900 }}>Rp {col.income.toLocaleString("id-ID")}</span>
                        </div>
                      )}
                      {showExpense && (
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-navy)" }}>
                          <span>Pengeluaran:</span>
                          <span style={{ color: "#D97706", fontWeight: 900 }}>Rp {col.expense.toLocaleString("id-ID")}</span>
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "8px",
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          borderTop: "1px dashed #CBD5E1",
                          paddingTop: "3px",
                          marginTop: "3px",
                          color: col.income >= col.expense ? "#16A34A" : "#DC2626",
                        }}
                      >
                        <span>Selisih:</span>
                        <span>{col.income >= col.expense ? "+" : "-"}Rp {Math.abs(col.income - col.expense).toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  )}

                  {/* Subtle Column Glow / Track for Today / Active */}
                  {col.isCurrent && !isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        top: "0px",
                        left: "-6px",
                        right: "-6px",
                        bottom: "0px",
                        borderRadius: "8px",
                        background: "linear-gradient(180deg, rgba(163, 230, 53, 0.16) 0%, rgba(163, 230, 53, 0.02) 100%)",
                        pointerEvents: "none",
                        transition: "all 0.2s ease",
                      }}
                    />
                  )}
                  {isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-4px",
                        left: "-6px",
                        right: "-6px",
                        bottom: "0px",
                        borderRadius: "8px",
                        background: "rgba(10, 25, 47, 0.05)",
                        border: "1.5px solid var(--color-navy)",
                        pointerEvents: "none",
                        transition: "all 0.2s ease",
                      }}
                    />
                  )}

                  {/* Dual Bars Container */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: "4px",
                      height: "100%",
                      minHeight: "155px",
                    }}
                  >
                    {/* Lime Bar: Pemasukan */}
                    {showIncome && (
                      <div
                        style={{
                          width: activeFilter === "tahun" ? "10px" : "15px",
                          height: `${col.incomePercent}%`,
                          background: "var(--color-lime)",
                          border: "1.5px solid var(--color-navy)",
                          borderRadius: "4px 4px 0 0",
                          boxShadow: isFocused ? "2px 0px 0px var(--color-navy)" : "none",
                          transition: "height 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }}
                      />
                    )}

                    {/* Yellow Bar: Pengeluaran */}
                    {showExpense && (
                      <div
                        style={{
                          width: activeFilter === "tahun" ? "10px" : "15px",
                          height: `${col.expensePercent}%`,
                          background: "#FFE100",
                          border: "1.5px solid var(--color-navy)",
                          borderRadius: "4px 4px 0 0",
                          boxShadow: isFocused ? "2px 0px 0px var(--color-navy)" : "none",
                          transition: "height 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }}
                      />
                    )}
                  </div>

                  {/* Column Bottom Label */}
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "3px",
                      minHeight: "34px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.74rem",
                        fontWeight: col.isCurrent || isFocused ? 900 : 700,
                        color: col.isCurrent ? "var(--color-navy)" : (isFocused ? "var(--color-navy)" : "#64748B"),
                        transition: "color 0.15s ease",
                      }}
                    >
                      {col.label}
                    </span>

                    {col.isCurrent && (
                      <span
                        style={{
                          background: "var(--color-navy)",
                          color: "var(--color-lime)",
                          fontSize: "0.56rem",
                          fontWeight: 900,
                          padding: "1.5px 6px",
                          borderRadius: "999px",
                          letterSpacing: "0.4px",
                          lineHeight: 1.1,
                          whiteSpace: "nowrap",
                          boxShadow: "1px 1px 0px rgba(0,0,0,0.15)",
                        }}
                      >
                        {currentDataset.currentBadge || "HARI INI"}
                      </span>
                    )}

                    {isSelected && !col.isCurrent && (
                      <span
                        style={{
                          background: "var(--color-lime)",
                          color: "var(--color-navy)",
                          fontSize: "0.55rem",
                          fontWeight: 900,
                          padding: "1px 5px",
                          borderRadius: "4px",
                          border: "1px solid var(--color-navy)",
                          lineHeight: 1.1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        PILIHAN
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Bottom Callout Banner */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "0.85rem",
          background: "#F8FAFC",
          border: "2px solid var(--color-navy)",
          borderRadius: "12px",
          boxShadow: "2px 2px 0px var(--color-navy)",
          padding: "0.85rem 1.15rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.6rem",
          transition: "all 0.2s ease",
        }}
      >
        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155" }}>
          {bannerContent.label}: <strong>{bannerContent.value}</strong> ({bannerContent.safeLimit})
        </div>
        <div
          style={{
            background: bannerContent.status === "WASPADA" ? "#FFE100" : "var(--color-lime)",
            border: "1.5px solid var(--color-navy)",
            borderRadius: "999px",
            padding: "3px 10px",
            fontSize: "0.7rem",
            fontWeight: 900,
            color: "var(--color-navy)",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            boxShadow: "1px 1px 0px var(--color-navy)",
          }}
        >
          {bannerContent.status}
        </div>
      </div>
    </div>
  );
}
