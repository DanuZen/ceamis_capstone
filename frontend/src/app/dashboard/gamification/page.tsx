"use client";

import { useState, useEffect } from "react";
import { Trophy, Flame, Star, Medal, Zap, Target, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { getBadges } from "@/app/admin/gamification/actions";

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
  const { userData, updateUserData } = useUser();
  const [badges, setBadges] = useState<any[]>([]);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const dbBadges = await getBadges();
        if (dbBadges && dbBadges.length > 0) {
          setBadges(dbBadges);
          // Clean up stale badge IDs — badges deleted from admin should be removed from user
          const validIds = new Set(dbBadges.map((b: any) => b.id));
          const staleIds = (userData.unlockedBadges || []).filter(id => !validIds.has(id));
          if (staleIds.length > 0) {
            const cleaned = (userData.unlockedBadges || []).filter(id => validIds.has(id));
            updateUserData({ unlockedBadges: cleaned });
          }
        }
      } catch (error) {
        console.error("Failed to load badges:", error);
      }
    };
    fetchBadges();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <span className="badge-brutal badge-brutal--orange" style={{ padding: "0.3rem 0.75rem", fontSize: "0.875rem" }}>{userData.streak} {t("dashboard.gamification.days")}</span>
          </div>
          <div className="progress-brutal" style={{ height: "28px", border: "3px solid var(--color-navy)" }}>
            <div className="progress-brutal__fill" style={{ width: `${Math.min(100, (userData.streak / 7) * 100)}%`, background: "var(--color-orange)", borderRight: "3px solid var(--color-navy)" }} />
            <div className="progress-brutal__label" style={{ fontSize: "0.9375rem", fontWeight: 700 }}>{userData.streak} / 7 {t("dashboard.gamification.weeklyTarget")}</div>
          </div>
          <p style={{ marginTop: "1rem", fontSize: "0.9375rem", color: "var(--color-navy)", fontWeight: 600, margin: "1rem 0 0 0" }}>
            {userData.streak >= 7
              ? <span style={{ color: "var(--color-purple)", fontWeight: 800 }}>🎉 Kamu sudah aktif 7 hari berturut-turut!</span>
              : <>{7 - userData.streak} {t("dashboard.gamification.daysLeftToBadge")} <span style={{ color: "var(--color-purple)", fontWeight: 800 }}>"{t("dashboard.gamification.badges.consistent.name")}"</span>{t("dashboard.gamification.keepItUp")}</>
            }
          </p>
        </div>

        {/* XP Progress */}
        <div className="card-brutal animate-bounce-in" style={{ animationDelay: "100ms", background: "var(--color-white)", border: "3px solid var(--color-navy)", padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
              <Zap size={24} color="var(--color-purple)" strokeWidth={2.5} />
              {t("dashboard.gamification.levelAndXp")}
            </h3>
            <span className="badge-brutal badge-brutal--purple" style={{ padding: "0.3rem 0.75rem", fontSize: "0.875rem" }}>{t("dashboard.gamification.level")} {userData.level}</span>
          </div>
          {(() => {
            const nextLevelXp = userData.level * 1000;
            const pct = Math.min(100, Math.round((userData.xp / nextLevelXp) * 100));
            const remaining = nextLevelXp - userData.xp;
            return (
              <>
                <div className="progress-brutal" style={{ height: "28px", border: "3px solid var(--color-navy)" }}>
                  <div className="progress-brutal__fill" style={{ width: `${pct}%`, background: "var(--color-purple)", borderRight: pct < 100 ? "3px solid var(--color-navy)" : "none" }} />
                  <div className="progress-brutal__label" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-white)" }}>{userData.xp.toLocaleString("id-ID")} / {nextLevelXp.toLocaleString("id-ID")} XP</div>
                </div>
                <p style={{ marginTop: "1rem", fontSize: "0.9375rem", color: "var(--color-navy)", fontWeight: 600, margin: "1rem 0 0 0" }}>
                  {t("dashboard.gamification.collectMoreXp")} <span style={{ color: "var(--color-orange)", fontWeight: 800 }}>{remaining.toLocaleString("id-ID")} XP</span> {t("dashboard.gamification.moreXpToReach")} {t("dashboard.gamification.level")} {userData.level + 1}!
                </p>
              </>
            );
          })()}
        </div>
      </div>

      <div style={{ marginBottom: "3rem" }}>
        {/* Badge Collection */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", margin: 0, color: "var(--color-navy)" }}>
              {t("dashboard.gamification.badgeCollection")}
            </h2>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 800, color: "var(--color-purple)" }}>
              {userData.unlockedBadges?.length || 0} / {badges.length} diraih
            </span>
          </div>
          {badges.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted)" }}>Memuat badge...</div>
          ) : (
            <div
              className="stagger-children"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {badges.map((badge) => {
                const isUnlocked = userData.unlockedBadges?.includes(badge.id);
                const badgeColor = badge.color || "lime";
                return (
                  <div
                    key={badge.id}
                    className="card-brutal"
                    style={{
                      textAlign: "center",
                      padding: "2rem 1.5rem",
                      opacity: isUnlocked ? 1 : 0.6,
                      filter: isUnlocked ? "none" : "grayscale(1)",
                      background: isUnlocked ? "var(--color-white)" : "var(--color-bg)",
                      border: "2.5px solid var(--color-navy)",
                      borderStyle: isUnlocked ? "solid" : "dashed",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      boxShadow: isUnlocked ? "4px 4px 0px var(--color-navy)" : "none",
                    }}
                  >
                    <div style={{ 
                      width: "64px", 
                      height: "64px", 
                      borderRadius: "50%", 
                      background: isUnlocked ? `var(--color-${badgeColor})` : "var(--color-border-light)",
                      border: "2px solid var(--color-navy)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.25rem",
                      boxShadow: isUnlocked ? "3px 3px 0px var(--color-navy)" : "none",
                      color: isUnlocked ? (badgeColor === "lime" ? "var(--color-navy)" : "var(--color-white)") : "var(--color-text-light)"
                    }}>
                      {renderIcon(badge.icon as string, 32)}
                    </div>
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.5rem", color: "var(--color-navy)" }}>
                      {badge.name}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", lineHeight: 1.5, marginBottom: "0.5rem" }}>
                      {badge.desc}
                    </div>
                    {isUnlocked && (
                      <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", fontWeight: 800, color: "var(--color-purple)", background: "var(--color-primary-light)", padding: "0.2rem 0.6rem", borderRadius: "100px", border: "1.5px solid var(--color-purple)" }}>
                        ✓ Diraih
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
