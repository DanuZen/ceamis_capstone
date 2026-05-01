"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⌂" },
  { href: "/dashboard/transactions", label: "Transaksi", icon: "¤" },
  { href: "/dashboard/gamification", label: "Gamifikasi", icon: "★" },
  { href: "/dashboard/warnings", label: "Warning System", icon: "▲" },
  { href: "/dashboard/chatbot", label: "Chatbot AI", icon: "◎" },
  { href: "/dashboard/education", label: "Edukasi", icon: "■" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon" style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>C</div>
        <span>CEAMIS</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
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
            >
              <span className="sidebar__link-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar__footer">
        <Link href="/" className="btn-brutal btn-brutal--ghost btn-brutal--sm" style={{ width: "100%" }}>
          ← Kembali ke Home
        </Link>
      </div>
    </aside>
  );
}
