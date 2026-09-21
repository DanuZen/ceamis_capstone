@echo off
title CEAMIS 2.0 - FastAPI Backend Server
color 0b
echo ==============================================
echo  CEAMIS 2.0 - FastAPI Backend Auto-Runner
echo ==============================================
echo.

where python >nul 2>nul
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Python tidak ditemukan!
    echo Silakan install Python 3.11 atau centang "Add python to PATH".
    echo Jalankan di PowerShell: winget install Python.Python.3.11
    pause
    exit /b
)

if not exist venv (
    echo [INFO] Membuat virtual environment venv...
    python -m venv venv
)

echo [INFO] Mengaktifkan virtual environment...
call venv\Scripts\activate.bat

if not exist .env (
    if exist .env.example (
        echo [INFO] Membuat .env dari .env.example...
        copy .env.example .env >nul
    )
)

python -c "import uvicorn" >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Menginstall requirements.txt...
    python -m pip install --upgrade pip
    pip install -r requirements.txt
)

echo.
echo ==============================================
echo  Server FastAPI Aktif di http://localhost:8000
echo  Swagger UI Docs: http://localhost:8000/docs
echo ==============================================
echo.

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause
