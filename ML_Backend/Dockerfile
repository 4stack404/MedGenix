FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Create necessary directories
RUN mkdir -p data

# Set environment variables (these should be overridden at runtime)
ENV TOGETHER_API_KEY=""
ENV OPENAI_API_KEY=""
ENV GROQ_API_KEY=""
ENV LLAMA_MODEL="llama3-8b-8192"
ENV OCR_METHOD="llama"
ENV LLAMA_MODEL="meta-llama/Llama-3-70b-vision-instruct"
ENV FALLBACK_ENABLED="true"
ENV PORT=8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "${PORT}"]
