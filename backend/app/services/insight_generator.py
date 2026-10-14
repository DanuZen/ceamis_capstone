# app/services/insight_generator.py
from app.schemas.request_response import DashboardInsightRequest
from app.utils.llm_client import call_llm
from app.utils.llm_config import is_llm_insight_enabled
from app.utils.safety_filter import apply_safety_guardrails, filter_financial_content


def generate_deterministic_insight(data: DashboardInsightRequest) -> str:
    """
    Fallback wawasan finansial deterministik berbasis aturan (Tugas F11).
    Digunakan saat sakelar LLM_INSIGHT_ENABLED dimatikan atau layanan LLM tidak tersedia.
    Bebas PII dan tidak memberikan spekulasi investasi/pinjaman.
    """
    summary = (
        f"Evaluasi Finansial Terencana: Skor kesehatan finansialmu saat ini adalah "
        f"**{data.health_score:.1f}/100** dengan predikat **{data.health_label}**.\n\n"
        f"Rasio tabungan tercatat {data.saving_rate * 100:.1f}%, sementara porsi pengeluaran keinginan (wants) "
        f"mencapai {data.wants_ratio * 100:.1f}% dengan kategori terbesar pada pos **{data.most_spent_category}**.\n\n"
        f"Tingkat kepatuhan terhadap anggaranmu berada di angka {data.budget_adherence * 100:.1f}%. "
        f"Tetap prioritaskan pemenuhan pos kebutuhan primer dan jaga cadangan dana daruratmu."
    )
    return summary


class LLMInsightGenerator:
    async def generate_dashboard_insight(self, data: DashboardInsightRequest) -> str:
        """
        Menyusun narasi XAI penjelasan kesehatan finansial bulanan.
        Mendukung sakelar kendali LLM dan pembatas keselamatan penelitian (Tugas F11).
        """
        # 1. Cek sakelar kendali LLM
        if not is_llm_insight_enabled():
            return generate_deterministic_insight(data)

        # 2. Definisikan System Prompt dengan pembatas keselamatan penelitian
        base_system_prompt = """
        Kamu adalah CAMI, asisten AI keuangan pribadi Gen-Z yang cerdas, solutif, jujur, dan ramah untuk aplikasi CIAMIS.
        Tugasmu adalah memberikan evaluasi finansial bulanan (Explainable AI) yang dipersonalisasi berdasarkan data riil hasil perhitungan model kami.

        Panduan Penulisan Insight & Format:
        1. Sapa pengguna dengan panggilan santai seperti 'Bestie', 'Bro', atau 'Sis'. Gunakan gaya bahasa anak muda Indonesia yang sopan.
        2. JELASKAN SECARA LOGIS (XAI) mengapa skor kesehatan keuangan mereka berada di level tersebut.
        3. [INSTRUKSI WAJIB FORMAT]: Setiap berganti topik atau paragraf, WAJIB gunakan pemisah double newline (\\n\\n).
        4. [INSTRUKSI WAJIB BOLD]: Jika ingin menebalkan kata penting, gunakan markdown bold murni seperti **KataPenting**.
        5. Buat pesan yang padat, maksimal 3 paragraf pendek saja.
        """
        system_prompt = apply_safety_guardrails(base_system_prompt)

        # 3. Payload hanya berisi metrik finansial tanpa data identitas pribadi (PII)
        user_content = f"""
        Berikut adalah ringkasan metrik keuangan bulan ini (tanpa identitas pribadi):
        - Skor Kesehatan Keuangan: {data.health_score}/100 (Kategori: {data.health_label})
        - Rasio Menabung (Saving Rate): {data.saving_rate * 100:.1f}%
        - Rasio Keinginan (Wants Ratio): {data.wants_ratio * 100:.1f}%
        - Rasio Utang (DTI Ratio): {data.dti_ratio * 100:.1f}%
        - Kepatuhan Anggaran (Budget Adherence): {data.budget_adherence * 100:.1f}%
        - Gaya Belanja: {data.spending_category}
        - Kategori Pengeluaran Terbesar: {data.most_spent_category}
        - Profil Risiko: {data.risk_profile}
        """

        messages = [{"role": "user", "content": user_content}]

        try:
            ai_response = await call_llm(system_prompt, messages)
            # 4. Saring keluaran dari rekomendasi terlarang dan sematkan label AI
            cleaned_insight, _ = filter_financial_content(ai_response, append_disclaimer=True)
            return cleaned_insight
        except Exception:
            # Fallback deterministik jika pemanggilan gagal
            return generate_deterministic_insight(data)


# Inisialisasi secara global
insight_generator = LLMInsightGenerator()