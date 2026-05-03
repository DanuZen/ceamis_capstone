import { RefObject } from "react";

const TESTIMONIALS = [
  { 
    text: "Sumpah, AI-nya jujur banget pas ngeroasting pengeluaran kopi gue. Sekarang tabungan gue jadi lebih sehat!", 
    name: "Jessica A.", 
    handle: "@jess_finance", 
    color: "purple" 
  },
  { 
    text: "Badge-nya bikin ketagihan nyatet. Berasa main game tapi dapet cuan karena pengeluaran jadi lebih terkontrol.", 
    name: "Kevin R.", 
    handle: "@kvn_mulyono", 
    color: "lime" 
  },
  { 
    text: "Dulu sering kena FOMO flash sale, sekarang ada CEAMIS yang selalu ngingetin buat mikir 24 jam. Mantap!", 
    name: "Sari K.", 
    handle: "@sari_kurnia", 
    color: "navy" 
  },
];

interface TestimonialsSectionProps {
  inViewRef: RefObject<HTMLElement>;
  isVisible: boolean;
}

export default function TestimonialsSection({ inViewRef, isVisible }: TestimonialsSectionProps) {
  return (
    <section
      ref={inViewRef}
      className={`landing-testimonials ${isVisible ? "landing-testimonials--visible" : ""}`}
    >
      <div className="landing-container">
        <div className="landing-section-label">
          <span className="badge-brutal badge-brutal--purple">Apa Kata Mereka?</span>
        </div>
        <h2 className="landing-section-title text-navy">
          Ribuan Gen-Z sudah <span className="text-primary">level up</span> finansial
        </h2>
        <p className="landing-section-subtitle text-navy">
          Bukan cuma teori, tapi aksi nyata buat dompet lebih sehat
        </p>

        <div className="landing-testimonials__grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`testimonial-bubble testimonial-bubble--${t.color}`}>
              <p className="testimonial-bubble__text">"{t.text}"</p>
              <div className="testimonial-bubble__user">
                <div className="testimonial-bubble__avatar">
                  {t.name.charAt(0)}
                </div>
                <div className="testimonial-bubble__info">
                  <span className="testimonial-bubble__name">{t.name}</span>
                  <span className="testimonial-bubble__handle">{t.handle}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
