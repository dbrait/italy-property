"""
FastAPI application for Italy Property Cost Calculator and Listing Translator.
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse
from pathlib import Path
from dataclasses import asdict

from app.models import (
    PropertyInput, CalculationResult, ExchangeRates, TaxRatesResponse,
    TranslateRequest, TranslateResponse, TranslateErrorResponse,
    PropertyListing, OriginalText, SupportedSitesResponse, SupportedSite,
    Region, RegionSummary, MarketSummary, RegionCompareResponse,
    Professional, ProfessionalCategory, ProfessionalSearchResponse,
)
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
from app.extractors import (
    get_extractor, validate_url, get_site_name, SUPPORTED_SITES,
    ExtractionError,
)
from app.translator import get_translator
from app.data.regions import (
    get_all_regions, get_region_by_id, get_regions_by_ids,
    get_region_summaries, get_market_summary,
)
from app.data.professionals import (
    get_all_categories, get_category, get_all_professionals,
    get_professional_by_id, search_professionals, get_regions_with_professionals,
)


# Create FastAPI app
app = FastAPI(
    title="Italy Property Tools",
    description="Cost calculator and listing translator for Italian property purchases",
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


# =============================================================================
# Property Listing Translator Endpoints
# =============================================================================


@app.get("/translate", response_class=HTMLResponse)
async def translator_page(request: Request):
    """Render the property listing translator page."""
    return templates.TemplateResponse("translator.html", {"request": request})


@app.post("/api/translate")
async def translate_listing(request: TranslateRequest):
    """
    Translate a property listing from Italian to English.

    Fetches the listing from the provided URL, extracts property details,
    and translates Italian text to English.
    """
    url = request.url.strip()

    # Validate URL
    is_valid, error_msg = validate_url(url)
    if not is_valid:
        return JSONResponse(
            status_code=400,
            content=TranslateErrorResponse(
                error=error_msg,
                error_type="invalid_url" if "format" in error_msg.lower() else "unsupported_site"
            ).model_dump()
        )

    # Get appropriate extractor
    extractor = get_extractor(url)
    if not extractor:
        return JSONResponse(
            status_code=400,
            content=TranslateErrorResponse(
                error="This site is not yet supported",
                error_type="unsupported_site"
            ).model_dump()
        )

    # Extract listing data
    try:
        listing_data = await extractor.extract(url)
    except ExtractionError as e:
        error_type = "fetch_error" if "fetch" in str(e).lower() else "parse_error"
        return JSONResponse(
            status_code=422,
            content=TranslateErrorResponse(
                error=e.message,
                error_type=error_type
            ).model_dump()
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content=TranslateErrorResponse(
                error="Unable to extract listing details. The page format may have changed.",
                error_type="parse_error"
            ).model_dump()
        )

    # Convert to dict for translation
    listing_dict = asdict(listing_data)

    # Translate
    translator = get_translator()
    translation_available = translator.is_configured

    if translation_available:
        translated_dict, original_dict = await translator.translate_listing(listing_dict)
    else:
        translated_dict = listing_dict
        original_dict = {
            'title': listing_dict.get('title'),
            'description': listing_dict.get('description'),
            'location': listing_dict.get('location'),
            'property_type': listing_dict.get('property_type'),
            'features': listing_dict.get('features', []),
        }

    # Build response
    response = TranslateResponse(
        success=True,
        source=extractor.SITE_NAME,
        original_url=url,
        listing=PropertyListing(**translated_dict),
        original_text=OriginalText(**{
            k: v for k, v in original_dict.items()
            if k in ['title', 'description', 'location', 'property_type', 'features']
        }),
        translation_available=translation_available
    )

    return response


@app.get("/api/supported-sites", response_model=SupportedSitesResponse)
async def get_supported_sites():
    """Get list of supported property listing sites."""
    sites = [SupportedSite(**site) for site in SUPPORTED_SITES]
    return SupportedSitesResponse(sites=sites)


@app.get("/api/test-extract")
async def test_extraction():
    """
    Test endpoint that returns sample extracted data.
    Used to verify the frontend works without live site access.
    """
    sample_listing = PropertyListing(
        title="Bellissimo appartamento nel centro storico di Firenze",
        price=285000,
        currency="EUR",
        size_sqm=75,
        rooms=4,
        bedrooms=2,
        bathrooms=1,
        location="Firenze, Centro Storico, Toscana",
        property_type="Apartment",
        description="Splendido appartamento completamente ristrutturato situato nel cuore del centro storico di Firenze. L'immobile si trova al secondo piano di un elegante palazzo d'epoca con ascensore. Composto da ingresso, ampio soggiorno con zona pranzo, cucina abitabile, due camere da letto matrimoniali e bagno finestrato. Pavimenti in cotto originale, travi a vista e finiture di pregio. Riscaldamento autonomo. Cantina di pertinenza. A pochi passi da Piazza della Signoria e dal Duomo.",
        features=[
            "Ascensore",
            "Riscaldamento autonomo",
            "Aria condizionata",
            "Cantina",
            "Travi a vista",
            "Pavimenti in cotto",
            "Ristrutturato",
        ],
        images=[
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
            "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
        ],
        energy_class="D",
        floor="2nd floor",
        condition="Renovated"
    )

    original_text = OriginalText(
        title="Bellissimo appartamento nel centro storico di Firenze",
        description="Splendido appartamento completamente ristrutturato situato nel cuore del centro storico di Firenze. L'immobile si trova al secondo piano di un elegante palazzo d'epoca con ascensore.",
        location="Firenze, Centro Storico, Toscana",
        property_type="Appartamento",
        features=["Ascensore", "Riscaldamento autonomo", "Aria condizionata"]
    )

    return TranslateResponse(
        success=True,
        source="Test Data",
        original_url="https://www.immobiliare.it/annunci/test/",
        listing=sample_listing,
        original_text=original_text,
        translation_available=False
    )


# =============================================================================
# Regional Dashboard Endpoints
# =============================================================================


@app.get("/regions", response_class=HTMLResponse)
async def regions_dashboard(request: Request):
    """Render the regional dashboard page."""
    return templates.TemplateResponse("regions.html", {"request": request})


@app.get("/regions/compare", response_class=HTMLResponse)
async def regions_compare_page(request: Request):
    """Render the region comparison page."""
    return templates.TemplateResponse("region_compare.html", {"request": request})


@app.get("/regions/{region_id}", response_class=HTMLResponse)
async def region_detail_page(request: Request, region_id: str):
    """Render a single region detail page."""
    region = get_region_by_id(region_id)
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    return templates.TemplateResponse("region_detail.html", {
        "request": request,
        "region_id": region_id
    })


@app.get("/api/regions", response_model=list[RegionSummary])
async def api_list_regions():
    """
    Get summary data for all 20 Italian regions.

    Returns basic info suitable for dashboard cards and map display.
    """
    return get_region_summaries()


@app.get("/api/regions/market-summary", response_model=MarketSummary)
async def api_market_summary():
    """
    Get national market overview with rankings.

    Returns average prices, trends, and top/bottom region rankings.
    """
    return get_market_summary()


@app.get("/api/regions/compare", response_model=RegionCompareResponse)
async def api_compare_regions(regions: str):
    """
    Compare 2-4 regions side by side.

    Pass region IDs as comma-separated string, e.g., ?regions=toscana,umbria,marche
    """
    region_ids = [r.strip() for r in regions.split(",") if r.strip()]

    if len(region_ids) < 2:
        raise HTTPException(status_code=400, detail="Please provide at least 2 regions to compare")
    if len(region_ids) > 4:
        raise HTTPException(status_code=400, detail="Maximum 4 regions can be compared at once")

    region_data = get_regions_by_ids(region_ids)

    if len(region_data) != len(region_ids):
        found_ids = {r["id"] for r in region_data}
        missing = [rid for rid in region_ids if rid.lower() not in found_ids]
        raise HTTPException(status_code=404, detail=f"Regions not found: {', '.join(missing)}")

    return RegionCompareResponse(regions=[Region(**r) for r in region_data])


@app.get("/api/regions/{region_id}", response_model=Region)
async def api_get_region(region_id: str):
    """
    Get full details for a single region.

    Returns complete market, climate, lifestyle data plus description and highlights.
    """
    region = get_region_by_id(region_id)
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    return Region(**region)


# =============================================================================
# Professional Finder Endpoints
# =============================================================================


@app.get("/professionals", response_class=HTMLResponse)
async def professionals_page(request: Request):
    """Render the professional finder page."""
    return templates.TemplateResponse("professionals.html", {"request": request})


@app.get("/professionals/{professional_id}", response_class=HTMLResponse)
async def professional_detail_page(request: Request, professional_id: str):
    """Render a single professional detail page."""
    professional = get_professional_by_id(professional_id)
    if not professional:
        raise HTTPException(status_code=404, detail="Professional not found")
    return templates.TemplateResponse("professional_detail.html", {
        "request": request,
        "professional_id": professional_id
    })


@app.get("/api/professionals/categories", response_model=list[ProfessionalCategory])
async def api_list_categories():
    """
    Get all professional categories with descriptions.

    Returns category info including why each type is needed and typical fees.
    """
    return [ProfessionalCategory(**c) for c in get_all_categories()]


@app.get("/api/professionals/regions")
async def api_professionals_regions():
    """
    Get list of regions that have professionals listed.

    Useful for populating filter dropdowns.
    """
    return {"regions": get_regions_with_professionals()}


@app.get("/api/professionals", response_model=ProfessionalSearchResponse)
async def api_search_professionals(
    category: str = None,
    region: str = None,
    featured: bool = False,
    verified: bool = False,
):
    """
    Search professionals with optional filters.

    Filters:
    - category: Filter by category ID (lawyer, notary, geometra, etc.)
    - region: Filter by region ID (toscana, umbria, etc.)
    - featured: Only show featured professionals
    - verified: Only show verified professionals
    """
    results = search_professionals(
        category=category,
        region=region,
        featured_only=featured,
        verified_only=verified,
    )

    return ProfessionalSearchResponse(
        professionals=[Professional(**p) for p in results],
        total=len(results),
        filters_applied={
            "category": category,
            "region": region,
            "featured": featured,
            "verified": verified,
        }
    )


@app.get("/api/professionals/{professional_id}", response_model=Professional)
async def api_get_professional(professional_id: str):
    """
    Get full details for a single professional.

    Returns complete profile including services, highlights, and contact info.
    """
    professional = get_professional_by_id(professional_id)
    if not professional:
        raise HTTPException(status_code=404, detail="Professional not found")
    return Professional(**professional)
