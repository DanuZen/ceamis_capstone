"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronRight, CheckCircle, Save, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getModules, getModulePages, saveModulePages, updateModule } from "../../actions";

export default function EditModulePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { t } = useLanguage();
  
  const [moduleTitle, setModuleTitle] = useState("");
  const [content, setContent] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [popupMessage, setPopupMessage] = useState<{title: string, message: string, type: "success" | "error"} | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const modules = await getModules();
        const mod = modules.find((m: any) => m.id.toString() === id);
        if (mod && mod.title) {
          setModuleTitle(mod.title);
        } else {
          setModuleTitle(t(`dashboard.education.modules.${parseInt(id) - 1}.title`));
        }

        const pages = await getModulePages(Number(id));
        if (pages && pages.length > 0) {
          setContent(pages);
        } else {
          const translatedContent = t(`dashboard.education.detail.moduleData.${id}`, { returnObjects: true }) || t(`dashboard.education.detail.moduleData.1`, { returnObjects: true });
          const contentArray = Array.isArray(translatedContent) ? translatedContent : [{ subtitle: "Halaman Baru", text: "Isi konten di sini..." }];
          setContent(contentArray);
        }
      } catch (error) {
        console.error("Failed to fetch module data:", error);
      }
    };
    fetchData();
  }, [id, t]);

  const handleSave = async () => {
    await saveModulePages(Number(id), content);
    await updateModule(Number(id), { status: "published" });
    setPopupMessage({ title: "Berhasil!", message: "Konten modul berhasil dipublikasikan!", type: "success" });
  };

  const handleSaveAsDraft = async () => {
    await saveModulePages(Number(id), content);
    await updateModule(Number(id), { status: "draft" });
    setPopupMessage({ title: "Draft Disimpan!", message: "Konten berhasil disimpan sebagai draft.", type: "success" });
  };

  const handleAddPage = () => {
    setContent([...content, { subtitle: "Halaman Baru", text: "Ketik isi materi di sini..." }]);
    setCurrentPage(content.length);
  };

  const handleRemovePage = (indexToRemove: number) => {
    if (content.length <= 1) {
      setPopupMessage({ title: "Oops!", message: "Modul harus memiliki minimal 1 halaman.", type: "error" });
      return;
    }
    const newContent = content.filter((_, i) => i !== indexToRemove);
    setContent(newContent);
    if (currentPage >= newContent.length) {
      setCurrentPage(newContent.length - 1);
    }
  };

  const handleSubtitleChange = (val: string) => {
    const newContent = [...content];
    newContent[currentPage].subtitle = val;
    setContent(newContent);
  };

  const handleTextChange = (val: string) => {
    const newContent = [...content];
    newContent[currentPage].text = val;
    setContent(newContent);
  };

  if (content.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - var(--navbar-height) - 4rem)" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/admin/education" style={{ textDecoration: "none" }}>
          <button className="btn-brutal" style={{ padding: "0.5rem 1rem", background: "var(--color-white)", border: "3px solid var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800 }}>
            <ArrowLeft size={18} /> Kembali ke Manajemen Modul
          </button>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={handleSaveAsDraft} className="btn-brutal" style={{ padding: "0.5rem 1rem", background: "var(--color-border)", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800 }}>
             <Save size={18} /> Simpan Draft
          </button>
          <button onClick={handleSave} className="btn-brutal btn-brutal--primary" style={{ padding: "0.5rem 1rem", background: "var(--color-purple)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800 }}>
             <CheckCircle size={18} /> Publikasikan
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row-reverse", gap: "2rem", flex: 1, overflow: "hidden" }}>
        {/* Sidebar Nav */}
        <div style={{ width: "280px", background: "var(--color-white)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", height: "fit-content", border: "2.5px solid var(--color-navy)", borderRadius: "12px" }}>
          <h4 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "1px" }}>Daftar Halaman</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {content.map((item, index) => (
              <div key={index} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <button 
                  onClick={() => setCurrentPage(index)}
                  style={{ 
                    flex: 1,
                    padding: "0.75rem", 
                    borderRadius: "var(--radius-brutal-sm)", 
                    border: "2px solid var(--color-navy)",
                    background: currentPage === index ? "var(--color-orange)" : "var(--color-bg)",
                    color: "var(--color-navy)",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <ChevronRight size={14} />
                  {item.subtitle || "Halaman Baru"}
                </button>
                <button onClick={() => handleRemovePage(index)} style={{ padding: "0.5rem", background: "var(--color-danger, #e74c3c)", border: "2px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trash2 size={16} color="white" />
                </button>
              </div>
            ))}
            <button 
              onClick={handleAddPage}
              className="btn-brutal"
              style={{ marginTop: "0.5rem", padding: "0.5rem", background: "var(--color-lime)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontWeight: 800 }}
            >
              <Plus size={16} /> Tambah Halaman
            </button>
          </div>
        </div>

        {/* Content Area Editor */}
        <div 
          style={{ 
            flex: 1, 
            background: "var(--color-white)", 
            padding: "3rem", 
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            border: "2.5px solid var(--color-navy)",
            borderRadius: "12px"
          }}
        >
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--color-navy)", marginBottom: "1rem" }}>
              <BookOpen size={24} color="var(--color-navy)" />
              <span style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Mode Editor Konten</span>
              <span style={{ color: "var(--color-navy)", opacity: 0.2 }}>•</span>
              <span style={{ color: "var(--color-navy)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                Halaman {currentPage + 1} dari {content.length}
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", margin: 0, lineHeight: 1.1, fontWeight: 900 }}>{moduleTitle}</h1>
            <p style={{ color: "var(--color-orange)", fontWeight: 700, fontSize: "0.875rem", marginTop: "0.5rem" }}>* Judul modul diedit pada popup Edit Metadata di halaman sebelumnya.</p>
          </div>

          <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="input-group-brutal" style={{ marginBottom: 0 }}>
              <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>Sub-judul Halaman (Subtitle)</label>
              <input 
                value={content[currentPage].subtitle} 
                onChange={(e) => handleSubtitleChange(e.target.value)}
                className="input-brutal" 
                style={{ width: "100%", fontSize: "1.25rem", fontWeight: 700, padding: "1rem" }} 
              />
            </div>
            
            <div className="input-group-brutal" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: 800, color: "var(--color-navy)", display: "block", marginBottom: "0.5rem" }}>Isi Materi (Text)</label>
              <textarea 
                value={content[currentPage].text}
                onChange={(e) => handleTextChange(e.target.value)}
                className="input-brutal"
                style={{ width: "100%", flex: 1, resize: "none", fontSize: "1.1rem", lineHeight: 1.6, padding: "1.25rem" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {popupMessage && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(10, 25, 47, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "1rem" }}>
          <div className="card-brutal animate-bounce-in" style={{ background: "var(--color-white)", width: "100%", maxWidth: "400px", padding: "2rem", textAlign: "center", border: "3px solid var(--color-navy)" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1rem", color: popupMessage.type === "error" ? "var(--color-danger, #e74c3c)" : "var(--color-lime)" }}>
              {popupMessage.title}
            </h2>
            <p style={{ fontSize: "1.1rem", color: "var(--color-navy)", fontWeight: 600, marginBottom: "1.5rem" }}>
              {popupMessage.message}
            </p>
            <button 
              onClick={() => {
                const wasSuccess = popupMessage.type === "success";
                setPopupMessage(null);
                if (wasSuccess) router.push("/admin/education");
              }}
              className="btn-brutal" 
              style={{ padding: "0.75rem 2rem", background: "var(--color-navy)", color: "var(--color-white)", fontWeight: 800, fontSize: "1.1rem" }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
