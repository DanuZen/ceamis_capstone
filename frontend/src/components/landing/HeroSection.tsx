import Link from "next/link";
import Image from "next/image";
import { Zap, TrendingUp, Target } from "lucide-react";
import { RefObject } from "react";

interface HeroSectionProps {
  inViewRef: RefObject<HTMLElement>;
  isVisible: boolean;
}

export default function HeroSection({ inViewRef, isVisible }: HeroSectionProps) {
  return (
    <section
      ref={inViewRef}
      className={`landing-hero ${isVisible ? "landing-hero--visible" : ""}`}
    >
      <div className="landing-container landing-hero__wrapper">
        <div className="landing-hero__content">
          <div className="badge-brutal badge-brutal--purple" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
            Baru — Fitur Chatbot AI sudah tersedia!
          </div>
          <h1 className="landing-hero__title">
            Kontrol Impuls<br />
            Keuanganmu,{" "}
            <span className="landing-hero__highlight">Level Up</span>{" "}
            Tiap Hari
          </h1>
          <p className="landing-hero__subtitle">
            CEAMIS bantu Gen-Z Indonesia catat keuangan dengan cara yang fun — AI insight, gamifikasi seru, dan notifikasi sarkas yang bikin kamu mikir dua kali sebelum checkout!
          </p>
          <div className="landing-hero__actions">
            <Link href="/onboarding" className="btn-brutal btn-brutal--primary btn-brutal--lg">
              Kelola Uangmu — Gratis!
            </Link>
            <Link href="#fitur" className="btn-brutal btn-brutal--secondary btn-brutal--lg">
              Lihat Fitur
            </Link>
          </div>
        </div>

        <div className="landing-hero__visual">
          <div className="landing-hero__blob" />
          <Image 
            src="/images/hero.webp" 
            alt="CEAMIS Illustration" 
            className="landing-hero__main-img"
            width={480}
            height={480}
            priority
          />
          {/* Floating Badges */}
          <div className="landing-hero__float landing-hero__float--1">
            <Zap size={18} strokeWidth={3} /> Level 12 Reached
          </div>
          <div className="landing-hero__float landing-hero__float--2">
            <TrendingUp size={18} strokeWidth={3} /> 15 Day Streak
          </div>
          <div className="landing-hero__float landing-hero__float--3">
            <Target size={18} strokeWidth={3} /> Rp 500k Saved
          </div>
        </div>
      </div>
    </section>
  );
}
