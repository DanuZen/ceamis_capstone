# app/utils/llm_client.py
import os
from google import genai
from google.genai import types
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# ── Setup clients ─────────────────────────────────────────
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY", ""))
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))

# PERBAIKAN: Default token dinaikkan dari 600 menjadi 4096 agar JSON tidak terpotong di tengah jalan
MAX_TOKENS   = int(os.getenv("MAX_OUTPUT_TOKENS", 4096))
TEMPERATURE  = float(os.getenv("LLM_TEMPERATURE", 0.7))
MAX_HISTORY  = int(os.getenv("MAX_HISTORY_MESSAGES", 10))


async def call_gemini(system_prompt: str, messages: list) -> str:
    """Panggil Gemini 2.5 Flash API via google.genai SDK."""

    # Build contents list from message history
    contents = []

    # Inject system prompt as the first user turn
    if system_prompt:
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part(text=f"CONTEXT & SYSTEM INSTRUCTION:\n{system_prompt}\n\nHarap patuhi instruksi di atas secara mutlak untuk seluruh percakapan kita ke depan.")]
            )
        )
        contents.append(
            types.Content(
                role="model",
                parts=[types.Part(text="Baik, saya mengerti instruksi sistem tersebut. Saya akan merespon dengan gaya Gen-Z dan mengembalikan format JSON sesuai ketentuan.")]
            )
        )

    # Append the rest of the conversation history
    for msg in messages:
        role = "user" if msg["role"] == "user" else "model"
        contents.append(
            types.Content(
                role=role,
                parts=[types.Part(text=msg["content"])]
            )
        )

    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents,
        config=types.GenerateContentConfig(
            max_output_tokens=MAX_TOKENS,
            temperature=TEMPERATURE,
        ),
    )

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