import { RefObject } from "react";

interface LandingFooterProps {
  inViewRef?: RefObject<HTMLElement>;
  isVisible?: boolean;
}

export default function LandingFooter({ inViewRef, isVisible }: LandingFooterProps) {
  return (
    <footer className="landing-footer">
      <div className="landing-footer__inner">
        <div className="landing-footer__brand">
          <div className="landing-nav__logo w-14 h-14 bg-transparent border-none shadow-none flex items-center justify-center">
            <img src="/images/logo_ceamis.png" alt="CEAMIS Logo" className="w-full h-full object-contain" />
          </div>
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
