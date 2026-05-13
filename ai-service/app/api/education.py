# app/api/education.py
import json
from fastapi import APIRouter, HTTPException
from app.schemas.request_response import (
    ModuleListResponse, ModuleContentRequest, ModuleContentResponse,
    QuizRequest, QuizResponse, QuizQuestion,
    InsightRequest, InsightResponse
)
from app.utils.llm_client import call_llm
from app.utils.curriculum import (
    CURRICULUM, get_all_modules,
    get_module_by_id, get_modules_by_level
)

router = APIRouter()


# ════════════════════════════════════════════════
# ENDPOINT 1 — Daftar Semua Modul (Static)
# ════════════════════════════════════════════════
@router.get("/education/modules",
            response_model=ModuleListResponse)
async def get_module_list():
    """
    Return daftar semua modul beserta metadata.
    Static — tidak butuh LLM, tidak butuh data user.
    """
    levels = []
    for level_key, level_data in CURRICULUM.items():
        levels.append({
            "level"      : int(level_key.split("_")[1]),
            "label"      : level_data["label"],
            "description": level_data["description"],
            "modules"    : level_data["modules"]
        })

    return ModuleListResponse(
        total_modules=len(get_all_modules()),
        levels=levels
    )


# ════════════════════════════════════════════════
# ENDPOINT 2 — Konten Modul (LLM Generated)
# ════════════════════════════════════════════════
@router.post("/education/modules/{module_id}/content",
             response_model=ModuleContentResponse)
async def get_module_content(
    module_id: str,
    request: ModuleContentRequest
):
    """
    Generate konten modul via LLM.
    Konten di-generate berdasarkan topik modul,
    bukan kondisi user — sama untuk semua user.
    """
    module = get_module_by_id(module_id)
    if not module:
        raise HTTPException(
            status_code=404,
            detail=f"Modul {module_id} tidak ditemukan"
        )

    level_label = {1: "Beginner", 2: "Intermediate", 3: "Advanced"}
    level_text  = level_label.get(module["level"], "Beginner")
    topics_text = "\n".join(
        [f"- {t}" for t in module["topics"]]
    )

    system_prompt = """
Kamu adalah konten kreator edukasi keuangan untuk Gen-Z Indonesia.
Buat konten modul pembelajaran yang informatif, relatable, dan mudah dipahami.

Gaya penulisan:
- Bahasa santai Gen-Z Indonesia, pakai "kamu"
- Gunakan analogi kehidupan sehari-hari (kos, kuliah, kerja, dll)
- Setiap poin harus konkret dan actionable
- Hindari jargon keuangan tanpa penjelasan

PENTING: Balas HANYA dengan JSON valid, tanpa teks lain apapun.
""".strip()

    user_prompt = f"""
Buat konten modul edukasi keuangan:

Judul Modul : {module["title"]}
Level       : {level_text}
Deskripsi   : {module["description"]}
Durasi baca : {module["duration"]}

Topik yang harus dicakup:
{topics_text}

Balas dengan JSON persis seperti ini:
{{
  "sections": [
    {{
      "section_title": "judul bagian",
      "content"      : "penjelasan 2-3 paragraf untuk bagian ini",
      "key_point"    : "1 poin paling penting dari bagian ini"
    }}
  ],
  "summary"     : "ringkasan seluruh modul dalam 2 kalimat",
  "action_items": [
    "aksi konkret 1 yang bisa dilakukan sekarang",
    "aksi konkret 2 yang bisa dilakukan minggu ini",
    "aksi konkret 3 yang bisa dilakukan bulan ini"
  ],
  "fun_fact": "1 fakta menarik terkait topik ini"
}}

Pastikan ada {len(module["topics"])} sections,
masing-masing mencakup satu topik dari list di atas.
"""

    messages = [{"role": "user", "content": user_prompt}]

    try:
        raw = await call_llm(system_prompt, messages)
        raw = raw.strip()

        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        data = json.loads(raw)

        return ModuleContentResponse(
            module_id   = module_id,
            title       = module["title"],
            level       = module["level"],
            level_label = level_text,
            duration    = module["duration"],
            xp_reward   = module["xp_reward"],
            sections    = data.get("sections", []),
            summary     = data.get("summary", ""),
            action_items= data.get("action_items", []),
            fun_fact    = data.get("fun_fact", ""),
            quiz_count  = module["quiz_count"],
            pass_score  = module["pass_score"],
            is_mock     = False
        )

    except (json.JSONDecodeError, KeyError) as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal generate konten: {str(e)}"
        )


# ════════════════════════════════════════════════
# ENDPOINT 3 — Quiz per Modul
# ════════════════════════════════════════════════
@router.post("/education/modules/{module_id}/quiz",
             response_model=QuizResponse)
async def get_module_quiz(
    module_id: str,
    request: QuizRequest
):
    """
    Generate quiz untuk modul tertentu.
    5 soal per modul, sesuai topik modul.
    """
    module = get_module_by_id(module_id)
    if not module:
        raise HTTPException(
            status_code=404,
            detail=f"Modul {module_id} tidak ditemukan"
        )

    topics_text = ", ".join(module["topics"])
    num_q       = module["quiz_count"]   # selalu 5

    system_prompt = """
Kamu adalah pembuat soal kuis edukasi keuangan Gen-Z Indonesia.
Buat soal yang menguji pemahaman praktis, bukan hafalan teori.

PENTING: Balas HANYA dengan JSON valid, tanpa teks lain apapun.
""".strip()

    user_prompt = f"""
Buat {num_q} soal kuis untuk modul: "{module["title"]}"

Topik yang dicakup: {topics_text}
Level: {"Beginner" if module["level"] == 1 else "Intermediate" if module["level"] == 2 else "Advanced"}

Ketentuan soal:
- Soal harus berkaitan langsung dengan topik modul
- Gunakan skenario kehidupan nyata Gen-Z (kos, kerja pertama, dll)
- Semua pilihan jawaban harus masuk akal (tidak ada yang terlalu obvious)
- Explanation harus menjelaskan KENAPA jawaban itu benar
  dan mengapa yang lain salah

Balas dengan JSON persis seperti ini:
{{
  "questions": [
    {{
      "question_id": 1,
      "question"   : "teks pertanyaan dalam konteks kehidupan nyata",
      "options"    : [
        "A. pilihan pertama",
        "B. pilihan kedua",
        "C. pilihan ketiga",
        "D. pilihan keempat"
      ],
      "correct_idx": 0,
      "explanation": "penjelasan singkat kenapa ini benar, bahasa santai"
    }}
  ]
}}

Buat tepat {num_q} soal.
correct_idx adalah 0 untuk A, 1 untuk B, 2 untuk C, 3 untuk D.
"""

    messages = [{"role": "user", "content": user_prompt}]

    try:
        raw = await call_llm(system_prompt, messages)
        raw = raw.strip()

        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        data      = json.loads(raw)
        questions = [
            QuizQuestion(**q)
            for q in data.get("questions", [])
        ]

        return QuizResponse(
            module_id  = module_id,
            title      = module["title"],
            pass_score = module["pass_score"],
            xp_reward  = module["xp_reward"],
            questions  = questions,
            is_mock    = False
        )

    except (json.JSONDecodeError, KeyError) as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal generate quiz: {str(e)}"
        )


# ════════════════════════════════════════════════
# ENDPOINT 4 — Weekly Insight (tetap ada, opsional)
# Insight umum, tidak personal — cocok untuk semua user
# ════════════════════════════════════════════════
@router.get("/education/insight/weekly")
async def get_weekly_insight():
    """
    Generate weekly insight umum tentang literasi keuangan.
    Tidak bergantung data user — sama untuk semua.
    Bisa di-cache / di-refresh tiap minggu.
    """
    import datetime
    week_num = datetime.date.today().isocalendar()[1]
    year     = datetime.date.today().year

    system_prompt = """
Kamu adalah financial educator Gen-Z Indonesia.
Buat weekly insight keuangan yang relevan, fresh, dan actionable.
PENTING: Balas HANYA dengan JSON valid.
""".strip()

    user_prompt = f"""
Buat weekly financial insight untuk minggu ke-{week_num} tahun {year}.

Tema harus relevan dengan kondisi keuangan Gen-Z Indonesia saat ini.
Hindari topik yang sama dengan minggu-minggu umum.

Balas dengan JSON:
{{
  "week"         : {week_num},
  "theme"        : "tema minggu ini",
  "insight"      : "insight utama, 2-3 kalimat",
  "did_you_know" : "fakta menarik seputar keuangan yang jarang diketahui",
  "weekly_challenge": "tantangan keuangan minggu ini yang bisa dicoba semua orang",
  "quote"        : "quote motivasi keuangan yang relate untuk Gen-Z"
}}
"""

    messages = [{"role": "user", "content": user_prompt}]

    try:
        raw  = await call_llm(system_prompt, messages)
        raw  = raw.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        return json.loads(raw.strip())

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))