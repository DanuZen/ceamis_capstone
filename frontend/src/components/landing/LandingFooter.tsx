

export default function LandingFooter({ inViewRef, isVisible }) {
  return (
    <footer className="landing-footer">
      <div className="landing-footer__inner">
        <div className="landing-footer__brand">
          <div className="landing-nav__logo shadow-[3px_3px_0px_var(--color-lime)] w-9 h-9 text-base">C</div>
          <div>
            <div className="font-heading font-bold text-lg text-white">CEAMIS</div>
            <div className="text-xs text-white/50">Control Every Awful Money Impulse System</div>
          </div>
        </div>
        <div className="landing-footer__copy">
          <p>&copy; 2026 CEAMIS — Dibuat oleh Tim CEAMIS</p>
          <p>Cerdas Finansial, Kontrol Impuls, Raih Masa Depan</p>
        </div>
      </div>
    </footer>
  );
}
