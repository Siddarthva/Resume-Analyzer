FROM python:3.13-slim

# Environment
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1

# Working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install --no-cache-dir \
        torch torchvision torchaudio \
        --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Download the SBERT model during build
RUN python download_model.py

# Expose FastAPI port
EXPOSE 8000

# Start application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]