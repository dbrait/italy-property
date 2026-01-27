"""
Pydantic models for input validation and output structure.
"""

from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, Literal
from enum import Enum


class Currency(str, Enum):
    EUR = "EUR"
    USD = "USD"
    CAD = "CAD"
    GBP = "GBP"
    AUD = "AUD"


class PropertyType(str, Enum):
    RESIDENTIAL = "residential"
    COMMERCIAL = "commercial"
    AGRICULTURAL = "agricultural"


class SellerType(str, Enum):
    PRIVATE = "private"
    DEVELOPER = "developer"


class PropertyInput(BaseModel):
    """Input model for property purchase calculation."""

    # Property details
    purchase_price: float = Field(..., gt=0, description="Purchase price in EUR")
    source_currency: Currency = Field(default=Currency.EUR, description="User's preferred currency")
    property_type: PropertyType = Field(default=PropertyType.RESIDENTIAL)
    cadastral_category: Optional[str] = Field(default=None, description="e.g., A/2, A/3, etc.")
    cadastral_income: Optional[float] = Field(default=None, ge=0, description="Annual cadastral income in EUR")
    seller_type: SellerType = Field(default=SellerType.PRIVATE)
    property_size_sqm: Optional[float] = Field(default=None, ge=0, description="Property size in square meters")

    # Buyer details
    prima_casa: bool = Field(default=False, description="First home (prima casa) eligibility")
    resident_in_italy: bool = Field(default=False, description="Is buyer resident in Italy")
    using_mortgage: bool = Field(default=False)
    mortgage_amount: Optional[float] = Field(default=None, ge=0)

    # Optional
    renovation_budget: Optional[float] = Field(default=None, ge=0)
    include_agency_fee: bool = Field(default=True)
    agency_rate: Optional[float] = Field(default=None, ge=0, le=0.10, description="Agency commission rate (e.g., 0.03 for 3%)")
    include_geometra: bool = Field(default=True)
    include_translator: bool = Field(default=False)
    is_apartment: bool = Field(default=False)
    monthly_condo_fee: Optional[float] = Field(default=None, ge=0)


class CostItem(BaseModel):
    """Individual cost line item."""
    name: str
    amount_eur: float
    amount_foreign: Optional[float] = None
    description: Optional[str] = None
    is_estimate: bool = False


class CostCategory(BaseModel):
    """Category of costs with subtotal."""
    name: str
    items: list[CostItem]
    subtotal_eur: float
    subtotal_foreign: Optional[float] = None


class CalculationResult(BaseModel):
    """Complete calculation result."""

    # Property summary
    purchase_price_eur: float
    purchase_price_foreign: Optional[float] = None
    source_currency: str
    exchange_rate: Optional[float] = None
    property_type: str
    is_prima_casa: bool
    seller_type: str

    # Cadastral info
    cadastral_value: Optional[float] = None

    # Cost categories
    one_time_costs: CostCategory
    ongoing_annual_costs: CostCategory

    # Totals
    total_one_time_eur: float
    total_one_time_foreign: Optional[float] = None
    total_annual_eur: float
    total_annual_foreign: Optional[float] = None

    # Grand total first year
    grand_total_first_year_eur: float
    grand_total_first_year_foreign: Optional[float] = None

    # Percentage of purchase price
    one_time_percentage: float

    # Notes and disclaimers
    notes: list[str] = []


class ExchangeRates(BaseModel):
    """Exchange rates response."""
    base: str = "EUR"
    rates: dict[str, float]
    date: str


class TaxRatesResponse(BaseModel):
    """Current Italian tax rates response."""
    registration_tax: dict
    vat_rates: dict
    mortgage_tax: dict
    cadastral_tax: dict
    imu_rates: dict
    agency_commission: dict


# =============================================================================
# Property Listing Translator Models
# =============================================================================


class TranslateRequest(BaseModel):
    """Request to translate a property listing URL."""
    url: str = Field(..., description="URL of the property listing to translate")


class PropertyListing(BaseModel):
    """Translated property listing data."""
    title: Optional[str] = None
    price: Optional[float] = None
    currency: str = "EUR"
    size_sqm: Optional[float] = None
    rooms: Optional[int] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    location: Optional[str] = None
    property_type: Optional[str] = None
    description: Optional[str] = None
    features: list[str] = []
    images: list[str] = []
    energy_class: Optional[str] = None
    floor: Optional[str] = None
    condition: Optional[str] = None


class OriginalText(BaseModel):
    """Original Italian text before translation."""
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    property_type: Optional[str] = None
    features: list[str] = []


class TranslateResponse(BaseModel):
    """Response containing translated listing data."""
    success: bool
    source: str
    original_url: str
    listing: PropertyListing
    original_text: OriginalText
    translation_available: bool = True


class TranslateErrorResponse(BaseModel):
    """Error response for translation failures."""
    success: bool = False
    error: str
    error_type: str  # invalid_url, unsupported_site, fetch_error, parse_error


class SupportedSite(BaseModel):
    """Information about a supported property site."""
    name: str
    domain: str
    description: str
    example_url: str


class SupportedSitesResponse(BaseModel):
    """Response listing all supported property sites."""
    sites: list[SupportedSite]


# =============================================================================
# Regional Dashboard Models
# =============================================================================


class RegionMarket(BaseModel):
    """Market data for a region."""
    avg_price_sqm: int
    price_trend_yoy: float
    avg_days_on_market: int
    listings_count: int


class RegionClimate(BaseModel):
    """Climate data for a region."""
    climate_type: str
    avg_summer_temp_c: int
    avg_winter_temp_c: int
    annual_rainfall_mm: int
    sunshine_hours_year: int


class RegionLifestyle(BaseModel):
    """Lifestyle and expat-relevant data for a region."""
    expat_community_size: str
    healthcare_rating: float
    english_proficiency: str
    international_schools: int
    cost_of_living_index: int


class Region(BaseModel):
    """Full region data model."""
    id: str
    name_en: str
    name_it: str
    capital: str
    capital_it: str
    market: RegionMarket
    climate: RegionClimate
    lifestyle: RegionLifestyle
    description: str
    highlights: list[str]
    popular_areas: list[str]
    considerations: list[str]


class RegionSummary(BaseModel):
    """Summary data for region list/cards."""
    id: str
    name_en: str
    name_it: str
    capital: str
    avg_price_sqm: int
    price_trend_yoy: float
    expat_community_size: str
    climate_type: str


class RegionRanking(BaseModel):
    """Region ranking entry."""
    id: str
    name_en: str
    avg_price_sqm: Optional[int] = None
    price_trend_yoy: Optional[float] = None


class MarketSummary(BaseModel):
    """National market overview."""
    national_avg_price_sqm: float
    national_avg_trend_yoy: float
    total_regions: int
    cheapest_regions: list[RegionRanking]
    most_expensive_regions: list[RegionRanking]
    fastest_growing_regions: list[RegionRanking]


class RegionCompareResponse(BaseModel):
    """Response for region comparison endpoint."""
    regions: list[Region]
