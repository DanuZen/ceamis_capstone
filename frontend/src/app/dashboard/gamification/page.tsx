"use client";

import { useState, useEffect } from "react";
import { Trophy, Flame, Star, Medal, Zap, Target, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getBadges } from "@/app/admin/gamification/actions";

const INITIAL_BADGES = [
  { id: 1, name: "Pencatat Setia", icon: "Target", color: "lime", xp: 100, requirement: "Catat 30 transaksi berturut-turut", unlocked: true },
  { id: 2, name: "Si Hemat", icon: "Shield", color: "purple", xp: 150, requirement: "Pengeluaran di bawah target 4 minggu berturut", unlocked: true },
  { id: 3, name: "Api Semangat", icon: "Flame", color: "orange", xp: 75, requirement: "Login 7 hari berturut-turut (Streak)", unlocked: true },
  { id: 4, name: "Kilat Cerdas", icon: "Zap", color: "lime", xp: 200, requirement: "Selesaikan 5 modul edukasi", unlocked: false },
  { id: 5, name: "Bintang Emas", icon: "Star", color: "orange", xp: 500, requirement: "Mencapai Level 10", unlocked: false },
];

const renderIcon = (iconName: string, size: number) => {
  switch (iconName) {
    case "Target": return <Target size={size} strokeWidth={2.5} />;
    case "Shield": return <Shield size={size} strokeWidth={2.5} />;
    case "Flame": return <Flame size={size} strokeWidth={2.5} />;
    case "Zap": return <Zap size={size} strokeWidth={2.5} />;
    case "Star": return <Star size={size} strokeWidth={2.5} />;
    case "Medal": return <Medal size={size} strokeWidth={2.5} />;
    case "Trophy": return <Trophy size={size} strokeWidth={2.5} />;
    default: return <Star size={size} strokeWidth={2.5} />;
  }
};

export default function GamificationPage() {
  const { t } = useLanguage();
  const [badges, setBadges] = useState<any[]>(INITIAL_BADGES);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const dbBadges = await getBadges();
        if (dbBadges && dbBadges.length > 0) {
          const parsed = dbBadges.map((b: any, index: number) => ({
            ...b,
            color: "lime", // Default fallback
            requirement: b.desc,
            unlocked: index < 3 // Mock unlocking first 3
          }));
          setBadges(parsed);
        } else {
          // Fallback if db is empty
          setBadges(INITIAL_BADGES);
        }
      } catch (error) {
        console.error("Failed to load badges:", error);
      }
    };
    fetchBadges();
  }, []);

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
            {t("dashboard.gamification.title")}
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
            {t("dashboard.gamification.desc")}
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        {/* Streak HP Bar */}
        <div className="card-brutal animate-bounce-in" style={{ background: "var(--color-white)", border: "3px solid var(--color-navy)", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
              <Flame size={24} color="var(--color-orange)" strokeWidth={2.5} />
              {t("dashboard.gamification.activeStreak")}
            </h3>
            <span className="badge-brutal badge-brutal--orange" style={{ padding: "0.3rem 0.75rem", fontSize: "0.875rem" }}>5 {t("dashboard.gamification.days")}</span>
          </div>
          <div className="progress-brutal" style={{ height: "28px", border: "3px solid var(--color-navy)" }}>
            <div className="progress-brutal__fill" style={{ width: "71%", background: "var(--color-orange)", borderRight: "3px solid var(--color-navy)" }} />
            <div className="progress-brutal__label" style={{ fontSize: "0.9375rem", fontWeight: 700 }}>5 / 7 {t("dashboard.gamification.weeklyTarget")}</div>
          </div>
          <p style={{ marginTop: "1rem", fontSize: "0.9375rem", color: "var(--color-navy)", fontWeight: 600, margin: "1rem 0 0 0" }}>
            2 {t("dashboard.gamification.daysLeftToBadge")} <span style={{ color: "var(--color-purple)", fontWeight: 800 }}>"{t("dashboard.gamification.badges.consistent.name")}"</span>{t("dashboard.gamification.keepItUp")}
          </p>
        </div>

        {/* XP Progress */}
        <div className="card-brutal animate-bounce-in" style={{ animationDelay: "100ms", background: "var(--color-white)", border: "3px solid var(--color-navy)", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
              <Zap size={24} color="var(--color-purple)" strokeWidth={2.5} />
              {t("dashboard.gamification.levelAndXp")}
            </h3>
            <span className="badge-brutal badge-brutal--purple" style={{ padding: "0.3rem 0.75rem", fontSize: "0.875rem" }}>{t("dashboard.gamification.level")} 7</span>
          </div>
          <div className="progress-brutal" style={{ height: "28px", border: "3px solid var(--color-navy)" }}>
            <div className="progress-brutal__fill" style={{ width: "65%", background: "var(--color-purple)", borderRight: "3px solid var(--color-navy)" }} />
            <div className="progress-brutal__label" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-white)" }}>1950 / 3000 XP</div>
          </div>
          <p style={{ marginTop: "1rem", fontSize: "0.9375rem", color: "var(--color-navy)", fontWeight: 600, margin: "1rem 0 0 0" }}>
            {t("dashboard.gamification.collectMoreXp")} <span style={{ color: "var(--color-orange)", fontWeight: 800 }}>1050 XP</span> {t("dashboard.gamification.moreXpToReach")} {t("dashboard.gamification.level")} 8!
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "3rem" }}>
        {/* Badge Collection */}
        <div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--color-navy)" }}>
            {t("dashboard.gamification.badgeCollection")}
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
                  {renderIcon(badge.icon as string, 32)}
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                  {badge.name}
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.5, marginBottom: "0.5rem" }}>
                  {badge.requirement || (badge as any).desc}
                </div>
                {badge.requirementType && badge.requirementValue && (
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-purple)", borderTop: "1px dashed rgba(0,0,0,0.1)", paddingTop: "0.5rem", width: "100%" }}>
                    Syarat: {badge.requirementType} ({badge.requirementValue})
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
