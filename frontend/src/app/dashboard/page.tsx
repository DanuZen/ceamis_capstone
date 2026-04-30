export default function Dashboard() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h2 className="text-2xl font-semibold mb-4">Dashboard CEAMIS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="p-4 bg-white rounded shadow">Pencatatan Transaksi</section>
        <section className="p-4 bg-white rounded shadow">AI/XAI Insight</section>
        <section className="p-4 bg-white rounded shadow">Gamifikasi</section>
        <section className="p-4 bg-white rounded shadow">Chatbot & Notifikasi</section>
      </div>
    </main>
  );
}
