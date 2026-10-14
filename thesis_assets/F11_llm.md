# Laporan Audit dan Kendali Penggunaan LLM (Gemini) — Tugas F11

**Cabang:** `thesis/perbaikan-pilot`  
**Tanggal:** 14 Oktober 2026  
**Status:** Selesai ✅

---

## 1. Ringkasan Eksekutif

Audit komprehensif dilakukan terhadap seluruh titik integrasi Large Language Model (Google Gemini 1.5 Flash) pada platform CEAMIS. Implementasi F11 menambahkan arsitektur kendali modular berbasis konfigurasi (*feature flags*), memastikan prinsip minimalisasi data privasi (tidak ada nama, email, nomor HP, atau UUID pengguna yang dikirim ke LLM), menetapkan *safety guardrails* untuk mencegah saran investasi/kredit/pajak ilegal, serta menyediakan *fallback* deterministik saat LLM dinonaktifkan atau terjadi kendala jaringan.

---

## 2. Pemetaan Pemanggilan LLM (LLM Call Audit Matrix)

| Fitur / Modul | Lokasi Berkas & Fungsi | Model LLM | Field Data yang Dikirim (Payload) | Ada Identitas Pengguna (PII)? | Sakelar Lingkungan | Mekanisme Fallback (Saat Off / Gagal) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **OCR Receipt Parsing** | `backend/app/api/ocr.py`<br>`parse_receipt_with_llm()` | `gemini-1.5-flash` | Teks mentah hasil OCR pemindai struk (`receipt_text`). | **TIDAK** (Hanya teks baris belanja, nominal, tanggal struk). | `LLM_ENABLED`<br>`LLM_OCR_ENABLED` | `heuristic_parse_receipt()`: RegEx ekstraksi nama merchant, tanggal, total belanja, dan kategorisasi berbasis kata kunci. |
| **XAI Dashboard Insight** | `backend/app/services/insight_generator.py`<br>`generate_dashboard_insight()` | `gemini-1.5-flash` | Skor kesehatan finansial, saving rate, alokasi wants/needs, kategori pengeluaran (`Sehat`/`Waspada`/`Boros`), dan breakdown per kategori. | **TIDAK** (Hanya angka agregat finansial anonim, tanpa ID pengguna). | `LLM_ENABLED`<br>`LLM_INSIGHT_ENABLED` | `generate_deterministic_insight()`: Analisis berbasis template aturan statis per kategori kesehatan, dilengkapi rincian rekomendasi aksi prioritas. |
| **Adaptive Education Content** | `backend/app/api/education.py`<br>`get_module_content()` | `gemini-1.5-flash` | ID modul, judul modul, tingkat kesulitan (1/2/3), daftar topik kurikulum. | **TIDAK** (Hanya metadata silabus edukasi). | `LLM_ENABLED`<br>`LLM_EDUCATION_ENABLED` | `_build_static_module_content()`: Silabus dan materi teks kurikulum statis dari `app/utils/curriculum.py`. |
| **Adaptive Education Quiz** | `backend/app/api/education.py`<br>`generate_quiz()` | `gemini-1.5-flash` | ID modul, judul modul, target jumlah soal kuis. | **TIDAK** (Hanya silabus modul). | `LLM_EDUCATION_ENABLED`<br>`LLM_ENABLED` | `_build_static_quiz()`: 5 butir soal pilihan ganda deterministik yang relevan dengan topik modul bersangkutan. |
| **Weekly Education Insight** | `backend/app/api/education.py`<br>`get_weekly_insight()` | `gemini-1.5-flash` | Rangkuman agregat mingguan: spending category, streak hari belajar, modul terselesaikan. | **TIDAK** (Metrik agregat anonim). | `LLM_ENABLED`<br>`LLM_EDUCATION_ENABLED` | `_build_static_weekly_insight()`: Pesan evaluasi mingguan statis dengan rekomendasi aksi terukur. |
| **AI Chatbot** | `backend/app/services/llm_chatbot.py` *(Legacy)* | — | *Dihapus permanen pada Tugas F8* untuk meminimalisasi risiko hallusinasi dan kebocoran data. | — | — | Tidak ada (Chatbot ditiadakan). |

---

## 3. Tata Kelola Privasi Data (PII Scrubbing & Logging)

1. **Prinsip Minimalisasi Data (*Data Minimization*):**
   - Tidak ada parameter identifikasi pengguna (`user_id`, nama lengkap, alamat email, no telepon, no rekening, koordinat lokasi) yang disertakan pada prompt LLM mana pun.
   - Pada pemrosesan struk belanja fisik, teks hasil OCR dipindai secara langsung tanpa mengaitkan metadata akun pemilik struk pada payload API pihak ketiga.
2. **Pencegahan Kebocoran Log (*Log Sanitization*):**
   - Modul `backend/app/utils/safety_filter.py` menyediakan fungsi `scrub_pii_for_logging(text)`.
   - Pola sensitif seperti nomor kartu/rekening 16-digit, nomor telepon seluler (`08xx` atau `+62xx`), dan alamat email otomatis dimaskir (`[REDACTED_...]`) sebelum ditulis ke sistem log backend jika terjadi pencatatan debug.

---

## 4. Pembatas Keamanan Konten (*Safety Guardrails & AI Disclaimer*)

Untuk menjaga batas-batas etika penelitian mahasiswa dan menghindari liabilitas hukum terkait nasihat finansial profesional:
1. **Penyaring Konten Terlarang (*Prohibited Domains Filter*):**
   - Deteksi otomatis terhadap topik berisiko:
     - **Investasi Spekulatif:** Saham individu, kripto (*crypto/cryptocurrency*), reksadana spesifik, forex, trading margin.
     - **Utang & Pinjaman:** Rekomendasi pinjol, paylater, kartu kredit baru, atau pinjaman berbunga.
     - **Perpajakan:** Nasihat perencanaan pajak (*tax evasion / tax planning*).
   - Apabila terdeteksi dalam keluaran model, respons otomatis digantikan oleh pesan panduan edukatif aman:
     > *"Catatan: CEAMIS difokuskan pada pengelolaan anggaran harian dan pengendalian belanja impulsif. Kami tidak memberikan rekomendasi instrumen investasi, utang baru/pinjaman, atau konsultasi pajak."*
2. **AI Transparency Labeling:**
   Setiap respons berbasis LLM wajib menyertakan label penafian (*disclaimer*):
   > *"⚠️ [DISCLAIMER AI]: Konten ini dihasilkan secara otomatis oleh kecerdasan buatan untuk tujuan simulasi/edukasi penelitian dan bukan merupakan nasihat finansial, investasi, atau hukum resmi."*

---

## 5. Konfigurasi Sakelar Lingkungan (*Feature Flags*)

Didefinisikan pada `backend/app/utils/llm_config.py` dan didokumentasikan di `backend/.env.example`:

```bash
# ==========================================
# LLM FEATURE SWITCHES (Tugas F11)
# ==========================================
# Master switch: Jika 'false', semua pemanggilan LLM dialihkan ke fallback deterministik
LLM_ENABLED=true

# Granular feature switches:
LLM_OCR_ENABLED=true
LLM_INSIGHT_ENABLED=true
LLM_EDUCATION_ENABLED=true
```

Sifat evaluasi sakelar:
- `is_llm_enabled()` mengecek `LLM_ENABLED`.
- `is_llm_ocr_enabled()` bernilai `True` hanya jika `LLM_ENABLED=true` DAN `LLM_OCR_ENABLED=true`.
- Begitu pula untuk `is_llm_insight_enabled()` dan `is_llm_education_enabled()`.

---

## 6. Verifikasi Pengujian Otomatis

Pengujian unit otomatis diimplementasikan pada `backend/tests/test_llm_controls.py`:
1. `test_master_switch_disables_all`: Memverifikasi bahwa ketika `LLM_ENABLED=false`, fungsi pengecekan seluruh modul mengembalikan `False`.
2. `test_ocr_fallback_when_llm_disabled`: Menguji pemrosesan teks struk belanja saat LLM dimatikan; API menghasilkan ekstraksi merchant, total belanja, dan kategori melalui RegEx deterministik dengan flag `is_llm_fallback: True`.
3. `test_dashboard_insight_fallback`: Menguji endpoint insight saat `LLM_INSIGHT_ENABLED=false`; mengembalikan analisis rule-based berstruktur valid dengan indikator `is_fallback: True`.
4. `test_education_module_content_fallback`: Menguji modul edukasi saat LLM mati; mengembalikan silabus materi statis yang terstruktur tanpa galat.
5. `test_safety_guardrails_trigger`: Menguji pencegahan rekomendasi investasi/pinjaman berisiko dan memastikan penambahan label penafian AI.

**Hasil Eksekusi:**
- `Ran 5 tests in 0.019s — OK`
- Seluruh 49 tes pada suite pengujian backend lulus (`49 passed`).

---

## 7. Rekomendasi Teks untuk Lembar Informasi & Persetujuan Penelitian

Sesuai arahan pembimbing dan TUGAS F3 (Langkah 3), butir penanganan pihak ketiga wajib dicantumkan pada naskah *informed consent*:

```text
[PEMROSESAN PIHAK KETIGA]
Pengguna memahami dan menyetujui bahwa sistem CEAMIS dapat memanfaatkan layanan pemrosesan bahasa alami berbasis kecerdasan buatan pihak ketiga (Google Gemini API) untuk mengekstraksi teks struk belanja secara otomatis serta menghasilkan wawasan dan materi edukasi keuangan yang dipersonalisasi. Tidak ada data identitas pribadi (seperti nama lengkap, alamat email, atau nomor telepon) yang dikirimkan ke pihak ketiga; data yang diproses terbatas pada teks struk belanja atau angka agregat keuangan semata. Pengguna berhak menonaktifkan fitur bantuan AI atau mencabut persetujuan keikutsertaan sewaktu-waktu melalui menu Pengaturan Profil.
```
