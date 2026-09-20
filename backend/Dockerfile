# 1. Gunakan base image Python 3.11 slim
FROM python:3.11-slim

# 2. Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV MPLBACKEND=Agg

# 3. UBAH KE /code AGAR TIDAK TABRAKAN DENGAN FOLDER APP KAMU
WORKDIR /code

# 4. Copy file requirements ke folder /code
COPY requirements.txt /code/

# 5. Install dependensi Python
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir --default-timeout=1000 -r requirements.txt

# 6. Copy seluruh kode proyek ke folder /code
COPY . /code/

# 7. Expose port API
EXPOSE 8000

# 8. Jalankan Uvicorn dari folder /code
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]