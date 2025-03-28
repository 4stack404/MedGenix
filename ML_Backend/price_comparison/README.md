# Medicine Price Comparison API

This API allows you to compare medicine prices across different pharmacy websites including 1mg.com, PharmEasy, TrueMeds, Apollo Pharmacy, and NetMeds.

## Features

- Compare medicine prices across 5 different pharmacy websites
- Direct API calls to pharmacy websites for fast and reliable results
- Asynchronous requests for improved performance
- Clean and consistent response format
- Lightweight deployment with minimal dependencies

## Local Installation

1. Clone the repository
2. Install the required dependencies:
```bash
pip install -r requirements.txt
```

## Deployment Options

### Railway.app Deployment (Recommended)

This project is configured to work with Railway.app:

1. Create a new project on Railway.app:
```bash
# Install Railway CLI (if you haven't already)
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize new project
railway init
```

2. Deploy the project:
```bash
# Push your code
railway up
```

Alternatively, you can connect your GitHub repository to Railway.app for automatic deployments.

Railway.app will:
- Automatically detect and use the Dockerfile
- Set the correct PORT environment variable
- Handle all networking requirements

### Docker Deployment

Alternatively, you can deploy using Docker:

1. Build the Docker image:
```bash
docker build -t medicine-price-api .
```

2. Run the container:
```bash
docker run -p 8000:8000 medicine-price-api
```

### Cloud Deployment

For other cloud deployment options:

1. Use a container service (AWS ECS, Google Cloud Run, Azure Container Instances)
2. For non-containerized deployment, simply install the Python dependencies

## Usage

1. Start the API server:
```bash
python main.py
```

2. The API will be available at `http://localhost:8000`

3. Make a GET request to compare prices:
```
GET /compare/{medicine_name}
```

Example:
```
GET /compare/paracetamol
```

## Response Format

```json
{
    "medicine_name": "paracetamol",
    "prices": [
        {
            "website": "1mg.com",
            "price": 45.0,
            "url": "https://www.1mg.com/search/all?name=paracetamol",
            "availability": true
        },
        // ... other websites
    ],
    "timestamp": "2023-11-15T10:30:00.000Z"
}
```

## How It Works

Instead of scraping HTML content, this API directly communicates with the pharmacy websites' internal APIs to get accurate pricing data. This approach is:

1. Faster - No need to render an entire webpage
2. More reliable - Less dependent on website UI changes
3. Lightweight - No browser or rendering engine required

## Notes

- This API relies on the internal APIs of pharmacy websites, which may change over time
- Prices are in Indian Rupees (₹)
- The first request may take a few seconds as connections are established
- Availability status may not always be accurate

## Troubleshooting

If you're experiencing issues:

1. Check your internet connection
2. Verify the medicine name is spelled correctly
3. Check the API logs for specific error messages
4. Some medicines may not be available on all platforms 