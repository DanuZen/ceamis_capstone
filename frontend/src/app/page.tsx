"use client";

import Link from "next/link";
import { 
  Wallet, 
  Sparkles, 
  Trophy, 
  Flame, 
  Bot, 
  BookOpen,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Target,
  Zap,
  Eye,
  PiggyBank,
  ShieldAlert,
  GraduationCap,
  UserPlus,
  PenLine,
  BrainCircuit,
  Rocket
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

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

const STEPS = [
  { num: "01", title: "Daftar Akun", desc: "Buat akun gratis dalam 30 detik. Tanpa ribet, tanpa kartu kredit.", icon: UserPlus, color: "purple" },
  { num: "02", title: "Catat Keuanganmu", desc: "Mulai catat pemasukan & pengeluaran harianmu dengan mudah.", icon: PenLine, color: "lime" },
  { num: "03", title: "Dapatkan Insight AI", desc: "AI kami analisis pola keuanganmu dan kasih rekomendasi cerdas.", icon: BrainCircuit, color: "orange" },
  { num: "04", title: "Level Up!", desc: "Kumpulkan streak, badge, dan naik peringkat di leaderboard!", icon: Rocket, color: "purple" },
];

const LEADERBOARD_DATA = [
  { rank: 1, name: "Rina S.", streak: 45, badge: 12, score: 9800, medal: "gold" },
  { rank: 2, name: "Budi P.", streak: 38, badge: 10, score: 8650, medal: "silver" },
  { rank: 3, name: "Sari M.", streak: 32, badge: 9, score: 7920, medal: "bronze" },
  { rank: 4, name: "Andi K.", streak: 28, badge: 7, score: 6540, medal: "" },
  { rank: 5, name: "Dina W.", streak: 25, badge: 6, score: 5890, medal: "" },
];

const EDUKASI_POINTS = [
  {
    title: "Kenali Pola Pengeluaranmu",
    desc: "Riset menunjukkan 68% Gen-Z tidak melacak pengeluaran harian mereka. Dengan memahami ke mana uang pergi, kamu bisa mengidentifikasi kebocoran keuangan dan menghemat hingga 30% setiap bulannya.",
    icon: Eye,
    color: "purple",
    stat: "68%",
    statLabel: "Gen-Z tidak tracking",
  },
  {
    title: "Bangun Kebiasaan Menabung Sejak Dini",
    desc: "Mulai menabung 10-20% dari penghasilan di usia muda memberi keuntungan besar berkat compound interest. Rp 500.000/bulan yang ditabung sejak usia 20 bisa menjadi ratusan juta di usia 30.",
    icon: PiggyBank,
    color: "lime",
    stat: "10-20%",
    statLabel: "ideal untuk ditabung",
  },
  {
    title: "Hindari Impulsive Spending",
    desc: "Fenomena FOMO dan flash sale menyebabkan 73% anak muda melakukan pembelian impulsif. Dengan 'aturan 24 jam' — tunda pembelian 24 jam sebelum checkout — kamu bisa mengurangi pengeluaran tidak perlu secara signifikan.",
    icon: ShieldAlert,
    color: "orange",
    stat: "73%",
    statLabel: "belanja impulsif",
  },
  {
    title: "Literasi Keuangan = Masa Depan Cerah",
    desc: "Menurut OJK, tingkat literasi keuangan Gen-Z Indonesia masih di bawah 50%. Memahami konsep dasar seperti budgeting, investasi, dan manajemen utang adalah fondasi untuk kemandirian finansial.",
    icon: GraduationCap,
    color: "purple",
    stat: "<50%",
    statLabel: "literasi keuangan",
  },
];

const TESTIMONIALS = [
  { 
    text: "Sumpah, AI-nya jujur banget pas ngeroasting pengeluaran kopi gue. Sekarang tabungan gue jadi lebih sehat!", 
    name: "Jessica A.", 
    handle: "@jess_finance", 
    color: "purple" 
  },
  { 
    text: "Badge-nya bikin ketagihan nyatet. Berasa main game tapi dapet cuan karena pengeluaran jadi lebih terkontrol.", 
    name: "Kevin R.", 
    handle: "@kvn_mulyono", 
    color: "lime" 
  },
  { 
    text: "Dulu sering kena FOMO flash sale, sekarang ada CEAMIS yang selalu ngingetin buat mikir 24 jam. Mantap!", 
    name: "Sari K.", 
    handle: "@sari_kurnia", 
    color: "navy" 
  },
];

const FAQ_DATA = [
  { 
    q: "Apakah data keuanganku aman?", 
    a: "Sangat aman! Kami menggunakan enkripsi tingkat bank dan tidak pernah membagikan data pribadimu ke pihak ketiga tanpa izin." 
  },
  { 
    q: "Berapa biaya langganannya?", 
    a: "CEAMIS bisa digunakan 100% gratis untuk fitur dasar. Kami juga punya fitur Premium untuk kamu yang mau analisis AI lebih mendalam." 
  },
  { 
    q: "Gimana cara AI-nya ngeroasting aku?", 
    a: "AI kami menganalisis pola transaksi kamu. Kalau kamu beli barang impulsif yang nggak perlu, AI bakal kasih notifikasi 'pedes' biar kamu sadar!" 
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function LandingPage() {
  const hero = useInView();
  const stats = useInView();
  const features = useInView();
  const edukasi = useInView();
  const leaderboard = useInView();
  const testimonials = useInView();
  const steps = useInView();
  const faq = useInView();
  const cta = useInView();

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="landing-page">
      {/* ── Top Banner ── */}
      <div className="landing-banner">
        <div className="landing-banner__track">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="landing-banner__item">
              <span className="landing-banner__dot" />
              Platform keuangan Gen-Z paling fun se-Indonesia
            </div>
          ))}
        </div>
      </div>

      {/* ── Navbar ── */}
      <nav className="landing-nav">
        <div className="landing-nav__brand">
          <div className="landing-nav__logo" style={{ width: "64px", height: "64px", background: "transparent", border: "none", boxShadow: "none" }}>
            <img src="/images/logo_ceamis.png" alt="CEAMIS Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <span className="landing-nav__name">CEAMIS</span>
        </div>
        <div className="landing-nav__links">
          <Link href="/auth" className="btn-brutal btn-brutal--secondary btn-brutal--sm">
            Login
          </Link>
          <Link href="/auth" className="btn-brutal btn-brutal--primary btn-brutal--sm">
            Daftar Gratis
          </Link>
        </div>
      </nav>

      <section
        ref={hero.ref}
        className={`landing-hero ${hero.visible ? "landing-hero--visible" : ""}`}
      >
        <div className="landing-container landing-hero__wrapper">
          <div className="landing-hero__content">
            <div className="badge-brutal badge-brutal--purple" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
              Baru — Fitur Chatbot AI sudah tersedia!
            </div>
            <h1 className="landing-hero__title">
              Kontrol Impuls<br />
              Keuanganmu,{" "}
              <span className="landing-hero__highlight">Level Up</span>{" "}
              Tiap Hari
            </h1>
            <p className="landing-hero__subtitle">
              CEAMIS bantu Gen-Z Indonesia catat keuangan dengan cara yang fun — AI insight, gamifikasi seru, dan notifikasi sarkas yang bikin kamu mikir dua kali sebelum checkout!
            </p>
            <div className="landing-hero__actions">
              <Link href="/auth" className="btn-brutal btn-brutal--primary btn-brutal--lg">
                Mulai Sekarang — Gratis!
              </Link>
              <Link href="#fitur" className="btn-brutal btn-brutal--secondary btn-brutal--lg">
                Lihat Fitur
              </Link>
            </div>
          </div>

          <div className="landing-hero__visual">
            <div className="landing-hero__blob" />
            <img 
              src="/images/hero.png" 
              alt="CEAMIS Illustration" 
              className="landing-hero__main-img"
            />
            {/* Floating Badges */}
            <div className="landing-hero__float landing-hero__float--1">
              <Zap size={18} strokeWidth={3} /> Level 12 Reached
            </div>
            <div className="landing-hero__float landing-hero__float--2">
              <TrendingUp size={18} strokeWidth={3} /> 15 Day Streak
            </div>
            <div className="landing-hero__float landing-hero__float--3">
              <Target size={18} strokeWidth={3} /> Rp 500k Saved
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section
        ref={stats.ref}
        className={`landing-stats ${stats.visible ? "landing-stats--visible" : ""}`}
      >
        <div className="landing-stats__item card-brutal">
          <div className="landing-stats__value">10K+</div>
          <div className="landing-stats__label">Impuls Terkontrol</div>
        </div>
        <div className="landing-stats__item card-brutal">
          <div className="landing-stats__value">Rp 1M+</div>
          <div className="landing-stats__label">Tabungan Terselamatkan</div>
        </div>
        <div className="landing-stats__item card-brutal">
          <div className="landing-stats__value">4.9/5</div>
          <div className="landing-stats__label">Rating Gen-Z</div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section
        id="fitur"
        ref={features.ref}
        className={`landing-features ${features.visible ? "landing-features--visible" : ""}`}
      >
        <div className="landing-section-label">
          <span className="badge-brutal badge-brutal--purple">Fitur Unggulan</span>
        </div>
        <h2 className="landing-section-title">
          Semua yang kamu butuhkan untuk <span style={{ color: "var(--color-primary)" }}>cerdas finansial</span>
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
                <h3 className="landing-feature-card__title" style={{ color: "#0A192F", display: "block" }}>
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

      {/* ── Edukasi Keuangan ── */}
      <section
        ref={edukasi.ref}
        className={`landing-edukasi ${edukasi.visible ? "landing-edukasi--visible" : ""}`}
      >
        <div className="landing-container">
          <div className="landing-section-label">
            <span className="badge-brutal badge-brutal--lime">Edukasi Finansial</span>
          </div>
          <h2 className="landing-section-title">
            Mengapa <span style={{ color: "var(--color-lime)" }}>pengelolaan keuangan</span> itu penting?
          </h2>
          <p className="landing-section-subtitle">
            Literasi keuangan adalah kunci menuju kemandirian finansial — terutama bagi generasi muda
          </p>

          <div className="landing-edukasi__intro card-brutal">
            <p>
              Di era digital, godaan belanja online ada di ujung jari. <strong>Gen-Z Indonesia</strong> menghadapi tantangan unik: gaya hidup konsumtif, FOMO, dan kurangnya edukasi keuangan formal. CEAMIS hadir untuk mengubah cara pandang generasi muda terhadap uang — dari sekadar menghabiskan menjadi <strong>mengelola dengan cerdas</strong>.
            </p>
          </div>

          <div className="landing-edukasi__grid">
            {EDUKASI_POINTS.map((point, i) => (
              <div key={i} className={`landing-edukasi__card card-brutal landing-edukasi__card--${point.color}`}>
                <div className="landing-edukasi__card-header">
                  <div className={`landing-edukasi__icon-box landing-edukasi__icon-box--${point.color}`}>
                    <point.icon size={24} strokeWidth={2.5} />
                  </div>
                  <div className="landing-edukasi__stat-badge">
                    <span className="landing-edukasi__stat-value">{point.stat}</span>
                    <span className="landing-edukasi__stat-label">{point.statLabel}</span>
                  </div>
                </div>
                <h3 className="landing-edukasi__card-title">{point.title}</h3>
                <p className="landing-edukasi__card-desc">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leaderboard Preview ── */}
      <section
        ref={leaderboard.ref}
        className={`landing-leaderboard ${leaderboard.visible ? "landing-leaderboard--visible" : ""}`}
      >
        <div className="landing-section-label">
          <span className="badge-brutal badge-brutal--purple">Leaderboard</span>
        </div>
        <h2 className="landing-section-title">
          Kompetisi sehat untuk <span style={{ color: "var(--color-primary)" }}>motivasi menabung</span>
        </h2>
        <p className="landing-section-subtitle">
          Lihat siapa yang paling konsisten dalam mengelola keuangan mereka
        </p>

        <div className="landing-leaderboard__table card-brutal">
          {/* Header */}
          <div className="landing-leaderboard__header">
            <span className="landing-leaderboard__col landing-leaderboard__col--rank">Rank</span>
            <span className="landing-leaderboard__col landing-leaderboard__col--name">Pengguna</span>
            <span className="landing-leaderboard__col">Streak</span>
            <span className="landing-leaderboard__col">Badge</span>
            <span className="landing-leaderboard__col landing-leaderboard__col--score">Skor</span>
          </div>
          {/* Rows */}
          {LEADERBOARD_DATA.map((user) => (
            <div
              key={user.rank}
              className={`landing-leaderboard__row ${user.medal ? `landing-leaderboard__row--${user.medal}` : ""}`}
            >
              <span className="landing-leaderboard__col landing-leaderboard__col--rank">
                <span className={`landing-leaderboard__rank-num ${user.medal ? `landing-leaderboard__rank-num--${user.medal}` : ""}`}>
                  {user.rank}
                </span>
              </span>
              <span className="landing-leaderboard__col landing-leaderboard__col--name">
                <span className="landing-leaderboard__avatar">{user.name.charAt(0)}</span>
                {user.name}
              </span>
              <span className="landing-leaderboard__col">
                <strong>{user.streak}</strong> hari
              </span>
              <span className="landing-leaderboard__col">
                <strong>{user.badge}</strong> badge
              </span>
              <span className="landing-leaderboard__col landing-leaderboard__col--score">
                <strong>{isMounted ? user.score.toLocaleString() : "..."}</strong> pts
              </span>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "1.5rem" }}>
          * Data di atas merupakan contoh simulasi leaderboard CEAMIS
        </p>
      </section>

      {/* ── Testimonials ── */}
      <section
        ref={testimonials.ref}
        className={`landing-testimonials ${testimonials.visible ? "landing-testimonials--visible" : ""}`}
      >
        <div className="landing-container">
          <div className="landing-section-label">
            <span className="badge-brutal badge-brutal--purple">Apa Kata Mereka?</span>
          </div>
          <h2 className="landing-section-title" style={{ color: "var(--color-navy)" }}>
            Ribuan Gen-Z sudah <span style={{ color: "var(--color-primary)" }}>level up</span> finansial
          </h2>
          <p className="landing-section-subtitle" style={{ color: "var(--color-navy)" }}>
            Bukan cuma teori, tapi aksi nyata buat dompet lebih sehat
          </p>

          <div className="landing-testimonials__grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`testimonial-bubble testimonial-bubble--${t.color}`}>
                <p className="testimonial-bubble__text">"{t.text}"</p>
                <div className="testimonial-bubble__user">
                  <div className="testimonial-bubble__avatar">
                    {t.name.charAt(0)}
                  </div>
                  <div className="testimonial-bubble__info">
                    <span className="testimonial-bubble__name">{t.name}</span>
                    <span className="testimonial-bubble__handle">{t.handle}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        ref={steps.ref}
        className={`landing-steps ${steps.visible ? "landing-steps--visible" : ""}`}
      >
        <div className="landing-section-label">
          <span className="badge-brutal badge-brutal--purple">Cara Kerja</span>
        </div>
        <h2 className="landing-section-title">
          Mulai dalam <span style={{ color: "var(--color-primary)" }}>4 langkah</span> mudah
        </h2>

        <div className="landing-steps__grid">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`landing-step-card card-brutal landing-step-card--${s.color}`}
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && <div className="landing-step-card__connector" />}
              <div className={`landing-step-card__num-badge landing-step-card__num-badge--${s.color}`}>
                {s.num}
              </div>
              <div className={`landing-step-card__icon-circle landing-step-card__icon-circle--${s.color}`}>
                <s.icon size={28} strokeWidth={2.5} />
              </div>
              <h3 className="landing-step-card__title">{s.title}</h3>
              <p className="landing-step-card__desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section
        ref={faq.ref}
        className={`landing-faq ${faq.visible ? "landing-faq--visible" : ""}`}
      >
        <div className="landing-container landing-container--narrow">
          <div className="landing-section-label">
            <span className="badge-brutal badge-brutal--purple">FAQ</span>
          </div>
          <h2 className="landing-section-title" style={{ color: "var(--color-navy)" }}>Pertanyaan yang Sering Muncul</h2>
          <p className="landing-section-subtitle" style={{ color: "var(--color-navy)" }}>Punya pertanyaan lain? Kami siap menjawab!</p>

          <div className="landing-faq__list">
            {FAQ_DATA.map((item, i) => (
              <div
                key={i}
                className={`faq-item ${openFaq === i ? "faq-item--open" : ""}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="faq-item__question">
                  {item.q}
                  <div className="faq-item__icon">+</div>
                </div>
                <div className="faq-item__answer">
                  <div className="faq-item__answer-text">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section
        ref={cta.ref}
        className={`landing-cta ${cta.visible ? "landing-cta--visible" : ""}`}
      >
        <div className="landing-cta__card">
          <div className="landing-cta__decoration" />
          <h2 className="landing-cta__title">Siap Jadi Cerdas Finansial?</h2>
          <p className="landing-cta__desc">
            Bergabung dengan ribuan Gen-Z Indonesia yang sudah mulai kontrol keuangan mereka. Gratis, tanpa ribet!
          </p>
          <Link href="/auth" className="btn-brutal btn-brutal--primary btn-brutal--lg">
            Gabung Sekarang — Gratis!
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-footer__inner">
          <div className="landing-footer__brand">
            <div className="landing-nav__logo" style={{ width: 56, height: 56, background: "transparent", border: "none", boxShadow: "none" }}>
              <img src="/images/logo_ceamis.png" alt="CEAMIS Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.125rem", color: "var(--color-white)" }}>CEAMIS</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.5)" }}>Control Every Awful Money Impulse System</div>
            </div>
          </div>
          <div className="landing-footer__copy">
            <p>&copy; 2026 CEAMIS — Dibuat oleh Tim CEAMIS</p>
            <p>Cerdas Finansial, Kontrol Impuls, Raih Masa Depan</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
