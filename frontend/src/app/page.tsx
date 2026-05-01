import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      {/* ── Top Banner ── */}
      <div
        style={{
          background: "var(--color-primary)",
          borderBottom: "var(--border-width) solid var(--color-border)",
          padding: "0.5rem 1rem",
          textAlign: "center",
          fontFamily: "var(--font-heading)",
          fontWeight: 600,
          fontSize: "0.875rem",
        }}
      >
        Platform keuangan Gen-Z paling fun se-Indonesia — Gabung sekarang!
      </div>

      {/* ── Navbar ── */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 2rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: "var(--color-primary)",
              border: "var(--border-width) solid var(--color-border)",
              borderRadius: "var(--radius-brutal-sm)",
              boxShadow: "var(--shadow-brutal-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
            }}
          >
            C
          </div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "1.5rem",
            }}
          >
            CEAMIS
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/auth" className="btn-brutal btn-brutal--secondary btn-brutal--sm">
            Login
          </Link>
          <Link href="/auth" className="btn-brutal btn-brutal--primary btn-brutal--sm">
            Daftar Gratis
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "2rem auto 0",
          padding: "0 2rem",
          textAlign: "center",
        }}
      >
        <div
          className="card-brutal card-brutal--primary animate-bounce-in"
          style={{ padding: "3rem 2rem", maxWidth: 800, margin: "0 auto" }}
        >
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2.5rem",
              marginBottom: "1rem",
              lineHeight: 1.2,
            }}
          >
            Kontrol Impuls Keuanganmu,{" "}
            <span style={{ textDecoration: "underline wavy var(--color-pink)" }}>
              Level Up
            </span>{" "}
            Tiap Hari
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              maxWidth: 600,
              margin: "0 auto 2rem",
              lineHeight: 1.6,
              fontFamily: "var(--font-body)",
            }}
          >
            CEAMIS bantu Gen-Z Indonesia catat keuangan dengan cara yang fun —
            AI insight, gamifikasi seru, dan notifikasi sarkas yang bikin kamu
            mikir dua kali sebelum checkout!
          </p>
          <Link
            href="/auth"
            className="btn-brutal btn-brutal--secondary btn-brutal--lg animate-pulse-glow"
          >
            Mulai Petualangan Finansial
          </Link>
        </div>
      </section>

      {/* ── Features Grid (Saweria-style) ── */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "3rem auto",
          padding: "0 2rem",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2rem",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Fitur Unggulan
        </h2>

        <div
          className="stagger-children"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {/* Card 1: Pencatatan */}
          <div className="card-brutal card-brutal--teal" style={{ minHeight: 200 }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", marginBottom: "0.5rem" }}>
              Pencatatan Keuangan
            </h3>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--color-text)" }}>
              Catat pemasukan, pengeluaran, dan utang-piutang dengan cepat. Digital Ledger yang rapi dan gampang dipahami.
            </p>
          </div>

          {/* Card 2: AI Insight */}
          <div className="card-brutal card-brutal--blue" style={{ minHeight: 200 }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", marginBottom: "0.5rem" }}>
              AI Insight &amp; XAI
            </h3>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--color-text)" }}>
              Insight keuangan otomatis dari AI, plus penjelasan transparan (Explainable AI) yang mudah dipahami Gen-Z.
            </p>
          </div>

          {/* Card 3: Gamifikasi */}
          <div className="card-brutal card-brutal--purple" style={{ minHeight: 200 }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", marginBottom: "0.5rem" }}>
              Gamifikasi Seru
            </h3>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--color-text)" }}>
              Daily Streak, Badge Achievement, dan Leaderboard. Makin rajin catat, makin banyak reward!
            </p>
          </div>

          {/* Card 4: Warning System */}
          <div className="card-brutal card-brutal--pink" style={{ minHeight: 200 }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", marginBottom: "0.5rem" }}>
              Gen-Z Warning System
            </h3>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--color-text)" }}>
              Notifikasi sarkas &amp; roasting kalau kamu kebanyakan impulsif. Dijamin bikin mikir sebelum checkout!
            </p>
          </div>

          {/* Card 5: Chatbot */}
          <div className="card-brutal card-brutal--green" style={{ minHeight: 200 }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", marginBottom: "0.5rem" }}>
              Chatbot Finansial AI
            </h3>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--color-text)" }}>
              Tanya apa aja soal keuangan! Chatbot AI yang paham bahasa Gen-Z dan kasih solusi praktis.
            </p>
          </div>

          {/* Card 6: Edukasi */}
          <div className="card-brutal card-brutal--orange" style={{ minHeight: 200 }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.375rem", marginBottom: "0.5rem" }}>
              Edukasi Adaptif
            </h3>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.5, color: "var(--color-text)" }}>
              Materi edukasi finansial yang menyesuaikan level dan kebutuhan kamu. Belajar sambil main!
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "3rem auto",
          padding: "0 2rem",
        }}
      >
        <div
          className="card-brutal"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", fontWeight: 700 }}>85%+</div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Akurasi AI Model</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", fontWeight: 700 }}>7+</div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Target Streak Hari</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", fontWeight: 700 }}>60%+</div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Engagement Rate</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", fontWeight: 700 }}>100%</div>
            <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Explainable AI</div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "3rem auto",
          padding: "0 2rem 4rem",
          textAlign: "center",
        }}
      >
        <div className="card-brutal card-brutal--yellow" style={{ padding: "3rem 2rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2rem",
              marginBottom: "1rem",
            }}
          >
            Siap Jadi Cerdas Finansial?
          </h2>
          <p
            style={{
              fontSize: "1.0625rem",
              marginBottom: "2rem",
              maxWidth: 500,
              margin: "0 auto 2rem",
              lineHeight: 1.6,
            }}
          >
            Bergabung dengan ribuan Gen-Z Indonesia yang sudah mulai kontrol keuangan mereka!
          </p>
          <Link href="/auth" className="btn-brutal btn-brutal--primary btn-brutal--lg">
            Gabung Sekarang — Gratis!
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "var(--border-width) solid var(--color-border)",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "var(--font-heading)",
          fontSize: "0.875rem",
          color: "var(--color-text-muted)",
          background: "var(--color-surface)",
        }}
      >
        <p>&copy; 2026 CEAMIS — Control Every Awful Money Impulse System</p>
        <p style={{ marginTop: "0.5rem" }}>
          Dibuat oleh Tim CEAMIS | Cerdas Finansial, Kontrol Impuls, Raih Masa Depan
        </p>
      </footer>
    </div>
  );
}
