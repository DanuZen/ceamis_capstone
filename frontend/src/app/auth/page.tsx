"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ShieldCheck, User, Eye, Zap, LogIn, ArrowLeft, Mail, X, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";

// ── Quick Login Accounts ──────────────────────
const QUICK_LOGINS = [
  { label: "User Demo", email: "user@ceamis.com", password: "user123456", role: "user" as const, color: "purple", icon: User },
  { label: "Admin Demo", email: "admin@ceamis.com", password: "admin123456", role: "admin" as const, color: "danger, #e74c3c", icon: ShieldCheck },
];

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLanguage();
  const [roleTab, setRoleTab] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("verify") === "1") {
      setRegisteredEmail(searchParams.get("email") || "");
      setShowVerifyModal(true);
    }
  }, []);

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
      setError(`${t("auth.quickLoginFailed")}${signInError.message}`);
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
      setError(t("auth.emptyFields"));
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
    setRegisteredEmail(email);
    setShowVerifyModal(true);
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
      {/* ── Email Verification Modal ── */}
      {showVerifyModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(10, 25, 47, 0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1.5rem", backdropFilter: "blur(4px)"
        }}>
          <div style={{
            width: "100%", maxWidth: "460px",
            background: "var(--color-white)",
            border: "4px solid var(--color-navy)",
            borderRadius: "var(--radius-brutal-lg)",
            boxShadow: "10px 10px 0px var(--color-navy)",
            padding: "2.5rem",
            position: "relative",
            animation: "bounceIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}>
            {/* Close button */}
            <button
              onClick={() => { setShowVerifyModal(false); router.push("/auth"); }}
              style={{
                position: "absolute", top: "1rem", right: "1rem",
                background: "var(--color-bg)", border: "2px solid var(--color-navy)",
                borderRadius: "var(--radius-brutal-sm)", cursor: "pointer",
                width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "2px 2px 0px var(--color-navy)"
              }}
            >
              <X size={18} color="var(--color-navy)" strokeWidth={2.5} />
            </button>

            {/* Email icon */}
            <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
              <div style={{
                width: "88px", height: "88px",
                background: "var(--color-lime)",
                border: "3px solid var(--color-navy)",
                borderRadius: "var(--radius-brutal)",
                boxShadow: "6px 6px 0px var(--color-navy)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.25rem"
              }}>
                <Mail size={48} color="var(--color-navy)" strokeWidth={2.5} />
              </div>
              <h2 style={{
                fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 900,
                color: "var(--color-navy)", margin: "0 0 0.5rem 0"
              }}>
                Cek Inbox Email Kamu!
              </h2>
              <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                Kami sudah kirim link verifikasi ke
              </p>
              <div style={{
                marginTop: "0.75rem",
                padding: "0.6rem 1rem",
                background: "var(--color-bg)",
                border: "2.5px solid var(--color-navy)",
                borderRadius: "var(--radius-brutal-sm)",
                fontWeight: 800, fontSize: "0.9rem",
                color: "var(--color-navy)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
              }}>
                <Mail size={14} strokeWidth={2.5} />
                {registeredEmail || email}
              </div>
            </div>

            {/* Info */}
            <div style={{
              background: "rgba(88, 51, 238, 0.07)",
              border: "2px solid var(--color-purple)",
              borderRadius: "var(--radius-brutal-sm)",
              padding: "1rem",
              marginBottom: "1.5rem"
            }}>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-navy)", fontWeight: 700, lineHeight: 1.5 }}>
                📌 Klik link verifikasi di email untuk mengaktifkan akun kamu, lalu login seperti biasa.
              </p>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.8rem", color: "var(--color-text-muted)", fontWeight: 600 }}>
                Tidak ada email? Cek folder <strong>Spam</strong> atau tunggu beberapa menit.
              </p>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brutal"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  padding: "0.85rem", fontWeight: 900, fontSize: "1rem", textDecoration: "none",
                  background: "var(--color-purple)", color: "var(--color-white)",
                  border: "3px solid var(--color-navy)", boxShadow: "4px 4px 0px var(--color-navy)"
                }}
              >
                <ExternalLink size={18} /> Buka Gmail
              </a>
              <button
                onClick={() => { setShowVerifyModal(false); router.push("/auth"); }}
                className="btn-brutal"
                style={{
                  width: "100%", padding: "0.75rem", fontWeight: 800, fontSize: "0.9rem",
                  background: "var(--color-bg)", color: "var(--color-navy)",
                  border: "2px solid var(--color-navy)", boxShadow: "3px 3px 0px var(--color-navy)"
                }}
              >
                Saya Sudah Verifikasi — Masuk Login
              </button>
            </div>
          </div>
        </div>
      )}
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
            <img 
              src="/images/logo_ceamis.png" 
              alt="CEAMIS Logo" 
              style={{ 
                width: 52, height: 52, background: "var(--color-lime)",
                border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
                boxShadow: "4px 4px 0px var(--color-navy)", objectFit: "contain",
                padding: "4px"
              }} 
            />
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "2rem" }}>
              CEAMIS
            </span>
          </div>

          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "4rem", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.5rem", color: "var(--color-white)" }}>
            Control Every<br/>Money-Issue<br/>Simply.
          </h2>
          <p style={{ fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.6, maxWidth: "85%", marginBottom: "3rem", color: "var(--color-white)" }}>
            {t("auth.leftDesc")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "90%" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", background: "rgba(255, 255, 255, 0.1)", padding: "1.25rem 1.5rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid rgba(255, 255, 255, 0.2)", color: "var(--color-white)", fontWeight: 700, fontSize: "1.05rem", backdropFilter: "blur(8px)" }}>
                <div style={{ background: "var(--color-lime)", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-navy)" }}><Zap size={20} /></div>
                {t("auth.feat1")}
             </div>
             <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", background: "rgba(255, 255, 255, 0.1)", padding: "1.25rem 1.5rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid rgba(255, 255, 255, 0.2)", color: "var(--color-white)", fontWeight: 700, fontSize: "1.05rem", backdropFilter: "blur(8px)" }}>
                <div style={{ background: "var(--color-orange)", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-navy)" }}><ShieldCheck size={20} /></div>
                {t("auth.feat2")}
             </div>
             <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", background: "rgba(255, 255, 255, 0.1)", padding: "1.25rem 1.5rem", borderRadius: "var(--radius-brutal-sm)", border: "2px solid rgba(255, 255, 255, 0.2)", color: "var(--color-white)", fontWeight: 700, fontSize: "1.05rem", backdropFilter: "blur(8px)" }}>
                <div style={{ background: "var(--color-white)", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-navy)" }}><User size={20} /></div>
                {t("auth.feat3")}
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
            <img 
              src="/images/logo_ceamis.png" 
              alt="CEAMIS Logo" 
              style={{ 
                width: 52, height: 52,
                background: "var(--color-white)",
                border: "3px solid var(--color-navy)",
                borderRadius: "var(--radius-brutal-sm)",
                boxShadow: "3px 3px 0px var(--color-navy)",
                objectFit: "contain",
                padding: "4px"
              }} 
            />
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
              {roleTab === "admin" ? t("auth.adminLogin") : t("auth.userLogin")}
            </h1>
            <p
              style={{
                color: "var(--color-text-muted)",
                margin: 0, fontSize: "1rem", fontWeight: 500
              }}
            >
              {roleTab === "admin"
                ? t("auth.adminText")
                : t("auth.readyText")}
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
              boxShadow: "8px 8px 0px var(--color-navy)",
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
                  placeholder={roleTab === "admin" ? "admin@ceamis.id" : t("auth.emailPlaceholder")}
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.375rem", display: "block" }}>
                  Password
                </label>
                <input
                  type="password" className="input-brutal"
                  placeholder={t("auth.passwordPlaceholder")}
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
                {isLoading ? t("auth.processing") : (roleTab === "admin" ? t("auth.loginAdminBtn") : t("auth.loginBtn"))}
              </button>
            </form>

            {/* Only show extra options for User role */}
            {roleTab === "user" && (
              <>
                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
                  <div style={{ flex: 1, height: 2, background: "var(--color-border)" }} />
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                    {t("auth.or")}
                  </span>
                  <div style={{ flex: 1, height: 2, background: "var(--color-border)" }} />
                </div>

                {/* Other Options */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <button
                    onClick={() => router.push('/auth/register')}
                    disabled={isLoading}
                    className="btn-brutal btn-brutal--success"
                    style={{ width: "100%" }}
                  >
                    {t("auth.registerNew")}
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
                    {t("auth.guestLogin")}
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
              <ArrowLeft size={16} strokeWidth={2.5} /> {t("auth.backHome")}
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
                {t("auth.demoUser")}
              </button>
              <span style={{ color: "var(--color-text-muted)" }}>•</span>
              <button 
                onClick={() => handleQuickLogin(QUICK_LOGINS[1])} 
                disabled={isLoading}
                style={{ background: "none", border: "none", color: "var(--color-danger, #e74c3c)", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit", fontWeight: 700 }}
              >
                {t("auth.demoAdmin")}
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
              {roleTab === "user" ? t("auth.switchToAdmin") : t("auth.switchToUser")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
