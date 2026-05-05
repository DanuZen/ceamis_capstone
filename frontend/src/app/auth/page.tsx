"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck, User, Eye, Zap, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ── Quick Login Accounts ──────────────────────
const QUICK_LOGINS = [
  { label: "User Demo", email: "user@ceamis.com", password: "user123456", role: "user" as const, color: "purple", icon: User },
  { label: "Admin Demo", email: "admin@ceamis.com", password: "admin123456", role: "admin" as const, color: "danger, #e74c3c", icon: ShieldCheck },
];

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();
  const [role, setRole] = useState<"user" | "admin">("user");
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

    // Redirect based on selected role
    if (role === "admin") {
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.5rem",
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

      {/* ── Quick Login Section ── */}
      <div style={{
        width: "100%", maxWidth: 420, marginBottom: "1.25rem",
        padding: "1rem", background: "var(--color-white)",
        border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
        boxShadow: "4px 4px 0px var(--color-navy)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <Zap size={18} color="var(--color-orange)" fill="var(--color-orange)" />
          <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--color-navy)" }}>Login Cepat (Demo)</span>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {QUICK_LOGINS.map((account) => (
            <button
              key={account.email}
              onClick={() => handleQuickLogin(account)}
              disabled={isLoading}
              className="btn-brutal"
              style={{
                flex: 1, padding: "0.75rem", fontWeight: 800, fontSize: "0.85rem",
                background: `var(--color-${account.color})`, color: "var(--color-white)",
                border: "2px solid var(--color-navy)", cursor: isLoading ? "wait" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                boxShadow: "3px 3px 0px var(--color-navy)",
              }}
            >
              <account.icon size={16} /> {account.label}
            </button>
          ))}
        </div>
      </div>

      {/* Role Selector Tabs */}
      <div style={{
        display: "flex", width: "100%", maxWidth: 420,
        border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
        overflow: "hidden", boxShadow: "4px 4px 0px var(--color-navy)",
      }}>
        <button
          onClick={() => setRole("user")}
          style={{
            flex: 1, padding: "0.85rem", border: "none", cursor: "pointer",
            background: role === "user" ? "var(--color-purple)" : "var(--color-white)",
            color: role === "user" ? "var(--color-white)" : "var(--color-navy)",
            fontWeight: 800, fontSize: "0.9rem", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            borderRight: "3px solid var(--color-navy)", transition: "all 0.2s ease",
          }}
        >
          <User size={18} /> Masuk sebagai User
        </button>
        <button
          onClick={() => setRole("admin")}
          style={{
            flex: 1, padding: "0.85rem", border: "none", cursor: "pointer",
            background: role === "admin" ? "var(--color-danger, #e74c3c)" : "var(--color-white)",
            color: role === "admin" ? "var(--color-white)" : "var(--color-navy)",
            fontWeight: 800, fontSize: "0.9rem", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            transition: "all 0.2s ease",
          }}
        >
          <ShieldCheck size={18} /> Masuk sebagai Admin
        </button>
      </div>

      {/* Auth Card */}
      <div
        className="card-brutal animate-bounce-in"
        style={{
          width: "100%", maxWidth: 420, padding: "2rem", marginTop: "1.25rem",
          borderTop: role === "admin" ? "6px solid var(--color-danger, #e74c3c)" : "6px solid var(--color-purple)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading)", fontSize: "1.75rem",
            marginBottom: "0.5rem", textAlign: "center", color: "var(--color-navy)",
          }}
        >
          {role === "admin" ? "Admin Panel Login" : "Masuk ke CEAMIS"}
        </h1>
        <p
          style={{
            textAlign: "center", color: "var(--color-text-muted)",
            marginBottom: "1.5rem", fontSize: "0.9375rem",
          }}
        >
          {role === "admin"
            ? "Akses khusus untuk administrator sistem."
            : "Siap kontrol keuanganmu hari ini?"}
        </p>

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
              placeholder={role === "admin" ? "admin@ceamis.id" : "nama@email.com"}
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
              background: role === "admin" ? "var(--color-danger, #e74c3c)" : "var(--color-purple)",
              color: "var(--color-white)", border: "3px solid var(--color-navy)",
              boxShadow: isLoading ? "none" : "4px 4px 0px var(--color-navy)",
              transform: isLoading ? "translate(4px, 4px)" : "none",
              transition: "all 0.15s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            }}
          >
            <LogIn size={18} />
            {isLoading ? "Memproses..." : (role === "admin" ? "Login Admin" : "Login")}
          </button>
        </form>

        {/* Only show extra options for User role */}
        {role === "user" && (
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
                onClick={handleRegister}
                disabled={isLoading}
                className="btn-brutal btn-brutal--success"
                style={{ width: "100%" }}
              >
                Daftar Akun Baru
              </button>
              <Link
                href="/dashboard"
                className="btn-brutal btn-brutal--secondary"
                style={{ width: "100%", textAlign: "center" }}
              >
                <Eye size={16} style={{ verticalAlign: "middle", marginRight: "0.5rem" }} />
                Lanjut sebagai Guest
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Fun tagline */}
      <p
        style={{
          marginTop: "1.5rem", fontFamily: "var(--font-heading)", fontWeight: 600,
          fontSize: "0.875rem", color: "var(--color-text-muted)", textAlign: "center",
        }}
      >
        {role === "admin"
          ? "Panel ini hanya untuk administrator resmi CEAMIS."
          : "\u201CDuit nggak bisa kontrol dirinya sendiri, tapi kamu bisa!\u201D"}
      </p>
    </div>
  );
}
