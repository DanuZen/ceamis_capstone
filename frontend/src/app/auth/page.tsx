"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck, User, Eye, Zap, LogIn, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ── Quick Login Accounts ──────────────────────
const QUICK_LOGINS = [
  { label: "User Demo", email: "user@ceamis.com", password: "user123456", role: "user" as const, color: "purple", icon: User },
  { label: "Admin Demo", email: "admin@ceamis.com", password: "admin123456", role: "admin" as const, color: "danger, #e74c3c", icon: ShieldCheck },
];

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();
  const [roleTab, setRoleTab] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    localStorage.setItem("ceamis_role", "user");
    if (roleTab === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const handleQuickLogin = async (account: typeof QUICK_LOGINS[number]) => {
    setIsLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: account.email,
      password: account.password,
    });

    if (signInError) {
      setError(`Quick login gagal: ${signInError.message}`);
      setIsLoading(false);
      return;
    }

    localStorage.setItem("ceamis_role", "user");
    if (account.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      setError("Isi email dan password terlebih dahulu.");
      return;
    }
    setIsLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: "user" },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    setError(null);
    alert("Registrasi berhasil! Cek email untuk konfirmasi, lalu login.");
    setIsLoading(false);
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

          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "4rem", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.5rem", color: "var(--color-white)" }}>
            Control Every<br/>Money-Issue<br/>Simply.
          </h2>
          <p style={{ fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.6, maxWidth: "85%", marginBottom: "3rem", color: "var(--color-white)" }}>
            Platform manajemen keuangan brutalist Gen-Z yang dilengkapi AI cerdas untuk melacak, merencanakan, dan mengedukasi finansialmu secara real-time.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "90%" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", background: "rgba(255, 255, 255, 0.1)", padding: "1.25rem 1.5rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid rgba(255, 255, 255, 0.2)", color: "var(--color-white)", fontWeight: 700, fontSize: "1.05rem", backdropFilter: "blur(8px)" }}>
                <div style={{ background: "var(--color-lime)", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-navy)" }}><Zap size={20} /></div>
                AI Spending Pattern & Risk Profile
             </div>
             <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", background: "rgba(255, 255, 255, 0.1)", padding: "1.25rem 1.5rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid rgba(255, 255, 255, 0.2)", color: "var(--color-white)", fontWeight: 700, fontSize: "1.05rem", backdropFilter: "blur(8px)" }}>
                <div style={{ background: "var(--color-orange)", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-navy)" }}><ShieldCheck size={20} /></div>
                Sistem Peringatan Dini (Warning Gate)
             </div>
             <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", background: "rgba(255, 255, 255, 0.1)", padding: "1.25rem 1.5rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid rgba(255, 255, 255, 0.2)", color: "var(--color-white)", fontWeight: 700, fontSize: "1.05rem", backdropFilter: "blur(8px)" }}>
                <div style={{ background: "var(--color-white)", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-navy)" }}><User size={20} /></div>
                Chatbot CAMI & Edukasi Finansial
             </div>
          </div>
        </div>
        
        <div style={{ position: "relative", zIndex: 10, fontSize: "0.85rem", fontWeight: 700, opacity: 0.7, marginTop: "3rem", color: "var(--color-text-light)" }}>
          &copy; 2026 CEAMIS Capstone Project
        </div>
        
        {/* Background Decor */}
        <div style={{ position: "absolute", bottom: "-10%", right: "-10%", opacity: 0.05, transform: "rotate(-15deg)" }}>
           <Zap size={600} />
        </div>
      </div>

      {/* ── RIGHT PANEL: Login Form ── */}
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

          {/* Header Text (Dipindah ke luar card) */}
          <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            <h1
              style={{
                fontFamily: "var(--font-heading)", fontSize: "2rem",
                marginBottom: "0.5rem", color: "var(--color-navy)",
                fontWeight: 900
              }}
            >
              {roleTab === "admin" ? "Admin Panel Login" : "Masuk ke CEAMIS"}
            </h1>
            <p
              style={{
                color: "var(--color-text-muted)",
                margin: 0, fontSize: "1rem", fontWeight: 500
              }}
            >
              {roleTab === "admin"
                ? "Akses khusus untuk administrator sistem."
                : "Siap kontrol keuanganmu hari ini?"}
            </p>
          </div>

          {/* Auth Card */}
          <div
            style={{
              width: "100%", padding: "2rem",
              background: "var(--color-white)",
              border: "3px solid var(--color-navy)",
              borderTop: "8px solid var(--color-navy)",
              borderRadius: "var(--radius-brutal-lg)",
              boxShadow: "8px 8px 0px #D1D5DB",
              position: "relative",
            }}
          >

            {/* Error Message */}
            {error && (
              <div style={{
                padding: "0.75rem 1rem", marginBottom: "1rem",
                background: "rgba(231, 76, 60, 0.1)", border: "2px solid var(--color-danger, #e74c3c)",
                borderRadius: "var(--radius-brutal-sm)", color: "var(--color-danger, #e74c3c)",
                fontSize: "0.85rem", fontWeight: 700,
              }}>
                {error}
              </div>
            )}

            {/* Login Form */}
            <form
              onSubmit={handleLogin}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.375rem", display: "block" }}>
                  Email
                </label>
                <input
                  type="email" className="input-brutal"
                  placeholder={roleTab === "admin" ? "admin@ceamis.id" : "nama@email.com"}
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.375rem", display: "block" }}>
                  Password
                </label>
                <input
                  type="password" className="input-brutal"
                  placeholder="Masukkan password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit" disabled={isLoading}
                className="btn-brutal"
                style={{
                  width: "100%", marginTop: "0.5rem", padding: "0.85rem",
                  fontWeight: 800, fontSize: "1rem", cursor: isLoading ? "wait" : "pointer",
                  background: roleTab === "admin" ? "var(--color-danger, #e74c3c)" : "var(--color-purple)",
                  color: "var(--color-white)", border: "3px solid var(--color-navy)",
                  boxShadow: isLoading ? "none" : "4px 4px 0px var(--color-navy)",
                  transform: isLoading ? "translate(4px, 4px)" : "none",
                  transition: "all 0.15s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                }}
              >
                <LogIn size={18} />
                {isLoading ? "Memproses..." : (roleTab === "admin" ? "Login Admin" : "Login")}
              </button>
            </form>

            {/* Only show extra options for User role */}
            {roleTab === "user" && (
              <>
                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
                  <div style={{ flex: 1, height: 2, background: "var(--color-border)" }} />
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                    ATAU
                  </span>
                  <div style={{ flex: 1, height: 2, background: "var(--color-border)" }} />
                </div>

                {/* Google Login */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="btn-brutal"
                  style={{
                    width: "100%", padding: "0.75rem", fontWeight: 800,
                    background: "var(--color-white)", color: "var(--color-navy)",
                    border: "2px solid var(--color-navy)", cursor: isLoading ? "wait" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                    boxShadow: "3px 3px 0px var(--color-navy)", marginBottom: "0.75rem",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Masuk dengan Google
                </button>

                {/* Other Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <button
                    onClick={() => router.push('/auth/register')}
                    disabled={isLoading}
                    className="btn-brutal btn-brutal--success"
                    style={{ width: "100%" }}
                  >
                    Daftar Akun Baru
                  </button>
                  {/* Lanjut sebagai Guest */}
                  <button
                    onClick={() => {
                      localStorage.setItem("ceamis_role", "guest");
                      router.push("/dashboard");
                    }}
                    disabled={isLoading}
                    className="btn-brutal btn-brutal--secondary"
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                  >
                    <Eye size={16} style={{ verticalAlign: "middle" }} />
                    Lanjut sebagai Guest
                  </button>
                </div>
              </>
            )}
          </div>

          <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center" }}>
            <button
              onClick={() => router.push("/")}
              className="btn-brutal"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1.5rem",
                background: "var(--color-white)",
                color: "var(--color-navy)",
                border: "2px solid var(--color-navy)",
                boxShadow: "3px 3px 0px var(--color-navy)",
                fontWeight: 800,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={16} strokeWidth={2.5} /> Kembali ke Beranda
            </button>
          </div>

          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
            {/* Quick Demo Links */}
            <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", fontWeight: 700, alignItems: "center" }}>
              <button 
                onClick={() => handleQuickLogin(QUICK_LOGINS[0])} 
                disabled={isLoading}
                style={{ background: "none", border: "none", color: "var(--color-navy)", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit", fontWeight: 700 }}
              >
                Masuk sbg User Demo
              </button>
              <span style={{ color: "var(--color-text-muted)" }}>•</span>
              <button 
                onClick={() => handleQuickLogin(QUICK_LOGINS[1])} 
                disabled={isLoading}
                style={{ background: "none", border: "none", color: "var(--color-danger, #e74c3c)", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit", fontWeight: 700 }}
              >
                Masuk sbg Admin Demo
              </button>
            </div>

            {/* Toggle Admin/User Role */}
            <button 
              onClick={() => setRoleTab(roleTab === "user" ? "admin" : "user")}
              disabled={isLoading}
              style={{ 
                background: "none", border: "none", color: "var(--color-text-muted)", 
                cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: "0.4rem"
              }}
            >
              {roleTab === "user" ? <ShieldCheck size={14} /> : <User size={14} />}
              {roleTab === "user" ? "Beralih ke Login Admin" : "Kembali ke Login User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
