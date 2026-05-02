import { useState, useEffect } from "react";

const LEADERBOARD_DATA = [
  { rank: 1, name: "Rina S.", streak: 45, badge: 12, score: 9800, medal: "gold" },
  { rank: 2, name: "Budi P.", streak: 38, badge: 10, score: 8650, medal: "silver" },
  { rank: 3, name: "Sari M.", streak: 32, badge: 9, score: 7920, medal: "bronze" },
  { rank: 4, name: "Andi K.", streak: 28, badge: 7, score: 6540, medal: "" },
  { rank: 5, name: "Dina W.", streak: 25, badge: 6, score: 5890, medal: "" },
];

export default function LeaderboardSection({ inViewRef, isVisible }) {
  return (
    <section
      ref={inViewRef}
      className={`landing-leaderboard ${isVisible ? "landing-leaderboard--visible" : ""}`}
    >
      <div className="landing-section-label">
        <span className="badge-brutal badge-brutal--purple">Leaderboard</span>
      </div>
      <h2 className="landing-section-title">
        Kompetisi sehat untuk <span className="text-primary">motivasi menabung</span>
      </h2>
      <p className="landing-section-subtitle">
        Lihat siapa yang paling konsisten dalam mengelola keuangan mereka
      </p>

      <div className="landing-leaderboard__table card-brutal">
        {/* Header */}
        <div className="landing-leaderboard__header">
          <span className="landing-leaderboard__col landing-leaderboard__col--rank">Rank</span>
          <span className="landing-leaderboard__col landing-leaderboard__col--name">Pengguna</span>
          <span className="landing-leaderboard__col">Streak</span>
          <span className="landing-leaderboard__col">Badge</span>
          <span className="landing-leaderboard__col landing-leaderboard__col--score">Skor</span>
        </div>
        {/* Rows */}
        {LEADERBOARD_DATA.map((user) => (
          <div
            key={user.rank}
            className={`landing-leaderboard__row ${user.medal ? `landing-leaderboard__row--${user.medal}` : ""}`}
          >
            <span className="landing-leaderboard__col landing-leaderboard__col--rank">
              <span className={`landing-leaderboard__rank-num ${user.medal ? `landing-leaderboard__rank-num--${user.medal}` : ""}`}>
                {user.rank}
              </span>
            </span>
            <span className="landing-leaderboard__col landing-leaderboard__col--name">
              <span className="landing-leaderboard__avatar">{user.name.charAt(0)}</span>
              {user.name}
            </span>
            <span className="landing-leaderboard__col">
              <strong>{user.streak}</strong> hari
            </span>
            <span className="landing-leaderboard__col">
              <strong>{user.badge}</strong> badge
            </span>
            <span className="landing-leaderboard__col landing-leaderboard__col--score">
              <strong>{user.score.toLocaleString()}</strong> pts
            </span>
          </div>
        ))}
      </div>
      <p className="text-center font-body text-sm text-muted mt-6">
        * Data di atas merupakan contoh simulasi leaderboard CEAMIS
      </p>
    </section>
  );
}
