"use client";

import { useState, useEffect } from "react";

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number;
}

export default function SplashScreen({ onFinish, duration = 1600 }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Lock body scroll while splash screen is active
    document.body.style.overflow = "hidden";

    // Fade out after duration
    const fadeTimer = setTimeout(() => {
      setFading(true);
      document.body.style.overflow = "";

      const hideTimer = setTimeout(() => {
        setVisible(false);
        onFinish?.();
      }, 550);

      return () => clearTimeout(hideTimer);
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      document.body.style.overflow = "";
    };
  }, [duration, onFinish]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#0A192F",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        opacity: fading ? 0 : 1,
        transform: fading ? "scale(1.04)" : "scale(1)",
        transition: "opacity 0.55s ease-out, transform 0.55s ease-out",
        pointerEvents: fading ? "none" : "auto",
      }}
      aria-label="CEAMIS Splash Screen"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Animated Logo Card with Spring Pop */}
        <div
          className="splash-logo"
          style={{
            width: "120px",
            height: "120px",
            background: "#FFFFFF",
            border: "3.5px solid #0A192F",
            borderRadius: "28px",
            boxShadow: "6px 6px 0px #D2FF28, 6px 6px 0px 3.5px #0A192F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            marginBottom: "1.5rem",
          }}
        >
          <img
            src="/images/logo_new.png"
            alt="CEAMIS Logo"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>

        {/* Animated Brand Name */}
        <h1
          className="splash-title"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2.85rem",
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: "0.03em",
            lineHeight: 1,
            margin: "0 0 0.75rem 0",
          }}
        >
          CEAMIS
        </h1>

        {/* Animated Tagline */}
        <p
          className="splash-tagline"
          style={{
            color: "rgba(255, 255, 255, 0.75)",
            fontSize: "0.95rem",
            fontWeight: 600,
            letterSpacing: "0.015em",
            margin: 0,
          }}
        >
          Control Every Awful Money Impulse System
        </p>
      </div>

      <style jsx>{`
        /* 1. Logo Card Spring Entrance */
        .splash-logo {
          animation: splash-logo-enter 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes splash-logo-enter {
          0% {
            opacity: 0;
            transform: scale(0.35) translateY(-30px) rotate(-8deg);
          }
          65% {
            transform: scale(1.08) translateY(3px) rotate(2deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0) rotate(0deg);
          }
        }

        /* 2. Brand Title Slide-up & Snap */
        .splash-title {
          animation: splash-title-enter 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both;
        }

        @keyframes splash-title-enter {
          0% {
            opacity: 0;
            transform: translateY(22px);
            letter-spacing: 0.12em;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            letter-spacing: 0.03em;
          }
        }

        /* 3. Tagline Gentle Slide-up */
        .splash-tagline {
          animation: splash-tagline-enter 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.32s both;
        }

        @keyframes splash-tagline-enter {
          0% {
            opacity: 0;
            transform: translateY(16px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
