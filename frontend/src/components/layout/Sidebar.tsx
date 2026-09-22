"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Wallet, 
  ShieldAlert, 
  HandCoins, 
  History, 
  Target, 
  FileText, 
  AlertTriangle,
  Lock,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useGuest } from "@/context/GuestContext";
import { useLanguage } from "@/context/LanguageContext";

interface NavItem {
  href: string;
  labelKey?: string;
  defaultLabel: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number; style?: React.CSSProperties }>;
  badge?: string;
  guestRestricted?: boolean;
}

const navItems: NavItem[] = [
  { href: "/dashboard", labelKey: "sidebar.dashboard", defaultLabel: "Dasbor", icon: LayoutDashboard },
  { href: "/dashboard/transactions", labelKey: "sidebar.transactions", defaultLabel: "Transaksi", icon: Wallet },
  { href: "/dashboard/pre-purchase", defaultLabel: "Cek Pra-Beli (AI)", icon: ShieldAlert, badge: "AI" },
  { href: "/dashboard/debt", labelKey: "sidebar.debt", defaultLabel: "Utang & Piutang", icon: HandCoins },
  { href: "/dashboard/history", labelKey: "sidebar.history", defaultLabel: "Riwayat", icon: History },
  { href: "/dashboard/planning", labelKey: "sidebar.planning", defaultLabel: "Perencanaan", icon: Target, guestRestricted: true },
  { href: "/dashboard/reports", labelKey: "sidebar.reports", defaultLabel: "Laporan", icon: FileText },
  { href: "/dashboard/warnings", labelKey: "sidebar.warnings", defaultLabel: "Sistem Peringatan", icon: AlertTriangle, guestRestricted: true },
];

export default function Sidebar({ isOpen = true, onToggle }: { isOpen?: boolean; onToggle?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
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

    const labelText = item.labelKey ? t(item.labelKey) : item.defaultLabel;

    // Guest restriction
    const isGuestLocked = isGuest && item.guestRestricted;
    if (isGuestLocked) {
      return (
        <div
          key={item.href}
          className="sidebar__link"
          title={`Fitur terkunci (Mode Tamu): ${labelText}`}
          style={{
            padding: isOpen ? "0.6rem 0.85rem" : "0",
            justifyContent: isOpen ? "flex-start" : "center",
            width: isOpen ? "100%" : "44px",
            height: isOpen ? "auto" : "44px",
            margin: isOpen ? "0" : "0 auto",
            display: "flex",
            alignItems: "center",
            gap: isOpen ? "0.75rem" : "0",
            borderRadius: "10px",
            opacity: 0.55,
            cursor: "not-allowed",
            border: "1.5px dashed var(--color-navy)",
            userSelect: "none",
            background: "rgba(255, 255, 255, 0.45)",
            flexShrink: 0,
          }}
        >
          <Lock size={18} color="var(--color-navy)" strokeWidth={2.2} style={{ minWidth: "18px" }} />
          {isOpen && (
            <>
              <span className="sidebar-text" style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--color-navy)" }}>
                {labelText}
              </span>
              <span style={{ fontSize: "0.6rem", background: "rgba(10, 25, 47, 0.1)", border: "1px solid var(--color-navy)", borderRadius: "999px", padding: "1px 6px", color: "var(--color-navy)", marginLeft: "auto", fontWeight: 800 }}>
                GUEST
              </span>
            </>
          )}
        </div>
      );
    }

    // Warning System locked if score >= 40 (only if item is /dashboard/warnings and not triggered)
    const isWarningItem = item.href === "/dashboard/warnings";
    const isLocked = isWarningItem && !warningTriggered;

    if (isLocked) {
      return (
        <div
          key={item.href}
          className="sidebar__link"
          title={`Sistem Peringatan (${healthScore.toFixed(0)}%): ${labelText}`}
          style={{
            padding: isOpen ? "0.6rem 0.85rem" : "0",
            justifyContent: isOpen ? "flex-start" : "center",
            width: isOpen ? "100%" : "44px",
            height: isOpen ? "auto" : "44px",
            margin: isOpen ? "0" : "0 auto",
            display: "flex",
            alignItems: "center",
            gap: isOpen ? "0.75rem" : "0",
            borderRadius: "10px",
            opacity: 0.55,
            cursor: "not-allowed",
            border: "1.5px dashed var(--color-navy)",
            userSelect: "none",
            background: "rgba(255, 255, 255, 0.45)",
            flexShrink: 0,
          }}
        >
          <Lock size={18} color="var(--color-navy)" strokeWidth={2.2} style={{ minWidth: "18px" }} />
          {isOpen && (
            <>
              <span className="sidebar-text" style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--color-navy)" }}>
                {labelText}
              </span>
              <span style={{ fontSize: "0.6rem", background: "rgba(10, 25, 47, 0.1)", border: "1px solid var(--color-navy)", borderRadius: "999px", padding: "1px 6px", color: "var(--color-navy)", marginLeft: "auto", fontWeight: 800 }}>
                {healthScore.toFixed(0)}%
              </span>
            </>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
        title={!isOpen ? labelText : undefined}
        style={{
          background: isActive ? "var(--color-navy)" : "rgba(255, 255, 255, 0.9)",
          color: isActive ? "var(--color-lime)" : "var(--color-navy)",
          border: "2px solid var(--color-navy)",
          boxShadow: isActive ? "3px 3px 0px rgba(0, 0, 0, 0.25)" : "2px 2px 0px var(--color-navy)",
          padding: isOpen ? "0.6rem 0.85rem" : "0",
          justifyContent: isOpen ? "flex-start" : "center",
          width: isOpen ? "100%" : "44px",
          height: isOpen ? "auto" : "44px",
          margin: isOpen ? "0" : "0 auto",
          display: "flex",
          alignItems: "center",
          gap: isOpen ? "0.75rem" : "0",
          borderRadius: "10px",
          transition: "all 0.15s ease",
          textDecoration: "none",
          fontWeight: isActive ? 900 : 750,
          transform: isActive ? "translate(-1px, -1px)" : "none",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <item.icon 
          size={18} 
          color={isActive ? "var(--color-lime)" : "var(--color-navy)"}
          strokeWidth={isActive ? 2.8 : 2.2}
          style={{ minWidth: "18px" }}
        />
        {isOpen && (
          <>
            <span className="sidebar-text" style={{ fontSize: "0.85rem", whiteSpace: "nowrap", flex: 1, color: isActive ? "var(--color-lime)" : "var(--color-navy)" }}>
              {labelText}
            </span>
            {item.badge && (
              <span 
                style={{
                  background: isActive ? "var(--color-lime)" : "#0095FF",
                  color: isActive ? "var(--color-navy)" : "#FFFFFF",
                  fontSize: "0.65rem",
                  fontWeight: 900,
                  padding: "1px 7px",
                  borderRadius: "999px",
                  border: "1.5px solid var(--color-navy)",
                  boxShadow: "1px 1px 0px var(--color-navy)",
                  letterSpacing: "0.5px"
                }}
              >
                {item.badge}
              </span>
            )}
            {isWarningItem && warningTriggered && (
              <span className="animate-pulse" style={{ marginLeft: "auto", width: "8px", height: "8px", borderRadius: "50%", background: "#FFE100", border: "2px solid var(--color-navy)", flexShrink: 0 }} />
            )}
          </>
        )}
        {!isOpen && item.badge && (
          <span 
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#0095FF",
              border: "1.5px solid var(--color-navy)",
            }}
          />
        )}
      </Link>
    );
  };

  return (
    <aside 
      className={`sidebar ${isOpen ? "sidebar--open" : "sidebar--collapsed"}`}
      style={{
        width: isOpen ? "var(--sidebar-width)" : "var(--sidebar-collapsed)",
        background: "var(--color-lime)",
        borderRight: "2.5px solid var(--color-navy)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "100vh",
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        transition: "width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        overflowX: "hidden",
      }}
    >
      {/* Brand Header Card (Clickable to toggle sidebar) */}
      <button 
        type="button"
        onClick={onToggle}
        className="sidebar-brand-card"
        style={{
          margin: isOpen ? "1rem 0.85rem 0.75rem 0.85rem" : "1rem auto 0.75rem auto",
          padding: isOpen ? "0.75rem 0.85rem" : "0.5rem",
          width: isOpen ? "auto" : "44px",
          height: isOpen ? "auto" : "44px",
          justifyContent: isOpen ? "flex-start" : "center",
          background: "#FFFFFF",
          border: "2.5px solid var(--color-navy)",
          borderRadius: "12px",
          boxShadow: "3px 3px 0px var(--color-navy)",
          display: "flex",
          alignItems: "center",
          gap: isOpen ? "0.75rem" : "0",
          flexShrink: 0,
          cursor: "pointer",
          textAlign: "left",
        }}
        title={isOpen ? "Tutup Sidebar" : "Buka Sidebar"}
        aria-label={isOpen ? "Tutup sidebar" : "Buka sidebar"}
      >
        {/* Wallet Icon in Navy Square */}
        <div 
          style={{
            width: isOpen ? "38px" : "32px",
            height: isOpen ? "38px" : "32px",
            background: "var(--color-navy)",
            border: "2px solid var(--color-navy)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Wallet size={isOpen ? 20 : 16} color="var(--color-lime)" strokeWidth={2.5} />
        </div>

        {/* Title and Subtitle */}
        {isOpen && (
          <div className="sidebar-text" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <span 
              style={{ 
                fontSize: "1.2rem", 
                fontWeight: 900, 
                color: "var(--color-navy)", 
                letterSpacing: "-0.5px",
                lineHeight: 1 
              }}
            >
              CEAMIS
            </span>
            <span 
              style={{ 
                fontSize: "0.62rem", 
                fontWeight: 700, 
                color: "#475569", 
                marginTop: "0.25rem",
                whiteSpace: "nowrap"
              }}
            >
              Catatan Income Anak Manis
            </span>
          </div>
        )}
      </button>

      {/* Nav List */}
      <nav 
        className="sidebar__nav" 
        style={{ 
          padding: isOpen ? "0.5rem 0.85rem" : "0.5rem 0", 
          display: "flex", 
          flexDirection: "column", 
          gap: "0.35rem", 
          flex: 1, 
          overflowY: "auto",
          alignItems: isOpen ? "stretch" : "center",
        }}
      >
        {navItems.map(renderNavItem)}
      </nav>

      {/* Bottom Status Card */}
      <div 
        style={{ 
          padding: isOpen ? "0.85rem 0.85rem 1.25rem 0.85rem" : "0.85rem 0 1.25rem 0", 
          marginTop: "auto",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {isOpen ? (
          <div 
            style={{
              background: "#FFE100",
              border: "2.5px solid var(--color-navy)",
              borderRadius: "12px",
              boxShadow: "3px 3px 0px var(--color-navy)",
              padding: "0.85rem 1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span 
                style={{ 
                  fontSize: "0.68rem", 
                  fontWeight: 900, 
                  color: "var(--color-navy)", 
                  letterSpacing: "0.5px",
                  textTransform: "uppercase" 
                }}
              >
                STATUS FINANSIAL
              </span>
              <span 
                style={{
                  background: "var(--color-navy)",
                  border: "1.5px solid var(--color-navy)",
                  borderRadius: "999px",
                  padding: "1px 8px",
                  fontSize: "0.62rem",
                  fontWeight: 900,
                  color: "var(--color-lime)",
                }}
              >
                SEHAT
              </span>
            </div>
            <p 
              style={{ 
                fontSize: "0.78rem", 
                fontWeight: 700, 
                color: "var(--color-navy)", 
                margin: 0,
                lineHeight: 1.35 
              }}
            >
              Kas surplus +28% bulan ini. Keren abis!
            </p>
          </div>
        ) : (
          <div
            title="Status Finansial: Sehat (Kas surplus +28% bulan ini)"
            style={{
              width: "44px",
              height: "44px",
              background: "#FFE100",
              border: "2px solid var(--color-navy)",
              borderRadius: "10px",
              boxShadow: "2px 2px 0px var(--color-navy)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "0.62rem", fontWeight: 900, color: "var(--color-navy)" }}>
              SEHAT
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
