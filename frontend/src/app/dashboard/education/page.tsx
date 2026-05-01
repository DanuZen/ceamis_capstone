export default function EducationPage() {
  const modules = [
    {
      id: 1,
      title: "Dasar-Dasar Budgeting",
      desc: "Belajar membuat anggaran bulanan yang realistis dan bisa dijalankan.",
      level: "Beginner",
      duration: "5 menit",
      color: "card-brutal--green",
      progress: 100,
    },
    {
      id: 2,
      title: "Emergency Fund 101",
      desc: "Kenapa kamu HARUS punya dana darurat dan cara mulai dari Rp 0.",
      level: "Beginner",
      duration: "7 menit",
      color: "card-brutal--teal",
      progress: 60,
    },
    {
      id: 3,
      title: "Investasi untuk Pemula",
      desc: "Reksadana, saham, crypto? Mana yang cocok buat Gen-Z? Kita bahas!",
      level: "Intermediate",
      duration: "10 menit",
      color: "card-brutal--blue",
      progress: 0,
    },
    {
      id: 4,
      title: "Psikologi Belanja Impulsif",
      desc: "Kenapa otak kita suka checkout dan gimana cara hack-nya!",
      level: "Intermediate",
      duration: "8 menit",
      color: "card-brutal--pink",
      progress: 0,
    },
    {
      id: 5,
      title: "Manajemen Utang Sehat",
      desc: "Utang bukan musuh! Pelajari cara kelola utang biar nggak jadi beban.",
      level: "Advanced",
      duration: "12 menit",
      color: "card-brutal--purple",
      progress: 0,
    },
    {
      id: 6,
      title: "Financial Goal Setting",
      desc: "Cara bikin target keuangan SMART yang achievable dan motivating.",
      level: "Advanced",
      duration: "10 menit",
      color: "card-brutal--orange",
      progress: 0,
    },
  ];

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "Beginner": return "badge-brutal--green";
      case "Intermediate": return "badge-brutal--blue";
      case "Advanced": return "badge-brutal--purple";
      default: return "";
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", marginBottom: "0.5rem" }}>
          Edukasi Finansial
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>
          Materi finansial yang disesuaikan dengan kebutuhan dan level kamu. Belajar sambil main!
        </p>
      </div>

      {/* Learning Progress */}
      <div className="card-brutal card-brutal--yellow animate-bounce-in" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.125rem" }}>
            Progress Belajar
          </h3>
          <span className="badge-brutal badge-brutal--green">1 / 6 Modul</span>
        </div>
        <div className="progress-brutal">
          <div className="progress-brutal__fill" style={{ width: "27%", background: "linear-gradient(90deg, var(--color-orange), var(--color-yellow))" }} />
          <div className="progress-brutal__label">27% selesai</div>
        </div>
        <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
          Selesaikan 3 modul untuk dapet badge &ldquo;Bookworm&rdquo;!
        </p>
      </div>

      {/* Module Cards */}
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", marginBottom: "1rem" }}>
        Pilih Modul
      </h2>
      <div
        className="stagger-children"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {modules.map((mod) => (
          <div key={mod.id} className={`card-brutal ${mod.color}`} style={{ cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.125rem" }}>
                {mod.title}
              </h3>
              <span className={`badge-brutal ${getLevelBadge(mod.level)}`}>{mod.level}</span>
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.5, marginBottom: "0.75rem" }}>{mod.desc}</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{mod.duration}</span>
              {mod.progress === 100 ? (
                <span className="badge-brutal badge-brutal--green">Selesai</span>
              ) : mod.progress > 0 ? (
                <span className="badge-brutal badge-brutal--orange">{mod.progress}%</span>
              ) : (
                <span className="badge-brutal" style={{ background: "var(--color-surface)" }}>Mulai</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
