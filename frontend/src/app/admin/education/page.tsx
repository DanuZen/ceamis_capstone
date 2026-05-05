"use client";

import { Plus, Edit, Trash2, Eye } from "lucide-react";

const MODULES = [
  { id: 1, title: "Cara Membuat Anggaran Bulanan", category: "Dasar", reads: 342, status: "published" },
  { id: 2, title: "Investasi Reksadana untuk Pemula", category: "Investasi", reads: 218, status: "published" },
  { id: 3, title: "Mengelola Utang dengan Cerdas", category: "Utang", reads: 156, status: "published" },
  { id: 4, title: "Cara Menabung ala Gen-Z", category: "Dasar", reads: 0, status: "draft" },
];

export default function AdminEducationPage() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--color-navy)", marginBottom: "0.5rem" }}>Modul Edukasi</h1>
          <p style={{ color: "var(--color-text-muted)", fontWeight: 500 }}>
            Tambah, edit, atau hapus modul edukasi finansial untuk pengguna.
          </p>
        </div>
        <button className="btn-brutal" style={{ background: "var(--color-lime)", padding: "0.75rem 1.5rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "3px 3px 0px var(--color-navy)" }}>
          <Plus size={18} /> Tambah Modul
        </button>
      </div>

      <div className="card-brutal" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--color-bg)", borderBottom: "3px solid var(--color-navy)" }}>
              <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Judul Modul</th>
              <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Kategori</th>
              <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Dibaca</th>
              <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Status</th>
              <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {MODULES.map((mod, i) => (
              <tr key={mod.id} style={{ borderBottom: i < MODULES.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none" }}>
                <td style={{ padding: "1rem", fontWeight: 700, color: "var(--color-navy)" }}>{mod.title}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.2rem 0.6rem", background: "var(--color-bg)", border: "2px solid var(--color-navy)", borderRadius: "100px", color: "var(--color-navy)" }}>{mod.category}</span>
                </td>
                <td style={{ padding: "1rem", fontWeight: 700, color: "var(--color-text-muted)" }}>{mod.reads}x</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{
                    padding: "0.25rem 0.75rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 800,
                    border: "2px solid var(--color-navy)",
                    background: mod.status === "published" ? "var(--color-lime)" : "var(--color-orange)",
                    color: "var(--color-navy)"
                  }}>
                    {mod.status === "published" ? "Published" : "Draft"}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="btn-brutal" title="Preview" style={{ padding: "0.4rem", background: "var(--color-bg)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", cursor: "pointer", boxShadow: "none" }}>
                      <Eye size={16} color="var(--color-navy)" />
                    </button>
                    <button className="btn-brutal" title="Edit" style={{ padding: "0.4rem", background: "var(--color-purple)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", cursor: "pointer", boxShadow: "none" }}>
                      <Edit size={16} color="var(--color-white)" />
                    </button>
                    <button className="btn-brutal" title="Hapus" style={{ padding: "0.4rem", background: "var(--color-danger, #e74c3c)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", cursor: "pointer", boxShadow: "none" }}>
                      <Trash2 size={16} color="var(--color-white)" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
