"use client";

import { useState } from "react";
import {
  HandCoins, Plus, ArrowDownLeft, ArrowUpRight,
  Calendar, User, AlertTriangle, CheckCircle2,
  X, Clock, Filter
} from "lucide-react";

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

const INITIAL_DATA: DebtEntry[] = [
  { id: 1, type: "utang", person: "Andi", amount: 500000, description: "Pinjam untuk bayar kos", dueDate: "2026-05-15", status: "belum_lunas", createdAt: "2026-04-20" },
  { id: 2, type: "piutang", person: "Budi", amount: 250000, description: "Minjemin buat beli buku", dueDate: "2026-05-10", status: "belum_lunas", createdAt: "2026-04-25" },
  { id: 3, type: "utang", person: "Sari", amount: 150000, description: "Pinjam untuk makan", dueDate: "2026-04-30", status: "jatuh_tempo", createdAt: "2026-04-15" },
  { id: 4, type: "piutang", person: "Dina", amount: 300000, description: "Talangan beli tiket", dueDate: "2026-04-28", status: "lunas", createdAt: "2026-04-10" },
];

export default function DebtPage() {
  const [entries, setEntries] = useState<DebtEntry[]>(INITIAL_DATA);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "utang" | "piutang">("all");
  const [newEntry, setNewEntry] = useState({
    type: "utang" as DebtType,
    person: "",
    amount: "",
    description: "",
    dueDate: "",
  });

  const filteredEntries = entries.filter(e =>
    activeTab === "all" ? true : e.type === activeTab
  );

  const totalUtang = entries.filter(e => e.type === "utang" && e.status !== "lunas").reduce((sum, e) => sum + e.amount, 0);
  const totalPiutang = entries.filter(e => e.type === "piutang" && e.status !== "lunas").reduce((sum, e) => sum + e.amount, 0);
  const jatuhTempo = entries.filter(e => e.status === "jatuh_tempo").length;

  const formatRupiah = (num: number) => `Rp ${num.toLocaleString("id-ID")}`;

  const handleAdd = () => {
    if (!newEntry.person || !newEntry.amount || !newEntry.dueDate) return;
    const entry: DebtEntry = {
      id: Date.now(),
      type: newEntry.type,
      person: newEntry.person,
      amount: parseInt(newEntry.amount),
      description: newEntry.description,
      dueDate: newEntry.dueDate,
      status: "belum_lunas",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setEntries([entry, ...entries]);
    setNewEntry({ type: "utang", person: "", amount: "", description: "", dueDate: "" });
    setShowForm(false);
  };

  const toggleStatus = (id: number) => {
    setEntries(entries.map(e =>
      e.id === id
        ? { ...e, status: e.status === "lunas" ? "belum_lunas" : "lunas" }
        : e
    ));
  };

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const getStatusBadge = (status: DebtStatus) => {
    switch (status) {
      case "lunas": return { label: "Lunas", color: "lime", icon: CheckCircle2 };
      case "jatuh_tempo": return { label: "Jatuh Tempo", color: "orange", icon: AlertTriangle };
      default: return { label: "Belum Lunas", color: "purple", icon: Clock };
    }
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
              Utang & Piutang
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
              Catat dan kelola utang-piutangmu dengan rapi. Jangan sampai lupa!
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
          {showForm ? <><X size={18} /> Batal</> : <><Plus size={18} /> Tambah Baru</>}
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
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Total Utang</div>
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
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Total Piutang</div>
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
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Jatuh Tempo</div>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card-brutal animate-bounce-in" style={{ padding: "2rem", marginBottom: "2rem", background: "var(--color-bg)", border: "3px solid var(--color-navy)", boxShadow: "6px 6px 0px var(--color-purple)" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", margin: "0 0 1.5rem 0", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Plus size={20} /> Tambah Entri Baru
          </h3>

          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <button onClick={() => setNewEntry({ ...newEntry, type: "utang" })} className="btn-brutal" style={{
              flex: 1, padding: "0.85rem", fontWeight: 800,
              background: newEntry.type === "utang" ? "var(--color-orange)" : "var(--color-white)",
              color: newEntry.type === "utang" ? "var(--color-white)" : "var(--color-navy)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            }}>
              <ArrowDownLeft size={16} /> Saya Berutang
            </button>
            <button onClick={() => setNewEntry({ ...newEntry, type: "piutang" })} className="btn-brutal" style={{
              flex: 1, padding: "0.85rem", fontWeight: 800,
              background: newEntry.type === "piutang" ? "var(--color-lime)" : "var(--color-white)",
              color: "var(--color-navy)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            }}>
              <ArrowUpRight size={16} /> Saya Meminjamkan
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.85rem", display: "block", marginBottom: "0.4rem", color: "var(--color-navy)" }}>
                {newEntry.type === "utang" ? "NAMA PEMBERI PINJAMAN" : "NAMA PEMINJAM"}
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
                NOMINAL (RP)
              </label>
              <input
                value={newEntry.amount}
                onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                className="input-brutal"
                type="number"
                placeholder="0"
                style={{ border: "2px solid var(--color-navy)", padding: "0.85rem", width: "100%", fontWeight: 800, boxShadow: "3px 3px 0px var(--color-navy)", background: "var(--color-white)" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.85rem", display: "block", marginBottom: "0.4rem", color: "var(--color-navy)" }}>
                KETERANGAN
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
                JATUH TEMPO
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
            background: "var(--color-navy)", color: "var(--color-white)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            boxShadow: "4px 4px 0px var(--color-lime)",
          }}>
            <Plus size={18} /> Simpan
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {[
          { id: "all" as const, label: "Semua", icon: Filter },
          { id: "utang" as const, label: "Utang Saya", icon: ArrowDownLeft },
          { id: "piutang" as const, label: "Piutang Saya", icon: ArrowUpRight },
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
            <p style={{ fontSize: "1.125rem", fontWeight: 700 }}>Belum ada data</p>
            <p style={{ fontSize: "0.9rem" }}>Klik &quot;Tambah Baru&quot; untuk menambahkan entri utang/piutang.</p>
          </div>
        )}

        {filteredEntries.map((entry) => {
          const statusInfo = getStatusBadge(entry.status);
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
                    {entry.type === "utang" ? `Utang ke ${entry.person}` : `Piutang dari ${entry.person}`}
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
                    <Calendar size={12} /> Tenggat: {new Date(entry.dueDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
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
                }} title={entry.status === "lunas" ? "Tandai belum lunas" : "Tandai lunas"}>
                  <CheckCircle2 size={16} color="var(--color-navy)" />
                </button>
                <button onClick={() => deleteEntry(entry.id)} className="btn-brutal" style={{
                  width: "36px", height: "36px", padding: 0, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  background: "var(--color-white)",
                  boxShadow: "2px 2px 0px var(--color-navy)",
                }} title="Hapus">
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
