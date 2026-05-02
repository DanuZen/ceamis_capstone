"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  Trophy, 
  AlertTriangle, 
  Bot, 
  BookOpen,
  LogOut,
  Home
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "purple" },
  { href: "/dashboard/transactions", label: "Transaksi", icon: Wallet, color: "lime" },
  { href: "/dashboard/history", label: "Riwayat", icon: History, color: "orange" },
  { href: "/dashboard/gamification", label: "Gamifikasi", icon: Trophy, color: "purple" },
  { href: "/dashboard/warnings", label: "Warning System", icon: AlertTriangle, color: "pink" },
  { href: "/dashboard/chatbot", label: "Chatbot AI", icon: Bot, color: "lime" },
  { href: "/dashboard/education", label: "Edukasi", icon: BookOpen, color: "orange" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar__logo" style={{ padding: "2rem 1.5rem 1rem 1.5rem" }}>
        <div style={{
          width: "52px",
          height: "52px",
          background: "var(--color-lime)",
          borderRadius: "var(--radius-brutal-sm)",
          border: "3px solid var(--color-navy)",
          boxShadow: "4px 4px 0px var(--color-white)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-heading)",
          fontWeight: 900,
          fontSize: "1.75rem",
          color: "var(--color-navy)",
          transform: "rotate(-3deg)"
        }}>
          C
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "1.5rem", fontWeight: 900, letterSpacing: "2px", color: "var(--color-white)", lineHeight: 1 }}>CEAMIS</span>
          <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "var(--color-lime)", letterSpacing: "1px", marginTop: "0.25rem" }}>FINANCE ENGINE</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav" style={{ padding: "1rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ fontSize: "0.7rem", fontWeight: 900, color: "rgba(255,255,255,0.3)", letterSpacing: "2px", padding: "0 1.25rem", marginBottom: "0.5rem" }}>MENU UTAMA</div>
        
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
              style={{
                background: isActive ? `var(--color-${item.color})` : "transparent",
                color: isActive ? "var(--color-navy)" : "rgba(255,255,255,0.7)",
                border: isActive ? "2px solid var(--color-navy)" : "2px solid transparent",
                boxShadow: isActive ? "4px 4px 0px var(--color-navy)" : "none",
                padding: "0.85rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                borderRadius: "var(--radius-brutal-sm)",
                transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: isActive ? "translate(-2px, -2px)" : "none"
              }}
            >
              <item.icon 
                size={20} 
                color={isActive ? "var(--color-navy)" : "rgba(255,255,255,0.7)"}
                strokeWidth={isActive ? 3 : 2}
                style={{ minWidth: "20px" }}
              />
              <span style={{ fontWeight: 800, fontSize: "0.9375rem" }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar__footer" style={{ padding: "1.5rem", borderTop: "2px dashed rgba(248, 250, 252, 0.1)" }}>
        <button 
          className="btn-brutal btn-brutal--ghost" 
          style={{ width: "100%", justifyContent: "flex-start", padding: "0.75rem 1rem", color: "var(--color-orange)", gap: "1rem", fontWeight: 800 }}
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
