"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck, User, Zap, ArrowLeft, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError("Harap lengkapi semua data.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "user",
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push("/onboarding");
    }, 2000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        display: "flex",
      }}
    >
      {/* ── LEFT PANEL: CEAMIS Info (Hidden on Mobile) ── */}
      <div 
        className="hidden md:flex"
        style={{
          flex: 1,
          background: "var(--color-purple)",
          borderRight: "4px solid var(--color-navy)",
          padding: "5rem",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "var(--color-white)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "3rem" }}>
            <div style={{
              width: 52, height: 52, background: "var(--color-lime)",
              border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.75rem", fontFamily: "var(--font-heading)", fontWeight: 900, color: "var(--color-navy)",
              boxShadow: "4px 4px 0px var(--color-navy)"
            }}>
              C
            </div>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "2rem" }}>
              CEAMIS
            </span>
          </div>

          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "4rem", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.5rem", color: "var(--color-lime)", textShadow: "4px 4px 0px var(--color-navy)" }}>
            Control Every<br/>Money-Issue<br/>Simply.
          </h2>
          <p style={{ fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.6, maxWidth: "85%", marginBottom: "3rem", color: "var(--color-white)" }}>
            Platform manajemen keuangan brutalist Gen-Z yang dilengkapi AI cerdas untuk melacak, merencanakan, dan mengedukasi finansialmu secara real-time.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "90%" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", background: "var(--color-navy)", padding: "1.25rem 1.5rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", color: "var(--color-white)", fontWeight: 800, fontSize: "1.05rem", boxShadow: "4px 4px 0px rgba(0,0,0,0.3)" }}>
                <div style={{ background: "var(--color-lime)", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-navy)", border: "2px solid var(--color-navy)" }}><Zap size={20} /></div>
                AI Spending Pattern & Risk Profile
             </div>
             <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", background: "var(--color-navy)", padding: "1.25rem 1.5rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", color: "var(--color-white)", fontWeight: 800, fontSize: "1.05rem", boxShadow: "4px 4px 0px rgba(0,0,0,0.3)" }}>
                <div style={{ background: "var(--color-orange)", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-navy)", border: "2px solid var(--color-navy)" }}><ShieldCheck size={20} /></div>
                Sistem Peringatan Dini (Warning Gate)
             </div>
             <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", background: "var(--color-navy)", padding: "1.25rem 1.5rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", color: "var(--color-white)", fontWeight: 800, fontSize: "1.05rem", boxShadow: "4px 4px 0px rgba(0,0,0,0.3)" }}>
                <div style={{ background: "var(--color-white)", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-navy)", border: "2px solid var(--color-navy)" }}><User size={20} /></div>
                Chatbot CAMI & Edukasi Finansial
             </div>
          </div>
        </div>
        
        <div style={{ position: "relative", zIndex: 10, fontSize: "0.85rem", fontWeight: 700, opacity: 0.7, marginTop: "3rem", color: "var(--color-text-light)" }}>
          &copy; 2026 CEAMIS Capstone Project
        </div>
      </div>

      {/* ── RIGHT PANEL: Register Form ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          position: "relative",
          background: "var(--color-bg)",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Tombol Kembali (Berada di atas Auth Card, sejajar kiri) */}
          <button
            onClick={() => router.push("/")}
            className="btn-brutal"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              marginBottom: "1.5rem",
              background: "var(--color-white)",
              color: "var(--color-navy)",
              border: "2px solid var(--color-navy)",
              boxShadow: "3px 3px 0px var(--color-navy)",
              fontWeight: 800,
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={16} strokeWidth={2.5} /> Beranda
          </button>

          {/* Logo (Hanya tampil di Mobile karena Desktop sudah ada di kiri) */}
          <div className="hide-on-desktop" style={{ marginBottom: "1.5rem" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                textDecoration: "none",
              }}
            >
            <div
              style={{
                width: 52, height: 52,
                background: "var(--color-primary)",
                border: "var(--border-width) solid var(--color-border)",
                borderRadius: "var(--radius-brutal-sm)",
                boxShadow: "var(--shadow-brutal-sm)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem", fontFamily: "var(--font-heading)", fontWeight: 700,
              }}
            >
              C
            </div>
            <span
              style={{
                fontFamily: "var(--font-heading)", fontWeight: 700,
                fontSize: "2rem", color: "var(--color-text)",
              }}
            >
              CEAMIS
            </span>
          </Link>
          </div>

          {/* Register Card */}
          <div
            className="animate-bounce-in"
            style={{
              width: "100%", padding: "2.5rem 2.25rem",
              background: "var(--color-white)",
              border: "3px solid var(--color-navy)",
              borderTop: "8px solid var(--color-lime)",
              borderRadius: "var(--radius-brutal-lg)",
              boxShadow: "8px 8px 0px rgba(10, 25, 47, 0.15)", // shadow yang lebih soft
              position: "relative",
            }}
          >
            <h1
              style={{
                fontFamily: "var(--font-heading)", fontSize: "2rem",
                marginBottom: "0.5rem", textAlign: "center", color: "var(--color-navy)",
                fontWeight: 900
              }}
            >
              Daftar CEAMIS
            </h1>
            <p
              style={{
                textAlign: "center", color: "var(--color-text-muted)",
                marginBottom: "2rem", fontSize: "0.95rem", fontWeight: 500
              }}
            >
              Mulai perjalanan finansial brutalist-mu hari ini.
            </p>

            {/* Success Message */}
            {success && (
              <div style={{
                padding: "1rem", marginBottom: "1.5rem",
                background: "rgba(184, 255, 0, 0.15)", border: "2px solid var(--color-lime)",
                borderRadius: "var(--radius-brutal-sm)", color: "var(--color-navy)",
                fontSize: "0.9rem", fontWeight: 800, textAlign: "center"
              }}>
                🎉 Pendaftaran berhasil! Mengarahkan ke tahap setup profil...
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div style={{
                padding: "1rem", marginBottom: "1.5rem",
                background: "rgba(231, 76, 60, 0.1)", border: "2px solid var(--color-danger, #e74c3c)",
                borderRadius: "var(--radius-brutal-sm)", color: "var(--color-danger, #e74c3c)",
                fontSize: "0.9rem", fontWeight: 800, textAlign: "center"
              }}>
                {error}
              </div>
            )}

            {/* Register Form */}
            <form
              onSubmit={handleRegister}
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
            >
              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.5rem", display: "block", color: "var(--color-navy)" }}>
                  Nama Lengkap
                </label>
                <input
                  type="text" className="input-brutal"
                  placeholder="Misal: Budi Santoso"
                  value={fullName} onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading || success}
                  style={{ width: "100%", padding: "0.85rem 1rem", fontSize: "0.95rem", background: "#F8FAFC" }}
                />
              </div>

              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.5rem", display: "block", color: "var(--color-navy)" }}>
                  Email
                </label>
                <input
                  type="email" className="input-brutal"
                  placeholder="nama@email.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || success}
                  style={{ width: "100%", padding: "0.85rem 1rem", fontSize: "0.95rem", background: "#F8FAFC" }}
                />
              </div>

              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.5rem", display: "block", color: "var(--color-navy)" }}>
                  Password
                </label>
                <input
                  type="password" className="input-brutal"
                  placeholder="Minimal 6 karakter"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || success}
                  style={{ width: "100%", padding: "0.85rem 1rem", fontSize: "0.95rem", background: "#F8FAFC" }}
                />
              </div>

              <button
                type="submit" disabled={isLoading || success}
                className="btn-brutal"
                style={{
                  width: "100%", marginTop: "1rem", padding: "1rem",
                  fontWeight: 800, fontSize: "1.05rem", cursor: (isLoading || success) ? "wait" : "pointer",
                  background: "var(--color-lime)",
                  color: "var(--color-navy)", border: "3px solid var(--color-navy)",
                  boxShadow: (isLoading || success) ? "none" : "4px 4px 0px var(--color-navy)",
                  transform: (isLoading || success) ? "translate(4px, 4px)" : "none",
                  transition: "all 0.15s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                }}
              >
                <UserPlus size={20} strokeWidth={2.5} />
                {isLoading ? "Memproses..." : "Buat Akun Sekarang"}
              </button>
            </form>

            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", fontWeight: 600 }}>
                Sudah punya akun?{" "}
              </span>
              <Link 
                href="/auth"
                style={{ 
                  fontSize: "0.875rem", fontWeight: 800, color: "var(--color-purple)",
                  textDecoration: "underline" 
                }}
              >
                Masuk di sini
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
