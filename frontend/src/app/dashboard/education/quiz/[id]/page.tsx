"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Award, CheckCircle, Lightbulb, XCircle } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/Toast";

import { getQuizByModule } from "@/app/admin/education/actions";

export default function QuizDetailPage() {
  const { addXp } = useUser();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { t } = useLanguage();
  const { showToast } = useToast();
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizzes = await getQuizByModule(Number(id));
        if (quizzes && quizzes.length > 0) {
          setQuestions(quizzes);
          setAnswers(new Array(quizzes.length).fill(null));
        } else {
          setQuestions([{
            question: "Belum ada pertanyaan untuk kuis ini.",
            options: ["Pilih ini"],
            correctAnswer: 0,
            explanation: "Admin belum mengatur kuis ini."
          }]);
          setAnswers([null]);
        }
      } catch (error) {
        console.error("Failed to load quiz questions:", error);
      }
    };
    fetchData();
  }, [id]);

  if (questions.length === 0) return null;

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
      showToast("Harap jawab semua soal sebelum menyelesaikan kuis!", "warning");
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
                  {questions[currentQuestion].options.map((opt: string, i: number) => (
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
                        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                          {questions.map((q, i) => {
                            const isCorrect = answers[i] === q.correctAnswer;
                            return (
                              <div key={i} className="card-brutal hover:-translate-y-2 transition-all duration-300" style={{ 
                                padding: "0", 
                                background: "var(--color-white)", 
                                border: `3px solid var(--color-navy)`,
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                animation: `slideUp 0.5s ease-out forwards`,
                                animationDelay: `${i * 0.15}s`,
                                opacity: 0,
                                transform: "translateY(20px)"
                              }}>
                                <style dangerouslySetInnerHTML={{__html: `
                                  @keyframes slideUp {
                                    to { opacity: 1; transform: translateY(0); }
                                  }
                                `}} />
                                {/* Banner header */}
                                <div style={{
                                  background: isCorrect ? "var(--color-lime)" : "var(--color-pink)",
                                  padding: "1rem 1.5rem",
                                  borderBottom: "3px solid var(--color-navy)",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.75rem"
                                }}>
                                  <div style={{ 
                                    width: "36px", height: "36px", borderRadius: "50%", 
                                    background: "var(--color-white)",
                                    border: "2px solid var(--color-navy)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0
                                  }}>
                                    {isCorrect ? <CheckCircle size={20} color="var(--color-navy)" /> : <XCircle size={20} color="var(--color-navy)" />}
                                  </div>
                                  <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "1.2rem", color: "var(--color-navy)" }}>
                                    Pertanyaan {i + 1}
                                  </h3>
                                  <span style={{ 
                                    marginLeft: "auto", 
                                    background: "var(--color-navy)", 
                                    color: "var(--color-white)", 
                                    padding: "0.25rem 0.75rem", 
                                    borderRadius: "100px",
                                    fontSize: "0.8rem",
                                    fontWeight: 800
                                  }}>
                                    {isCorrect ? "+50 XP" : "0 XP"}
                                  </span>
                                </div>

                                {/* Content */}
                                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                  <p style={{ margin: 0, fontWeight: 800, fontSize: "1.25rem", color: "var(--color-navy)", lineHeight: 1.4 }}>
                                    {q.question}
                                  </p>
                                  
                                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    {/* User's Answer */}
                                    <div style={{ 
                                      display: "flex", alignItems: "center", gap: "0.75rem", 
                                      padding: "1rem", borderRadius: "8px", 
                                      background: isCorrect ? "rgba(46, 204, 113, 0.15)" : "rgba(231, 76, 60, 0.15)",
                                      border: `2px solid ${isCorrect ? "var(--color-success)" : "var(--color-danger)"}`
                                    }}>
                                      <div style={{ fontWeight: 800, color: isCorrect ? "var(--color-success)" : "var(--color-danger)", minWidth: "120px" }}>
                                        Jawaban Anda:
                                      </div>
                                      <div style={{ fontWeight: 700, color: "var(--color-navy)" }}>
                                        {q.options[answers[i] as number]}
                                      </div>
                                    </div>

                                    {/* Correct Answer if Wrong */}
                                    {!isCorrect && (
                                      <div style={{ 
                                        display: "flex", alignItems: "center", gap: "0.75rem", 
                                        padding: "1rem", borderRadius: "8px", 
                                        background: "rgba(46, 204, 113, 0.15)",
                                        border: "2px solid var(--color-success)"
                                      }}>
                                        <div style={{ fontWeight: 800, color: "var(--color-success)", minWidth: "120px" }}>
                                          Jawaban Benar:
                                        </div>
                                        <div style={{ fontWeight: 700, color: "var(--color-navy)" }}>
                                          {q.options[q.correctAnswer]}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Explanation */}
                                  <div style={{ 
                                    marginTop: "0.5rem", padding: "1.25rem", 
                                    background: "var(--color-bg)", 
                                    border: "2px dashed var(--color-purple)", 
                                    borderRadius: "8px", display: "flex", gap: "1rem", alignItems: "flex-start" 
                                  }}>
                                    <div style={{ 
                                      width: "40px", height: "40px", borderRadius: "8px", 
                                      background: "var(--color-purple)", border: "2px solid var(--color-navy)",
                                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                                    }}>
                                      <Lightbulb size={20} color="var(--color-white)" />
                                    </div>
                                    <div>
                                      <h4 style={{ margin: "0 0 0.25rem 0", color: "var(--color-purple)", fontWeight: 800, fontSize: "0.9rem", textTransform: "uppercase" }}>
                                        Penjelasan
                                      </h4>
                                      <p style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "var(--color-navy)", lineHeight: 1.5 }}>
                                        {q.explanation}
                                      </p>
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
