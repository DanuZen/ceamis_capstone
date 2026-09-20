# app/utils/curriculum.py

CURRICULUM = {
    "level_1": {
        "label"      : "Beginner",
        "description": "Fondasi literasi keuangan untuk mulai",
        "modules"    : [
            {
                "module_id"  : "M01",
                "level"      : 1,
                "order"      : 1,
                "title"      : "Kenali Dompetmu",
                "description": "Pahami kondisi keuanganmu sekarang",
                "duration"   : "5 menit",
                "xp_reward"  : 50,
                "topics"     : [
                    "apa itu cashflow",
                    "bedain pemasukan dan pengeluaran",
                    "kenapa perlu catat keuangan",
                    "tanda keuangan sehat vs tidak sehat"
                ],
                "quiz_count" : 5,
                "pass_score" : 70,       # minimal 70% untuk lulus
                "unlocks"    : "M02"     # modul yang di-unlock setelah lulus
            },
            {
                "module_id"  : "M02",
                "level"      : 1,
                "order"      : 2,
                "title"      : "Aturan 50/30/20",
                "description": "Formula budgeting paling simpel",
                "duration"   : "7 menit",
                "xp_reward"  : 50,
                "topics"     : [
                    "apa itu aturan 50/30/20",
                    "cara hitung needs wants saving dari income",
                    "adaptasi 50/30/20 untuk mahasiswa",
                    "contoh penerapan nyata"
                ],
                "quiz_count" : 5,
                "pass_score" : 70,
                "unlocks"    : "M03"
            },
            {
                "module_id"  : "M03",
                "level"      : 1,
                "order"      : 3,
                "title"      : "Bahaya Pengeluaran Impulsif",
                "description": "Kenali dan kendalikan pengeluaran tidak terencana",
                "duration"   : "6 menit",
                "xp_reward"  : 50,
                "topics"     : [
                    "apa itu pengeluaran impulsif",
                    "trigger impulsif yang paling umum",
                    "aturan 24 jam sebelum beli",
                    "bedakan needs vs wants vs nice-to-have"
                ],
                "quiz_count" : 5,
                "pass_score" : 70,
                "unlocks"    : "M04"
            },
            {
                "module_id"  : "M04",
                "level"      : 1,
                "order"      : 4,
                "title"      : "Dana Darurat Mini",
                "description": "Safety net pertama yang wajib dimiliki",
                "duration"   : "6 menit",
                "xp_reward"  : 75,       # modul terakhir level = XP lebih
                "topics"     : [
                    "kenapa dana darurat penting",
                    "berapa minimal dana darurat",
                    "cara mulai dari nol",
                    "simpan di mana dana darurat"
                ],
                "quiz_count" : 5,
                "pass_score" : 70,
                "unlocks"    : "M05"
            },
        ]
    },
    "level_2": {
        "label"      : "Intermediate",
        "description": "Strategi praktis untuk keuangan lebih optimal",
        "modules"    : [
            {
                "module_id"  : "M05",
                "level"      : 2,
                "order"      : 5,
                "title"      : "Budgeting yang Realistis",
                "description": "Buat budget yang bisa dijalani, bukan cuma di kertas",
                "duration"   : "8 menit",
                "xp_reward"  : 75,
                "topics"     : [
                    "kenapa budget sering gagal",
                    "cara buat budget yang fleksibel",
                    "tools sederhana untuk budgeting",
                    "evaluasi budget tiap akhir bulan"
                ],
                "quiz_count" : 5,
                "pass_score" : 70,
                "unlocks"    : "M06"
            },
            {
                "module_id"  : "M06",
                "level"      : 2,
                "order"      : 6,
                "title"      : "Deteksi Bocor Halus",
                "description": "Temukan pengeluaran kecil yang menguras dompet",
                "duration"   : "7 menit",
                "xp_reward"  : 75,
                "topics"     : [
                    "apa itu bocor halus",
                    "kategori pengeluaran paling sering jadi bocor halus",
                    "cara audit pengeluaran",
                    "strategi pangkas bocor halus"
                ],
                "quiz_count" : 5,
                "pass_score" : 70,
                "unlocks"    : "M07"
            },
            {
                "module_id"  : "M07",
                "level"      : 2,
                "order"      : 7,
                "title"      : "Strategi Nabung Konsisten",
                "description": "Bangun kebiasaan menabung yang bertahan lama",
                "duration"   : "8 menit",
                "xp_reward"  : 75,
                "topics"     : [
                    "kenapa nabung sering gagal di tengah jalan",
                    "metode pay yourself first",
                    "automate saving",
                    "cara tetap konsisten saat income tidak tetap"
                ],
                "quiz_count" : 5,
                "pass_score" : 70,
                "unlocks"    : "M08"
            },
            {
                "module_id"  : "M08",
                "level"      : 2,
                "order"      : 8,
                "title"      : "Kelola Hutang & Paylater",
                "description": "Strategi bijak menghadapi hutang dan cicilan",
                "duration"   : "9 menit",
                "xp_reward"  : 100,
                "topics"     : [
                    "hutang produktif vs konsumtif",
                    "bahaya paylater dan pinjol",
                    "metode avalanche dan snowball",
                    "kapan boleh dan tidak boleh berhutang"
                ],
                "quiz_count" : 5,
                "pass_score" : 70,
                "unlocks"    : "M09"
            },
        ]
    },
    "level_3": {
        "label"      : "Advanced",
        "description": "Optimasi dan mindset untuk kebebasan finansial",
        "modules"    : [
            {
                "module_id"  : "M09",
                "level"      : 3,
                "order"      : 9,
                "title"      : "Target Tabungan SMART",
                "description": "Buat target yang spesifik dan bisa dicapai",
                "duration"   : "8 menit",
                "xp_reward"  : 100,
                "topics"     : [
                    "framework SMART untuk target keuangan",
                    "cara hitung berapa yang perlu ditabung per bulan",
                    "prioritisasi multiple goals",
                    "tracking progress tabungan"
                ],
                "quiz_count" : 5,
                "pass_score" : 75,       # level advanced sedikit lebih ketat
                "unlocks"    : "M10"
            },
            {
                "module_id"  : "M10",
                "level"      : 3,
                "order"      : 10,
                "title"      : "Recovery Plan Keuangan",
                "description": "Strategi bangkit saat keuangan lagi kritis",
                "duration"   : "9 menit",
                "xp_reward"  : 100,
                "topics"     : [
                    "tanda-tanda keuangan kritis",
                    "langkah darurat saat uang hampir habis",
                    "cara bertahan sampai akhir bulan",
                    "rencana perbaikan bulan berikutnya"
                ],
                "quiz_count" : 5,
                "pass_score" : 75,
                "unlocks"    : "M11"
            },
            {
                "module_id"  : "M11",
                "level"      : 3,
                "order"      : 11,
                "title"      : "Mindset Keuangan Gen-Z",
                "description": "Ubah cara pandang soal uang dan kekayaan",
                "duration"   : "8 menit",
                "xp_reward"  : 100,
                "topics"     : [
                    "money mindset yang toxic vs healthy",
                    "FOMO dan pengaruhnya ke keuangan",
                    "lifestyle inflation dan cara menghindarinya",
                    "delayed gratification"
                ],
                "quiz_count" : 5,
                "pass_score" : 75,
                "unlocks"    : "M12"
            },
            {
                "module_id"  : "M12",
                "level"      : 3,
                "order"      : 12,
                "title"      : "Financial Freedom Basics",
                "description": "Fondasi menuju kebebasan finansial ala Gen-Z",
                "duration"   : "10 menit",
                "xp_reward"  : 150,      # modul terakhir = XP terbesar
                "topics"     : [
                    "apa itu financial freedom yang realistis",
                    "perbedaan kaya dan bebas finansial",
                    "langkah pertama menuju financial freedom",
                    "konsistensi adalah kuncinya"
                ],
                "quiz_count" : 5,
                "pass_score" : 75,
                "unlocks"    : None      # modul terakhir
            },
        ]
    }
}


def get_all_modules() -> list:
    """Return semua modul dari semua level."""
    modules = []
    for level_data in CURRICULUM.values():
        modules.extend(level_data["modules"])
    return modules


def get_module_by_id(module_id: str) -> dict | None:
    """Cari modul berdasarkan ID."""
    for module in get_all_modules():
        if module["module_id"] == module_id:
            return module
    return None


def get_modules_by_level(level: int) -> list:
    """Return semua modul dalam satu level."""
    key = f"level_{level}"
    return CURRICULUM.get(key, {}).get("modules", [])