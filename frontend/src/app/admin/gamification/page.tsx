"use client";

import { useState, useEffect } from "react";
import { Trophy, Star, Flame, Zap, Target, Shield, Edit, Plus, X } from "lucide-react";
import { getBadges, createBadge } from "./actions";

// Convert icon references to string names for localStorage compatibility
const INITIAL_BADGES = [
  { id: 1, name: "Pencatat Setia", icon: "Target", color: "lime", xp: 100, requirement: "Catat 30 transaksi berturut-turut" },
  { id: 2, name: "Si Hemat", icon: "Shield", color: "purple", xp: 150, requirement: "Pengeluaran di bawah target 4 minggu berturut" },
  { id: 3, name: "Api Semangat", icon: "Flame", color: "orange", xp: 75, requirement: "Login 7 hari berturut-turut (Streak)" },
  { id: 4, name: "Kilat Cerdas", icon: "Zap", color: "lime", xp: 200, requirement: "Selesaikan 5 modul edukasi" },
  { id: 5, name: "Bintang Emas", icon: "Star", color: "orange", xp: 500, requirement: "Mencapai Level 10" },
];

const renderIcon = (iconName: string, size: number, color: string) => {
  switch (iconName) {
    case "Target": return <Target size={size} color={color} />;
    case "Shield": return <Shield size={size} color={color} />;
    case "Flame": return <Flame size={size} color={color} />;
    case "Zap": return <Zap size={size} color={color} />;
    case "Star": return <Star size={size} color={color} />;
    default: return <Star size={size} color={color} />;
  }
};

const LEVEL_CONFIG = [
  { level: 1, xpMin: 0, xpMax: 200, label: "Newbie" },
  { level: 5, xpMin: 800, xpMax: 1200, label: "Sadar Finansial" },
  { level: 10, xpMin: 2000, xpMax: 3000, label: "Si Hemat" },
  { level: 15, xpMin: 3000, xpMax: 5000, label: "Investor Muda" },
  { level: 20, xpMin: 5000, xpMax: 8000, label: "Financial Guru" },
];

export default function AdminGamificationPage() {
  const [badges, setBadgesState] = useState<any[]>(INITIAL_BADGES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBadges = async () => {
    try {
      const data = await getBadges();
      if (data && data.length > 0) {
        setBadgesState(data.map((b: any) => ({
          ...b,
          color: "lime", // Default for now
          xp: b.requirementValue,
          requirement: b.desc
        })));
      } else {
        setBadgesState(INITIAL_BADGES);
      }
    } catch (error) {
      console.error("Failed to fetch badges", error);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const setBadges = (newBadges: any[]) => {
    setBadgesState(newBadges);
  };

  const handleSaveBadge = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newBadgeData = {
      id: formData.get("name")?.toString().toLowerCase().replace(/\s+/g, '_') || `badge_${Date.now()}`,
      name: formData.get("name") as string,
      desc: formData.get("requirement") as string,
      icon: formData.get("icon") as string,
      requirementType: formData.get("requirementType") as string,
      requirementValue: Number(formData.get("requirementValue")),
      xp: Number(formData.get("xp"))
    };
    
    await createBadge(newBadgeData);
    await fetchBadges();
    setIsModalOpen(false);
  };

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "var(--color-navy)", margin: 0 }}>Daftar Badge</h2>
        <button onClick={() => setIsModalOpen(true)} className="btn-brutal" style={{ background: "var(--color-purple)", color: "var(--color-white)", padding: "0.5rem 1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "3px 3px 0px var(--color-navy)" }}>
          <Plus size={16} /> Tambah Badge
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {badges.map((badge, i) => (
          <div key={i} className="card-brutal" style={{ padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "50%", background: `var(--color-${badge.color})`,
              border: "3px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              boxShadow: "3px 3px 0px var(--color-navy)"
            }}>
              {renderIcon(badge.icon, 24, "var(--color-navy)")}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--color-navy)", marginBottom: "0.25rem" }}>{badge.name}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: 1.4, marginBottom: "0.5rem" }}>
                {badge.desc || badge.requirement} 
                <br/>
                <span style={{ color: "var(--color-purple)", fontWeight: 700 }}>Syarat: {badge.requirementType} ({badge.requirementValue})</span>
              </div>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.15rem 0.5rem", background: "var(--color-purple)", color: "var(--color-white)", borderRadius: "100px", border: "2px solid var(--color-navy)" }}>+{badge.xp || badge.requirementValue} XP</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Badge Modal */}
      {isModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(10, 25, 47, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "1rem" }}>
          <div className="card-brutal animate-bounce-in" style={{ background: "var(--color-white)", width: "100%", maxWidth: "500px", position: "relative" }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="btn-brutal"
              style={{ position: "absolute", top: "1rem", right: "1rem", padding: "0.5rem", background: "var(--color-danger, #e74c3c)", boxShadow: "none" }}
            >
              <X size={16} color="var(--color-white)" />
            </button>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Star size={24} color="var(--color-purple)" /> Tambah Badge
            </h2>
            
            <form onSubmit={handleSaveBadge} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className="input-group-brutal">
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>Nama Badge</label>
                <input name="name" required className="input-brutal" style={{ width: "100%" }} placeholder="Contoh: Sang Juara" />
              </div>
              <div className="input-group-brutal">
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>Persyaratan (Deskripsi UI)</label>
                <input name="requirement" required className="input-brutal" style={{ width: "100%" }} placeholder="Contoh: Selesaikan 5 Modul Edukasi" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="input-group-brutal">
                  <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>Tipe Syarat (Sistem)</label>
                  <select name="requirementType" className="input-brutal" style={{ width: "100%" }}>
                    <option value="module_completed">Modul Diselesaikan</option>
                    <option value="transaction_count">Jumlah Transaksi</option>
                    <option value="login_streak">Login Streak (Hari)</option>
                    <option value="budget_kept">Budget Terjaga (Minggu)</option>
                    <option value="level_reached">Level Dicapai</option>
                  </select>
                </div>
                <div className="input-group-brutal">
                  <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>Nilai Target (Sistem)</label>
                  <input name="requirementValue" type="number" defaultValue={5} required className="input-brutal" style={{ width: "100%" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="input-group-brutal">
                  <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>XP Points</label>
                  <input name="xp" type="number" defaultValue={100} required className="input-brutal" style={{ width: "100%" }} />
                </div>
                <div className="input-group-brutal">
                  <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>Warna Tema</label>
                  <select name="color" className="input-brutal" style={{ width: "100%" }}>
                    <option value="lime">Lime</option>
                    <option value="purple">Purple</option>
                    <option value="orange">Orange</option>
                    <option value="pink">Pink</option>
                  </select>
                </div>
              </div>
              <div className="input-group-brutal">
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>Ikon</label>
                <select name="icon" className="input-brutal" style={{ width: "100%" }}>
                  <option value="Star">Star</option>
                  <option value="Target">Target</option>
                  <option value="Shield">Shield</option>
                  <option value="Flame">Flame</option>
                  <option value="Zap">Zap</option>
                </select>
              </div>
              
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-brutal" style={{ background: "var(--color-bg)", fontWeight: 700 }}>
                  Batal
                </button>
                <button type="submit" className="btn-brutal btn-brutal--primary" style={{ fontWeight: 800, background: "var(--color-purple)", color: "var(--color-white)" }}>
                  Simpan Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
