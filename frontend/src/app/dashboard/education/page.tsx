import { BookOpen, Award, PlayCircle, Clock } from "lucide-react";

export default function EducationPage() {
  const modules = [
    {
      id: 1,
      title: "Dasar-Dasar Budgeting",
      desc: "Belajar membuat anggaran bulanan yang realistis dan bisa dijalankan.",
      level: "Beginner",
      duration: "5 menit",
      color: "lime",
      progress: 100,
    },
    {
      id: 2,
      title: "Emergency Fund 101",
      desc: "Kenapa kamu HARUS punya dana darurat dan cara mulai dari Rp 0.",
      level: "Beginner",
      duration: "7 menit",
      color: "purple",
      progress: 60,
    },
    {
      id: 3,
      title: "Investasi untuk Pemula",
      desc: "Reksadana, saham, crypto? Mana yang cocok buat Gen-Z? Kita bahas!",
      level: "Intermediate",
      duration: "10 menit",
      color: "orange",
      progress: 0,
    },
    {
      id: 4,
      title: "Psikologi Belanja Impulsif",
      desc: "Kenapa otak kita suka checkout dan gimana cara hack-nya!",
      level: "Intermediate",
      duration: "8 menit",
      color: "lime",
      progress: 0,
    },
    {
      id: 5,
      title: "Manajemen Utang Sehat",
      desc: "Utang bukan musuh! Pelajari cara kelola utang biar nggak jadi beban.",
      level: "Advanced",
      duration: "12 menit",
      color: "purple",
      progress: 0,
    },
    {
      id: 6,
      title: "Financial Goal Setting",
      desc: "Cara bikin target keuangan SMART yang achievable dan motivating.",
      level: "Advanced",
      duration: "10 menit",
      color: "orange",
      progress: 0,
    },
  ];

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "Beginner": return "badge-brutal--lime";
      case "Intermediate": return "badge-brutal--orange";
      case "Advanced": return "badge-brutal--purple";
      default: return "";
    }
  };

  return (
    <div style={{ paddingBottom: "2rem" }}>
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
          <BookOpen size={40} color="var(--color-navy)" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", marginBottom: "0.25rem", color: "var(--color-navy)", fontWeight: 800 }}>
            Edukasi Finansial
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
            Materi finansial yang disesuaikan dengan kebutuhan dan level kamu. Belajar sambil main!
          </p>
        </div>
      </div>

      {/* Learning Progress */}
      <div className="card-brutal animate-bounce-in" style={{ marginBottom: "3rem", background: "var(--color-white)", border: "3px solid var(--color-navy)", padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", margin: 0 }}>
            <Award size={28} color="var(--color-orange)" strokeWidth={2.5} />
            Progress Belajar
          </h3>
          <span className="badge-brutal badge-brutal--lime" style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>1 / 6 Modul Selesai</span>
        </div>
        <div className="progress-brutal" style={{ height: "24px", border: "3px solid var(--color-navy)" }}>
          <div className="progress-brutal__fill" style={{ width: "27%", background: "var(--color-orange)", borderRight: "3px solid var(--color-navy)" }} />
          <div className="progress-brutal__label" style={{ fontSize: "0.9375rem", fontWeight: 700 }}>27% selesai</div>
        </div>
        <p style={{ marginTop: "1rem", fontSize: "1rem", color: "var(--color-navy)", fontWeight: 600, margin: "1rem 0 0 0" }}>
          Selesaikan 3 modul untuk dapet badge <span style={{ color: "var(--color-purple)", fontWeight: 800 }}>"Bookworm"</span>!
        </p>
      </div>

      {/* Module Cards */}
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--color-navy)" }}>
        Pilih Modul
      </h2>
      <div
        className="stagger-children"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {modules.map((mod) => (
          <div key={mod.id} className={`card-brutal landing-feature-card--${mod.color}`} style={{ cursor: "pointer", display: "flex", flexDirection: "column", padding: "1.5rem", height: "100%" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-brutal-sm)",
                border: "2px solid var(--color-navy)",
                background: "var(--color-white)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "2px 2px 0px var(--color-navy)"
              }}>
                <PlayCircle size={24} color="var(--color-navy)" strokeWidth={2.5} />
              </div>
              <span className={`badge-brutal ${getLevelBadge(mod.level)}`} style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}>{mod.level}</span>
            </div>
            
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "var(--color-navy)", marginBottom: "0.5rem" }}>
              {mod.title}
            </h3>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--color-text-muted)", marginBottom: "1.5rem", flex: 1 }}>
              {mod.desc}
            </p>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "2px solid rgba(10, 25, 47, 0.1)" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--color-navy)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Clock size={14} /> {mod.duration}
              </span>
              {mod.progress === 100 ? (
                <span className="badge-brutal badge-brutal--lime" style={{ boxShadow: "none" }}>Selesai</span>
              ) : mod.progress > 0 ? (
                <span className="badge-brutal badge-brutal--orange" style={{ boxShadow: "none" }}>{mod.progress}%</span>
              ) : (
                <span className="badge-brutal" style={{ background: "var(--color-white)", boxShadow: "none", color: "var(--color-navy)" }}>Mulai</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
