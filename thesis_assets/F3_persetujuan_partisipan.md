# Laporan Tugas F3: Persetujuan Partisipan (Informed Consent)

> **Cabang Git:** `thesis/perbaikan-pilot`  
> **Modul Terkait:**  
> - Migrasi Database: [backend/db/migrations/002_consent_records.sql](file:///c:/Users/wira1/project/ceamis_capstone/backend/db/migrations/002_consent_records.sql)  
> - ORM Model: [backend/app/models/pre_purchase.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py) (`ConsentRecord`)  
> - Repositori: [backend/app/services/pre_purchase_repository.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_repository.py)  
> - API Endpoint: [backend/app/api/consent.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/consent.py), [backend/app/schemas/consent_schema.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/schemas/consent_schema.py)  
> - Teks Informasi: [mobile/lib/core/constants/consent_text.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/core/constants/consent_text.dart)  
> - UI Mobile: [mobile/lib/features/onboarding/screens/mobile_onboarding_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/onboarding/screens/mobile_onboarding_screen.dart), [mobile/lib/features/profile/screens/profile_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/profile/screens/profile_screen.dart)  
> - Pengujian: [backend/tests/test_consent.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/tests/test_consent.py)  
> **Status:** SELESAI  

---

## 1. Ringkasan Eksekutif

Dalam naskah proposal/tesis sebelumnya, terdapat klaim bahwa persetujuan partisipan (*informed consent*) dicatat ke dalam tabel `consent_records` dan dapat ditarik sewaktu-waktu. Namun verifikasi F0 membuktikan bahwa tabel dan fitur tersebut belum pernah diimplementasikan sama sekali.

Melalui Tugas F3:
1. Dibuat berkas migrasi SQL idempoten [002_consent_records.sql](file:///c:/Users/wira1/project/ceamis_capstone/backend/db/migrations/002_consent_records.sql) lengkap dengan RLS (Row-Level Security) kepemilikan data pengguna dan izin audit admin.
2. Dibangun endpoint REST API backend (`POST /api/v1/consent`, `POST /api/v1/consent/withdraw`, `GET /api/v1/consent/status`) dengan autentikasi token JWT Supabase.
3. Ditambahkan teks informasi penelitian terpusat pada [consent_text.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/core/constants/consent_text.dart) menggunakan penanda standar `[ISI SESUAI LEMBAR INFORMASI PENELITIAN]` agar peneliti dapat mengisi protokol etik resmi tanpa mengubah logika kode.
4. Diintegrasikan layar persetujuan (*informed consent card*) pada langkah ke-7 orientasi mobile (*onboarding*) dan sakelar pencabutan izin (*withdrawal switch*) beserta dialog konfirmasi pada layar profil.
5. Seluruh 23 pengujian backend lulus (4 pengujian baru untuk consent) dan `flutter analyze` lulus dengan 0 peringatan/isu.

---

## 2. Skema Basis Data SQL (`consent_records`)

Berkas: [backend/db/migrations/002_consent_records.sql](file:///c:/Users/wira1/project/ceamis_capstone/backend/db/migrations/002_consent_records.sql)

```sql
CREATE TABLE IF NOT EXISTS public.consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_version VARCHAR(20) NOT NULL DEFAULT 'v1.0',
    purpose TEXT NOT NULL DEFAULT 'Penelitian tesis evaluasi efektivitas intervensi pra-pembelian CEAMIS',
    given BOOLEAN NOT NULL DEFAULT TRUE,
    given_at TIMESTAMPTZ,
    withdrawn_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indeks
CREATE INDEX IF NOT EXISTS idx_consent_records_user_id ON public.consent_records(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_records_given ON public.consent_records(user_id, given);
CREATE INDEX IF NOT EXISTS idx_consent_records_created_at ON public.consent_records(created_at DESC);

-- Row-Level Security
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own consent records" ON public.consent_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consent records" ON public.consent_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own consent records" ON public.consent_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all consent records" ON public.consent_records
    FOR SELECT USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR (auth.jwt() ->> 'role') = 'admin'
    );
```

---

## 3. Alur Persetujuan & Penarikan Izin (*Consent & Withdrawal Flow*)

```text
[Partisipan Baru]
       │
       ▼
[Onboarding Langkah 1-6: Profil Finansial]
       │
       ▼
[Onboarding Langkah 7: Lembar Informasi Penelitian]
       │
       ├── Tidak Centang ──► Tombol "Mulai CEAMIS" Menolak (Peringatan Validasi)
       │
       └── Centang Setuju ──► Simpan lokal (consent_given=true)
                             └──► Kirim POST /api/v1/consent (given_at tercatat)
                                   └──► Masuk ke Dashboard Utama

[Pengaturan Profil (Pengguna Aktif)]
       │
       ▼
[Menu "Persetujuan Penelitian Tesis"]
       │
       ├── Tombol "Lihat Lembar Informasi" ──► Modal Dialog Teks Protokol & Kontak
       │
       └── Geser Sakelar ke Nonaktif (Tarik Izin)
             │
             ▼
       [Dialog Konfirmasi Penarikan Izin]
             │
             ├── Batal ──► Status tetap aktif
             │
             └── Setuju Tarik ──► Kirim POST /api/v1/consent/withdraw
                                  └──► Database mencatat given=false, withdrawn_at=NOW()
                                  └──► Data transaksi tidak dianalisis untuk riset
```

---

## 4. Teks Lembar Informasi Penelitian ([consent_text.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/core/constants/consent_text.dart))

Semua teks protokol penelitian dikumpulkan di satu berkas agar peneliti mudah menyesuaikannya:

```dart
class ConsentText {
  static const String consentVersion = 'v1.0';

  static const String researchTitle =
      '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Pengembangan Sistem Peringatan Dini Pengeluaran Tidak Terencana melalui Intervensi Pra-Pembelian Berbasis Pola Transaksi Personal';

  static const String researchPurpose =
      '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Penelitian ini bertujuan untuk menguji keefektifan sistem peringatan dini sebelum checkout dalam membantu pengguna mengendalikan perilaku belanja impulsif berdasarkan pola transaksi personal.';

  static const String dataCollected =
      '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Data yang dikumpulkan meliputi nominal rencana belanja, kategori transaksi, status pagu anggaran, target tabungan, respons intervensi (lanjut/sesuaikan/tunda), dan evaluasi pasca-keputusan. Semua data dienkripsi dan diproses secara pseudonim.';

  static const String thirdPartyProcessing =
      '[PEMROSESAN PIHAK KETIGA] [ISI SESUAI LEMBAR INFORMASI PENELITIAN] '
      'Sistem CEAMIS memanfaatkan layanan pemrosesan bahasa alami berbasis kecerdasan buatan pihak ketiga (Google Gemini API) '
      'untuk mengekstraksi teks struk belanja secara otomatis serta menyusun ringkasan wawasan dan materi edukasi keuangan '
      'bila fitur LLM aktif. Tidak ada identitas pribadi (seperti nama lengkap, alamat email, atau nomor telepon) yang dikirimkan '
      'ke pihak ketiga; data yang diproses terbatas pada teks hasil pemindaian struk mentah atau angka agregat keuangan semata.';

  static const String withdrawalRights =
      '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Partisipasi bersifat sukarela. Anda berhak menarik persetujuan partisipasi penelitian kapan saja melalui menu Pengaturan Profil tanpa konsekuensi atau sanksi apa pun.';

  static const String researcherContact =
      '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Peneliti Utama: Danu (Kontak: peneliti@ceamis.ac.id / WhatsApp Lab Riset Komputasi).';

  static const String consentCheckboxLabel =
      'Saya telah membaca informasi di atas dan menyatakan SETUJU untuk berpartisipasi dalam penelitian ini.';
}
```


---

## 5. Bukti Pencatatan & Penarikan Persetujuan (Hasil Uji Unit)

Pengujian terotomatisasi pada [backend/tests/test_consent.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/tests/test_consent.py) memverifikasi:

1. **`test_record_consent_unauthorized_fails`:**  
   Panggilan tanpa autentikasi JWT / user ID ditolak dengan status HTTP `401 Unauthorized`.
2. **`test_record_consent_with_bearer_jwt`:**  
   Mencatat persetujuan dengan token JWT menghasilkan `given: true`, `given_at: <ISO timestamp>`, dan `withdrawn_at: None`.
3. **`test_withdraw_consent_lifecycle`:**  
   Pengguna memberikan izin (`given: true`) -> kemudian memanggil penarikan izin -> status berubah menjadi `given: false` dan `withdrawn_at: <ISO timestamp>`.
4. **`test_status_new_user_default_false`:**  
   Pengguna baru yang belum menyetujui secara eksplisit menghasilkan status default `given: false`.

### Ringkasan Eksekusi Test Suite:
```text
Ran 23 tests in 0.593s
OK
```
Semua 23 tes backend (F4 + F1 + F2 + F3) lulus 100%.  
Flutter analyze (`flutter analyze`) lulus dengan **No issues found**.
