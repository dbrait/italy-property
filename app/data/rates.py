"""
Italian property tax rates and fee schedules.
Updated: January 2026

Note: These rates should be verified periodically as Italian tax law may change.
"""

# Cadastral value multipliers
CADASTRAL_MULTIPLIERS = {
    "prima_casa": 115.5,  # First home multiplier
    "other": 126,         # Second home and other properties
}

# Registration Tax (Imposta di Registro) rates
REGISTRATION_TAX = {
    "prima_casa_private": 0.02,    # 2% of cadastral value
    "second_home_private": 0.09,   # 9% of cadastral value
    "from_developer": 200,         # Fixed €200 when buying from developer
}

# VAT (IVA) rates - only when buying from developer
VAT_RATES = {
    "prima_casa": 0.04,      # 4% of purchase price
    "second_home": 0.10,     # 10% of purchase price
    "luxury": 0.22,          # 22% for luxury properties (A/1, A/8, A/9)
}

# Luxury cadastral categories
LUXURY_CATEGORIES = ["A/1", "A/8", "A/9"]

# Mortgage Tax (Imposta Ipotecaria)
MORTGAGE_TAX = {
    "prima_casa_private": 50,      # Fixed €50
    "second_home_private": 0.02,   # 2% of cadastral value
    "from_developer": 200,         # Fixed €200
}

# Cadastral Tax (Imposta Catastale)
CADASTRAL_TAX = {
    "prima_casa_private": 50,      # Fixed €50
    "second_home_private": 0.01,   # 1% of cadastral value
    "from_developer": 200,         # Fixed €200
}

# Notary fee schedule (approximate, based on property value)
# Format: (max_price, base_fee, percentage_of_excess)
NOTARY_FEE_SCHEDULE = [
    (50000, 1500, 0.025),      # Up to €50k: €1,500 + 2.5%
    (100000, 2250, 0.020),     # €50k-100k: €2,250 + 2%
    (250000, 3250, 0.015),     # €100k-250k: €3,250 + 1.5%
    (500000, 5500, 0.010),     # €250k-500k: €5,500 + 1%
    (1000000, 8000, 0.008),    # €500k-1M: €8,000 + 0.8%
    (float('inf'), 12000, 0.005),  # Over €1M: €12,000 + 0.5%
]

# Agency commission
AGENCY_COMMISSION = {
    "rate": 0.03,           # 3% typical
    "vat_rate": 0.22,       # 22% VAT on commission
}

# Professional fees (estimates)
PROFESSIONAL_FEES = {
    "geometra_min": 500,
    "geometra_max": 1500,
    "geometra_default": 800,
    "technical_reports_min": 300,
    "technical_reports_max": 500,
    "technical_reports_default": 400,
    "translator_min": 200,
    "translator_max": 500,
    "translator_default": 300,
}

# Bank/Mortgage fees
MORTGAGE_FEES = {
    "bank_fee_min": 500,
    "bank_fee_max": 1000,
    "bank_fee_default": 750,
    "registration_tax_prima_casa": 0.0025,  # 0.25%
    "registration_tax_second_home": 0.02,   # 2%
    "valuation_fee_min": 200,
    "valuation_fee_max": 400,
    "valuation_fee_default": 300,
}

# Currency conversion cost estimate
CURRENCY_CONVERSION_SPREAD = {
    "bank_transfer": 0.02,    # ~2% typical bank spread
    "specialist_service": 0.005,  # ~0.5% specialist services
    "default": 0.01,          # 1% estimate
}

# IMU (Property Tax) rates
IMU_RATES = {
    "prima_casa_exempt": True,  # Main residence exempt (except luxury)
    "prima_casa_luxury": 0.005,  # 0.5% for luxury main residence
    "second_home_min": 0.0076,  # 0.76% minimum
    "second_home_max": 0.0106,  # 1.06% maximum
    "second_home_default": 0.0086,  # 0.86% typical
}

# TARI (Waste Tax) estimates per sqm per year
TARI_RATES = {
    "min_per_sqm": 1,
    "max_per_sqm": 3,
    "default_per_sqm": 2,
}

# Utility estimates per sqm per year
UTILITY_ESTIMATES = {
    "electricity_per_sqm": 8,
    "gas_per_sqm": 6,
    "water_per_sqm": 2,
    "total_per_sqm": 16,
}

# Supported currencies
SUPPORTED_CURRENCIES = ["EUR", "USD", "CAD", "GBP", "AUD"]

# Property types
PROPERTY_TYPES = ["residential", "commercial", "agricultural"]

# Seller types
SELLER_TYPES = ["private", "developer"]
