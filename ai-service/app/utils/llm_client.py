# app/utils/llm_client.py
import os
import google.generativeai as genai
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# ── Setup clients ─────────────────────────────────────────
genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))

MAX_TOKENS   = int(os.getenv("MAX_OUTPUT_TOKENS", 600))
TEMPERATURE  = float(os.getenv("LLM_TEMPERATURE", 0.7))
MAX_HISTORY  = int(os.getenv("MAX_HISTORY_MESSAGES", 10))


async def call_gemini(system_prompt: str, messages: list) -> str:
    """Panggil Gemini 1.5 Flash API."""
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=system_prompt,
        generation_config=genai.GenerationConfig(
            max_output_tokens=MAX_TOKENS,
            temperature=TEMPERATURE,
        )
    )

    # Konversi format ke Gemini
    # Gemini: role "user" & "model" (bukan "assistant")
    history = []
    for msg in messages[:-1]:
        role = "user" if msg["role"] == "user" else "model"
        history.append({
            "role" : role,
            "parts": [msg["content"]]
        })

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