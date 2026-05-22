# app/utils/llm_client.py
import os
import google.generativeai as genai
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# ── Setup clients ─────────────────────────────────────────
genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))

# PERBAIKAN: Default token dinaikkan dari 600 menjadi 4096 agar JSON tidak terpotong di tengah jalan
MAX_TOKENS   = int(os.getenv("MAX_OUTPUT_TOKENS", 4096))
TEMPERATURE  = float(os.getenv("LLM_TEMPERATURE", 0.7))
MAX_HISTORY  = int(os.getenv("MAX_HISTORY_MESSAGES", 10))


async def call_gemini(system_prompt: str, messages: list) -> str:
    """Panggil Gemini 2.5 Flash API lewat rute Stable v1."""
    
    # PERBAIKAN: Hapus system_instruction dari sini agar SDK TIDAK memaksa rute v1beta
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        generation_config=genai.GenerationConfig(
            max_output_tokens=MAX_TOKENS,
            temperature=TEMPERATURE,
        )
    )

    # Inisialisasi history chat
    history = []
    
    # PERBAIKAN: Suntikkan system prompt sebagai pesan pembuka di awal history
    if system_prompt:
        history.append({
            "role": "user",
            "parts": [f"CONTEXT & SYSTEM INSTRUCTION:\n{system_prompt}\n\nHarap patuhi instruksi di atas secara mutlak untuk seluruh percakapan kita ke depan."]
        })
        history.append({
            "role": "model",
            "parts": ["Baik, saya mengerti instruksi sistem tersebut. Saya akan merespon dengan gaya Gen-Z dan mengembalikan format JSON sesuai ketentuan."]
        })

    # Konversi sisa pesan dari frontend/internal ke format Gemini
    for msg in messages[:-1]:
        role = "user" if msg["role"] == "user" else "model"
        history.append({
            "role" : role,
            "parts": [msg["content"]]
        })

    # Mulai sesi chat dengan history yang sudah mengikat system prompt di rute v1
    chat     = model.start_chat(history=history)
    response = chat.send_message(messages[-1]["content"])

    return response.text


async def call_groq(system_prompt: str, messages: list) -> str:
    """Panggil Groq API (Llama 3.1)."""

    # Groq: format mirip OpenAI
    formatted = [{"role": "system", "content": system_prompt}]
    formatted += [
        {"role": m["role"], "content": m["content"]}
        for m in messages
    ]

    response = groq_client.chat.completions.create(
        model      = "llama-3.1-8b-instant",
        messages   = formatted,
        max_tokens = MAX_TOKENS,
        temperature= TEMPERATURE,
    )

    return response.choices[0].message.content


async def call_llm(system_prompt: str, messages: list) -> str:
    """
    Main entry point dengan fallback otomatis.
    Primary: Gemini | Fallback: Groq
    """
    primary = os.getenv("PRIMARY_LLM", "gemini").lower()

    # Batasi history — hemat token
    recent = messages[-MAX_HISTORY:]

    try:
        if primary == "gemini":
            return await call_gemini(system_prompt, recent)
        else:
            return await call_groq(system_prompt, recent)

    except Exception as e:
        print(f"⚠️  Primary LLM ({primary}) gagal: {e}")
        print("    Fallback ke LLM alternatif...")

        try:
            if primary == "gemini":
                return await call_groq(system_prompt, recent)
            else:
                return await call_gemini(system_prompt, recent)

        except Exception as e2:
            print(f"❌ Fallback juga gagal: {e2}")
            return (
                "Waduh, CAMI lagi ada gangguan teknis nih 😅 "
                "Coba tanya lagi dalam beberapa detik ya bestie!"
            )