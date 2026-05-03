import { useState, RefObject } from "react";

const FAQ_DATA = [
  { 
    q: "Apakah data keuanganku aman?", 
    a: "Sangat aman! Kami menggunakan enkripsi tingkat bank dan tidak pernah membagikan data pribadimu ke pihak ketiga tanpa izin." 
  },
  { 
    q: "Berapa biaya langganannya?", 
    a: "CEAMIS bisa digunakan 100% gratis untuk fitur dasar. Kami juga punya fitur Premium untuk kamu yang mau analisis AI lebih mendalam." 
  },
  { 
    q: "Gimana cara AI-nya ngeroasting aku?", 
    a: "AI kami menganalisis pola transaksi kamu. Kalau kamu beli barang impulsif yang nggak perlu, AI bakal kasih notifikasi 'pedes' biar kamu sadar!" 
  },
];

interface FaqSectionProps {
  inViewRef: RefObject<HTMLElement>;
  isVisible: boolean;
}

export default function FaqSection({ inViewRef, isVisible }: FaqSectionProps) {
  return (
    <section
      ref={inViewRef}
      className={`landing-faq ${isVisible ? "landing-faq--visible" : ""}`}
    >
      <div className="landing-container landing-container--narrow">
        <div className="landing-section-label">
          <span className="badge-brutal badge-brutal--purple">FAQ</span>
        </div>
        <h2 className="landing-section-title text-navy">Pertanyaan yang Sering Muncul</h2>
        <p className="landing-section-subtitle text-navy">Punya pertanyaan lain? Kami siap menjawab!</p>

        <div className="landing-faq__list">
          {FAQ_DATA.map((item, i) => {
            const [isOpen, setIsOpen] = useState(false);
            return (
              <div
                key={i}
                className={`faq-item ${isOpen ? "faq-item--open" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="faq-item__question">
                  {item.q}
                  <div className="faq-item__icon">+</div>
                </div>
                <div className="faq-item__answer">
                  <div className="faq-item__answer-text">{item.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
