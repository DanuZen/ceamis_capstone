"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Bell, 
  User, 
  LogOut, 
  Users, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CreditCard, 
  PiggyBank, 
  Wallet, 
  Headphones, 
  Coffee, 
  ShoppingCart, 
  Lightbulb, 
  Camera, 
  Check,
  CheckCircle2,
  X,
  ShieldCheck
} from "lucide-react";
import PageBanner from "@/components/layout/PageBanner";
import { useTransactions } from "@/context/TransactionContext";
import { useUser } from "@/context/UserContext";
import { createClient } from "@/lib/supabase/client";
import CashFlowTrendCard from "./components/CashFlowTrendCard";

export default function DashboardPage() {
  const router = useRouter();
  const { transactions } = useTransactions();
  const { userData } = useUser();
  const supabase = createClient();

  // Dynamic calculations with fallback to mockup values
  const totalPemasukan = transactions
    .filter(tx => tx.type === "pemasukan")
    .reduce((sum, tx) => sum + tx.amount, 0) || 5200000;

  const totalPengeluaran = transactions
    .filter(tx => tx.type === "pengeluaran")
    .reduce((sum, tx) => sum + tx.amount, 0) || 1450000;

  const sisaSaldo = totalPemasukan - totalPengeluaran; // Rp 3.750.000 default

  return (
    <div style={{ paddingBottom: "2.5rem", width: "100%" }} className="space-y-4">
      <PageBanner
        badgeText="PUSAT KENDALI"
        title="Dasbor Keuangan Pintar"
        description="Pantau arus kas, alokasi pos 50/30/20, dan status kesehatan finansialmu secara real-time."
        rightCard={{
          icon: <ShieldCheck size={24} className="text-[#16A34A]" />,
          label: "STATUS FINANSIAL",
          value: "Surplus Kas (Sehat)",
        }}
      />

      {/* ── 4 Bento KPI Metric Cards ── */}
      <div className="dashboard-bento-grid">
        {/* Card 1: PEMASUKAN (BULAN INI) */}
        <div 
          style={{
            background: "#FFFFFF",
            border: "2.5px solid var(--color-navy)",
            borderRadius: "16px",
            boxShadow: "4px 4px 0px var(--color-navy)",
            padding: "1.15rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#475569", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              PEMASUKAN (BULAN INI)
            </span>
            <div 
              style={{
                width: "28px",
                height: "28px",
                background: "var(--color-lime)",
                border: "1.5px solid var(--color-navy)",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Check size={16} color="var(--color-navy)" strokeWidth={3} />
            </div>
          </div>

          <div style={{ margin: "0.65rem 0" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 900, color: "var(--color-navy)" }}>
              Rp {totalPemasukan.toLocaleString("id-ID")}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span 
              style={{
                background: "#F1F5F9",
                border: "1px solid #CBD5E1",
                borderRadius: "999px",
                padding: "2px 8px",
                fontSize: "0.68rem",
                fontWeight: 700,
                color: "var(--color-navy)",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <ArrowUpRight size={13} strokeWidth={2.5} /> +12% vs bln lalu
            </span>
            <span style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 600 }}>
              3 transaksi
            </span>
          </div>
        </div>

        {/* Card 2: PENGELUARAN (BULAN INI) */}
        <div 
          style={{
            background: "#FFFFFF",
            border: "2.5px solid var(--color-navy)",
            borderRadius: "16px",
            boxShadow: "4px 4px 0px var(--color-navy)",
            padding: "1.15rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#475569", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              PENGELUARAN (BULAN INI)
            </span>
            <div 
              style={{
                width: "28px",
                height: "28px",
                background: "#FFE100",
                border: "1.5px solid var(--color-navy)",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
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
              28% dari pagu Rp 5jt
            </span>
            <span style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 600 }}>
              14 pos belanja
            </span>
          </div>
        </div>

        {/* Card 3: SISA PAGU AMAN */}
        <div 
          style={{
            background: "#FFFFFF",
            border: "2.5px solid var(--color-navy)",
            borderRadius: "16px",
            boxShadow: "4px 4px 0px var(--color-navy)",
            padding: "1.15rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#475569", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              SISA PAGU AMAN
            </span>
            <div 
              style={{
                width: "28px",
                height: "28px",
                background: "#E0F2FE",
                border: "1.5px solid var(--color-navy)",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <CreditCard size={16} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
          </div>

          <div style={{ margin: "0.65rem 0" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 900, color: "var(--color-navy)" }}>
              Rp {sisaSaldo.toLocaleString("id-ID")}
            </span>
          </div>

          <div>
            {/* Dual Progress Bar */}
            <div 
              style={{
                width: "100%",
                height: "7px",
                background: "#E2E8F0",
                borderRadius: "999px",
                border: "1.5px solid var(--color-navy)",
                overflow: "hidden",
                marginBottom: "0.35rem"
              }}
            >
              <div style={{ width: "72%", height: "100%", background: "var(--color-lime)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.72rem", color: "#475569", fontWeight: 700 }}>
                72% Tersedia
              </span>
              <span style={{ fontSize: "0.72rem", color: "#475569", fontWeight: 700 }}>
                19 Hari Tersisa
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: TOTAL TABUNGAN & KAS */}
        <div 
          style={{
            background: "#FFFFFF",
            border: "2.5px solid var(--color-navy)",
            borderRadius: "16px",
            boxShadow: "4px 4px 0px var(--color-navy)",
            padding: "1.15rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#475569", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              TOTAL TABUNGAN & KAS
            </span>
            <div 
              style={{
                width: "28px",
                height: "28px",
                background: "#DBEAFE",
                border: "1.5px solid var(--color-navy)",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <PiggyBank size={16} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
          </div>

          <div style={{ margin: "0.65rem 0" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 900, color: "var(--color-navy)" }}>
              Rp 62.358.000
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span 
              style={{
                background: "var(--color-lime)",
                border: "1.5px solid var(--color-navy)",
                borderRadius: "6px",
                padding: "2px 7px",
                fontSize: "0.65rem",
                fontWeight: 900,
                color: "var(--color-navy)",
                letterSpacing: "0.3px"
              }}
            >
              DANA DARURAT: 6 BULAN
            </span>
            <span style={{ fontSize: "0.72rem", color: "#16A34A", fontWeight: 800 }}>
              Sangat Aman
            </span>
          </div>
        </div>
      </div>

      {/* ── Main 2-Column Section ── */}
      <div className="dashboard-main-grid">
        {/* ── Left Column: Tren Arus Kas Interaktif ── */}
        <CashFlowTrendCard />

        {/* ── Right Column: Aktivitas Terakhir & Aturan Anti-FOMO ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", flex: "1 1 38%", minWidth: "300px", height: "100%" }}>
          {/* Card 1: Aktivitas Terakhir */}
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
              flex: 1,
            }}
          >
            <div>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.1rem" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 900, color: "var(--color-navy)", margin: 0 }}>
                  Aktivitas Terakhir
                </h3>
                <Link 
                  href="/dashboard/history" 
                  style={{ 
                    fontSize: "0.75rem", 
                    fontWeight: 800, 
                    color: "#0284C7", 
                    textDecoration: "none" 
                  }}
                >
                  Lihat Semua →
                </Link>
              </div>

              {/* 4 Activity Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* 1. Gaji Pokok PT Teknologi */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div 
                      style={{
                        width: "38px",
                        height: "38px",
                        background: "var(--color-lime)",
                        border: "2px solid var(--color-navy)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      <Wallet size={18} color="var(--color-navy)" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--color-navy)" }}>
                        Gaji Pokok PT Teknologi
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 600, marginTop: "2px" }}>
                        01 Sep 2026 • Salary / Primary
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 900, color: "var(--color-navy)" }}>
                      +Rp 5.200.000
                    </div>
                    <span 
                      style={{
                        background: "var(--color-lime)",
                        border: "1.5px solid var(--color-navy)",
                        borderRadius: "4px",
                        padding: "1px 6px",
                        fontSize: "0.62rem",
                        fontWeight: 900,
                        color: "var(--color-navy)",
                        display: "inline-block",
                        marginTop: "2px"
                      }}
                    >
                      INCOME
                    </span>
                  </div>
                </div>

                {/* 2. Apple Music & iCloud */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div 
                      style={{
                        width: "38px",
                        height: "38px",
                        background: "#FFE100",
                        border: "2px solid var(--color-navy)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      <Headphones size={18} color="var(--color-navy)" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--color-navy)" }}>
                        Apple Music & iCloud
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 600, marginTop: "2px" }}>
                        Kemarin 14:20 • Langganan
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 900, color: "#E11D48" }}>
                      -Rp 169.000
                    </div>
                    <span 
                      style={{
                        background: "#F8FAFC",
                        border: "1.5px solid var(--color-navy)",
                        borderRadius: "4px",
                        padding: "1px 6px",
                        fontSize: "0.62rem",
                        fontWeight: 900,
                        color: "#475569",
                        display: "inline-block",
                        marginTop: "2px"
                      }}
                    >
                      WANTS
                    </span>
                  </div>
                </div>

                {/* 3. Starbucks Reserve */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div 
                      style={{
                        width: "38px",
                        height: "38px",
                        background: "#FFE4E6",
                        border: "2px solid var(--color-navy)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      <Coffee size={18} color="#E11D48" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--color-navy)" }}>
                          Starbucks Reserve
                        </span>
                        <span 
                          style={{
                            background: "#B91C1C",
                            color: "#FFFFFF",
                            fontSize: "0.58rem",
                            fontWeight: 900,
                            padding: "1px 5px",
                            borderRadius: "4px",
                            lineHeight: 1.1
                          }}
                        >
                          Impulsif
                        </span>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 600, marginTop: "2px" }}>
                        04 Sep 10:15 • F&B Cafe
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 900, color: "#E11D48" }}>
                      -Rp 72.000
                    </div>
                    <span 
                      style={{
                        background: "#FFE100",
                        border: "1.5px solid var(--color-navy)",
                        borderRadius: "4px",
                        padding: "1px 6px",
                        fontSize: "0.62rem",
                        fontWeight: 900,
                        color: "var(--color-navy)",
                        display: "inline-block",
                        marginTop: "2px"
                      }}
                    >
                      F&B
                    </span>
                  </div>
                </div>

                {/* 4. Superindo Bahan Masak */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div 
                      style={{
                        width: "38px",
                        height: "38px",
                        background: "#E0F2FE",
                        border: "2px solid var(--color-navy)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      <ShoppingCart size={18} color="#0284C7" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--color-navy)" }}>
                        Superindo Bahan Masak
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 600, marginTop: "2px" }}>
                        03 Sep 19:40 • Needs Pokok
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 900, color: "#E11D48" }}>
                      -Rp 420.000
                    </div>
                    <span 
                      style={{
                        background: "var(--color-lime)",
                        border: "1.5px solid var(--color-navy)",
                        borderRadius: "4px",
                        padding: "1px 6px",
                        fontSize: "0.62rem",
                        fontWeight: 900,
                        color: "var(--color-navy)",
                        display: "inline-block",
                        marginTop: "2px"
                      }}
                    >
                      NEEDS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button: Scan Struk Baru Sekarang */}
            <Link 
              href="/dashboard/transactions"
              style={{
                textDecoration: "none",
                marginTop: "1.25rem",
                display: "block"
              }}
            >
              <div 
                className="btn-brutal"
                style={{
                  background: "#FFFFFF",
                  border: "2.5px solid var(--color-navy)",
                  borderRadius: "10px",
                  boxShadow: "3px 3px 0px var(--color-navy)",
                  padding: "0.65rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  color: "var(--color-navy)",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <Camera size={16} strokeWidth={2.5} />
                <span>Scan Struk Baru Sekarang</span>
              </div>
            </Link>
          </div>

          {/* Card 2: ATURAN 24 JAM ANTI-FOMO */}
          <div 
            style={{
              background: "var(--color-lime)",
              border: "2.5px solid var(--color-navy)",
              borderRadius: "14px",
              boxShadow: "3px 3px 0px var(--color-navy)",
              padding: "1rem 1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexShrink: 0,
            }}
          >
            <div 
              style={{
                width: "44px",
                height: "44px",
                background: "#FFFFFF",
                border: "2px solid var(--color-navy)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <Lightbulb size={24} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
            <div>
              <div 
                style={{ 
                  fontSize: "0.82rem", 
                  fontWeight: 900, 
                  color: "var(--color-navy)", 
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}
              >
                ATURAN 24 JAM ANTI-FOMO
              </div>
              <p 
                style={{ 
                  fontSize: "0.78rem", 
                  fontWeight: 600, 
                  color: "var(--color-navy)", 
                  margin: "4px 0 0 0",
                  lineHeight: 1.35
                }}
              >
                Setiap ada promo flash sale, simpan di keranjang dan tunggu 24 jam. 70% rasa ingin beli biasanya hilang keesokan harinya!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
