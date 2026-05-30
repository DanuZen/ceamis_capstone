"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Eye, X, BookOpen } from "lucide-react";

const INITIAL_MODULES = [
  { id: 1, title: "Cara Membuat Anggaran Bulanan", category: "Dasar", reads: 342, status: "published" },
  { id: 2, title: "Investasi Reksadana untuk Pemula", category: "Investasi", reads: 218, status: "published" },
  { id: 3, title: "Mengelola Utang dengan Cerdas", category: "Utang", reads: 156, status: "published" },
  { id: 4, title: "Cara Menabung ala Gen-Z", category: "Dasar", reads: 0, status: "draft" },
];

export default function AdminEducationPage() {
  const [modules, setModules] = useState(INITIAL_MODULES);
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
    if (confirm("Yakin ingin menghapus modul ini?")) {
      setModules(modules.filter(m => m.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newItem = {
      id: editingItem ? editingItem.id : Date.now(),
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      reads: editingItem ? editingItem.reads : 0,
      status: formData.get("status") as string,
    };
    
    if (editingItem) {
      setModules(modules.map(m => m.id === editingItem.id ? newItem : m));
    } else {
      setModules([...modules, newItem]);
    }
    
    setIsModalOpen(false);
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
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)" }}>Dibaca</th>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)" }}>Status</th>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)", width: "120px", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((mod, i) => (
                <tr key={mod.id} style={{ borderBottom: i < modules.length - 1 ? "2px solid rgba(10, 25, 47, 0.05)" : "none" }}>
                  <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "var(--color-navy)" }}>{mod.title}</td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span className="badge-brutal" style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", background: "var(--color-bg)", boxShadow: "none" }}>{mod.category}</span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "var(--color-text-muted)" }}>{mod.reads}x</td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span className="badge-brutal" style={{
                      padding: "0.25rem 0.75rem", fontSize: "0.75rem", boxShadow: "none",
                      background: mod.status === "published" ? "var(--color-lime)" : "var(--color-orange)",
                    }}>
                      {mod.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                      <button onClick={() => openEditModal(mod)} className="btn-brutal" title="Edit" style={{ padding: "0.4rem", background: "var(--color-purple)", cursor: "pointer", boxShadow: "none" }}>
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
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>Status</label>
                <select name="status" defaultValue={editingItem?.status || "draft"} className="input-brutal" style={{ width: "100%" }}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-brutal" style={{ background: "var(--color-bg)", fontWeight: 700 }}>
                  Batal
                </button>
                <button type="submit" className="btn-brutal btn-brutal--primary" style={{ fontWeight: 800, background: "var(--color-lime)" }}>
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
