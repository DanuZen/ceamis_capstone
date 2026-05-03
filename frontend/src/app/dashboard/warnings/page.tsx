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

  const getBadgeStyle = (severity: string) => {
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
        <div style={{
          width: "72px",
          height: "72px",
          background: "var(--color-pink)",
          borderRadius: "var(--radius-brutal-sm)",
          border: "3px solid var(--color-navy)",
          boxShadow: "4px 4px 0px var(--color-navy)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <AlertTriangle size={40} color="var(--color-navy)" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.25rem", marginBottom: "0.25rem", color: "var(--color-navy)", fontWeight: 800 }}>
            Warning System
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "1.0625rem", margin: 0, fontWeight: 500 }}>
            Notifikasi sarkas & roasting dari AI buat kontrol impuls belanja kamu. Nggak usah baper ya!
          </p>
        </div>
      </div>

      {/* Top Row: 4 Stats Cards */}
      <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{ background: "var(--color-pink)", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <HeartPulse size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem" }}>15%</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Health Score</div>
          </div>
        </div>
        
        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{ background: "var(--color-orange)", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <AlertTriangle size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem" }}>3 Aktif</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Total Warning</div>
          </div>
        </div>

        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{ background: "var(--color-lime)", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <Shield size={24} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem" }}>1 Solusi</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Tips Tersedia</div>
          </div>
        </div>

        <div className="card-brutal" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem" }}>
          <div style={{ background: "var(--color-purple)", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-brutal-sm)", border: "2px solid var(--color-navy)", boxShadow: "2px 2px 0px var(--color-navy)" }}>
            <Zap size={24} color="var(--color-white)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.25rem" }}>LVL 12</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Status Akun</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "2rem" }}>
        {/* Main Content Area (Left) */}
        <div style={{ flex: "1 1 65%", minWidth: "300px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {/* Impulsive Health Bar */}
            <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
              <div className="card-brutal" style={{ background: "var(--color-navy)", border: "4px solid var(--color-navy)", padding: "2.5rem", color: "var(--color-white)", boxShadow: `10px 10px 0px var(--color-pink)`, position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", position: "relative", zIndex: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <HeartPulse size={40} color="var(--color-pink)" className="animate-pulse" />
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", margin: 0, fontWeight: 900, color: "var(--color-white)" }}>Kesehatan Dompet</h3>
                  </div>
                  <div style={{ background: "var(--color-pink)", color: "var(--color-navy)", padding: "0.5rem 1.25rem", borderRadius: "100px", border: "3px solid var(--color-navy)", fontWeight: 900, fontSize: "1.125rem", boxShadow: "4px 4px 0px rgba(255,255,255,0.2)" }}>
                    KRITIS (85%)
                  </div>
                </div>
                
                <div style={{ position: "relative", height: "48px", background: "rgba(255,255,255,0.1)", borderRadius: "100px", border: "4px solid var(--color-white)", overflow: "hidden", marginBottom: "1.5rem", zIndex: 2 }}>
                  <div style={{ width: "85%", height: "100%", background: "var(--color-pink)", borderRight: "4px solid var(--color-white)" }} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 900, letterSpacing: "2px", pointerEvents: "none", color: "rgba(10, 25, 47, 0.5)" }}>
                    DANGER ZONE
                  </div>
                </div>
                
                <p style={{ position: "relative", zIndex: 2, fontSize: "1.125rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.6, margin: 0, fontWeight: 500, maxWidth: "700px" }}>
                  Dompetmu sedang dalam fase kritis. Segera kurangi pengeluaran F&B dan Belanja jika ingin survive bulan ini!
                </p>

                {/* Decoration icon */}
                <AlertTriangle size={220} style={{ position: "absolute", right: "-50px", bottom: "-50px", opacity: 0.1, color: "var(--color-white)", transform: "rotate(-15deg)", pointerEvents: "none" }} />
              </div>
            </div>

            {/* Notifications List */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <Zap size={28} color="var(--color-orange)" fill="var(--color-orange)" /> 
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", margin: 0, color: "var(--color-navy)", fontWeight: 900 }}>NOTIFIKASI AI</h2>
              </div>
              
              <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
                {warnings.map((w) => {
                  const style = getSeverityStyle(w.severity);
                  const badge = getBadgeStyle(w.severity);
                  return (
                    <div 
                      key={w.id} 
                      className={`card-brutal ${w.severity === "high" ? "animate-shake" : ""}`} 
                      style={{ 
                        background: "var(--color-white)", 
                        border: `4px solid var(--color-navy)`, 
                        padding: 0,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        ["--card-shadow-color" as any]: style.bg
                      }}
                    >
                      <div style={{ background: style.bg, padding: "1rem 1.5rem", borderBottom: "3px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span className={`badge-brutal ${badge.cls}`} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", padding: "0.3rem 0.6rem", border: "2px solid var(--color-navy)", background: "var(--color-white)", color: "var(--color-navy)" }}>
                          <style.icon size={14} strokeWidth={3} /> {badge.text}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-navy)", fontWeight: 800 }}>{w.time}</span>
                      </div>
                      
                      <div style={{ padding: "1.5rem" }}>
                        <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.0625rem", lineHeight: 1.4, marginBottom: "1.5rem", color: "var(--color-navy)", flex: 1 }}>
                          "{w.message}"
                        </p>
                      
                        <div
                          style={{
                            background: "var(--color-bg)",
                            border: "2px solid var(--color-navy)",
                            borderRadius: "var(--radius-brutal-sm)",
                            padding: "1rem",
                            fontSize: "0.875rem",
                            lineHeight: 1.4,
                            boxShadow: "2px 2px 0px var(--color-navy)",
                            position: "relative"
                          }}
                        >
                          <div style={{ position: "absolute", top: "-12px", left: "12px", background: "var(--color-lime)", border: "2px solid var(--color-navy)", borderRadius: "100px", padding: "0.15rem 0.5rem", fontSize: "0.65rem", fontWeight: 800, color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                            <Shield size={10} fill="var(--color-navy)" color="var(--color-lime)" /> SOLUSI AI
                          </div>
                          <span style={{ color: "var(--color-navy)", fontWeight: 600 }}>{w.tip}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Summary (Right) */}
        <div style={{ flex: "1 1 25%", minWidth: "280px" }}>
          <div className="card-brutal" style={{ background: "var(--color-white)", border: "4px solid var(--color-navy)", padding: "2rem", boxShadow: "8px 8px 0px var(--color-navy)", height: "100%" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", marginBottom: "2rem", fontWeight: 900, color: "var(--color-navy)" }}>RINGKASAN STATUS</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {[
                { label: "Warning Kritis", value: "2", color: "var(--color-pink)" },
                { label: "Warning Sedang", value: "1", color: "var(--color-orange)" },
                { label: "Tips Bertahan", value: "1", color: "var(--color-lime)" }
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "3rem", color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: "0.875rem", color: "var(--color-navy)", fontWeight: 800, marginTop: "0.25rem", textTransform: "uppercase" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "3rem", padding: "1.5rem", background: "var(--color-pink)", border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal)", boxShadow: "4px 4px 0px var(--color-navy)", color: "var(--color-navy)" }}>
              <div style={{ fontWeight: 900, fontSize: "0.875rem", marginBottom: "0.5rem" }}>MODUS ROASTING:</div>
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, lineHeight: 1.4 }}>
                "AI sedang dalam mood galak hari ini. Hati-hati kalau mau belanja!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
