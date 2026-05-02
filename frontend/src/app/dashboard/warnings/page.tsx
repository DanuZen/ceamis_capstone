import { AlertTriangle, Flame, ShieldAlert, Zap, HeartPulse, Shield } from "lucide-react";

export default function WarningsPage() {
  const warnings = [
    {
      id: 1,
      type: "impulsif",
      message: "Bestie, kamu udah checkout 3x di marketplace hari ini. Dompetmu nangis tuh!",
      tip: "Coba masukkin ke wishlist dulu, tunggu 24 jam. Kalau masih pengen, baru beli!",
      time: "2 jam lalu",
      severity: "high",
    },
    {
      id: 2,
      type: "budget",
      message: "Budget F&B kamu tinggal 15% untuk bulan ini. Yakin mau Starbucks lagi?",
      tip: "Bikin kopi sendiri di rumah bisa hemat Rp 40rb/hari lho!",
      time: "5 jam lalu",
      severity: "medium",
    },
    {
      id: 3,
      type: "streak",
      message: "Hey! Kamu belum catat transaksi hari ini. Streakmu bisa putus nih!",
      tip: "Butuh 30 detik aja buat catat. Jangan sampe streak 5 hari kamu hangus!",
      time: "12 jam lalu",
      severity: "low",
    },
    {
      id: 4,
      type: "impulsif",
      message: "Flash sale lagi? Ingat, diskon 50% itu bukan hemat kalau emang nggak butuh!",
      tip: "Tanya ke diri sendiri: 'Kalau nggak diskon, aku tetep beli nggak?'",
      time: "Kemarin",
      severity: "high",
    },
  ];

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "high": return { bg: "var(--color-pink)", icon: AlertTriangle };
      case "medium": return { bg: "var(--color-orange)", icon: Flame };
      case "low": return { bg: "var(--color-lime)", icon: ShieldAlert };
      default: return { bg: "var(--color-white)", icon: Zap };
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high": return { text: "KRITIS", cls: "badge-brutal--pink" };
      case "medium": return { text: "SEDANG", cls: "badge-brutal--orange" };
      case "low": return { text: "RINGAN", cls: "badge-brutal--lime" };
      default: return { text: "", cls: "" };
    }
  };

  return (
    <div style={{ paddingBottom: "3rem" }}>
      {/* Header Area */}
      <div style={{ marginBottom: "3rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <div className="animate-pulse-glow" style={{
          width: "72px",
          height: "72px",
          background: "var(--color-pink)",
          borderRadius: "var(--radius-brutal-sm)",
          border: "3px solid var(--color-navy)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <AlertTriangle size={40} color="var(--color-navy)" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", marginBottom: "0.25rem", color: "var(--color-navy)", fontWeight: 800 }}>
            Gen-Z Warning System
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
            Notifikasi sarkas &amp; roasting dari AI buat kontrol impuls belanja kamu. Nggak usah baper ya!
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "3rem" }}>
        {/* Impulsive Health Bar */}
        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="card-brutal" style={{ background: "var(--color-navy)", border: "4px solid var(--color-navy)", padding: "2.5rem", color: "var(--color-white)", boxShadow: "8px 8px 0px var(--color-navy)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", display: "flex", alignItems: "center", gap: "0.75rem", margin: 0, fontWeight: 800 }}>
                <HeartPulse size={32} color="var(--color-pink)" />
                Level Bahaya Impulsif
              </h3>
              <span className="badge-brutal badge-brutal--pink" style={{ padding: "0.5rem 1.25rem", fontSize: "1.125rem", color: "var(--color-navy)", border: "3px solid var(--color-white)" }}>Kritis (85%)</span>
            </div>
            
            <div className="progress-brutal" style={{ height: "40px", border: "4px solid var(--color-white)", background: "rgba(255,255,255,0.1)", borderRadius: "var(--radius-brutal)" }}>
              <div className="progress-brutal__fill" style={{ width: "85%", background: "var(--color-pink)", borderRight: "4px solid var(--color-white)" }} />
              <div className="progress-brutal__label" style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-white)", mixBlendMode: "difference" }}>DANGER ZONE</div>
            </div>
            
            <p style={{ marginTop: "1.5rem", fontSize: "1.125rem", color: "var(--color-white)", opacity: 0.9, lineHeight: 1.6, margin: "1.5rem 0 0 0" }}>
              Dompet kamu udah teriak-teriak minta ampun. Kurangin jajan boba dan checkout keranjang oren minggu ini kalau mau selamat sampai akhir bulan!
            </p>
          </div>
        </div>

        {/* Stat Summary Blocks */}
        <div className="animate-slide-up" style={{ animationDelay: "200ms", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
          <div className="card-brutal" style={{ background: "var(--color-white)", border: "4px solid var(--color-navy)", padding: "2rem", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: "6px 6px 0px var(--color-navy)" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "4rem", color: "var(--color-pink)", lineHeight: 1 }}>2</div>
            <div style={{ fontSize: "1.125rem", color: "var(--color-navy)", fontWeight: 800, marginTop: "0.5rem" }}>Warning Kritis</div>
          </div>
          <div className="card-brutal" style={{ background: "var(--color-white)", border: "4px solid var(--color-navy)", padding: "2rem", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: "6px 6px 0px var(--color-navy)" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "4rem", color: "var(--color-orange)", lineHeight: 1 }}>1</div>
            <div style={{ fontSize: "1.125rem", color: "var(--color-navy)", fontWeight: 800, marginTop: "0.5rem" }}>Warning Sedang</div>
          </div>
          <div className="card-brutal" style={{ background: "var(--color-white)", border: "4px solid var(--color-navy)", padding: "2rem", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: "6px 6px 0px var(--color-navy)" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "4rem", color: "var(--color-lime)", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem" }}>
              <Shield size={48} strokeWidth={3} />
            </div>
            <div style={{ fontSize: "1.125rem", color: "var(--color-navy)", fontWeight: 800, marginTop: "0.5rem" }}>1 Tips Bertahan</div>
          </div>
        </div>
      </div>

      {/* Warning Cards */}
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", marginBottom: "1.5rem", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Zap size={24} color="var(--color-orange)" fill="var(--color-orange)" /> 
        Notifikasi AI
      </h2>
      
      <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
        {warnings.map((w) => {
          const badge = getSeverityBadge(w.severity);
          const style = getSeverityStyle(w.severity);
          
          return (
            <div 
              key={w.id} 
              className={`card-brutal ${w.severity === "high" ? "animate-shake" : ""}`} 
              style={{ 
                background: style.bg, 
                border: "3px solid var(--color-navy)", 
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                boxShadow: w.severity === "high" ? "8px 8px 0px var(--color-navy)" : "4px 4px 0px var(--color-navy)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <span className={`badge-brutal ${badge.cls}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", padding: "0.4rem 0.8rem", border: "2px solid var(--color-navy)" }}>
                  <style.icon size={16} strokeWidth={3} /> {badge.text}
                </span>
                <span style={{ fontSize: "0.9375rem", color: "var(--color-navy)", fontWeight: 700 }}>{w.time}</span>
              </div>
              
              <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.375rem", lineHeight: 1.4, marginBottom: "2rem", color: "var(--color-navy)", flex: 1 }}>
                "{w.message}"
              </p>
              
              <div
                style={{
                  background: "var(--color-white)",
                  border: "3px solid var(--color-navy)",
                  borderRadius: "var(--radius-brutal-sm)",
                  padding: "1.25rem",
                  fontSize: "1rem",
                  lineHeight: 1.5,
                  boxShadow: "3px 3px 0px var(--color-navy)",
                  position: "relative"
                }}
              >
                <div style={{ position: "absolute", top: "-15px", left: "15px", background: "var(--color-lime)", border: "2px solid var(--color-navy)", borderRadius: "100px", padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: 800, color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <Shield size={12} fill="var(--color-navy)" color="var(--color-lime)" /> SOLUSI AI
                </div>
                <strong style={{ display: "none" }}>Tips:</strong>
                <span style={{ color: "var(--color-navy)", fontWeight: 600 }}>{w.tip}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
