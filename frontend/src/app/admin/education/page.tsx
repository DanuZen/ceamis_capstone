"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, X, BookOpen, FileText, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { getModules, createModule, updateModule, deleteModule } from "./actions";
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
        <div className="no-scrollbar" style={{
          position: "absolute", top: "100%", left: 0, width: "100%", marginTop: "0.5rem",
          background: "var(--color-white)", border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
          boxShadow: "4px 4px 0px var(--color-navy)", zIndex: 10, maxHeight: "250px", overflowY: "auto", display: "flex", flexDirection: "column"
        }}>
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setVal(opt.value); setOpen(false); }}
              style={{
                padding: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", border: "none",
                background: val === opt.value ? "var(--color-purple)" : "transparent",
                color: val === opt.value ? "var(--color-white)" : "var(--color-navy)",
                fontWeight: 700, fontSize: "1rem", textAlign: "left", cursor: "pointer", borderBottom: "2px solid rgba(10,25,47,0.05)"
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

export default function AdminEducationPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [modules, setModulesState] = useState<any[]>([]);
  
  const fetchModules = async () => {
    try {
      const data = await getModules();
      setModulesState(data);
    } catch (error) {
      console.error("Failed to load modules:", error);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const setModules = (newModules: any[]) => {
    setModulesState(newModules);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };
  
  const confirmDelete = async () => {
    if (deleteConfirmId !== null) {
      await deleteModule(deleteConfirmId);
      await fetchModules();
      setDeleteConfirmId(null);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (editingItem) {
      const updatedItem = {
        title: formData.get("title") as string,
        category: formData.get("category") as string,
        status: editingItem.status || "draft",
        points: Number(formData.get("points")) || 200,
        desc: formData.get("desc") as string,
        duration: formData.get("duration") as string,
      };
      await updateModule(editingItem.id, updatedItem);
      await fetchModules();
      setIsModalOpen(false);
    } else {
      const newModuleData = {
        title: formData.get("title") as string,
        category: formData.get("category") as string,
        status: "draft",
        points: Number(formData.get("points")) || 200,
        desc: formData.get("desc") as string,
        duration: formData.get("duration") as string,
      };
      const created = await createModule(newModuleData);
      await fetchModules();
      setIsModalOpen(false);
      
      // Auto redirect to content editor
      router.push(`/admin/education/edit-module/${created.id}`);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{
            width: "72px", height: "72px", background: "var(--color-purple)",
            borderRadius: "var(--radius-brutal-sm)", border: "3px solid var(--color-navy)",
            boxShadow: "4px 4px 0px var(--color-navy)", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <BookOpen size={40} color="var(--color-white)" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", marginBottom: "0.25rem", color: "var(--color-navy)", fontWeight: 800 }}>
              {t("admin.education.title")}
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
              {t("admin.education.desc")}
            </p>
          </div>
        </div>
        <button onClick={openAddModal} className="btn-brutal" style={{ background: "var(--color-lime)", color: "var(--color-navy)", padding: "0.75rem 1.5rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "3px 3px 0px var(--color-navy)", marginLeft: "auto" }}>
          <Plus size={18} /> {t("admin.education.addModule")}
        </button>
      </div>

      <div className="card-brutal animate-fade-in" style={{ padding: 0, overflow: "hidden", background: "var(--color-white)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "600px" }}>
            <thead>
              <tr style={{ background: "var(--color-bg)", borderBottom: "3px solid var(--color-navy)" }}>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)" }}>{t("admin.dashboard.colTitle")}</th>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)" }}>{t("admin.dashboard.colCategory")}</th>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)" }}>{t("admin.dashboard.colStatus")}</th>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)" }}>{t("admin.dashboard.colXp")}</th>
                <th style={{ padding: "1.25rem", fontWeight: 800, color: "var(--color-navy)", width: "160px", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((mod, i) => (
                <tr key={mod.id} style={{ borderBottom: i < modules.length - 1 ? "2px solid rgba(10, 25, 47, 0.05)" : "none" }}>
                  <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "var(--color-navy)" }}>{mod.title}</td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span className="badge-brutal" style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", background: "var(--color-bg)", boxShadow: "none" }}>{mod.category}</span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span className="badge-brutal" style={{ background: mod.status === "published" ? "var(--color-lime)" : "var(--color-border)", fontSize: "0.75rem", padding: "0.2rem 0.6rem", boxShadow: "none" }}>
                      {mod.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span className="badge-brutal" style={{ background: "var(--color-lime)", fontSize: "0.75rem", padding: "0.2rem 0.6rem", boxShadow: "none" }}>+{mod.points || 200} XP</span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                      <button onClick={() => router.push(`/admin/education/edit-module/${mod.id}`)} className="btn-brutal" title="Edit Konten" style={{ padding: "0.4rem", background: "var(--color-lime)", cursor: "pointer", boxShadow: "none" }}>
                        <FileText size={16} color="var(--color-navy)" />
                      </button>
                      <button onClick={() => openEditModal(mod)} className="btn-brutal" title="Edit Metadata" style={{ padding: "0.4rem", background: "var(--color-purple)", cursor: "pointer", boxShadow: "none" }}>
                        <Edit size={16} color="var(--color-white)" />
                      </button>
                      <button onClick={() => handleDelete(mod.id)} className="btn-brutal" title="Hapus" style={{ padding: "0.4rem", background: "var(--color-danger, #e74c3c)", cursor: "pointer", boxShadow: "none" }}>
                        <Trash2 size={16} color="var(--color-white)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {modules.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)", fontWeight: 600 }}>
                    {t("admin.dashboard.noModules")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(10, 25, 47, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "1rem" }}>
          <div className="card-brutal animate-bounce-in" style={{ background: "var(--color-white)", width: "100%", maxWidth: "500px", position: "relative" }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="btn-brutal"
              style={{ position: "absolute", top: "1rem", right: "1rem", padding: "0.5rem", background: "var(--color-danger, #e74c3c)", boxShadow: "none" }}
            >
              <X size={16} color="var(--color-white)" />
            </button>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <BookOpen size={24} color="var(--color-lime)" />
              {editingItem ? t("admin.education.editModule") : t("admin.education.addModule")}
            </h2>
            
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className="input-group-brutal">
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>{t("admin.education.form.titleLabel")}</label>
                <input name="title" defaultValue={editingItem?.title} required className="input-brutal" style={{ width: "100%" }} placeholder={t("admin.education.form.titlePlaceholder")} />
              </div>
              <div className="input-group-brutal">
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>{t("admin.education.form.category")}</label>
                <BrutalSelect 
                  name="category"
                  defaultValue={editingItem?.category || "Dasar"}
                  options={[
                    { value: "Dasar", label: "Dasar" },
                    { value: "Investasi", label: "Investasi" },
                    { value: "Utang", label: "Utang" }
                  ]}
                />
              </div>
              <div className="input-group-brutal">
                <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>{t("admin.education.form.descLabel")}</label>
                <input name="description" defaultValue={editingItem?.description || ""} required className="input-brutal" style={{ width: "100%" }} placeholder={t("admin.education.form.descPlaceholder")} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="input-group-brutal">
                  <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>{t("admin.education.form.estTime")}</label>
                  <input name="duration" defaultValue={editingItem?.duration || "5 menit"} required className="input-brutal" style={{ width: "100%" }} placeholder="Contoh: 5 menit" />
                </div>
                <div className="input-group-brutal">
                  <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>{t("admin.gamification.form.xp")}</label>
                  <input name="points" type="number" defaultValue={editingItem?.points || 200} required className="input-brutal" style={{ width: "100%" }} />
                </div>
              </div>
              
              <div style={{ display: "flex", justifyContent: editingItem ? "space-between" : "flex-end", gap: "1rem", marginTop: "1rem" }}>
                {editingItem && (
                  <button type="button" onClick={() => handleDelete(editingItem.id)} className="btn-brutal" style={{ background: "var(--color-danger, #e74c3c)", color: "var(--color-white)", display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.5rem 1rem", boxShadow: "3px 3px 0px var(--color-navy)" }}>
                    <Trash2 size={16} /> {t("admin.form.delete")}
                  </button>
                )}
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-brutal" style={{ background: "var(--color-bg)", fontWeight: 700 }}>
                    {t("admin.form.cancel")}
                  </button>
                  <button type="submit" className="btn-brutal btn-brutal--primary" style={{ fontWeight: 800, background: "var(--color-purple)", color: "var(--color-white)" }}>
                    {t("admin.form.save")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(10, 25, 47, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "1rem" }}>
          <div className="card-brutal animate-bounce-in" style={{ background: "var(--color-white)", width: "100%", maxWidth: "400px", padding: "2rem", textAlign: "center", border: "3px solid var(--color-navy)" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1rem", color: "var(--color-danger, #e74c3c)" }}>
              {t("admin.form.delete")}?
            </h2>
            <p style={{ fontSize: "1.1rem", color: "var(--color-navy)", fontWeight: 600, marginBottom: "1.5rem" }}>
              {t("admin.form.confirmDelete")}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="btn-brutal" 
                style={{ padding: "0.75rem 1.5rem", background: "var(--color-white)", color: "var(--color-navy)", fontWeight: 700 }}
              >
                {t("admin.form.cancel")}
              </button>
              <button 
                onClick={confirmDelete}
                className="btn-brutal" 
                style={{ padding: "0.75rem 1.5rem", background: "var(--color-danger, #e74c3c)", color: "var(--color-white)", fontWeight: 800 }}
              >
                {t("admin.form.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
