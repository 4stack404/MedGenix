# Medicine Information API

A FastAPI application that scrapes and extracts structured information about medicines from 1mg.com.

## Overview

This API scrapes medicine information from 1mg.com, processes the content using an LLM (Llama 3), and returns structured data about medicines including their uses, side effects, and more.

## Features

- Search for medicines by name
- Extract structured information from unstructured web content
- Get detailed information including:
  - Uses
  - How it works
  - Common side effects
  - Content details (ingredients)
  - Expert advice
  - FAQs

## Prerequisites

- Python 3.8+
- FastAPI
- Firecrawl API key
- Groq API key

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/medicine-info-api.git
   cd medicine-info-api
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the project root with your API keys:
   ```
   FIRECRAWL_API_KEY=your_firecrawl_api_key
   GROQ_API_KEY=your_groq_api_key
   ```

## Running the API

```bash
uvicorn info_scraper:app --reload
```

The API will be available at http://localhost:8000

## API Endpoints

### 1. Welcome Message
- **URL**: `/`
- **Method**: `GET`
- **Description**: Welcome message
- **Response Example**:
  ```json
  {
    "message": "Welcome to medicine_info_scrapper API made by ayyub OP"
  }
  ```

### 2. Help
- **URL**: `/help`
- **Method**: `GET`
- **Description**: Lists all available API endpoints
- **Response**: JSON object with endpoint details

### 3. Medicine Information
- **URL**: `/medicine_info`
- **Method**: `POST`
- **Description**: Gets detailed information about a medicine
- **Request Body**:
  ```json
  {
    "name": "paracetamol",
    "sitemap_url": "https://www.1mg.com/sitemap_generics_1.xml"  // Optional
  }
  ```
- **Response Example**:
  ```json
  {
    "medicine_name": "Paracetamol",
    "uses": [
      "Pain relief",
      "Fever reduction"
    ],
    "how_it_works": "Paracetamol blocks the production of certain chemical messengers that are responsible for pain and fever.",
    "common_side_effects": [
      "Nausea",
      "Stomach pain",
      "Allergic reactions"
    ],
    "content_details": {
      "active_ingredient": "Paracetamol",
      "strength": "500mg"
    },
    "expert_advice": [
      "Take this medication as directed by your doctor",
      "Do not exceed the recommended dose"
    ],
    "faqs": [
      {
        "question": "Can I take paracetamol during pregnancy?",
        "answer": "Consult with your doctor before taking paracetamol during pregnancy."
      }
    ]
  }
  ```

## Error Handling

The API returns appropriate HTTP status codes:

- `404 Not Found`: When the medicine isn't found in the sitemap
- `500 Internal Server Error`: For processing errors

## How It Works

1. The API searches for the medicine in the 1mg.com sitemap
2. It scrapes the medicine page using Firecrawl
3. The content is processed using the Llama 3 language model via Groq
4. Structured information is extracted and returned as JSON

## Development

### Files Structure

- `info_scraper.py`: Main API application
- `.env`: Environment variables (API keys)
- `requirements.txt`: Project dependencies

### Adding to the Project

To extend the project:

1. Add more error handling for edge cases
2. Implement caching to reduce API calls
3. Support more medicine information sources
4. Add rate limiting for production use

## License

MIT

## Author

ayyub OP 