# CEAMIS 2.0 — FastAPI Backend Auto-Runner
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host " 🚀 CEAMIS 2.0 — Backend FastAPI Auto-Runner" -ForegroundColor Yellow
Write-Host "==============================================" -ForegroundColor Cyan

# 1. Cek Python
$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
    Write-Host "❌ Error: Python tidak ditemukan di sistem Anda." -ForegroundColor Red
    Write-Host "Silakan install Python 3.11 dengan perintah:" -ForegroundColor Yellow
    Write-Host "winget install Python.Python.3.11 --override `"/passive PrependPath=1`"" -ForegroundColor Green
    exit 1
}

# 2. Cek atau Buat venv
if (-not (Test-Path "venv")) {
    Write-Host "📦 Membuat virtual environment (venv)..." -ForegroundColor Yellow
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Gagal membuat venv." -ForegroundColor Red
        exit 1
    }
}

# 3. Aktifkan venv
Write-Host "⚡ Mengaktifkan virtual environment..." -ForegroundColor Green
$envPath = ".\venv\Scripts\Activate.ps1"
if (Test-Path $envPath) {
    & $envPath
} else {
    Write-Host "❌ Skrip aktivasi venv tidak ditemukan." -ForegroundColor Red
    exit 1
}

# 4. Cek .env
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Write-Host "📄 Membuat file .env dari .env.example..." -ForegroundColor Yellow
        Copy-Item .env.example .env
    }
}

# 5. Cek Uvicorn
$uvicornCheck = python -c "import uvicorn" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "📥 Menginstall dependensi dari requirements.txt..." -ForegroundColor Yellow
    python -m pip install --upgrade pip
    pip install -r requirements.txt
}

# 6. Jalankan FastAPI via Uvicorn
Write-Host ""
Write-Host "✨ Server FastAPI siap dijalankan!" -ForegroundColor Green
Write-Host "📖 Swagger UI Docs : http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "🌐 ReDoc API Spec  : http://localhost:8000/redoc" -ForegroundColor Cyan
Write-Host "Tekan CTRL + C untuk menghentikan server." -ForegroundColor Gray
Write-Host ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
