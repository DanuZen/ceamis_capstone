# Laporan Tugas F8 (Tahap 1): Inventarisasi dan Pemetaan Pembersihan Chatbot & Arsip NestJS

## 1. Pendahuluan
Berdasarkan arahan akademik dan dokumen perbaikan ([`docs/AGENT_PERBAIKAN.md`](file:///c:/Users/wira1/project/ceamis_capstone/docs/AGENT_PERBAIKAN.md)), fokus kecerdasan buatan CEAMIS 2.0 dialihkan secara terarah ke **Intervensi Keputusan Pra-Pembelian (*Pre-Purchase Risk Prediction*)** dan **Tata Kelola Model ML (*Model Governance*)**. Fitur chatbot bebas (*conversational AI*) dievaluasi keluar dari cakupan inti skripsi untuk mencegah ketidakjelasan kontribusi ilmiah (*scope creep*).

Sesuai aturan Tahap 1, dokumen ini menyajikan pemetaan komprehensif ke dalam tiga kategori:
1. **Akan Dihapus** (setelah persetujuan pengguna pada Tahap 2)
2. **Akan Dipindahkan** (aset kritis yang harus diselamatkan ke direktori aktif sebelum penghapusan arsip)
3. **Tidak Boleh Disentuh** (komponen LLM Gemini/Vision non-chatbot yang sah dan masih aktif)

---

## 2. Pemetaan Komponen

### 2.1 Daftar 1: Komponen yang Akan Dihapus (Tahap 2)

| # | Lokasi Berkas / Baris | Deskripsi / Alasan |
|---|---|---|
| 1 | `backend_nestjs_archive/` (seluruh direktori selain migrasi) | Seluruh kode backend NestJS 1.0 yang sudah digantikan penuh oleh FastAPI (termasuk `src/ai/ai.controller.ts`, `src/ai/ai.service.ts` yang memuat fungsi `chat()`, modul auth, transactions, users, dan konfigurasi npm). |
| 2 | `frontend/src/lib/api.ts` (L120–L123, L274–L287) | Definisi endpoint mati `api.chat: (payload: ChatPayload) => request<ChatResult>('/ai/chat')`, antarmuka `ChatPayload`, dan `ChatResult` yang tidak lagi memiliki backend pemroses. |
| 3 | `frontend/src/app/dashboard/reports/page.tsx.backup` | Berkas cadangan usang yang memuat pemicu event chat warisan. |
| 4 | `backend/.env.example` (L7) | Baris komentar `# chatbot` yang tidak lagi relevan. |

*(Catatan: Pemicu event UI `window.dispatchEvent(new CustomEvent("cami-close-chat"))` pada halaman dashboard web dan kelas CSS `.chat-bubble` di `dashboard.css` dapat dibersihkan secara aman atau dibiarkan tanpa efek samping).*

---

### 2.2 Daftar 2: Komponen yang Akan Dipindahkan (*Must Be Preserved / Moved*)

Sebelum direktori `backend_nestjs_archive/` dihapus, berkas-berkas SQL berikut **wajib dipindahkan** ke direktori migrasi aktif `backend/db/migrations/`:

| # | Berkas Sumber (Arsip) | Target Lokasi Aktif | Urgensi / Alasan |
|---|---|---|---|
| 1 | `backend_nestjs_archive/supabase/migrations/001_initial_schema.sql` | `backend/db/migrations/000_initial_schema.sql` | **SANGAT KRUSIAL.** Merupakan satu-satunya sumber kebenaran (*single source of truth*) skema DDL PostgreSQL Supabase untuk tabel-tabel utama: `user_profiles`, `transactions`, `categories`, `wallets`, `budgets`, `warnings`, `debt_records`, serta aturan RLS (*Row Level Security*). |
| 2 | `backend_nestjs_archive/supabase/migrations/002_model3_onboarding.sql` | `backend/db/migrations/000_model3_onboarding.sql` | Skrip skema profil risiko onboarding yang melengkapi skema dasar. |

*Setelah dipindahkan, direktori `backend/db/migrations/` akan memiliki urutan skrip migrasi yang lengkap dan mandiri:*
- `000_initial_schema.sql` (Skema dasar tabel finansial CEAMIS)
- `000_model3_onboarding.sql` (Skema profil risiko awal)
- `001_pre_purchase_and_governance.sql` (Tabel pra-pembelian, keputusan, umpan balik, tata kelola model)
- `002_consent_records.sql` (Tabel persetujuan partisipan penelitian)

---

### 2.3 Daftar 3: Komponen yang TIDAK BOLEH DISENTUH (*Must NOT be Touched*)

Modul-modul berikut memanfaatkan LLM (Google Gemini 2.0 Flash / Groq) namun **BUKAN merupakan chatbot percakapan**, melainkan fitur pendukung AI yang sah:

| # | Komponen / File | Peran & Alasan Ilmiah |
|---|---|---|
| 1 | [`backend/app/api/ocr.py`](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/ocr.py) | **Smart OCR Struk Belanja**: Menggunakan `google.genai` SDK / Gemini 2.0 Flash Multimodal Vision untuk mengekstraksi data merchant, tanggal, item barang, dan nominal dari foto struk belanja secara terstruktur (JSON). |
| 2 | [`backend/app/api/dashboard_insight.py`](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/dashboard_insight.py) & [`backend/app/services/insight_generator.py`](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/insight_generator.py) | **Explainable AI (XAI) Insight**: Menghasilkan narasi penjelasan otomatis berbasis konteks pengeluaran dan skor kesehatan finansial pengguna pada Beranda (tuntutan dosen pembimbing untuk transparansi AI). |
| 3 | [`backend/app/api/education.py`](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/education.py) & [`backend/app/utils/curriculum.py`](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/utils/curriculum.py) | **Financial Education Generator**: Membangkitkan materi literasi dan kuis interaktif berdasarkan kurikulum finansial adaptif untuk pengguna. |
| 4 | [`backend/app/utils/llm_client.py`](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/utils/llm_client.py) | **Klien Abstraksi LLM**: Menyediakan fungsi `call_llm`, `call_gemini`, dan `call_groq` dengan sistem *fallback* otomatis yang dibutuhkan oleh `insight_generator.py` dan `education.py`. |
| 5 | Teks "CAMI AI" di Mobile ([`home_screen.dart`](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/home/screens/home_screen.dart), [`health_score_screen.dart`](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/health_score/screens/health_score_screen.dart)) | Merupakan label penamaan kartu wawasan/rekomendasi (*AI Insight Card*), bukan antarmuka percakapan chatbot. |

---

## 3. Rencana Eksekusi Tahap 2 (Setelah Persetujuan Pengguna)
1. Salin berkas `001_initial_schema.sql` dan `002_model3_onboarding.sql` dari `backend_nestjs_archive/supabase/migrations/` ke `backend/db/migrations/000_initial_schema.sql` dan `backend/db/migrations/000_model3_onboarding.sql`.
2. Bersihkan referensi mati `chat` pada `frontend/src/lib/api.ts` dan hapus berkas usang `page.tsx.backup`.
3. Hapus direktori arsip `backend_nestjs_archive/`.
4. Jalankan seluruh rangkaian pengujian backend dan analisis kode mobile/frontend untuk memastikan integritas monorepo tetap 100% terjaga.
