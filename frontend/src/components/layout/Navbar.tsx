"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Calendar, Bell, User, LogOut, Users, UserPlus,
  Target, Shield, Flame, Zap, Star, Medal, Trophy
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useGuest } from "@/context/GuestContext";
import { useLanguage } from "@/context/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { getBadges } from "@/app/admin/gamification/actions";

interface NavbarProps {
  toggleSidebar?: () => void;
  isOpen?: boolean;
}

export default function Navbar({ toggleSidebar, isOpen = true }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { userData } = useUser();
  const { isGuest } = useGuest();
  const { t, language } = useLanguage();
  const supabase = createClient();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [allBadges, setAllBadges] = useState<any[]>([]);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getBadges()
      .then((data) => {
        if (data && data.length > 0) setAllBadges(data);
      })
      .catch(console.error);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowProfileMenu(false);

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
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("ceamis_module_")) {
        localStorage.removeItem(key);
      }
    });
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    router.push("/");
  };

  const handleSwitchAccount = async () => {
    await supabase.auth.signOut();
    setShowProfileMenu(false);
    router.push("/auth");
  };

  // Determine user display name
  const rawName = userData?.name && userData.name !== "User" ? userData.name : "Danu Pratama";
  const firstName = rawName.split(" ")[0] || "Danu";

  return (
    <>
      {/* Guest Mode Notice Banner */}
      {isGuest && (
        <div
          style={{
            background: "var(--color-navy)",
            borderBottom: "2px solid var(--color-lime)",
            padding: "0.4rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            zIndex: 950,
          }}
        >
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
            Mode Tamu — Data disimpan secara lokal di browser Anda.
          </span>
          <Link href="/auth/register" style={{ textDecoration: "none" }}>
            <button
              className="btn-brutal"
              style={{
                padding: "0.25rem 0.8rem",
                background: "var(--color-lime)",
                color: "var(--color-navy)",
                fontWeight: 900,
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                border: "1.5px solid var(--color-navy)",
                boxShadow: "2px 2px 0px rgba(0,0,0,0.3)",
              }}
            >
              <UserPlus size={13} strokeWidth={2.5} /> Daftar Akun
            </button>
          </Link>
        </div>
      )}

      {/* Top Header Row (Seamless/Transparent) */}
      <header
        className="navbar"
        style={{
          background: "transparent",
          borderBottom: "none",
          border: "none",
          boxShadow: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 2rem 0.25rem 2rem",
          position: "relative",
          zIndex: 900,
          height: "auto",
        }}
      >
        {/* Left: Calendar Pill */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div
            style={{
              background: "#FFFFFF",
              border: "2px solid var(--color-navy)",
              borderRadius: "10px",
              boxShadow: "2px 2px 0px var(--color-navy)",
              padding: "0.35rem 0.8rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.85rem",
              fontWeight: 800,
              color: "var(--color-navy)",
            }}
          >
            <Calendar size={16} strokeWidth={2.5} />
            <span>September 2026</span>
          </div>
        </div>

        {/* Right: Notification Bell (3) | Profile Pill (Danu Pratama [PRO USER] Avatar) */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          {/* Bell Notification */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              aria-label="Notifikasi"
              style={{
                background: "#FFFFFF",
                border: "2px solid var(--color-navy)",
                borderRadius: "12px",
                boxShadow: "2px 2px 0px var(--color-navy)",
                padding: "0.45rem 0.65rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.15s ease",
              }}
            >
              <Bell size={20} strokeWidth={2.5} color="var(--color-navy)" />
              {/* Red Badge 3 */}
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "#EF4444",
                  color: "#FFFFFF",
                  fontSize: "0.65rem",
                  fontWeight: 900,
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  border: "1.5px solid var(--color-navy)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
              >
                3
              </span>
            </button>

            {/* Notification Dropdown Menu */}
            {showNotifMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 0.6rem)",
                  right: 0,
                  width: "310px",
                  background: "#FFFFFF",
                  border: "2.5px solid var(--color-navy)",
                  borderRadius: "14px",
                  boxShadow: "4px 4px 0px var(--color-navy)",
                  padding: "1rem",
                  zIndex: 100,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1.5px solid #E2E8F0",
                    paddingBottom: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span style={{ fontWeight: 900, fontSize: "0.85rem", color: "var(--color-navy)" }}>
                    Pemberitahuan (3)
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 700, cursor: "pointer" }}>
                    Tandai sudah dibaca
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <div
                    style={{
                      padding: "0.6rem",
                      background: "#F0FDF4",
                      border: "1.5px solid var(--color-navy)",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--color-navy)",
                    }}
                  >
                    Kas surplus +28% bulan ini! Pengelolaan keuangan kamu sangat sehat.
                  </div>
                  <div
                    style={{
                      padding: "0.6rem",
                      background: "#FEFCE8",
                      border: "1.5px solid var(--color-navy)",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--color-navy)",
                    }}
                  >
                    Aturan 24 Jam Anti-FOMO sedang aktif untuk pembelian di atas Rp 200rb.
                  </div>
                  <div
                    style={{
                      padding: "0.6rem",
                      background: "#F8FAFC",
                      border: "1.5px solid #CBD5E1",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#475569",
                    }}
                  >
                    Gaji Pokok PT Teknologi Rp 5.200.000 telah berhasil dicatat.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Vertical Divider | */}
          <div
            style={{
              width: "2px",
              height: "28px",
              background: "var(--color-navy)",
              opacity: 0.25,
              margin: "0 0.15rem",
            }}
          />

          {/* User Profile Pill */}
          <div ref={profileRef} style={{ position: "relative" }}>
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                background: "#FFFFFF",
                border: "2px solid var(--color-navy)",
                borderRadius: "12px",
                boxShadow: "2px 2px 0px var(--color-navy)",
                padding: "0.3rem 0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                cursor: "pointer",
                userSelect: "none",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    color: "var(--color-navy)",
                    lineHeight: 1.1,
                  }}
                >
                  {rawName}
                </span>
                <span
                  style={{
                    background: "var(--color-lime)",
                    color: "var(--color-navy)",
                    fontSize: "0.6rem",
                    fontWeight: 900,
                    padding: "1px 6px",
                    borderRadius: "4px",
                    border: "1px solid var(--color-navy)",
                    marginTop: "3px",
                    letterSpacing: "0.5px",
                  }}
                >
                  PRO USER
                </span>
              </div>

              {/* Green Avatar Circle */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "#4ADE80",
                  borderRadius: "50%",
                  border: "2px solid var(--color-navy)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-navy)",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {userData?.avatarUrl ? (
                  <img
                    src={userData.avatarUrl}
                    alt="avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <User size={18} strokeWidth={2.5} />
                )}
              </div>
            </div>

            {/* Profile Popup Menu */}
            {showProfileMenu && (
              <div
                className="animate-bounce-in"
                style={{
                  position: "absolute",
                  top: "calc(100% + 0.65rem)",
                  right: 0,
                  width: "320px",
                  background: "var(--color-white)",
                  border: "2.5px solid var(--color-navy)",
                  borderRadius: "16px",
                  boxShadow: "5px 5px 0px var(--color-navy)",
                  padding: "1.25rem",
                  zIndex: 100,
                  transformOrigin: "top right",
                }}
              >
                {/* User Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", borderBottom: "2px solid rgba(0,0,0,0.1)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      background: "var(--color-blue)",
                      color: "var(--color-white)",
                      fontSize: "1.2rem",
                      fontWeight: 900,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      border: "2px solid var(--color-navy)",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {userData?.avatarUrl ? (
                      <img src={userData.avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      rawName.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-navy)", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {userData?.name || rawName}
                    </div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {userData?.email || "danu.pratama@example.com"}
                    </div>
                  </div>
                </div>

                {/* Mini Stats inside Dropdown */}
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div style={{ flex: 1, padding: "0.75rem", background: "var(--color-bg)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)" }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--color-text-muted)", marginBottom: "0.2rem" }}>
                      {t("navbar.expProgress")}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 900, color: "var(--color-navy)" }}>
                        LVL {userData?.level || 1}
                      </span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--color-blue)" }}>
                        {userData?.xp || 250}/{(userData?.level || 1) * 1000} XP
                      </span>
                    </div>
                    <div style={{ height: "8px", background: "rgba(0,0,0,0.1)", borderRadius: "100px", border: "1.5px solid var(--color-navy)", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${Math.min(100, Math.max(10, ((userData?.xp || 250) / ((userData?.level || 1) * 1000)) * 100))}%`,
                          height: "100%",
                          background: "var(--color-blue)",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Badges Summary */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--color-navy)" }}>
                      {t("navbar.badgeCollection")} ({userData?.unlockedBadges?.length || 0})
                    </span>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setShowProfileMenu(false)}
                      style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--color-blue)", textDecoration: "none" }}
                    >
                      {t("navbar.viewAll")}
                    </Link>
                  </div>
                  <div style={{ display: "flex", gap: "0.6rem" }}>
                    {!userData?.unlockedBadges || userData.unlockedBadges.length === 0 ? (
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 600, fontStyle: "italic", padding: "0.2rem 0" }}>
                        {language === "id" ? "Belum ada badge" : "No badges yet"}
                      </div>
                    ) : (
                      <>
                        {userData.unlockedBadges.slice(0, 3).map((badgeId, i) => {
                          const badgeData = allBadges.find((b) => b.id === badgeId);
                          const bg = badgeData?.color || "lime";

                          const ICON_MAP: Record<string, React.ElementType> = {
                            Target, Shield, Flame, Zap, Star, Medal, Trophy
                          };
                          const IconComp = badgeData?.icon ? ICON_MAP[badgeData.icon] || Star : Star;

                          return (
                            <div
                              key={i}
                              title={badgeData?.name || badgeId}
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                background: `var(--color-${bg})`,
                                border: "2px solid var(--color-navy)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <IconComp size={20} color={bg === "lime" ? "var(--color-navy)" : "var(--color-white)"} />
                            </div>
                          );
                        })}
                        {userData.unlockedBadges.length > 3 && (
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background: "var(--color-bg)",
                              border: "2px dashed var(--color-navy)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.8rem",
                              fontWeight: 800,
                              color: "var(--color-text-muted)",
                            }}
                          >
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
                    <div
                      className="btn-brutal"
                      style={{
                        padding: "0.75rem",
                        background: "var(--color-bg)",
                        border: "2px solid var(--color-navy)",
                        borderRadius: "var(--radius-brutal-sm)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        color: "var(--color-navy)",
                        fontWeight: 800,
                        fontSize: "0.9rem",
                        boxShadow: "none",
                      }}
                    >
                      <User size={18} /> {t("navbar.fullProfile")}
                    </div>
                  </Link>
                  <button onClick={handleSwitchAccount} style={{ all: "unset", width: "100%", cursor: "pointer" }}>
                    <div
                      className="btn-brutal"
                      style={{
                        padding: "0.75rem",
                        background: "var(--color-bg)",
                        border: "2px solid var(--color-navy)",
                        borderRadius: "var(--radius-brutal-sm)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        color: "var(--color-navy)",
                        fontWeight: 800,
                        fontSize: "0.9rem",
                        boxShadow: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Users size={18} /> {t("navbar.switchAccount")}
                    </div>
                  </button>
                  <div onClick={handleLogout} style={{ textDecoration: "none" }}>
                    <div
                      className="btn-brutal"
                      style={{
                        padding: "0.75rem",
                        background: "var(--color-orange)",
                        border: "2px solid var(--color-navy)",
                        borderRadius: "var(--radius-brutal-sm)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        color: "var(--color-white)",
                        fontWeight: 800,
                        fontSize: "0.9rem",
                        boxShadow: "none",
                        cursor: "pointer",
                        marginTop: "0.5rem",
                      }}
                    >
                      <LogOut size={18} /> {t("navbar.logout")}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
