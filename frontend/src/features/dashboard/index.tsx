// Dashboard Utama (Setelah Login)
export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard CEAMIS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded shadow p-4">Pencatatan Keuangan</div>
        <div className="bg-white rounded shadow p-4">Analisis AI (XAI)</div>
        <div className="bg-white rounded shadow p-4">Gamifikasi</div>
        <div className="bg-white rounded shadow p-4">Chatbot Finansial</div>
        <div className="bg-white rounded shadow p-4">Warning System</div>
      </div>
    </div>
  );
}
