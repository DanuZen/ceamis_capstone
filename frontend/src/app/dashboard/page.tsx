import Link from "next/link";

const featureCards = [
  {
    href: "/dashboard/transactions",
    title: "Pencatatan Transaksi",
    desc: "Catat pemasukan & pengeluaran harian. Rapi, cepat, dan terorganisir.",
    color: "card-brutal--green",
  },
  {
    href: "/dashboard",
    title: "AI Insight & XAI",
    desc: "Insight keuangan otomatis dari AI. Pahami kenapa AI merekomendasikan itu.",
    color: "card-brutal--teal",
  },
  {
    href: "/dashboard/gamification",
    title: "Gamifikasi",
    desc: "Streak, Badge, dan Leaderboard. Makin rajin, makin banyak reward!",
    color: "card-brutal--purple",
  },
  {
    href: "/dashboard/warnings",
    title: "Warning System",
    desc: "Notifikasi sarkas kalau kebanyakan impulsif. Dijamin mikir dua kali!",
    color: "card-brutal--pink",
  },
  {
    href: "/dashboard/chatbot",
    title: "Chatbot AI",
    desc: "Konsultasi keuangan dengan chatbot yang paham bahasa Gen-Z.",
    color: "card-brutal--blue",
  },
  {
    href: "/dashboard/education",
    title: "Edukasi Adaptif",
    desc: "Materi finansial yang menyesuaikan kebutuhan dan level kamu.",
    color: "card-brutal--orange",
  },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Welcome Section */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.75rem",
            marginBottom: "0.5rem",
          }}
        >
          Halo, Pejuang Finansial!
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>
          Selamat datang di dashboard CEAMIS. Pilih fitur yang mau kamu jelajahi.
        </p>
      </div>

      {/* Quick Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
        className="stagger-children"
      >
        <div className="card-brutal" style={{ textAlign: "center", padding: "1.25rem" }}>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.5rem" }}>5 Hari</div>
          <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Streak Aktif</div>
        </div>
        <div className="card-brutal" style={{ textAlign: "center", padding: "1.25rem" }}>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.5rem" }}>Rp 2.4jt</div>
          <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Saldo Bulan Ini</div>
        </div>
        <div className="card-brutal" style={{ textAlign: "center", padding: "1.25rem" }}>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.5rem" }}>78/100</div>
          <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Skor Kesehatan</div>
        </div>
        <div className="card-brutal" style={{ textAlign: "center", padding: "1.25rem" }}>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.5rem" }}>#3</div>
          <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Ranking</div>
        </div>
      </div>

      {/* AI Insight Card */}
      <div className="card-brutal card-brutal--teal animate-bounce-in" style={{ marginBottom: "2rem", padding: "1.5rem" }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.125rem", marginBottom: "0.375rem" }}>
            AI Insight Hari Ini
          </h3>
          <p style={{ fontSize: "0.9375rem", lineHeight: 1.5, marginBottom: "0.5rem" }}>
            &ldquo;Pengeluaran F&amp;B kamu naik 23% minggu ini. Kayaknya kopi-kopi hits itu perlu di-review, bestie! Coba bawa tumbler dari rumah, bisa hemat Rp 150rb/minggu.&rdquo;
          </p>
          <div className="badge-brutal badge-brutal--green">Confidence: 89%</div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.25rem",
          marginBottom: "1rem",
        }}
      >
        Jelajahi Fitur
      </h2>
      <div
        className="stagger-children"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {featureCards.map((card) => (
          <Link key={card.href} href={card.href} style={{ textDecoration: "none" }}>
            <div className={`card-brutal ${card.color}`} style={{ minHeight: 140, cursor: "pointer" }}>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.25rem",
                  marginBottom: "0.375rem",
                }}
              >
                {card.title}
              </h3>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
