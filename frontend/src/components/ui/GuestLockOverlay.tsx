"use client";

import Link from "next/link";
import { Lock, Sparkles, UserPlus } from "lucide-react";

interface GuestLockOverlayProps {
  /** Nama fitur yang dikunci, tampil di overlay */
  featureName: string;
  /** Mode full-page atau inline card */
  variant?: "page" | "card" | "section";
  children: React.ReactNode;
}

/**
 * Wrapper yang menampilkan konten asli di balik overlay kaca.
 * Guest bisa melihat kontennya tapi tidak bisa berinteraksi.
 */
export default function GuestLockOverlay({
  featureName,
  variant = "section",
  children,
}: GuestLockOverlayProps) {
  const isPage    = variant === "page";
  const isCard    = variant === "card";

  return (
    <div style={{ position: "relative", isolation: "isolate" }}>
      {/* ── Konten asli (terblur di belakang) ── */}
      <div
        aria-hidden="true"
        style={{
          filter: "blur(4px) brightness(0.85)",
          pointerEvents: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {children}
      </div>

      {/* ── Overlay kaca ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: isPage ? "center" : "center",
          padding: isPage ? "3rem 2rem" : "1.5rem 1rem",
          background: isPage
            ? "rgba(255,255,255,0.55)"
            : "rgba(255,255,255,0.6)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          borderRadius: "inherit",
          textAlign: "center",
          gap: "1rem",
        }}
      >
        {/* Lock badge */}
        <div
          style={{
            width: isPage ? "80px" : isCard ? "56px" : "64px",
            height: isPage ? "80px" : isCard ? "56px" : "64px",
            background: "var(--color-navy)",
            borderRadius: "var(--radius-brutal-sm)",
            border: "3px solid var(--color-navy)",
            boxShadow: `4px 4px 0px var(--color-lime)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Lock
            size={isPage ? 36 : isCard ? 24 : 28}
            color="var(--color-lime)"
            strokeWidth={2.5}
          />
        </div>

        {/* Text */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 900,
              fontSize: isPage ? "1.5rem" : isCard ? "1rem" : "1.125rem",
              color: "var(--color-navy)",
              marginBottom: "0.375rem",
            }}
          >
            {featureName} Terkunci
          </div>
          <p
            style={{
              fontSize: isPage ? "1rem" : "0.8125rem",
              color: "var(--color-text-muted)",
              maxWidth: "320px",
              lineHeight: 1.5,
              margin: "0 auto",
              fontWeight: 600,
            }}
          >
            Fitur ini khusus untuk akun terdaftar.{" "}
            <strong style={{ color: "var(--color-navy)" }}>Daftar gratis</strong>{" "}
            untuk akses penuh!
          </p>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.25rem" }}>
          <Link href="/auth" style={{ textDecoration: "none" }}>
            <button
              className="btn-brutal"
              style={{
                padding: isPage ? "0.875rem 2rem" : "0.6rem 1.25rem",
                background: "var(--color-navy)",
                color: "var(--color-white)",
                fontWeight: 800,
                fontSize: isPage ? "1rem" : "0.8125rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                border: "3px solid var(--color-navy)",
                boxShadow: "4px 4px 0px var(--color-lime)",
              }}
            >
              <UserPlus size={isPage ? 18 : 14} />
              Daftar Sekarang
            </button>
          </Link>
          <Link href="/auth" style={{ textDecoration: "none" }}>
            <button
              className="btn-brutal"
              style={{
                padding: isPage ? "0.875rem 1.5rem" : "0.6rem 1rem",
                background: "var(--color-white)",
                color: "var(--color-navy)",
                fontWeight: 800,
                fontSize: isPage ? "1rem" : "0.8125rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                border: "2px solid var(--color-navy)",
                boxShadow: "3px 3px 0px var(--color-navy)",
              }}
            >
              <Sparkles size={isPage ? 16 : 13} color="var(--color-purple)" />
              Sudah punya akun? Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
