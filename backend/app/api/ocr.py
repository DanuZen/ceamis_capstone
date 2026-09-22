"""
CEAMIS 2.0 — OCR Receipt Parsing API
Endpoint: POST /api/v1/ocr/parse-receipt
Ekstraksi teks struk belanja menjadi transaksi terstruktur via Gemini 2.0 Flash dengan fallback heuristik.
"""

import os
import re
import json
import logging
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ocr", tags=["OCR Receipt Parsing"])

class ParseReceiptRequest(BaseModel):
    raw_text: str

class ReceiptItem(BaseModel):
    name: str
    qty: int = 1
    price: float = 0.0
    total: float = 0.0

class ParsedReceiptData(BaseModel):
    merchant_name: str
    transaction_date: str
    category: str
    total_amount: float
    payment_method: str
    items: List[ReceiptItem] = []
    auto_tag: str = "needs"
    confidence_score: float = 0.85
    is_mock: bool = False

class ParseReceiptResponse(BaseModel):
    success: bool = True
    data: ParsedReceiptData


def heuristic_parse_receipt(raw_text: str) -> ParsedReceiptData:
    lines = [l.strip() for l in raw_text.split("\n") if l.strip()]
    merchant_name = lines[0] if lines else "Merchant Terdeteksi"

    # Match date DD/MM/YYYY or YYYY-MM-DD
    date_match = re.search(r"\b(\d{2}[/-]\d{2}[/-]\d{4}|\d{4}[/-]\d{2}[/-]\d{2})\b", raw_text)
    transaction_date = datetime.now().strftime("%Y-%m-%d")
    if date_match:
        val = date_match.group(1).replace("/", "-")
        parts = val.split("-")
        if len(parts[0]) == 4:
            transaction_date = f"{parts[0]}-{parts[1].zfill(2)}-{parts[2].zfill(2)}"
        elif len(parts[2]) == 4:
            transaction_date = f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"

    # Match payment method
    lower = raw_text.lower()
    payment_method = "Cash"
    if "qris" in lower:
        payment_method = "QRIS"
    elif "debit" in lower:
        payment_method = "Debit"
    elif "credit" in lower or "kredit" in lower:
        payment_method = "Credit"
    elif any(e in lower for e in ["gopay", "ovo", "shopee", "dana"]):
        payment_method = "E-Wallet"

    # Category & auto_tag
    category = "Groceries"
    auto_tag = "needs"
    if any(k in lower for k in ["kopi", "coffee", "cafe", "resto", "burger", "makan", "bakso"]):
        category = "Food & Beverage"
        auto_tag = "wants"
    elif any(k in lower for k in ["bioskop", "cinema", "game", "tiket"]):
        category = "Entertainment"
        auto_tag = "wants"
    elif any(k in lower for k in ["bensin", "spbu", "pertamina", "ojol", "grab", "gojek"]):
        category = "Transportation"
        auto_tag = "needs"
    elif any(k in lower for k in ["pln", "listrik", "pdam", "wifi", "indihome"]):
        category = "Utilities"
        auto_tag = "needs"
    elif any(k in lower for k in ["apotek", "obat", "klinik", "rs"]):
        category = "Health"
        auto_tag = "needs"
    elif any(k in lower for k in ["baju", "fashion", "sepatu", "mall", "clothing"]):
        category = "Shopping"
        auto_tag = "wants"

    # Total amount
    total_amount = 0.0
    total_matches = list(re.finditer(r"(?:total|grand\s*total|bayar|rp\.?)\s*:?\s*([\d.,]+)", raw_text, re.IGNORECASE))
    if total_matches:
        last_val = total_matches[-1].group(1)
        cleaned = re.sub(r"[.,](\d{2})$", "", last_val)
        cleaned = re.sub(r"[^\d]", "", cleaned)
        total_amount = float(cleaned) if cleaned else 0.0
    else:
        numbers = re.findall(r"\b\d{4,9}\b", raw_text)
        if numbers:
            total_amount = float(max(int(n) for n in numbers))

    # Items extraction
    items: List[ReceiptItem] = []
    for line in lines:
        item_match = re.match(r"^([A-Za-z0-9\s]+?)\s+(?:(\d+)\s*[xX]\s*)?(\d[\d.,]*)$", line)
        if item_match:
            name = item_match.group(1).strip()
            if not any(skip in name.lower() for skip in ["total", "subtotal", "tunai", "kembali", "cash", "qris"]):
                qty = int(item_match.group(2)) if item_match.group(2) else 1
                price_str = re.sub(r"[^\d]", "", item_match.group(3))
                price = float(price_str) if price_str else 0.0
                if price > 0:
                    items.append(ReceiptItem(name=name, qty=qty, price=price, total=price * qty))

    return ParsedReceiptData(
        merchant_name=merchant_name,
        transaction_date=transaction_date,
        category=category,
        total_amount=total_amount,
        payment_method=payment_method,
        items=items,
        auto_tag=auto_tag,
        confidence_score=0.85,
        is_mock=True,
    )


@router.post("/parse-receipt", response_model=ParseReceiptResponse)
async def parse_receipt(req: ParseReceiptRequest):
    raw_text = req.raw_text.strip()
    if not raw_text:
        raise HTTPException(status_code=400, detail="Teks struk kosong")

    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

    if gemini_key:
        try:
            endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
            prompt = f"""
Kamu adalah mesin pengekstrak data dari teks mentah hasil OCR struk belanjaan Indonesia (Indomaret, Alfamart, restoran, SPBU, supermarket, dll).
Kembalikan HANYA JSON valid tanpa format markdown ```json atau karakter lain di luar JSON.

Ketentuan Ekstraksi:
1. merchant_name: Nama toko/merchant (string).
2. transaction_date: Format YYYY-MM-DD. Jika tanggal/tahun tidak ditemukan, gunakan hari ini: {datetime.now().strftime("%Y-%m-%d")}.
3. category: Pilih salah satu dari ["Groceries", "Food & Beverage", "Utilities", "Health", "Transportation", "Shopping", "Entertainment", "Other"].
4. total_amount: Angka bersih total belanja akhir (number/integer tanpa simbol Rp atau titik).
5. payment_method: Pilihan dari ["Cash", "QRIS", "Debit", "Credit", "E-Wallet"] jika ada di struk, default "Cash".
6. items: Array [{{ "name": string, "qty": number, "price": number, "total": number }}].
7. auto_tag: "needs" (kebutuhan pokok) atau "wants" (keinginan).
8. confidence_score: Angka desimal 0.0 s.d 1.0.

Teks Mentah Struk:
\"\"\"
{raw_text}
\"\"\"
"""
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.1,
                    "responseMimeType": "application/json",
                },
            }

            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(
                    endpoint,
                    json=payload,
                    headers={"x-goog-api-key": gemini_key},
                )
                if resp.status_code == 200:
                    data = resp.json()
                    candidate_text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
                    cleaned = re.sub(r"^```json\s*", "", candidate_text, flags=re.IGNORECASE)
                    cleaned = re.sub(r"^```\s*", "", cleaned)
                    cleaned = re.sub(r"```$", "", cleaned).strip()
                    parsed = json.loads(cleaned)

                    items = [
                        ReceiptItem(
                            name=str(it.get("name", "Item")),
                            qty=int(it.get("qty", 1)),
                            price=float(it.get("price", 0)),
                            total=float(it.get("total", it.get("price", 0))),
                        )
                        for it in parsed.get("items", [])
                    ]

                    parsed_data = ParsedReceiptData(
                        merchant_name=str(parsed.get("merchant_name", "Merchant Terdeteksi")),
                        transaction_date=str(parsed.get("transaction_date", datetime.now().strftime("%Y-%m-%d"))),
                        category=str(parsed.get("category", "Other")),
                        total_amount=float(parsed.get("total_amount", 0)),
                        payment_method=str(parsed.get("payment_method", "Cash")),
                        items=items,
                        auto_tag=str(parsed.get("auto_tag", "needs")),
                        confidence_score=float(parsed.get("confidence_score", 0.95)),
                        is_mock=False,
                    )
                    return ParseReceiptResponse(success=True, data=parsed_data)
        except Exception as e:
            logger.warning(
                "Gemini API failed, falling back to heuristic parser",
                exc_info=True,
            )

    # Fallback heuristic
    fallback_data = heuristic_parse_receipt(raw_text)
    return ParseReceiptResponse(success=True, data=fallback_data)
