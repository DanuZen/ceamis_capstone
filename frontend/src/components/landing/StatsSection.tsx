

export default function StatsSection({ inViewRef, isVisible }) {
  return (
    <section
      ref={inViewRef}
      className={`landing-stats ${isVisible ? "landing-stats--visible" : ""}`}
    >
      <div className="landing-stats__item card-brutal">
        <div className="landing-stats__value">10K+</div>
        <div className="landing-stats__label">Impuls Terkontrol</div>
      </div>
      <div className="landing-stats__item card-brutal">
        <div className="landing-stats__value">Rp 1M+</div>
        <div className="landing-stats__label">Tabungan Terselamatkan</div>
      </div>
      <div className="landing-stats__item card-brutal">
        <div className="landing-stats__value">4.9/5</div>
        <div className="landing-stats__label">Rating Gen-Z</div>
      </div>
    </section>
  );
}
