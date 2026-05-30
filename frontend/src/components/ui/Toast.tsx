"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Centered Modal-like Toast Container */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: toasts.length > 0 ? "flex" : "none",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.55)",
          pointerEvents: toasts.length > 0 ? "auto" : "none",
        }}
      >
        {toasts.map((toast) => {
          let bg = "var(--color-white)";
          let borderColor = "var(--color-navy)";
          let iconColor = "var(--color-navy)";
          let shadowColor = "var(--color-navy)";
          let Icon = CheckCircle2;

          switch (toast.type) {
            case "success":
              bg = "var(--color-lime)";
              shadowColor = "var(--color-navy)";
              Icon = CheckCircle2;
              break;
            case "error":
              bg = "var(--color-pink)";
              shadowColor = "var(--color-navy)";
              Icon = XCircle;
              break;
            case "warning":
              bg = "var(--color-orange)";
              shadowColor = "var(--color-navy)";
              Icon = AlertTriangle;
              break;
            case "info":
            default:
              bg = "var(--color-white)";
              shadowColor = "var(--color-purple)";
              Icon = CheckCircle2;
              break;
          }

          return (
            <div
              key={toast.id}
              className="animate-bounce-in"
              style={{
                background: bg,
                border: `4px solid ${borderColor}`,
                boxShadow: `8px 8px 0px ${shadowColor}`,
                padding: "2.5rem 2rem",
                borderRadius: "var(--radius-brutal)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
                minWidth: "350px",
                maxWidth: "480px",
                textAlign: "center",
              }}
            >
              <div style={{
                background: "var(--color-white)",
                borderRadius: "50%",
                padding: "1rem",
                border: "3px solid var(--color-navy)",
                boxShadow: "4px 4px 0px var(--color-navy)"
              }}>
                <Icon size={48} color={iconColor} strokeWidth={2.5} />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  color: "var(--color-navy)",
                  lineHeight: 1.4,
                }}
              >
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="btn-brutal"
                style={{
                  width: "100%",
                  background: "var(--color-white)",
                  color: "var(--color-navy)",
                  border: "3px solid var(--color-navy)",
                  padding: "0.85rem",
                  fontWeight: 900,
                  fontSize: "1rem",
                  boxShadow: "4px 4px 0px var(--color-navy)",
                  letterSpacing: "0.5px",
                }}
              >
                OK, Paham!
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
