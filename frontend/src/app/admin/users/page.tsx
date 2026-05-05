"use client";

import { Search, MoreHorizontal, ShieldCheck, ShieldOff } from "lucide-react";
import { useState } from "react";

const USERS_DATA = [
  { id: 1, name: "Danu Zen", email: "danu.zen@example.com", level: 7, status: "active", joined: "12 Jan 2026" },
  { id: 2, name: "Siti Rahma", email: "siti.rahma@mail.com", level: 12, status: "active", joined: "5 Feb 2026" },
  { id: 3, name: "Budi Santoso", email: "budi.s@email.id", level: 3, status: "suspended", joined: "20 Mar 2026" },
  { id: 4, name: "Anisa Putri", email: "anisa.p@gmail.com", level: 9, status: "active", joined: "1 Apr 2026" },
  { id: 5, name: "Rizky Aditya", email: "rizky.a@outlook.com", level: 1, status: "active", joined: "28 Apr 2026" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const filtered = USERS_DATA.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--color-navy)", marginBottom: "0.5rem" }}>Manajemen Pengguna</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem", fontWeight: 500 }}>
        Kelola akun pengguna terdaftar. Lihat detail, reset password, atau suspend akun.
      </p>

      {/* Search Bar */}
      <div style={{ position: "relative", maxWidth: "400px", marginBottom: "1.5rem" }}>
        <Search size={18} color="var(--color-text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
        <input
          type="text" placeholder="Cari nama atau email..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="input-brutal"
          style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem" }}
        />
      </div>

      {/* Users Table */}
      <div className="card-brutal" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--color-bg)", borderBottom: "3px solid var(--color-navy)" }}>
              <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Nama</th>
              <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Email</th>
              <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Level</th>
              <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Status</th>
              <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Bergabung</th>
              <th style={{ padding: "1rem", fontWeight: 800, color: "var(--color-navy)" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => (
              <tr key={user.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none" }}>
                <td style={{ padding: "1rem", fontWeight: 700, color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--color-purple)", color: "var(--color-white)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.8rem", border: "2px solid var(--color-navy)", flexShrink: 0 }}>
                    {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  {user.name}
                </td>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>{user.email}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ fontWeight: 800, fontSize: "0.8rem", color: "var(--color-navy)", background: "var(--color-bg)", padding: "0.25rem 0.6rem", borderRadius: "100px", border: "2px solid var(--color-navy)" }}>LVL {user.level}</span>
                </td>
                <td style={{ padding: "1rem" }}>
                  <span style={{
                    padding: "0.25rem 0.75rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 800,
                    border: "2px solid var(--color-navy)",
                    background: user.status === "active" ? "var(--color-lime)" : "var(--color-orange)",
                    color: "var(--color-navy)"
                  }}>
                    {user.status === "active" ? "Aktif" : "Suspended"}
                  </span>
                </td>
                <td style={{ padding: "1rem", fontSize: "0.875rem", color: "var(--color-text-muted)", fontWeight: 600 }}>{user.joined}</td>
                <td style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="btn-brutal" title={user.status === "active" ? "Suspend" : "Aktifkan"} style={{ padding: "0.4rem", background: user.status === "active" ? "var(--color-orange)" : "var(--color-lime)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", cursor: "pointer", boxShadow: "none" }}>
                      {user.status === "active" ? <ShieldOff size={16} color="var(--color-navy)" /> : <ShieldCheck size={16} color="var(--color-navy)" />}
                    </button>
                    <button className="btn-brutal" title="Opsi Lain" style={{ padding: "0.4rem", background: "var(--color-bg)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", cursor: "pointer", boxShadow: "none" }}>
                      <MoreHorizontal size={16} color="var(--color-navy)" />
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
