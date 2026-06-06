"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Award, PlayCircle, Clock, Loader2, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { getModules, getQuizzes } from "@/app/admin/education/actions";

export default function EducationPage() {
  const { unlockBadge } = useUser();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [modules, setModules] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"modules" | "quizzes">("modules");
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

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
    window.dispatchEvent(new CustomEvent("cami-force-open", { detail: showTipsBubble && !isClosingBubble }));
    return () => {
      window.dispatchEvent(new CustomEvent("cami-force-open", { detail: false }));
    };
  }, [showTipsBubble, isClosingBubble]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedModules = await getModules();
        const baseModules = fetchedModules.filter((m: any) => m.status === "published");
        
        // Add progress to modules
        const updatedModules = baseModules.map((mod: any) => {
          const saved = localStorage.getItem(`ceamis_module_${mod.id}_progress`);
          return {
            ...mod,
            level: mod.category || mod.level || "Beginner",
            color: mod.color || ["lime", "purple", "orange"][mod.id % 3], // fallback color
            progress: saved ? parseInt(saved) : 0
          };
        });
        setModules(updatedModules);

        // Get finished quizzes based on module IDs
        const quizzesFinished = updatedModules.filter((mod: any) => {
          return localStorage.getItem(`ceamis_quiz_${mod.id}_completed`) === "true";
        }).map((mod: any) => mod.id);
        setCompletedQuizzes(quizzesFinished);

        // Load quizzes from database
        const fetchedQuizzes = await getQuizzes();
        setQuizzes(fetchedQuizzes.filter((q: any) => q.status === "active"));
      } catch (error) {
        console.error("Failed to load education data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalModulesCompleted = modules.filter(m => m.progress === 100).length;
  const totalQuizzesCompleted = completedQuizzes.length;
  const totalCompleted = totalModulesCompleted + totalQuizzesCompleted;
  const totalItems = modules.length * 2; // Approximation if dynamic
  
  const modulesProgressSum = modules.reduce((acc, m) => acc + m.progress, 0);
  const quizzesProgressSum = totalQuizzesCompleted * 100;
  const overallProgress = totalItems > 0 ? Math.round(((modulesProgressSum + quizzesProgressSum) / (totalItems * 100)) * 100) : 0;

  useEffect(() => {
    // Unlock Bookworm when combined modules+quizzes >= 3 (matches the UI badge message)
    if (totalCompleted >= 3) {
      unlockBadge("bookworm");
    }
  }, [totalCompleted, unlockBadge]);

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "Beginner": case "Dasar": return "badge-brutal--lime";
      case "Intermediate": case "Menengah": return "badge-brutal--orange";
      case "Advanced": case "Mahir": return "badge-brutal--purple";
      default: return "";
    }
  };

  const translateLevel = (level: string) => {
    switch (level) {
      case "Beginner": case "Dasar": return t("dashboard.education.levelBeginner") || level;
      case "Intermediate": case "Menengah": return t("dashboard.education.levelIntermediate") || level;
      case "Advanced": case "Mahir": return t("dashboard.education.levelAdvanced") || level;
      default: return level;
    }
  };

  const filteredModules = modules.filter(mod => {
    if (!searchQuery) return true;
    const title = t(`dashboard.education.modules.${mod.id - 1}.title`);
    const desc = t(`dashboard.education.modules.${mod.id - 1}.desc`);
    return title.toLowerCase().includes(searchQuery.toLowerCase()) || desc.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ paddingBottom: "2rem" }}>
      {/* Header Area */}
      <div style={{ marginBottom: "3rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div style={{
          width: "72px",
          height: "72px",
          background: "var(--color-orange)",
          borderRadius: "var(--radius-brutal-sm)",
          border: "3px solid var(--color-navy)",
          boxShadow: "4px 4px 0px var(--color-navy)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <BookOpen size={40} color="var(--color-navy)" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", marginBottom: "0.25rem", color: "var(--color-navy)", fontWeight: 800 }}>
            {t("dashboard.education.title")}
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
            {t("dashboard.education.desc")}
          </p>
        </div>
      </div>

      {/* Learning Progress */}
      <div className="card-brutal animate-bounce-in" style={{ marginBottom: "3rem", background: "var(--color-white)", border: "3px solid var(--color-navy)", padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", margin: 0 }}>
            <div style={{
              width: "44px",
              height: "44px",
              background: "var(--color-orange)",
              border: "2.5px solid var(--color-navy)",
              borderRadius: "var(--radius-brutal-sm)",
              boxShadow: "3px 3px 0px var(--color-navy)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <Award size={22} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
            {t("dashboard.education.progressTitle")}
          </h3>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span className="badge-brutal badge-brutal--lime" style={{ fontSize: "0.9rem", padding: "0.4rem 0.8rem" }}>{totalModulesCompleted} {t("dashboard.education.modulesCompletedBadge")}</span>
            <span className="badge-brutal badge-brutal--orange" style={{ fontSize: "0.9rem", padding: "0.4rem 0.8rem" }}>{totalQuizzesCompleted} {t("dashboard.education.quizzesCompletedBadge")}</span>
          </div>
        </div>
        <div className="progress-brutal" style={{ height: "24px", border: "3px solid var(--color-navy)" }}>
          <div className="progress-brutal__fill" style={{ width: `${overallProgress}%`, background: "var(--color-orange)", borderRight: overallProgress > 0 ? "3px solid var(--color-navy)" : "none" }} />
          <div className="progress-brutal__label" style={{ fontSize: "0.9375rem", fontWeight: 700 }}>{overallProgress}% {overallProgress === 100 ? t("dashboard.education.statusDone").toLowerCase() : ""}</div>
        </div>
        <p style={{ marginTop: "1rem", fontSize: "1rem", color: "var(--color-navy)", fontWeight: 600, margin: "1rem 0 0 0" }}>
          {totalCompleted >= 3 ? (
             <span style={{ color: "var(--color-lime)", fontWeight: 800 }}>{t("dashboard.education.completedBadge")}</span>
          ) : (
            <>{t("dashboard.education.remainingBadge1")} {3 - totalCompleted} {t("dashboard.education.remainingBadge2")} <span style={{ color: "var(--color-purple)", fontWeight: 800 }}>&quot;{t("dashboard.gamification.badges.bookworm.name")}&quot;</span>!</>
          )}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <button 
          onClick={() => setActiveTab("modules")}
          className="btn-brutal"
          style={{
            padding: "0.75rem 1.5rem",
            background: activeTab === "modules" ? "var(--color-navy)" : "var(--color-white)",
            color: activeTab === "modules" ? "var(--color-white)" : "var(--color-navy)",
            fontWeight: 800,
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          {t("dashboard.education.modulesTab") || "Modul Materi"}
        </button>
        <button 
          onClick={() => setActiveTab("quizzes")}
          className="btn-brutal"
          style={{
            padding: "0.75rem 1.5rem",
            background: activeTab === "quizzes" ? "var(--color-navy)" : "var(--color-white)",
            color: activeTab === "quizzes" ? "var(--color-white)" : "var(--color-navy)",
            fontWeight: 800,
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          {t("dashboard.education.quizzesTab") || "Kuis Evaluasi"}
        </button>
      </div>

      {activeTab === "modules" ? (
        <>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--color-navy)" }}>
            {t("dashboard.education.chooseModule")}
          </h2>
          <div
            className="stagger-children"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {isLoading ? (
              <div style={{ gridColumn: "1 / -1", padding: "3rem", textAlign: "center", border: "3px dashed var(--color-navy)", borderRadius: "var(--radius-brutal)", background: "var(--color-white)" }}>
                <p style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <Loader2 className="animate-spin" size={20} /> Memuat modul...
                </p>
              </div>
            ) : filteredModules.length === 0 && (
              <div style={{ gridColumn: "1 / -1", padding: "3rem", textAlign: "center", border: "3px dashed var(--color-navy)", borderRadius: "var(--radius-brutal)", background: "var(--color-white)" }}>
                <p style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-navy)" }}>
                  {searchQuery 
                    ? <>{t("dashboard.education.searchNotFound1")}{searchQuery}{t("dashboard.education.searchNotFound2")}</>
                    : "Materi pembelajaran akan segera hadir."}
                </p>
              </div>
            )}
            {!isLoading && filteredModules.map((mod, index) => {
              const accentColor = `var(--color-${mod.color})`;
              return (
                <Link 
                  key={mod.id} 
                  href={`/dashboard/education/${mod.id}`}
                  className="card-brutal module-card" 
                  style={{ 
                    cursor: "pointer", 
                    display: "flex", 
                    flexDirection: "column", 
                    padding: 0, 
                    height: "100%",
                    background: "var(--color-white)",
                    overflow: "hidden",
                    textDecoration: "none",
                    ["--card-shadow-color" as any]: accentColor,
                    animation: `fadeUp 0.5s ease-out ${index * 0.1}s both`,
                    transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease"
                  }}
                >
                  <div style={{ background: accentColor, padding: "1rem 1.5rem", borderBottom: "3px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "var(--radius-brutal-sm)",
                      border: "2px solid var(--color-navy)",
                      background: "var(--color-white)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <PlayCircle size={20} color="var(--color-navy)" strokeWidth={2.5} />
                    </div>
                    <span className={`badge-brutal ${getLevelBadge(mod.level)}`} style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem", background: "var(--color-white)", color: "var(--color-navy)", border: "2px solid var(--color-navy)" }}>{translateLevel(mod.level)}</span>
                  </div>
                  
                  <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "var(--color-navy)", marginBottom: "0.5rem", fontWeight: 800 }}>
                      {mod.title || (mod.id > 10 ? `Modul Kustom #${mod.id}` : t(`dashboard.education.modules.${mod.id - 1}.title`))}
                    </h3>
                    <p style={{ fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--color-text-muted)", marginBottom: "1.5rem", flex: 1, fontWeight: 500 }}>
                      {mod.desc || (mod.id > 10 ? "Deskripsi modul pembelajaran kustom. Pelajari materi penting untuk meningkatkan wawasan finansialmu." : t(`dashboard.education.modules.${mod.id - 1}.desc`))}
                    </p>
                    
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "2px solid rgba(10, 25, 47, 0.05)" }}>
                      <span style={{ fontSize: "0.8125rem", color: "var(--color-navy)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Clock size={14} /> {mod.duration || (mod.id > 10 ? "5 menit" : t(`dashboard.education.modules.${mod.id - 1}.duration`))}
                      </span>
                      {mod.progress === 100 ? (
                        <span className="badge-brutal" style={{ background: "var(--color-lime)", color: "var(--color-navy)", border: "2px solid var(--color-navy)", fontSize: "0.75rem", boxShadow: "none" }}>{t("dashboard.education.statusDone")}</span>
                      ) : mod.progress > 0 ? (
                        <span className="badge-brutal" style={{ background: "var(--color-orange)", color: "var(--color-navy)", border: "2px solid var(--color-navy)", fontSize: "0.75rem", boxShadow: "none" }}>{mod.progress}%</span>
                      ) : (
                        <span className="badge-brutal" style={{ background: "var(--color-white)", color: "var(--color-navy)", border: "2px solid var(--color-navy)", fontSize: "0.75rem", boxShadow: "none" }}>{t("dashboard.education.statusStart")}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--color-navy)" }}>
            {t("dashboard.education.chooseQuiz") || "Pilih Kuis Evaluasi"}
          </h2>
          <div
            className="stagger-children"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {isLoading ? (
              <div style={{ gridColumn: "1 / -1", padding: "3rem", textAlign: "center", border: "3px dashed var(--color-navy)", borderRadius: "var(--radius-brutal)", background: "var(--color-white)" }}>
                <p style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <Loader2 className="animate-spin" size={20} /> Memuat kuis...
                </p>
              </div>
            ) : quizzes.length === 0 && (
              <div style={{ gridColumn: "1 / -1", padding: "3rem", textAlign: "center", border: "3px dashed var(--color-navy)", borderRadius: "var(--radius-brutal)", background: "var(--color-white)" }}>
                <p style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-navy)" }}>Belum ada kuis yang tersedia saat ini.</p>
              </div>
            )}
            {!isLoading && quizzes.map((quiz, index) => {
              const mod: any = modules.find(m => m.id === quiz.moduleId) || { title: `Modul #${quiz.moduleId}` };
              return (
                <Link 
                  key={quiz.id} 
                  href={`/dashboard/education/quiz/${quiz.moduleId}`}
                  className="card-brutal module-card" 
                  style={{ 
                    cursor: "pointer", 
                    display: "flex", 
                    flexDirection: "column", 
                    padding: 0, 
                    height: "100%",
                    background: "var(--color-white)",
                    overflow: "hidden",
                    textDecoration: "none",
                    ["--card-shadow-color" as any]: "var(--color-navy)",
                    animation: `fadeUp 0.5s ease-out ${index * 0.1}s both`,
                    transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease"
                  }}
                >
                  <div style={{ background: "var(--color-pink)", padding: "1rem 1.5rem", borderBottom: "3px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "var(--radius-brutal-sm)",
                      border: "2px solid var(--color-navy)",
                      background: "var(--color-white)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <Award size={20} color="var(--color-navy)" strokeWidth={2.5} />
                    </div>
                    <span className="badge-brutal" style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem", background: "var(--color-white)", color: "var(--color-navy)", border: "2px solid var(--color-navy)" }}>+{quiz.points || 150} XP</span>
                  </div>
                  
                  <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "var(--color-navy)", marginBottom: "0.5rem", fontWeight: 800 }}>
                      {t("dashboard.education.quizPrefix") || "Kuis:"} {quiz.question || mod.title || (!mod.id || mod.id > 10 ? `Modul Kustom #${quiz.moduleId}` : t(`dashboard.education.modules.${mod.id - 1}.title`))}
                    </h3>
                    <p style={{ fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--color-text-muted)", marginBottom: "1.5rem", flex: 1, fontWeight: 500 }}>
                      {t("dashboard.education.quizDesc")} {mod.title || (!mod.id || mod.id > 10 ? `Modul Kustom #${quiz.moduleId}` : t(`dashboard.education.modules.${mod.id - 1}.title`))} {t("dashboard.education.quizDesc2")}
                    </p>
                    
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "2px solid rgba(10, 25, 47, 0.05)" }}>
                      <span style={{ fontSize: "0.8125rem", color: "var(--color-navy)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Clock size={14} /> 2 menit
                      </span>
                      {completedQuizzes.includes(quiz.moduleId) ? (
                        <span className="badge-brutal" style={{ background: "var(--color-lime)", color: "var(--color-navy)", border: "2px solid var(--color-navy)", fontSize: "0.75rem", boxShadow: "none" }}>{t("dashboard.education.statusDone") || "SELESAI"}</span>
                      ) : (
                        <span className="badge-brutal" style={{ background: "var(--color-white)", color: "var(--color-navy)", border: "2px solid var(--color-navy)", fontSize: "0.75rem", boxShadow: "none" }}>{t("dashboard.education.startQuizBtn") || "MULAI KUIS"}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* CAMI Tips Bubble Overlay */}
      {showTipsBubble && (
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
                "Tingkatkan literasi keuanganmu dengan membaca modul-modul ini. Pengetahuan adalah investasi terbaik!"
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
