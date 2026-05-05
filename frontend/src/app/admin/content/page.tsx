"use client";

import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

const CONTENT_DATA = [
  { id: 1, title: "Tips: Mulai Catat Pengeluaran Harian!", type: "Tips Harian", placement: "Dashboard Banner", status: "published", date: "1 Mei 2026" },
  { id: 2, title: "Promo: Tantangan Hemat Mei 2026", type: "Banner Pengumuman", placement: "Dashboard Top", status: "published", date: "1 Mei 2026" },
  { id: 3, title: "Fun Fact: Rata-rata Gen-Z habiskan 35% untuk F&B", type: "Tips Harian", placement: "Dashboard Sidebar Widget", status: "draft", date: "3 Mei 2026" },
];

export default function AdminContentPage() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--color-navy)", marginBottom: "0.5rem" }}>Konten & Banner</h1>
          <p style={{ color: "var(--color-text-muted)", fontWeight: 500 }}>
            Kelola konten dinamis yang tampil di Dashboard User: banner, tips harian, dan pengumuman.
          </p>
        </div>
        <button className="btn-brutal" style={{ background: "var(--color-lime)", padding: "0.75rem 1.5rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "3px 3px 0px var(--color-navy)" }}>
          <Plus size={18} /> Tambah Konten
        </button>
      </div>

      {/* Content Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {CONTENT_DATA.map((item) => (
          <div key={item.id} className="card-brutal" style={{ padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--color-navy)", marginBottom: "0.35rem" }}>{item.title}</div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.6rem", background: "var(--color-bg)", border: "2px solid var(--color-navy)", borderRadius: "100px", color: "var(--color-navy)" }}>{item.type}</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)" }}>📍 {item.placement}</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)" }}>📅 {item.date}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{
                padding: "0.25rem 0.75rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 800,
                border: "2px solid var(--color-navy)",
                background: item.status === "published" ? "var(--color-lime)" : "var(--color-orange)",
                color: "var(--color-navy)"
              }}>
                {item.status === "published" ? "Published" : "Draft"}
              </span>
              <button className="btn-brutal" title={item.status === "published" ? "Unpublish" : "Publish"} style={{ padding: "0.4rem", background: "var(--color-bg)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", cursor: "pointer", boxShadow: "none" }}>
                {item.status === "published" ? <EyeOff size={16} color="var(--color-navy)" /> : <Eye size={16} color="var(--color-navy)" />}
              </button>
              <button className="btn-brutal" title="Edit" style={{ padding: "0.4rem", background: "var(--color-purple)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", cursor: "pointer", boxShadow: "none" }}>
                <Edit size={16} color="var(--color-white)" />
              </button>
              <button className="btn-brutal" title="Hapus" style={{ padding: "0.4rem", background: "var(--color-danger, #e74c3c)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", cursor: "pointer", boxShadow: "none" }}>
                <Trash2 size={16} color="var(--color-white)" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
