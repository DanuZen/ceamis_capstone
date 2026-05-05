"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Calendar, Bell, ChevronDown, LogOut, ShieldCheck, PanelLeft } from "lucide-react";
import Link from "next/link";

interface AdminNavbarProps {
  toggleSidebar?: () => void;
  isOpen?: boolean;
}

export default function AdminNavbar({ toggleSidebar, isOpen = true }: AdminNavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <header className="navbar" style={{
      background: "var(--color-danger, #e74c3c)", borderBottom: "4px solid var(--color-navy)",
      padding: "0 2rem", display: "flex", justifyContent: "space-between", alignItems: "center",
      height: "70px", position: "sticky", top: 0, zIndex: 30,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        {/* Sidebar Toggle */}
        <button onClick={toggleSidebar} className="btn-brutal" style={{
          padding: "0.5rem", background: "var(--color-white)", border: "2px solid var(--color-navy)",
          borderRadius: "var(--radius-brutal-sm)", cursor: "pointer",
          boxShadow: "2px 2px 0px var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <PanelLeft size={20} color="var(--color-navy)" strokeWidth={2.5} />
        </button>

        {/* Notification Bell */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button onClick={() => setShowNotifications(!showNotifications)} className="btn-brutal" style={{
            padding: "0.5rem", background: "var(--color-white)", border: "2px solid var(--color-navy)",
            borderRadius: "var(--radius-brutal-sm)", cursor: "pointer",
            boxShadow: "2px 2px 0px var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Bell size={20} strokeWidth={2.5} color="var(--color-navy)" />
          </button>
          {hasNewNotifications && (
            <div style={{ position: "absolute", top: "-4px", right: "-4px", width: "12px", height: "12px", background: "var(--color-lime)", border: "2px solid var(--color-navy)", borderRadius: "50%", zIndex: 10 }}></div>
          )}

          {showNotifications && (
            <div className="animate-bounce-in" style={{
              position: "absolute", top: "calc(100% + 0.75rem)", left: 0, width: "320px",
              background: "var(--color-white)", border: "3px solid var(--color-navy)",
              borderRadius: "var(--radius-brutal-sm)", boxShadow: "6px 6px 0px var(--color-navy)",
              zIndex: 50, transformOrigin: "top left"
            }}>
              <div style={{ padding: "1rem", borderBottom: "2px solid var(--color-navy)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--color-danger, #e74c3c)" }}>
                <span style={{ fontWeight: 900, fontSize: "0.9rem", color: "var(--color-white)" }}>Log Sistem</span>
                {hasNewNotifications && (
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-white)", background: "rgba(255,255,255,0.25)", padding: "0.1rem 0.4rem", borderRadius: "100px" }}>3 Baru</span>
                )}
              </div>
              <div style={{ maxHeight: "260px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
                {[
                  { title: "Signup Baru", desc: "rizky.a@outlook.com baru saja mendaftar.", time: "2 menit lalu" },
                  { title: "API Warning ⚠️", desc: "Chatbot timeout 3x berturut-turut.", time: "15 menit lalu" },
                  { title: "Password Reset", desc: "Attempt brute-force terdeteksi dari IP asing.", time: "1 jam lalu" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "0.85rem 1rem", borderBottom: "1px solid rgba(0,0,0,0.1)", display: "flex", gap: "0.75rem", background: hasNewNotifications ? "rgba(231,76,60,0.05)" : "transparent" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: hasNewNotifications ? "var(--color-danger, #e74c3c)" : "transparent", marginTop: "0.4rem", flexShrink: 0 }}></div>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-navy)", marginBottom: "0.15rem" }}>{item.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>{item.desc}</div>
                      <div style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", marginTop: "0.25rem", fontWeight: 700 }}>{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setHasNewNotifications(false)} disabled={!hasNewNotifications} style={{
                display: "block", width: "100%", textAlign: "center", padding: "0.75rem",
                border: "none", borderTop: "2px solid var(--color-navy)",
                fontSize: "0.75rem", fontWeight: 800, color: hasNewNotifications ? "var(--color-navy)" : "var(--color-text-muted)",
                background: "rgba(0,0,0,0.02)", cursor: hasNewNotifications ? "pointer" : "default", fontFamily: "inherit"
              }}>
                {hasNewNotifications ? "Tandai sudah dibaca" : "Semua sudah dibaca"}
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        <div style={{ position: "relative", width: "280px" }}>
          <Search size={18} color="var(--color-text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text" placeholder="Cari user, modul..."
            className="input-brutal"
            style={{
              width: "100%", padding: "0.6rem 1rem 0.6rem 2.5rem", fontSize: "0.875rem",
              background: "var(--color-white)", border: "2px solid var(--color-navy)",
              borderRadius: "var(--radius-brutal-sm)",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        {/* Date */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-white)", fontSize: "0.85rem", fontWeight: 700 }}>
          <Calendar size={16} strokeWidth={2.5} />
          {today}
        </div>

        {/* Admin Badge */}
        <div style={{
          padding: "0.35rem 0.85rem", background: "var(--color-navy)", color: "var(--color-lime)",
          borderRadius: "100px", border: "2px solid var(--color-white)", fontWeight: 800, fontSize: "0.75rem",
          display: "flex", alignItems: "center", gap: "0.4rem",
        }}>
          <ShieldCheck size={14} /> Administrator
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <div onClick={() => setShowProfileMenu(!showProfileMenu)} style={{
            display: "flex", alignItems: "center", gap: "0.75rem", padding: "0 0.35rem 0 1rem", height: "48px", boxSizing: "border-box",
            background: showProfileMenu ? "var(--color-navy)" : "var(--color-white)",
            border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
            boxShadow: showProfileMenu ? "none" : "3px 3px 0px var(--color-navy)",
            transform: showProfileMenu ? "translate(3px, 3px)" : "none",
            cursor: "pointer", transition: "all 0.1s ease"
          }}>
            <div style={{ textAlign: "right", color: showProfileMenu ? "var(--color-white)" : "inherit" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 800, color: showProfileMenu ? "var(--color-white)" : "var(--color-navy)", lineHeight: "1.2" }}>Admin CEAMIS</div>
              <div style={{ fontSize: "0.65rem", fontWeight: 800, color: showProfileMenu ? "var(--color-lime)" : "var(--color-text-muted)" }}>Super Admin</div>
            </div>
            <div style={{
              width: "36px", height: "36px", background: "var(--color-danger, #e74c3c)", color: "var(--color-white)",
              fontSize: "0.9rem", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "50%", border: "2px solid var(--color-navy)"
            }}>
              A
            </div>
            <ChevronDown size={16} color={showProfileMenu ? "var(--color-white)" : "var(--color-navy)"} style={{ marginRight: "0.25rem", transform: showProfileMenu ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
          </div>

          {showProfileMenu && (
            <div className="animate-bounce-in" style={{
              position: "absolute", top: "calc(100% + 0.75rem)", right: 0, width: "280px",
              background: "var(--color-white)", border: "3px solid var(--color-navy)",
              borderRadius: "var(--radius-brutal-sm)", boxShadow: "6px 6px 0px var(--color-navy)",
              zIndex: 50, padding: "1.25rem", transformOrigin: "top right"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", borderBottom: "2px solid rgba(0,0,0,0.1)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                <div style={{
                  width: "48px", height: "48px", background: "var(--color-danger, #e74c3c)", color: "var(--color-white)",
                  fontSize: "1.2rem", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: "50%", border: "2px solid var(--color-navy)"
                }}>
                  A
                </div>
                <div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-navy)", lineHeight: 1.2 }}>Admin CEAMIS</div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-text-muted)" }}>admin@ceamis.com</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <Link href="/auth" onClick={() => setShowProfileMenu(false)} style={{ textDecoration: "none" }}>
                  <div className="btn-brutal" style={{
                    padding: "0.75rem", background: "var(--color-danger, #e74c3c)", border: "2px solid var(--color-navy)",
                    borderRadius: "var(--radius-brutal-sm)", display: "flex", alignItems: "center", gap: "0.6rem",
                    color: "var(--color-white)", fontWeight: 800, fontSize: "0.9rem", boxShadow: "none", cursor: "pointer"
                  }}>
                    <LogOut size={18} /> Keluar Panel
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
