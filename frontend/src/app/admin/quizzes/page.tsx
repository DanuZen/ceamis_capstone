"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, X, FileQuestion, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { getQuizzes, createQuiz, updateQuiz, deleteQuiz } from "../education/actions";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminQuizzesPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [quizzes, setQuizzesState] = useState<any[]>([]);
  const [popupMessage, setPopupMessage] = useState<{title: string, message: string, type: "success" | "error"} | null>(null);

  const fetchQuizzes = async () => {
    try {
      const data = await getQuizzes();
      setQuizzesState(data);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const setQuizzes = (newQuizzes: any[]) => {
    setQuizzesState(newQuizzes);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId !== null) {
      await deleteQuiz(deleteConfirmId);
      await fetchQuizzes();
      setDeleteConfirmId(null);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newItemData = {
      moduleId: Number(formData.get("moduleId")),
      question: formData.get("question") as string,
      points: Number(formData.get("points")),
      status: formData.get("status") as string || "active",
      options: ["", "", "", ""], // default options if missing
      correctAnswer: 0
    };
    
    if (editingItem) {
      await updateQuiz(editingItem.id, {
        moduleId: newItemData.moduleId,
        question: newItemData.question,
        points: newItemData.points,
        status: newItemData.status
      });
      await fetchQuizzes();
      setIsModalOpen(false);
    } else {
      const created = await createQuiz(newItemData);
      await fetchQuizzes();
      setIsModalOpen(false);
      // Auto redirect to content editor
      router.push(`/admin/quizzes/edit-quiz/${created.moduleId}`);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{
            width: "72px", height: "72px", background: "var(--color-purple)",
            borderRadius: "var(--radius-brutal-sm)", border: "3px solid var(--color-navy)",
            boxShadow: "4px 4px 0px var(--color-navy)", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <FileQuestion size={40} color="var(--color-white)" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", marginBottom: "0.25rem", color: "var(--color-navy)", fontWeight: 800 }}>
              {t("admin.quizzes.title")}
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
              {t("admin.quizzes.desc")}
            </p>
          </div>
        </div>
        <button onClick={openAddModal} className="btn-brutal" style={{ background: "var(--color-purple)", color: "var(--color-white)", padding: "0.75rem 1.5rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "3px 3px 0px var(--color-navy)", marginLeft: "auto" }}>
          <Plus size={18} /> {t("admin.quizzes.addQuiz")}
        </button>
      </div>

      <div className="card-brutal animate-fade-in" style={{ padding: 0, overflow: "hidden", background: "var(--color-white)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "600px" }}>
            <thead>
              <tr style={{ background: "var(--color-bg)", borderBottom: "3px solid var(--color-navy)" }}>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)" }}>{t("admin.dashboard.colQuestion")}</th>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)" }}>{t("admin.dashboard.colXp")}</th>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)" }}>{t("admin.dashboard.colStatus")}</th>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)", width: "120px", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, i) => (
                <tr key={quiz.id} style={{ borderBottom: i < quizzes.length - 1 ? "2px solid rgba(10, 25, 47, 0.05)" : "none" }}>
                  <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "var(--color-navy)" }}>{quiz.question}</td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span className="badge-brutal" style={{ background: "var(--color-pink)", fontSize: "0.75rem", boxShadow: "none" }}>+{quiz.points} XP</span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span className="badge-brutal" style={{
                      padding: "0.25rem 0.75rem", fontSize: "0.75rem", boxShadow: "none",
                      background: quiz.status === "active" ? "var(--color-lime)" : "var(--color-orange)",
                    }}>
                      {quiz.status === "active" ? t("admin.dashboard.published") || "Aktif" : t("admin.dashboard.draft") || "Draft"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                      <button onClick={() => router.push(`/admin/quizzes/edit-quiz/${quiz.moduleId}`)} className="btn-brutal" title="Edit Konten" style={{ padding: "0.4rem", background: "var(--color-lime)", cursor: "pointer", boxShadow: "none" }}>
                        <FileText size={16} color="var(--color-navy)" />
                      </button>
                      <button onClick={() => openEditModal(quiz)} className="btn-brutal" title="Edit Metadata" style={{ padding: "0.4rem", background: "var(--color-purple)", cursor: "pointer", boxShadow: "none" }}>
                        <Edit size={16} color="var(--color-white)" />
                      </button>
                      <button onClick={() => handleDelete(quiz.id)} className="btn-brutal" title="Hapus" style={{ padding: "0.4rem", background: "var(--color-danger, #e74c3c)", cursor: "pointer", boxShadow: "none" }}>
                        <Trash2 size={16} color="var(--color-white)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {quizzes.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)", fontWeight: 600 }}>
                    {t("admin.dashboard.noQuizzes")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(10, 25, 47, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "1rem" }}>
          <div className="card-brutal animate-bounce-in" style={{ background: "var(--color-white)", width: "100%", maxWidth: "500px", position: "relative" }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="btn-brutal"
              style={{ position: "absolute", top: "1rem", right: "1rem", padding: "0.5rem", background: "var(--color-danger, #e74c3c)", boxShadow: "none" }}
            >
              <X size={16} color="var(--color-white)" />
            </button>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FileQuestion size={24} color="var(--color-purple)" />
              {editingItem ? t("admin.quizzes.editQuiz") : t("admin.quizzes.addQuiz")}
            </h2>
            
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className="input-group-brutal">
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>{t("admin.quizzes.form.questionLabel")}</label>
                <textarea name="question" defaultValue={editingItem?.question} required className="input-brutal" style={{ width: "100%", minHeight: "80px", resize: "vertical" }} placeholder={t("admin.quizzes.form.questionPlaceholder")} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="input-group-brutal">
                  <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>{t("admin.quizzes.form.moduleId")}</label>
                  <input name="moduleId" type="number" defaultValue={editingItem?.moduleId} required className="input-brutal" style={{ width: "100%" }} placeholder={t("admin.quizzes.form.moduleIdPlaceholder")} />
                </div>
                <div className="input-group-brutal">
                  <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>XP Points</label>
                  <input name="points" type="number" defaultValue={editingItem?.points || 150} required className="input-brutal" style={{ width: "100%" }} />
                </div>
              </div>
              <div className="input-group-brutal">
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>{t("admin.quizzes.form.status")}</label>
                <select name="status" defaultValue={editingItem?.status || "active"} className="input-brutal" style={{ width: "100%" }}>
                  <option value="active">{t("admin.quizzes.form.active")}</option>
                  <option value="draft">{t("admin.quizzes.form.draft")}</option>
                </select>
              </div>
              
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-brutal" style={{ background: "var(--color-bg)", fontWeight: 700 }}>
                  {t("admin.form.cancel")}
                </button>
                <button type="submit" className="btn-brutal btn-brutal--primary" style={{ fontWeight: 800, background: "var(--color-purple)", color: "var(--color-white)" }}>
                  {t("admin.form.saveQuiz")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {popupMessage && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(10, 25, 47, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "1rem" }}>
          <div className="card-brutal animate-bounce-in" style={{ background: "var(--color-white)", width: "100%", maxWidth: "400px", padding: "2rem", textAlign: "center", border: "3px solid var(--color-navy)" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1rem", color: popupMessage.type === "error" ? "var(--color-danger, #e74c3c)" : "var(--color-navy)" }}>
              {popupMessage.title}
            </h2>
            <p style={{ fontSize: "1.1rem", color: "var(--color-text-muted)", fontWeight: 500, marginBottom: "1.5rem" }}>
              {popupMessage.message}
            </p>
            <button 
              onClick={() => setPopupMessage(null)}
              className="btn-brutal" 
              style={{ padding: "0.75rem 2rem", background: "var(--color-lime)", color: "var(--color-navy)", fontWeight: 800, fontSize: "1.1rem" }}
            >
              OK, Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(10, 25, 47, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "1rem" }}>
          <div className="card-brutal animate-bounce-in" style={{ background: "var(--color-white)", width: "100%", maxWidth: "400px", padding: "2rem", textAlign: "center", border: "3px solid var(--color-navy)" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1rem", color: "var(--color-danger, #e74c3c)" }}>
              {t("admin.form.delete")}?
            </h2>
            <p style={{ fontSize: "1.1rem", color: "var(--color-navy)", fontWeight: 600, marginBottom: "1.5rem" }}>
              {t("admin.form.confirmDelete")}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="btn-brutal" 
                style={{ padding: "0.75rem 1.5rem", background: "var(--color-white)", color: "var(--color-navy)", fontWeight: 700 }}
              >
                {t("admin.form.cancel")}
              </button>
              <button 
                onClick={confirmDelete}
                className="btn-brutal" 
                style={{ padding: "0.75rem 1.5rem", background: "var(--color-danger, #e74c3c)", color: "var(--color-white)", fontWeight: 800 }}
              >
                {t("admin.form.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
