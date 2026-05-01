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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "card-brutal--pink";
      case "medium": return "card-brutal--orange";
      case "low": return "card-brutal--yellow";
      default: return "";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high": return { text: "Kritis", cls: "badge-brutal--pink" };
      case "medium": return { text: "Sedang", cls: "badge-brutal--orange" };
      case "low": return { text: "Ringan", cls: "badge-brutal--yellow" };
      default: return { text: "", cls: "" };
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", marginBottom: "0.5rem" }}>
          Gen-Z Warning System
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>
          Notifikasi sarkas &amp; roasting dari AI buat kontrol impuls belanja kamu. Nggak usah baper ya!
        </p>
      </div>

      {/* Summary Card */}
      <div className="card-brutal animate-bounce-in" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", textAlign: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.5rem" }}>2</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Warning Kritis</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.5rem" }}>1</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Warning Sedang</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.5rem" }}>1</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Tips Harian</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.5rem" }}>-23%</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Impuls Minggu Ini</div>
          </div>
        </div>
      </div>

      {/* Warning Cards */}
      <div className="stagger-children" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {warnings.map((w) => {
          const badge = getSeverityBadge(w.severity);
          return (
            <div key={w.id} className={`card-brutal ${getSeverityColor(w.severity)}`}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span className={`badge-brutal ${badge.cls}`}>{badge.text}</span>
                <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{w.time}</span>
              </div>
              <p style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.0625rem", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                {w.message}
              </p>
              <div
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "2px solid var(--color-border)",
                  borderRadius: "var(--radius-brutal-sm)",
                  padding: "0.75rem 1rem",
                  fontSize: "0.875rem",
                  lineHeight: 1.5,
                }}
              >
                <strong>Tips:</strong> {w.tip}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
