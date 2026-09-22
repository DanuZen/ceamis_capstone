"use client";

import { useState, useEffect } from "react";
import {
  HandCoins, Plus, ArrowDownLeft, ArrowUpRight,
  Calendar, User, AlertTriangle, CheckCircle2,
  X, Clock, Filter, Sparkles, Info
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { useTransactions } from "@/context/TransactionContext";
import { useUser } from "@/context/UserContext";
import { getDebts, saveDebts } from "@/app/dashboard/planning/actions";
import { translateTransactionDesc } from "@/lib/translateCategory";
import PageBanner from "@/components/layout/PageBanner";

type DebtType = "utang" | "piutang";
type DebtStatus = "belum_lunas" | "lunas" | "jatuh_tempo";

interface DebtEntry {
  id: number;
  type: DebtType;
  person: string;
  amount: number;
  description: string;
  dueDate: string;
  status: DebtStatus;
  createdAt: string;
}

const DEFAULT_DATA: DebtEntry[] = [];

export default function DebtPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { addTransaction, transactions } = useTransactions();
  const { userData } = useUser();
  const [entries, setEntries] = useState<DebtEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "utang" | "piutang">("all");
  const [newEntry, setNewEntry] = useState({
    type: "utang" as DebtType,
    person: "",
    amount: "",
    description: "",
    dueDate: "",
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const [showTipsBubble, setShowTipsBubble] = useState(true);
  const [isClosingBubble, setIsClosingBubble] = useState(false);

  // Ensure main chat is closed when landing here to prioritize insight
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("cami-close-chat"));
  }, []);

  // Global click to close bubble
  useEffect(() => {
    if (!showTipsBubble || isClosingBubble) return;
    const timer = setTimeout(() => {
      const closeBubble = () => {
        setIsClosingBubble(true);
        setTimeout(() => setShowTipsBubble(false), 300);
      };
      window.addEventListener("click", closeBubble);
      return () => window.removeEventListener("click", closeBubble);
    }, 100);
    return () => clearTimeout(timer);
  }, [showTipsBubble, isClosingBubble]);

  // Sync character pose
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("cami-force-open", { detail: showTipsBubble && !isClosingBubble }));
    return () => {
      window.dispatchEvent(new CustomEvent("cami-force-open", { detail: false }));
    };
  }, [showTipsBubble, isClosingBubble]);

  useEffect(() => {
    let savedEntries: DebtEntry[] = [];
    const saved = localStorage.getItem("ceamis_debts");
    if (saved) savedEntries = JSON.parse(saved);

    let hasChanges = false;
    const currentEntries = [...savedEntries];

    // Sinkronisasi: jika ada transaksi utang/piutang di riwayat tapi tidak ada di layar ini 
    // (misal login dari device baru atau di-input manual di laman Transaksi), kita restore!
    const sortedTx = [...transactions].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    sortedTx.forEach(tx => {
      let type: DebtType | null = null;
      let person = "";
      let isPelunasan = false;
      const desc = tx.desc || tx.description || ""; // fallback
      
      if (tx.category === "Pinjaman Masuk") { type = "utang"; person = desc.replace("Terima pinjaman dari ", ""); }
      else if (tx.category === "Piutang Keluar") { type = "piutang"; person = desc.replace("Beri pinjaman ke ", ""); }
      else if (tx.category === "Utang" && desc.startsWith("Membayar utang ke ")) { type = "utang"; person = desc.replace("Membayar utang ke ", ""); isPelunasan = true; }
      else if (tx.category === "Pemasukan Lainnya" && desc.startsWith("Pelunasan piutang dari ")) { type = "piutang"; person = desc.replace("Pelunasan piutang dari ", ""); isPelunasan = true; }

      if (type && person) {
        const existingIdx = currentEntries.findIndex(e => e.type === type && e.person === person);
        
        if (!isPelunasan) {
          if (existingIdx === -1) {
            // Restore missing debt!
            const createdDate = new Date(tx.created_at || Date.now());
            const defaultDueDate = new Date(createdDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
            currentEntries.unshift({
              id: createdDate.getTime() + Math.random(),
              type,
              person,
              amount: Math.abs(tx.amount),
              description: desc,
              dueDate: defaultDueDate,
              status: "belum_lunas",
              createdAt: tx.date
            });
            hasChanges = true;
          }
        } else {
          // Sync lunas status
          if (existingIdx !== -1 && currentEntries[existingIdx].status !== "lunas") {
            currentEntries[existingIdx].status = "lunas";
            hasChanges = true;
          } else if (existingIdx === -1) {
            // Jika ada transaksi pelunasan tapi data utang awalnya hilang/tidak ada,
            // kita tetap memulihkannya sebagai utang yang sudah "lunas" agar muncul di riwayat.
            const createdDate = new Date(tx.created_at || Date.now());
            currentEntries.unshift({
              id: createdDate.getTime() + Math.random(),
              type,
              person,
              amount: Math.abs(tx.amount), // Estimasi amount dari pelunasan
              description: desc,
              dueDate: tx.date, // Set tanggal lunas
              status: "lunas",
              createdAt: tx.date
            });
            hasChanges = true;
          }
        }
      }
    });

    if (hasChanges || !isLoaded) {
      setEntries(currentEntries);
      if (hasChanges) localStorage.setItem("ceamis_debts", JSON.stringify(currentEntries));
    }
    if (!isLoaded) setIsLoaded(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions.length]);

  useEffect(() => {
    if (isLoaded && userData?.id) {
      const dataToSave = entries.map(e => ({
        name: e.person,
        type: e.type,
        amount: e.amount,
        dueDate: e.dueDate,
        status: e.status,
        icon: "utensils"
      }));
      saveDebts(userData.id, dataToSave).catch(e => console.error("Failed to save debts", e));
    }
  }, [entries, isLoaded, userData?.id]);

  const filteredEntries = entries.filter(e => {
    if (activeTab !== "all" && e.type !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return e.person.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
    }
    return true;
  });

  const totalUtang = entries.filter(e => e.type === "utang" && e.status !== "lunas").reduce((sum, e) => sum + e.amount, 0);
  const totalPiutang = entries.filter(e => e.type === "piutang" && e.status !== "lunas").reduce((sum, e) => sum + e.amount, 0);
  
  // Use local date for comparison instead of UTC string
  const today = new Date();
  today.setHours(0,0,0,0);

  const parseDateLocal = (dateStr: string) => {
    // Expected format: YYYY-MM-DD
    if (!dateStr) return new Date(NaN);
    const parts = dateStr.split("-");
    if (parts.length !== 3) return new Date(dateStr);
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  };

  const isJatuhTempo = (dueDate: string, status: DebtStatus) => {
    if (status === "lunas") return false;
    const due = parseDateLocal(dueDate);
    if (isNaN(due.getTime())) return false;
    return due <= today;
  };
  
  const jatuhTempo = entries.filter(e => isJatuhTempo(e.dueDate, e.status)).length;

  const formatRupiah = (num: number) => `Rp ${num.toLocaleString("id-ID")}`;

  const handleAdd = () => {
    if (!newEntry.person || !newEntry.amount || !newEntry.dueDate) return;
    const amt = parseInt(newEntry.amount);
    const entry: DebtEntry = {
      id: Date.now(),
      type: newEntry.type,
      person: newEntry.person,
      amount: amt,
      description: newEntry.description,
      dueDate: newEntry.dueDate,
      status: "belum_lunas",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setEntries([entry, ...entries]);

    // Catat transaksi saat utang/piutang dibuat:
    // Utang (kita pinjam) → duit kita BERTAMBAH (pemasukan dari pemberi pinjaman)
    // Piutang (kita pinjamkan) → duit kita BERKURANG (pengeluaran ke peminjam)
    addTransaction({
      amount: amt,
      type: newEntry.type === "utang" ? "pemasukan" : "pengeluaran",
      category: newEntry.type === "utang" ? "Pinjaman Masuk" : "Piutang Keluar",
      description: `${newEntry.type === "utang" ? "Terima pinjaman dari" : "Beri pinjaman ke"} ${newEntry.person}`,
    });

    setNewEntry({ type: "utang", person: "", amount: "", description: "", dueDate: "" });
    setShowForm(false);
    showToast(t("dashboard.debt.saveSuccess"), "success");
  };

  const toggleStatus = (id: number) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    if (entry.status === "lunas") return; // Cannot uncheck

    addTransaction({
      amount: entry.amount,
      type: entry.type === "utang" ? "pengeluaran" : "pemasukan",
      category: entry.type === "utang" ? "Utang" : "Pemasukan Lainnya",
      description: `${entry.type === "utang" ? "Membayar utang ke" : "Pelunasan piutang dari"} ${entry.person}`,
    });
    showToast(t("dashboard.debt.settleSuccess"), "success");

    setEntries(entries.map(e =>
      e.id === id
        ? { ...e, status: "lunas" }
        : e
    ));
  };

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const getStatusBadge = (status: DebtStatus, dueDate: string) => {
    if (status === "lunas") return { label: t("dashboard.debt.paid"), color: "lime", icon: CheckCircle2 };
    if (isJatuhTempo(dueDate, status)) return { label: t("dashboard.debt.overdue"), color: "orange", icon: AlertTriangle };
    return { label: t("dashboard.debt.unpaid"), color: "purple", icon: Clock };
  };

  const displayDate = (dateStr: string) => {
    const d = parseDateLocal(dateStr);
    if (isNaN(d.getTime())) return t("dashboard.debt.formatError");
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div style={{ paddingBottom: "3rem" }}>
      {/* Header Banner */}
      <PageBanner
        badgeText="MANAJEMEN KREDIT & PINJAMAN"
        title="Buku Utang & Piutang"
        description="Kelola kewajiban utang dan tagihan piutang dengan pelacakan jatuh tempo otomatis."

        rightCard={{
          icon: <HandCoins size={24} className="text-[#F97316]" />,
          label: "STATUS PINJAMAN",
          value: jatuhTempo > 0 ? `${jatuhTempo} Jatuh Tempo` : "Semua Lancar",
        }}
        className="mb-4"
      />

      {/* ── Main 2-Column Grid (2 Large Enclosing Cards) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
        
        {/* ── CARD BESAR 1: Ringkasan & Form Entri (5 cols) ── */}
        <div 
          style={{
            background: "#FFFFFF",
            border: "2.5px solid var(--color-navy)",
            borderRadius: "16px",
            boxShadow: "4px 4px 0px var(--color-navy)",
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
            height: "100%",
          }}
          className="lg:col-span-5"
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {/* Header Card 1 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div 
                  style={{
                    width: "34px",
                    height: "34px",
                    background: "var(--color-lime)",
                    border: "2px solid var(--color-navy)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "2px 2px 0px var(--color-navy)",
                    flexShrink: 0
                  }}
                >
                  <HandCoins size={17} color="var(--color-navy)" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 900, color: "var(--color-navy)", margin: 0, lineHeight: 1.2 }}>
                    Kelola & Catat Pinjaman
                  </h3>
                  <p style={{ fontSize: "0.72rem", color: "#64748B", margin: 0, fontWeight: 600 }}>
                    Ringkasan beban & pencatatan entri baru
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Quick Stats Bars Inside Card 1 */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {/* Stat 1: Utang */}
              <div 
                style={{
                  background: "#FFF7ED",
                  border: "1.8px solid var(--color-navy)",
                  borderRadius: "10px",
                  padding: "0.5rem 0.6rem",
                  boxShadow: "2px 2px 0px var(--color-navy)",
                }}
              >
                <div className="flex items-center gap-1 text-[10px] font-black uppercase text-orange-700">
                  <ArrowDownLeft size={12} strokeWidth={3} />
                  <span>Utang</span>
                </div>
                <div className="text-xs sm:text-sm font-black text-[#0A192F] mt-1 truncate">
                  {formatRupiah(totalUtang)}
                </div>
              </div>

              {/* Stat 2: Piutang */}
              <div 
                style={{
                  background: "#F0FDF4",
                  border: "1.8px solid var(--color-navy)",
                  borderRadius: "10px",
                  padding: "0.5rem 0.6rem",
                  boxShadow: "2px 2px 0px var(--color-navy)",
                }}
              >
                <div className="flex items-center gap-1 text-[10px] font-black uppercase text-green-700">
                  <ArrowUpRight size={12} strokeWidth={3} />
                  <span>Piutang</span>
                </div>
                <div className="text-xs sm:text-sm font-black text-[#0A192F] mt-1 truncate">
                  {formatRupiah(totalPiutang)}
                </div>
              </div>

              {/* Stat 3: Jatuh Tempo */}
              <div 
                style={{
                  background: jatuhTempo > 0 ? "#FEF2F2" : "#F8FAFC",
                  border: "1.8px solid var(--color-navy)",
                  borderRadius: "10px",
                  padding: "0.5rem 0.6rem",
                  boxShadow: "2px 2px 0px var(--color-navy)",
                }}
              >
                <div className="flex items-center gap-1 text-[10px] font-black uppercase text-[#0A192F]">
                  <AlertTriangle size={12} strokeWidth={3} color={jatuhTempo > 0 ? "#DC2626" : "#475569"} />
                  <span>Tempo</span>
                </div>
                <div className={`text-xs sm:text-sm font-black mt-1 ${jatuhTempo > 0 ? "text-red-600" : "text-[#0A192F]"}`}>
                  {jatuhTempo} Jatuh Tempo
                </div>
              </div>
            </div>

            {/* Input Form */}
            <div 
              style={{
                background: "var(--color-bg)",
                border: "2px solid var(--color-navy)",
                borderRadius: "12px",
                padding: "0.85rem 1rem",
                boxShadow: "2px 2px 0px var(--color-navy)",
                marginBottom: "0.75rem",
              }}
            >
              {/* Type Switcher */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <button 
                  type="button"
                  onClick={() => setNewEntry({ ...newEntry, type: "utang" })} 
                  style={{
                    flex: 1,
                    padding: "0.45rem",
                    fontWeight: 900,
                    fontSize: "0.75rem",
                    background: newEntry.type === "utang" ? "var(--color-orange)" : "var(--color-white)",
                    color: newEntry.type === "utang" ? "var(--color-white)" : "var(--color-navy)",
                    border: "1.8px solid var(--color-navy)",
                    borderRadius: "8px",
                    boxShadow: newEntry.type === "utang" ? "2px 2px 0px var(--color-navy)" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.35rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <ArrowDownLeft size={13} strokeWidth={3} /> {t("dashboard.debt.iOwe")}
                </button>
                <button 
                  type="button"
                  onClick={() => setNewEntry({ ...newEntry, type: "piutang" })} 
                  style={{
                    flex: 1,
                    padding: "0.45rem",
                    fontWeight: 900,
                    fontSize: "0.75rem",
                    background: newEntry.type === "piutang" ? "var(--color-lime)" : "var(--color-white)",
                    color: "var(--color-navy)",
                    border: "1.8px solid var(--color-navy)",
                    borderRadius: "8px",
                    boxShadow: newEntry.type === "piutang" ? "2px 2px 0px var(--color-navy)" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.35rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <ArrowUpRight size={13} strokeWidth={3} /> {t("dashboard.debt.iLend")}
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.72rem", display: "block", marginBottom: "0.2rem", color: "var(--color-navy)" }}>
                      {newEntry.type === "utang" ? t("dashboard.debt.lenderName") : t("dashboard.debt.borrowerName")}
                    </label>
                    <input
                      value={newEntry.person}
                      onChange={(e) => setNewEntry({ ...newEntry, person: e.target.value })}
                      className="input-brutal"
                      placeholder={t("dashboard.debt.namePlaceholder")}
                      style={{ border: "1.8px solid var(--color-navy)", padding: "0.5rem 0.65rem", width: "100%", fontSize: "0.8rem", borderRadius: "8px", background: "var(--color-white)" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.72rem", display: "block", marginBottom: "0.2rem", color: "var(--color-navy)" }}>
                      {t("dashboard.debt.amount")}
                    </label>
                    <input
                      value={newEntry.amount ? newEntry.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                      onChange={(e) => {
                        const unformatted = e.target.value.replace(/\D/g, "");
                        setNewEntry({ ...newEntry, amount: unformatted });
                      }}
                      className="input-brutal"
                      type="text"
                      placeholder="0"
                      style={{ border: "1.8px solid var(--color-navy)", padding: "0.5rem 0.65rem", width: "100%", fontWeight: 800, fontSize: "0.8rem", borderRadius: "8px", background: "var(--color-white)" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.72rem", display: "block", marginBottom: "0.2rem", color: "var(--color-navy)" }}>
                      {t("dashboard.debt.dueDate")}
                    </label>
                    <input
                      value={newEntry.dueDate}
                      onChange={(e) => setNewEntry({ ...newEntry, dueDate: e.target.value })}
                      className="input-brutal"
                      type="date"
                      style={{ border: "1.8px solid var(--color-navy)", padding: "0.5rem 0.65rem", width: "100%", fontSize: "0.8rem", borderRadius: "8px", background: "var(--color-white)" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.72rem", display: "block", marginBottom: "0.2rem", color: "var(--color-navy)" }}>
                      {t("dashboard.debt.descLabel")}
                    </label>
                    <input
                      value={newEntry.description}
                      onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                      className="input-brutal"
                      placeholder={t("dashboard.debt.descPlaceholder")}
                      style={{ border: "1.8px solid var(--color-navy)", padding: "0.5rem 0.65rem", width: "100%", fontSize: "0.8rem", borderRadius: "8px", background: "var(--color-white)" }}
                    />
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={handleAdd} 
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    fontWeight: 900,
                    fontSize: "0.82rem",
                    background: "var(--color-navy)",
                    color: "var(--color-white)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    border: "2px solid var(--color-navy)",
                    borderRadius: "8px",
                    boxShadow: "2px 2px 0px var(--color-navy)",
                    cursor: "pointer",
                    marginTop: "0.35rem",
                  }}
                  className="hover:bg-slate-800 transition-all"
                >
                  <Plus size={15} strokeWidth={3} /> {t("dashboard.debt.save")}
                </button>
              </div>
            </div>
          </div>

          {/* Footer Info Strip Inside Card 1 */}
          <div 
            style={{
              background: "#F8FAFC",
              border: "1.8px solid var(--color-navy)",
              borderRadius: "10px",
              padding: "0.6rem 0.85rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.6rem",
              marginTop: "auto",
            }}
          >
            <div 
              style={{
                width: "22px",
                height: "22px",
                background: "var(--color-lime)",
                border: "1.5px solid var(--color-navy)",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "1px",
              }}
            >
              <Info size={13} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
            <p style={{ fontSize: "0.72rem", color: "#475569", margin: 0, lineHeight: 1.35, fontWeight: 600 }}>
              <strong style={{ color: "#0A192F" }}>Panduan Manajemen Utang:</strong> Catat setiap pinjaman dan lunasi sebelum tanggal tempo agar arus kas bulanan tetap stabil.
            </p>
          </div>
        </div>

        {/* ── CARD BESAR 2: Buku Catatan Utang & Piutang (7 cols) ── */}
        <div 
          style={{
            background: "#FFFFFF",
            border: "2.5px solid var(--color-navy)",
            borderRadius: "16px",
            boxShadow: "4px 4px 0px var(--color-navy)",
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
            height: "100%",
          }}
          className="lg:col-span-7"
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {/* Header Card 2 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div 
                  style={{
                    width: "34px",
                    height: "34px",
                    background: "var(--color-purple)",
                    border: "2px solid var(--color-navy)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "2px 2px 0px var(--color-navy)",
                    flexShrink: 0
                  }}
                >
                  <Filter size={17} color="var(--color-white)" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 900, color: "var(--color-navy)", margin: 0, lineHeight: 1.2 }}>
                    Buku Catatan Utang & Piutang
                  </h3>
                  <p style={{ fontSize: "0.72rem", color: "#64748B", margin: 0, fontWeight: 600 }}>
                    Pelacakan status pembayaran & jatuh tempo
                  </p>
                </div>
              </div>

              {/* Status Pill Badge */}
              <span 
                style={{
                  background: "var(--color-navy)",
                  color: "var(--color-lime)",
                  border: "1.5px solid var(--color-navy)",
                  borderRadius: "999px",
                  padding: "3px 10px",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  boxShadow: "1px 1px 0px var(--color-navy)",
                }}
              >
                {filteredEntries.length} Entri Tercatat
              </span>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1rem" }}>
              {[
                { id: "all" as const, label: `${t("dashboard.debt.filterAll")} (${entries.length})` },
                { id: "utang" as const, label: `${t("dashboard.debt.filterDebt")} (${entries.filter(e => e.type === "utang").length})` },
                { id: "piutang" as const, label: `${t("dashboard.debt.filterLoan")} (${entries.filter(e => e.type === "piutang").length})` },
              ].map(tab => (
                <button 
                  key={tab.id} 
                  type="button"
                  onClick={() => setActiveTab(tab.id)} 
                  style={{
                    padding: "0.35rem 0.8rem", 
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    borderRadius: "8px",
                    background: activeTab === tab.id ? "var(--color-navy)" : "var(--color-white)",
                    color: activeTab === tab.id ? "var(--color-white)" : "var(--color-navy)",
                    border: "1.8px solid var(--color-navy)",
                    boxShadow: activeTab === tab.id ? "2px 2px 0px var(--color-navy)" : "none",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Entries List */}
            <div 
              style={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: "0.75rem", 
                flex: 1, 
                minHeight: "340px", 
                maxHeight: "480px", 
                overflowY: "auto", 
                paddingRight: "0.25rem" 
              }} 
              className="no-scrollbar"
            >
              {filteredEntries.length === 0 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "2.5rem 1rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                  <HandCoins size={48} style={{ marginBottom: "0.85rem", opacity: 0.4 }} />
                  <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--color-navy)", margin: "0 0 0.25rem 0" }}>
                    {searchQuery ? `${t("dashboard.debt.noMatch1")}${searchQuery}${t("dashboard.debt.noMatch2")}` : t("dashboard.debt.noData")}
                  </p>
                  {!searchQuery && <p style={{ fontSize: "0.78rem", margin: 0, color: "#64748B" }}>{t("dashboard.debt.addHint")}</p>}
                </div>
              )}

              {filteredEntries.map((entry) => {
                const statusInfo = getStatusBadge(entry.status, entry.dueDate);
                const StatusIcon = statusInfo.icon;
                return (
                  <div 
                    key={entry.id} 
                    style={{
                      padding: "0.85rem 1rem", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between",
                      gap: "0.85rem",
                      background: "#FFFFFF",
                      border: "2px solid var(--color-navy)",
                      borderRadius: "12px",
                      boxShadow: "2px 2px 0px var(--color-navy)",
                      opacity: entry.status === "lunas" ? 0.7 : 1,
                    }}
                  >
                    {/* Left: Icon & Info */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0, flex: 1 }}>
                      <div 
                        style={{
                          width: "38px", 
                          height: "38px", 
                          minWidth: "38px", 
                          borderRadius: "8px",
                          background: entry.type === "utang" ? "var(--color-orange)" : "var(--color-lime)",
                          border: "1.8px solid var(--color-navy)", 
                          display: "flex",
                          alignItems: "center", 
                          justifyContent: "center",
                          boxShadow: "1.5px 1.5px 0px var(--color-navy)",
                        }}
                      >
                        {entry.type === "utang"
                          ? <ArrowDownLeft size={20} color="var(--color-navy)" strokeWidth={2.5} />
                          : <ArrowUpRight size={20} color="var(--color-navy)" strokeWidth={2.5} />
                        }
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "var(--color-navy)" }}>
                            {entry.type === "utang" ? `${t("dashboard.debt.debtTo")} ${entry.person}` : `${t("dashboard.debt.loanFrom")} ${entry.person}`}
                          </span>
                          <span 
                            style={{
                              display: "inline-flex", 
                              alignItems: "center", 
                              gap: "0.2rem",
                              padding: "1px 6px", 
                              fontSize: "0.65rem",
                              fontWeight: 800,
                              borderRadius: "4px",
                              border: "1.2px solid var(--color-navy)",
                              background: statusInfo.color === "lime" ? "var(--color-lime)" : statusInfo.color === "orange" ? "#FDBA74" : "#DDD6FE",
                              color: "var(--color-navy)",
                            }}
                          >
                            <StatusIcon size={9} /> {statusInfo.label}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "2px" }}>
                          <span className="truncate">{translateTransactionDesc(entry.description, t)}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.2rem", flexShrink: 0 }}>
                            <Calendar size={11} /> {displayDate(entry.dueDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount & Action */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                      <div 
                        style={{
                          fontFamily: "var(--font-heading)", 
                          fontWeight: 900, 
                          fontSize: "1rem",
                          color: entry.type === "utang" ? "#DC2626" : "var(--color-navy)",
                          textDecoration: entry.status === "lunas" ? "line-through" : "none",
                        }}
                      >
                        {formatRupiah(entry.amount)}
                      </div>

                      <button 
                        type="button"
                        onClick={() => toggleStatus(entry.id)} 
                        disabled={entry.status === "lunas"} 
                        style={{
                          padding: "0.35rem 0.65rem",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center", 
                          gap: "0.3rem",
                          background: entry.status === "lunas" ? "var(--color-lime)" : "var(--color-white)",
                          border: "1.8px solid var(--color-navy)",
                          boxShadow: entry.status === "lunas" ? "none" : "1.5px 1.5px 0px var(--color-navy)",
                          cursor: entry.status === "lunas" ? "not-allowed" : "pointer",
                          color: "var(--color-navy)"
                        }} 
                        title={entry.status === "lunas" ? t("dashboard.debt.paid") : t("dashboard.debt.markPaid")}
                      >
                        <CheckCircle2 size={13} color="var(--color-navy)" />
                        {entry.status === "lunas" ? "Lunas" : "Lunasi"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CAMI Tips Bubble Overlay */}
      {showTipsBubble && (
        <>
          <style>{`
            @keyframes pop-bubble {
              0% { transform: scale(0.8) translateY(10px); opacity: 0; }
              100% { transform: scale(1) translateY(0); opacity: 1; }
            }
            @keyframes pop-bubble-out {
              0% { transform: scale(1) translateY(0); opacity: 1; }
              100% { transform: scale(0.8) translateY(10px); opacity: 0; }
            }
          `}</style>
          <div style={{
            position: "fixed", bottom: "160px", right: "260px", zIndex: 990,
            animation: isClosingBubble
              ? "pop-bubble-out 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
              : "pop-bubble 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            width: "300px", cursor: "pointer", transition: "transform 0.2s"
          }} 
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {/* Tail Shadow */}
            <div style={{
              position: "absolute", bottom: "32px", right: "-20px",
              width: "24px", height: "24px",
              background: "var(--color-navy)",
              transform: "rotate(45deg)",
              zIndex: 989,
            }} />
            {/* Tail Main */}
            <div style={{
              position: "absolute", bottom: "40px", right: "-12px",
              width: "24px", height: "24px",
              background: "#FFF7ED",
              borderRight: "3px solid var(--color-navy)",
              borderTop: "3px solid var(--color-navy)",
              transform: "rotate(45deg)",
              zIndex: 991,
            }} />
            {/* Bubble content */}
            <div style={{
              position: "relative", zIndex: 990,
              background: "#FFF7ED", border: "3px solid var(--color-navy)",
              borderRadius: "var(--radius-brutal-sm)", padding: "1.25rem",
              boxShadow: "6px 6px 0px var(--color-navy)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 900, color: "#1d4ed8", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Sparkles size={14} color="#1d4ed8" /> INSIGHT CAMI
                </div>
              </div>
              <p style={{ fontSize: "0.95rem", color: "var(--color-navy)", margin: 0, lineHeight: 1.5, fontWeight: 700 }}>
                {t("dashboard.debt.camiTip")}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
