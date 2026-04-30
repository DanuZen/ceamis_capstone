// Modul Pencatatan Transaksi
export default function TransactionsPage() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Catat Transaksi</h2>
      <form className="flex flex-col gap-2 max-w-sm">
        <input className="border p-2 rounded" placeholder="Deskripsi" />
        <input className="border p-2 rounded" placeholder="Nominal" type="number" />
        <select className="border p-2 rounded">
          <option>Pemasukan</option>
          <option>Pengeluaran</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button>
      </form>
    </div>
  );
}
