"use client";

import { useState, useEffect } from "react";
import { Trophy, Star, Flame, Zap, Target, Shield, Edit, Plus, X, Trash2, ChevronDown, Activity } from "lucide-react";
import { getBadges, createBadge, updateBadge, deleteBadge } from "./actions";
import { useLanguage } from "@/context/LanguageContext";

const BrutalSelect = ({ name, options, defaultValue }: { name: string, options: {value: string, label: string}[], defaultValue: string }) => {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState(defaultValue);
  const selectedOpt = options.find(o => o.value === val) || options[0];

  return (
    <div style={{ position: "relative" }}>
      <input type="hidden" name={name} value={val} />
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        className="input-brutal"
        style={{ 
          padding: "0.75rem", fontSize: "1rem", fontWeight: 700, 
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "var(--color-white)", cursor: "pointer"
        }}
      >
        <span>{selectedOpt.label}</span>
        <ChevronDown size={18} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, width: "100%", marginTop: "0.5rem",
          background: "var(--color-white)", border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
          boxShadow: "4px 4px 0px var(--color-navy)", zIndex: 100, maxHeight: "150px", overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column"
        }}>
          {options.map((opt, i) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setVal(opt.value); setOpen(false); }}
              style={{
                padding: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", border: "none", flexShrink: 0,
                background: val === opt.value ? "var(--color-purple)" : "transparent",
                color: val === opt.value ? "var(--color-white)" : "var(--color-navy)",
                fontWeight: 700, fontSize: "1rem", textAlign: "left", cursor: "pointer", 
                borderBottom: i < options.length - 1 ? "2px solid rgba(10,25,47,0.05)" : "none",
                borderTopLeftRadius: i === 0 ? "calc(var(--radius-brutal-sm) - 3px)" : "0",
                borderTopRightRadius: i === 0 ? "calc(var(--radius-brutal-sm) - 3px)" : "0",
                borderBottomLeftRadius: i === options.length - 1 ? "calc(var(--radius-brutal-sm) - 3px)" : "0",
                borderBottomRightRadius: i === options.length - 1 ? "calc(var(--radius-brutal-sm) - 3px)" : "0",
              }}
              onMouseEnter={(e) => { if(val !== opt.value) e.currentTarget.style.background = "var(--color-bg)" }}
              onMouseLeave={(e) => { if(val !== opt.value) e.currentTarget.style.background = "transparent" }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Convert icon references to string names for localStorage compatibility
const INITIAL_BADGES = [
  { id: "firstStep", name: "Langkah Pertama", icon: "Target", color: "purple", xp: 100, requirement: "Catat transaksi pertamamu", requirementType: "transaction_count", requirementValue: 1 },
  { id: "onFire", name: "Semangat!", icon: "Flame", color: "orange", xp: 150, requirement: "Aktif 3 hari berturut-turut", requirementType: "login_streak", requirementValue: 3 },
  { id: "consistent", name: "Konsisten", icon: "Zap", color: "lime", xp: 300, requirement: "Aktif 7 hari berturut-turut", requirementType: "login_streak", requirementValue: 7 },
  { id: "champion", name: "Sang Juara", icon: "Target", color: "orange", xp: 500, requirement: "Aktif 30 hari berturut-turut", requirementType: "login_streak", requirementValue: 30 },
  { id: "aiExplorer", name: "Penjelajah AI", icon: "Star", color: "purple", xp: 200, requirement: "Baca 5 Wawasan AI", requirementType: "ai_insight", requirementValue: 5 },
  { id: "hematMaster", name: "Master Hemat", icon: "Shield", color: "lime", xp: 400, requirement: "Tekan pengeluaran hingga 20%", requirementType: "budget_kept", requirementValue: 20 },
  { id: "bookworm", name: "Rajin Belajar", icon: "Star", color: "orange", xp: 250, requirement: "Selesaikan 3 modul edukasi", requirementType: "module_completed", requirementValue: 3 },
  { id: "legendary", name: "Legendaris", icon: "Target", color: "lime", xp: 1000, requirement: "Kumpulkan semua badge", requirementType: "badge_count", requirementValue: 7 },
];

const renderIcon = (iconName: string, size: number, color: string) => {
  switch (iconName) {
    case "Target": return <Target size={size} color={color} />;
    case "Shield": return <Shield size={size} color={color} />;
    case "Flame": return <Flame size={size} color={color} />;
    case "Zap": return <Zap size={size} color={color} />;
    case "Star": return <Star size={size} color={color} />;
    default: return <Star size={size} color={color} />;
  }
};

const renderRequirementType = (type: string, t: any) => {
  const lookup: Record<string, string> = {
    transaction_count: t("admin.gamification.req.transactionCount"),
    login_streak: t("admin.gamification.req.loginStreak"),
    module_completed: t("admin.gamification.req.moduleCompleted"),
    budget_kept: t("admin.gamification.req.budgetKept"),
    level_reached: t("admin.gamification.req.levelReached"),
    ai_insight: t("admin.gamification.req.aiInsight"),
    badge_count: t("admin.gamification.req.badgeCount"),
  };
  const fallback: Record<string, string> = {
    transaction_count: "Jumlah Transaksi",
    login_streak: "Login Streak (Hari)",
    module_completed: "Modul Diselesaikan",
    budget_kept: "Budget Terjaga",
    level_reached: "Level Dicapai",
    ai_insight: "Wawasan AI Dibaca",
    badge_count: "Total Badge",
  };
  const result = lookup[type];
  // If t() returned the key itself (not found), use fallback
  return result && !result.startsWith("admin.") ? result : (fallback[type] || type);
};

const LEVEL_CONFIG = [
  { level: 1,  xpMin: 0,    xpMax: 199,   label: "Newbie" },
  { level: 2,  xpMin: 200,  xpMax: 399,   label: "Pemula" },
  { level: 3,  xpMin: 400,  xpMax: 599,   label: "Penjelajah" },
  { level: 4,  xpMin: 600,  xpMax: 799,   label: "Aktif" },
  { level: 5,  xpMin: 800,  xpMax: 1199,  label: "Sadar Finansial" },
  { level: 6,  xpMin: 1200, xpMax: 1599,  label: "Teliti" },
  { level: 7,  xpMin: 1600, xpMax: 1999,  label: "Terencana" },
  { level: 8,  xpMin: 2000, xpMax: 2499,  label: "Disiplin" },
  { level: 9,  xpMin: 2500, xpMax: 2999,  label: "Bijaksana" },
  { level: 10, xpMin: 3000, xpMax: 3999,  label: "Si Hemat" },
  { level: 11, xpMin: 4000, xpMax: 4999,  label: "Ahli Keuangan" },
  { level: 12, xpMin: 5000, xpMax: 5999,  label: "Strategi" },
  { level: 13, xpMin: 6000, xpMax: 6999,  label: "Perencana Andal" },
  { level: 14, xpMin: 7000, xpMax: 7999,  label: "Konservatif" },
  { level: 15, xpMin: 8000, xpMax: 9999,  label: "Investor Muda" },
  { level: 16, xpMin: 10000, xpMax: 11999, label: "Eksekutor" },
  { level: 17, xpMin: 12000, xpMax: 13999, label: "Analis" },
  { level: 18, xpMin: 14000, xpMax: 15999, label: "Maestro" },
  { level: 19, xpMin: 16000, xpMax: 19999, label: "Visioner" },
  { level: 20, xpMin: 20000, xpMax: 99999, label: "Financial Guru" },
];

// AI Spending Profiles (separate from XP levels - assigned by ML model)
const AI_SPENDING_PROFILES = [
  { label: "Si Hemat",    color: "lime",   desc: "Pengeluaran terkontrol, rasio kebutuhan tinggi. Pola keuangan sehat.",             trigger: "Lebih dari 50% pengeluaran masuk ke kebutuhan pokok" },
  { label: "Si Boros",    color: "orange", desc: "Pengeluaran keinginan sangat tinggi. Perlu evaluasi dan perencanaan anggaran.",     trigger: "Lebih dari 50% pengeluaran dipakai untuk keinginan" },
  { label: "Si Impulsif", color: "pink",   desc: "Kebutuhan rendah namun keinginan tinggi. Menunjukkan pola belanja yang impulsif.", trigger: "Kurang dari 40% untuk kebutuhan & lebih dari 30% untuk keinginan" },
];

export default function AdminGamificationPage() {
  const { t } = useLanguage();
  const [badges, setBadgesState] = useState<any[]>(INITIAL_BADGES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fetchBadges = async () => {
    try {
      const data = await getBadges();
      if (data && data.length > 0) {
        setBadgesState(data.map((b: any) => ({
          ...b,
          color: b.color || "lime", // Use actual color from DB
          xp: b.xp || b.requirementValue,
          requirement: b.desc
        })));
      } else {
        setBadgesState(INITIAL_BADGES);
      }
    } catch (error) {
      console.error("Failed to fetch badges", error);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const setBadges = (newBadges: any[]) => {
    setBadgesState(newBadges);
  };

  const handleSaveBadge = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newBadgeData = {
      id: selectedBadge ? selectedBadge.id : formData.get("name")?.toString().toLowerCase().replace(/\s+/g, '_') || `badge_${Date.now()}`,
      name: formData.get("name") as string,
      desc: formData.get("requirement") as string,
      icon: formData.get("icon") as string,
      color: formData.get("color") as string,
      requirementType: formData.get("requirementType") as string,
      requirementValue: Number(formData.get("requirementValue")),
      xp: Number(formData.get("xp"))
    };
    
    if (selectedBadge) {
      await updateBadge(selectedBadge.id, newBadgeData);
    } else {
      await createBadge(newBadgeData);
    }
    
    await fetchBadges();
    setIsModalOpen(false);
  };

  const handleDeleteBadge = async () => {
    setConfirmDelete(true);
  };

  const executeDeleteBadge = async () => {
    if (selectedBadge) {
      await deleteBadge(selectedBadge.id);
      await fetchBadges();
      setConfirmDelete(false);
      setIsModalOpen(false);
    }
  };

  const openAddModal = () => {
    setSelectedBadge(null);
    setIsModalOpen(true);
  };

  const openEditModal = (badge: any) => {
    setSelectedBadge(badge);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div style={{
          width: "72px", height: "72px", background: "var(--color-purple)",
          borderRadius: "var(--radius-brutal-sm)", border: "3px solid var(--color-navy)",
          boxShadow: "4px 4px 0px var(--color-navy)", display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <Trophy size={40} color="var(--color-white)" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", marginBottom: "0.25rem", color: "var(--color-navy)", fontWeight: 800 }}>
            {t("admin.gamification.title")}
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
            {t("admin.gamification.desc")}
          </p>
        </div>
      </div>

      {/* Level Configuration */}
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "var(--color-navy)", marginBottom: "1rem" }}>{t("admin.gamification.levelConfig")}</h2>
      <div className="card-brutal" style={{ padding: 0, overflow: "hidden", marginBottom: "2.5rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--color-bg)", borderBottom: "3px solid var(--color-navy)" }}>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 800, color: "var(--color-navy)" }}>{t("admin.gamification.colLevel")}</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 800, color: "var(--color-navy)" }}>{t("admin.gamification.colXpReq")}</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 800, color: "var(--color-navy)" }}>{t("admin.gamification.colLabel")}</th>
              <th style={{ padding: "0.85rem 1rem", fontWeight: 800, color: "var(--color-navy)" }}>{t("admin.gamification.colAction")}</th>
            </tr>
          </thead>
          <tbody>
            {LEVEL_CONFIG.map((lv, i) => (
              <tr key={lv.level} style={{ borderBottom: i < LEVEL_CONFIG.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none" }}>
                <td style={{ padding: "0.85rem 1rem" }}>
                  <span style={{ fontWeight: 900, fontSize: "1rem", color: "var(--color-navy)", background: "var(--color-lime)", padding: "0.2rem 0.75rem", borderRadius: "100px", border: "2px solid var(--color-navy)" }}>LVL {lv.level}</span>
                </td>
                <td style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "var(--color-text-muted)" }}>{lv.xpMin.toLocaleString()} - {lv.xpMax.toLocaleString()} XP</td>
                <td style={{ padding: "0.85rem 1rem", fontWeight: 800, color: "var(--color-purple)" }}>{lv.label}</td>
                <td style={{ padding: "0.85rem 1rem" }}>
                  <button className="btn-brutal" style={{ padding: "0.4rem", background: "var(--color-bg)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", cursor: "pointer", boxShadow: "none" }}>
                    <Edit size={16} color="var(--color-navy)" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Spending Profiles Section */}
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "var(--color-navy)", marginBottom: "1rem" }}>
        {t("admin.gamification.aiProfileTitle")}
        <span style={{ marginLeft: "0.75rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", background: "var(--color-bg)", padding: "0.2rem 0.6rem", borderRadius: "100px", border: "1.5px solid var(--color-border)", verticalAlign: "middle" }}>
          {t("admin.gamification.aiAutoLabel")}
        </span>
      </h2>
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginBottom: "1rem", fontWeight: 500 }}>
        {t("admin.gamification.aiProfileDesc")}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        {AI_SPENDING_PROFILES.map((profile) => (
          <div key={profile.label} className="card-brutal" style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "flex-start", background: "var(--color-white)" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "var(--radius-brutal-sm)",
              background: `var(--color-${profile.color})`, border: "2.5px solid var(--color-navy)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              boxShadow: "3px 3px 0px var(--color-navy)"
            }}>
              <Trophy size={22} color="var(--color-navy)" />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: "1rem", color: "var(--color-navy)", marginBottom: "0.25rem" }}>{profile.label}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: 1.4, marginBottom: "0.4rem" }}>{profile.desc}</div>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-purple)", background: "var(--color-primary-light, rgba(98,54,255,0.1))", padding: "0.15rem 0.6rem", borderRadius: "100px", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                <Activity size={12} /> {profile.trigger}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Badges Grid */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", color: "var(--color-navy)", margin: 0 }}>{t("admin.gamification.badgesTitle")}</h2>
        <button onClick={openAddModal} className="btn-brutal" style={{ background: "var(--color-purple)", color: "var(--color-white)", padding: "0.5rem 1rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "3px 3px 0px var(--color-navy)" }}>
          <Plus size={16} /> {t("admin.gamification.addBadge")}
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {badges.map((badge, i) => (
          <div key={i} className="card-brutal" style={{ padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start", position: "relative" }}>
            <button
              onClick={() => openEditModal(badge)}
              className="btn-brutal"
              style={{ position: "absolute", top: "0.5rem", right: "0.5rem", padding: "0.4rem", background: "var(--color-bg)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", cursor: "pointer", boxShadow: "none" }}
            >
              <Edit size={16} color="var(--color-navy)" />
            </button>
            <div style={{
              width: "52px", height: "52px", borderRadius: "50%", background: `var(--color-${badge.color})`,
              border: "3px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              boxShadow: "3px 3px 0px var(--color-navy)"
            }}>
              {renderIcon(badge.icon, 24, "var(--color-navy)")}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--color-navy)", marginBottom: "0.25rem" }}>{badge.name}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: 1.4, marginBottom: "0.5rem" }}>
                {badge.desc || badge.requirement} 
                <br/>
                {badge.requirementType && badge.requirementValue && (
                  <span style={{ color: "var(--color-purple)", fontWeight: 700 }}>{t("admin.gamification.target") || "Target"}: {renderRequirementType(badge.requirementType, t)} ({badge.requirementValue})</span>
                )}
              </div>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.15rem 0.5rem", background: "var(--color-purple)", color: "var(--color-white)", borderRadius: "100px", border: "2px solid var(--color-navy)" }}>+{badge.xp || badge.requirementValue} XP</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Badge Modal */}
      {isModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(10, 25, 47, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "1rem" }}>
        <div className="card-brutal animate-bounce-in" style={{ background: "var(--color-white)", width: "100%", maxWidth: "500px", position: "relative", overflow: "visible" }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="btn-brutal"
              style={{ position: "absolute", top: "1rem", right: "1rem", padding: "0.5rem", background: "var(--color-danger, #e74c3c)", boxShadow: "none" }}
            >
              <X size={16} color="var(--color-white)" />
            </button>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Star size={24} color="var(--color-purple)" /> {selectedBadge ? t("admin.gamification.editBadge") : t("admin.gamification.addBadge")}
            </h2>
            
            <form onSubmit={handleSaveBadge} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className="input-group-brutal">
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>{t("admin.gamification.form.name")}</label>
                <input name="name" defaultValue={selectedBadge?.name || ""} required className="input-brutal" style={{ width: "100%" }} placeholder="Contoh: Sang Juara" />
              </div>
              <div className="input-group-brutal">
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>{t("admin.gamification.form.reqDesc")}</label>
                <input name="requirement" defaultValue={selectedBadge?.desc || selectedBadge?.requirement || ""} required className="input-brutal" style={{ width: "100%" }} placeholder="Contoh: Selesaikan 5 Modul Edukasi" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="input-group-brutal">
                  <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>{t("admin.gamification.form.reqType")}</label>
                  <BrutalSelect 
                    name="requirementType" 
                    defaultValue={selectedBadge?.requirementType || "module_completed"} 
                    options={[
                      { value: "module_completed", label: "Modul Diselesaikan" },
                      { value: "transaction_count", label: "Jumlah Transaksi" },
                      { value: "login_streak", label: "Login Streak (Hari)" },
                      { value: "budget_kept", label: "Budget Terjaga (Minggu)" },
                      { value: "level_reached", label: "Level Dicapai" },
                      { value: "ai_insight", label: "Wawasan AI Dibaca" },
                      { value: "badge_count", label: "Total Badge Dikumpulkan" }
                    ]}
                  />
                </div>
                <div className="input-group-brutal">
                  <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>{t("admin.gamification.form.reqValue")}</label>
                  <input name="requirementValue" type="number" defaultValue={selectedBadge?.requirementValue || 5} required className="input-brutal" style={{ width: "100%" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="input-group-brutal">
                  <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>{t("admin.gamification.form.xp")}</label>
                  <input name="xp" type="number" defaultValue={selectedBadge?.xp || 100} required className="input-brutal" style={{ width: "100%" }} />
                </div>
                <div className="input-group-brutal">
                  <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>{t("admin.gamification.form.color")}</label>
                  <BrutalSelect 
                    name="color" 
                    defaultValue={selectedBadge?.color || "lime"} 
                    options={[
                      { value: "lime", label: "Lime" },
                      { value: "purple", label: "Purple" },
                      { value: "orange", label: "Orange" },
                      { value: "pink", label: "Pink" }
                    ]}
                  />
                </div>
              </div>
              <div className="input-group-brutal">
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>{t("admin.gamification.form.icon")}</label>
                <BrutalSelect 
                  name="icon" 
                  defaultValue={selectedBadge?.icon || "Star"} 
                  options={[
                    { value: "Star", label: "Star" },
                    { value: "Target", label: "Target" },
                    { value: "Shield", label: "Shield" },
                    { value: "Flame", label: "Flame" },
                    { value: "Zap", label: "Zap" },
                    { value: "Trophy", label: "Trophy" },
                    { value: "Medal", label: "Medal" }
                  ]}
                />
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                {selectedBadge ? (
                  <button type="button" onClick={handleDeleteBadge} className="btn-brutal" style={{ background: "var(--color-pink)", color: "var(--color-white)", display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.5rem 1rem", boxShadow: "3px 3px 0px var(--color-navy)" }}>
                    <Trash2 size={16} /> {t("admin.form.delete")}
                  </button>
                ) : (
                  <div></div>
                )}
                
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-brutal" style={{ background: "var(--color-bg)", fontWeight: 700 }}>
                    {t("admin.form.cancel")}
                  </button>
                  <button type="submit" className="btn-brutal btn-brutal--primary" style={{ fontWeight: 800, background: "var(--color-purple)", color: "var(--color-white)" }}>
                    {t("admin.form.saveBadge")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirm Modal */}
      {confirmDelete && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(10, 25, 47, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div className="card-brutal animate-bounce-in" style={{ background: "var(--color-white)", width: "100%", maxWidth: "400px", padding: "2rem", textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", background: "var(--color-pink)", borderRadius: "50%", margin: "0 auto 1.5rem", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid var(--color-navy)", boxShadow: "4px 4px 0px var(--color-navy)" }}>
              <Trash2 size={32} color="var(--color-white)" />
            </div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "var(--color-navy)", marginBottom: "1rem" }}>{t("admin.form.delete")}?</h3>
            <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem", fontWeight: 500 }}>{t("admin.form.confirmDelete")}</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button type="button" onClick={() => setConfirmDelete(false)} className="btn-brutal" style={{ background: "var(--color-bg)", fontWeight: 700, flex: 1 }}>{t("admin.form.cancel")}</button>
              <button type="button" onClick={executeDeleteBadge} className="btn-brutal" style={{ background: "var(--color-pink)", color: "var(--color-white)", fontWeight: 800, flex: 1, boxShadow: "3px 3px 0px var(--color-navy)" }}>{t("admin.form.delete")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
