"use client";

import { Wallet, Plus, Coffee, Utensils, Car, ShoppingBag, Zap, Sparkles } from "lucide-react";
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2.5rem", alignItems: "start" }}>
        {/* Quick Input Section */}
        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="card-brutal" style={{ background: "var(--color-white)", border: "4px solid var(--color-navy)", padding: "2rem", boxShadow: "8px 8px 0px var(--color-navy)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <Zap size={28} color="var(--color-orange)" fill="var(--color-orange)" /> 
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "var(--color-navy)", margin: 0, fontWeight: 900 }}>1-Click Input</h3>
            </div>
            <p style={{ fontSize: "1rem", color: "var(--color-text-muted)", marginBottom: "2rem", lineHeight: 1.5, fontWeight: 500 }}>
              Pilih pengeluaran yang paling sering kamu lakukan untuk mengisi form secara otomatis.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {[
                { label: "Kopi", amount: "25000", desc: "Kopi / Minuman", color: "var(--color-purple)", icon: Coffee },
                { label: "Makan", amount: "35000", desc: "Makan Siang", color: "var(--color-orange)", icon: Utensils },
                { label: "Bensin", amount: "20000", desc: "Bensin / Transport", color: "var(--color-lime)", icon: Car },
                { label: "Jajan", amount: "15000", desc: "Jajan / Cemilan", color: "var(--color-pink)", icon: ShoppingBag },
              ].map((btn) => (
                <button 
                  key={btn.label}
                  onClick={() => handleQuickInput(btn.desc, btn.amount)}
                  className="btn-brutal" 
                  style={{ 
                    background: "var(--color-white)", 
                    padding: "1.25rem",
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center",
                    gap: "0.75rem",
                    border: "3px solid var(--color-navy)", 
                    borderRadius: "var(--radius-brutal-sm)", 
                    boxShadow: `4px 4px 0px var(--color-navy)`,
                    transition: "all 0.1s"
                  }}
                >
                  <div style={{ background: btn.color, padding: "0.75rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0px var(--color-navy)" }}>
                    <btn.icon size={24} color="var(--color-navy)" />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: "0.9375rem", color: "var(--color-navy)" }}>{btn.label}</span>
                </button>
              ))}
            </div>
            
            <div style={{ marginTop: "2rem", padding: "1.25rem", background: "var(--color-bg)", border: "2px dashed var(--color-navy)", borderRadius: "var(--radius-brutal-sm)" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "0.5rem" }}>TIPS HEMAT HARI INI:</div>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.4 }}>
                "Membawa botol minum sendiri bisa menghemat hingga Rp 500rb sebulan lho!"
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="card-brutal" style={{ background: "var(--color-white)", border: "4px solid var(--color-navy)", padding: "2.5rem", boxShadow: "10px 10px 0px var(--color-purple)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
              <Plus size={28} color="var(--color-white)" fill="var(--color-purple)" style={{ background: "var(--color-purple)", borderRadius: "var(--radius-brutal-sm)", padding: "4px", border: "2px solid var(--color-navy)" }} />
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", color: "var(--color-navy)", margin: 0, fontWeight: 900 }}>Form Transaksi</h3>
            </div>
            
            <form
              onSubmit={(e) => { e.preventDefault(); alert("Transaksi disimpan!"); setDesc(""); setAmount(""); }}
              style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
            >
              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                  APA YANG KAMU BELI?
                </label>
                <input 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="input-brutal" 
                  placeholder='Misal: "Kopi Susu Gula Aren"' 
                  style={{ border: "3px solid var(--color-navy)", padding: "1rem", fontSize: "1.125rem", width: "100%", boxShadow: "4px 4px 0px var(--color-navy)", background: "var(--color-bg)" }} 
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem" }}>
                <div>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                    NOMINAL (RP)
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.125rem", fontWeight: 800, color: "var(--color-navy)" }}>Rp</span>
                    <input 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="input-brutal" 
                      type="number" 
                      placeholder="0" 
                      style={{ border: "3px solid var(--color-navy)", padding: "1rem 1rem 1rem 3rem", fontSize: "1.125rem", width: "100%", fontWeight: 800, boxShadow: "4px 4px 0px var(--color-navy)", background: "var(--color-bg)" }} 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                    TIPE
                  </label>
                  <select className="input-brutal" style={{ border: "3px solid var(--color-navy)", padding: "1rem", fontSize: "1.125rem", width: "100%", height: "auto", boxShadow: "4px 4px 0px var(--color-navy)", fontWeight: 700, background: "var(--color-bg)" }}>
                    <option>Pengeluaran</option>
                    <option>Pemasukan</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                  KATEGORI
                </label>
                <select className="input-brutal" style={{ border: "3px solid var(--color-navy)", padding: "1rem", fontSize: "1.125rem", width: "100%", height: "auto", boxShadow: "4px 4px 0px var(--color-navy)", fontWeight: 700, background: "var(--color-bg)" }}>
                  <option>Makanan & Minuman</option>
                  <option>Transportasi</option>
                  <option>Belanja</option>
                  <option>Hiburan</option>
                  <option>Kesehatan</option>
                  <option>Gaji / Bonus</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="btn-brutal btn-brutal--primary" 
                style={{ 
                  marginTop: "1.5rem", 
                  padding: "1.25rem", 
                  fontSize: "1.25rem", 
                  fontWeight: 900,
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: "0.75rem",
                  background: "var(--color-navy)",
                  color: "var(--color-white)",
                  boxShadow: "6px 6px 0px var(--color-lime)"
                }}
              >
                Simpan Transaksi <Sparkles size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
