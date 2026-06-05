"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Calendar, Bell, ChevronDown, LogOut, Globe, PanelLeft, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

interface AdminNavbarProps {
  toggleSidebar?: () => void;
  isOpen?: boolean;
}

export default function AdminNavbar({ toggleSidebar, isOpen = true }: AdminNavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const { t, language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

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

  // Persist read state per-role
  useEffect(() => {
    const hasRead = localStorage.getItem("ceamis_read_notifs_admin");
    if (!hasRead) {
      setHasNewNotifications(true);
    }
  }, []);

  const markNotifsRead = () => {
    setHasNewNotifications(false);
    localStorage.setItem("ceamis_read_notifs_admin", "true");
  };

  // Language-aware date with English ordinal
  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const today = (() => {
    const d = new Date();
    if (language === "en") {
      const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
      const day = getOrdinal(d.getDate());
      const month = d.toLocaleDateString("en-US", { month: "long" });
      const year = d.getFullYear();
      return `${weekday}, ${day} ${month} ${year}`;
    }
    return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  })();

  const notifItems = [
    { title: t("admin.navbar.new") + " Signup", desc: "rizky.a@outlook.com just registered.", time: "2 minutes ago" },
    { title: "API Warning ⚠️", desc: "Chatbot timed out 3 times in a row.", time: "15 minutes ago" },
    { title: "Password Reset", desc: "Brute-force attempt detected from unknown IP.", time: "1 hour ago" },
  ];

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchQuery.trim()) {
        const match = filteredNavPages.find(p => p.name.toLowerCase() === searchQuery.toLowerCase() || p.desc.toLowerCase() === searchQuery.toLowerCase());
        if (match) {
          router.push(match.path);
          setSearchQuery("");
          setIsSearchFocused(false);
          return;
        }
        // General search route for admin if applicable, otherwise do nothing
      }
    }
  };

  const navPages = [
    { name: t("admin.navbar.searchDashboard") || "Dashboard", path: "/admin/dashboard", desc: t("admin.sidebar.groups.overview") },
    { name: t("admin.navbar.searchEducation") || "Modul Edukasi", path: "/admin/education", desc: t("admin.sidebar.groups.management") },
    { name: t("admin.navbar.searchQuizzes") || "Kuis Edukasi", path: "/admin/quizzes", desc: t("admin.sidebar.groups.management") },
    { name: t("admin.navbar.searchGamification") || "Gamifikasi", path: "/admin/gamification", desc: t("admin.sidebar.groups.management") },
  ];

  const filteredNavPages = navPages.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <span style={{ fontWeight: 900, fontSize: "0.9rem", color: "var(--color-white)" }}>{t("admin.navbar.systemLog")}</span>
                {hasNewNotifications && (
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-white)", background: "rgba(255,255,255,0.25)", padding: "0.1rem 0.4rem", borderRadius: "100px" }}>3 {t("admin.navbar.new")}</span>
                )}
              </div>
              <div style={{ maxHeight: "260px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
                {notifItems.map((item, i) => (
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
              <button onClick={markNotifsRead} disabled={!hasNewNotifications} style={{
                display: "block", width: "100%", textAlign: "center", padding: "0.75rem",
                border: "none", borderTop: "2px solid var(--color-navy)",
                fontSize: "0.75rem", fontWeight: 800, color: hasNewNotifications ? "var(--color-navy)" : "var(--color-text-muted)",
                background: "rgba(0,0,0,0.02)", cursor: hasNewNotifications ? "pointer" : "default", fontFamily: "inherit"
              }}>
                {hasNewNotifications ? t("admin.navbar.markRead") : t("admin.navbar.allRead")}
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        <div style={{ position: "relative", width: "280px" }}>
          <Search size={18} color="var(--color-text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text" 
            placeholder={t("admin.navbar.searchPlaceholder") || "Cari di admin..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="input-brutal"
            style={{
              width: "100%", padding: "0.6rem 2.5rem 0.6rem 2.5rem", fontSize: "0.875rem",
              background: "var(--color-white)", border: "2px solid var(--color-navy)",
              borderRadius: "var(--radius-brutal-sm)",
              transition: "all 0.2s ease"
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = "3px 3px 0px var(--color-navy)";
              setIsSearchFocused(true);
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "none";
              setTimeout(() => setIsSearchFocused(false), 200);
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery("");
                router.push(pathname);
              }}
              style={{ 
                position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", 
                background: "transparent", border: "none", cursor: "pointer", 
                display: "flex", alignItems: "center", justifyContent: "center", 
                padding: "0.2rem", borderRadius: "50%", color: "var(--color-text-muted)" 
              }}
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          )}
          
          {/* Navigation Suggestions */}
          {isSearchFocused && searchQuery && (
            <div style={{
              position: "absolute", top: "calc(100% + 0.5rem)", left: 0, width: "100%",
              background: "var(--color-white)", border: "2px solid var(--color-navy)",
              borderRadius: "var(--radius-brutal-sm)", boxShadow: "4px 4px 0px var(--color-navy)",
              zIndex: 50, maxHeight: "300px", overflowY: "auto"
            }}>
              {filteredNavPages.map((page, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    router.push(page.path);
                    setSearchQuery("");
                    setIsSearchFocused(false);
                  }}
                  style={{
                    padding: "0.75rem 1rem", borderBottom: i === filteredNavPages.length - 1 ? "none" : "1px solid rgba(0,0,0,0.1)",
                    cursor: "pointer", display: "flex", flexDirection: "column", gap: "0.25rem",
                    background: "transparent", transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--color-navy)" }}>{page.name}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 600 }}>{page.desc}</span>
                </div>
              ))}
              {filteredNavPages.length === 0 && (
                <div style={{ padding: "1rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.85rem", fontWeight: 600 }}>
                  {t("admin.navbar.searchNoResult")}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        {/* Date */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-white)", fontSize: "0.85rem", fontWeight: 700 }}>
          <Calendar size={16} strokeWidth={2.5} />
          {today}
        </div>

        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === "id" ? "en" : "id")}
          className="btn-brutal"
          style={{
            height: "42px", padding: "0 0.85rem", fontSize: "0.85rem", fontWeight: 800,
            background: "var(--color-white)", border: "2px solid var(--color-navy)",
            boxShadow: "3px 3px 0px var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem",
            borderRadius: "var(--radius-brutal-sm)", cursor: "pointer", justifyContent: "center", boxSizing: "border-box"
          }}
        >
          <img
            src={language === "id" ? "https://flagcdn.com/w20/id.png" : "https://flagcdn.com/w20/gb.png"}
            alt={language === "id" ? "Indonesian Flag" : "English Flag"}
            style={{ width: "20px", height: "auto", borderRadius: "2px", border: "1px solid rgba(0,0,0,0.1)" }}
          />
          <span style={{ color: "var(--color-navy)" }}>{language === "id" ? "ID" : "EN"}</span>
        </button>

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
                <Link href="/" onClick={() => setShowProfileMenu(false)} style={{ textDecoration: "none" }}>
                  <div className="btn-brutal" style={{
                    padding: "0.75rem", background: "var(--color-danger, #e74c3c)", border: "2px solid var(--color-navy)",
                    borderRadius: "var(--radius-brutal-sm)", display: "flex", alignItems: "center", gap: "0.6rem",
                    color: "var(--color-white)", fontWeight: 800, fontSize: "0.9rem", boxShadow: "none", cursor: "pointer"
                  }}>
                    <LogOut size={18} /> {t("admin.navbar.logout")}
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
