"use client";

import Link from "next/link";
import { 
  Wallet, 
  Sparkles, 
  ShieldAlert, 
  BrainCircuit, 
  ArrowRight,
  TrendingUp,
  Target,
  Zap,
  ArrowUp,
  ScanLine,
  Clock,
  Check,
  X,
  Smartphone,
  QrCode,
  Download,
  Layers,
  ShoppingBag,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import SplashScreen from "@/components/ui/SplashScreen";

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
  const comparison = useInView();
  const features = useInView();
  const steps = useInView();
  const testimonials = useInView();
  const faq = useInView();
  const downloadHub = useInView();

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

  const getSteps = () => [
    { num: "01", title: t("landing.step1Title"), desc: t("landing.step1Desc"), icon: ShoppingBag, color: "purple" },
    { num: "02", title: t("landing.step2Title"), desc: t("landing.step2Desc"), icon: BrainCircuit, color: "lime" },
    { num: "03", title: t("landing.step3Title"), desc: t("landing.step3Desc"), icon: ShieldAlert, color: "orange" },
    { num: "04", title: t("landing.step4Title"), desc: t("landing.step4Desc"), icon: ScanLine, color: "purple" },
  ];

  const getTestimonials = () => [
    { 
      text: t("landing.testi1"), 
      name: "Ziva A.", 
      handle: "@ziva_creative", 
      color: "purple",
      role: "Gen-Z Freelancer"
    },
    { 
      text: t("landing.testi2"), 
      name: "Kevin R.", 
      handle: "@kvn_tech", 
      color: "lime",
      role: "Tech Enthusiast"
    },
    { 
      text: t("landing.testi3"), 
      name: "Sari M.", 
      handle: "@sari_finance", 
      color: "navy",
      role: "Mahasiswi & Budgeter"
    },
  ];

  const getFaqData = () => [
    { q: t("landing.faq1Q"), a: t("landing.faq1A") },
    { q: t("landing.faq2Q"), a: t("landing.faq2A") },
    { q: t("landing.faq3Q"), a: t("landing.faq3A") },
    { q: t("landing.faq4Q"), a: t("landing.faq4A") },
  ];

  return (
    <div className="landing-page">
      {/* ── Web Splash Screen ── */}
      <SplashScreen />

      {/* ── Top Kinetic Marquee with Starbursts (Mentorix Style) ── */}
      <div className="landing-banner" role="marquee" aria-label="CEAMIS Announcement">
        <div className="landing-banner__track">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="landing-banner__item">
              <span className="landing-banner__star">★</span>
              {t("landing.banner")}
            </div>
          ))}
        </div>
      </div>

      {/* ── Neo-Brutalist Navbar ── */}
      <nav className="landing-nav" aria-label="Main Navigation">
        <div className="landing-nav__brand">
          <div className="landing-nav__logo" style={{ width: "48px", height: "48px", background: "transparent", border: "none", boxShadow: "none" }}>
            <img src="/images/logo_new.png" alt="CEAMIS Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <span className="landing-nav__name">CEAMIS</span>
        </div>

        <div className="landing-nav__links" style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div className="hidden-mobile-nav" style={{ display: "flex", gap: "1rem", marginRight: "1rem" }}>
            <a href="#fitur" style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.875rem", color: "var(--color-navy)" }}>Fitur</a>
            <a href="#komparasi" style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.875rem", color: "var(--color-navy)" }}>Mengapa CEAMIS?</a>
            <a href="#faq" style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.875rem", color: "var(--color-navy)" }}>FAQ</a>
          </div>

          {/* Language Switcher */}
          <button 
            onClick={() => setLanguage(language === "id" ? "en" : "id")} 
            className="btn-brutal btn-brutal--sm"
            style={{ 
              padding: "0.4rem 0.75rem", fontSize: "0.85rem", fontWeight: 800,
              background: "var(--color-white)", border: "2px solid var(--color-navy)",
              boxShadow: "2px 2px 0px var(--color-navy)", display: "flex", alignItems: "center", gap: "0.4rem",
              minWidth: "70px", justifyContent: "center"
            }}
            aria-label="Toggle language"
          >
            <img 
              src={language === "id" ? "https://flagcdn.com/w20/id.png" : "https://flagcdn.com/w20/gb.png"} 
              alt={language === "id" ? "Indonesian Flag" : "English Flag"} 
              style={{ width: "18px", height: "auto", borderRadius: "2px" }} 
            />
            <span>{language === "id" ? "ID" : "EN"}</span>
          </button>

          {/* Admin Portal Link */}
          <Link 
            href="/admin/dashboard" 
            className="btn-brutal btn-brutal--sm"
            style={{ 
              background: "#FFFFFF", 
              color: "#0A192F",
              border: "2px solid #0A192F",
              boxShadow: "2px 2px 0px #0A192F",
              fontWeight: 700,
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            <ExternalLink size={14} />
            <span>{t("landing.ctaAdmin")}</span>
          </Link>

          {/* Get App Mobile CTA */}
          <a href="#download-app" className="btn-brutal btn-brutal--lime btn-brutal--sm" style={{ padding: "0.5rem 1rem" }}>
            <Smartphone size={16} />
            <span>{t("landing.ctaDownload")}</span>
          </a>
        </div>
      </nav>

      {/* ── Hero Section (Neobrutalism Mentorix Style) ── */}
      <section
        ref={hero.ref}
        className={`landing-hero ${hero.visible ? "landing-hero--visible" : ""}`}
      >
        <div className="landing-container landing-hero__wrapper">
          <div className="landing-hero__content">
            {/* Pill Badge */}
            <div 
              style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "0.5rem",
                padding: "0.45rem 1rem", 
                background: "#D2FF28", 
                border: "3px solid #0A192F", 
                borderRadius: "100px",
                boxShadow: "3px 3px 0px #0A192F",
                fontFamily: "var(--font-heading)",
                fontWeight: 900,
                fontSize: "0.8rem",
                letterSpacing: "0.05em",
                color: "#0A192F",
                marginBottom: "1.5rem"
              }}
            >
              <Zap size={16} strokeWidth={3} />
              <span>{t("landing.heroBadge")}</span>
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
              <a href="#download-app" className="btn-brutal btn-brutal--lime btn-brutal--lg" style={{ fontSize: "1rem" }}>
                <Smartphone size={20} strokeWidth={2.5} />
                <span>{t("landing.ctaDownload")} →</span>
              </a>
              <a href="#fitur" className="btn-brutal btn-brutal--yellow btn-brutal--lg" style={{ fontSize: "1rem" }}>
                <Sparkles size={20} strokeWidth={2.5} />
                <span>{language === "id" ? "Pelajari Fitur ↓" : "Explore Features ↓"}</span>
              </a>
            </div>

            {/* Social Proof / Academic Badge */}
            <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div 
                style={{ 
                  background: "#FFFFFF", 
                  border: "2px solid #0A192F", 
                  borderRadius: "12px", 
                  padding: "0.5rem 0.85rem",
                  boxShadow: "3px 3px 0px #0A192F",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#0A192F"
                }}
              >
                <span>⭐⭐⭐⭐⭐</span>
                <span>{t("landing.socialProof")}</span>
              </div>
            </div>
          </div>

          {/* ── Hero Neo-Brutalism Phone Mockup (Live Intervention Preview) ── */}
          <div className="landing-hero__visual">
            <div className="landing-hero__blob" />

            <div className="hero-phone">
              <div className="hero-phone__screen">
                <div className="hero-phone__notch" />
                
                <div className="hero-phone__header">
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5252", border: "1.5px solid #0A192F" }} />
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "0.85rem", color: "#0A192F" }}>CEAMIS</span>
                  </div>
                  <div className="hero-phone__badge-live">
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0A192F", display: "inline-block", animation: "pulse-dot 1.5s infinite" }} />
                    <span>PERINGATAN INSTAN</span>
                  </div>
                </div>

                <div className="hero-phone__body">
                  <div style={{ fontSize: "0.75rem", color: "#718096", fontWeight: 700, textTransform: "uppercase" }}>
                    Pengecekan Pra-Pembelian
                  </div>

                  {/* Planned Shopping Item */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FFFFFF", border: "2px solid #0A192F", borderRadius: "10px", padding: "8px 10px" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0A192F" }}>Sneakers Limited Edition</div>
                      <div style={{ fontSize: "0.7rem", color: "#4A5568" }}>Kategori: Fashion & Lifestyle</div>
                    </div>
                    <div style={{ fontWeight: 900, fontSize: "0.95rem", color: "#E02424" }}>
                      Rp 850.000
                    </div>
                  </div>

                  {/* High Risk Alert Banner */}
                  <div className="hero-phone__alert-box">
                    <div className="hero-phone__alert-title">
                      <ShieldAlert size={16} strokeWidth={3} />
                      <span>Risiko Impulsif Tinggi!</span>
                    </div>
                    <div className="hero-phone__alert-desc">
                      Nominal ini memakan <strong>85% sisa pagu jajan</strong> bulan ini. Jauh melebihi batas belanja harianmu.
                    </div>
                    <div className="hero-phone__impact-tag">
                      ⚠️ Target Tabungan Laptop Anda <strong>Mundur 9 Hari!</strong>
                    </div>
                  </div>

                  {/* Conscious Decision Buttons */}
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#0A192F", marginTop: "2px" }}>
                    PILIHAN TINDAKAN ANDA:
                  </div>
                  <div className="hero-phone__actions">
                    <div className="hero-phone__btn-act hero-phone__btn-act--warn">
                      Tunda Beli
                    </div>
                    <div className="hero-phone__btn-act">
                      Ubah Nominal
                    </div>
                    <div className="hero-phone__btn-act hero-phone__btn-act--primary">
                      Lanjut
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="landing-hero__float landing-hero__float--1" style={{ background: "#D2FF28", color: "#0A192F" }}>
              <Clock size={16} strokeWidth={3} /> Pemeriksaan Seketika
            </div>
            <div className="landing-hero__float landing-hero__float--2" style={{ background: "#00F0FF", color: "#0A192F" }}>
              <Target size={16} strokeWidth={3} /> Peringatan Akurat
            </div>
            <div className="landing-hero__float landing-hero__float--3" style={{ background: "#FFE600", color: "#0A192F" }}>
              <ScanLine size={16} strokeWidth={3} /> Pindai Struk Otomatis
            </div>
          </div>
        </div>
      </section>



      {/* ── Problem vs Solution (Why Pre-Purchase?) ── */}
      <section
        id="komparasi"
        ref={comparison.ref}
        className={`landing-comparison ${comparison.visible ? "landing-comparison--visible" : ""}`}
      >
        <div className="landing-section-label">
          <span className="badge-brutal badge-brutal--purple">{t("landing.comparisonBadge")}</span>
        </div>
        <h2 className="landing-section-title" style={{ color: "#0A192F" }}>
          {t("landing.comparisonTitle")}
        </h2>
        <p className="landing-section-subtitle" style={{ color: "#4A5568" }}>
          {t("landing.comparisonSubtitle")}
        </p>

        <div className="comparison-grid">
          {/* Old Way */}
          <div className="comparison-card comparison-card--old">
            <div className="comparison-card__header">
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FF7675", border: "2px solid #0A192F", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 900 }}>
                ✕
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", fontWeight: 800, color: "#0A192F", margin: 0 }}>
                {t("landing.compOldTitle")}
              </h3>
            </div>
            <ul className="comparison-list">
              <li className="comparison-item">
                <span className="comparison-item__icon comparison-item__icon--cross"><X size={16} strokeWidth={3} /></span>
                <span>{t("landing.compOld1")}</span>
              </li>
              <li className="comparison-item">
                <span className="comparison-item__icon comparison-item__icon--cross"><X size={16} strokeWidth={3} /></span>
                <span>{t("landing.compOld2")}</span>
              </li>
              <li className="comparison-item">
                <span className="comparison-item__icon comparison-item__icon--cross"><X size={16} strokeWidth={3} /></span>
                <span>{t("landing.compOld3")}</span>
              </li>
              <li className="comparison-item">
                <span className="comparison-item__icon comparison-item__icon--cross"><X size={16} strokeWidth={3} /></span>
                <span>{t("landing.compOld4")}</span>
              </li>
            </ul>
          </div>

          {/* CEAMIS 2.0 Active Intervention */}
          <div className="comparison-card comparison-card--new">
            <div className="comparison-card__header">
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#D2FF28", border: "2px solid #0A192F", display: "flex", alignItems: "center", justifyContent: "center", color: "#0A192F", fontWeight: 900 }}>
                ✓
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", fontWeight: 800, color: "#0A192F", margin: 0 }}>
                {t("landing.compNewTitle")}
              </h3>
            </div>
            <ul className="comparison-list">
              <li className="comparison-item">
                <span className="comparison-item__icon comparison-item__icon--check"><Check size={16} strokeWidth={3} /></span>
                <span>{t("landing.compNew1")}</span>
              </li>
              <li className="comparison-item">
                <span className="comparison-item__icon comparison-item__icon--check"><Check size={16} strokeWidth={3} /></span>
                <span>{t("landing.compNew2")}</span>
              </li>
              <li className="comparison-item">
                <span className="comparison-item__icon comparison-item__icon--check"><Check size={16} strokeWidth={3} /></span>
                <span>{t("landing.compNew3")}</span>
              </li>
              <li className="comparison-item">
                <span className="comparison-item__icon comparison-item__icon--check"><Check size={16} strokeWidth={3} /></span>
                <span>{t("landing.compNew4")}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Core 2.0 Features Bento Grid ── */}
      <section
        id="fitur"
        ref={features.ref}
        className={`landing-features ${features.visible ? "landing-features--visible" : ""}`}
      >
        <div className="landing-section-label">
          <span className="badge-brutal badge-brutal--lime">{t("landing.featuresTitle")}</span>
        </div>
        <h2 className="landing-section-title" style={{ color: "#0A192F" }}>
          {t("landing.featuresSubtitle")}
        </h2>

        <div className="bento-grid">
          {/* Card 1: Pre-Purchase ML Intervention (Large 8 cols) */}
          <div className="bento-card bento-card--8">
            <span className="bento-card__badge" style={{ background: "#D2FF28", color: "#0A192F" }}>
              {t("landing.feat1Badge")}
            </span>
            <h3 className="bento-card__title">{t("landing.feat1Title")}</h3>
            <p className="bento-card__desc">{t("landing.feat1Desc")}</p>
            
            <div style={{ marginTop: "1.75rem", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              <span style={{ background: "#F1F5F9", border: "2px solid #0A192F", borderRadius: "8px", padding: "6px 12px", fontSize: "0.8rem", fontWeight: 800, color: "#0A192F" }}>
                ⚡ Cek Otomatis Sebelum Bayar
              </span>
              <span style={{ background: "#F1F5F9", border: "2px solid #0A192F", borderRadius: "8px", padding: "6px 12px", fontSize: "0.8rem", fontWeight: 800, color: "#0A192F" }}>
                🛡️ Melindungi Saldo Tabungan
              </span>
              <span style={{ background: "#F1F5F9", border: "2px solid #0A192F", borderRadius: "8px", padding: "6px 12px", fontSize: "0.8rem", fontWeight: 800, color: "#0A192F" }}>
                💡 Saran Pengeluaran yang Bijak
              </span>
            </div>
          </div>

          {/* Card 2: Smart OCR Gemini Flash (4 cols) */}
          <div className="bento-card bento-card--4">
            <span className="bento-card__badge" style={{ background: "#00F0FF", color: "#0A192F" }}>
              {t("landing.feat2Badge")}
            </span>
            <h3 className="bento-card__title">{t("landing.feat2Title")}</h3>
            <p className="bento-card__desc">{t("landing.feat2Desc")}</p>
            
            <div style={{ marginTop: "1.5rem", background: "#F8FAFC", border: "2px solid #0A192F", borderRadius: "12px", padding: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", fontWeight: 800, color: "#0A192F" }}>
                <ScanLine size={18} />
                <span>Pindai Cerdas Sekali Klik</span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "4px" }}>
                Otomatis mengenali total belanja, nama toko, dan pos pengeluaran.
              </div>
            </div>
          </div>

          {/* Card 3: Deterministic Health Score (6 cols) */}
          <div className="bento-card bento-card--6">
            <span className="bento-card__badge" style={{ background: "#FFE600", color: "#0A192F" }}>
              {t("landing.feat3Badge")}
            </span>
            <h3 className="bento-card__title">{t("landing.feat3Title")}</h3>
            <p className="bento-card__desc">{t("landing.feat3Desc")}</p>

            <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", textAlign: "center" }}>
              <div style={{ background: "#FFFDF0", border: "2px solid #0A192F", borderRadius: "10px", padding: "8px" }}>
                <div style={{ fontWeight: 900, fontSize: "1.1rem", color: "#0A192F" }}>40%</div>
                <div style={{ fontSize: "0.7rem", fontWeight: 700 }}>Porsi Tabungan</div>
              </div>
              <div style={{ background: "#FFFDF0", border: "2px solid #0A192F", borderRadius: "10px", padding: "8px" }}>
                <div style={{ fontWeight: 900, fontSize: "1.1rem", color: "#0A192F" }}>30%</div>
                <div style={{ fontSize: "0.7rem", fontWeight: 700 }}>Kebutuhan Pokok</div>
              </div>
              <div style={{ background: "#FFFDF0", border: "2px solid #0A192F", borderRadius: "10px", padding: "8px" }}>
                <div style={{ fontWeight: 900, fontSize: "1.1rem", color: "#0A192F" }}>30%</div>
                <div style={{ fontSize: "0.7rem", fontWeight: 700 }}>Batas Maksimal Jajan</div>
              </div>
            </div>
          </div>

          {/* Card 4: Impact Simulation (6 cols) */}
          <div className="bento-card bento-card--6">
            <span className="bento-card__badge" style={{ background: "#D2FF28", color: "#0A192F" }}>
              {t("landing.feat4Badge")}
            </span>
            <h3 className="bento-card__title">{t("landing.feat4Title")}</h3>
            <p className="bento-card__desc">{t("landing.feat4Desc")}</p>

            <div style={{ marginTop: "1.5rem", background: "#F0FDF4", border: "2px solid #0A192F", borderRadius: "12px", padding: "12px", display: "flex", alignItems: "center", gap: "1rem" }}>
              <Target size={32} color="#16A34A" />
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0A192F" }}>Proyeksi Keterlambatan Target</div>
                <div style={{ fontSize: "0.8rem", color: "#4B5563" }}>Kalkulasi pasti berapa hari target impian tertunda bila belanja tetap dilakukan.</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── How It Works (Alur 4 Langkah Baru 2.0) ── */}
      <section
        ref={steps.ref}
        className={`landing-steps ${steps.visible ? "landing-steps--visible" : ""}`}
      >
        <div className="landing-section-label">
          <span className="badge-brutal badge-brutal--purple">{t("landing.stepsTitle")}</span>
        </div>

        <div className="landing-steps__grid">
          {(() => {
            const stepsList = getSteps();
            return stepsList.map((s, i) => (
              <div
                key={i}
                className={`landing-step-card card-brutal landing-step-card--${s.color}`}
              >
                {i < stepsList.length - 1 && <div className="landing-step-card__connector" />}
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
            {getTestimonials().map((tItem, i) => (
              <div key={i} className={`testimonial-bubble testimonial-bubble--${tItem.color}`}>
                <div style={{ marginBottom: "0.5rem" }}>⭐⭐⭐⭐⭐</div>
                <p className="testimonial-bubble__text">"{tItem.text}"</p>
                <div className="testimonial-bubble__user">
                  <div className="testimonial-bubble__avatar">
                    {tItem.name.charAt(0)}
                  </div>
                  <div className="testimonial-bubble__info">
                    <span className="testimonial-bubble__name">{tItem.name}</span>
                    <span className="testimonial-bubble__handle">{tItem.role} • {tItem.handle}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section
        id="faq"
        ref={faq.ref}
        className={`landing-faq ${faq.visible ? "landing-faq--visible" : ""}`}
      >
        <div className="landing-container landing-container--narrow">
          <div className="landing-section-label">
            <span className="badge-brutal badge-brutal--purple">{t("landing.faqTitle")}</span>
          </div>
          <h2 className="landing-section-title" style={{ color: "var(--color-navy)" }}>{t("landing.faqSubtitle")}</h2>

          <div className="landing-faq__list">
            {getFaqData().map((item, i) => (
              <div
                key={i}
                className={`faq-item ${openFaq === i ? "faq-item--open" : ""}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="faq-item__question">
                  {item.q}
                  <div className="faq-item__icon">{openFaq === i ? "−" : "+"}</div>
                </div>
                <div className="faq-item__answer">
                  <div className="faq-item__answer-text">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Download Hub & Final CTA (Mentorix Style) ── */}
      <section
        id="download-app"
        ref={downloadHub.ref}
        className={`landing-download-hub ${downloadHub.visible ? "landing-download-hub--visible" : ""}`}
      >
        <div className="download-hub-card">
          <div>
            <div 
              style={{ 
                display: "inline-block", 
                padding: "4px 12px", 
                background: "#D2FF28", 
                color: "#0A192F", 
                fontWeight: 900, 
                borderRadius: "100px",
                fontSize: "0.8rem",
                marginBottom: "1rem"
              }}
            >
              FLUTTER MOBILE CLIENT
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "1rem" }}>
              {t("landing.ctaFooterTitle")}
            </h2>
            <p style={{ fontSize: "1.1rem", opacity: 0.85, lineHeight: 1.6, marginBottom: "2rem", maxWidth: "540px" }}>
              {t("landing.ctaFooterSubtitle")}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <a 
                href="#download-app" 
                className="btn-brutal btn-brutal--lime btn-brutal--lg"
                style={{ fontSize: "0.95rem" }}
              >
                <Download size={20} />
                <span>{t("landing.ctaDownloadApp")}</span>
              </a>
              <Link 
                href="/admin/dashboard" 
                className="btn-brutal btn-brutal--sm"
                style={{ 
                  background: "#FFFFFF", 
                  color: "#0A192F", 
                  border: "3px solid #0A192F",
                  boxShadow: "4px 4px 0px #0A192F",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.25rem",
                  fontWeight: 800
                }}
              >
                <ExternalLink size={18} />
                <span>Buka Portal Admin</span>
              </Link>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="download-qr-box">
            <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>
              {t("landing.ctaScanQR")}
            </div>
            <div style={{ background: "#FFF", padding: "12px", border: "2px solid #0A192F", borderRadius: "12px" }}>
              <QrCode size={130} color="#0A192F" />
            </div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748B" }}>
              Scan untuk unduh APK langsung di Android / iOS TestFlight
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-footer__inner">
          <div className="landing-footer__brand">
            <div className="landing-nav__logo" style={{ width: 52, height: 52, background: "transparent", border: "none", boxShadow: "none" }}>
              <img src="/images/logo_new.png" alt="CEAMIS Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.25rem", color: "var(--color-white)" }}>
                CEAMIS
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)" }}>
                {t("landing.footerDesc")}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <Link href="/admin/dashboard" style={{ color: "#D2FF28", fontWeight: 700, fontSize: "0.85rem", textDecoration: "underline" }}>
              Portal Admin & Audit
            </Link>
          </div>

          <div className="landing-footer__copy">
            <p>{t("landing.footerCopy")}</p>
            <p>{t("landing.footerMotto")}</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            padding: "0.75rem 1.25rem",
            borderRadius: "100px",
            background: "#0A192F",
            color: "var(--color-white)",
            border: "2px solid #D2FF28",
            boxShadow: "4px 4px 0px #D2FF28",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            zIndex: 999,
            cursor: "pointer",
            fontWeight: 800,
            fontSize: "0.85rem",
            textTransform: "uppercase"
          }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} strokeWidth={3} color="#D2FF28" />
          <span>Ke Atas</span>
        </button>
      )}
    </div>
  );
}
