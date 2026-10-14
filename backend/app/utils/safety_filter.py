"""
Filter Keamanan & Batasan Penelitian Penggunaan LLM (Tugas F11)
CEAMIS 2.0 — Pembatas Konten & Label AI

Fungsi:
1. Menyuntikkan batasan instruksi sistem agar model tidak memberikan rekomendasi
   investasi spekulatif, fasilitas pinjaman/kredit berbunga tinggi, atau saran pajak formal.
2. Memeriksa teks keluaran dan menyematkan label transparansi bahwa konten dihasilkan oleh AI.
3. Mendeteksi dan mencegah pencatatan data identitas pribadi (PII) ke log.
"""

import re
from typing import Tuple


AI_DISCLAIMER = (
    "\n\n*(Catatan: Informasi di atas disusun secara otomatis oleh AI untuk tujuan edukasi "
    "literasi keuangan, bukan merupakan nasihat finansial resmi, rekomendasi investasi, atau saran perpajakan.)*"
)

RESEARCH_SAFETY_INSTRUCTION = """
BATASAN KESELAMATAN & BATASAN PENELITIAN (MUTLAK):
1. DILARANG memberikan rekomendasi pembelian produk investasi spesifik (saham, kripto, forex, derivatif, trading).
2. DILARANG merekomendasikan pinjaman online (pinjol), fasilitas kredit, atau menambah utang baru.
3. DILARANG memberikan advis perpajakan formal atau nasihat kepatuhan hukum.
4. Seluruh saran hanya bersifat edukasi literasi perencanaan anggaran dan pengendalian belanja impulsif.
""".strip()

# Pola frasa berisiko tinggi yang dilarang muncul dalam saran finansial
RESTRICTED_PATTERNS = [
    r"\b(beli|investasi)\s+(saham|kripto|crypto|bitcoin|forex)\b",
    r"\b(pinjam\s+di|daftar)\s+(pinjol|paylater|kredit\s+online)\b",
    r"\b(dijamin\s+cuan|keuntungan\s+pasti|return\s+\d+%)\b",
    r"\b(hindari|rekayasa)\s+pajak\b",
]


def apply_safety_guardrails(system_prompt: str) -> str:
    """Menyisipkan batasan keselamatan penelitian ke dalam system prompt LLM."""
    return f"{system_prompt}\n\n{RESEARCH_SAFETY_INSTRUCTION}"


def filter_financial_content(text: str, append_disclaimer: bool = True) -> Tuple[str, bool]:
    """
    Memfilter keluaran LLM untuk mendeteksi pelanggaran batasan finansial.
    Mengembalikan (teks_hasil, apakah_terjadi_pelanggaran).
    """
    if not text:
        return "", False

    violation_found = False
    cleaned_text = text

    for pattern in RESTRICTED_PATTERNS:
        if re.search(pattern, cleaned_text, re.IGNORECASE):
            violation_found = True
            cleaned_text = re.sub(
                pattern,
                "[Konten rekomendasi spekulatif disaring demi kepatuhan etika penelitian]",
                cleaned_text,
                flags=re.IGNORECASE,
            )

    if append_disclaimer and AI_DISCLAIMER.strip() not in cleaned_text:
        cleaned_text = f"{cleaned_text.rstrip()}{AI_DISCLAIMER}"

    return cleaned_text, violation_found


def scrub_pii_for_logging(text: str) -> str:
    """Menghapus indikasi surel, nomor HP, atau nomor kartu sebelum dicatat ke log aplikasi."""
    if not text:
        return ""
    # Masking email
    masked = re.sub(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", "[EMAIL_TERSEMBUNYI]", text)
    # Masking no telepon (format Indonesia 08xxx / +62xxx)
    masked = re.sub(r"(\+62|62|0)8[1-9][0-9]{6,10}", "[TELP_TERSEMBUNYI]", masked)
    # Masking 16 digit no kartu
    masked = re.sub(r"\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b", "[KARTU_TERSEMBUNYI]", masked)
    return masked
