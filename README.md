# Italy Property Cost Calculator

A web-based calculator that shows the true total cost of purchasing property in Italy, including all taxes, fees, and ongoing costs. Designed for English-speaking foreigners from Canada, USA, UK, and Australia.

## Features

- **Comprehensive Cost Breakdown**: Calculates all one-time purchase costs and ongoing annual costs
- **Live Exchange Rates**: Fetches real-time exchange rates via Frankfurter API
- **Multi-Currency Support**: EUR, USD, CAD, GBP, AUD
- **Prima Casa Benefits**: Automatically applies first-home tax reductions
- **Developer vs Private Sales**: Different tax calculations based on seller type
- **Mortgage Costs**: Includes bank fees and mortgage registration taxes

## Costs Calculated

### One-Time Purchase Costs
- Registration Tax (Imposta di Registro)
- VAT (IVA) when buying from developer
- Mortgage Tax (Imposta Ipotecaria)
- Cadastral Tax (Imposta Catastale)
- Notary Fees
- Agency Commission
- Geometra/Surveyor Fees
- Technical Reports
- Translator (optional)
- Bank/Mortgage Fees
- Currency Conversion Costs

### Ongoing Annual Costs
- IMU (Property Tax)
- TARI (Waste Tax)
- Condominium Fees (if applicable)
- Utilities Estimate

## Installation

1. Clone the repository or download the files

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

Start the server:
```bash
uvicorn app.main:app --reload
```

Open your browser to: http://localhost:8000

## API Endpoints

- `GET /` - Main calculator page
- `POST /api/calculate` - Calculate property costs
- `GET /api/rates` - Get current exchange rates
- `GET /api/tax-rates` - Get Italian tax rate information
- `GET /health` - Health check endpoint

## Project Structure

```
italy-property/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── calculator.py        # Core calculation logic
│   ├── currency.py          # Exchange rate fetching
│   ├── models.py            # Pydantic models
│   └── data/
│       └── rates.py         # Tax rates, fee schedules
├── static/
│   ├── style.css            # Styling
│   └── app.js               # Frontend logic
├── templates/
│   └── index.html           # Main calculator page
├── requirements.txt
└── README.md
```

## Disclaimer

This calculator provides estimates only. Actual costs may vary based on specific circumstances, location, and current regulations. Always consult a qualified notary (notaio) or accountant (commercialista) for accurate figures before purchasing property in Italy.

## License

MIT License
