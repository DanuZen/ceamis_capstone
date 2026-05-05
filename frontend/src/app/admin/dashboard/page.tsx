"use client";

import { Users, Server, BookOpen, AlertTriangle } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--color-navy)", marginBottom: "0.5rem" }}>Statistik Sistem Global</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem", fontWeight: 500 }}>
        Pantau kesehatan sistem, metrik pengguna, dan performa AI secara langsung.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        {[
          { label: "Total User Aktif", value: "1,248", icon: Users, color: "lime" },
          { label: "API Calls AI (Hari Ini)", value: "8,402", icon: Server, color: "purple" },
          { label: "Modul Edukasi Aktif", value: "24", icon: BookOpen, color: "orange" },
          { label: "Log Peringatan", value: "12", icon: AlertTriangle, color: "danger, #e74c3c" },
        ].map((stat, i) => (
          <div key={i} className="card-brutal animate-slide-up" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", animationDelay: `${i * 0.1}s` }}>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>{stat.label}</div>
              <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--color-navy)" }}>{stat.value}</div>
            </div>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: `var(--color-${stat.color})`, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--color-navy)" }}>
              <stat.icon size={24} color={stat.color === "purple" || stat.color === "danger, #e74c3c" ? "var(--color-white)" : "var(--color-navy)"} />
            </div>
          </div>
        ))}
      </div>

      {/* Mockup Log Table */}
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "var(--color-navy)", marginBottom: "1rem" }}>Aktivitas Sistem Terbaru</h2>
      <div className="card-brutal" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--color-bg)", borderBottom: "2px solid var(--color-navy)" }}>
              <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Waktu</th>
              <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Aktivitas</th>
              <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Aktor</th>
              <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { time: "10:45 AM", activity: "Pendaftaran Pengguna Baru", actor: "System", status: "Success", color: "lime" },
              { time: "10:30 AM", activity: "API Timeout: Chatbot Gen-Z", actor: "OpenAI Service", status: "Warning", color: "orange" },
              { time: "09:15 AM", activity: "Update Modul 'Cara Investasi Reksadana'", actor: "Admin 1", status: "Success", color: "lime" },
              { time: "08:50 AM", activity: "Reset Password Gagal (Brute Force?)", actor: "Unknown IP", status: "Danger", color: "danger, #e74c3c" },
            ].map((log, i) => (
              <tr key={i} style={{ borderBottom: i < 3 ? "1px solid rgba(0,0,0,0.1)" : "none" }}>
                <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-muted)" }}>{log.time}</td>
                <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-navy)" }}>{log.activity}</td>
                <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text-muted)" }}>{log.actor}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ 
                    padding: "0.25rem 0.75rem", background: `var(--color-${log.color})`, 
                    color: log.color === "lime" || log.color === "orange" ? "var(--color-navy)" : "var(--color-white)",
                    borderRadius: "100px", fontSize: "0.75rem", fontWeight: 800, border: "2px solid var(--color-navy)"
                  }}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
