"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  AlertTriangle, 
  Bot, 
  BookOpen,
  LogOut,
  User,
  HandCoins,
  FileText,
  Target,
  Lock
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useGuest } from "@/context/GuestContext";
import { useLanguage } from "@/context/LanguageContext";

// ── Grouped Navigation ──────────────────────
interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number; style?: React.CSSProperties }>;
  color: string;
  guestRestricted?: boolean; // true = dikunci untuk guest
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "sidebar.groups.utama",
    items: [
      { href: "/dashboard", label: "sidebar.dashboard", icon: LayoutDashboard, color: "purple" },
    ],
  },
  {
    title: "sidebar.groups.keuangan",
    items: [
      { href: "/dashboard/transactions", label: "sidebar.transactions", icon: Wallet, color: "lime" },
      { href: "/dashboard/history", label: "sidebar.history", icon: History, color: "orange" },
      { href: "/dashboard/planning", label: "sidebar.planning", icon: Target, color: "purple", guestRestricted: true },
      { href: "/dashboard/debt", label: "sidebar.debt", icon: HandCoins, color: "orange" },
      { href: "/dashboard/reports", label: "sidebar.reports", icon: FileText, color: "lime" },
      { href: "/dashboard/education", label: "sidebar.education", icon: BookOpen, color: "orange", guestRestricted: true },
    ],
  },
  {
    title: "sidebar.groups.ai",
    items: [
      { href: "/dashboard/warnings", label: "sidebar.warnings", icon: AlertTriangle, color: "pink", guestRestricted: true },
      { href: "/dashboard/chatbot", label: "sidebar.chatbot", icon: Bot, color: "lime", guestRestricted: true },
    ],
  },
];

export default function Sidebar({ isOpen = true }: { isOpen?: boolean }) {
  const pathname = usePathname();
  const { userData } = useUser();
  const { isGuest } = useGuest();
  const { t } = useLanguage();
  const warningTriggered = userData.warningTriggered;
  const healthScore = userData.healthScore;

  const renderNavItem = (item: NavItem) => {
    const isActive =
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.href);

    // Guest restriction — visible tapi terkunci
    const isGuestLocked = isGuest && item.guestRestricted;
    if (isGuestLocked) {
      return (
        <div
          key={item.href}
          title={t("sidebar.guestLockedTitle")}
          style={{
            padding: "0.75rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            borderRadius: "var(--radius-brutal-sm)",
            opacity: 0.4,
            cursor: "not-allowed",
            border: "2px dashed rgba(255,255,255,0.15)",
            userSelect: "none",
          }}
        >
          <Lock 
            size={18} 
            color="rgba(255,255,255,0.5)"
            strokeWidth={2.5}
            style={{ minWidth: "18px" }}
          />
          <span className="sidebar-text" style={{ fontWeight: 800, fontSize: "0.875rem", whiteSpace: "nowrap", color: "rgba(255,255,255,0.5)" }}>
            {t(item.label)}
          </span>
          <span className="sidebar-text" style={{ fontSize: "0.6rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "100px", padding: "0.1rem 0.4rem", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap", marginLeft: "auto" }}>
            {t("sidebar.guestTag")}
          </span>
        </div>
      );
    }

    // Warning System: hanya bisa diakses jika warningTriggered (score < 40)
    const isWarningItem = item.href === "/dashboard/warnings";
    const isLocked = isWarningItem && !warningTriggered;

    if (isLocked) {
      return (
        <div
          key={item.href}
          title={`${t("sidebar.warningTitle")} (${healthScore.toFixed(0)}%)`}
          style={{
            padding: "0.75rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            borderRadius: "var(--radius-brutal-sm)",
            opacity: 0.35,
            cursor: "not-allowed",
            border: "2px dashed rgba(255,255,255,0.2)",
            userSelect: "none",
          }}
        >
          <Lock 
            size={18} 
            color="rgba(255,255,255,0.5)"
            strokeWidth={2.5}
            style={{ minWidth: "18px" }}
          />
          <span className="sidebar-text" style={{ fontWeight: 800, fontSize: "0.875rem", whiteSpace: "nowrap", color: "rgba(255,255,255,0.5)" }}>
            {t(item.label)}
          </span>
          <span className="sidebar-text" style={{ fontSize: "0.6rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "100px", padding: "0.1rem 0.4rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap", marginLeft: "auto" }}>
            {healthScore.toFixed(0)}%
          </span>
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
        style={{
          background: isActive ? "var(--color-white)" : "transparent",
          color: isActive ? "var(--color-navy)" : "rgba(255,255,255,0.7)",
          border: isActive ? "2px solid var(--color-navy)" : "2px solid transparent",
          boxShadow: isActive ? "3px 3px 0px var(--color-lime)" : "none",
          padding: "0.75rem 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "0.85rem",
          borderRadius: "var(--radius-brutal-sm)",
          transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: isActive ? "translate(-2px, -2px)" : "none"
        }}
      >
        <item.icon 
          size={18} 
          color={isActive ? "var(--color-navy)" : isWarningItem ? "var(--color-pink)" : "rgba(255,255,255,0.7)"}
          strokeWidth={isActive ? 3 : 2.5}
          style={{ minWidth: "18px" }}
        />
        <span className="sidebar-text" style={{ fontWeight: 800, fontSize: "0.875rem", whiteSpace: "nowrap" }}>{t(item.label)}</span>
        {isWarningItem && (
          <span className="animate-pulse" style={{ marginLeft: "auto", width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-pink)", border: "2px solid var(--color-navy)", flexShrink: 0 }} />
        )}
      </Link>
    );
  };

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar__logo" style={{ padding: "2rem 1.5rem 1rem 1.5rem" }}>
        <div style={{
          width: "72px",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <img src="/images/logo_ceamis.png" alt="CEAMIS Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
        <div className="sidebar-text" style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "1.5rem", fontWeight: 900, letterSpacing: "2px", color: "var(--color-white)", lineHeight: 1 }}>CEAMIS</span>
          <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "var(--color-lime)", letterSpacing: "1px", marginTop: "0.25rem" }}>FINANCE ENGINE</span>
        </div>
      </div>

      {/* Grouped Navigation */}
      <nav className="sidebar__nav" style={{ padding: "0.5rem 1rem", display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1, overflowY: "auto" }}>
        {navGroups.map((group, groupIdx) => (
          <div key={group.title} style={{ marginBottom: groupIdx < navGroups.length - 1 ? "0.25rem" : 0 }}>
            {/* Group Label */}
            <div className="sidebar-text" style={{
              fontSize: "0.6rem",
              fontWeight: 900,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "2px",
              padding: "0.6rem 1.25rem 0.35rem 1.25rem",
              textTransform: "uppercase",
              whiteSpace: "nowrap"
            }}>
              {t(group.title)}
            </div>

            {/* Group Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              {group.items.map(renderNavItem)}
            </div>

            {/* Divider between groups (except last) */}
            {groupIdx < navGroups.length - 1 && (
              <div style={{
                height: "1px",
                background: "rgba(255,255,255,0.06)",
                margin: "0.5rem 1.25rem 0 1.25rem",
              }} />
            )}
          </div>
        ))}
      </nav>

      {/* Footer — Only back to landing page */}
      <div className="sidebar__footer" style={{ padding: "1rem 1rem 1.5rem 1rem", borderTop: "2px dashed rgba(255, 255, 255, 0.1)" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <button 
            className="btn-brutal" 
            style={{ 
              width: "100%",
              padding: "0.75rem 1.25rem",
              background: "var(--color-lime)", 
              border: "3px solid var(--color-navy)",
              boxShadow: "4px 4px 0px var(--color-navy)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              borderRadius: "var(--radius-brutal-sm)",
              color: "var(--color-navy)",
              fontWeight: 800,
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <LogOut size={18} strokeWidth={2.5} style={{ minWidth: "18px" }} />
            <span className="sidebar-text" style={{ whiteSpace: "nowrap" }}>{t("sidebar.back")}</span>
          </button>
        </Link>
      </div>
    </aside>
  );
}
