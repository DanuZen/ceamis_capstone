export default function GamificationPage() {
  const badges = [
    { symbol: "★", name: "First Step", desc: "Catat transaksi pertama", unlocked: true },
    { symbol: "◆", name: "On Fire!", desc: "Streak 3 hari berturut", unlocked: true },
    { symbol: "◇", name: "Konsisten", desc: "Streak 7 hari berturut", unlocked: true },
    { symbol: "♛", name: "Champion", desc: "Streak 30 hari berturut", unlocked: false },
    { symbol: "◉", name: "AI Explorer", desc: "Baca 5 AI Insight", unlocked: true },
    { symbol: "●", name: "Hemat Master", desc: "Kurangi pengeluaran 20%", unlocked: false },
    { symbol: "▪", name: "Bookworm", desc: "Selesaikan 3 modul edukasi", unlocked: false },
    { symbol: "♚", name: "Legendary", desc: "Raih semua badge", unlocked: false },
  ];

  const leaderboard = [
    { rank: 1, name: "Andi S.", score: 2450, streak: 28 },
    { rank: 2, name: "Rina W.", score: 2180, streak: 21 },
    { rank: 3, name: "Kamu", score: 1950, streak: 5 },
    { rank: 4, name: "Budi P.", score: 1720, streak: 14 },
    { rank: 5, name: "Maya L.", score: 1580, streak: 10 },
  ];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", marginBottom: "0.5rem" }}>
          Gamifikasi
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>
          Level up skill finansialmu! Kumpulkan badge dan raih posisi teratas leaderboard.
        </p>
      </div>

      {/* Streak HP Bar */}
      <div className="card-brutal card-brutal--yellow animate-bounce-in" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.125rem" }}>
            Streak Aktif
          </h3>
          <span className="badge-brutal badge-brutal--orange">5 Hari</span>
        </div>
        <div className="progress-brutal">
          <div className="progress-brutal__fill" style={{ width: "71%" }} />
          <div className="progress-brutal__label">5 / 7 hari (target mingguan)</div>
        </div>
        <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
          2 hari lagi untuk dapet badge &ldquo;Konsisten&rdquo;! Semangat!
        </p>
      </div>

      {/* XP Progress */}
      <div className="card-brutal" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.125rem" }}>
            Level &amp; XP
          </h3>
          <span className="badge-brutal badge-brutal--purple">Level 7</span>
        </div>
        <div className="progress-brutal">
          <div className="progress-brutal__fill" style={{ width: "65%", background: "linear-gradient(90deg, var(--color-purple), var(--color-blue))" }} />
          <div className="progress-brutal__label">1950 / 3000 XP</div>
        </div>
      </div>

      {/* Badge Collection */}
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", marginBottom: "1rem" }}>
        Koleksi Badge
      </h2>
      <div
        className="stagger-children"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {badges.map((badge) => (
          <div
            key={badge.name}
            className="card-brutal"
            style={{
              textAlign: "center",
              padding: "1.25rem 1rem",
              opacity: badge.unlocked ? 1 : 0.45,
              filter: badge.unlocked ? "none" : "grayscale(0.8)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem", fontFamily: "var(--font-heading)" }}>{badge.symbol}</div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.9375rem", marginBottom: "0.25rem" }}>
              {badge.name}
            </div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
              {badge.desc}
            </div>
            {badge.unlocked && (
              <div className="badge-brutal badge-brutal--green" style={{ marginTop: "0.5rem" }}>
                Unlocked
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", marginBottom: "1rem" }}>
        Leaderboard
      </h2>
      <div className="stagger-children">
        {leaderboard.map((user) => {
          let colorClass = "";
          if (user.rank === 1) colorClass = "leaderboard-item--gold";
          else if (user.rank === 2) colorClass = "leaderboard-item--silver";
          else if (user.rank === 3) colorClass = "leaderboard-item--bronze";

          return (
            <div key={user.rank} className={`leaderboard-item ${colorClass}`}>
              <div className="leaderboard-rank">
                #{user.rank}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.9375rem" }}>
                  {user.name}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                  {user.streak} hari streak
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.125rem" }}>
                {user.score.toLocaleString()} XP
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
