"use client";

import { useState } from "react";
import {
  Target, Wallet, ShieldCheck, PiggyBank,
  TrendingUp, ArrowRight, Plus, CheckCircle2,
  Edit3, Trash2, Sparkles, AlertTriangle,
  Home, Gamepad2, Banknote, Utensils, Car,
  Smartphone, Tv, ShoppingCart, Coffee, Candy,
  Shield, Laptop, Plane, GraduationCap
} from "lucide-react";
import React from "react";

// ── Icon Mapping (replaces emojis) ──────────────
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  home: Home,
  utensils: Utensils,
  car: Car,
  smartphone: Smartphone,
  tv: Tv,
  cart: ShoppingCart,
  coffee: Coffee,
  candy: Candy,
  shield: Shield,
  laptop: Laptop,
  plane: Plane,
  target: Target,
  graduation: GraduationCap,
  piggybank: PiggyBank,
};

const IconBox = ({ iconKey, size = 20, bg }: { iconKey: string; size?: number; bg?: string }) => {
  const Icon = ICON_MAP[iconKey] || Target;
  return (
    <div style={{
      width: `${size + 16}px`, height: `${size + 16}px`, minWidth: `${size + 16}px`,
      display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)",
      background: bg || "var(--color-bg)", boxShadow: "2px 2px 0px var(--color-navy)",
    }}>
      <Icon size={size} color="var(--color-navy)" strokeWidth={2.5} />
    </div>
  );
};

// ── Budget Allocation Data ──────────────────────────
interface BudgetCategory {
  id: string;
  name: string;
  type: "needs" | "wants";
  allocated: number;
  spent: number;
  icon: string;
}

const INITIAL_BUDGET: BudgetCategory[] = [
  { id: "kos", name: "Kos / Kontrakan", type: "needs", allocated: 1200000, spent: 1200000, icon: "home" },
  { id: "makan", name: "Makan & Minum", type: "needs", allocated: 900000, spent: 750000, icon: "utensils" },
  { id: "transport", name: "Transportasi", type: "needs", allocated: 400000, spent: 320000, icon: "car" },
  { id: "pulsa", name: "Pulsa & Internet", type: "needs", allocated: 150000, spent: 150000, icon: "smartphone" },
  { id: "streaming", name: "Streaming & Hiburan", type: "wants", allocated: 200000, spent: 154000, icon: "tv" },
  { id: "belanja", name: "Belanja Online", type: "wants", allocated: 300000, spent: 280000, icon: "cart" },
  { id: "nongkrong", name: "Nongkrong & Kopi", type: "wants", allocated: 250000, spent: 190000, icon: "coffee" },
  { id: "jajan", name: "Jajan & Cemilan", type: "wants", allocated: 150000, spent: 95000, icon: "candy" },
];

// ── Savings Targets ─────────────────────────────────
interface SavingsTarget {
  id: number;
  name: string;
  target: number;
  current: number;
  icon: string;
  color: string;
  deadline: string;
}

const INITIAL_TARGETS: SavingsTarget[] = [
  { id: 1, name: "Dana Darurat", target: 9000000, current: 3200000, icon: "shield", color: "lime", deadline: "Des 2026" },
  { id: 2, name: "MacBook Baru", target: 15000000, current: 5500000, icon: "laptop", color: "purple", deadline: "Jun 2027" },
  { id: 3, name: "Liburan Bali", target: 3000000, current: 1800000, icon: "plane", color: "orange", deadline: "Agu 2026" },
];

const ICON_OPTIONS = [
  { key: "target", label: "Target" },
  { key: "piggybank", label: "Tabungan" },
  { key: "home", label: "Rumah" },
  { key: "car", label: "Kendaraan" },
  { key: "laptop", label: "Laptop" },
  { key: "plane", label: "Travel" },
  { key: "smartphone", label: "Gadget" },
  { key: "graduation", label: "Pendidikan" },
];

export default function PlanningPage() {
  const [budget] = useState(INITIAL_BUDGET);
  const [targets, setTargets] = useState(INITIAL_TARGETS);
  const [activeView, setActiveView] = useState<"budget" | "targets">("budget");
  const [showAddTarget, setShowAddTarget] = useState(false);
  const [newTarget, setNewTarget] = useState({ name: "", target: "", icon: "target", deadline: "" });

  const income = 4500000;
  const needsItems = budget.filter(b => b.type === "needs");
  const wantsItems = budget.filter(b => b.type === "wants");
  const totalNeeds = needsItems.reduce((s, b) => s + b.allocated, 0);
  const totalWants = wantsItems.reduce((s, b) => s + b.allocated, 0);
  const totalSpentNeeds = needsItems.reduce((s, b) => s + b.spent, 0);
  const totalSpentWants = wantsItems.reduce((s, b) => s + b.spent, 0);
  const totalSavings = income - totalNeeds - totalWants;
  const needsPercent = Math.round((totalNeeds / income) * 100);
  const wantsPercent = Math.round((totalWants / income) * 100);
  const savingsPercent = Math.round((totalSavings / income) * 100);

  const formatRp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  const emergencyFundTarget = totalNeeds * 6;
  const emergencyFundCurrent = targets.find(t => t.name === "Dana Darurat")?.current || 0;
  const emergencyMonths = Math.floor(emergencyFundCurrent / (totalNeeds > 0 ? totalNeeds : 1));

  const handleAddTarget = () => {
    if (!newTarget.name || !newTarget.target) return;
    setTargets([...targets, {
      id: Date.now(), name: newTarget.name, target: parseInt(newTarget.target),
      current: 0, icon: newTarget.icon, color: "purple", deadline: newTarget.deadline || "TBD"
    }]);
    setNewTarget({ name: "", target: "", icon: "target", deadline: "" });
    setShowAddTarget(false);
  };

  const deleteTarget = (id: number) => setTargets(targets.filter(t => t.id !== id));

  // ── Budget category row ───────────────
  const BudgetRow = ({ item }: { item: BudgetCategory }) => {
    const pct = Math.round((item.spent / item.allocated) * 100);
    const isOverBudget = item.spent > item.allocated;
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem",
        background: "var(--color-white)", border: "2px solid var(--color-navy)",
        borderRadius: "var(--radius-brutal-sm)", boxShadow: "2px 2px 0px var(--color-navy)",
      }}>
        <IconBox iconKey={item.icon} size={20} bg={item.type === "needs" ? "var(--color-lime)" : "var(--color-orange)"} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
            <span style={{ fontWeight: 800, fontSize: "0.9375rem" }}>{item.name}</span>
            <span style={{ fontWeight: 800, fontFamily: "var(--font-heading)", fontSize: "0.9375rem", color: isOverBudget ? "var(--color-danger, #e74c3c)" : "var(--color-navy)" }}>
              {formatRp(item.spent)} / {formatRp(item.allocated)}
            </span>
          </div>
          <div style={{ width: "100%", height: "10px", background: "var(--color-bg)", border: "1.5px solid var(--color-navy)", borderRadius: "100px", overflow: "hidden" }}>
            <div style={{
              width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: "100px",
              background: isOverBudget ? "var(--color-danger, #e74c3c)" : pct > 80 ? "var(--color-orange)" : `var(--color-${item.type === "needs" ? "lime" : "purple"})`,
              transition: "width 0.5s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.2rem" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-text-muted)" }}>{pct}% terpakai</span>
            {isOverBudget && (
              <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--color-danger, #e74c3c)", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                <AlertTriangle size={10} /> Over budget!
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ paddingBottom: "3rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div style={{
          width: "72px", height: "72px", background: "var(--color-purple)",
          borderRadius: "var(--radius-brutal-sm)", border: "3px solid var(--color-navy)",
          boxShadow: "4px 4px 0px var(--color-navy)", display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <Target size={40} color="var(--color-white)" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", marginBottom: "0.25rem", color: "var(--color-navy)", fontWeight: 800 }}>
            Perencanaan Keuangan
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
            Atur alokasi budget dan target tabunganmu. Keuangan terencana = hidup tenang!
          </p>
        </div>
      </div>

      {/* Overview Cards — 50/30/20 Rule */}
      <div className="card-brutal animate-bounce-in" style={{ padding: "2rem", marginBottom: "2rem", background: "var(--color-navy)", color: "var(--color-white)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <Sparkles size={24} color="var(--color-lime)" />
        </div>

        <div style={{ display: "flex", height: "40px", borderRadius: "var(--radius-brutal-sm)", border: "3px solid var(--color-white)", overflow: "hidden", marginBottom: "1rem" }}>
          <div style={{ width: `${needsPercent}%`, background: "var(--color-lime)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.8rem", color: "var(--color-navy)", borderRight: "2px solid var(--color-navy)" }}>
            Needs {needsPercent}%
          </div>
          <div style={{ width: `${wantsPercent}%`, background: "var(--color-orange)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.8rem", color: "var(--color-navy)", borderRight: "2px solid var(--color-navy)" }}>
            Wants {wantsPercent}%
          </div>
          <div style={{ width: `${savingsPercent}%`, background: "var(--color-purple)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.8rem", color: "var(--color-white)" }}>
            Save {savingsPercent}%
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          {[
            { label: "Kebutuhan (Needs)", amount: totalNeeds, spent: totalSpentNeeds, color: "lime", Icon: Home },
            { label: "Keinginan (Wants)", amount: totalWants, spent: totalSpentWants, color: "orange", Icon: Gamepad2 },
            { label: "Tabungan (Savings)", amount: totalSavings, spent: 0, color: "purple", Icon: Banknote },
          ].map(s => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.1)", borderRadius: "var(--radius-brutal-sm)",
              padding: "1rem", border: "2px solid rgba(255,255,255,0.15)",
            }}>
              <s.Icon size={22} color={`var(--color-${s.color})`} strokeWidth={2.5} style={{ marginBottom: "0.35rem" }} />
              <div style={{ fontSize: "0.75rem", fontWeight: 700, opacity: 0.7, marginBottom: "0.35rem" }}>{s.label}</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800 }}>{formatRp(s.amount)}</div>
              {s.spent > 0 && (
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: `var(--color-${s.color})`, marginTop: "0.25rem" }}>
                  Terpakai: {formatRp(s.spent)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tab Switch */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <button onClick={() => setActiveView("budget")} className="btn-brutal" style={{
          padding: "0.75rem 1.5rem", fontWeight: 800,
          background: activeView === "budget" ? "var(--color-navy)" : "var(--color-white)",
          color: activeView === "budget" ? "var(--color-white)" : "var(--color-navy)",
          display: "flex", alignItems: "center", gap: "0.5rem",
          boxShadow: activeView === "budget" ? "4px 4px 0px var(--color-lime)" : "2px 2px 0px var(--color-navy)",
          transform: activeView === "budget" ? "translate(-2px, -2px)" : "none",
        }}>
          <Wallet size={18} /> Alokasi Budget
        </button>
        <button onClick={() => setActiveView("targets")} className="btn-brutal" style={{
          padding: "0.75rem 1.5rem", fontWeight: 800,
          background: activeView === "targets" ? "var(--color-navy)" : "var(--color-white)",
          color: activeView === "targets" ? "var(--color-white)" : "var(--color-navy)",
          display: "flex", alignItems: "center", gap: "0.5rem",
          boxShadow: activeView === "targets" ? "4px 4px 0px var(--color-purple)" : "2px 2px 0px var(--color-navy)",
          transform: activeView === "targets" ? "translate(-2px, -2px)" : "none",
        }}>
          <PiggyBank size={18} /> Target Tabungan
        </button>
      </div>

      {/* ── BUDGET VIEW ────────────────────── */}
      {activeView === "budget" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ width: "12px", height: "12px", background: "var(--color-lime)", border: "2px solid var(--color-navy)", borderRadius: "3px" }} />
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", margin: 0, color: "var(--color-navy)" }}>
                Kebutuhan (Needs) — {formatRp(totalNeeds)}
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {needsItems.map(item => <BudgetRow key={item.id} item={item} />)}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ width: "12px", height: "12px", background: "var(--color-orange)", border: "2px solid var(--color-navy)", borderRadius: "3px" }} />
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", margin: 0, color: "var(--color-navy)" }}>
                Keinginan (Wants) — {formatRp(totalWants)}
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {wantsItems.map(item => <BudgetRow key={item.id} item={item} />)}
            </div>
          </div>
        </div>
      )}

      {/* ── TARGETS VIEW ───────────────────── */}
      {activeView === "targets" && (
        <div>
          {/* Emergency Fund */}
          <div className="card-brutal" style={{
            padding: "1.5rem", marginBottom: "2rem",
            background: emergencyMonths >= 3 ? "var(--color-lime)" : "var(--color-orange)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <ShieldCheck size={32} color="var(--color-navy)" strokeWidth={2.5} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.125rem", fontWeight: 800, color: "var(--color-navy)" }}>
                  Dana Darurat: {emergencyMonths} bulan pengeluaran tersimpan
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--color-navy)", opacity: 0.8 }}>
                  Idealnya 3–6 bulan. Target: {formatRp(emergencyFundTarget)} | Terkumpul: {formatRp(emergencyFundCurrent)}
                </div>
              </div>
              <div style={{
                fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 900,
                color: "var(--color-navy)", padding: "0.5rem 1rem",
                background: "var(--color-white)", border: "2px solid var(--color-navy)",
                borderRadius: "var(--radius-brutal-sm)", boxShadow: "2px 2px 0px var(--color-navy)",
              }}>
                {Math.round((emergencyFundCurrent / emergencyFundTarget) * 100)}%
              </div>
            </div>
          </div>

          {/* Savings Targets Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", margin: 0, color: "var(--color-navy)" }}>
              Target Tabungan
            </h3>
            <button onClick={() => setShowAddTarget(!showAddTarget)} className="btn-brutal" style={{
              padding: "0.6rem 1rem", fontWeight: 800, fontSize: "0.875rem",
              background: showAddTarget ? "var(--color-orange)" : "var(--color-navy)",
              color: "var(--color-white)", display: "flex", alignItems: "center", gap: "0.4rem",
              boxShadow: "3px 3px 0px var(--color-navy)",
            }}>
              <Plus size={16} /> {showAddTarget ? "Batal" : "Tambah Target"}
            </button>
          </div>

          {/* Add Target Form */}
          {showAddTarget && (
            <div className="card-brutal animate-bounce-in" style={{ padding: "1.5rem", marginBottom: "1.5rem", background: "var(--color-bg)", boxShadow: "4px 4px 0px var(--color-purple)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
                <div>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.8rem", display: "block", marginBottom: "0.4rem" }}>ICON</label>
                  <select value={newTarget.icon} onChange={e => setNewTarget({ ...newTarget, icon: e.target.value })} className="input-brutal" style={{ border: "2px solid var(--color-navy)", padding: "0.65rem", fontSize: "0.8rem", fontWeight: 700, width: "120px" }}>
                    {ICON_OPTIONS.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.8rem", display: "block", marginBottom: "0.4rem" }}>NAMA TARGET</label>
                  <input value={newTarget.name} onChange={e => setNewTarget({ ...newTarget, name: e.target.value })} className="input-brutal" placeholder="Contoh: Dana Nikah" style={{ border: "2px solid var(--color-navy)", padding: "0.65rem", width: "100%", boxShadow: "2px 2px 0px var(--color-navy)" }} />
                </div>
                <div>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.8rem", display: "block", marginBottom: "0.4rem" }}>TARGET (RP)</label>
                  <input value={newTarget.target} onChange={e => setNewTarget({ ...newTarget, target: e.target.value })} className="input-brutal" type="number" placeholder="0" style={{ border: "2px solid var(--color-navy)", padding: "0.65rem", width: "100%", fontWeight: 800, boxShadow: "2px 2px 0px var(--color-navy)" }} />
                </div>
                <button onClick={handleAddTarget} className="btn-brutal" style={{
                  padding: "0.65rem 1rem", background: "var(--color-navy)", color: "var(--color-white)", fontWeight: 800,
                  display: "flex", alignItems: "center", gap: "0.4rem",
                }}>
                  <Plus size={16} /> Simpan
                </button>
              </div>
            </div>
          )}

          {/* Target Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {targets.map(t => {
              const pct = Math.round((t.current / t.target) * 100);
              const remaining = t.target - t.current;
              return (
                <div key={t.id} className="card-brutal" style={{ padding: "1.75rem", position: "relative" }}>
                  <button onClick={() => deleteTarget(t.id)} style={{
                    position: "absolute", top: "0.75rem", right: "0.75rem", background: "none",
                    border: "none", cursor: "pointer", opacity: 0.4, transition: "opacity 0.2s",
                  }} onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.4")}>
                    <Trash2 size={16} color="var(--color-navy)" />
                  </button>

                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                    <IconBox iconKey={t.icon} size={28} bg={`var(--color-${t.color})`} />
                    <div>
                      <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: "var(--color-navy)" }}>{t.name}</div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-text-muted)" }}>Target: {t.deadline}</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <span style={{ fontWeight: 800, fontSize: "1rem", fontFamily: "var(--font-heading)" }}>{formatRp(t.current)}</span>
                      <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-text-muted)" }}>{formatRp(t.target)}</span>
                    </div>
                    <div className="progress-brutal" style={{ height: "20px", border: "2px solid var(--color-navy)" }}>
                      <div className="progress-brutal__fill" style={{ width: `${pct}%`, background: `var(--color-${t.color})`, borderRight: pct > 0 ? "2px solid var(--color-navy)" : "none" }} />
                      <div className="progress-brutal__label" style={{ fontSize: "0.8rem", fontWeight: 800 }}>{pct}%</div>
                    </div>
                  </div>

                  <div style={{ fontSize: "0.875rem", color: "var(--color-navy)", fontWeight: 600 }}>
                    Kurang <span style={{ fontWeight: 800, color: `var(--color-${t.color})` }}>{formatRp(remaining)}</span> lagi!
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
