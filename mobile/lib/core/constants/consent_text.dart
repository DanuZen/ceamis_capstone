// lib/core/constants/consent_text.dart

/// Teks Pengganti Terpusat Lembar Informasi Penelitian & Persetujuan Partisipan (Informed Consent).
/// CATATAN PENELITI: Jangan mengarang isi hukum. Silakan sesuaikan teks di bawah ini
/// dengan Lembar Informasi Penelitian dan Protokol Etik resmi yang telah disetujui.
class ConsentText {
  ConsentText._();

  static const String consentVersion = 'v1.0';

  static const String researchTitle =
      '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Pengembangan Sistem Peringatan Dini Pengeluaran Tidak Terencana melalui Intervensi Pra-Pembelian Berbasis Pola Transaksi Personal';

  static const String researchPurpose =
      '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Penelitian ini bertujuan untuk menguji keefektifan sistem peringatan dini sebelum checkout dalam membantu pengguna mengendalikan pengeluaran tidak terencana berdasarkan pola transaksi personal.';

  static const String dataCollected =
      '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Data yang dikumpulkan meliputi nominal rencana belanja, kategori transaksi, status pagu anggaran, target tabungan, respons intervensi (lanjut/sesuaikan/tunda), dan evaluasi pasca-keputusan. Semua data [ISI SESUAI LEMBAR INFORMASI PENELITIAN] dan diproses secara pseudonim.';

  static const String thirdPartyProcessing =
      '[PEMROSESAN PIHAK KETIGA] [ISI SESUAI LEMBAR INFORMASI PENELITIAN] '
      'Sistem CEAMIS memanfaatkan layanan pemrosesan bahasa alami berbasis kecerdasan buatan pihak ketiga (Google Gemini API) '
      'untuk mengekstraksi teks struk belanja secara otomatis serta menyusun ringkasan wawasan dan materi edukasi keuangan '
      'bila fitur LLM aktif. Tidak ada identitas pribadi (seperti nama lengkap, alamat email, atau nomor telepon) yang dikirimkan '
      'ke pihak ketiga; data yang diproses terbatas pada teks hasil pemindaian struk mentah atau angka agregat keuangan semata.';

  static const String withdrawalRights =
      '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Partisipasi bersifat sukarela. Anda berhak menarik persetujuan partisipasi penelitian kapan saja melalui menu Pengaturan Profil tanpa konsekuensi atau sanksi apa pun.';

  static const String researcherContact =
      '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Peneliti Utama: [NAMA PENELITI] (Surat Elektronik: [SURAT ELEKTRONIK PENELITI]), Dosen Pembimbing: [NAMA DOSEN PEMBIMBING].';

  static const String consentCheckboxLabel =
      'Saya telah membaca informasi di atas dan menyatakan SETUJU untuk berpartisipasi dalam penelitian ini.';
}
