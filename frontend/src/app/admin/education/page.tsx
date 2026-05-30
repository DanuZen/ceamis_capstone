"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, X, BookOpen, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

const INITIAL_MODULES = [
  { id: 1, title: "Cara Membuat Anggaran Bulanan", category: "Dasar", reads: 342, status: "published", points: 200 },
  { id: 2, title: "Investasi Reksadana untuk Pemula", category: "Investasi", reads: 218, status: "published", points: 200 },
  { id: 3, title: "Mengelola Utang dengan Cerdas", category: "Utang", reads: 156, status: "published", points: 200 },
  { id: 4, title: "Cara Menabung ala Gen-Z", category: "Dasar", reads: 0, status: "draft", points: 200 },
];

export default function AdminEducationPage() {
  const router = useRouter();
  const [modules, setModulesState] = useState(INITIAL_MODULES);
  
  useEffect(() => {
    const saved = localStorage.getItem("ceamis_modules");
    if (saved) {
      setModulesState(JSON.parse(saved));
    } else {
      localStorage.setItem("ceamis_modules", JSON.stringify(INITIAL_MODULES));
    }
  }, []);

  const setModules = (newModules: any[]) => {
    setModulesState(newModules);
    localStorage.setItem("ceamis_modules", JSON.stringify(newModules));
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
  
  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      setModules(modules.filter(m => m.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (editingItem) {
      const updatedItem = {
        id: editingItem.id,
        title: formData.get("title") as string,
        category: formData.get("category") as string,
        reads: editingItem.reads,
        status: "published", // Default hardcoded for now since field is removed
        points: Number(formData.get("points")) || 200,
        desc: formData.get("desc") as string,
        duration: formData.get("duration") as string,
      };
      setModules(modules.map(m => m.id === editingItem.id ? updatedItem : m));
      setIsModalOpen(false);
    } else {
      const newModule = {
        id: Date.now(),
        title: formData.get("title") as string,
        category: formData.get("category") as string,
        reads: 0,
        status: "published", // Default hardcoded
        points: Number(formData.get("points")) || 200,
        desc: formData.get("desc") as string,
        duration: formData.get("duration") as string,
      };
      setModules([...modules, newModule]);
      setIsModalOpen(false);
      
      // Auto redirect to content editor
      router.push(`/admin/education/edit-module/${newModule.id}`);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--color-navy)", marginBottom: "0.5rem" }}>Manajemen Modul Edukasi</h1>
          <p style={{ color: "var(--color-text-muted)", fontWeight: 500 }}>
            Kelola modul materi pembelajaran untuk pengguna (CRUD).
          </p>
        </div>
        <button onClick={openAddModal} className="btn-brutal" style={{ background: "var(--color-lime)", padding: "0.75rem 1.5rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "3px 3px 0px var(--color-navy)" }}>
          <Plus size={18} /> Tambah Modul
        </button>
      </div>

      <div className="card-brutal animate-fade-in" style={{ padding: 0, overflow: "hidden", background: "var(--color-white)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "600px" }}>
            <thead>
              <tr style={{ background: "var(--color-bg)", borderBottom: "3px solid var(--color-navy)" }}>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)" }}>Judul Modul</th>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)" }}>Kategori</th>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)" }}>XP Points</th>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)", width: "160px", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((mod, i) => (
                <tr key={mod.id} style={{ borderBottom: i < modules.length - 1 ? "2px solid rgba(10, 25, 47, 0.05)" : "none" }}>
                  <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "var(--color-navy)" }}>{mod.title}</td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span className="badge-brutal" style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", background: "var(--color-bg)", boxShadow: "none" }}>{mod.category}</span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span className="badge-brutal" style={{ background: "var(--color-lime)", fontSize: "0.75rem", padding: "0.2rem 0.6rem", boxShadow: "none" }}>+{mod.points || 200} XP</span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                      <button onClick={() => router.push(`/admin/education/edit-module/${mod.id}`)} className="btn-brutal" title="Edit Konten" style={{ padding: "0.4rem", background: "var(--color-lime)", cursor: "pointer", boxShadow: "none" }}>
                        <FileText size={16} color="var(--color-navy)" />
                      </button>
                      <button onClick={() => openEditModal(mod)} className="btn-brutal" title="Edit Metadata" style={{ padding: "0.4rem", background: "var(--color-purple)", cursor: "pointer", boxShadow: "none" }}>
                        <Edit size={16} color="var(--color-white)" />
                      </button>
                      <button onClick={() => handleDelete(mod.id)} className="btn-brutal" title="Hapus" style={{ padding: "0.4rem", background: "var(--color-danger, #e74c3c)", cursor: "pointer", boxShadow: "none" }}>
                        <Trash2 size={16} color="var(--color-white)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {modules.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)", fontWeight: 600 }}>
                    Belum ada data modul.
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
              <BookOpen size={24} color="var(--color-lime)" />
              {editingItem ? "Edit" : "Tambah"} Modul
            </h2>
            
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className="input-group-brutal">
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>Judul Modul</label>
                <input name="title" defaultValue={editingItem?.title} required className="input-brutal" style={{ width: "100%" }} placeholder="Masukkan judul modul..." />
              </div>
              <div className="input-group-brutal">
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>Kategori</label>
                <select name="category" defaultValue={editingItem?.category || "Dasar"} className="input-brutal" style={{ width: "100%" }}>
                  <option value="Dasar">Dasar</option>
                  <option value="Investasi">Investasi</option>
                  <option value="Utang">Utang</option>
                </select>
              </div>
              <div className="input-group-brutal">
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>Deskripsi Singkat</label>
                <input name="desc" defaultValue={editingItem?.desc || ""} required className="input-brutal" style={{ width: "100%" }} placeholder="Contoh: Belajar cara mengelola uang..." />
              </div>
              <div className="input-group-brutal">
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>Estimasi Waktu</label>
                <input name="duration" defaultValue={editingItem?.duration || "5 menit"} required className="input-brutal" style={{ width: "100%" }} placeholder="Contoh: 5 menit" />
              </div>
              <div className="input-group-brutal">
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>XP Points</label>
                <input name="points" type="number" defaultValue={editingItem?.points || 200} required className="input-brutal" style={{ width: "100%" }} />
              </div>
              
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-brutal" style={{ background: "var(--color-white)", fontWeight: 700 }}>
                  Batal
                </button>
                <button type="submit" className="btn-brutal btn-brutal--primary" style={{ fontWeight: 800, color: "var(--color-white)" }}>
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(10, 25, 47, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "1rem" }}>
          <div className="card-brutal animate-bounce-in" style={{ background: "var(--color-white)", width: "100%", maxWidth: "400px", padding: "2rem", textAlign: "center", border: "3px solid var(--color-navy)" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1rem", color: "var(--color-danger, #e74c3c)" }}>
              Hapus Modul?
            </h2>
            <p style={{ fontSize: "1.1rem", color: "var(--color-navy)", fontWeight: 600, marginBottom: "1.5rem" }}>
              Yakin ingin menghapus modul ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="btn-brutal" 
                style={{ padding: "0.75rem 1.5rem", background: "var(--color-white)", color: "var(--color-navy)", fontWeight: 700 }}
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                className="btn-brutal" 
                style={{ padding: "0.75rem 1.5rem", background: "var(--color-danger, #e74c3c)", color: "var(--color-white)", fontWeight: 800 }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
