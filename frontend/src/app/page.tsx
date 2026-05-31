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
  Rocket,
  ArrowUp
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

const getFeatures = (t: any) => [
  {
    title: t("landing.feature1Title"),
    desc: t("landing.feature1Desc"),
    icon: Wallet,
    color: "purple"
  },
  {
    title: t("landing.feature2Title"),
    desc: t("landing.feature2Desc"),
    icon: Sparkles,
    color: "lime"
  },
  {
    title: t("landing.feature3Title"),
    desc: t("landing.feature3Desc"),
    icon: Trophy,
    color: "orange"
  },
  {
    title: t("landing.feature4Title"),
    desc: t("landing.feature4Desc"),
    icon: Flame,
    color: "purple"
  },
  {
    title: t("landing.feature5Title"),
    desc: t("landing.feature5Desc"),
    icon: Bot,
    color: "lime"
  },
  {
    title: t("landing.feature6Title"),
    desc: t("landing.feature6Desc"),
    icon: BookOpen,
    color: "orange"
  },
];

const getSteps = (t: any) => [
  { num: "01", title: t("landing.step1Title"), desc: t("landing.step1Desc"), icon: UserPlus, color: "purple" },
  { num: "02", title: t("landing.step2Title"), desc: t("landing.step2Desc"), icon: PenLine, color: "lime" },
  { num: "03", title: t("landing.step3Title"), desc: t("landing.step3Desc"), icon: BrainCircuit, color: "orange" },
  { num: "04", title: t("landing.step4Title"), desc: t("landing.step4Desc"), icon: Rocket, color: "purple" },
];

const getLeaderboardData = () => [
  { rank: 1, name: "Rina S.", streak: 45, badge: 12, score: 9800, medal: "gold" },
  { rank: 2, name: "Budi P.", streak: 38, badge: 10, score: 8650, medal: "silver" },
  { rank: 3, name: "Sari M.", streak: 32, badge: 9, score: 7920, medal: "bronze" },
  { rank: 4, name: "Andi K.", streak: 28, badge: 7, score: 6540, medal: "" },
  { rank: 5, name: "Dina W.", streak: 25, badge: 6, score: 5890, medal: "" },
];

const getEdukasiPoints = (t: any) => [
  {
    title: t("landing.eduPoint1Title"),
    desc: t("landing.eduPoint1Desc"),
    icon: Eye,
    color: "purple",
    stat: "68%",
    statLabel: t("landing.eduPoint1Stat"),
  },
  {
    title: t("landing.eduPoint2Title"),
    desc: t("landing.eduPoint2Desc"),
    icon: PiggyBank,
    color: "lime",
    stat: "10-20%",
    statLabel: t("landing.eduPoint2Stat"),
  },
  {
    title: t("landing.eduPoint3Title"),
    desc: t("landing.eduPoint3Desc"),
    icon: ShieldAlert,
    color: "orange",
    stat: "73%",
    statLabel: t("landing.eduPoint3Stat"),
  },
  {
    title: t("landing.eduPoint4Title"),
    desc: t("landing.eduPoint4Desc"),
    icon: GraduationCap,
    color: "purple",
    stat: "<50%",
    statLabel: t("landing.eduPoint4Stat"),
  },
];

const getTestimonials = (t: any) => [
  { 
    text: t("landing.testi1"), 
    name: "Jessica A.", 
    handle: "@jess_finance", 
    color: "purple" 
  },
  { 
    text: t("landing.testi2"), 
    name: "Kevin R.", 
    handle: "@kvn_mulyono", 
    color: "lime" 
  },
  { 
    text: t("landing.testi3"), 
    name: "Sari K.", 
    handle: "@sari_kurnia", 
    color: "navy" 
  },
];

const getFaqData = (t: any) => [
  { 
    q: t("landing.faq1Q"), 
    a: t("landing.faq1A") 
  },
  { 
    q: t("landing.faq2Q"), 
    a: t("landing.faq2A") 
  },
  { 
    q: t("landing.faq3Q"), 
    a: t("landing.faq3A") 
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

  const { t, language, setLanguage } = useLanguage();

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="landing-page">
      {/* ── Top Banner ── */}
      <div className="landing-banner">
        <div className="landing-banner__track">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="landing-banner__item">
              <span className="landing-banner__dot" />
              {t("landing.banner")}
            </div>
          ))}
        </div>
      </div>

      {/* ── Navbar ── */}
      <nav className="landing-nav">
        <div className="landing-nav__brand">
          <div className="landing-nav__logo" style={{ width: "64px", height: "64px", background: "transparent", border: "none", boxShadow: "none" }}>
            <img src="/images/logo_stroke_black.png" alt="CEAMIS Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <span className="landing-nav__name">CEAMIS</span>
        </div>
        <div className="landing-nav__links">
          <button 
            onClick={() => setLanguage(language === "id" ? "en" : "id")} 
            className="btn-brutal btn-brutal--sm"
            style={{ 
              padding: "0.4rem 0.75rem", fontSize: "0.85rem", fontWeight: 800,
              background: "var(--color-white)", border: "2px solid var(--color-navy)",
              boxShadow: "2px 2px 0px var(--color-navy)", display: "flex", alignItems: "center", gap: "0.4rem",
              minWidth: "72px", justifyContent: "center"
            }}
          >
            <img 
              src={language === "id" ? "https://flagcdn.com/w20/id.png" : "https://flagcdn.com/w20/gb.png"} 
              alt={language === "id" ? "Indonesian Flag" : "English Flag"} 
              style={{ width: "20px", height: "auto", borderRadius: "2px", border: "1px solid rgba(0,0,0,0.1)" }} 
            />
            <span>{language === "id" ? "ID" : "EN"}</span>
          </button>
          <Link href="/auth" className="btn-brutal btn-brutal--secondary btn-brutal--sm">
            {t("navbar.login")}
          </Link>
          <Link href="/auth/register" className="btn-brutal btn-brutal--primary btn-brutal--sm">
            {t("navbar.register")}
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
              {t("landing.heroBadge")}
            </div>
            <h1 className="landing-hero__title">
              {t("landing.heroTitle1")}<br />
              {t("landing.heroTitle2")}{" "}
              <span className="landing-hero__highlight">{t("landing.heroHighlight")}</span>{" "}
              {t("landing.heroTitle3")}
            </h1>
            <p className="landing-hero__subtitle">
              {t("landing.heroSubtitle")}
            </p>
            <div className="landing-hero__actions">
              <Link href="/auth/register" className="btn-brutal btn-brutal--primary btn-brutal--lg">
                {t("landing.ctaStart")}
              </Link>
              <Link href="#fitur" className="btn-brutal btn-brutal--secondary btn-brutal--lg">
                {t("landing.ctaFeatures")}
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
              <Zap size={18} strokeWidth={3} /> Level 12 Unlocked
            </div>
            <div className="landing-hero__float landing-hero__float--2">
              <TrendingUp size={18} strokeWidth={3} /> 15-Day Streak
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
          <div className="landing-stats__label">{t("landing.statsImpulse")}</div>
        </div>
        <div className="landing-stats__item card-brutal">
          <div className="landing-stats__value">Rp 1M+</div>
          <div className="landing-stats__label">{t("landing.statsSaved")}</div>
        </div>
        <div className="landing-stats__item card-brutal">
          <div className="landing-stats__value">4.9/5</div>
          <div className="landing-stats__label">{t("landing.statsRating")}</div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section
        id="fitur"
        ref={features.ref}
        className={`landing-features ${features.visible ? "landing-features--visible" : ""}`}
      >
        <div className="landing-section-label">
          <span className="badge-brutal badge-brutal--purple">{t("landing.featuresTitle")}</span>
        </div>
        <h2 className="landing-section-title">
          {t("landing.featuresSubtitle")}
        </h2>

        <div className="landing-features__grid">
          {getFeatures(t).map((f, i) => (
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
            <span className="badge-brutal badge-brutal--lime">{t("landing.educationTitle")}</span>
          </div>
          <h2 className="landing-section-title">
            {t("landing.educationSubtitle")}
          </h2>

          <div className="landing-edukasi__intro card-brutal">
            <p dangerouslySetInnerHTML={{ __html: t("landing.educationIntro") }} />
          </div>

          <div className="landing-edukasi__grid">
            {getEdukasiPoints(t).map((point, i) => (
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
          <span className="badge-brutal badge-brutal--purple">{t("landing.leaderboardTitle")}</span>
        </div>
        <h2 className="landing-section-title">
          {t("landing.leaderboardSubtitle")}
        </h2>

        <div className="landing-leaderboard__table card-brutal">
          {/* Header */}
          <div className="landing-leaderboard__header">
            <span className="landing-leaderboard__col landing-leaderboard__col--rank">{t("landing.leaderboardRank")}</span>
            <span className="landing-leaderboard__col landing-leaderboard__col--name">{t("landing.leaderboardUser")}</span>
            <span className="landing-leaderboard__col">{t("landing.leaderboardStreak")}</span>
            <span className="landing-leaderboard__col">{t("landing.leaderboardBadge")}</span>
            <span className="landing-leaderboard__col landing-leaderboard__col--score">{t("landing.leaderboardScore")}</span>
          </div>
          {/* Rows */}
          {getLeaderboardData().map((user) => (
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
                <strong>{user.streak}</strong> {t("landing.leaderboardDays")}
              </span>
              <span className="landing-leaderboard__col">
                <strong>{user.badge}</strong> {t("landing.leaderboardBadgeLabel")}
              </span>
              <span className="landing-leaderboard__col landing-leaderboard__col--score">
                <strong>{isMounted ? user.score.toLocaleString() : "..."}</strong> {t("landing.leaderboardPts")}
              </span>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: "1.5rem" }}>
          {t("landing.leaderboardMock")}
        </p>
      </section>

      {/* ── Testimonials ── */}
      <section
        ref={testimonials.ref}
        className={`landing-testimonials ${testimonials.visible ? "landing-testimonials--visible" : ""}`}
      >
        <div className="landing-container">
          <div className="landing-section-label">
            <span className="badge-brutal badge-brutal--purple">{t("landing.testiTitle")}</span>
          </div>
          <h2 className="landing-section-title" style={{ color: "var(--color-navy)" }}>
            {t("landing.testiSubtitle")}
          </h2>

          <div className="landing-testimonials__grid">
            {getTestimonials(t).map((t, i) => (
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
          <span className="badge-brutal badge-brutal--purple">{t("landing.stepsTitle")}</span>
        </div>

        <div className="landing-steps__grid">
          {(() => {
            const steps = getSteps(t);
            return steps.map((s, i) => (
              <div
                key={i}
                className={`landing-step-card card-brutal landing-step-card--${s.color}`}
              >
                {/* Connector line */}
                {i < steps.length - 1 && <div className="landing-step-card__connector" />}
                <div className={`landing-step-card__num-badge landing-step-card__num-badge--${s.color}`}>
                  {s.num}
                </div>
                <div className={`landing-step-card__icon-circle landing-step-card__icon-circle--${s.color}`}>
                  <s.icon size={28} strokeWidth={2.5} />
                </div>
                <h3 className="landing-step-card__title">{s.title}</h3>
                <p className="landing-step-card__desc">{s.desc}</p>
              </div>
            ));
          })()}
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section
        ref={faq.ref}
        className={`landing-faq ${faq.visible ? "landing-faq--visible" : ""}`}
      >
        <div className="landing-container landing-container--narrow">
          <div className="landing-section-label">
            <span className="badge-brutal badge-brutal--purple">{t("landing.faqTitle")}</span>
          </div>
          <h2 className="landing-section-title" style={{ color: "var(--color-navy)" }}>{t("landing.faqSubtitle")}</h2>

          <div className="landing-faq__list">
            {getFaqData(t).map((item, i) => (
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
          <h2 className="landing-cta__title">{t("landing.ctaFooterTitle")}</h2>
          <p className="landing-cta__desc">
            {t("landing.ctaFooterSubtitle")}
          </p>
          <Link href="/auth/register" className="btn-brutal btn-brutal--primary btn-brutal--lg">
            {t("landing.ctaStart")}
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-footer__inner">
          <div className="landing-footer__brand">
            <div className="landing-nav__logo" style={{ width: 56, height: 56, background: "transparent", border: "none", boxShadow: "none" }}>
              <img src="/images/logo_white.png" alt="CEAMIS Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.125rem", color: "var(--color-white)" }}>CEAMIS</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.5)" }}>Control Every Awful Money Impulse System</div>

            </div>
          </div>
          <div className="landing-footer__copy">
            <p>{t("landing.footerCopy")}</p>
            <p>{t("landing.footerMotto")}</p>
          </div>
        </div>
      </footer>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "100px",
            background: "rgba(15, 23, 42, 0.85)", /* var(--color-navy) with opacity */
            color: "var(--color-white)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(204, 255, 0, 0.4)", /* lime outer glow */
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            zIndex: 999,
            cursor: "pointer",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            fontWeight: 800,
            fontSize: "0.85rem",
            letterSpacing: "0.5px",
            textTransform: "uppercase"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.4), 0 0 0 3px rgba(204, 255, 0, 0.8)";
            e.currentTarget.style.background = "rgba(15, 23, 42, 1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(204, 255, 0, 0.4)";
            e.currentTarget.style.background = "rgba(15, 23, 42, 0.85)";
          }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} strokeWidth={3} color="var(--color-lime)" className="animate-bounce" style={{ animationDuration: "2s" }} />
          <span>Ke Atas</span>
        </button>
      )}
    </div>
  );
}
