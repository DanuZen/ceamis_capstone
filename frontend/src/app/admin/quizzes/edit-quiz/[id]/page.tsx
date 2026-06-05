"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronRight, CheckCircle, Save, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getQuizByModule, saveModuleQuizzes } from "../../../education/actions";

export default function EditQuizPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { t } = useLanguage();
  
  const [quizTitle, setQuizTitle] = useState("");
  const [content, setContent] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [popupMessage, setPopupMessage] = useState<{title: string, message: string, type: "success" | "error"} | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setQuizTitle(`Kuis untuk Modul ${id}`);
      try {
        const quizzes = await getQuizByModule(Number(id));
        if (quizzes && quizzes.length > 0) {
          setContent(quizzes);
        } else {
          // Fallback for demo
          setContent([{
            question: "Pertanyaan Baru",
            options: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
            correctAnswer: 0,
            explanation: "Penjelasan jawaban benar"
          }]);
        }
      } catch (error) {
        console.error("Failed to load quizzes:", error);
      }
    };
    fetchData();
  }, [id, t]);

  const handleSave = async () => {
    await saveModuleQuizzes(Number(id), content);
    setPopupMessage({ title: t("admin.editQuiz.successTitle") || "Berhasil!", message: t("admin.editQuiz.successMsg") || "Pertanyaan kuis berhasil disimpan!", type: "success" });
  };

  const handleAddQuestion = () => {
    setContent([...content, { 
      question: "Pertanyaan Baru",
      options: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
      correctAnswer: 0,
      explanation: "Penjelasan jawaban benar"
    }]);
    setCurrentPage(content.length);
  };

  const handleRemoveQuestion = (indexToRemove: number) => {
    if (content.length <= 1) {
      setPopupMessage({ title: "Oops!", message: t("admin.editQuiz.minQuestionErr") || "Kuis harus memiliki minimal 1 pertanyaan.", type: "error" });
      return;
    }
    const newContent = content.filter((_, i) => i !== indexToRemove);
    setContent(newContent);
    if (currentPage >= newContent.length) {
      setCurrentPage(newContent.length - 1);
    }
  };

  const handleQuestionChange = (val: string) => {
    const newContent = [...content];
    newContent[currentPage].question = val;
    setContent(newContent);
  };

  const handleExplanationChange = (val: string) => {
    const newContent = [...content];
    newContent[currentPage].explanation = val;
    setContent(newContent);
  };

  const handleOptionChange = (optIndex: number, val: string) => {
    const newContent = [...content];
    newContent[currentPage].options[optIndex] = val;
    setContent(newContent);
  };
  
  const handleCorrectAnswerChange = (optIndex: number) => {
    const newContent = [...content];
    newContent[currentPage].correctAnswer = optIndex;
    setContent(newContent);
  };

  if (content.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - var(--navbar-height) - 4rem)" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/admin/quizzes" style={{ textDecoration: "none" }}>
          <button className="btn-brutal" style={{ padding: "0.5rem 1rem", background: "var(--color-white)", border: "3px solid var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800 }}>
            <ArrowLeft size={18} /> {t("admin.editQuiz.back") || "Kembali ke Manajemen Kuis"}
          </button>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={handleSave} className="btn-brutal btn-brutal--primary" style={{ padding: "0.5rem 1rem", background: "var(--color-purple)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800, color: "var(--color-white)" }}>
             <Save size={18} /> {t("admin.editQuiz.saveQuestions") || "Simpan Pertanyaan"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row-reverse", gap: "2rem", flex: 1, overflow: "hidden" }}>
        {/* Sidebar Nav */}
        <div style={{ width: "280px", background: "var(--color-white)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", height: "fit-content", border: "2.5px solid var(--color-navy)", borderRadius: "12px", overflowY: "auto", maxHeight: "100%" }}>
          <h4 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "1px" }}>{t("admin.editQuiz.questionList") || "Daftar Pertanyaan"}</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {content.map((item, index) => (
              <div key={index} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <button 
                  onClick={() => setCurrentPage(index)}
                  style={{ 
                    flex: 1,
                    padding: "0.75rem", 
                    borderRadius: "var(--radius-brutal-sm)", 
                    border: "2px solid var(--color-navy)",
                    background: currentPage === index ? "var(--color-orange)" : "var(--color-bg)",
                    color: "var(--color-navy)",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis"
                  }}
                  title={item.question}
                >
                  <ChevronRight size={14} style={{ minWidth: "14px" }} />
                  {item.question.length > 15 ? item.question.substring(0, 15) + "..." : item.question || (t("admin.editQuiz.newQuestion") || "Pertanyaan Baru")}
                </button>
                <button onClick={() => handleRemoveQuestion(index)} style={{ padding: "0.5rem", background: "var(--color-danger, #e74c3c)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trash2 size={16} color="white" />
                </button>
              </div>
            ))}
            <button 
              onClick={handleAddQuestion}
              className="btn-brutal"
              style={{ marginTop: "0.5rem", padding: "0.5rem", background: "var(--color-lime)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontWeight: 800 }}
            >
              <Plus size={16} /> {t("admin.editQuiz.addQuestion") || "Tambah Pertanyaan"}
            </button>
          </div>
        </div>

        {/* Content Area Editor */}
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
            borderRadius: "12px",
            overflowY: "auto"
          }}
        >
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--color-navy)", marginBottom: "1rem" }}>
              <BookOpen size={24} color="var(--color-navy)" />
              <span style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>{t("admin.editQuiz.editorMode") || "Editor Kuis"}</span>
              <span style={{ color: "var(--color-navy)", opacity: 0.2 }}>•</span>
              <span style={{ color: "var(--color-navy)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                {t("admin.editQuiz.questionOf") ? t("admin.editQuiz.questionOf").replace("{current}", String(currentPage + 1)).replace("{total}", String(content.length)) : `Soal ${currentPage + 1} dari ${content.length}`}
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", margin: 0, lineHeight: 1.1, fontWeight: 900 }}>{quizTitle}</h1>
          </div>

          <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="input-group-brutal" style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>{t("admin.editQuiz.questionLabel") || "Pertanyaan"}</label>
              <textarea 
                value={content[currentPage].question} 
                onChange={(e) => handleQuestionChange(e.target.value)}
                className="input-brutal" 
                style={{ width: "100%", fontSize: "1.25rem", fontWeight: 700, padding: "1rem", minHeight: "100px", resize: "vertical" }} 
              />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block" }}>{t("admin.editQuiz.optionsLabel") || "Pilihan Ganda (Pilih jawaban yang benar)"}</label>
              {content[currentPage].options.map((opt: string, optIndex: number) => (
                <div key={optIndex} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <input 
                    type="radio" 
                    name={`correct-answer-${currentPage}`} 
                    checked={content[currentPage].correctAnswer === optIndex}
                    onChange={() => handleCorrectAnswerChange(optIndex)}
                    style={{ width: "24px", height: "24px", accentColor: "var(--color-lime)", cursor: "pointer" }}
                  />
                  <input 
                    value={opt}
                    onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                    className="input-brutal"
                    style={{ flex: 1, padding: "0.75rem", background: content[currentPage].correctAnswer === optIndex ? "rgba(224, 255, 34, 0.2)" : "var(--color-white)", border: content[currentPage].correctAnswer === optIndex ? "2px solid var(--color-lime)" : "2px solid var(--color-navy)" }}
                  />
                </div>
              ))}
            </div>

            <div className="input-group-brutal" style={{ flex: 1, display: "flex", flexDirection: "column", marginTop: "1rem" }}>
              <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>{t("admin.editQuiz.explanationLabel") || "Penjelasan (Muncul setelah dijawab)"}</label>
              <textarea 
                value={content[currentPage].explanation}
                onChange={(e) => handleExplanationChange(e.target.value)}
                className="input-brutal"
                style={{ width: "100%", minHeight: "100px", resize: "vertical", fontSize: "1.1rem", lineHeight: 1.6, padding: "1.25rem" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {popupMessage && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(10, 25, 47, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "1rem" }}>
          <div className="card-brutal animate-bounce-in" style={{ background: "var(--color-white)", width: "100%", maxWidth: "400px", padding: "2rem", textAlign: "center", border: "3px solid var(--color-navy)" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1rem", color: popupMessage.type === "error" ? "var(--color-danger, #e74c3c)" : "var(--color-lime)" }}>
              {popupMessage.title}
            </h2>
            <p style={{ fontSize: "1.1rem", color: "var(--color-navy)", fontWeight: 600, marginBottom: "1.5rem" }}>
              {popupMessage.message}
            </p>
            <button 
              onClick={() => {
                const wasSuccess = popupMessage.type === "success";
                setPopupMessage(null);
                if (wasSuccess) router.push("/admin/quizzes");
              }}
              className="btn-brutal" 
              style={{ padding: "0.75rem 2rem", background: "var(--color-navy)", color: "var(--color-white)", fontWeight: 800, fontSize: "1.1rem" }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
