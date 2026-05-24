"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Search, Calendar, Star, Flame, Bell, ChevronDown, 
  User, LogOut, Target, Users, Zap, PanelLeft, UserPlus
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useGuest } from "@/context/GuestContext";

interface NavbarProps {
  toggleSidebar?: () => void;
  isOpen?: boolean;
}

export default function Navbar({ toggleSidebar, isOpen = true }: NavbarProps) {
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
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const { userData } = useUser();
  const { isGuest } = useGuest();

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
            Kamu sedang dalam <strong style={{ color: "var(--color-lime)" }}>Mode Guest</strong> — beberapa fitur terkunci.
          </span>
          <Link href="/auth" style={{ textDecoration: "none" }}>
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
              <UserPlus size={13} /> Daftar Sekarang — Gratis!
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

          {/* Notification Bell */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="btn-brutal" 
              style={{ 
                width: "42px", height: "42px", padding: 0, 
                borderRadius: "var(--radius-brutal-sm)", 
                background: showNotifications ? "var(--color-navy)" : "var(--color-white)", 
                border: "2px solid var(--color-navy)",
                boxShadow: showNotifications ? "none" : "2px 2px 0px var(--color-navy)", 
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                transition: "all 0.1s ease",
                transform: showNotifications ? "translate(2px, 2px)" : "none",
                color: showNotifications ? "var(--color-white)" : "var(--color-navy)"
              }}
            >
              <Bell size={20} strokeWidth={2.5} />
            </button>
            {/* Notification badge dot */}
            {hasNewNotifications && (
              <div style={{
                position: "absolute", top: "-4px", right: "-4px", width: "12px", height: "12px",
                background: "var(--color-danger, #e74c3c)", border: "2px solid var(--color-navy)",
                borderRadius: "50%", zIndex: 10
              }}></div>
            )}

            {/* Notification Popup */}
            {showNotifications && (
              <div className="animate-bounce-in" style={{
                position: "absolute", top: "calc(100% + 0.75rem)", left: 0, width: "340px",
                background: "var(--color-white)", border: "3px solid var(--color-navy)",
                borderRadius: "var(--radius-brutal-sm)", boxShadow: "6px 6px 0px var(--color-navy)",
                zIndex: 50, padding: "0", overflow: "hidden", transformOrigin: "top left"
              }}>
                <div style={{ padding: "1rem", borderBottom: "2px solid var(--color-navy)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--color-lime)" }}>
                  <span style={{ fontWeight: 900, fontSize: "0.9rem", color: "var(--color-navy)" }}>Notifikasi</span>
                  {hasNewNotifications && (
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-navy)", background: "rgba(255,255,255,0.5)", padding: "0.1rem 0.4rem", borderRadius: "100px" }}>2 Baru</span>
                  )}
                </div>
                
                <div style={{ maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
                  {/* Item 1 */}
                  <div style={{ padding: "1rem", borderBottom: "1px solid rgba(0,0,0,0.1)", display: "flex", gap: "0.75rem", background: hasNewNotifications ? "rgba(88, 51, 238, 0.05)" : "transparent" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: hasNewNotifications ? "var(--color-purple)" : "transparent", marginTop: "0.4rem", flexShrink: 0 }}></div>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-navy)", marginBottom: "0.2rem" }}>Peringatan Pengeluaran ⚠️</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>Pengeluaran jajan kamu melebihi batas mingguan!</div>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--color-text-light)", marginTop: "0.4rem" }}>Barusan</div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div style={{ padding: "1rem", borderBottom: "1px solid rgba(0,0,0,0.1)", display: "flex", gap: "0.75rem", background: hasNewNotifications ? "rgba(88, 51, 238, 0.05)" : "transparent" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: hasNewNotifications ? "var(--color-purple)" : "transparent", marginTop: "0.4rem", flexShrink: 0 }}></div>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-navy)", marginBottom: "0.2rem" }}>Target Tercapai! 🎉</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>Tabungan liburan kamu sudah mencapai target.</div>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--color-text-light)", marginTop: "0.4rem" }}>2 jam lalu</div>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div style={{ padding: "1rem", display: "flex", gap: "0.75rem" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "transparent", marginTop: "0.4rem", flexShrink: 0 }}></div>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-navy)", marginBottom: "0.2rem" }}>Tips Hemat 💡</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>Coba bawa bekal besok untuk menghemat Rp 50.000.</div>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--color-text-light)", marginTop: "0.4rem" }}>Kemarin</div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setHasNewNotifications(false)} 
                  disabled={!hasNewNotifications}
                  style={{ 
                    display: "block", width: "100%", textAlign: "center", padding: "0.75rem", 
                    border: "none", borderTop: "2px solid var(--color-navy)", 
                    fontSize: "0.75rem", fontWeight: 800, color: hasNewNotifications ? "var(--color-navy)" : "var(--color-text-muted)", 
                    background: "rgba(0,0,0,0.02)", cursor: hasNewNotifications ? "pointer" : "default", fontFamily: "inherit"
                  }}
                >
                  {hasNewNotifications ? "Tandai sudah dibaca" : "Semua sudah dibaca"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Global Search */}
        <div style={{ position: "relative", width: "300px" }}>
          <Search size={18} color="var(--color-text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Cari transaksi..." 
            className="input-brutal"
            style={{ 
              width: "100%", 
              padding: "0.6rem 1rem 0.6rem 2.5rem", 
              fontSize: "0.875rem",
              background: "var(--color-white)",
              border: "2px solid var(--color-navy)",
              borderRadius: "var(--radius-brutal-sm)",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = "3px 3px 0px var(--color-navy)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {/* Date Display */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-navy)", fontSize: "0.85rem", fontWeight: 700 }}>
          <Calendar size={16} strokeWidth={2.5} />
          {today}
        </div>

        <div className="navbar__actions" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {/* User Stats Group */}
          <div style={{ 
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
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", fontWeight: 800, color: "var(--color-navy)", paddingRight: "0.75rem", borderRight: "2px dashed rgba(0,0,0,0.15)" }} title={`${userData.unlockedBadges?.length || 0} Badge Diraih`}>
              <Star size={14} color="var(--color-orange)" strokeWidth={2.5} fill="var(--color-orange)" /> {userData.unlockedBadges?.length || 0}
            </div>

            {/* Streak Indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", fontWeight: 800, color: "var(--color-navy)" }} title={`${userData.streak} Hari Streak`}>
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
                <div style={{ fontSize: "0.65rem", fontWeight: 800, color: showProfileMenu ? "var(--color-lime)" : "var(--color-text-muted)" }}>{userData.label}</div>
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
                    <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--color-text-muted)", marginBottom: "0.2rem" }}>EXP Progress</div>
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
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--color-navy)" }}>Koleksi Badge ({userData.unlockedBadges?.length || 0})</span>
                    <Link href="/dashboard/profile" onClick={() => setShowProfileMenu(false)} style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--color-purple)", textDecoration: "none" }}>Lihat Semua</Link>
                  </div>
                  <div style={{ display: "flex", gap: "0.6rem" }}>
                    {[
                      { icon: Target, bg: "lime" }, 
                      { icon: Flame, bg: "orange" }, 
                      { icon: Zap, bg: "purple" }
                    ].map((badge, i) => (
                      <div key={i} style={{ 
                        width: "40px", height: "40px", borderRadius: "50%", background: `var(--color-${badge.bg})`, 
                        border: "2px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center" 
                      }}>
                        <badge.icon size={20} color="var(--color-navy)" />
                      </div>
                    ))}
                    {userData.unlockedBadges && userData.unlockedBadges.length > 3 && (
                      <div style={{ 
                        width: "40px", height: "40px", borderRadius: "50%", background: "var(--color-bg)", 
                        border: "2px dashed var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.8rem", fontWeight: 800, color: "var(--color-text-muted)"
                      }}>
                        +{userData.unlockedBadges.length - 3}
                      </div>
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
                      <User size={18} /> Profil Lengkap
                    </div>
                  </Link>
                  <Link href="/auth" onClick={() => setShowProfileMenu(false)} style={{ textDecoration: "none" }}>
                    <div className="btn-brutal" style={{ 
                      padding: "0.75rem", background: "var(--color-bg)", border: "2px solid var(--color-navy)", 
                      borderRadius: "var(--radius-brutal-sm)", display: "flex", alignItems: "center", gap: "0.6rem",
                      color: "var(--color-navy)", fontWeight: 800, fontSize: "0.9rem", boxShadow: "none", cursor: "pointer"
                    }}>
                      <Users size={18} /> Ganti Akun
                    </div>
                  </Link>
                  <Link href="/auth" onClick={() => setShowProfileMenu(false)} style={{ textDecoration: "none" }}>
                    <div className="btn-brutal" style={{ 
                      padding: "0.75rem", background: "var(--color-orange)", border: "2px solid var(--color-navy)", 
                      borderRadius: "var(--radius-brutal-sm)", display: "flex", alignItems: "center", gap: "0.6rem",
                      color: "var(--color-white)", fontWeight: 800, fontSize: "0.9rem", boxShadow: "none", cursor: "pointer",
                      marginTop: "0.5rem"
                    }}>
                      <LogOut size={18} /> Keluar Akun
                    </div>
                  </Link>
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
