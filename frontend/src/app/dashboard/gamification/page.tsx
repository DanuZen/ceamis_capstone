import { Trophy, Flame, Star, Medal, Zap, Target } from "lucide-react";

export default function GamificationPage() {
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

  return (
    <div style={{ paddingBottom: "2rem" }}>
      {/* Header Area */}
      <div style={{ marginBottom: "3rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div style={{
          width: "72px",
          height: "72px",
          background: "var(--color-purple)",
          borderRadius: "var(--radius-brutal-sm)",
          border: "3px solid var(--color-navy)",
          boxShadow: "4px 4px 0px var(--color-navy)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <Trophy size={40} color="var(--color-white)" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", marginBottom: "0.25rem", color: "var(--color-navy)", fontWeight: 800 }}>
            Gamifikasi
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
            Level up skill finansialmu! Kumpulkan badge dan selesaikan tantangan harian.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        {/* Streak HP Bar */}
        <div className="card-brutal animate-bounce-in" style={{ background: "var(--color-white)", border: "3px solid var(--color-navy)", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
              <Flame size={24} color="var(--color-orange)" strokeWidth={2.5} />
              Streak Aktif
            </h3>
            <span className="badge-brutal badge-brutal--orange" style={{ padding: "0.3rem 0.75rem", fontSize: "0.875rem" }}>5 Hari</span>
          </div>
          <div className="progress-brutal" style={{ height: "28px", border: "3px solid var(--color-navy)" }}>
            <div className="progress-brutal__fill" style={{ width: "71%", background: "var(--color-orange)", borderRight: "3px solid var(--color-navy)" }} />
            <div className="progress-brutal__label" style={{ fontSize: "0.9375rem", fontWeight: 700 }}>5 / 7 hari (target mingguan)</div>
          </div>
          <p style={{ marginTop: "1rem", fontSize: "0.9375rem", color: "var(--color-navy)", fontWeight: 600, margin: "1rem 0 0 0" }}>
            2 hari lagi untuk dapet badge <span style={{ color: "var(--color-purple)", fontWeight: 800 }}>"Konsisten"</span>! Semangat!
          </p>
        </div>

        {/* XP Progress */}
        <div className="card-brutal animate-bounce-in" style={{ animationDelay: "100ms", background: "var(--color-white)", border: "3px solid var(--color-navy)", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
              <Zap size={24} color="var(--color-purple)" strokeWidth={2.5} />
              Level & XP
            </h3>
            <span className="badge-brutal badge-brutal--purple" style={{ padding: "0.3rem 0.75rem", fontSize: "0.875rem" }}>Level 7</span>
          </div>
          <div className="progress-brutal" style={{ height: "28px", border: "3px solid var(--color-navy)" }}>
            <div className="progress-brutal__fill" style={{ width: "65%", background: "var(--color-purple)", borderRight: "3px solid var(--color-navy)" }} />
            <div className="progress-brutal__label" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-white)" }}>1950 / 3000 XP</div>
          </div>
          <p style={{ marginTop: "1rem", fontSize: "0.9375rem", color: "var(--color-navy)", fontWeight: 600, margin: "1rem 0 0 0" }}>
            Kumpulkan <span style={{ color: "var(--color-orange)", fontWeight: 800 }}>1050 XP</span> lagi untuk mencapai Level 8!
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "3rem" }}>
        {/* Badge Collection */}
        <div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--color-navy)" }}>
            Koleksi Badge
          </h2>
          <div
            className="stagger-children"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {badges.map((badge, index) => (
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
                }}
              >
                <div style={{ 
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
                  color: badge.unlocked ? (badge.color === "lime" ? "var(--color-navy)" : "var(--color-white)") : "var(--color-text-light)"
                }}>
                  <badge.icon size={32} strokeWidth={2.5} />
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                  {badge.name}
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                  {badge.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
