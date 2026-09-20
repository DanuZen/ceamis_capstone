# Panduan Standar Pengembangan Backend FastAPI — CEAMIS 2.0

> **Standar Rekayasa Software:** Modular Feature-First Architecture  
> **Framework:** FastAPI (Python 3.11+) + Pydantic v2 + Uvicorn  
> **Database:** Supabase Cloud (PostgreSQL 15+)  

---

## 1. Prinsip Desain Arsitektur (Feature-First)

Setiap domain bisnis di dalam `backend/app/` diisolasi ke dalam modul mandiri dengan tanggung jawab yang jelas (*Separation of Concerns*):

```text
backend/app/<feature_name>/
├── router.py       # Definisi endpoint HTTP, status code, & dependency injection
├── service.py      # Logika bisnis inti, kalkulasi, & orkestrasi data
├── schemas.py      # Pydantic v2 Request & Response models (validasi ketat)
└── models.py       # Definisi struktur tabel database (SQLAlchemy / Dict mapping)
```

### Aturan Ketergantungan:
1. `router.py` **hanya** bertugas menerima request, memanggil dependency auth, dan mendelegasikan proses ke `service.py`.
2. `service.py` **tidak boleh** berurusan langsung dengan objek HTTP request/response FastAPI. Semua input dan output di tingkat service berupa objek Python / Pydantic schema murni.
3. Seluruh dependensi bersama (koneksi database, autentikasi, logging) diletakkan di `backend/app/core/` atau `backend/app/utils/`.

---

## 2. Standar Autentikasi & Authorization (JWT Guard)

Setiap request dari klien (Flutter atau Web Admin) wajib menyertakan header:
`Authorization: Bearer <SUPABASE_JWT_TOKEN>`

### Implementasi Dependency `get_current_user`:
```python
# app/core/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from app.config import settings

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token claims")
        return {"id": user_id, "email": payload.get("email"), "role": payload.get("role", "user")}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Authentication failed: {str(e)}")
```

---

## 3. Standar Validasi Data (Pydantic v2)

1. Semua skema wajib menggunakan `pydantic.BaseModel` dengan type-hinting eksplisit.
2. Gunakan `Field()` untuk menetapkan validasi rentang nilai dan dokumentasi Swagger:

```python
# app/pre_purchase/schemas.py
from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID

class PrePurchaseCheckRequest(BaseModel):
    category_id: UUID = Field(..., description="ID kategori transaksi yang dipilih")
    planned_amount: float = Field(..., gt=0, description="Nominal rencana belanja dalam Rupiah")
    merchant_name: Optional[str] = Field(None, max_length=100, description="Nama toko/merchant")
    notes: Optional[str] = Field(None, max_length=255, description="Catatan rencana belanja")

    model_config = {
        "json_schema_extra": {
            "example": {
                "category_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
                "planned_amount": 250000,
                "merchant_name": "Uniqlo",
                "notes": "Beli celana kerja"
            }
        }
    }
```

---

## 4. Standar Format Respons API (Response Enveloping)

Semua endpoint menghasilkan struktur respons yang seragam:

### 4.1 Respons Sukses
```python
# app/core/responses.py
from typing import Any, Optional
from pydantic import BaseModel

class ApiResponse(BaseModel):
    success: bool = True
    data: Optional[Any] = None
    message: str = "Sukses"
```

### 4.2 Penanganan Error Terpusat (*Global Exception Handler*)
```python
# app/core/exceptions.py
from fastapi import Request
from fastapi.responses import JSONResponse

class AppException(Exception):
    def __init__(self, message: str, code: str = "BAD_REQUEST", status_code: int = 400):
        self.message = message
        self.code = code
        self.status_code = status_code

async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.code,
                "message": exc.message
            }
        }
    )
```

---

## 5. Komunikasi Database Supabase (Async Pattern)

Akses database menggunakan `httpx.AsyncClient` ke REST PostgREST Supabase atau koneksi langsung SQLAlchemy 2.0 Async:
* Selalu gunakan context manager `async with` untuk mencegah kebocoran koneksi (*connection leak*).
* Gunakan parameter parameterized query untuk mencegah SQL Injection.
* Sertakan timeout (default `5.0` s.d. `10.0` detik) pada setiap panggilan IO eksternal.

---

## 6. Panduan Pengujian & Verifikasi (Testing)

### 6.1 Menjalankan Linter & Format Checker
```bash
# Di dalam folder backend/
ruff check app/
black --check app/
```

### 6.2 Menjalankan Unit Tests (Pytest)
```bash
pytest tests/ -v
```

### 6.3 Pengujian Interaktif via Swagger UI
Setelah menjalankan `uvicorn app.main:app --reload`:
1. Buka `http://localhost:8000/docs`.
2. Klik tombol **Authorize** di pojok kanan atas untuk memasukkan Bearer JWT token pengujian.
3. Uji endpoint secara langsung.
