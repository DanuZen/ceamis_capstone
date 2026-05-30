"use client";

import { Users, BookOpen, FileQuestion, Trophy, CheckCircle, Clock } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--color-navy)", marginBottom: "0.5rem" }}>Ikhtisar Sistem CEAMIS</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem", fontWeight: 500 }}>
        Pantau performa modul edukasi, kuis, dan tingkat partisipasi pengguna (Gamifikasi).
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        {[
          { label: "Total Modul Edukasi", value: "24", icon: BookOpen, color: "lime" },
          { label: "Total Kuis Tersedia", value: "150", icon: FileQuestion, color: "purple" },
          { label: "Total Badge Gamifikasi", value: "12", icon: Trophy, color: "orange" },
          { label: "Total Pengguna Aktif", value: "1,248", icon: Users, color: "white" },
        ].map((stat, i) => (
          <div key={i} className="card-brutal animate-slide-up" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", animationDelay: `${i * 0.1}s`, background: stat.color === "white" ? "var(--color-navy)" : "var(--color-white)" }}>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 800, color: stat.color === "white" ? "rgba(255,255,255,0.7)" : "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>{stat.label}</div>
              <div style={{ fontSize: "2.5rem", fontWeight: 900, color: stat.color === "white" ? "var(--color-white)" : "var(--color-navy)" }}>{stat.value}</div>
            </div>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: stat.color === "white" ? "var(--color-purple)" : `var(--color-${stat.color})`, display: "flex", alignItems: "center", justifyContent: "center", border: stat.color === "white" ? "2px solid var(--color-white)" : "2px solid var(--color-navy)" }}>
              <stat.icon size={24} color={stat.color === "purple" ? "var(--color-white)" : "var(--color-navy)"} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
        {/* Modul Terbaru */}
        <div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "var(--color-navy)", marginBottom: "1rem" }}>Modul Edukasi Terbaru</h2>
          <div className="card-brutal" style={{ padding: 0, overflow: "hidden", background: "var(--color-white)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--color-bg)", borderBottom: "2px solid var(--color-navy)" }}>
                  <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Judul Modul</th>
                  <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Kategori</th>
                  <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { title: "Cara Membuat Anggaran Bulanan", category: "Dasar", status: "Published", color: "lime" },
                  { title: "Investasi Reksadana untuk Pemula", category: "Investasi", status: "Published", color: "lime" },
                  { title: "Mengelola Utang dengan Cerdas", category: "Utang", status: "Published", color: "lime" },
                  { title: "Cara Menabung ala Gen-Z", category: "Dasar", status: "Draft", color: "orange" },
                ].map((mod, i) => (
                  <tr key={i} style={{ borderBottom: i < 3 ? "1px solid rgba(0,0,0,0.1)" : "none" }}>
                    <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-navy)" }}>{mod.title}</td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-muted)" }}>{mod.category}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ 
                        padding: "0.25rem 0.5rem", background: `var(--color-${mod.color})`, 
                        color: "var(--color-navy)", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 800, border: "1px solid var(--color-navy)", display: "flex", alignItems: "center", gap: "0.25rem", width: "fit-content"
                      }}>
                        {mod.status === "Published" ? <CheckCircle size={12} /> : <Clock size={12} />} {mod.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kuis Terbaru */}
        <div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "var(--color-navy)", marginBottom: "1rem" }}>Kuis Terbaru</h2>
          <div className="card-brutal" style={{ padding: 0, overflow: "hidden", background: "var(--color-white)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--color-bg)", borderBottom: "2px solid var(--color-navy)" }}>
                  <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Pertanyaan</th>
                  <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>ID Modul</th>
                  <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>XP</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { q: "Apa tujuan utama dari pencatatan keuangan pribadi?", modId: 1, xp: 150 },
                  { q: "Apa fungsi utama dari Dana Darurat?", modId: 2, xp: 150 },
                  { q: "Manakah contoh dari 'Wants' (Keinginan)?", modId: 3, xp: 150 },
                  { q: "Instrumen investasi apa yang rendah risiko?", modId: 4, xp: 150 },
                ].map((quiz, i) => (
                  <tr key={i} style={{ borderBottom: i < 3 ? "1px solid rgba(0,0,0,0.1)" : "none" }}>
                    <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-navy)", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{quiz.q}</td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: 800, color: "var(--color-purple)" }}>#{quiz.modId}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ 
                        padding: "0.25rem 0.5rem", background: "var(--color-pink)", 
                        color: "var(--color-navy)", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 800, border: "1px solid var(--color-navy)", display: "flex", alignItems: "center", gap: "0.25rem", width: "fit-content"
                      }}>
                        <Trophy size={12} /> +{quiz.xp}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
