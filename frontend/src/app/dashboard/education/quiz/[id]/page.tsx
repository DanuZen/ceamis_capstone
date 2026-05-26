"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Award, CheckCircle } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";

const getQuizForModule = (moduleId: string) => {
  switch (moduleId) {
    case "1":
      return [
        {
          question: "Apa tujuan utama dari pencatatan keuangan pribadi?",
          options: ["Pamer kekayaan di medsos", "Mengetahui arus kas dengan jelas", "Membuang-buang waktu luang", "Syarat wajib pinjam uang"],
          correctAnswer: 1,
          explanation: "Pencatatan keuangan yang baik membantu memahami arus kas."
        },
        {
          question: "Manakah yang merupakan komponen utama dalam anggaran (budget)?",
          options: ["Pemasukan dan Pengeluaran", "Aset dan Liabilitas", "Utang dan Piutang", "Tabungan dan Investasi"],
          correctAnswer: 0,
          explanation: "Anggaran dasar membandingkan pemasukan dan pengeluaran."
        },
        {
          question: "Kapan waktu terbaik untuk membuat anggaran bulanan?",
          options: ["Di tengah bulan", "Setelah gajian habis", "Sebelum bulan berjalan dimulai", "Saat ingin belanja besar"],
          correctAnswer: 2,
          explanation: "Idealnya anggaran dibuat sebelum bulan berjalan agar terencana."
        }
      ];
    case "2":
      return [
        {
          question: "Apa fungsi utama dari Dana Darurat?",
          options: ["Beli gadget terbaru", "Liburan tahunan mewah", "Menghadapi kondisi tak terduga", "Modal saham gorengan"],
          correctAnswer: 2,
          explanation: "Dana darurat untuk jaring pengaman situasi mendesak."
        },
        {
          question: "Berapa idealnya besaran dana darurat untuk lajang tanpa tanggungan?",
          options: ["1x pengeluaran bulanan", "3-6x pengeluaran bulanan", "12x pengeluaran bulanan", "Tidak perlu dana darurat"],
          correctAnswer: 1,
          explanation: "Lajang disarankan memiliki 3-6 kali pengeluaran bulanan."
        }
      ];
    case "3":
      return [
        {
          question: "Manakah contoh dari 'Wants' (Keinginan) dalam budgeting?",
          options: ["Bayar sewa kos", "Beli beras", "Bayar listrik", "Langganan Netflix"],
          correctAnswer: 3,
          explanation: "Netflix adalah keinginan karena tidak wajib untuk bertahan hidup."
        },
        {
          question: "Menurut metode 50/30/20, 30% dialokasikan untuk...",
          options: ["Kebutuhan Pokok (Needs)", "Keinginan (Wants)", "Tabungan/Investasi", "Amal"],
          correctAnswer: 1,
          explanation: "Aturan 50/30/20 membagi 30% untuk wants/keinginan."
        }
      ];
    default:
      return [
        {
          question: "Instrumen investasi apa yang umumnya berisiko paling rendah?",
          options: ["Koin Kripto", "Reksadana Pasar Uang", "Properti", "Saham Gorengan"],
          correctAnswer: 1,
          explanation: "RDPU sangat aman dan stabil."
        },
        {
          question: "Diversifikasi dalam investasi bertujuan untuk?",
          options: ["Menghindari pajak", "Memaksimalkan risiko", "Menyebar dan meminimalkan risiko", "Ikut-ikutan tren"],
          correctAnswer: 2,
          explanation: "Diversifikasi menyebar investasi ke berbagai aset untuk tekan risiko ('Don't put all eggs in one basket')."
        }
      ];
  }
};

export default function QuizDetailPage() {
  const { addXp } = useUser();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { t } = useLanguage();
  
  const questions = getQuizForModule(id);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const handleSelectAnswer = (optIndex: number) => {
    if (showResult) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleFinishQuiz = () => {
    if (answers.includes(null)) {
      alert("Harap jawab semua soal sebelum menyelesaikan kuis!");
      return;
    }
    setShowResult(true);
  };

  const handleClaimReward = () => {
    const isCompleted = localStorage.getItem(`ceamis_quiz_${id}_completed`);
    if (!isCompleted) {
      // Calculate XP based on correct answers
      const correctCount = answers.filter((ans, idx) => ans === questions[idx].correctAnswer).length;
      const xpToEarn = Math.round((correctCount / questions.length) * 150); // Max 150 XP
      if (xpToEarn > 0) {
        addXp(xpToEarn);
      }
      localStorage.setItem(`ceamis_quiz_${id}_completed`, "true");
    }
    router.push("/dashboard/education");
  };

  const currentProgress = Math.round(((currentQuestion + 1) / questions.length) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - var(--navbar-height) - 4rem)" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/dashboard/education" style={{ textDecoration: "none" }}>
          <button className="btn-brutal" style={{ padding: "0.5rem 1rem", background: "var(--color-white)", border: "3px solid var(--color-navy)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800 }}>
            <ArrowLeft size={18} /> {t("dashboard.education.detail.back")}
          </button>
        </Link>
        {!showResult && (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className="badge-brutal" style={{ background: "var(--color-white)", border: "2px solid var(--color-navy)", fontSize: "0.875rem" }}>
               {currentProgress}% Selesai
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "row-reverse", gap: "2rem", flex: 1, overflow: "hidden" }}>
        {/* Sidebar Nav */}
        {!showResult && (
          <div style={{ width: "280px", background: "var(--color-white)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", height: "fit-content", border: "2.5px solid var(--color-navy)", borderRadius: "12px" }}>
            <h4 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "1px" }}>Daftar Soal</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {questions.map((q, index) => (
                <button 
                  key={index} 
                  onClick={() => setCurrentQuestion(index)}
                  style={{ 
                    padding: "0.75rem", 
                    borderRadius: "var(--radius-brutal-sm)", 
                    border: "2px solid var(--color-navy)",
                    background: currentQuestion === index ? "var(--color-orange)" : (answers[index] !== null ? "var(--color-lime)" : "var(--color-bg)"),
                    color: "var(--color-navy)",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {answers[index] !== null ? <CheckCircle size={14} /> : <div style={{width: 14, height: 14, borderRadius: '50%', border: '2px solid currentColor'}} />}
                  Soal {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div 
          style={{ 
            flex: 1, 
            background: "var(--color-white)", 
            padding: "3rem", 
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            border: "2.5px solid var(--color-navy)",
            borderRadius: "12px"
          }}
        >
          {!showResult ? (
            <>
              <div style={{ marginBottom: "2.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--color-navy)", marginBottom: "1rem" }}>
                  <Award size={24} color="var(--color-navy)" />
                  <span style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Kuis Evaluasi Modul {id}</span>
                  <span style={{ color: "var(--color-navy)", opacity: 0.2 }}>•</span>
                  <span style={{ color: "var(--color-navy)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    Soal {currentQuestion + 1} dari {questions.length}
                  </span>
                </div>
                <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", margin: 0, lineHeight: 1.2, fontWeight: 900 }}>
                  {questions[currentQuestion].question}
                </h1>
              </div>

              <div style={{ flex: 1, position: "relative", overflowY: "auto", paddingBottom: "2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {questions[currentQuestion].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectAnswer(i)}
                      style={{
                        padding: "1.25rem 1.5rem",
                        textAlign: "left",
                        background: answers[currentQuestion] === i ? "var(--color-navy)" : "var(--color-white)",
                        color: answers[currentQuestion] === i ? "var(--color-white)" : "var(--color-navy)",
                        border: "3px solid var(--color-navy)",
                        borderRadius: "var(--radius-brutal-sm)",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        cursor: "pointer",
                        boxShadow: answers[currentQuestion] === i ? "none" : "4px 4px 0px var(--color-navy)",
                        transform: answers[currentQuestion] === i ? "translate(4px, 4px)" : "none",
                        transition: "all 0.1s"
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Controls */}
              <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button 
                  onClick={handlePrev}
                  disabled={currentQuestion === 0}
                  className="btn-brutal"
                  style={{ padding: "0.75rem 1.5rem", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem", background: currentQuestion === 0 ? "var(--color-bg)" : "var(--color-white)", opacity: currentQuestion === 0 ? 0.5 : 1, cursor: currentQuestion === 0 ? "not-allowed" : "pointer" }}
                >
                  <ArrowLeft size={20} /> Sebelumnya
                </button>

                {currentQuestion === questions.length - 1 ? (
                  <button 
                    onClick={handleFinishQuiz}
                    disabled={answers.includes(null)}
                    className="btn-brutal btn-brutal--primary" 
                    style={{ 
                      padding: "1rem 2rem", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.75rem",
                      background: answers.includes(null) ? "var(--color-bg)" : "var(--color-lime)",
                      color: answers.includes(null) ? "var(--color-text-muted)" : "var(--color-navy)",
                      cursor: answers.includes(null) ? "not-allowed" : "pointer",
                      boxShadow: answers.includes(null) ? "none" : "4px 4px 0px var(--color-navy)",
                      transform: answers.includes(null) ? "translate(4px, 4px)" : "none"
                    }}
                  >
                    Selesaikan Kuis <CheckCircle size={24} />
                  </button>
                ) : (
                  <button 
                    onClick={handleNext}
                    className="btn-brutal"
                    style={{ padding: "0.75rem 1.5rem", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--color-lime)" }}
                  >
                    Selanjutnya <CheckCircle size={20} />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                  <div style={{ width: "80px", height: "80px", borderRadius: "var(--radius-brutal)", background: "var(--color-pink)", border: "4px solid var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "6px 6px 0px var(--color-navy)" }}>
                    <Award size={40} color="var(--color-navy)" strokeWidth={2.5} />
                  </div>
                </div>
                <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "3rem", margin: "0 0 1rem 0", color: "var(--color-navy)", fontWeight: 900 }}>Hasil Kuis</h1>
                
                {/* Score calc */}
                {(() => {
                  const correctCount = answers.filter((ans, idx) => ans === questions[idx].correctAnswer).length;
                  const xpEarned = Math.round((correctCount / questions.length) * 150);
                  
                  return (
                    <>
                      <p style={{ fontSize: "1.25rem", color: "var(--color-navy)", fontWeight: 700, margin: "0 0 1.5rem 0" }}>
                        Kamu menjawab benar <span style={{ color: "var(--color-success)", fontSize: "1.5rem" }}>{correctCount}</span> dari {questions.length} soal!
                      </p>
                      
                      <div style={{ display: "inline-block", background: "var(--color-bg)", border: "3px dashed var(--color-navy)", padding: "1.5rem 2.5rem", borderRadius: "var(--radius-brutal)", marginBottom: "3rem" }}>
                        <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--color-text-muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "1px" }}>XP Diterima</div>
                        <div style={{ fontSize: "3rem", fontWeight: 900, color: "var(--color-pink)", lineHeight: 1 }}>+{xpEarned}</div>
                      </div>
                      
                      {/* Breakdown */}
                      <div style={{ textAlign: "left", marginBottom: "3rem" }}>
                        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", marginBottom: "1.5rem" }}>Review Jawaban:</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          {questions.map((q, i) => {
                            const isCorrect = answers[i] === q.correctAnswer;
                            return (
                              <div key={i} style={{ 
                                padding: "1.5rem", 
                                background: "var(--color-bg)", 
                                border: `3px solid ${isCorrect ? "var(--color-success)" : "var(--color-danger)"}`,
                                borderRadius: "var(--radius-brutal-sm)"
                              }}>
                                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                  <div style={{ 
                                    width: "32px", height: "32px", borderRadius: "50%", 
                                    background: isCorrect ? "var(--color-success)" : "var(--color-danger)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0, marginTop: "0.25rem"
                                  }}>
                                    <span style={{ color: "var(--color-white)", fontWeight: 900 }}>{i + 1}</span>
                                  </div>
                                  <div>
                                    <p style={{ margin: "0 0 0.75rem 0", fontWeight: 700, fontSize: "1.1rem", color: "var(--color-navy)" }}>{q.question}</p>
                                    <p style={{ margin: "0 0 0.5rem 0", color: isCorrect ? "var(--color-success)" : "var(--color-danger)", fontWeight: 600 }}>
                                      Jawabanmu: {q.options[answers[i] as number]}
                                    </p>
                                    {!isCorrect && (
                                      <p style={{ margin: "0 0 0.5rem 0", color: "var(--color-success)", fontWeight: 600 }}>
                                        Kunci Jawaban: {q.options[q.correctAnswer]}
                                      </p>
                                    )}
                                    <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--color-white)", border: "2px dashed var(--color-navy)", borderRadius: "8px" }}>
                                      <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "var(--color-navy)" }}>💡 Penjelasan: {q.explanation}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <button 
                        onClick={handleClaimReward}
                        className="btn-brutal btn-brutal--primary" 
                        style={{ padding: "1.25rem 3rem", fontSize: "1.25rem", display: "inline-flex", alignItems: "center", gap: "0.75rem" }}
                      >
                        Klaim XP & Kembali <CheckCircle size={24} />
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
