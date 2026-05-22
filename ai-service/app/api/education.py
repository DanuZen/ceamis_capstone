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
# ENDPOINT 4 — Weekly Insight (Diselaraskan dengan POST & Skema Pydantic Anda)
# ════════════════════════════════════════════════
@router.post("/education/insight/weekly", response_model=InsightResponse)
async def get_weekly_insight(request: InsightRequest):
    """
    Menghasilkan weekly insight umum tentang literasi keuangan anak muda.
    Endpoint ini menggunakan POST untuk menyesuaikan dengan parameter input InsightRequest.
    """
    import datetime
    week_num = datetime.date.today().isocalendar()[1]
    year     = datetime.date.today().year

    system_prompt = """
Kamu adalah financial educator Gen-Z Indonesia.
Buat weekly insight keuangan yang relevan, fresh, dan actionable.

PENTING ATURAN FORMAT JSON (PATUHI SECARA MUTLAK):
1. Balas HANYA dengan JSON valid, tanpa tambahan teks basa-basi lainnya di luar blok JSON.
2. DILARANG keras menggunakan tanda kutip ganda (") di dalam teks nilai string JSON. Jika ada istilah, slang, atau kutipan kata, gunakan tanda kutip tunggal (') saja.
   CONTOH SALAH: "Jangan "FOMO" ya"
   CONTOH BENAR: "Jangan 'FOMO' ya"
3. Jangan gunakan enter asli (pindah baris) di dalam nilai string JSON. Gunakan literal '\\n' jika diperlukan untuk membuat paragraf baru.
""".strip()

    # Memanfaatkan payload konteks finansial pengguna jika dikirimkan oleh frontend
    context_text = ""
    if request.financial_context:
        context_text = f"\nKonteks kondisi keuangan terkini user: {json.dumps(request.financial_context)}"

    user_prompt = f"""
Buat weekly financial insight untuk minggu ke-{week_num} tahun {year}.
Tema harus sangat relevan dengan kondisi keuangan riil anak muda di Indonesia saat ini (mahasiswa, pekerja muda, anak kos).{context_text}

Balas dengan format JSON persis seperti berikut (samakan persis penulisan key-nya):
{{
  "weekly_insight": "tulis 2-3 kalimat santai berisi saran keuangan utama untuk minggu ini",
  "highlight"     : "satu fakta menarik atau poin paling krusial terkait kondisi keuangan anak muda",
  "challenge"     : "tantangan berhemat atau menabung seru yang bisa dicoba minggu ini",
  "motivation"    : "kalimat motivasi keuangan yang ngena dan relevan untuk Gen-Z"
}}
"""

    messages = [{"role": "user", "content": user_prompt}]

    try:
        raw  = await call_llm(system_prompt, messages)
        cleaned_json = extract_json_robust(raw)
        data = json.loads(cleaned_json)
        
        # Mapping data hasil LLM ke struktur skema InsightResponse Anda
        return InsightResponse(
            user_id        = request.user_id,
            weekly_insight = data.get("weekly_insight", ""),
            highlight      = data.get("highlight", ""),
            challenge      = data.get("challenge", ""),
            motivation     = data.get("motivation", ""),
            is_mock        = False
        )

    except (json.JSONDecodeError, KeyError) as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Gagal generate weekly insight karena masalah format parser: {str(e)}"
        )
    
# ==========================================================
# HELPER — Ekstraksi JSON Aman (Sangat Stabil & Tanpa Bug Regex)
# ==========================================================
def extract_json_robust(raw_text: str) -> str:
    """
    Memotong dan mengambil string JSON saja dari output LLM secara aman.
    Mencari tanda kurung kurawal terluar untuk menghindari kegagalan parser.
    Bebas dari bug interpretasi visual markdown.
    """
    raw_text = raw_text.strip()
    
    start_idx = raw_text.find('{')
    end_idx = raw_text.rfind('}')
    
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        return raw_text[start_idx:end_idx+1]
        
    return raw_text