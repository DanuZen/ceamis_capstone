"use client";

import { Wallet, Plus, Coffee, Utensils, Car, ShoppingBag, Zap } from "lucide-react";
import { useState } from "react";

export default function TransactionsPage() {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  const handleQuickInput = (presetDesc: string, presetAmount: string) => {
    setDesc(presetDesc);
    setAmount(presetAmount);
  };

  return (
    <div style={{ paddingBottom: "3rem" }}>
      {/* Header Area */}
      <div style={{ marginBottom: "3rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div style={{
          width: "72px",
          height: "72px",
          background: "var(--color-lime)",
          borderRadius: "var(--radius-brutal-sm)",
          border: "3px solid var(--color-navy)",
          boxShadow: "4px 4px 0px var(--color-navy)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <Wallet size={40} color="var(--color-navy)" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", marginBottom: "0.25rem", color: "var(--color-navy)", fontWeight: 800 }}>
            Catat Transaksi
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
            Catat pengeluaranmu sebelum lupa. Makin disiplin = makin gampang kaya!
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "3rem", alignItems: "start" }}>
        {/* Quick Input Section (Wrapped in Card) */}
        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="card-brutal" style={{ background: "var(--color-bg)", border: "4px solid var(--color-navy)", padding: "2.5rem", boxShadow: "8px 8px 0px var(--color-navy)", display: "flex", flexDirection: "column", height: "100%" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", marginBottom: "1.5rem", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.75rem", fontWeight: 800 }}>
              <Zap size={28} color="var(--color-orange)" fill="var(--color-orange)" /> 
              1-Click Input
            </h3>
            <p style={{ fontSize: "1.0625rem", color: "var(--color-text-muted)", marginBottom: "2rem", lineHeight: 1.5 }}>
              Malas ngetik? Klik salah satu tombol di bawah untuk langsung mengisi form dengan pengeluaran yang sering kamu lakukan.
            </p>

            {/* 2x2 Grid for Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", flex: 1 }}>
              <button 
                onClick={() => handleQuickInput("Kopi / Minuman", "25000")}
                className="btn-brutal" 
                style={{ background: "var(--color-white)", padding: "2rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", fontSize: "1.125rem", fontWeight: 800, border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal)", boxShadow: "4px 4px 0px var(--color-navy)" }}
              >
                <div style={{ background: "var(--color-bg)", padding: "0.75rem", borderRadius: "50%", border: "2px solid var(--color-navy)" }}>
                  <Coffee size={32} color="var(--color-purple)" />
                </div>
                <span>Kopi (25k)</span>
              </button>
              
              <button 
                onClick={() => handleQuickInput("Makan Siang", "35000")}
                className="btn-brutal" 
                style={{ background: "var(--color-white)", padding: "2rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", fontSize: "1.125rem", fontWeight: 800, border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal)", boxShadow: "4px 4px 0px var(--color-navy)" }}
              >
                <div style={{ background: "var(--color-bg)", padding: "0.75rem", borderRadius: "50%", border: "2px solid var(--color-navy)" }}>
                  <Utensils size={32} color="var(--color-orange)" />
                </div>
                <span>Makan (35k)</span>
              </button>
              
              <button 
                onClick={() => handleQuickInput("Bensin / Transport", "20000")}
                className="btn-brutal" 
                style={{ background: "var(--color-white)", padding: "2rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", fontSize: "1.125rem", fontWeight: 800, border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal)", boxShadow: "4px 4px 0px var(--color-navy)" }}
              >
                <div style={{ background: "var(--color-bg)", padding: "0.75rem", borderRadius: "50%", border: "2px solid var(--color-navy)" }}>
                  <Car size={32} color="var(--color-lime)" />
                </div>
                <span>Transport (20k)</span>
              </button>
              
              <button 
                onClick={() => handleQuickInput("Jajan / Cemilan", "15000")}
                className="btn-brutal" 
                style={{ background: "var(--color-white)", padding: "2rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", fontSize: "1.125rem", fontWeight: 800, border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal)", boxShadow: "4px 4px 0px var(--color-navy)" }}
              >
                <div style={{ background: "var(--color-bg)", padding: "0.75rem", borderRadius: "50%", border: "2px solid var(--color-navy)" }}>
                  <ShoppingBag size={32} color="var(--color-pink)" />
                </div>
                <span>Jajan (15k)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mega Form */}
        <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="card-brutal" style={{ background: "var(--color-white)", border: "4px solid var(--color-navy)", padding: "2.5rem", boxShadow: "8px 8px 0px var(--color-navy)", display: "flex", flexDirection: "column", height: "100%" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", marginBottom: "2rem", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.75rem", fontWeight: 800 }}>
              <Plus size={28} color="var(--color-white)" fill="var(--color-purple)" style={{ background: "var(--color-purple)", borderRadius: "50%", padding: "4px", border: "2px solid var(--color-navy)" }} />
              Form Transaksi
            </h3>
            
            <form
              onSubmit={(e) => { e.preventDefault(); alert("Transaksi disimpan!"); setDesc(""); setAmount(""); }}
              style={{ display: "flex", flexDirection: "column", gap: "1.75rem", flex: 1 }}
            >
              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.125rem", display: "block", marginBottom: "0.75rem", color: "var(--color-navy)" }}>
                  Deskripsi Pengeluaran
                </label>
                <input 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="input-brutal" 
                  placeholder='Contoh: "Bayar Netflix Patungan"' 
                  style={{ border: "3px solid var(--color-navy)", padding: "1.25rem", fontSize: "1.25rem", width: "100%", boxShadow: "4px 4px 0px var(--color-border-light)" }} 
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.75rem" }}>
                <div>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.125rem", display: "block", marginBottom: "0.75rem", color: "var(--color-navy)" }}>
                    Nominal (Rp)
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.25rem", fontWeight: 800, color: "var(--color-navy)" }}>Rp</span>
                    <input 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="input-brutal" 
                      type="number" 
                      placeholder="50000" 
                      style={{ border: "3px solid var(--color-navy)", padding: "1.25rem 1.25rem 1.25rem 3.5rem", fontSize: "1.25rem", width: "100%", fontWeight: 700, boxShadow: "4px 4px 0px var(--color-border-light)" }} 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.125rem", display: "block", marginBottom: "0.75rem", color: "var(--color-navy)" }}>
                    Jenis Transaksi
                  </label>
                  <select className="input-brutal input-brutal--select" style={{ border: "3px solid var(--color-navy)", padding: "1.25rem", fontSize: "1.25rem", width: "100%", height: "auto", boxShadow: "4px 4px 0px var(--color-border-light)", fontWeight: 600 }}>
                    <option>Pengeluaran</option>
                    <option>Pemasukan</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.125rem", display: "block", marginBottom: "0.75rem", color: "var(--color-navy)" }}>
                  Kategori
                </label>
                <select className="input-brutal input-brutal--select" style={{ border: "3px solid var(--color-navy)", padding: "1.25rem", fontSize: "1.25rem", width: "100%", height: "auto", boxShadow: "4px 4px 0px var(--color-border-light)", fontWeight: 600 }}>
                  <option>F&amp;B (Makan/Minum)</option>
                  <option>Transportasi</option>
                  <option>Belanja / Shopping</option>
                  <option>Hiburan / Digital</option>
                  <option>Kesehatan / Self-care</option>
                  <option>Pendapatan / Gaji</option>
                  <option>Lainnya</option>
                </select>
              </div>

              <div style={{ flex: 1 }}></div>

              <button 
                type="submit" 
                className="btn-brutal btn-brutal--primary" 
                style={{ 
                  marginTop: "1.5rem", 
                  padding: "1.5rem", 
                  fontSize: "1.25rem", 
                  fontWeight: 800,
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}
              >
                Simpan Transaksi <Zap size={24} fill="currentColor" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
