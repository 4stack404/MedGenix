FROM python:3.9-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (Railway will override this with its PORT env var)
EXPOSE 8000

# Command to run on container start
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} 