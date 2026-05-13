"use client";

import { useState } from "react";
import { List, ShieldAlert, Wallet, TrendingUp, TrendingDown, Filter } from "lucide-react";
import { useTransactions } from "@/context/TransactionContext";

export default function HistoryPage() {
  const [filter, setFilter] = useState<"semua" | "pemasukan" | "pengeluaran">("semua");
  const { transactions } = useTransactions();

  const filteredTransactions = transactions.filter(tx => {
    if (filter === "semua") return true;
    return tx.type === filter;
  });

  const totalPemasukan = transactions
    .filter(tx => tx.type === "pemasukan")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalPengeluaran = transactions
    .filter(tx => tx.type === "pengeluaran")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const sisaSaldo = totalPemasukan - totalPengeluaran;

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
      {/* Top Row: 4 Stats Cards */}
      <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{ background: "var(--color-lime)", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <TrendingUp size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem" }}>Rp {(totalPemasukan/1000).toLocaleString("id-ID")}k</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Pemasukan</div>
          </div>
        </div>
        
        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{ background: "var(--color-orange)", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <TrendingDown size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem" }}>Rp {(totalPengeluaran/1000).toLocaleString("id-ID")}k</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Pengeluaran</div>
          </div>
        </div>

        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{ background: "var(--color-purple)", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <Wallet size={24} color="var(--color-white)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem" }}>Rp {(sisaSaldo/1000).toLocaleString("id-ID")}k</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Sisa Saldo</div>
          </div>
        </div>

        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{ background: "var(--color-white)", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <List size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem" }}>{transactions.length} Trx</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Total Bulan Ini</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "2rem" }}>
        {/* Main List Area (Left) */}
        <div style={{ flex: "1 1 65%", minWidth: "300px" }}>
          <div className="card-brutal" style={{ background: "var(--color-white)", border: "4px solid var(--color-navy)", padding: "2rem", boxShadow: "8px 8px 0px var(--color-navy)" }}>
            
            {/* Header List & Filters */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem", paddingBottom: "1.5rem", borderBottom: "3px dashed rgba(10, 25, 47, 0.1)" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", margin: 0, color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 900 }}>
                <Filter size={24} /> DAFTAR TRANSAKSI
              </h2>
              
              <div style={{ display: "flex", gap: "0.25rem", background: "var(--color-bg)", padding: "0.4rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)" }}>
                {["semua", "pemasukan", "pengeluaran"].map((type) => (
                  <button 
                    key={type}
                    onClick={() => setFilter(type as any)}
                    style={{ 
                      padding: "0.5rem 1rem", 
                      borderRadius: "var(--radius-brutal-sm)", 
                      background: filter === type ? "var(--color-navy)" : "transparent",
                      color: filter === type ? "var(--color-white)" : "var(--color-navy)",
                      fontWeight: 800,
                      fontSize: "0.875rem",
                      border: "none",
                      cursor: "pointer",
                      textTransform: "capitalize"
                    }}
                  >
                    {type}
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
                          <span style={{ color: "var(--color-purple)" }}>{tx.category}</span>
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
                      {tx.type === "pemasukan" ? "+" : "-"}Rp {Math.abs(tx.amount/1000).toLocaleString("id-ID")}k
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "3rem", textAlign: "center", border: "3px dashed var(--color-navy)", borderRadius: "var(--radius-brutal)", color: "var(--color-text-muted)", fontWeight: 700 }}>
                  Tidak ada data transaksi.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info (Right) */}
        <div style={{ flex: "1 1 25%", minWidth: "280px" }}>
          <div className="card-brutal" style={{ padding: "1.5rem", background: "var(--color-white)", height: "100%" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 900 }}>
              <TrendingUp size={24} color="var(--color-purple)" /> KATEGORI TERBANYAK
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                { name: "F&B (Makan/Minum)", count: 12, color: "var(--color-lime)" },
                { name: "Transportasi", count: 8, color: "var(--color-orange)" },
                { name: "Digital & Game", count: 5, color: "var(--color-purple)" },
              ].map((cat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: cat.color, border: "2px solid var(--color-navy)" }}></div>
                    <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-navy)" }}>{cat.name}</span>
                  </div>
                  <span style={{ fontWeight: 800, color: "var(--color-text-muted)" }}>{cat.count}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "2rem", padding: "1.25rem", background: "var(--color-bg)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)" }}>
              <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", fontWeight: 900 }}>INSIGHT AI:</h4>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.4, fontWeight: 500 }}>
                "Kamu paling sering jajan di kategori F&B. Coba batasi 1 kopi sehari untuk hemat Rp 200rb bulan depan!"
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
