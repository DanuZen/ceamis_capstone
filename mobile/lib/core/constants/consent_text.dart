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
      '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Penelitian ini bertujuan untuk menguji keefektifan sistem peringatan dini sebelum checkout dalam membantu pengguna mengendalikan perilaku belanja impulsif berdasarkan pola transaksi personal.';

  static const String dataCollected =
      '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Data yang dikumpulkan meliputi nominal rencana belanja, kategori transaksi, status pagu anggaran, target tabungan, respons intervensi (lanjut/sesuaikan/tunda), dan evaluasi pasca-keputusan. Semua data dienkripsi dan diproses secara pseudonim.';

  static const String withdrawalRights =
      '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Partisipasi bersifat sukarela. Anda berhak menarik persetujuan partisipasi penelitian kapan saja melalui menu Pengaturan Profil tanpa konsekuensi atau sanksi apa pun.';

  static const String researcherContact =
      '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Peneliti Utama: Danu (Kontak: peneliti@ceamis.ac.id / WhatsApp Lab Riset Komputasi).';

  static const String consentCheckboxLabel =
      'Saya telah membaca informasi di atas dan menyatakan SETUJU untuk berpartisipasi dalam penelitian ini.';
}
