"""
FastAPI application for Italy Property Cost Calculator.
"""

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from pathlib import Path

from app.models import PropertyInput, CalculationResult, ExchangeRates, TaxRatesResponse
from app.calculator import calculate_total
from app.currency import fetch_exchange_rates, get_rate_info
from app.data.rates import (
    REGISTRATION_TAX,
    VAT_RATES,
    MORTGAGE_TAX,
    CADASTRAL_TAX,
    IMU_RATES,
    AGENCY_COMMISSION,
)


# Create FastAPI app
app = FastAPI(
    title="Italy Property Cost Calculator",
    description="Calculate the true total cost of purchasing property in Italy",
    version="1.0.0"
)

# Setup paths
BASE_DIR = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = BASE_DIR / "templates"
STATIC_DIR = BASE_DIR / "static"

# Mount static files
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Setup templates
templates = Jinja2Templates(directory=TEMPLATES_DIR)


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Render the main calculator page."""
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/api/calculate", response_model=CalculationResult)
async def calculate(prop: PropertyInput):
    """
    Calculate all costs for an Italian property purchase.

    Returns itemized breakdown of one-time and ongoing costs.
    """
    # Fetch exchange rates
    rates = await fetch_exchange_rates("EUR")

    # Perform calculation
    result = calculate_total(prop, rates)

    return result


@app.get("/api/rates", response_model=ExchangeRates)
async def get_exchange_rates():
    """
    Get current exchange rates.

    Rates are cached for 15 minutes.
    """
    info = await get_rate_info()
    return ExchangeRates(
        base=info["base"],
        rates=info["rates"],
        date=info["date"]
    )


@app.get("/api/tax-rates", response_model=TaxRatesResponse)
async def get_tax_rates():
    """
    Get current Italian property tax rates.

    Useful for understanding the calculation basis.
    """
    return TaxRatesResponse(
        registration_tax={
            "prima_casa_private": "2% of cadastral value",
            "second_home_private": "9% of cadastral value",
            "from_developer": "€200 fixed",
        },
        vat_rates={
            "prima_casa": "4% of purchase price",
            "second_home": "10% of purchase price",
            "luxury": "22% of purchase price (A/1, A/8, A/9 categories)",
        },
        mortgage_tax={
            "prima_casa_private": "€50 fixed",
            "second_home_private": "2% of cadastral value",
            "from_developer": "€200 fixed",
        },
        cadastral_tax={
            "prima_casa_private": "€50 fixed",
            "second_home_private": "1% of cadastral value",
            "from_developer": "€200 fixed",
        },
        imu_rates={
            "prima_casa": "Exempt (except luxury properties)",
            "second_home": "0.76% - 1.06% of cadastral value (varies by municipality)",
        },
        agency_commission={
            "typical_rate": "3% + 22% VAT (3.66% effective)",
        }
    )


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
