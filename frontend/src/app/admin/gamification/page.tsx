"use client";

import { Trophy, Star, Flame, Zap, Target, Shield, Edit } from "lucide-react";

const BADGES = [
  { name: "Pencatat Setia", icon: Target, color: "lime", xp: 100, requirement: "Catat 30 transaksi berturut-turut" },
  { name: "Si Hemat", icon: Shield, color: "purple", xp: 150, requirement: "Pengeluaran di bawah target 4 minggu berturut" },
  { name: "Api Semangat", icon: Flame, color: "orange", xp: 75, requirement: "Login 7 hari berturut-turut (Streak)" },
  { name: "Kilat Cerdas", icon: Zap, color: "lime", xp: 200, requirement: "Selesaikan 5 modul edukasi" },
  { name: "Bintang Emas", icon: Star, color: "orange", xp: 500, requirement: "Mencapai Level 10" },
];

const LEVEL_CONFIG = [
  { level: 1, xpMin: 0, xpMax: 200, label: "Newbie" },
  { level: 5, xpMin: 800, xpMax: 1200, label: "Sadar Finansial" },
  { level: 10, xpMin: 2000, xpMax: 3000, label: "Si Hemat" },
  { level: 15, xpMin: 3000, xpMax: 5000, label: "Investor Muda" },
  { level: 20, xpMin: 5000, xpMax: 8000, label: "Financial Guru" },
];

export default function AdminGamificationPage() {
  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--color-navy)", marginBottom: "0.5rem" }}>
        <Trophy size={28} style={{ verticalAlign: "middle", marginRight: "0.5rem" }} />Pengaturan Gamifikasi
      </h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem", fontWeight: 500 }}>
        Atur parameter XP, level, dan badge yang tersedia di sistem.
      </p>

      {/* Level Configuration */}
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "var(--color-navy)", marginBottom: "1rem" }}>Konfigurasi Level</h2>
      <div className="card-brutal" style={{ padding: 0, overflow: "hidden", marginBottom: "2.5rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--color-bg)", borderBottom: "3px solid var(--color-navy)" }}>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 800, color: "var(--color-navy)" }}>Level</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 800, color: "var(--color-navy)" }}>XP Dibutuhkan</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 800, color: "var(--color-navy)" }}>Label / Gelar</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 800, color: "var(--color-navy)" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {LEVEL_CONFIG.map((lv, i) => (
              <tr key={lv.level} style={{ borderBottom: i < LEVEL_CONFIG.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none" }}>
                <td style={{ padding: "0.85rem 1rem" }}>
                  <span style={{ fontWeight: 900, fontSize: "1rem", color: "var(--color-navy)", background: "var(--color-lime)", padding: "0.2rem 0.75rem", borderRadius: "100px", border: "2px solid var(--color-navy)" }}>LVL {lv.level}</span>
                </td>
                <td style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-text-muted)" }}>{lv.xpMin.toLocaleString()} - {lv.xpMax.toLocaleString()} XP</td>
                <td style={{ padding: "0.85rem 1rem", fontWeight: 800, color: "var(--color-purple)" }}>{lv.label}</td>
                <td style={{ padding: "0.85rem 1rem" }}>
                  <button className="btn-brutal" style={{ padding: "0.4rem", background: "var(--color-bg)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", cursor: "pointer", boxShadow: "none" }}>
                    <Edit size={16} color="var(--color-navy)" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Badges Grid */}
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "var(--color-navy)", marginBottom: "1rem" }}>Daftar Badge</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {BADGES.map((badge, i) => (
          <div key={i} className="card-brutal" style={{ padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "50%", background: `var(--color-${badge.color})`,
              border: "3px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              boxShadow: "3px 3px 0px var(--color-navy)"
            }}>
              <badge.icon size={24} color="var(--color-navy)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--color-navy)", marginBottom: "0.25rem" }}>{badge.name}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: 1.4, marginBottom: "0.5rem" }}>{badge.requirement}</div>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.15rem 0.5rem", background: "var(--color-purple)", color: "var(--color-white)", borderRadius: "100px", border: "2px solid var(--color-navy)" }}>+{badge.xp} XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
