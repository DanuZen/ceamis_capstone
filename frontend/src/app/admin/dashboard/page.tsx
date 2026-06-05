"use client";

import { useState, useEffect } from "react";
import { Users, BookOpen, FileQuestion, Trophy, CheckCircle, Clock } from "lucide-react";
import { getModules, getQuizzes } from "../education/actions";
import { getBadges } from "../gamification/actions";
import { getTotalUsers } from "./actions";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const [totalModules, setTotalModules] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [totalBadges, setTotalBadges] = useState(0);

  const [totalUsers, setTotalUsers] = useState(0);

  const [latestModules, setLatestModules] = useState<any[]>([]);
  const [latestQuizzes, setLatestQuizzes] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [mods, qzs, bdgs, usersCount] = await Promise.all([
          getModules(),
          getQuizzes(),
          getBadges(),
          getTotalUsers()
        ]);
        setTotalModules(mods.length);
        setTotalQuizzes(qzs.length);
        setTotalBadges(bdgs.length);
        setTotalUsers(usersCount);
        
        // Sort to get latest, assuming higher ID or createdAt if available, otherwise just slice last
        setLatestModules(mods.slice(-4).reverse());
        setLatestQuizzes(qzs.slice(-4).reverse());
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div style={{
          width: "72px", height: "72px", background: "var(--color-purple)",
          borderRadius: "var(--radius-brutal-sm)", border: "3px solid var(--color-navy)",
          boxShadow: "4px 4px 0px var(--color-navy)", display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <CheckCircle size={40} color="var(--color-white)" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", marginBottom: "0.25rem", color: "var(--color-navy)", fontWeight: 800 }}>
            {t("admin.dashboard.title")}
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
            {t("admin.dashboard.desc")}
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        {[
          { label: t("admin.dashboard.stats.activeModules") || "Total Modul Edukasi", value: totalModules, icon: BookOpen, color: "lime" },
          { label: t("admin.dashboard.stats.quizzes") || "Total Kuis Tersedia", value: totalQuizzes, icon: FileQuestion, color: "purple" },
          { label: t("admin.dashboard.stats.badges") || "Total Badge Gamifikasi", value: totalBadges, icon: Trophy, color: "orange" },
          { label: t("admin.dashboard.stats.users") || "Total Pengguna Aktif", value: totalUsers, icon: Users, color: "white" },
        ].map((stat, i) => (
          <div key={i} className="card-brutal animate-slide-up" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", animationDelay: `${i * 0.1}s`, background: stat.color === "white" ? "var(--color-navy)" : "var(--color-white)" }}>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 800, color: stat.color === "white" ? "rgba(255,255,255,0.7)" : "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>{stat.label}</div>
              <div style={{ fontSize: "2.5rem", fontWeight: 900, color: stat.color === "white" ? "var(--color-white)" : "var(--color-navy)" }}>{stat.value}</div>
            </div>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: stat.color === "white" ? "var(--color-purple)" : `var(--color-${stat.color})`, display: "flex", alignItems: "center", justifyContent: "center", border: stat.color === "white" ? "2px solid var(--color-white)" : "2px solid var(--color-navy)" }}>
              <stat.icon size={24} color={stat.color === "purple" ? "var(--color-white)" : "var(--color-navy)"} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "var(--color-navy)", marginBottom: "1rem" }}>{t("admin.dashboard.latestModules")}</h2>
          <div className="card-brutal" style={{ padding: 0, overflow: "hidden", background: "var(--color-white)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--color-bg)", borderBottom: "2px solid var(--color-navy)" }}>
                  <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>{t("admin.dashboard.colTitle")}</th>
                  <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>{t("admin.dashboard.colCategory")}</th>
                  <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>{t("admin.dashboard.colStatus")}</th>
                </tr>
              </thead>
              <tbody>
                {latestModules.length === 0 ? (
                  <tr><td colSpan={3} style={{ padding: "1rem", textAlign: "center", color: "var(--color-text-muted)" }}>{t("admin.dashboard.noModules")}</td></tr>
                ) : latestModules.map((mod, i) => (
                  <tr key={i} style={{ borderBottom: i < latestModules.length - 1 ? "1px solid rgba(0,0,0,0.1)" : "none" }}>
                    <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-navy)" }}>{mod.title}</td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-muted)" }}>{mod.category || "Dasar"}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ 
                        padding: "0.25rem 0.5rem", background: mod.isPublished ? "var(--color-lime)" : "var(--color-orange)", 
                        color: "var(--color-navy)", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 800, border: "1px solid var(--color-navy)", display: "flex", alignItems: "center", gap: "0.25rem", width: "fit-content"
                      }}>
                        {mod.isPublished ? <CheckCircle size={12} /> : <Clock size={12} />} {mod.isPublished ? t("admin.dashboard.published") : t("admin.dashboard.draft")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kuis Terbaru */}
        <div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "var(--color-navy)", marginBottom: "1rem" }}>{t("admin.dashboard.latestQuizzes")}</h2>
          <div className="card-brutal" style={{ padding: 0, overflow: "hidden", background: "var(--color-white)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--color-bg)", borderBottom: "2px solid var(--color-navy)" }}>
                  <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>{t("admin.dashboard.colQuestion")}</th>
                  <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>{t("admin.dashboard.colModuleId")}</th>
                  <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>{t("admin.dashboard.colXp")}</th>
                </tr>
              </thead>
              <tbody>
                {latestQuizzes.length === 0 ? (
                  <tr><td colSpan={3} style={{ padding: "1rem", textAlign: "center", color: "var(--color-text-muted)" }}>{t("admin.dashboard.noQuizzes")}</td></tr>
                ) : latestQuizzes.map((quiz, i) => (
                  <tr key={i} style={{ borderBottom: i < latestQuizzes.length - 1 ? "1px solid rgba(0,0,0,0.1)" : "none" }}>
                    <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-navy)", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{quiz.question}</td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: 800, color: "var(--color-purple)" }}>#{quiz.moduleId}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ 
                        padding: "0.25rem 0.5rem", background: "var(--color-pink)", 
                        color: "var(--color-navy)", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 800, border: "1px solid var(--color-navy)", display: "flex", alignItems: "center", gap: "0.25rem", width: "fit-content"
                      }}>
                        <Trophy size={12} /> +{quiz.xpReward || 150}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
