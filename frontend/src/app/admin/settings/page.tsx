"use client";

import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--color-navy)", marginBottom: "0.5rem" }}>Pengaturan Sistem</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem", fontWeight: 500 }}>
        Konfigurasi global untuk platform CEAMIS.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
        {/* General Settings */}
        <div className="card-brutal" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--color-navy)", marginBottom: "1.25rem", borderBottom: "2px solid var(--color-navy)", paddingBottom: "0.75rem" }}>Umum</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "0.35rem", color: "var(--color-navy)" }}>Nama Aplikasi</label>
              <input className="input-brutal" defaultValue="CEAMIS" style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "0.35rem", color: "var(--color-navy)" }}>Tagline</label>
              <input className="input-brutal" defaultValue="Finance Engine untuk Gen-Z" style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "0.35rem", color: "var(--color-navy)" }}>Mode Pendaftaran</label>
              <select className="input-brutal" defaultValue="open" style={{ width: "100%" }}>
                <option value="open">Terbuka (Semua bisa daftar)</option>
                <option value="invite">Khusus Undangan</option>
                <option value="closed">Ditutup</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Settings */}
        <div className="card-brutal" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--color-navy)", marginBottom: "1.25rem", borderBottom: "2px solid var(--color-navy)", paddingBottom: "0.75rem" }}>Konfigurasi AI</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "0.35rem", color: "var(--color-navy)" }}>Model AI</label>
              <select className="input-brutal" defaultValue="gpt-4o-mini" style={{ width: "100%" }}>
                <option value="gpt-4o-mini">GPT-4o Mini (Hemat)</option>
                <option value="gpt-4o">GPT-4o (Standar)</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "0.35rem", color: "var(--color-navy)" }}>Maks Token per Request</label>
              <input className="input-brutal" type="number" defaultValue="1024" style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "0.35rem", color: "var(--color-navy)" }}>System Prompt Chatbot</label>
              <textarea className="input-brutal" rows={3} defaultValue="Kamu adalah CEAMIS AI, asisten keuangan pintar untuk Gen-Z Indonesia..." style={{ width: "100%", resize: "vertical" }} />
            </div>
          </div>
        </div>

        {/* Warning System */}
        <div className="card-brutal" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--color-navy)", marginBottom: "1.25rem", borderBottom: "2px solid var(--color-navy)", paddingBottom: "0.75rem" }}>Batas Peringatan (Warning System)</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "0.35rem", color: "var(--color-navy)" }}>Batas Pengeluaran Mingguan (%)</label>
              <input className="input-brutal" type="number" defaultValue="80" style={{ width: "100%" }} />
              <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>Jika pengeluaran user melebihi X% dari pemasukan mingguan, sistem akan kirim warning.</p>
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "0.35rem", color: "var(--color-navy)" }}>Batas Kategori F&B (%)</label>
              <input className="input-brutal" type="number" defaultValue="35" style={{ width: "100%" }} />
            </div>
          </div>
        </div>

        {/* Gamification Config */}
        <div className="card-brutal" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--color-navy)", marginBottom: "1.25rem", borderBottom: "2px solid var(--color-navy)", paddingBottom: "0.75rem" }}>Parameter Gamifikasi</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "0.35rem", color: "var(--color-navy)" }}>XP per Transaksi Dicatat</label>
              <input className="input-brutal" type="number" defaultValue="10" style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "0.35rem", color: "var(--color-navy)" }}>XP per Modul Edukasi Selesai</label>
              <input className="input-brutal" type="number" defaultValue="50" style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ display: "block", fontWeight: 800, fontSize: "0.85rem", marginBottom: "0.35rem", color: "var(--color-navy)" }}>Bonus Streak Harian (XP)</label>
              <input className="input-brutal" type="number" defaultValue="15" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
        <button className="btn-brutal" style={{ background: "var(--color-lime)", padding: "0.85rem 2rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "4px 4px 0px var(--color-navy)", fontSize: "1rem" }}>
          <Save size={20} /> Simpan Semua Perubahan
        </button>
      </div>
    </div>
  );
}
