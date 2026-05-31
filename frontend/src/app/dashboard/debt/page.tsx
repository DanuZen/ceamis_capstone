"use client";

import { useState, useEffect } from "react";
import {
  HandCoins, Plus, ArrowDownLeft, ArrowUpRight,
  Calendar, User, AlertTriangle, CheckCircle2,
  X, Clock, Filter
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { useTransactions } from "@/context/TransactionContext";
import { useUser } from "@/context/UserContext";
import { getDebts, saveDebts } from "@/app/dashboard/planning/actions";

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
  const { addTransaction } = useTransactions();
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

  useEffect(() => {
    const fetchData = async () => {
      if (!userData?.id) return;
      try {
        const saved = await getDebts(userData.id);
        if (saved && saved.length > 0) {
          setEntries(saved.map((d: any) => ({
            id: d.id,
            type: d.type,
            person: d.name,
            amount: d.amount,
            description: d.name,
            dueDate: d.dueDate ? new Date(d.dueDate).toISOString().split("T")[0] : "",
            status: d.status,
            createdAt: d.createdAt ? new Date(d.createdAt).toISOString().split("T")[0] : ""
          })));
        } else {
          setEntries(DEFAULT_DATA);
        }
      } catch (e) {
        console.error("Failed to load debts", e);
        setEntries(DEFAULT_DATA);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchData();
  }, [userData?.id]);

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
    showToast(t("dashboard.debt.save") + " Berhasil!", "success");
  };

  const toggleStatus = (id: number) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    if (entry.status !== "lunas") {
      addTransaction({
        amount: entry.amount,
        type: entry.type === "utang" ? "pengeluaran" : "pemasukan",
        category: entry.type === "utang" ? "Utang" : "Pemasukan Lainnya",
        description: `${entry.type === "utang" ? "Membayar utang ke" : "Pelunasan piutang dari"} ${entry.person}`,
      });
      showToast("Berhasil! Transaksi tercatat otomatis di Riwayat.", "success");
    }

    setEntries(entries.map(e =>
      e.id === id
        ? { ...e, status: e.status === "lunas" ? "belum_lunas" : "lunas" }
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
      {/* Header */}
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{
            width: "72px", height: "72px", background: "var(--color-purple)",
            borderRadius: "var(--radius-brutal-sm)", border: "3px solid var(--color-navy)",
            boxShadow: "4px 4px 0px var(--color-navy)", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <HandCoins size={40} color="var(--color-white)" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", marginBottom: "0.25rem", color: "var(--color-navy)", fontWeight: 800 }}>
              {t("dashboard.debt.title")}
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
              {t("dashboard.debt.desc")}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-brutal"
          style={{
            background: showForm ? "var(--color-orange)" : "var(--color-navy)",
            color: "var(--color-white)", padding: "0.85rem 1.5rem", fontWeight: 800,
            display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1rem",
            boxShadow: "4px 4px 0px var(--color-navy)",
          }}
        >
          {showForm ? <><X size={18} /> {t("dashboard.debt.cancel")}</> : <><Plus size={18} /> {t("dashboard.debt.addEntry")}</>}
        </button>
      </div>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }} className="stagger-children">
        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{
            width: "48px", height: "48px", minWidth: "48px", display: "flex",
            alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)",
            border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)",
            background: "var(--color-orange)",
          }}>
            <ArrowDownLeft size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem" }}>{formatRupiah(totalUtang)}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>{t("dashboard.debt.totalDebt")}</div>
          </div>
        </div>

        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{
            width: "48px", height: "48px", minWidth: "48px", display: "flex",
            alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)",
            border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)",
            background: "var(--color-lime)",
          }}>
            <ArrowUpRight size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem" }}>{formatRupiah(totalPiutang)}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>{t("dashboard.debt.totalLoan")}</div>
          </div>
        </div>

        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{
            width: "48px", height: "48px", minWidth: "48px", display: "flex",
            alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)",
            border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)",
            background: jatuhTempo > 0 ? "var(--color-orange)" : "var(--color-white)",
          }}>
            <AlertTriangle size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem" }}>{jatuhTempo}</div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>{t("dashboard.debt.overdue")}</div>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card-brutal animate-bounce-in" style={{ padding: "2rem", marginBottom: "2rem", background: "var(--color-bg)", border: "3px solid var(--color-navy)", boxShadow: "6px 6px 0px var(--color-purple)" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", margin: "0 0 1.5rem 0", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Plus size={20} /> {t("dashboard.debt.addNewEntry")}
          </h3>

          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <button onClick={() => setNewEntry({ ...newEntry, type: "utang" })} className="btn-brutal" style={{
              flex: 1, padding: "0.85rem", fontWeight: 800,
              background: newEntry.type === "utang" ? "var(--color-orange)" : "var(--color-white)",
              color: newEntry.type === "utang" ? "var(--color-white)" : "var(--color-navy)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            }}>
              <ArrowDownLeft size={16} /> {t("dashboard.debt.iOwe")}
            </button>
            <button onClick={() => setNewEntry({ ...newEntry, type: "piutang" })} className="btn-brutal" style={{
              flex: 1, padding: "0.85rem", fontWeight: 800,
              background: newEntry.type === "piutang" ? "var(--color-lime)" : "var(--color-white)",
              color: "var(--color-navy)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            }}>
              <ArrowUpRight size={16} /> {t("dashboard.debt.iLend")}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.85rem", display: "block", marginBottom: "0.4rem", color: "var(--color-navy)" }}>
                {newEntry.type === "utang" ? t("dashboard.debt.lenderName") : t("dashboard.debt.borrowerName")}
              </label>
              <input
                value={newEntry.person}
                onChange={(e) => setNewEntry({ ...newEntry, person: e.target.value })}
                className="input-brutal"
                placeholder="Nama orang..."
                style={{ border: "2px solid var(--color-navy)", padding: "0.85rem", width: "100%", boxShadow: "3px 3px 0px var(--color-navy)", background: "var(--color-white)" }}
              />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.85rem", display: "block", marginBottom: "0.4rem", color: "var(--color-navy)" }}>
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
                style={{ border: "2px solid var(--color-navy)", padding: "0.85rem", width: "100%", fontWeight: 800, boxShadow: "3px 3px 0px var(--color-navy)", background: "var(--color-white)" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.85rem", display: "block", marginBottom: "0.4rem", color: "var(--color-navy)" }}>
                {t("dashboard.debt.descLabel")}
              </label>
              <input
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                className="input-brutal"
                placeholder="Untuk apa..."
                style={{ border: "2px solid var(--color-navy)", padding: "0.85rem", width: "100%", boxShadow: "3px 3px 0px var(--color-navy)", background: "var(--color-white)" }}
              />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.85rem", display: "block", marginBottom: "0.4rem", color: "var(--color-navy)" }}>
                {t("dashboard.debt.dueDate")}
              </label>
              <input
                value={newEntry.dueDate}
                onChange={(e) => setNewEntry({ ...newEntry, dueDate: e.target.value })}
                className="input-brutal"
                type="date"
                style={{ border: "2px solid var(--color-navy)", padding: "0.85rem", width: "100%", boxShadow: "3px 3px 0px var(--color-navy)", background: "var(--color-white)" }}
              />
            </div>
          </div>

          <button onClick={handleAdd} className="btn-brutal" style={{
            width: "100%", padding: "1rem", fontWeight: 900, fontSize: "1rem",
            background: "var(--color-purple)", color: "var(--color-white)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            border: "3px solid var(--color-navy)",
            boxShadow: "4px 4px 0px var(--color-navy)",
          }}>
            <Plus size={18} /> {t("dashboard.debt.save")}
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {[
          { id: "all" as const, label: t("dashboard.debt.filterAll"), icon: Filter },
          { id: "utang" as const, label: t("dashboard.debt.filterDebt"), icon: ArrowDownLeft },
          { id: "piutang" as const, label: t("dashboard.debt.filterLoan"), icon: ArrowUpRight },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="btn-brutal" style={{
            padding: "0.65rem 1.25rem", fontWeight: 800,
            background: activeTab === tab.id ? "var(--color-navy)" : "var(--color-white)",
            color: activeTab === tab.id ? "var(--color-white)" : "var(--color-navy)",
            display: "flex", alignItems: "center", gap: "0.5rem",
            boxShadow: activeTab === tab.id ? "4px 4px 0px var(--color-purple)" : "2px 2px 0px var(--color-navy)",
            transform: activeTab === tab.id ? "translate(-2px, -2px)" : "none",
          }}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Entries List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {filteredEntries.length === 0 && (
          <div className="card-brutal" style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>
            <HandCoins size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
            <p style={{ fontSize: "1.125rem", fontWeight: 700 }}>
              {searchQuery ? `${t("dashboard.debt.noMatch1")}${searchQuery}${t("dashboard.debt.noMatch2")}` : t("dashboard.debt.noData")}
            </p>
            {!searchQuery && <p style={{ fontSize: "0.9rem" }}>{t("dashboard.debt.addHint")}</p>}
          </div>
        )}

        {filteredEntries.map((entry) => {
          const statusInfo = getStatusBadge(entry.status, entry.dueDate);
          const StatusIcon = statusInfo.icon;
          return (
            <div key={entry.id} className="card-brutal" style={{
              padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem",
              opacity: entry.status === "lunas" ? 0.7 : 1,
            }}>
              {/* Type Icon */}
              <div style={{
                width: "52px", height: "52px", minWidth: "52px", borderRadius: "var(--radius-brutal-sm)",
                background: entry.type === "utang" ? "var(--color-orange)" : "var(--color-lime)",
                border: "2px solid var(--color-navy)", display: "flex",
                alignItems: "center", justifyContent: "center",
                boxShadow: "2px 2px 0px var(--color-navy)",
              }}>
                {entry.type === "utang"
                  ? <ArrowDownLeft size={26} color="var(--color-navy)" strokeWidth={2.5} />
                  : <ArrowUpRight size={26} color="var(--color-navy)" strokeWidth={2.5} />
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 800, fontSize: "1.0625rem", color: "var(--color-navy)" }}>
                    {entry.type === "utang" ? `${t("dashboard.debt.debtTo")} ${entry.person}` : `${t("dashboard.debt.loanFrom")} ${entry.person}`}
                  </span>
                  <div className={`badge-brutal badge-brutal--${statusInfo.color}`} style={{
                    display: "inline-flex", alignItems: "center", gap: "0.25rem",
                    padding: "0.15rem 0.5rem", fontSize: "0.7rem",
                  }}>
                    <StatusIcon size={10} /> {statusInfo.label}
                  </div>
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <span>{entry.description}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Calendar size={12} /> {t("dashboard.debt.dueDateShort")}: {displayDate(entry.dueDate)}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div style={{
                fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.25rem",
                color: entry.type === "utang" ? "var(--color-danger, #e74c3c)" : "var(--color-navy)",
                textDecoration: entry.status === "lunas" ? "line-through" : "none",
              }}>
                {formatRupiah(entry.amount)}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => toggleStatus(entry.id)} className="btn-brutal" style={{
                  width: "36px", height: "36px", padding: 0, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  background: entry.status === "lunas" ? "var(--color-lime)" : "var(--color-white)",
                  boxShadow: "2px 2px 0px var(--color-navy)",
                }} title={entry.status === "lunas" ? t("dashboard.debt.markUnpaid") : t("dashboard.debt.markPaid")}>
                  <CheckCircle2 size={16} color="var(--color-navy)" />
                </button>
                <button onClick={() => deleteEntry(entry.id)} className="btn-brutal" style={{
                  width: "36px", height: "36px", padding: 0, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  background: "var(--color-white)",
                  boxShadow: "2px 2px 0px var(--color-navy)",
                }} title={t("dashboard.debt.delete")}>
                  <X size={16} color="var(--color-navy)" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
