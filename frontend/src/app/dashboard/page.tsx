"use client";

import Link from "next/link";
import { 
  Wallet, 
  Sparkles, 
  User, 
  Flame, 
  Bot, 
  BookOpen,
  ArrowRight,
  ShieldAlert,
  TrendingUp,
  Target,
  BarChart3
} from "lucide-react";

const featureCards = [
  {
    href: "/dashboard/transactions",
    title: "Pencatatan Transaksi",
    desc: "Catat pemasukan & pengeluaran harian. Rapi, cepat, dan terorganisir.",
    color: "purple",
    icon: Wallet
  },
  {
    href: "/dashboard",
    title: "AI Insight & XAI",
    desc: "Insight keuangan otomatis dari AI. Pahami kenapa AI merekomendasikan itu.",
    color: "lime",
    icon: Sparkles
  },
  {
    href: "/dashboard/warnings",
    title: "Warning System",
    desc: "Notifikasi sarkas kalau kebanyakan impulsif. Dijamin mikir dua kali!",
    color: "orange",
    icon: Flame
  },
  {
    href: "/dashboard/chatbot",
    title: "Chatbot AI",
    desc: "Konsultasi keuangan dengan chatbot yang paham bahasa Gen-Z.",
    color: "purple",
    icon: Bot
  },
  {
    href: "/dashboard/education",
    title: "Edukasi Adaptif",
    desc: "Materi finansial yang menyesuaikan kebutuhan dan level kamu.",
    color: "lime",
    icon: BookOpen
  },
  {
    href: "/dashboard/profile",
    title: "Profil & Pencapaian",
    desc: "Lihat badge, streak, dan statistik pencapaian finansialmu.",
    color: "orange",
    icon: User
  },
];

const RECENT_TRANSACTIONS = [
  { id: 1, name: "Kopi Kenangan Mantan", category: "F&B", amount: -25000, date: "Hari ini", type: "expense" },
  { id: 2, name: "Gaji Freelance", category: "Income", amount: 1500000, date: "Kemarin", type: "income" },
  { id: 3, name: "Netflix Subscription", category: "Entertainment", amount: -54000, date: "2 Hari lalu", type: "expense" },
  { id: 4, name: "Topup OVO", category: "Wallet", amount: -100000, date: "2 Hari lalu", type: "expense" },
];

export default function DashboardPage() {
  // Dynamic label from AI cluster — will come from API/context
  const userLabel = "Si Hemat";

  return (
    <div style={{ paddingBottom: "2rem" }}>
      {/* Welcome Section — simplified, no duplicate level/streak badges */}
      <div style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2.5rem",
            fontWeight: 800,
            marginTop: "0.5rem",
            marginBottom: "0.25rem",
            color: "var(--color-navy)"
          }}
        >
          Halo, <span style={{ color: "var(--color-purple)" }}>Danu Zen!</span>
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "1rem", maxWidth: "600px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          Siap untuk mengontrol keuanganmu hari ini?
          <span className="badge-brutal badge-brutal--lime" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.2rem 0.6rem", fontSize: "0.75rem" }}>
            {userLabel}
          </span>
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
        className="stagger-children"
      >
        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div className="landing-feature-card__icon-box" style={{ background: "var(--color-lime)", width: "48px", height: "48px", minWidth: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <Flame size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.5rem" }}>5 Hari</div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Streak Aktif</div>
          </div>
        </div>
        
        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div className="landing-feature-card__icon-box" style={{ background: "var(--color-purple)", width: "48px", height: "48px", minWidth: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <Wallet size={24} color="var(--color-white)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.5rem" }}>Rp 2.4jt</div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Saldo Bulan Ini</div>
          </div>
        </div>

        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div className="landing-feature-card__icon-box" style={{ background: "var(--color-orange)", width: "48px", height: "48px", minWidth: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <Target size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.5rem" }}>78/100</div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Skor Kesehatan</div>
          </div>
        </div>

        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div className="landing-feature-card__icon-box" style={{ background: "var(--color-white)", width: "48px", height: "48px", minWidth: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <BarChart3 size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.5rem" }}>42</div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Transaksi Bulan Ini</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "2rem", marginBottom: "3rem" }}>
        {/* Main Content Area */}
        <div style={{ flex: "1 1 60%", minWidth: "300px" }}>
          {/* AI Insight Card */}
          <div className="card-brutal landing-edukasi__card--lime animate-bounce-in" style={{ marginBottom: "2.5rem", padding: "1.5rem", position: "relative", overflow: "hidden", background: "var(--color-lime)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem", position: "relative", zIndex: 2 }}>
              <div className="landing-edukasi__icon-box" style={{ background: "var(--color-lime)", color: "var(--color-navy)", width: "64px", height: "64px", minWidth: "64px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "3px 3px 0px var(--color-navy)" }}>
                <Bot size={32} strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", margin: 0, color: "var(--color-navy)" }}>
                    AI Insight Hari Ini
                  </h3>
                  <div className="badge-brutal badge-brutal--purple" style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}>Confidence: 89%</div>
                </div>
                <p style={{ fontSize: "1.0625rem", lineHeight: 1.6, marginBottom: "1.25rem", color: "var(--color-navy)", fontWeight: 600 }}>
                  &ldquo;Pengeluaran F&amp;B kamu naik 23% minggu ini. Kayaknya kopi-kopi hits itu perlu di-review, bestie! Coba bawa tumbler dari rumah, bisa hemat Rp 150rb/minggu.&rdquo;
                </p>
                <button className="btn-brutal btn-brutal--sm" style={{ background: "var(--color-navy)", color: "var(--color-white)", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  Lihat Detail <ArrowRight size={16} />
                </button>
              </div>
            </div>
            {/* Decoration */}
            <div style={{ position: "absolute", top: "-20px", right: "-20px", opacity: 0.15, transform: "rotate(15deg)", zIndex: 1 }}>
              <Sparkles size={160} color="var(--color-navy)" />
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.5rem",
                margin: 0
              }}
            >
              Jelajahi Fitur
            </h2>
          </div>
          
          <div
            className="stagger-children"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {featureCards.map((card) => (
              <Link key={card.href} href={card.href} style={{ textDecoration: "none" }}>
                <div className={`landing-feature-card card-brutal landing-feature-card--${card.color}`} style={{ height: "100%", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div className="landing-feature-card__icon-box" style={{ width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", background: `var(--color-${card.color})` }}>
                    <card.icon size={28} strokeWidth={2.5} color="var(--color-navy)" />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.25rem",
                        marginBottom: "0.5rem",
                        color: "var(--color-navy)"
                      }}
                    >
                      {card.title}
                    </h3>
                    <p style={{ fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--color-text-muted)", margin: 0 }}>{card.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar Area (Recent Activity) */}
        <div style={{ flex: "1 1 30%", minWidth: "280px" }}>
          <div className="card-brutal" style={{ padding: "1.5rem", height: "100%", display: "flex", flexDirection: "column", background: "var(--color-white)" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <TrendingUp size={24} color="var(--color-purple)" /> Aktivitas Terakhir
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", flex: 1 }}>
              {RECENT_TRANSACTIONS.map((trx, i) => (
                <div key={trx.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "1.25rem", borderBottom: i !== RECENT_TRANSACTIONS.length - 1 ? "2px solid rgba(10, 25, 47, 0.1)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ 
                      width: "44px", 
                      height: "44px", 
                      borderRadius: "var(--radius-brutal-sm)", 
                      background: trx.type === 'income' ? 'var(--color-lime)' : 'var(--color-orange)',
                      border: "2px solid var(--color-navy)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "2px 2px 0px var(--color-navy)"
                    }}>
                      {trx.type === 'income' ? <Wallet size={20} color="var(--color-navy)" /> : <ShieldAlert size={20} color="var(--color-navy)" />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-navy)" }}>{trx.name}</div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginTop: "0.1rem" }}>{trx.date} • {trx.category}</div>
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: 800, 
                    fontFamily: "var(--font-heading)",
                    color: trx.type === 'income' ? 'var(--color-navy)' : 'var(--color-danger)',
                    fontSize: "1rem"
                  }}>
                    {trx.type === 'income' ? '+' : '-'}Rp{(Math.abs(trx.amount)/1000).toLocaleString('id-ID')}k
                  </div>
                </div>
              ))}
            </div>

            <Link href="/dashboard/transactions" className="btn-brutal btn-brutal--secondary" style={{ marginTop: "1.5rem", textAlign: "center", display: "block", width: "100%" }}>
              Lihat Semua Transaksi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
