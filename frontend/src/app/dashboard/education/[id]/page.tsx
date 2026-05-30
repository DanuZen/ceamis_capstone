"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, ChevronRight, CheckCircle } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";

const moduleData = {
  "1": {
  }
};



export default function ModuleDetailPage() {
  const { addXp } = useUser();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const [content, setContent] = useState<any[]>([]);
  const [moduleTitle, setModuleTitle] = useState("");

  useEffect(() => {
    // 1. Fetch title from modules
    const savedModules = localStorage.getItem("ceamis_modules");
    if (savedModules) {
      const parsed = JSON.parse(savedModules);
      const mod = parsed.find((m: any) => m.id.toString() === id);
      if (mod && mod.title) {
        setModuleTitle(mod.title);
      } else {
        setModuleTitle(t(`dashboard.education.modules.${parseInt(id) - 1}.title`));
      }
    } else {
      setModuleTitle(t(`dashboard.education.modules.${parseInt(id) - 1}.title`));
    }

    // 2. Fetch content
    const savedContent = localStorage.getItem(`ceamis_module_content_${id}`);
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    } else {
      const translatedContent = t(`dashboard.education.detail.moduleData.${id}`, { returnObjects: true }) || t(`dashboard.education.detail.moduleData.1`, { returnObjects: true });
      const contentArray = Array.isArray(translatedContent) ? translatedContent : [];
      setContent(contentArray);
    }
  }, [id, t]);

  const module = {
    title: moduleTitle,
    content: content,
  };

  const handleNext = () => {
    if (currentPage < module.content.length - 1) {
      setCurrentPage(prev => prev + 1);
      // Update progress
      const newProgress = Math.round(((currentPage + 2) / module.content.length) * 100);
      localStorage.setItem(`ceamis_module_${id}_progress`, newProgress.toString());
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  const handleFinish = () => {
    const isCompleted = localStorage.getItem(`ceamis_module_${id}_completed`);
    if (!isCompleted) {
      addXp(150); // Add 150 XP for finishing a module
      localStorage.setItem(`ceamis_module_${id}_completed`, "true");
    }
    localStorage.setItem(`ceamis_module_${id}_progress`, "100");
    router.push("/dashboard/education");
  };

  const currentProgress = module.content.length > 0 ? Math.round(((currentPage + 1) / module.content.length) * 100) : 0;

  if (module.content.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - var(--navbar-height) - 4rem)" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/dashboard/education" style={{ textDecoration: "none" }}>
          <button className="btn-brutal" style={{ padding: "0.5rem 1rem", background: "var(--color-white)", border: "3px solid var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800 }}>
            <ArrowLeft size={18} /> {t("dashboard.education.detail.back")}
          </button>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="badge-brutal" style={{ background: "var(--color-white)", border: "2px solid var(--color-navy)", fontSize: "0.875rem" }}>
             {currentProgress}% {t("dashboard.education.detail.donePct")}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row-reverse", gap: "2rem", flex: 1, overflow: "hidden" }}>
        {/* Sidebar Nav */}
        <div style={{ width: "280px", background: "var(--color-white)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", height: "fit-content", border: "2.5px solid var(--color-navy)", borderRadius: "12px" }}>
          <h4 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "1px" }}>{t("dashboard.education.detail.tableOfContents")}</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {module.content.map((item, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentPage(index)}
                style={{ 
                  padding: "0.75rem", 
                  borderRadius: "var(--radius-brutal-sm)", 
                  border: "2px solid var(--color-navy)",
                  background: currentPage === index ? "var(--color-orange)" : (currentPage > index ? "var(--color-lime)" : "var(--color-bg)"),
                  color: "var(--color-navy)",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {currentPage > index ? <CheckCircle size={14} /> : <ChevronRight size={14} />}
                {item.subtitle}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div 
          style={{ 
            flex: 1, 
            background: "var(--color-white)", 
            padding: "3rem", 
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            border: "2.5px solid var(--color-navy)",
            borderRadius: "12px"
          }}
        >
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--color-navy)", marginBottom: "1rem" }}>
              <BookOpen size={24} color="var(--color-navy)" />
              <span style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>{t("dashboard.education.detail.moduleLabel")} {id}</span>
              <span style={{ color: "var(--color-navy)", opacity: 0.2 }}>•</span>
              <span style={{ color: "var(--color-navy)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                {t("dashboard.education.detail.pageLabel")} {currentPage + 1} {t("dashboard.education.detail.fromLabel")} {module.content.length}
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "3rem", margin: 0, lineHeight: 1.1, fontWeight: 900 }}>{module.title}</h1>
          </div>

          <div style={{ flex: 1, position: "relative" }}>
            {module.content.map((item, index) => (
              <section 
                key={index}
                style={{
                  display: currentPage === index ? "block" : "none",
                }}
              >
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", marginBottom: "1.5rem", color: "var(--color-navy)", borderLeft: "8px solid var(--color-navy)", paddingLeft: "1.25rem" }}>
                  {item.subtitle}
                </h2>
                <p style={{ fontSize: "1.25rem", lineHeight: 1.8, color: "var(--color-text-muted)", fontWeight: 500 }}>
                  {item.text}
                </p>
              </section>
            ))}
          </div>

          {/* Navigation Controls */}
          <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button 
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="btn-brutal"
              style={{ padding: "0.75rem 1.5rem", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem", background: currentPage === 0 ? "var(--color-bg)" : "var(--color-white)", opacity: currentPage === 0 ? 0.5 : 1, cursor: currentPage === 0 ? "not-allowed" : "pointer" }}
            >
              <ArrowLeft size={20} /> {t("dashboard.education.detail.prev")}
            </button>

            {currentPage === module.content.length - 1 ? (
              <button 
                onClick={handleFinish}
                className="btn-brutal btn-brutal--primary" 
                style={{ padding: "1rem 2rem", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}
              >
                {t("dashboard.education.detail.finishXp")} <CheckCircle size={24} />
              </button>
            ) : (
              <button 
                onClick={handleNext}
                className="btn-brutal"
                style={{ padding: "0.75rem 1.5rem", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--color-lime)" }}
              >
                {t("dashboard.education.detail.next")} <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 12px;
        }
        ::-webkit-scrollbar-track {
          background: var(--color-bg);
          border-left: 3px solid var(--color-navy);
        }
        ::-webkit-scrollbar-thumb {
          background: var(--color-navy);
          border: 3px solid var(--color-bg);
        }
      `}</style>
    </div>
  );
}
