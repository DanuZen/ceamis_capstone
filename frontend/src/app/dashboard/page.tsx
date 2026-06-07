"use client";

import { useState, useEffect } from "react";
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
  BarChart3,
  Lock,
  CheckCircle2
} from "lucide-react";
import { useTransactions } from "@/context/TransactionContext";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { aiApi } from "@/lib/api";

interface FeatureCard {
  href: string;
  title: string;
  desc: string;
  color: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;
  warningOnly?: boolean; // hanya muncul/aktif jika warningTriggered
}

export default function DashboardPage() {
  const { transactions } = useTransactions();
  const { userData } = useUser();
  const { t } = useLanguage();

  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const [showTipsBubble, setShowTipsBubble] = useState(true);
  const [isClosingBubble, setIsClosingBubble] = useState(false);

  // Ensure main chat is closed when landing here to prioritize insight
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("cami-close-chat"));
  }, []);

  // Global click to close bubble
  useEffect(() => {
    if (!showTipsBubble || isClosingBubble) return;
    const timer = setTimeout(() => {
      const closeBubble = () => {
        setIsClosingBubble(true);
        setTimeout(() => setShowTipsBubble(false), 300);
      };
      window.addEventListener("click", closeBubble);
      return () => window.removeEventListener("click", closeBubble);
    }, 100);
    return () => clearTimeout(timer);
  }, [showTipsBubble, isClosingBubble]);

  // Sync character pose
  useEffect(() => {
    // Only force open if we have an insight to show
    const shouldOpen = showTipsBubble && !isClosingBubble && !!insight;
    window.dispatchEvent(new CustomEvent("cami-force-open", { detail: shouldOpen }));
    return () => {
      window.dispatchEvent(new CustomEvent("cami-force-open", { detail: false }));
    };
  }, [showTipsBubble, isClosingBubble, insight]);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoadingInsight(true);
      try {
        const res = await aiApi.getSpendingCluster({ user_id: userData.id || "guest" });
        if (res && !res.is_mock && res.insight) {
          setInsight(res.insight);
        } else {
          setInsight(t("dashboard.insightDesc"));
        }
      } catch {
        setInsight(t("dashboard.insightDesc"));
      } finally {
        setLoadingInsight(false);
      }
    };
    
    // Only fetch if we have transactions to analyze
    if (userData.id && transactions.length > 0) {
      fetchInsight();
    } else {
      setInsight(t("dashboard.insightDesc"));
    }
  }, [userData.id, transactions.length, t]);

  const featureCards: FeatureCard[] = [
    {
      href: "/dashboard/transactions",
      title: t("dashboard.transactions.title"),
      desc: t("dashboard.transactions.desc"),
      color: "purple",
      icon: Wallet
    },
    {
      href: "/dashboard",
      title: t("landing.feature2Title"),
      desc: t("landing.feature2Desc"),
      color: "lime",
      icon: Sparkles
    },
    {
      href: "/dashboard/warnings",
      title: t("dashboard.warnings.title"),
      desc: t("dashboard.warnings.desc"),
      color: "orange",
      icon: Flame,
      warningOnly: true,
    },
    {
      href: "/dashboard/chatbot",
      title: t("landing.feature5Title"),
      desc: t("landing.feature5Desc"),
      color: "purple",
      icon: Bot
    },
    {
      href: "/dashboard/education",
      title: t("dashboard.education.title"),
      desc: t("dashboard.education.desc"),
      color: "lime",
      icon: BookOpen
    },
    {
      href: "/dashboard/profile",
      title: t("landing.feature3Title"),
      desc: t("landing.feature3Desc"),
      color: "orange",
      icon: User
    },
  ];

  const totalPemasukan = transactions
    .filter(tx => tx.type === "pemasukan")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalPengeluaran = transactions
    .filter(tx => tx.type === "pengeluaran")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const sisaSaldo = totalPemasukan - totalPengeluaran;
  
  // Get recent 4 transactions
  const recentTransactions = transactions.slice(0, 4);

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
          {t("dashboard.greeting")}, <span style={{ color: "var(--color-purple)" }}>{userData.name.split(" ")[0]}!</span>
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "1rem", maxWidth: "600px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {t("dashboard.ready")}
          <span className="badge-brutal badge-brutal--lime" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.2rem 0.6rem", fontSize: "0.75rem" }}>
            {userData.label.toUpperCase() === "PEMULA" ? (t("dashboard.beginnerBadge") || "PEMULA") : userData.label}
          </span>
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="quick-stats-grid stagger-children">
        <div className="card-brutal quick-stat-card">
          <div className="landing-feature-card__icon-box" style={{ background: "var(--color-lime)", width: "48px", height: "48px", minWidth: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <Flame size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.5rem" }}>{userData.streak} {t("dashboard.streakDays")}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>{t("dashboard.streakActive")}</div>
          </div>
        </div>
        
        <div className="card-brutal quick-stat-card">
          <div className="landing-feature-card__icon-box" style={{ background: "var(--color-purple)", width: "48px", height: "48px", minWidth: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <Wallet size={24} color="var(--color-white)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.5rem" }}>Rp {sisaSaldo.toLocaleString("id-ID")}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>{t("dashboard.balance")}</div>
          </div>
        </div>

        <div 
          className="card-brutal quick-stat-card" 
          style={{ 
            border: userData.warningTriggered ? "3px solid var(--color-pink)" : undefined,
            boxShadow: userData.warningTriggered ? "4px 4px 0px var(--color-pink)" : undefined,
            animation: userData.warningTriggered ? "pulse-border 1.5s ease-in-out infinite" : undefined,
          }}
        >
          <div className="landing-feature-card__icon-box" style={{ 
            background: userData.warningTriggered 
              ? "var(--color-pink)" 
              : userData.healthScore < 65 
                ? "var(--color-orange)" 
                : "var(--color-lime)",
            width: "48px", height: "48px", minWidth: "48px", display: "flex", alignItems: "center", 
            justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", 
            border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" 
          }}>
            <Target size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ 
              fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.5rem",
              color: userData.warningTriggered ? "var(--color-danger)" : "var(--color-navy)"
            }}>
              {userData.healthScore.toFixed(0)}/100
            </div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
              {t("dashboard.healthScore")} {userData.warningTriggered 
                ? <span style={{ color: "var(--color-danger)", fontWeight: 700 }}>{t("dashboard.healthCritical")}</span>
                : userData.healthScore < 65
                  ? <span style={{ color: "var(--color-orange)", fontWeight: 700 }}>{t("dashboard.healthWarning")}</span>
                  : <span style={{ color: "green", fontWeight: 700 }}>{t("dashboard.healthSafe")}</span>
              }
            </div>
          </div>
        </div>

        <div className="card-brutal quick-stat-card">
          <div className="landing-feature-card__icon-box" style={{ background: "var(--color-white)", width: "48px", height: "48px", minWidth: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <BarChart3 size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.5rem" }}>{transactions.length}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>{t("dashboard.transactionsMonth")}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "2rem", marginBottom: "3rem" }}>
        {/* Main Content Area */}
        <div style={{ flex: "1 1 60%", minWidth: "300px" }}>
          {/* Feature Cards Grid */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.5rem",
                margin: 0
              }}
            >
              {t("dashboard.exploreFeatures")}
            </h2>
          </div>
          
          <div
            className="stagger-children"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(max(280px, calc((100% - 2.5rem) / 3)), 1fr))",
              gap: "1.25rem",
            }}
          >
            {featureCards.map((card) => {
              const isWarning   = card.warningOnly;
              const isTriggered = userData.warningTriggered;
              const isLocked    = isWarning && !isTriggered;

              // Warning card — locked state (score >= 40)
              if (isLocked) {
                return (
                  <div
                    key={card.href}
                    title={`${t("dashboard.warnings.lockedPrefix")} ${userData.healthScore.toFixed(0)}/100)`}
                    style={{
                      textDecoration: "none",
                      cursor: "not-allowed",
                      opacity: 0.45,
                      userSelect: "none",
                    }}
                  >
                    <div
                      className="card-brutal"
                      style={{
                        height: "100%", padding: "1.5rem", display: "flex",
                        flexDirection: "column", gap: "1.25rem",
                        border: "3px dashed rgba(10,25,47,0.3)",
                        boxShadow: "none",
                        background: "rgba(10,25,47,0.04)",
                      }}
                    >
                      <div style={{ width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px dashed rgba(10,25,47,0.3)", background: "rgba(10,25,47,0.06)" }}>
                        <Lock size={28} strokeWidth={2.5} color="rgba(10,25,47,0.4)" />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", margin: 0, color: "rgba(10,25,47,0.5)" }}>
                            {card.title}
                          </h3>
                          <span style={{ fontSize: "0.65rem", fontWeight: 800, background: "rgba(10,25,47,0.08)", border: "1px solid rgba(10,25,47,0.2)", borderRadius: "100px", padding: "0.1rem 0.5rem", color: "rgba(10,25,47,0.4)" }}>
                            {t("dashboard.locked")}
                          </span>
                        </div>
                        <p style={{ fontSize: "0.9375rem", lineHeight: 1.5, color: "rgba(10,25,47,0.4)", margin: 0, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          {t("dashboard.lockedDesc")}{userData.healthScore.toFixed(0)}/100 <CheckCircle2 size={14} />
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              // Warning card — active state (score < 40, warning triggered)
              if (isWarning && isTriggered) {
                return (
                  <Link key={card.href} href={card.href} style={{ textDecoration: "none" }}>
                    <div
                      className="card-brutal animate-shake"
                      style={{
                        height: "100%", padding: "1.5rem", display: "flex",
                        flexDirection: "column", gap: "1.25rem",
                        background: "var(--color-pink)",
                        border: "4px solid var(--color-navy)",
                        boxShadow: "6px 6px 0px var(--color-navy)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", background: "var(--color-white)" }}>
                          <card.icon size={28} strokeWidth={2.5} color="var(--color-pink)" />
                        </div>
                        <span className="animate-pulse" style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--color-navy)" }} />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", margin: 0, color: "var(--color-navy)" }}>
                            {card.title}
                          </h3>
                          <span style={{ fontSize: "0.65rem", fontWeight: 900, background: "var(--color-navy)", borderRadius: "100px", padding: "0.1rem 0.5rem", color: "var(--color-pink)" }}>
                            {t("dashboard.active")}
                          </span>
                        </div>
                        <p style={{ fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--color-navy)", margin: 0, fontWeight: 600 }}>
                          {t("dashboard.activeDesc")}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              }

              // Normal cards
              return (
                <Link key={card.href} href={card.href} style={{ textDecoration: "none" }}>
                  <div className={`landing-feature-card card-brutal landing-feature-card--${card.color}`} style={{ height: "100%", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div className="landing-feature-card__icon-box" style={{ width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", background: `var(--color-${card.color})` }}>
                      <card.icon size={28} strokeWidth={2.5} color="var(--color-navy)" />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                        {card.title}
                      </h3>
                      <p style={{ fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--color-text-muted)", margin: 0 }}>{card.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Area (Recent Activity) */}
        <div style={{ flex: "1 1 30%", minWidth: "280px" }}>
          <div className="card-brutal" style={{ padding: "1.5rem", height: "100%", display: "flex", flexDirection: "column", background: "var(--color-white)" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", fontWeight: 900 }}>
              <div style={{
                width: "40px", height: "40px", background: "var(--color-purple)", border: "2.5px solid var(--color-navy)",
                borderRadius: "var(--radius-brutal-sm)", boxShadow: "3px 3px 0px var(--color-navy)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <TrendingUp size={20} color="var(--color-white)" strokeWidth={2.5} />
              </div>
              {t("dashboard.recentActivity")}
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", flex: 1 }}>
              {recentTransactions.length > 0 ? recentTransactions.map((trx, i) => (
                <div key={trx.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "1.25rem", borderBottom: i !== recentTransactions.length - 1 ? "2px solid rgba(10, 25, 47, 0.1)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ 
                      width: "44px", 
                      height: "44px", 
                      borderRadius: "var(--radius-brutal-sm)", 
                      background: trx.type === 'pemasukan' ? 'var(--color-lime)' : 'var(--color-orange)',
                      border: "2px solid var(--color-navy)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "2px 2px 0px var(--color-navy)"
                    }}>
                      {trx.type === 'pemasukan' ? <Wallet size={20} color="var(--color-navy)" /> : <ShieldAlert size={20} color="var(--color-navy)" />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-navy)" }}>{trx.desc}</div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginTop: "0.1rem" }}>{trx.date} • {trx.category}</div>
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: 800, 
                    fontFamily: "var(--font-heading)",
                    color: trx.type === 'pemasukan' ? 'var(--color-navy)' : 'var(--color-danger)',
                    fontSize: "1rem"
                  }}>
                    {trx.type === 'pemasukan' ? '+' : '-'}Rp {Math.abs(trx.amount).toLocaleString('id-ID')}
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.875rem", padding: "1rem" }}>{t("dashboard.noActivity")}</div>
              )}
            </div>

            <Link href="/dashboard/transactions" className="btn-brutal btn-brutal--secondary" style={{ marginTop: "1.5rem", textAlign: "center", display: "block", width: "100%" }}>
              {t("dashboard.viewAllTrx")}
            </Link>
          </div>
        </div>
      </div>

      {/* CAMI Tips Bubble Overlay */}
      {showTipsBubble && insight && !loadingInsight && (
        <>
          <style>{`
            @keyframes pop-bubble {
              0% { transform: scale(0.8) translateY(10px); opacity: 0; }
              100% { transform: scale(1) translateY(0); opacity: 1; }
            }
            @keyframes pop-bubble-out {
              0% { transform: scale(1) translateY(0); opacity: 1; }
              100% { transform: scale(0.8) translateY(10px); opacity: 0; }
            }
          `}</style>
          <div style={{
            position: "fixed", bottom: "160px", right: "260px", zIndex: 990,
            animation: isClosingBubble
              ? "pop-bubble-out 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
              : "pop-bubble 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            width: "300px", cursor: "pointer", transition: "transform 0.2s"
          }} 
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {/* Tail Shadow */}
            <div style={{
              position: "absolute", bottom: "32px", right: "-20px",
              width: "24px", height: "24px",
              background: "var(--color-navy)",
              transform: "rotate(45deg)",
              zIndex: 989,
            }} />
            {/* Tail Main */}
            <div style={{
              position: "absolute", bottom: "40px", right: "-12px",
              width: "24px", height: "24px",
              background: "#FFF7ED",
              borderRight: "3px solid var(--color-navy)",
              borderTop: "3px solid var(--color-navy)",
              transform: "rotate(45deg)",
              zIndex: 991,
            }} />
            {/* Bubble content */}
            <div style={{
              position: "relative", zIndex: 990,
              background: "#FFF7ED", border: "3px solid var(--color-navy)",
              borderRadius: "var(--radius-brutal-sm)", padding: "1.25rem",
              boxShadow: "6px 6px 0px var(--color-navy)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 900, color: "var(--color-orange)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Sparkles size={14} /> INSIGHT CAMI
                </div>
              </div>
              <p style={{ fontSize: "0.95rem", color: "var(--color-navy)", margin: 0, lineHeight: 1.5, fontWeight: 700 }}>
                "{insight.replace(/^"|"$/g, '')}"
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
