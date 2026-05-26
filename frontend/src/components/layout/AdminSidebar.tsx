"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, BookOpen, Trophy, Server, Settings, LogOut
} from "lucide-react";

// ── Admin Navigation Groups ──────────────────────
interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number; style?: React.CSSProperties }>;
  color: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const adminNavGroups: NavGroup[] = [
  {
    title: "OVERVIEW",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "lime" },
    ],
  },
  {
    title: "MANAJEMEN",
    items: [
      { href: "/admin/users", label: "Manajemen User", icon: Users, color: "orange" },
      { href: "/admin/content", label: "Konten & Banner", icon: Server, color: "purple" },
      { href: "/admin/education", label: "Modul Edukasi", icon: BookOpen, color: "lime" },
      { href: "/admin/gamification", label: "Gamifikasi", icon: Trophy, color: "orange" },
    ],
  },
  {
    title: "SISTEM",
    items: [
      { href: "/admin/settings", label: "Pengaturan", icon: Settings, color: "purple" },
    ],
  },
];

export default function AdminSidebar({ isOpen = true }: { isOpen?: boolean }) {
  const pathname = usePathname();

  const renderNavItem = (item: NavItem) => {
    const isActive =
      item.href === "/admin/dashboard"
        ? pathname === "/admin/dashboard"
        : pathname.startsWith(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
        style={{
          background: isActive ? "var(--color-white)" : "transparent",
          color: isActive ? "var(--color-navy)" : "rgba(255,255,255,0.7)",
          border: isActive ? "2px solid var(--color-navy)" : "2px solid transparent",
          boxShadow: isActive ? "3px 3px 0px var(--color-danger, #e74c3c)" : "none",
          padding: "0.75rem 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.85rem",
          borderRadius: "var(--radius-brutal-sm)",
          transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: isActive ? "translate(-2px, -2px)" : "none",
          textDecoration: "none",
        }}
      >
        <item.icon
          size={18}
          color={isActive ? "var(--color-navy)" : "rgba(255,255,255,0.7)"}
          strokeWidth={isActive ? 3 : 2.5}
          style={{ minWidth: "18px" }}
        />
        <span className="sidebar-text" style={{ fontWeight: 800, fontSize: "0.875rem", whiteSpace: "nowrap" }}>{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="sidebar" style={{ background: "var(--color-navy)" }}>
      {/* Logo Section */}
      <div className="sidebar__logo" style={{ padding: "2rem 1.5rem 1rem 1.5rem" }}>
        <div style={{
          width: "72px", height: "72px", display: "flex", alignItems: "center",
          justifyContent: "center"
        }}>
          <img src="/images/logo_ceamis.png" alt="CEAMIS Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
        <div className="sidebar-text" style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "1.5rem", fontWeight: 900, letterSpacing: "2px", color: "var(--color-white)", lineHeight: 1 }}>CEAMIS</span>
          <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "var(--color-danger, #e74c3c)", letterSpacing: "1px", marginTop: "0.25rem" }}>ADMINISTRATOR</span>
        </div>
      </div>

      {/* Grouped Navigation */}
      <nav className="sidebar__nav" style={{ padding: "0.5rem 1rem", display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1, overflowY: "auto" }}>
        {adminNavGroups.map((group, groupIdx) => (
          <div key={group.title} style={{ marginBottom: groupIdx < adminNavGroups.length - 1 ? "0.25rem" : 0 }}>
            {/* Group Label */}
            <div className="sidebar-text" style={{
              fontSize: "0.6rem", fontWeight: 900, color: "rgba(255,255,255,0.25)",
              letterSpacing: "2px", padding: "0.6rem 1.25rem 0.35rem 1.25rem",
              textTransform: "uppercase", whiteSpace: "nowrap"
            }}>
              {group.title}
            </div>

            {/* Group Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              {group.items.map(renderNavItem)}
            </div>

            {/* Divider between groups (except last) */}
            {groupIdx < adminNavGroups.length - 1 && (
              <div style={{
                height: "1px", background: "rgba(255,255,255,0.06)",
                margin: "0.5rem 1.25rem 0 1.25rem",
              }} />
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar__footer" style={{ padding: "1rem 1rem 1.5rem 1rem", borderTop: "2px dashed rgba(255, 255, 255, 0.1)" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <button
            className="btn-brutal"
            style={{
              width: "100%", padding: "0.75rem 1.25rem",
              background: "var(--color-danger, #e74c3c)", border: "3px solid var(--color-white)",
              boxShadow: "4px 4px 0px rgba(255,255,255,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
              borderRadius: "var(--radius-brutal-sm)", color: "var(--color-white)",
              fontWeight: 800, fontSize: "0.875rem", cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <LogOut size={18} strokeWidth={2.5} style={{ minWidth: "18px" }} />
            <span className="sidebar-text" style={{ whiteSpace: "nowrap" }}>Keluar Panel</span>
          </button>
        </Link>
      </div>
    </aside>
  );
}
