"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, ChevronRight, CheckCircle } from "lucide-react";

const moduleData = {
  "1": {
    title: "Dasar-Dasar Budgeting",
    duration: "5 menit",
    color: "lime",
    content: [
      {
        subtitle: "Apa itu Budgeting?",
        text: "Budgeting adalah proses membuat rencana untuk membelanjakan uang kamu. Rencana belanja ini disebut anggaran. Membuat anggaran memungkinkan kamu menentukan sebelumnya apakah kamu akan memiliki cukup uang untuk hal-hal yang kamu butuhkan atau hal-hal yang penting bagi kamu."
      },
      {
        subtitle: "Metode 50/30/20",
        text: "Salah satu metode paling populer adalah 50/30/20. Alokasikan 50% pendapatan untuk kebutuhan (Needs), 30% untuk keinginan (Wants), dan 20% untuk tabungan atau membayar utang (Savings/Debt)."
      },
      {
        subtitle: "Cara Memulai",
        text: "1. Catat semua pemasukan. 2. List semua pengeluaran tetap. 3. Evaluasi pengeluaran variabel. 4. Sesuaikan alokasi agar sesuai target finansial kamu."
      }
    ]
  },
  "2": {
    title: "Emergency Fund 101",
    duration: "7 menit",
    color: "purple",
    content: [
      {
        subtitle: "Kenapa Harus Dana Darurat?",
        text: "Dana darurat adalah uang yang disisihkan khusus untuk menutupi biaya hidup saat terjadi hal yang tidak terduga, seperti kehilangan pekerjaan atau biaya medis mendadak."
      },
      {
        subtitle: "Berapa Banyak yang Dibutuhkan?",
        text: "Idealnya, miliki 3-6 bulan biaya hidup. Jika pengeluaran bulanan kamu Rp 5 juta, maka target dana darurat adalah Rp 15-30 juta."
      }
    ]
  }
};

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const module = moduleData[id as keyof typeof moduleData] || moduleData["1"];
  
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const windowHeight = scrollHeight - clientHeight;
      const currentProgress = Math.min(100, Math.round((scrollTop / windowHeight) * 100));
      
      if (currentProgress > progress) {
        setProgress(currentProgress);
        localStorage.setItem(`ceamis_module_${id}_progress`, currentProgress.toString());
      }
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [progress, id]);

  const handleFinish = () => {
    localStorage.setItem(`ceamis_module_${id}_progress`, "100");
    router.push("/dashboard/education");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - var(--navbar-height) - 4rem)" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/dashboard/education" style={{ textDecoration: "none" }}>
          <button className="btn-brutal" style={{ padding: "0.5rem 1rem", background: "var(--color-white)", border: "3px solid var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800 }}>
            <ArrowLeft size={18} /> Kembali
          </button>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="badge-brutal" style={{ background: "var(--color-white)", border: "2px solid var(--color-navy)", fontSize: "0.875rem" }}>
             {progress}% Dibaca
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "2rem", flex: 1, overflow: "hidden" }}>
        {/* Sidebar Nav */}
        <div className="card-brutal" style={{ width: "280px", background: "var(--color-white)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", height: "fit-content" }}>
          <h4 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "1px" }}>Isi Materi</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {module.content.map((item, index) => (
              <div 
                key={index} 
                style={{ 
                  padding: "0.75rem", 
                  borderRadius: "var(--radius-brutal-sm)", 
                  border: "2px solid var(--color-navy)",
                  background: progress >= (index + 1) * (100 / module.content.length) ? "var(--color-lime)" : "var(--color-bg)",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                {progress >= (index + 1) * (100 / module.content.length) ? <CheckCircle size={14} /> : <ChevronRight size={14} />}
                {item.subtitle}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div 
          ref={scrollRef}
          className="card-brutal" 
          style={{ 
            flex: 1, 
            background: "var(--color-white)", 
            padding: "3rem", 
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "2.5rem",
            boxShadow: `8px 8px 0px var(--color-${module.color})`
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: `var(--color-${module.color})`, marginBottom: "1rem" }}>
              <BookOpen size={24} />
              <span style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Modul {id}</span>
              <span style={{ color: "var(--color-navy)", opacity: 0.2 }}>•</span>
              <span style={{ color: "var(--color-navy)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Clock size={16} /> {module.duration}
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "3rem", margin: 0, lineHeight: 1, fontWeight: 900 }}>{module.title}</h1>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            {module.content.map((item, index) => (
              <section key={index}>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", marginBottom: "1.25rem", color: "var(--color-navy)", borderLeft: "8px solid var(--color-navy)", paddingLeft: "1.25rem" }}>
                  {item.subtitle}
                </h2>
                <p style={{ fontSize: "1.125rem", lineHeight: 1.8, color: "var(--color-text-muted)", fontWeight: 500 }}>
                  {item.text}
                </p>
              </section>
            ))}
          </div>

          <div style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "4px dashed var(--color-navy)", textAlign: "center" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1.5rem" }}>Selesai membaca modul ini?</h3>
            <button 
              onClick={handleFinish}
              className="btn-brutal btn-brutal--primary" 
              style={{ padding: "1rem 3rem", fontSize: "1.25rem", display: "inline-flex", alignItems: "center", gap: "0.75rem" }}
            >
              Tandai Selesai <CheckCircle size={24} />
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 12px;
        }
        ::-webkit-scrollbar-track {
          background: var(--color-bg);
          border-left: 3px solid var(--color-navy);
        }
        ::-webkit-scrollbar-thumb {
          background: var(--color-navy);
          border: 3px solid var(--color-bg);
        }
      `}</style>
    </div>
  );
}
