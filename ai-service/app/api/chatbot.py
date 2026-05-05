from fastapi import APIRouter
from app.schemas.request_response import ChatRequest, ChatResponse

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    [MOCK] AI Financial Chatbot.
    Akan diintegrasikan dengan Anthropic/OpenAI API setelah setup.
    """

    last_message = request.messages[-1].content.lower() if request.messages else ""

    # Respons dummy berdasarkan keyword
    if "hemat" in last_message:
        reply = "[MOCK] Tips hemat: coba metode 50/30/20 — 50% needs, 30% wants, 20% saving!"
    elif "investasi" in last_message:
        reply = "[MOCK] Untuk pemula, reksa dana pasar uang adalah pilihan yang aman dan likuid."
    elif "hutang" in last_message:
        reply = "[MOCK] Prioritaskan lunasi hutang dengan bunga tertinggi dulu (metode avalanche)."
    else:
        reply = "[MOCK] Halo! Saya CEAMIS AI Assistant. Ada yang bisa saya bantu soal keuanganmu?"

    return ChatResponse(reply=reply, is_mock=True)