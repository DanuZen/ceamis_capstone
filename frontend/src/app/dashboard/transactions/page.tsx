"use client";

export default function TransactionsPage() {
  const dummyTransactions = [
    { id: 1, desc: "Kopi Starbucks", amount: -55000, type: "pengeluaran", category: "F&B", date: "1 Mei 2026" },
    { id: 2, desc: "Gaji Freelance", amount: 2500000, type: "pemasukan", category: "Pendapatan", date: "30 Apr 2026" },
    { id: 3, desc: "Gopay Top-up", amount: -200000, type: "pengeluaran", category: "Digital", date: "29 Apr 2026" },
    { id: 4, desc: "Uang makan dari ortu", amount: 500000, type: "pemasukan", category: "Transfer", date: "28 Apr 2026" },
    { id: 5, desc: "Skincare The Ordinary", amount: -189000, type: "pengeluaran", category: "Self-care", date: "27 Apr 2026" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", marginBottom: "0.5rem" }}>
          Catat Transaksi
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>
          Input pemasukan &amp; pengeluaran kamu di sini. Rajin catat = rajin dapet streak!
        </p>
      </div>

      {/* Form */}
      <div className="card-brutal card-brutal--green animate-bounce-in" style={{ marginBottom: "2rem", maxWidth: 560 }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.125rem", marginBottom: "1rem" }}>
          Transaksi Baru
        </h3>
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}
        >
          <div>
            <label style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.375rem" }}>
              Deskripsi
            </label>
            <input className="input-brutal" placeholder='Contoh: "Beli nasi padang"' />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
            <div>
              <label style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.375rem" }}>
                Nominal (Rp)
              </label>
              <input className="input-brutal" type="number" placeholder="50000" />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.375rem" }}>
                Jenis
              </label>
              <select className="input-brutal input-brutal--select">
                <option>Pengeluaran</option>
                <option>Pemasukan</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.375rem" }}>
              Kategori
            </label>
            <select className="input-brutal input-brutal--select">
              <option>F&amp;B</option>
              <option>Transport</option>
              <option>Digital</option>
              <option>Self-care</option>
              <option>Pendapatan</option>
              <option>Transfer</option>
              <option>Lainnya</option>
            </select>
          </div>
          <button type="submit" className="btn-brutal btn-brutal--primary" style={{ marginTop: "0.5rem" }}>
            Simpan Transaksi
          </button>
        </form>
      </div>

      {/* Transaction History */}
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", marginBottom: "1rem" }}>
        Riwayat Transaksi
      </h2>
      <div className="stagger-children" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {dummyTransactions.map((tx) => (
          <div
            key={tx.id}
            className="card-brutal"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-brutal-sm)",
                  border: "2px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  background: tx.type === "pemasukan" ? "var(--color-green)" : "var(--color-pink)",
                  boxShadow: "var(--shadow-brutal-sm)",
                }}
              >
                {tx.type === "pemasukan" ? "+" : "−"}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.9375rem" }}>
                  {tx.desc}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                  {tx.date} · {tx.category}
                </div>
              </div>
            </div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "1.0625rem",
                color: tx.type === "pemasukan" ? "var(--color-success)" : "var(--color-danger)",
              }}
            >
              {tx.type === "pemasukan" ? "+" : ""}
              {tx.amount.toLocaleString("id-ID")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
