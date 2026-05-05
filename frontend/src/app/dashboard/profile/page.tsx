"use client";

import { useState, useRef } from "react";
import { 
  Trophy, Flame, Star, Medal, Zap, Target, 
  User, Edit3, Calendar, TrendingUp, Award,
  ChevronRight, CheckCircle2, X, Save, Upload
} from "lucide-react";

// Badge data — will come from API in production
const badges = [
  { icon: Target, name: "First Step", desc: "Catat transaksi pertama", unlocked: true, color: "lime" },
  { icon: Flame, name: "On Fire!", desc: "Streak 3 hari berturut", unlocked: true, color: "orange" },
  { icon: Zap, name: "Konsisten", desc: "Streak 7 hari berturut", unlocked: true, color: "purple" },
  { icon: Trophy, name: "Champion", desc: "Streak 30 hari berturut", unlocked: false, color: "orange" },
  { icon: Star, name: "AI Explorer", desc: "Baca 5 AI Insight", unlocked: true, color: "lime" },
  { icon: Medal, name: "Hemat Master", desc: "Kurangi pengeluaran 20%", unlocked: false, color: "purple" },
  { icon: Star, name: "Bookworm", desc: "Selesaikan 3 modul edukasi", unlocked: false, color: "lime" },
  { icon: Trophy, name: "Legendary", desc: "Raih semua badge", unlocked: false, color: "orange" },
];

// Stats data
const stats = [
  { label: "Total Transaksi", value: "127", icon: TrendingUp, color: "purple" },
  { label: "Hari Aktif", value: "34", icon: Calendar, color: "lime" },
  { label: "Badge Diraih", value: "4/8", icon: Award, color: "orange" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"badges" | "stats">("badges");
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic label from AI cluster — placeholder until backend integration
  const userLabel = "Si Hemat"; // Will come from API/context
  
  const [userData, setUserData] = useState({
    name: "Danu Zen",
    email: "danuzen@ceamis.id",
    phone: "081234567890",
    avatarUrl: ""
  });

  const [editForm, setEditForm] = useState({ ...userData });

  const handleSaveProfile = () => {
    setUserData(editForm);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditForm({ ...editForm, avatarUrl: url });
    }
  };

  return (
    <div style={{ paddingBottom: "2rem" }}>
      {/* Profile Header Card */}
      <div
        className="card-brutal animate-bounce-in"
        style={{
          background: "var(--color-navy)",
          padding: "2.5rem",
          marginBottom: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: "-30px",
            right: "-30px",
            opacity: 0.08,
            transform: "rotate(15deg)",
          }}
        >
          <User size={220} color="var(--color-white)" />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "2rem", position: "relative", zIndex: 2, flexWrap: "wrap" }}>
          {/* Avatar */}
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "var(--radius-brutal-sm)",
              background: "var(--color-purple)",
              border: "4px solid var(--color-white)",
              boxShadow: "6px 6px 0px var(--color-lime)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-heading)",
              fontSize: "2.5rem",
              fontWeight: 900,
              color: "var(--color-white)",
              flexShrink: 0,
              overflow: "hidden"
            }}
          >
            {userData.avatarUrl ? (
              <img src={userData.avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              getInitials(userData.name)
            )}
          </div>

          {/* User Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: "var(--color-white)",
                  margin: 0,
                }}
              >
                {userData.name}
              </h1>
              <div
                className="badge-brutal badge-brutal--lime"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.3rem 0.75rem",
                  fontSize: "0.8rem",
                }}
              >
                <Zap size={14} /> {userLabel}
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9375rem", margin: "0 0 1rem 0" }}>
              {userData.email}
            </p>

            {/* Level & Streak Inline */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "2px solid rgba(255,255,255,0.2)",
                  borderRadius: "var(--radius-brutal-sm)",
                  padding: "0.5rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Zap size={16} color="var(--color-purple)" strokeWidth={3} />
                <span style={{ color: "var(--color-white)", fontWeight: 800, fontSize: "0.875rem" }}>
                  Level 7
                </span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", fontWeight: 600 }}>
                  • 1950/3000 XP
                </span>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "2px solid rgba(255,255,255,0.2)",
                  borderRadius: "var(--radius-brutal-sm)",
                  padding: "0.5rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Flame size={16} color="var(--color-orange)" strokeWidth={3} />
                <span style={{ color: "var(--color-white)", fontWeight: 800, fontSize: "0.875rem" }}>
                  5 Hari Streak
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => {
              setEditForm({ ...userData });
              setIsEditing(true);
            }}
            className="btn-brutal"
            style={{
              background: "var(--color-white)",
              color: "var(--color-navy)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              fontWeight: 800,
              alignSelf: "flex-start",
            }}
          >
            <Edit3 size={16} /> Edit Profil
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
        className="stagger-children"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="card-brutal"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                minWidth: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "var(--radius-brutal-sm)",
                border: "2px solid var(--color-navy)",
                boxShadow: "2px 2px 0px var(--color-navy)",
                background: `var(--color-${stat.color})`,
              }}
            >
              <stat.icon size={24} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.5rem" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bars Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        {/* Streak HP Bar */}
        <div
          className="card-brutal animate-bounce-in"
          style={{
            background: "var(--color-white)",
            border: "3px solid var(--color-navy)",
            padding: "2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.375rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                margin: 0,
              }}
            >
              <Flame size={24} color="var(--color-orange)" strokeWidth={2.5} />
              Streak Aktif
            </h3>
            <span
              className="badge-brutal badge-brutal--orange"
              style={{ padding: "0.3rem 0.75rem", fontSize: "0.875rem" }}
            >
              5 Hari
            </span>
          </div>
          <div className="progress-brutal" style={{ height: "28px", border: "3px solid var(--color-navy)" }}>
            <div
              className="progress-brutal__fill"
              style={{ width: "71%", background: "var(--color-orange)", borderRight: "3px solid var(--color-navy)" }}
            />
            <div className="progress-brutal__label" style={{ fontSize: "0.9375rem", fontWeight: 700 }}>
              5 / 7 hari (target mingguan)
            </div>
          </div>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.9375rem",
              color: "var(--color-navy)",
              fontWeight: 600,
              margin: "1rem 0 0 0",
            }}
          >
            2 hari lagi untuk dapet badge{" "}
            <span style={{ color: "var(--color-purple)", fontWeight: 800 }}>&quot;Konsisten&quot;</span>! Semangat!
          </p>
        </div>

        {/* XP Progress */}
        <div
          className="card-brutal animate-bounce-in"
          style={{
            animationDelay: "100ms",
            background: "var(--color-white)",
            border: "3px solid var(--color-navy)",
            padding: "2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.375rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                margin: 0,
              }}
            >
              <Zap size={24} color="var(--color-purple)" strokeWidth={2.5} />
              Level & XP
            </h3>
            <span
              className="badge-brutal badge-brutal--purple"
              style={{ padding: "0.3rem 0.75rem", fontSize: "0.875rem" }}
            >
              Level 7
            </span>
          </div>
          <div className="progress-brutal" style={{ height: "28px", border: "3px solid var(--color-navy)" }}>
            <div
              className="progress-brutal__fill"
              style={{ width: "65%", background: "var(--color-purple)", borderRight: "3px solid var(--color-navy)" }}
            />
            <div
              className="progress-brutal__label"
              style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-white)" }}
            >
              1950 / 3000 XP
            </div>
          </div>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.9375rem",
              color: "var(--color-navy)",
              fontWeight: 600,
              margin: "1rem 0 0 0",
            }}
          >
            Kumpulkan <span style={{ color: "var(--color-orange)", fontWeight: 800 }}>1050 XP</span> lagi untuk mencapai
            Level 8!
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <button
          className="btn-brutal"
          onClick={() => setActiveTab("badges")}
          style={{
            background: activeTab === "badges" ? "var(--color-purple)" : "var(--color-white)",
            color: activeTab === "badges" ? "var(--color-white)" : "var(--color-navy)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.65rem 1.25rem",
            fontWeight: 800,
            transform: activeTab === "badges" ? "translate(-2px, -2px)" : "none",
            boxShadow: activeTab === "badges" ? "4px 4px 0px var(--color-navy)" : "2px 2px 0px var(--color-navy)",
          }}
        >
          <Trophy size={18} /> Koleksi Badge
        </button>
        <button
          className="btn-brutal"
          onClick={() => setActiveTab("stats")}
          style={{
            background: activeTab === "stats" ? "var(--color-purple)" : "var(--color-white)",
            color: activeTab === "stats" ? "var(--color-white)" : "var(--color-navy)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.65rem 1.25rem",
            fontWeight: 800,
            transform: activeTab === "stats" ? "translate(-2px, -2px)" : "none",
            boxShadow: activeTab === "stats" ? "4px 4px 0px var(--color-navy)" : "2px 2px 0px var(--color-navy)",
          }}
        >
          <TrendingUp size={18} /> Statistik Detail
        </button>
      </div>

      {/* Badge Collection Tab */}
      {activeTab === "badges" && (
        <div>
          <div
            className="stagger-children"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {badges.map((badge) => (
              <div
                key={badge.name}
                className="card-brutal"
                style={{
                  textAlign: "center",
                  padding: "2rem 1.5rem",
                  opacity: badge.unlocked ? 1 : 0.6,
                  filter: badge.unlocked ? "none" : "grayscale(1)",
                  background: badge.unlocked ? "var(--color-white)" : "var(--color-bg)",
                  border: "2.5px solid var(--color-navy)",
                  borderStyle: badge.unlocked ? "solid" : "dashed",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: badge.unlocked ? "4px 4px 0px var(--color-navy)" : "none",
                  transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: badge.unlocked ? `var(--color-${badge.color})` : "var(--color-border-light)",
                    border: "2px solid var(--color-navy)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.25rem",
                    boxShadow: badge.unlocked ? "3px 3px 0px var(--color-navy)" : "none",
                    color: badge.unlocked
                      ? badge.color === "lime"
                        ? "var(--color-navy)"
                        : "var(--color-white)"
                      : "var(--color-text-light)",
                  }}
                >
                  <badge.icon size={32} strokeWidth={2.5} />
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 800,
                    fontSize: "1.125rem",
                    marginBottom: "0.5rem",
                    color: "var(--color-navy)",
                  }}
                >
                  {badge.name}
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                  {badge.desc}
                </div>
                {badge.unlocked && (
                  <div
                    className="badge-brutal badge-brutal--lime"
                    style={{ marginTop: "1rem", padding: "0.2rem 0.6rem", fontSize: "0.7rem" }}
                  >
                    <CheckCircle2 size={10} style={{ display: "inline", verticalAlign: "middle", marginRight: "0.2rem" }} /> Diraih
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Detail Tab */}
      {activeTab === "stats" && (
        <div className="card-brutal" style={{ padding: "2rem" }}>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.25rem",
              marginBottom: "1.5rem",
              color: "var(--color-navy)",
            }}
          >
            Ringkasan Aktivitas
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {[
              { label: "Transaksi Bulan Ini", value: "42 transaksi", icon: TrendingUp, color: "purple" },
              { label: "Pengeluaran Terbesar", value: "F&B — Rp 850rb", icon: Target, color: "orange" },
              { label: "Streak Terpanjang", value: "12 hari", icon: Flame, color: "lime" },
              { label: "Modul Edukasi Selesai", value: "5 dari 12", icon: Star, color: "purple" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem 1.25rem",
                  background: "var(--color-bg)",
                  border: "2px solid var(--color-navy)",
                  borderRadius: "var(--radius-brutal-sm)",
                  boxShadow: "2px 2px 0px var(--color-navy)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "var(--radius-brutal-sm)",
                      background: `var(--color-${item.color})`,
                      border: "2px solid var(--color-navy)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <item.icon size={20} color="var(--color-navy)" strokeWidth={2.5} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{item.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontWeight: 800, fontFamily: "var(--font-heading)", fontSize: "1rem" }}>
                    {item.value}
                  </span>
                  <ChevronRight size={16} color="var(--color-text-muted)" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem"
        }}>
          <div className="card-brutal animate-bounce-in" style={{
            background: "var(--color-bg)", width: "100%", maxWidth: "450px",
            padding: "2rem", position: "relative",
            border: "3px solid var(--color-navy)",
            boxShadow: "8px 8px 0px var(--color-purple)"
          }}>
            <button onClick={() => setIsEditing(false)} style={{
              position: "absolute", top: "1.25rem", right: "1.25rem",
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "0.25rem"
            }}>
              <X size={24} color="var(--color-navy)" />
            </button>
            
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginTop: 0, marginBottom: "1.5rem", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Edit3 size={24} /> Edit Profil
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{
                  width: "80px", height: "80px", borderRadius: "var(--radius-brutal-sm)",
                  background: "var(--color-purple)", color: "var(--color-white)",
                  fontSize: "2rem", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center",
                  border: "3px solid var(--color-navy)", boxShadow: "3px 3px 0px var(--color-lime)",
                  overflow: "hidden"
                }}>
                  {editForm.avatarUrl ? (
                    <img src={editForm.avatarUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    getInitials(editForm.name)
                  )}
                </div>
                <div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
                  <button onClick={() => fileInputRef.current?.click()} className="btn-brutal" style={{
                    display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem",
                    background: "var(--color-white)", border: "2px solid var(--color-navy)",
                    boxShadow: "2px 2px 0px var(--color-navy)", fontWeight: 800, color: "var(--color-navy)",
                    cursor: "pointer"
                  }}>
                    <Upload size={16} /> Ganti Foto
                  </button>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", marginTop: "0.5rem" }}>JPG, PNG, GIF Max 2MB</div>
                </div>
              </div>
              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.85rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>NAMA LENGKAP</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="input-brutal" 
                  style={{ width: "100%", padding: "0.85rem", border: "2px solid var(--color-navy)", boxShadow: "3px 3px 0px var(--color-navy)" }} 
                />
              </div>
              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.85rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>EMAIL</label>
                <input 
                  type="email" 
                  value={editForm.email} 
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="input-brutal" 
                  style={{ width: "100%", padding: "0.85rem", border: "2px solid var(--color-navy)", boxShadow: "3px 3px 0px var(--color-navy)" }} 
                />
              </div>
              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.85rem", display: "block", marginBottom: "0.5rem", color: "var(--color-navy)" }}>NO. TELEPON</label>
                <input 
                  type="tel" 
                  value={editForm.phone} 
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="input-brutal" 
                  style={{ width: "100%", padding: "0.85rem", border: "2px solid var(--color-navy)", boxShadow: "3px 3px 0px var(--color-navy)" }} 
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => setIsEditing(false)} className="btn-brutal" style={{
                flex: 1, padding: "0.85rem", background: "var(--color-white)", color: "var(--color-navy)",
                fontWeight: 800, textAlign: "center", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)"
              }}>Batal</button>
              <button onClick={handleSaveProfile} className="btn-brutal" style={{
                flex: 2, padding: "0.85rem", background: "var(--color-lime)", color: "var(--color-navy)",
                fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                border: "2px solid var(--color-navy)", boxShadow: "4px 4px 0px var(--color-navy)"
              }}><Save size={18} /> Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
