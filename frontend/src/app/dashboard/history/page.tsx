"use client";

import { useState } from "react";
import { List, ShieldAlert, Wallet, TrendingUp, TrendingDown, Filter } from "lucide-react";

export default function HistoryPage() {
  const [filter, setFilter] = useState<"semua" | "pemasukan" | "pengeluaran">("semua");

  const dummyTransactions = [
    { id: 1, desc: "Kopi Starbucks", amount: -55000, type: "pengeluaran", category: "F&B", date: "1 Mei 2026" },
    { id: 2, desc: "Gaji Freelance", amount: 2500000, type: "pemasukan", category: "Pendapatan", date: "30 Apr 2026" },
    { id: 3, desc: "Gopay Top-up", amount: -200000, type: "pengeluaran", category: "Digital", date: "29 Apr 2026" },
    { id: 4, desc: "Uang makan dari ortu", amount: 500000, type: "pemasukan", category: "Transfer", date: "28 Apr 2026" },
    { id: 5, desc: "Skincare The Ordinary", amount: -189000, type: "pengeluaran", category: "Self-care", date: "27 Apr 2026" },
    { id: 6, desc: "Nonton Bioskop", amount: -75000, type: "pengeluaran", category: "Hiburan", date: "25 Apr 2026" },
  ];

  const filteredTransactions = dummyTransactions.filter(tx => {
    if (filter === "semua") return true;
    return tx.type === filter;
  });

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
            Riwayat Transaksi
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
            Pantau semua pergerakan uangmu di sini. Jangan kaget kalau banyakan merahnya!
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Summary Cards */}
        <div className="animate-slide-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          <div className="card-brutal" style={{ background: "var(--color-lime)", border: "4px solid var(--color-navy)", padding: "2rem", display: "flex", alignItems: "center", gap: "1.5rem", boxShadow: "6px 6px 0px var(--color-navy)" }}>
            <div style={{ background: "var(--color-white)", padding: "1.25rem", borderRadius: "50%", border: "3px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
              <TrendingUp size={36} color="var(--color-navy)" />
            </div>
            <div>
              <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "0.25rem", opacity: 0.9 }}>Pemasukan Bulan Ini</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", fontWeight: 800, color: "var(--color-navy)" }}>+Rp 3.000k</div>
            </div>
          </div>

          <div className="card-brutal" style={{ background: "var(--color-pink)", border: "4px solid var(--color-navy)", padding: "2rem", display: "flex", alignItems: "center", gap: "1.5rem", boxShadow: "6px 6px 0px var(--color-navy)" }}>
            <div style={{ background: "var(--color-white)", padding: "1.25rem", borderRadius: "50%", border: "3px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
              <TrendingDown size={36} color="var(--color-navy)" />
            </div>
            <div>
              <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "0.25rem", opacity: 0.9 }}>Pengeluaran Bulan Ini</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", fontWeight: 800, color: "var(--color-navy)" }}>-Rp 519k</div>
            </div>
          </div>
        </div>

        {/* Filters and List */}
        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="card-brutal" style={{ background: "var(--color-white)", border: "4px solid var(--color-navy)", padding: "2rem", boxShadow: "8px 8px 0px var(--color-navy)" }}>
            
            {/* Header List & Filters */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem", paddingBottom: "1.5rem", borderBottom: "3px dashed var(--color-border-light)" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", margin: 0, color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800 }}>
                <Filter size={28} /> Filter Transaksi
              </h2>
              
              <div style={{ display: "flex", gap: "0.5rem", background: "var(--color-bg)", padding: "0.5rem", borderRadius: "var(--radius-brutal)", border: "3px solid var(--color-navy)" }}>
                <button 
                  onClick={() => setFilter("semua")}
                  style={{ 
                    padding: "0.75rem 1.5rem", 
                    borderRadius: "var(--radius-brutal-sm)", 
                    background: filter === "semua" ? "var(--color-navy)" : "transparent",
                    color: filter === "semua" ? "var(--color-white)" : "var(--color-navy)",
                    fontWeight: 800,
                    fontSize: "1rem",
                    border: filter === "semua" ? "2px solid var(--color-navy)" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  Semua
                </button>
                <button 
                  onClick={() => setFilter("pemasukan")}
                  style={{ 
                    padding: "0.75rem 1.5rem", 
                    borderRadius: "var(--radius-brutal-sm)", 
                    background: filter === "pemasukan" ? "var(--color-lime)" : "transparent",
                    color: "var(--color-navy)",
                    fontWeight: 800,
                    fontSize: "1rem",
                    border: filter === "pemasukan" ? "2px solid var(--color-navy)" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  Pemasukan
                </button>
                <button 
                  onClick={() => setFilter("pengeluaran")}
                  style={{ 
                    padding: "0.75rem 1.5rem", 
                    borderRadius: "var(--radius-brutal-sm)", 
                    background: filter === "pengeluaran" ? "var(--color-orange)" : "transparent",
                    color: "var(--color-navy)",
                    fontWeight: 800,
                    fontSize: "1rem",
                    border: filter === "pengeluaran" ? "2px solid var(--color-navy)" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  Pengeluaran
                </button>
              </div>
            </div>

            {/* Transaction List */}
            <div className="stagger-children" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="card-brutal"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1.5rem",
                      background: tx.type === "pemasukan" ? "rgba(182, 255, 68, 0.1)" : "rgba(255, 126, 103, 0.1)",
                      border: "3px solid var(--color-navy)",
                      boxShadow: "4px 4px 0px var(--color-navy)",
                      transition: "transform 0.2s"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "var(--radius-brutal-sm)",
                          border: "3px solid var(--color-navy)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: tx.type === "pemasukan" ? "var(--color-lime)" : "var(--color-orange)",
                          boxShadow: "2px 2px 0px var(--color-navy)",
                        }}
                      >
                        {tx.type === "pemasukan" ? <Wallet size={28} color="var(--color-navy)" /> : <ShieldAlert size={28} color="var(--color-navy)" />}
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.25rem", color: "var(--color-navy)", marginBottom: "0.25rem" }}>
                          {tx.desc}
                        </div>
                        <div style={{ fontSize: "1rem", color: "var(--color-text-muted)", display: "flex", gap: "0.5rem", alignItems: "center", fontWeight: 500 }}>
                          <span style={{ color: "var(--color-navy)" }}>{tx.date}</span>
                          <span style={{ color: "var(--color-border-light)" }}>•</span>
                          <span style={{ background: "var(--color-bg)", padding: "0.2rem 0.75rem", borderRadius: "100px", border: "2px solid var(--color-navy)", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-navy)" }}>{tx.category}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 800,
                        fontSize: "1.5rem",
                        color: tx.type === "pemasukan" ? "var(--color-navy)" : "var(--color-pink)",
                        background: "var(--color-white)",
                        padding: "0.5rem 1rem",
                        borderRadius: "var(--radius-brutal-sm)",
                        border: "3px solid var(--color-navy)",
                        boxShadow: "2px 2px 0px var(--color-navy)"
                      }}
                    >
                      {tx.type === "pemasukan" ? "+" : ""}
                      Rp {Math.abs(tx.amount).toLocaleString("id-ID")}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "4rem", textAlign: "center", border: "4px dashed var(--color-navy)", borderRadius: "var(--radius-brutal-lg)", color: "var(--color-navy)", fontSize: "1.25rem", fontWeight: 800, background: "var(--color-bg)" }}>
                  Tidak ada data transaksi untuk filter ini.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
