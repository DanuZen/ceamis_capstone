# app/utils/safety_filter.py

# ── Topik di luar keuangan ────────────────────────────────
OFF_TOPIC_KEYWORDS = [
    "resep", "masakan", "makanan enak", "restoran",
    "politik", "pemilu", "presiden", "partai",
    "berita", "olahraga", "bola", "basket",
    "film", "drakor", "anime", "musik", "lagu",
    "game", "mobile legend", "pacaran", "bucin",
    "tugas kuliah", "skripsi", "ujian"
]

# ── Sinyal krisis keuangan yang memprihatinkan ────────────
CRISIS_KEYWORDS = [
    "bunuh diri", "mau mati", "udah ga kuat",
    "hopeless", "putus asa banget", "ga ada harapan",
    "nyerah", "cape hidup"
]

# ── Pertanyaan sensitif yang perlu disclaimer ─────────────
SENSITIVE_FINANCIAL_KEYWORDS = [
    "pinjol", "pinjaman online", "investasi bodong",
    "trading forex", "binary option", "mlm",
    "kripto", "saham", "reksadana"
]

CRISIS_RESPONSE = """
Hei, CAMI notice kamu lagi overwhelmed banget soal keuangan 😔

It's okay — banyak yang ngerasain hal yang sama, dan itu valid.
Kalau kamu lagi butuh ngobrol lebih dalam dengan seseorang,
kamu bisa hubungi **Into The Light Indonesia** di 119 ext 8,
mereka siap dengerin kamu 24 jam 💙

Soal keuangannya, kita bisa selesaikan satu langkah kecil dulu.
Kamu mau mulai dari mana?
"""

OFF_TOPIC_RESPONSE = """
Haha itu di luar keahlian CAMI bestie 😄

CAMI spesialis urusan dompet dan keuangan kamu aja.
Ada yang mau ditanyain soal nabung, budgeting, atau
gimana cara capai target tabungan kamu?
"""

SENSITIVE_DISCLAIMER = """
Soal {topic}, CAMI bisa kasih info umum tapi bukan saran
investasi ya — CAMI bukan financial advisor resmi.

Untuk keputusan finansial besar, sebaiknya konsultasi
ke perencana keuangan berlisensi (CFP) dulu 🙏

Yang bisa CAMI bantu: gimana kondisi keuanganmu sekarang
dan strategi nabung yang realistis buat kamu.
"""


def check_message(message: str) -> dict:
    """
    Cek pesan user, return status dan response jika perlu dihandle khusus.

    Returns:
        {
            "status": "ok" | "crisis" | "off_topic" | "sensitive",
            "response": str | None
        }
    """
    msg_lower = message.lower()

    # Cek krisis dulu — prioritas tertinggi
    if any(kw in msg_lower for kw in CRISIS_KEYWORDS):
        return {
            "status"  : "crisis",
            "response": CRISIS_RESPONSE
        }

    # Cek off-topic
    if any(kw in msg_lower for kw in OFF_TOPIC_KEYWORDS):
        return {
            "status"  : "off_topic",
            "response": OFF_TOPIC_RESPONSE
        }

    # Cek topik sensitif
    for kw in SENSITIVE_FINANCIAL_KEYWORDS:
        if kw in msg_lower:
            return {
                "status"  : "sensitive",
                "response": None,   # tetap proses tapi tambah disclaimer
                "topic"   : kw
            }

    return {"status": "ok", "response": None}