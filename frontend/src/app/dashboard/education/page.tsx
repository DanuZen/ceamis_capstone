"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Award, PlayCircle, Clock } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";

const initialModules = [
  {
    id: 1,
    title: "Dasar-Dasar Budgeting",
    desc: "Belajar membuat anggaran bulanan yang realistis dan bisa dijalankan.",
    level: "Beginner",
    duration: "5 menit",
    color: "lime",
    progress: 0,
  },
  {
    id: 2,
    title: "Emergency Fund 101",
    desc: "Kenapa kamu HARUS punya dana darurat dan cara mulai dari Rp 0.",
    level: "Beginner",
    duration: "7 menit",
    color: "purple",
    progress: 0,
  },
  {
    id: 3,
    title: "Investasi untuk Pemula",
    desc: "Reksadana, saham, crypto? Mana yang cocok buat Gen-Z? Kita bahas!",
    level: "Intermediate",
    duration: "10 menit",
    color: "orange",
    progress: 0,
  },
  {
    id: 4,
    title: "Psikologi Belanja Impulsif",
    desc: "Kenapa otak kita suka checkout dan gimana cara hack-nya!",
    level: "Intermediate",
    duration: "8 menit",
    color: "lime",
    progress: 0,
  },
  {
    id: 5,
    title: "Manajemen Utang Sehat",
    desc: "Utang bukan musuh! Pelajari cara kelola utang biar nggak jadi beban.",
    level: "Advanced",
    duration: "12 menit",
    color: "purple",
    progress: 0,
  },
  {
    id: 6,
    title: "Financial Goal Setting",
    desc: "Cara bikin target keuangan SMART yang achievable dan motivating.",
    level: "Advanced",
    duration: "10 menit",
    color: "orange",
    progress: 0,
  },
];

export default function EducationPage() {
  const { unlockBadge } = useUser();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [modules, setModules] = useState(initialModules);
  const { t } = useLanguage();

  useEffect(() => {
    // Load progress from localStorage
    const updatedModules = initialModules.map(mod => {
      const saved = localStorage.getItem(`ceamis_module_${mod.id}_progress`);
      return {
        ...mod,
        progress: saved ? parseInt(saved) : 0
      };
    });
    setModules(updatedModules);
  }, []);

  const totalCompleted = modules.filter(m => m.progress === 100).length;
  const overallProgress = Math.round((modules.reduce((acc, m) => acc + m.progress, 0) / (modules.length * 100)) * 100);

  useEffect(() => {
    if (totalCompleted >= 3) {
      unlockBadge("Bookworm");
    }
  }, [totalCompleted, unlockBadge]);

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "Beginner": return "badge-brutal--lime";
      case "Intermediate": return "badge-brutal--orange";
      case "Advanced": return "badge-brutal--purple";
      default: return "";
    }
  };

  const filteredModules = modules.filter(mod => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return mod.title.toLowerCase().includes(q) || mod.desc.toLowerCase().includes(q);
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
            <Award size={28} color="var(--color-orange)" strokeWidth={2.5} />
            Progress Belajar
          </h3>
          <span className="badge-brutal badge-brutal--lime" style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>{totalCompleted} / 6 Modul Selesai</span>
        </div>
        <div className="progress-brutal" style={{ height: "24px", border: "3px solid var(--color-navy)" }}>
          <div className="progress-brutal__fill" style={{ width: `${overallProgress}%`, background: "var(--color-orange)", borderRight: overallProgress > 0 ? "3px solid var(--color-navy)" : "none" }} />
          <div className="progress-brutal__label" style={{ fontSize: "0.9375rem", fontWeight: 700 }}>{overallProgress}% selesai</div>
        </div>
        <p style={{ marginTop: "1rem", fontSize: "1rem", color: "var(--color-navy)", fontWeight: 600, margin: "1rem 0 0 0" }}>
          {totalCompleted >= 3 ? (
             <span style={{ color: "var(--color-lime)", fontWeight: 800 }}>Kamu sudah dapet badge "Bookworm"! Mantap!</span>
          ) : (
            <>Selesaikan {3 - totalCompleted} modul lagi untuk dapet badge <span style={{ color: "var(--color-purple)", fontWeight: 800 }}>"Bookworm"</span>!</>
          )}
        </p>
      </div>

      {/* Module Cards */}
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--color-navy)" }}>
        Pilih Modul
      </h2>
      <div
        className="stagger-children"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {filteredModules.length === 0 && (
          <div style={{ gridColumn: "1 / -1", padding: "3rem", textAlign: "center", border: "3px dashed var(--color-navy)", borderRadius: "var(--radius-brutal)", background: "var(--color-white)" }}>
            <p style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-navy)" }}>Pencarian untuk "{searchQuery}" tidak ditemukan.</p>
          </div>
        )}
        {filteredModules.map((mod, index) => {
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
                <span className={`badge-brutal ${getLevelBadge(mod.level)}`} style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem", background: "var(--color-white)", color: "var(--color-navy)", border: "2px solid var(--color-navy)" }}>{mod.level}</span>
              </div>
              
              <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "var(--color-navy)", marginBottom: "0.5rem", fontWeight: 800 }}>
                  {mod.title}
                </h3>
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--color-text-muted)", marginBottom: "1.5rem", flex: 1, fontWeight: 500 }}>
                  {mod.desc}
                </p>
                
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "2px solid rgba(10, 25, 47, 0.05)" }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--color-navy)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Clock size={14} /> {mod.duration}
                  </span>
                  {mod.progress === 100 ? (
                    <span className="badge-brutal" style={{ background: "var(--color-lime)", color: "var(--color-navy)", border: "2px solid var(--color-navy)", fontSize: "0.75rem", boxShadow: "none" }}>SELESAI</span>
                  ) : mod.progress > 0 ? (
                    <span className="badge-brutal" style={{ background: "var(--color-orange)", color: "var(--color-navy)", border: "2px solid var(--color-navy)", fontSize: "0.75rem", boxShadow: "none" }}>{mod.progress}%</span>
                  ) : (
                    <span className="badge-brutal" style={{ background: "var(--color-white)", color: "var(--color-navy)", border: "2px solid var(--color-navy)", fontSize: "0.75rem", boxShadow: "none" }}>MULAI</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
