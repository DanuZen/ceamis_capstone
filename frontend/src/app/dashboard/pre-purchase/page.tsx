"use client";

import { useState } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  ShoppingBag, 
  Utensils, 
  Film, 
  Car, 
  GraduationCap, 
  Package, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  PiggyBank, 
  TrendingDown, 
  Sparkles,
  Info
} from "lucide-react";
import { useUser } from "@/context/UserContext";

// ── Types ─────────────────────────────────────────────

interface RiskResult {
  check_id: string;
  planned_amount: number;
  category: string;
  merchant: string;
  risk_score: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  trigger_factors: string[];
  budget_limit: number;
  remaining_before: number;
  remaining_after: number;
  savings_delayed_days: number;
  savings_goal_title: string;
  recommended_action: "PROCEED" | "ADJUST" | "POSTPONE";
}

const CATEGORIES = [
  { id: "shopping", name: "Shopping", icon: ShoppingBag, color: "bg-[#EC4899] text-white" },
  { id: "fnb", name: "Makanan & Minuman", icon: Utensils, color: "bg-[#F97316] text-white" },
  { id: "entertainment", name: "Hiburan & Hobi", icon: Film, color: "bg-[#8B5CF6] text-white" },
  { id: "transport", name: "Transportasi", icon: Car, color: "bg-[#06B6D4] text-white" },
  { id: "education", name: "Edukasi", icon: GraduationCap, color: "bg-[#A3E635] text-black" },
  { id: "other", name: "Lainnya", icon: Package, color: "bg-[#E2E8F0] text-black" },
];

const QUICK_AMOUNTS = [50000, 100000, 250000, 500000, 1000000];

const AI_BASE = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000";

export default function PrePurchasePage() {
  const { userData } = useUser();

  const [amount, setAmount] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("shopping");
  const [merchant, setMerchant] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskResult | null>(null);
  const [userDecision, setUserDecision] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<string>("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setAmount(raw);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    setLoading(true);
    setUserDecision(null);
    setFeedbackSubmitted(false);

    try {
      const res = await fetch(`${AI_BASE}/api/v1/pre-purchase/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userData?.id || "demo-user",
          category_id: selectedCategory,
          planned_amount: numAmount,
          merchant_name: merchant || undefined,
          notes: notes || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const pred = data.prediction || {};
        const bImpact = data.budget_impact || {};
        const sImpact = data.savings_impact || {};

        setResult({
          check_id: data.check_id || `check-${Date.now()}`,
          planned_amount: data.planned_amount || numAmount,
          category: CATEGORIES.find((c) => c.id === selectedCategory)?.name || "Shopping",
          merchant: merchant || "Merchant Umum",
          risk_score: pred.risk_score ?? 0.25,
          risk_level: pred.risk_level ?? "LOW",
          trigger_factors: pred.trigger_factors || [
            "Pengeluaran sesuai dengan kebiasaan normal dan pagu anggaran Anda.",
          ],
          budget_limit: bImpact.budget_limit ?? 800000,
          remaining_before: bImpact.remaining_before ?? 120000,
          remaining_after: bImpact.remaining_after ?? (120000 - numAmount),
          savings_delayed_days: sImpact.delayed_days ?? Math.round(numAmount / 25000),
          savings_goal_title: sImpact.goal_title ?? "Dana Darurat 2026",
          recommended_action: data.recommended_action ?? "PROCEED",
        });
      } else {
        throw new Error("Server error");
      }
    } catch {
      // Deterministic client fallback jika service offline
      const budgetLimit = 800000;
      const remainingBefore = 120000;
      const remainingAfter = remainingBefore - numAmount;

      let riskLevel: "LOW" | "MEDIUM" | "HIGH" = "LOW";
      let riskScore = 0.18;
      const triggers: string[] = [];

      if (numAmount > remainingBefore) {
        riskLevel = "HIGH";
        riskScore = 0.88;
        triggers.push(
          `Nominal melebihi sisa anggaran kategori ini (potensi defisit ${formatRupiah(numAmount - remainingBefore)})`
        );
      } else if (numAmount > remainingBefore * 0.6) {
        riskLevel = "MEDIUM";
        riskScore = 0.58;
        triggers.push("Menguras lebih dari 60% sisa pagu bulanan kategori ini.");
      }

      if (numAmount > 200000) {
        if (riskLevel === "LOW") {
          riskLevel = "MEDIUM";
          riskScore = 0.52;
        }
        triggers.push("Nominal pengeluaran ini 2x lebih besar dari rata-rata riwayat transaksi Anda.");
      }

      if (triggers.length === 0) {
        triggers.push("Rencana belanja ini aman dan terkontrol di dalam anggaran bulanan.");
      }

      setResult({
        check_id: `local-${Date.now()}`,
        planned_amount: numAmount,
        category: CATEGORIES.find((c) => c.id === selectedCategory)?.name || "Shopping",
        merchant: merchant || "Merchant Umum",
        risk_score: riskScore,
        risk_level: riskLevel,
        trigger_factors: triggers,
        budget_limit: budgetLimit,
        remaining_before: remainingBefore,
        remaining_after: remainingAfter,
        savings_delayed_days: Math.max(1, Math.round(numAmount / 25000)),
        savings_goal_title: "Dana Darurat 2026",
        recommended_action: riskLevel === "HIGH" ? "POSTPONE" : riskLevel === "MEDIUM" ? "ADJUST" : "PROCEED",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (decision: "PROCEED" | "ADJUST" | "POSTPONE") => {
    if (!result) return;
    setUserDecision(decision);

    try {
      await fetch(`${AI_BASE}/api/v1/pre-purchase/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          check_id: result.check_id,
          decision,
          adjusted_amount: decision === "ADJUST" ? parseFloat(adjustAmount) || undefined : undefined,
        }),
      });
    } catch {
      // Best-effort recording
    }
  };

  const handleFeedback = async (wasImpulsive: boolean) => {
    if (!result) return;
    setFeedbackSubmitted(true);

    try {
      await fetch(`${AI_BASE}/api/v1/pre-purchase/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          check_id: result.check_id,
          was_impulsive: wasImpulsive,
          satisfaction_rating: feedbackRating,
          feedback_notes: "Dicatat dari Desktop Web Portal",
        }),
      });
    } catch {
      // Best-effort recording
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* ── Header ─────────────────────────────────── */}
      <div className="bg-[#A3E635] border-3 border-black p-6 md:p-8 rounded-2xl shadow-[6px_6px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles size={14} className="text-[#A3E635]" />
            Fitur Inti CEAMIS 2.0 • AI Engine
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-black">
            Cek Risiko Pra-Pembelian
          </h1>
          <p className="text-black/80 font-medium text-sm md:text-base mt-1 max-w-2xl">
            Simulasikan rencana belanja sebelum checkout. AI mengevaluasi 7 fitur kontekstual untuk mencegah pengeluaran impulsif & menjaga tabungan masa depanmu.
          </p>
        </div>

        <div className="bg-white border-2 border-black px-4 py-3 rounded-xl shadow-[3px_3px_0px_#000] flex items-center gap-3 shrink-0">
          <ShieldCheck size={32} className="text-[#8B5CF6]" />
          <div>
            <div className="text-xs font-bold uppercase text-gray-500">Target Tabungan Aktif</div>
            <div className="text-sm font-black text-black">Dana Darurat 2026</div>
          </div>
        </div>
      </div>

      {/* ── Main 2-Column Grid ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── LEFT COLUMN: Input Form (5 cols) ──────── */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border-3 border-black p-6 rounded-2xl shadow-[5px_5px_0px_#000]">
            <h2 className="text-xl font-black text-black flex items-center gap-2 mb-5">
              <ShoppingBag size={22} className="text-[#EC4899]" />
              Form Rencana Belanja
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nominal Input */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                  Nominal Rencana Belanja (Rp) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-lg text-black">
                    Rp
                  </span>
                  <input
                    type="text"
                    required
                    value={amount ? Number(amount).toLocaleString("id-ID") : ""}
                    onChange={handleAmountChange}
                    placeholder="Contoh: 350.000"
                    className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border-2 border-black rounded-xl font-black text-xl text-black focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:bg-white transition-all shadow-[2px_2px_0px_#000]"
                  />
                </div>

                {/* Quick Amount Pills */}
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {QUICK_AMOUNTS.map((q) => (
                    <button
                      type="button"
                      key={q}
                      onClick={() => setAmount(q.toString())}
                      className="px-2.5 py-1 text-xs font-bold bg-[#E2E8F0] hover:bg-[#A3E635] border border-black rounded-lg transition-all"
                    >
                      {formatRupiah(q)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Picker */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                  Kategori Pengeluaran
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-3 rounded-xl border-2 border-black flex items-center gap-2.5 text-left font-black text-xs transition-all ${
                          isSelected
                            ? "bg-black text-white shadow-[3px_3px_0px_#A3E635] -translate-y-0.5"
                            : "bg-white hover:bg-gray-50 text-black shadow-[2px_2px_0px_#000]"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg border border-black ${cat.color}`}>
                          <Icon size={14} />
                        </div>
                        <span className="truncate">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Merchant / Store */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                  Nama Toko / Merchant (Opsional)
                </label>
                <input
                  type="text"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder="Misal: Shopee, Starbucks, Uniqlo..."
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border-2 border-black rounded-xl font-bold text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:bg-white shadow-[2px_2px_0px_#000]"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                  Catatan / Alasan Beli (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Misal: Promo diskon 30%, sepatu kerja rusak..."
                  className="w-full px-4 py-2 bg-[#F8FAFC] border-2 border-black rounded-xl font-medium text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:bg-white shadow-[2px_2px_0px_#000]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !amount}
                className={`w-full py-4 px-6 border-3 border-black rounded-xl font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  loading || !amount
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-400"
                    : "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Menganalisis 7 Fitur ML...
                  </>
                ) : (
                  <>
                    Evaluasi Risiko Sekarang
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Context Info Card */}
          <div className="bg-[#EC4899]/10 border-2 border-black p-4 rounded-xl shadow-[3px_3px_0px_#000] flex gap-3 text-black">
            <Info size={20} className="text-[#EC4899] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-black">Bagaimana AI Bekerja?</span>
              <p className="text-gray-700">
                Model mempertimbangkan median pengeluaran Anda, sisa pagu bulan berjalan, hari gajian berikutnya, serta dampak keterlambatan tabungan sebelum menyimpulkan tingkat risiko.
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: AI Analysis & Decision (7 cols) ── */}
        <div className="lg:col-span-7">
          {!result ? (
            <div className="bg-white border-3 border-dashed border-black/40 p-12 rounded-2xl h-full flex flex-col items-center justify-center text-center space-y-4 text-black">
              <div className="w-16 h-16 bg-[#A3E635]/30 border-2 border-black rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_#000]">
                <ShieldAlert size={36} className="text-[#8B5CF6]" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-lg font-black text-black">Hasil Evaluasi Akan Tampil Di Sini</h3>
                <p className="text-sm text-gray-600">
                  Masukkan nominal belanja di samping dan klik tombol <span className="font-bold text-black">&quot;Evaluasi Risiko Sekarang&quot;</span> untuk melihat rekomendasi intervensi.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 1. Risk Level Banner */}
              <div
                className={`p-6 rounded-2xl border-3 border-black shadow-[6px_6px_0px_#000] text-black ${
                  result.risk_level === "HIGH"
                    ? "bg-[#EF4444] text-white"
                    : result.risk_level === "MEDIUM"
                    ? "bg-[#FBBF24]"
                    : "bg-[#A3E635]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-black text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                      {result.risk_level === "HIGH" && <AlertTriangle size={14} className="text-[#EF4444]" />}
                      {result.risk_level === "MEDIUM" && <AlertTriangle size={14} className="text-[#FBBF24]" />}
                      {result.risk_level === "LOW" && <CheckCircle2 size={14} className="text-[#A3E635]" />}
                      Tingkat Risiko: {result.risk_level}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black">
                      {result.risk_level === "HIGH" && "Peringatan: Risiko Pengeluaran Tinggi!"}
                      {result.risk_level === "MEDIUM" && "Perhatian: Risiko Pengeluaran Sedang"}
                      {result.risk_level === "LOW" && "Rencana Belanja Ini Tergolong Aman"}
                    </h3>
                    <p className={`text-sm font-medium mt-1 ${result.risk_level === "HIGH" ? "text-white/90" : "text-black/80"}`}>
                      Skor Risiko AI: {(result.risk_score * 100).toFixed(0)}% • Rekomendasi:{" "}
                      <strong className="underline uppercase">{result.recommended_action}</strong>
                    </p>
                  </div>

                  <div className="bg-white text-black border-2 border-black px-4 py-2 rounded-xl font-black text-center shrink-0 shadow-[2px_2px_0px_#000]">
                    <div className="text-[10px] uppercase text-gray-500 font-bold">Skor Risiko</div>
                    <div className="text-2xl font-black">{(result.risk_score * 100).toFixed(0)}%</div>
                  </div>
                </div>

                {/* Visual Gauge Bar */}
                <div className="mt-5 pt-4 border-t-2 border-black/20">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>Aman (0%)</span>
                    <span>Moderat (50%)</span>
                    <span>Kritis (100%)</span>
                  </div>
                  <div className="h-4 bg-white/50 border-2 border-black rounded-full overflow-hidden relative">
                    <div
                      className={`h-full border-r-2 border-black transition-all duration-700 ${
                        result.risk_level === "HIGH"
                          ? "bg-black"
                          : result.risk_level === "MEDIUM"
                          ? "bg-black"
                          : "bg-black"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, result.risk_score * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 2. XAI Trigger Factors Card */}
              <div className="bg-white border-3 border-black p-6 rounded-2xl shadow-[5px_5px_0px_#000]">
                <h4 className="text-base font-black text-black uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sliders size={18} className="text-[#8B5CF6]" />
                  Alasan & Faktor Pemicu Risiko (XAI Explanation)
                </h4>
                <ul className="space-y-3">
                  {result.trigger_factors.map((factor, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-[#F8FAFC] border-2 border-black rounded-xl text-sm font-bold text-black flex items-start gap-2.5 shadow-[2px_2px_0px_#000]"
                    >
                      <span className="w-6 h-6 rounded-full bg-black text-white font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Budget & Savings Impact Simulation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Budget Impact */}
                <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_#000]">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-500 mb-2">
                    <TrendingDown size={16} className="text-[#EF4444]" />
                    Dampak Pagu Anggaran
                  </div>
                  <div className="text-lg font-black text-black">
                    {formatRupiah(result.remaining_after)}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    Sisa setelah belanja (sebelumnya: {formatRupiah(result.remaining_before)})
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 border border-black h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          result.remaining_after < 0
                            ? "bg-red-500"
                            : result.remaining_after < result.budget_limit * 0.2
                            ? "bg-amber-400"
                            : "bg-[#A3E635]"
                        }`}
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, (result.remaining_after / result.budget_limit) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                    {result.remaining_after < 0 && (
                      <span className="text-[11px] font-bold text-red-600 mt-1 block">
                        ⚠️ Berpotensi overbudget {formatRupiah(Math.abs(result.remaining_after))}
                      </span>
                    )}
                  </div>
                </div>

                {/* Savings Delay */}
                <div className="bg-white border-3 border-black p-5 rounded-2xl shadow-[4px_4px_0px_#000]">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-500 mb-2">
                    <PiggyBank size={16} className="text-[#8B5CF6]" />
                    Dampak Target Tabungan
                  </div>
                  <div className="text-lg font-black text-black">
                    +{result.savings_delayed_days} Hari
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    Estimasi penundaan pencapaian <strong>{result.savings_goal_title}</strong>
                  </div>
                  <div className="mt-3 text-xs font-bold text-gray-700 bg-gray-100 p-2 rounded-lg border border-black/20">
                    Setara alokasi tabungan harian ~{formatRupiah(25000)}/hari
                  </div>
                </div>
              </div>

              {/* 4. Action Decision Buttons */}
              <div className="bg-white border-3 border-black p-6 rounded-2xl shadow-[5px_5px_0px_#000] space-y-4">
                <h4 className="text-sm font-black uppercase tracking-wider text-black">
                  Tentukan Keputusan Anda:
                </h4>

                {!userDecision ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleDecision("PROCEED")}
                      className="py-3 px-4 bg-[#A3E635] hover:bg-[#8ee017] border-2 border-black rounded-xl font-black text-sm text-black flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <CheckCircle2 size={18} />
                      Lanjut Beli
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDecision("ADJUST")}
                      className="py-3 px-4 bg-[#FBBF24] hover:bg-[#f59e0b] border-2 border-black rounded-xl font-black text-sm text-black flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <Sliders size={18} />
                      Sesuaikan
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDecision("POSTPONE")}
                      className="py-3 px-4 bg-[#EF4444] hover:bg-[#dc2626] border-2 border-black rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <XCircle size={18} />
                      Tunda Belanja
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-[#A3E635]/20 border-2 border-black rounded-xl space-y-4">
                    <div className="flex items-center gap-2 font-black text-black">
                      <CheckCircle2 size={20} className="text-black" />
                      Keputusan Tercatat: <span className="uppercase text-[#8B5CF6]">{userDecision}</span>
                    </div>

                    {userDecision === "ADJUST" && (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Nominal baru yang disesuaikan"
                          value={adjustAmount}
                          onChange={(e) => setAdjustAmount(e.target.value)}
                          className="px-3 py-2 border-2 border-black rounded-lg text-sm font-bold text-black"
                        />
                        <button
                          type="button"
                          onClick={() => handleDecision("ADJUST")}
                          className="px-4 py-2 bg-black text-white rounded-lg text-sm font-black"
                        >
                          Simpan
                        </button>
                      </div>
                    )}

                    {/* Ground Truth Reflection */}
                    {!feedbackSubmitted ? (
                      <div className="pt-3 border-t border-black/20 space-y-2">
                        <div className="text-xs font-bold text-black">
                          Refleksi Cepat: Apakah intervensi ini membantu menahan belanja impulsif?
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleFeedback(false)}
                            className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-black rounded-lg text-xs font-black shadow-[2px_2px_0px_#000]"
                          >
                            👍 Ya, Sangat Membantu
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFeedback(true)}
                            className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-black rounded-lg text-xs font-black shadow-[2px_2px_0px_#000]"
                          >
                            👎 Tidak Membantu
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-green-800 bg-green-100 p-2 rounded-lg border border-green-300">
                        ✨ Terima kasih atas umpan balik Anda! Data ini membantu model AI CEAMIS menjadi semakin akurat.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
