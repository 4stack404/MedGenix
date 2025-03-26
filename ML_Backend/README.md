# Prescription Analyzer API

A comprehensive system for extracting medication information from prescription images and recommending generic alternatives. This project uses advanced OCR (Optical Character Recognition) and LLM (Large Language Model) technologies to convert prescriptions into structured data and provide cost-effective medication options.

## Features

### Prescription Processing
- **Prescription OCR**: Extract text from prescription images using multiple OCR methods
- **Medication Extraction**: Identify medications, dosages, frequency, and duration instructions
- **Fallback Mechanisms**: Multi-layered OCR approach with automatic fallbacks
- **RESTful API**: Simple HTTP interface for easy integration

### Generic Medication Recommendations
- **Generic Alternative Finder**: Identifies lower-cost generic equivalents for prescribed medications
- **Hybrid Approach**: Combines structured medication databases with LLM capabilities
- **Intelligent Caching**: Speeds up repeated queries and reduces API costs
- **Comprehensive Information**: Provides dosage equivalence, price comparisons, and clinical differences

## Technology Stack

- **FastAPI**: High-performance web framework for building APIs
- **Llama Vision Models**: Primary OCR method using LLM vision capabilities
- **OpenAI GPT-4 Vision**: Secondary OCR fallback
- **EasyOCR**: Tertiary OCR fallback for basic text extraction
- **Groq**: LLM provider for medication extraction and analysis
- **RxNorm API**: Primary source for medication and generic alternative data
- **Docker**: Containerization for easy deployment

## Getting Started

### Prerequisites

- Python 3.9+
- Docker (optional)

### Environment Variables

Create a `.env` file with the following API keys and settings:

```
TOGETHER_API_KEY=your_together_api_key
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
LLAMA_MODEL=meta-llama/Llama-3-70b-vision-instruct
OCR_METHOD=llama
FALLBACK_ENABLED=true
PORT=8000
```

### Installation

#### Using Docker

```bash
docker build -t prescription-analyzer .
docker run -p 8000:8000 --env-file .env prescription-analyzer
```

#### Manual Setup

```bash
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## API Usage

### Process a Prescription

```bash
curl -X POST "http://localhost:8000/api/process-prescription/" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@prescription.jpg"
```

#### Response Format

```json
{
  "original_text": "Extracted text from the prescription",
  "medicines": [
    {
      "brand_name": "Medicine Name",
      "dosage": "10mg",
      "frequency": "twice daily",
      "duration": "7 days"
    }
  ]
}
```

### Get Generic Alternatives

```bash
curl -X POST "http://localhost:8000/api/generic-alternatives/" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "brand_name": "Lipitor",
      "dosage": "20mg",
      "frequency": "once daily",
      "duration": "30 days"
    }
  ]'
```

#### Response Format

```json
[
  {
    "brand_name": "Lipitor",
    "brand_details": {
      "brand_name": "Lipitor",
      "generic_name": null,
      "dosage": "20mg",
      "frequency": "once daily",
      "duration": "30 days"
    },
    "generic_alternatives": [
      {
        "generic_name": "Atorvastatin",
        "equivalent_dosage": "20mg",
        "price_comparison": "80-85% cheaper than brand name",
        "differences": "Bioequivalent to brand name with same efficacy"
      }
    ],
    "source": "rxnorm"
  }
]
```

## Project Structure

- `/app`: Main application code
  - `/ocr`: OCR implementation with preprocessing and fallbacks
  - `/analysis`: Medication extraction using LLMs
  - `/services`: Business logic services
    - `/generic_alternatives.py`: Hybrid system for finding generic medications
  - `/api`: API endpoints and routers
  - `/models`: Data models and schemas

## How It Works

### Prescription OCR Process
1. Image is uploaded via the API
2. Primary OCR method (Llama Vision) attempts to extract text
3. If primary extraction fails to meet quality thresholds, system falls back to secondary methods
4. Extracted text is processed to identify medications and instructions

### Generic Alternative Process
1. Medication information is submitted via API
2. System checks internal cache for previously requested medications
3. If not cached, queries RxNorm API for medication information and generic alternatives
4. If medication not found in RxNorm, falls back to LLM-based generation
5. Results are formatted consistently and returned to the user

## Deployment

This application is designed to be deployed on platforms like Railway with the following commands:

**Build Command:**
```
pip install -r requirements.txt
```

**Start Command:**
```
bash start.sh
```

Make sure to set all required environment variables in the Railway dashboard.

## License

[MIT License](LICENSE)