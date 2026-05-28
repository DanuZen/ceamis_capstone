# app/services/insight_generator.py
from app.schemas.request_response import DashboardInsightRequest
# Import main entry point client LLM terpusat Anda
from app.utils.llm_client import call_llm

class LLMInsightGenerator:
    async def generate_dashboard_insight(self, data: DashboardInsightRequest) -> str:
        """
        Menyusun prompt finansial berbasis data riil model dan meminta 
        llm_client (Gemini/Groq) untuk menghasilkan narasi XAI secara asinkronus.
        """
        
        # 1. Definisikan instruksi karakter asisten AI sebagai System Prompt
        system_prompt = """
        Kamu adalah CAMI, asisten AI keuangan pribadi Gen-Z yang cerdas, solutif, jujur, dan sedikit sarkas untuk aplikasi CIAMIS (Catatan Income Anak Manis).
        Tugasmu adalah memberikan evaluasi finansial bulanan (Explainable AI) yang dipersonalisasi berdasarkan data riil hasil perhitungan model kami.

        Panduan Penulisan Insight & Format:
        1. Sapa pengguna dengan panggilan santai seperti 'Bestie', 'Bro', atau 'Sis'. Gunakan gaya bahasa anak muda/Gen-Z Indonesia yang kasual.
        2. JELASKAN SECARA LOGIS (XAI) mengapa skor kesehatan keuangan mereka berada di level tersebut.
        3. [INSTRUKSI WAJIB FORMAT]: Setiap berganti topik atau paragraf, WAJIB gunakan pemisah double enter atau double newline (\\n\\n) agar teks tidak menumpuk parah di frontend.
        4. [INSTRUKSI WAJIB BOLD]: Jika ingin menebalkan kata penting, gunakan markdown bold murni seperti **KataPenting** tanpa ada spasi di dalam tanda bintang (JANGAN menulis ** Kata Penting ** karena formatnya akan rusak).
        5. Buat pesan yang padat, maksimal 3 paragraf pendek saja.
        """

        # 2. Masukkan muatan payload data metrik riil sebagai pesan dari user
        user_content = f"""
        Berikut adalah data keuangan saya bulan ini, tolong buatkan evaluasi insight:
        - Skor Kesehatan Keuangan: {data.health_score}/100 (Kategori: {data.health_label})
        - Rasio Menabung (Saving Rate): {data.saving_rate * 100:.1f}%
        - Rasio Keinginan (Wants Ratio): {data.wants_ratio * 100:.1f}%
        - Rasio Utang (DTI Ratio): {data.dti_ratio * 100:.1f}%
        - Kepatuhan Anggaran (Budget Adherence): {data.budget_adherence * 100:.1f}%
        - Persona Perilaku Belanja: {data.persona}
        - Kategori Pengeluaran Terbesar: {data.most_spent_category}
        - Profil Risiko Investasi: {data.risk_profile}
        """

        # Membentuk struktur list sesuai standar input call_llm
        messages = [{"role": "user", "content": user_content}]

        # 3. Panggil fungsi client asinkronus (Otomatis menangani Primary & Fallback)
        ai_response = await call_llm(system_prompt, messages)
        return ai_response

# Inisialisasi secara global
insight_generator = LLMInsightGenerator()