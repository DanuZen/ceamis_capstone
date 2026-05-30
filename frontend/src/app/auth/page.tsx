"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ShieldCheck, User, Eye, Zap, LogIn, ArrowLeft, Mail, X, ExternalLink, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";



export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

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

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    const role = data.user?.user_metadata?.role || "user";
    const finalRole = (email === "admin@ceamis.com" || email === "admin@ceamis.id") ? "admin" : role;
    
    localStorage.setItem("ceamis_role", finalRole);
    
    if (finalRole === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
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
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-navy)", fontWeight: 700, lineHeight: 1.5, display: "flex", gap: "0.5rem" }}>
                <Info size={16} style={{ flexShrink: 0, marginTop: "0.1rem" }} /> Klik link verifikasi di email untuk mengaktifkan akun kamu, lalu login seperti biasa.
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
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(-15deg); }
          50% { transform: translateY(-30px) rotate(-10deg); }
          100% { transform: translateY(0px) rotate(-15deg); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(204, 255, 0, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(204, 255, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(204, 255, 0, 0); }
        }
        .feature-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .feature-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.25);
          transform: translateX(10px) translateY(-5px);
          box-shadow: 0 15px 35px 0 rgba(0, 0, 0, 0.2);
        }
        .logo-container {
          animation: pulseGlow 3s infinite;
        }
      `}</style>
      <div 
        className="hidden md:flex"
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #9333EA 100%)",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "5rem",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "var(--color-white)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Logo Panel */}
        <div style={{ position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div className="logo-container" style={{ 
              width: "64px", height: "64px",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden"
            }}>
              <img src="/images/logo_white.png" alt="CEAMIS Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "2.5rem", letterSpacing: "-1px", background: "linear-gradient(90deg, #FFFFFF, var(--color-lime))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              CEAMIS
            </span>
          </div>
        </div>

        {/* Center Content */}
        <div style={{ position: "relative", zIndex: 10, marginTop: "2rem" }}>

          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "4rem", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.5rem", color: "var(--color-white)", textShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            Control Every<br/>
            <span style={{ color: "var(--color-lime)" }}>Awful Money</span><br/>
            Impulse System
          </h2>
          <p style={{ fontSize: "1.2rem", fontWeight: 500, lineHeight: 1.6, maxWidth: "90%", marginBottom: "3rem", color: "rgba(255, 255, 255, 0.85)" }}>
            {t("auth.leftDesc")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "95%" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div style={{ background: "linear-gradient(135deg, var(--color-lime), #84cc00)", borderRadius: "12px", width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-navy)", boxShadow: "0 4px 12px rgba(204, 255, 0, 0.3)", flexShrink: 0 }}><Zap size={24} strokeWidth={2.5} /></div>
                <div>
                  <div style={{ color: "var(--color-lime)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "0.25rem", fontWeight: 800 }}>Smart Analytics</div>
                  <div style={{ fontWeight: 600, fontSize: "1.05rem", color: "var(--color-white)" }}>{t("auth.feat1")}</div>
                </div>
             </div>
             
             <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div style={{ background: "linear-gradient(135deg, var(--color-orange), #e66c00)", borderRadius: "12px", width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-white)", boxShadow: "0 4px 12px rgba(255, 122, 0, 0.3)", flexShrink: 0 }}><ShieldCheck size={24} strokeWidth={2.5} /></div>
                <div>
                  <div style={{ color: "var(--color-orange)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "0.25rem", fontWeight: 800 }}>Protection</div>
                  <div style={{ fontWeight: 600, fontSize: "1.05rem", color: "var(--color-white)" }}>{t("auth.feat2")}</div>
                </div>
             </div>
             
             <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div style={{ background: "linear-gradient(135deg, #FFFFFF, #E2E8F0)", borderRadius: "12px", width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-navy)", boxShadow: "0 4px 12px rgba(255, 255, 255, 0.2)", flexShrink: 0 }}><User size={24} strokeWidth={2.5} /></div>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "0.25rem", fontWeight: 800 }}>AI Assistant</div>
                  <div style={{ fontWeight: 600, fontSize: "1.05rem", color: "var(--color-white)" }}>{t("auth.feat3")}</div>
                </div>
             </div>
          </div>
        </div>
        
        <div style={{ position: "relative", zIndex: 10, fontSize: "0.85rem", fontWeight: 600, opacity: 0.6, marginTop: "4rem", color: "var(--color-white)" }}>
          &copy; 2026 CEAMIS Capstone Project
        </div>
        
        {/* Background Decor */}
        <div style={{ position: "absolute", bottom: "-5%", right: "-10%", opacity: 0.08, animation: "float 8s ease-in-out infinite" }}>
           <Zap size={600} color="var(--color-white)" />
        </div>
        <div style={{ position: "absolute", top: "-10%", left: "-10%", opacity: 0.03, animation: "float 10s ease-in-out infinite reverse" }}>
           <ShieldCheck size={400} color="var(--color-white)" />
        </div>
        {/* Soft glowing orb in the background */}
        <div style={{ position: "absolute", top: "20%", left: "40%", width: "400px", height: "400px", background: "var(--color-lime)", borderRadius: "50%", filter: "blur(150px)", opacity: 0.15, zIndex: 0 }}></div>
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
              src="/images/logo_color.png" 
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
              {t("auth.userLogin")}
            </h1>
            <p
              style={{
                color: "var(--color-text-muted)",
                margin: 0, fontSize: "1rem", fontWeight: 500
              }}
            >
              {t("auth.readyText")}
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
                  placeholder={t("auth.emailPlaceholder")}
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

              {/* Remember Me Checkbox */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: "18px", height: "18px",
                    accentColor: "var(--color-purple)",
                    cursor: "pointer",
                    border: "2px solid var(--color-navy)"
                  }}
                />
                <label htmlFor="rememberMe" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-navy)", cursor: "pointer" }}>
                  Ingat saya
                </label>
              </div>

              <button
                type="submit" disabled={isLoading}
                className="btn-brutal"
                style={{
                  width: "100%", marginTop: "0.5rem", padding: "0.85rem",
                  fontWeight: 800, fontSize: "1rem", cursor: isLoading ? "wait" : "pointer",
                  background: "var(--color-purple)",
                  color: "var(--color-white)", border: "3px solid var(--color-navy)",
                  boxShadow: isLoading ? "none" : "4px 4px 0px var(--color-navy)",
                  transform: isLoading ? "translate(4px, 4px)" : "none",
                  transition: "all 0.15s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                }}
              >
                <LogIn size={18} />
                {isLoading ? t("auth.processing") : t("auth.loginBtn")}
              </button>
            </form>

            {/* Extra options */}
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

        </div>
      </div>
    </div>
  );
}
