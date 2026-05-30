"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Eye, X, FileQuestion } from "lucide-react";

const INITIAL_QUIZZES = [
  { id: 1, moduleId: 1, question: "Apa tujuan utama dari pencatatan keuangan pribadi?", points: 150, status: "active" },
  { id: 2, moduleId: 2, question: "Apa fungsi utama dari Dana Darurat?", points: 150, status: "active" },
  { id: 3, moduleId: 3, question: "Manakah contoh dari 'Wants' (Keinginan) dalam budgeting?", points: 150, status: "active" },
  { id: 4, moduleId: 4, question: "Instrumen investasi apa yang umumnya memiliki risiko paling rendah?", points: 150, status: "draft" },
];

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState(INITIAL_QUIZZES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus kuis ini?")) {
      setQuizzes(quizzes.filter(q => q.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newItem = {
      id: editingItem ? editingItem.id : Date.now(),
      moduleId: Number(formData.get("moduleId")),
      question: formData.get("question") as string,
      points: Number(formData.get("points")),
      status: formData.get("status") as string || "active",
    };
    
    if (editingItem) {
      setQuizzes(quizzes.map(q => q.id === editingItem.id ? newItem : q));
    } else {
      setQuizzes([...quizzes, newItem]);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--color-navy)", marginBottom: "0.5rem" }}>Manajemen Kuis Edukasi</h1>
          <p style={{ color: "var(--color-text-muted)", fontWeight: 500 }}>
            Kelola daftar pertanyaan kuis, XP yang didapat, dan tautan ke modul materi.
          </p>
        </div>
        <button onClick={openAddModal} className="btn-brutal" style={{ background: "var(--color-purple)", color: "var(--color-white)", padding: "0.75rem 1.5rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "3px 3px 0px var(--color-navy)" }}>
          <Plus size={18} /> Tambah Kuis
        </button>
      </div>

      <div className="card-brutal animate-fade-in" style={{ padding: 0, overflow: "hidden", background: "var(--color-white)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "600px" }}>
            <thead>
              <tr style={{ background: "var(--color-bg)", borderBottom: "3px solid var(--color-navy)" }}>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)" }}>Pertanyaan Kuis</th>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)" }}>ID Modul</th>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)" }}>XP Points</th>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)" }}>Status</th>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)", width: "120px", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, i) => (
                <tr key={quiz.id} style={{ borderBottom: i < quizzes.length - 1 ? "2px solid rgba(10, 25, 47, 0.05)" : "none" }}>
                  <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "var(--color-navy)" }}>{quiz.question}</td>
                  <td style={{ padding: "1rem 1.25rem", fontWeight: 800, color: "var(--color-purple)" }}>Modul #{quiz.moduleId}</td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span className="badge-brutal" style={{ background: "var(--color-pink)", fontSize: "0.75rem", boxShadow: "none" }}>+{quiz.points} XP</span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span className="badge-brutal" style={{
                      padding: "0.25rem 0.75rem", fontSize: "0.75rem", boxShadow: "none",
                      background: quiz.status === "active" ? "var(--color-lime)" : "var(--color-orange)",
                    }}>
                      {quiz.status === "active" ? "Aktif" : "Draft"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                      <button onClick={() => openEditModal(quiz)} className="btn-brutal" title="Edit" style={{ padding: "0.4rem", background: "var(--color-purple)", cursor: "pointer", boxShadow: "none" }}>
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
                    Belum ada data kuis edukasi.
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
              {editingItem ? "Edit Kuis" : "Tambah Kuis"}
            </h2>
            
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className="input-group-brutal">
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>Pertanyaan</label>
                <textarea name="question" defaultValue={editingItem?.question} required className="input-brutal" style={{ width: "100%", minHeight: "80px", resize: "vertical" }} placeholder="Tuliskan pertanyaan kuis..." />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="input-group-brutal">
                  <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>ID Modul (Terkait)</label>
                  <input name="moduleId" type="number" defaultValue={editingItem?.moduleId} required className="input-brutal" style={{ width: "100%" }} placeholder="Contoh: 1" />
                </div>
                <div className="input-group-brutal">
                  <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>XP Points</label>
                  <input name="points" type="number" defaultValue={editingItem?.points || 150} required className="input-brutal" style={{ width: "100%" }} />
                </div>
              </div>
              <div className="input-group-brutal">
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>Status</label>
                <select name="status" defaultValue={editingItem?.status || "active"} className="input-brutal" style={{ width: "100%" }}>
                  <option value="active">Aktif</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-brutal" style={{ background: "var(--color-bg)", fontWeight: 700 }}>
                  Batal
                </button>
                <button type="submit" className="btn-brutal btn-brutal--primary" style={{ fontWeight: 800, background: "var(--color-purple)", color: "var(--color-white)" }}>
                  Simpan Kuis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
