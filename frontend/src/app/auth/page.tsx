"use client";

import Link from "next/link";

export default function AuthPage() {
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
          marginBottom: "2rem",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            background: "var(--color-primary)",
            border: "var(--border-width) solid var(--color-border)",
            borderRadius: "var(--radius-brutal-sm)",
            boxShadow: "var(--shadow-brutal-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
          }}
        >
          C
        </div>
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "2rem",
            color: "var(--color-text)",
          }}
        >
          CEAMIS
        </span>
      </Link>

      {/* Auth Card */}
      <div
        className="card-brutal animate-bounce-in"
        style={{ width: "100%", maxWidth: 420, padding: "2rem" }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.75rem",
            marginBottom: "0.5rem",
            textAlign: "center",
          }}
        >
          Masuk ke CEAMIS
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "var(--color-text-muted)",
            marginBottom: "1.5rem",
            fontSize: "0.9375rem",
          }}
        >
          Siap kontrol keuanganmu hari ini?
        </p>

        {/* Login Form */}
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: "0.875rem",
                marginBottom: "0.375rem",
                display: "block",
              }}
            >
              Email
            </label>
            <input
              type="email"
              className="input-brutal"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: "0.875rem",
                marginBottom: "0.375rem",
                display: "block",
              }}
            >
              Password
            </label>
            <input
              type="password"
              className="input-brutal"
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="submit"
            className="btn-brutal btn-brutal--primary"
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            margin: "1.5rem 0",
          }}
        >
          <div style={{ flex: 1, height: 2, background: "var(--color-border)" }} />
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: "0.8125rem",
              color: "var(--color-text-muted)",
            }}
          >
            ATAU
          </span>
          <div style={{ flex: 1, height: 2, background: "var(--color-border)" }} />
        </div>

        {/* Other Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button
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
            Lanjut sebagai Guest
          </Link>
        </div>
      </div>

      {/* Fun tagline */}
      <p
        style={{
          marginTop: "1.5rem",
          fontFamily: "var(--font-heading)",
          fontWeight: 600,
          fontSize: "0.875rem",
          color: "var(--color-text-muted)",
          textAlign: "center",
        }}
      >
        &ldquo;Duit nggak bisa kontrol dirinya sendiri, tapi kamu bisa!&rdquo;
      </p>
    </div>
  );
}
