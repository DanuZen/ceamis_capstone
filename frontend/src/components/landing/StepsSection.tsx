import { UserPlus, PenLine, BrainCircuit, Rocket } from "lucide-react";
import { RefObject } from "react";

const STEPS = [
  { num: "01", title: "Daftar Akun", desc: "Buat akun gratis dalam 30 detik. Tanpa ribet, tanpa kartu kredit.", icon: UserPlus, color: "purple" },
  { num: "02", title: "Catat Keuanganmu", desc: "Mulai catat pemasukan & pengeluaran harianmu dengan mudah.", icon: PenLine, color: "lime" },
  { num: "03", title: "Dapatkan Insight AI", desc: "AI kami analisis pola keuanganmu dan kasih rekomendasi cerdas.", icon: BrainCircuit, color: "orange" },
  { num: "04", title: "Level Up!", desc: "Kumpulkan streak, badge, dan naik peringkat di leaderboard!", icon: Rocket, color: "purple" },
];

interface StepsSectionProps {
  inViewRef: RefObject<HTMLElement>;
  isVisible: boolean;
}

export default function StepsSection({ inViewRef, isVisible }: StepsSectionProps) {
  return (
    <section
      ref={inViewRef}
      className={`landing-steps ${isVisible ? "landing-steps--visible" : ""}`}
    >
      <div className="landing-section-label">
        <span className="badge-brutal badge-brutal--purple">Cara Kerja</span>
      </div>
      <h2 className="landing-section-title">
        Mulai dalam <span className="text-primary">4 langkah</span> mudah
      </h2>

      <div className="landing-steps__grid">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className={`landing-step-card card-brutal landing-step-card--${s.color}`}
          >
            {/* Connector line */}
            {i < STEPS.length - 1 && <div className="landing-step-card__connector" />}
            <div className={`landing-step-card__num-badge landing-step-card__num-badge--${s.color}`}>
              {s.num}
            </div>
            <div className={`landing-step-card__icon-circle landing-step-card__icon-circle--${s.color}`}>
              <s.icon size={28} strokeWidth={2.5} />
            </div>
            <h3 className="landing-step-card__title">{s.title}</h3>
            <p className="landing-step-card__desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
