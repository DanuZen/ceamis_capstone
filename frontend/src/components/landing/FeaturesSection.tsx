import { Wallet, Sparkles, Trophy, Flame, Bot, BookOpen } from "lucide-react";

const FEATURES = [
  {
    title: "Pencatatan Keuangan",
    desc: "Catat pemasukan, pengeluaran, dan utang-piutang dengan cepat. Digital Ledger yang rapi dan gampang dipahami.",
    icon: Wallet,
    color: "purple"
  },
  {
    title: "AI Insight & XAI",
    desc: "Insight keuangan otomatis dari AI, plus penjelasan transparan (Explainable AI) yang mudah dipahami Gen-Z.",
    icon: Sparkles,
    color: "lime"
  },
  {
    title: "Gamifikasi Seru",
    desc: "Daily Streak, Badge Achievement, dan Leaderboard. Makin rajin catat, makin banyak reward!",
    icon: Trophy,
    color: "orange"
  },
  {
    title: "Gen-Z Warning System",
    desc: "Notifikasi sarkas & roasting kalau kamu kebanyakan impulsif. Dijamin bikin mikir sebelum checkout!",
    icon: Flame,
    color: "purple"
  },
  {
    title: "Chatbot Finansial AI",
    desc: "Tanya apa aja soal keuangan! Chatbot AI yang paham bahasa Gen-Z dan kasih solusi praktis.",
    icon: Bot,
    color: "lime"
  },
  {
    title: "Edukasi Adaptif",
    desc: "Materi edukasi finansial yang menyesuaikan level dan kebutuhan kamu. Belajar sambil main!",
    icon: BookOpen,
    color: "orange"
  },
];

export default function FeaturesSection({ inViewRef, isVisible }) {
  return (
    <section
      id="fitur"
      ref={inViewRef}
      className={`landing-features ${isVisible ? "landing-features--visible" : ""}`}
    >
      <div className="landing-section-label">
        <span className="badge-brutal badge-brutal--purple">Fitur Unggulan</span>
      </div>
      <h2 className="landing-section-title">
        Semua yang kamu butuhkan untuk <span className="text-primary">cerdas finansial</span>
      </h2>
      <p className="landing-section-subtitle">
        6 fitur canggih yang dirancang khusus buat Gen-Z Indonesia
      </p>

      <div className="landing-features__grid">
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className={`landing-feature-card card-brutal landing-feature-card--${f.color}`}
          >
            <div className="landing-feature-card__icon-box">
              <f.icon size={32} strokeWidth={2.5} />
            </div>
            <div className="landing-feature-card__content">
              <h3 className="landing-feature-card__title text-navy block">
                {f.title}
              </h3>
              <p className="landing-feature-card__desc">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
