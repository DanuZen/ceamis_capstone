# app/api/chatbot.py
from fastapi import APIRouter, HTTPException
from app.schemas.request_response import ChatRequest, ChatResponse
from app.utils.prompt_builder import build_system_prompt
from app.utils.llm_client import call_llm
from app.utils.safety_filter import (
    check_message,
    SENSITIVE_DISCLAIMER
)
from app.utils.supabase_client import fetch_user_context

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    CAMI — AI Financial Chatbot CEAMIS.
    Powered by Gemini 2.5 Flash (primary) + Groq Llama 3 (fallback).

    Fase 2: Auto-fetch data keuangan dari Supabase berdasarkan user_id.
    Data Supabase di-merge dengan financial_context dari frontend (Supabase menang).
    """

    # ── Validasi request ──────────────────────────────────
    if not request.messages:
        raise HTTPException(
            status_code=400,
            detail="Messages tidak boleh kosong"
        )

    last_message = request.messages[-1].content

    if not last_message.strip():
        raise HTTPException(
            status_code=400,
            detail="Pesan tidak boleh kosong"
        )

    # ── Safety check ──────────────────────────────────────
    safety = check_message(last_message)

    if safety["status"] == "crisis":
        return ChatResponse(
            reply    =safety["response"],
            is_mock  =False,
            triggered="crisis_filter"
        )

    if safety["status"] == "off_topic":
        return ChatResponse(
            reply    =safety["response"],
            is_mock  =False,
            triggered="off_topic_filter"
        )

    # ── Fase 2: Fetch data real dari Supabase ─────────────
    # Mulai dengan financial_context dari frontend (fallback)
    ctx: dict = dict(request.financial_context or {})

    # Fetch data dari Supabase berdasarkan user_id
    db_ctx = await fetch_user_context(request.user_id)

    if db_ctx:
        # Merge: data Supabase menang atas data frontend
        # (karena Supabase lebih akurat dan real-time)
        ctx.update(db_ctx)
        print(f"[CAMI] ✅ Supabase context loaded untuk user: {request.user_id[:8]}...")
    else:
        # Fallback: pakai financial_context dari frontend
        # (guest, atau Supabase tidak tersedia)
        print(f"[CAMI] ⚠️  Menggunakan fallback context untuk user: {request.user_id}")

    # ── Bangun system prompt ───────────────────────────────
    system_prompt = build_system_prompt(ctx)

    # Jika topik sensitif, tambahkan disclaimer ke system prompt
    if safety["status"] == "sensitive":
        topic = safety.get("topic", "topik ini")
        disclaimer = SENSITIVE_DISCLAIMER.format(topic=topic)
        system_prompt += f"\n\n## DISCLAIMER KHUSUS\n{disclaimer}"

    # ── Format messages history ────────────────────────────
    messages = [
        {"role": m.role, "content": m.content}
        for m in request.messages
    ]

    # ── Panggil LLM ───────────────────────────────────────
    reply = await call_llm(system_prompt, messages)

    return ChatResponse(
        reply    =reply,
        is_mock  =False,
        triggered=safety["status"]
    )