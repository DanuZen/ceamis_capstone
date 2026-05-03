import { Eye, PiggyBank, ShieldAlert, GraduationCap } from "lucide-react";
import { RefObject } from "react";

const EDUKASI_POINTS = [
  {
    title: "Kenali Pola Pengeluaranmu",
    desc: "Riset menunjukkan 68% Gen-Z tidak melacak pengeluaran harian mereka. Dengan memahami ke mana uang pergi, kamu bisa mengidentifikasi kebocoran keuangan dan menghemat hingga 30% setiap bulannya.",
    icon: Eye,
    color: "purple",
    stat: "68%",
    statLabel: "Gen-Z tidak tracking",
  },
  {
    title: "Bangun Kebiasaan Menabung Sejak Dini",
    desc: "Mulai menabung 10-20% dari penghasilan di usia muda memberi keuntungan besar berkat compound interest. Rp 500.000/bulan yang ditabung sejak usia 20 bisa menjadi ratusan juta di usia 30.",
    icon: PiggyBank,
    color: "lime",
    stat: "10-20%",
    statLabel: "ideal untuk ditabung",
  },
  {
    title: "Hindari Impulsive Spending",
    desc: "Fenomena FOMO dan flash sale menyebabkan 73% anak muda melakukan pembelian impulsif. Dengan 'aturan 24 jam' — tunda pembelian 24 jam sebelum checkout — kamu bisa mengurangi pengeluaran tidak perlu secara signifikan.",
    icon: ShieldAlert,
    color: "orange",
    stat: "73%",
    statLabel: "belanja impulsif",
  },
  {
    title: "Literasi Keuangan = Masa Depan Cerah",
    desc: "Menurut OJK, tingkat literasi keuangan Gen-Z Indonesia masih di bawah 50%. Memahami konsep dasar seperti budgeting, investasi, dan manajemen utang adalah fondasi untuk kemandirian finansial.",
    icon: GraduationCap,
    color: "purple",
    stat: "<50%",
    statLabel: "literasi keuangan",
  },
];

interface EdukasiSectionProps {
  inViewRef: RefObject<HTMLElement>;
  isVisible: boolean;
}

export default function EdukasiSection({ inViewRef, isVisible }: EdukasiSectionProps) {
  return (
    <section
      ref={inViewRef}
      className={`landing-edukasi ${isVisible ? "landing-edukasi--visible" : ""}`}
    >
      <div className="landing-container">
        <div className="landing-section-label">
          <span className="badge-brutal badge-brutal--lime">Edukasi Finansial</span>
        </div>
        <h2 className="landing-section-title">
          Mengapa <span className="text-lime">pengelolaan keuangan</span> itu penting?
        </h2>
        <p className="landing-section-subtitle">
          Literasi keuangan adalah kunci menuju kemandirian finansial — terutama bagi generasi muda
        </p>

        <div className="landing-edukasi__intro card-brutal">
          <p>
            Di era digital, godaan belanja online ada di ujung jari. <strong>Gen-Z Indonesia</strong> menghadapi tantangan unik: gaya hidup konsumtif, FOMO, dan kurangnya edukasi keuangan formal. CEAMIS hadir untuk mengubah cara pandang generasi muda terhadap uang — dari sekadar menghabiskan menjadi <strong>mengelola dengan cerdas</strong>.
          </p>
        </div>

        <div className="landing-edukasi__grid">
          {EDUKASI_POINTS.map((point, i) => (
            <div key={i} className={`landing-edukasi__card card-brutal landing-edukasi__card--${point.color}`}>
              <div className="landing-edukasi__card-header">
                <div className={`landing-edukasi__icon-box landing-edukasi__icon-box--${point.color}`}>
                  <point.icon size={24} strokeWidth={2.5} />
                </div>
                <div className="landing-edukasi__stat-badge">
                  <span className="landing-edukasi__stat-value">{point.stat}</span>
                  <span className="landing-edukasi__stat-label">{point.statLabel}</span>
                </div>
              </div>
              <h3 className="landing-edukasi__card-title">{point.title}</h3>
              <p className="landing-edukasi__card-desc">{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
