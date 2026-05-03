import Link from "next/link";
import { RefObject } from "react";

interface CtaSectionProps {
  inViewRef: RefObject<HTMLElement>;
  isVisible: boolean;
}

export default function CtaSection({ inViewRef, isVisible }: CtaSectionProps) {
  return (
    <section
      ref={inViewRef}
      className={`landing-cta ${isVisible ? "landing-cta--visible" : ""}`}
    >
      <div className="landing-cta__card">
        <div className="landing-cta__decoration" />
        <h2 className="landing-cta__title">Siap Jadi Cerdas Finansial?</h2>
        <p className="landing-cta__desc">
          Bergabung dengan ribuan Gen-Z Indonesia yang sudah mulai kontrol keuangan mereka. Gratis, tanpa ribet!
        </p>
        <Link href="/auth" className="btn-brutal btn-brutal--primary btn-brutal--lg">
          Gabung Sekarang — Gratis!
        </Link>
      </div>
    </section>
  );
}
