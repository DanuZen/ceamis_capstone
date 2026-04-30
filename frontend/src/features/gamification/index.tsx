// Fitur Gamifikasi (Streak, Badge, Leaderboard)
export default function GamificationPage() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Gamifikasi</h2>
      <div className="bg-yellow-100 rounded p-2 mb-2">Streak: 5 hari berturut-turut!</div>
      <div className="bg-green-100 rounded p-2 mb-2">Badge: Konsisten Mencatat</div>
      <div className="bg-blue-100 rounded p-2">Leaderboard: #1 Kamu!</div>
    </div>
  );
}
