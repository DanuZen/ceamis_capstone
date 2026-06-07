"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Search, Calendar, Star, Flame, Bell, ChevronDown, 
  User, LogOut, Target, Users, Zap, PanelLeft, UserPlus, X,
  Shield, Medal, Trophy
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useGuest } from "@/context/GuestContext";
import { useLanguage } from "@/context/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { getBadges } from "@/app/admin/gamification/actions";
import { translateClusterLabel } from "@/lib/translateCategory";

interface NavbarProps {
  toggleSidebar?: () => void;
  isOpen?: boolean;
}

export default function Navbar({ toggleSidebar, isOpen = true }: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const [allBadges, setAllBadges] = useState<any[]>([]);

  useEffect(() => {
    getBadges().then(data => {
      if (data && data.length > 0) setAllBadges(data);
    }).catch(console.error);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowProfileMenu(false);

    // Hapus semua data user-spesifik dari localStorage
    const keysToRemove = [
      "ceamis_role",
      "ceamis_user",
      "ceamis_transactions",
      "ceamis_budget",
      "ceamis_targets",
      "ceamis_risk_profile",
      "ceamis_debts",
      "ceamis_chat_history_v2",
      "ceamis_read_notifs_user",
    ];
    // Hapus juga progress modul edukasi (keys dinamis)
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("ceamis_module_")) {
        localStorage.removeItem(key);
      }
    });
    keysToRemove.forEach(key => localStorage.removeItem(key));

    router.push("/");
  };

  const handleSwitchAccount = async () => {
    await supabase.auth.signOut();
    setShowProfileMenu(false);

    // Hapus semua data user-spesifik dari localStorage
    const keysToRemove = [
      "ceamis_role",
      "ceamis_user",
      "ceamis_transactions",
      "ceamis_budget",
      "ceamis_targets",
      "ceamis_risk_profile",
      "ceamis_debts",
      "ceamis_chat_history_v2",
      "ceamis_read_notifs",
    ];
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("ceamis_module_")) {
        localStorage.removeItem(key);
      }
    });
    keysToRemove.forEach(key => localStorage.removeItem(key));

    router.push("/auth");
  };

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const { t, language, setLanguage } = useLanguage();
  const { userData } = useUser();
  const { isGuest } = useGuest();

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

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const isNavSearch = pathname === "/dashboard" || pathname === "/dashboard/transactions";
      if (isNavSearch && searchQuery.trim()) {
        const navPages = [
          { name: t("navbar.searchDashboard") || "Dashboard", path: "/dashboard" },
          { name: t("navbar.searchTransaction") || "Transactions", path: "/dashboard/transactions" },
          { name: t("navbar.searchHistory") || "History", path: "/dashboard/history" },
          { name: t("navbar.searchPlanning") || "Planning", path: "/dashboard/planning" },
          { name: t("navbar.searchDebt") || "Debt", path: "/dashboard/debt" },
          { name: t("navbar.searchEducation") || "Education", path: "/dashboard/education" },
          { name: t("navbar.searchChatbot") || "AI Chatbot", path: "/dashboard/chatbot" },
          { name: t("navbar.searchProfile") || "Profile", path: "/dashboard/profile" },
        ];
        const match = navPages.find(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        if (match) {
          router.push(match.path);
          setSearchQuery("");
          setIsSearchFocused(false);
          return;
        }
      }

      if (searchQuery.trim()) {
        if (isNavSearch) {
          router.push(`/dashboard/history?search=${encodeURIComponent(searchQuery)}`);
        } else {
          router.push(`${pathname}?search=${encodeURIComponent(searchQuery)}`);
        }
      } else {
        router.push(`${pathname}`);
      }
    }
  };

  const isNavSearch = pathname === "/dashboard" || pathname === "/dashboard/transactions";
  const navPages = [
    { name: language === "id" ? "Dashboard" : "Dashboard", path: "/dashboard", desc: language === "id" ? "Halaman Utama CEAMIS" : "Main Dashboard" },
    { name: language === "id" ? "Transaksi" : "Transactions", path: "/dashboard/transactions", desc: language === "id" ? "Input Pemasukan & Pengeluaran" : "Input New Transaction" },
    { name: language === "id" ? "Riwayat" : "History", path: "/dashboard/history", desc: language === "id" ? "Riwayat Transaksi & Filter" : "Transaction History" },
    { name: language === "id" ? "Perencanaan" : "Planning", path: "/dashboard/planning", desc: language === "id" ? "Atur Anggaran / Budget" : "Manage Budgeting" },
    { name: language === "id" ? "Utang & Piutang" : "Debt", path: "/dashboard/debt", desc: language === "id" ? "Catatan Utang Piutang" : "Debt Management" },
    { name: language === "id" ? "Edukasi" : "Education", path: "/dashboard/education", desc: language === "id" ? "Modul Belajar Keuangan" : "Financial Education" },
    { name: language === "id" ? "Profil" : "Profile", path: "/dashboard/profile", desc: language === "id" ? "Pengaturan Akun" : "Profile Settings" },
  ];
  const filteredNavPages = navPages.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Guest Banner */}
      {isGuest && (
        <div style={{
          background: "var(--color-navy)",
          borderBottom: "3px solid var(--color-lime)",
          padding: "0.5rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>
            {t("navbar.guestMode")}
          </span>
          <Link href="/auth/register" style={{ textDecoration: "none" }}>
            <button
              className="btn-brutal"
              style={{
                padding: "0.3rem 1rem",
                background: "var(--color-lime)",
                color: "var(--color-navy)",
                fontWeight: 800,
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                border: "2px solid var(--color-lime)",
                boxShadow: "2px 2px 0px rgba(255,255,255,0.3)",
              }}
            >
              <UserPlus size={13} /> {t("navbar.registerNow")}
            </button>
          </Link>
        </div>
      )}
      <header className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Sidebar Toggle */}
          {toggleSidebar && (
            <button 
              onClick={toggleSidebar}
              className="btn-brutal" 
              style={{ 
                width: "42px", height: "42px", padding: 0, 
                borderRadius: "var(--radius-brutal-sm)", 
                background: isOpen ? "var(--color-white)" : "var(--color-navy)", 
                border: "2px solid var(--color-navy)",
                boxShadow: isOpen ? "2px 2px 0px var(--color-navy)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                color: isOpen ? "var(--color-navy)" : "var(--color-white)"
              }}
              title="Toggle Sidebar"
            >
              <PanelLeft size={20} strokeWidth={2.5} />
            </button>
          )}


        </div>

        {/* Global Search */}
        {!pathname.includes("chatbot") && (
          <div className="navbar-search" style={{ position: "relative", width: "300px" }}>
            <Search size={18} color="var(--color-text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder={
                isNavSearch ? (language === "id" ? "Apa yang kamu cari?" : "What are you looking for?") :
                pathname.includes("quiz") ? t("navbar.searchQuiz") :
                pathname.includes("education") ? t("navbar.searchEducation") :
                pathname.includes("planning") ? t("navbar.searchPlanning") :
                pathname.includes("debt") ? t("navbar.searchDebt") :
                pathname.includes("history") ? t("navbar.searchHistory") :
                pathname.includes("reports") ? t("navbar.searchReports") :
                pathname.includes("warnings") ? t("navbar.searchWarnings") :
                pathname.includes("gamification") ? t("navbar.searchGamification") :
                pathname.includes("profile") ? t("navbar.searchProfile") :
                t("navbar.searchDefault")
              }
              className="input-brutal"
              style={{ 
                width: "100%", 
                padding: "0.6rem 2.5rem 0.6rem 2.5rem", 
                fontSize: "0.875rem",
                background: "var(--color-white)",
                border: "2px solid var(--color-navy)",
                borderRadius: "var(--radius-brutal-sm)",
                transition: "all 0.2s ease",
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
            {isNavSearch && isSearchFocused && searchQuery && (
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
                  <div style={{ padding: "1rem", fontSize: "0.85rem", color: "var(--color-text-muted)", textAlign: "center", fontWeight: 600 }}>
                    {language === "id" ? "Tidak ada halaman yang cocok." : "No pages found."}
                  </div>
                )}
                {searchQuery.trim() && (
                  <div 
                    onClick={() => {
                      router.push(`/dashboard/history?search=${encodeURIComponent(searchQuery)}`);
                      setSearchQuery("");
                      setIsSearchFocused(false);
                    }}
                    style={{
                      padding: "0.75rem 1rem", borderTop: "2px dashed rgba(0,0,0,0.1)",
                      cursor: "pointer", display: "flex", flexDirection: "column", gap: "0.25rem",
                      background: "var(--color-lime)", transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-bg)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-lime)"}
                  >
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--color-navy)" }}>
                      <Search size={14} style={{ display: "inline", marginRight: "0.5rem", verticalAlign: "middle" }} />
                      {language === "id" ? `Cari "${searchQuery}" di Riwayat` : `Search "${searchQuery}" in History`}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {/* Date Display */}
        <div className="navbar-date" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-navy)", fontSize: "0.85rem", fontWeight: 700 }}>
          <Calendar size={16} strokeWidth={2.5} />
          {today}
        </div>

        <div className="navbar__actions" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {/* Language Switcher */}
          <button 
            onClick={() => setLanguage(language === "id" ? "en" : "id")} 
            className="btn-brutal navbar-language"
            style={{ 
              height: "48px", padding: "0 0.85rem", fontSize: "0.85rem", fontWeight: 800, 
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
            <span>{language === "id" ? "ID" : "EN"}</span>
          </button>

          {/* User Stats Group */}
          <div className="navbar-stats" style={{ 
            display: "flex", alignItems: "center", gap: "0.75rem", padding: "0 0.85rem", height: "48px", boxSizing: "border-box",
            background: "var(--color-white)", border: "2px solid var(--color-navy)", 
            borderRadius: "var(--radius-brutal-sm)", boxShadow: "3px 3px 0px var(--color-navy)" 
          }}>
            {/* Level & Progress */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", width: "90px", paddingRight: "0.75rem", borderRight: "2px dashed rgba(0,0,0,0.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.65rem", fontWeight: 800 }}>
                <span style={{ color: "var(--color-navy)" }}>LVL {userData.level}</span>
                <span style={{ color: "var(--color-purple)" }}>{Math.round((userData.xp / (userData.level * 1000)) * 100)}%</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "var(--color-bg)", borderRadius: "100px", border: "1.5px solid var(--color-navy)", overflow: "hidden" }}>
                <div style={{ width: `${(userData.xp / (userData.level * 1000)) * 100}%`, height: "100%", background: "var(--color-purple)" }}></div>
              </div>
            </div>

            {/* Badge Count */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", fontWeight: 800, color: "var(--color-navy)", paddingRight: "0.75rem", borderRight: "2px dashed rgba(0,0,0,0.15)" }} title={`${userData.unlockedBadges?.length || 0} ${t("navbar.badgesTooltip")}`}>
              <Star size={14} color="var(--color-orange)" strokeWidth={2.5} fill="var(--color-orange)" /> {userData.unlockedBadges?.length || 0}
            </div>

            {/* Streak Indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", fontWeight: 800, color: "var(--color-navy)" }} title={`${userData.streak} ${t("navbar.streakTooltip")}`}>
              <Flame size={14} color="var(--color-danger, #e74c3c)" strokeWidth={2.5} fill="var(--color-danger, #e74c3c)" /> {userData.streak}
            </div>
          </div>

          {/* User Profile Dropdown Container */}
          <div ref={profileRef} style={{ position: "relative" }}>
            <div onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ 
              display: "flex", alignItems: "center", gap: "0.75rem", padding: "0 0.35rem 0 1rem", height: "48px", boxSizing: "border-box",
              background: showProfileMenu ? "var(--color-navy)" : "var(--color-white)", 
              border: "2px solid var(--color-navy)", 
              borderRadius: "var(--radius-brutal-sm)", 
              boxShadow: showProfileMenu ? "none" : "3px 3px 0px var(--color-navy)", 
              transform: showProfileMenu ? "translate(3px, 3px)" : "none",
              cursor: "pointer",
              transition: "all 0.1s ease"
            }}>
              <div style={{ textAlign: "right", color: showProfileMenu ? "var(--color-white)" : "inherit" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: showProfileMenu ? "var(--color-white)" : "var(--color-navy)", lineHeight: "1.2" }}>{userData.name.split(" ")[0]}</div>
                <div style={{ fontSize: "0.65rem", fontWeight: 800, color: showProfileMenu ? "var(--color-lime)" : "var(--color-text-muted)", textTransform: "capitalize" }}>{translateClusterLabel(userData.label, t)}</div>
              </div>
              <div style={{ 
                width: "36px", height: "36px", background: "var(--color-purple)", color: "var(--color-white)", 
                fontSize: "0.9rem", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", 
                borderRadius: "50%", border: "2px solid var(--color-navy)", overflow: "hidden"
              }}>
                {userData.avatarUrl ? (
                  <img src={userData.avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  userData.name.substring(0, 2).toUpperCase()
                )}
              </div>
              <ChevronDown size={16} color={showProfileMenu ? "var(--color-white)" : "var(--color-navy)"} style={{ marginRight: "0.25rem", transform: showProfileMenu ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
            </div>

            {/* Profile Popup/Dropdown Menu */}
            {showProfileMenu && (
              <div className="animate-bounce-in" style={{
                position: "absolute", top: "calc(100% + 0.75rem)", right: 0, width: "320px",
                background: "var(--color-white)", border: "3px solid var(--color-navy)",
                borderRadius: "var(--radius-brutal-sm)", boxShadow: "6px 6px 0px var(--color-navy)",
                zIndex: 50, padding: "1.25rem", transformOrigin: "top right"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", borderBottom: "2px solid rgba(0,0,0,0.1)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                  <div style={{ 
                    width: "48px", height: "48px", background: "var(--color-purple)", color: "var(--color-white)", 
                    fontSize: "1.2rem", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", 
                    borderRadius: "50%", border: "2px solid var(--color-navy)", overflow: "hidden"
                  }}>
                    {userData.avatarUrl ? (
                      <img src={userData.avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      userData.name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-navy)", lineHeight: 1.2 }}>{userData.name}</div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-text-muted)" }}>{userData.email}</div>
                  </div>
                </div>

                {/* Mini Stats inside Dropdown */}
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div style={{ flex: 1, padding: "0.75rem", background: "var(--color-bg)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)" }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--color-text-muted)", marginBottom: "0.2rem" }}>{t("navbar.expProgress")}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 900, color: "var(--color-navy)" }}>LVL {userData.level}</span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--color-purple)" }}>{userData.xp}/{userData.level * 1000} XP</span>
                    </div>
                    <div style={{ height: "8px", background: "rgba(0,0,0,0.1)", borderRadius: "100px", border: "1.5px solid var(--color-navy)", overflow: "hidden" }}>
                      <div style={{ width: `${(userData.xp / (userData.level * 1000)) * 100}%`, height: "100%", background: "var(--color-purple)" }} />
                    </div>
                  </div>
                </div>

                {/* Badges Summary */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--color-navy)" }}>{t("navbar.badgeCollection")} ({userData.unlockedBadges?.length || 0})</span>
                    <Link href="/dashboard/profile" onClick={() => setShowProfileMenu(false)} style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--color-purple)", textDecoration: "none" }}>{t("navbar.viewAll")}</Link>
                  </div>
                  <div style={{ display: "flex", gap: "0.6rem" }}>
                    {!userData.unlockedBadges || userData.unlockedBadges.length === 0 ? (
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 600, fontStyle: "italic", padding: "0.2rem 0" }}>
                        {language === "id" ? "Belum ada badge" : "No badges yet"}
                      </div>
                    ) : (
                      <>
                        {userData.unlockedBadges.slice(0, 3).map((badgeId, i) => {
                          const badgeData = allBadges.find(b => b.id === badgeId);
                          const bg = badgeData?.color || "lime";
                          
                          const ICON_MAP: Record<string, React.ElementType> = {
                            Target, Shield, Flame, Zap, Star, Medal, Trophy
                          };
                          const IconComp = badgeData?.icon ? ICON_MAP[badgeData.icon] || Star : Star;

                          return (
                            <div key={i} title={badgeData?.name || badgeId} style={{ 
                              width: "40px", height: "40px", borderRadius: "50%", background: `var(--color-${bg})`, 
                              border: "2px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center" 
                            }}>
                              <IconComp size={20} color={bg === "lime" ? "var(--color-navy)" : "var(--color-white)"} />
                            </div>
                          );
                        })}
                        {userData.unlockedBadges.length > 3 && (
                          <div style={{ 
                            width: "40px", height: "40px", borderRadius: "50%", background: "var(--color-bg)", 
                            border: "2px dashed var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.8rem", fontWeight: 800, color: "var(--color-text-muted)"
                          }}>
                            +{userData.unlockedBadges.length - 3}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Menu Links */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <Link href="/dashboard/profile" onClick={() => setShowProfileMenu(false)} style={{ textDecoration: "none" }}>
                    <div className="btn-brutal" style={{ 
                      padding: "0.75rem", background: "var(--color-bg)", border: "2px solid var(--color-navy)", 
                      borderRadius: "var(--radius-brutal-sm)", display: "flex", alignItems: "center", gap: "0.6rem",
                      color: "var(--color-navy)", fontWeight: 800, fontSize: "0.9rem", boxShadow: "none"
                    }}>
                      <User size={18} /> {t("navbar.fullProfile")}
                    </div>
                  </Link>
                  <button onClick={handleSwitchAccount} style={{ all: "unset", width: "100%", cursor: "pointer" }}>
                    <div className="btn-brutal" style={{ 
                      padding: "0.75rem", background: "var(--color-bg)", border: "2px solid var(--color-navy)", 
                      borderRadius: "var(--radius-brutal-sm)", display: "flex", alignItems: "center", gap: "0.6rem",
                      color: "var(--color-navy)", fontWeight: 800, fontSize: "0.9rem", boxShadow: "none", cursor: "pointer"
                    }}>
                      <Users size={18} /> {t("navbar.switchAccount")}
                    </div>
                  </button>
                  <div onClick={handleLogout} style={{ textDecoration: "none" }}>
                    <div className="btn-brutal" style={{ 
                      padding: "0.75rem", background: "var(--color-orange)", border: "2px solid var(--color-navy)", 
                      borderRadius: "var(--radius-brutal-sm)", display: "flex", alignItems: "center", gap: "0.6rem",
                      color: "var(--color-white)", fontWeight: 800, fontSize: "0.9rem", boxShadow: "none", cursor: "pointer",
                      marginTop: "0.5rem"
                    }}>
                      <LogOut size={18} /> {t("navbar.logout")}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
