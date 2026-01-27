"""
Currency exchange rate service using Frankfurter API (free, no API key needed).
"""

import httpx
from typing import Optional
from datetime import datetime, timedelta
from functools import lru_cache
import asyncio


# Cache for exchange rates
_rate_cache: dict = {}
_cache_timestamp: Optional[datetime] = None
CACHE_DURATION = timedelta(minutes=15)


async def fetch_exchange_rates(base: str = "EUR") -> dict[str, float]:
    """
    Fetch current exchange rates from Frankfurter API.

    Args:
        base: Base currency (default EUR)

    Returns:
        Dictionary of currency codes to exchange rates
    """
    global _rate_cache, _cache_timestamp

    # Check cache
    if _cache_timestamp and datetime.now() - _cache_timestamp < CACHE_DURATION:
        if base in _rate_cache:
            return _rate_cache[base]

    url = f"https://api.frankfurter.app/latest?from={base}&to=USD,CAD,GBP,AUD"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()

            rates = data.get("rates", {})
            # Add the base currency with rate 1.0
            rates[base] = 1.0

            # Update cache
            _rate_cache[base] = rates
            _cache_timestamp = datetime.now()

            return rates

    except httpx.HTTPError as e:
        # If API fails, return fallback rates (approximate)
        print(f"Exchange rate API error: {e}. Using fallback rates.")
        return get_fallback_rates(base)


def get_fallback_rates(base: str = "EUR") -> dict[str, float]:
    """
    Return approximate fallback exchange rates if API is unavailable.
    These are rough estimates and should be updated periodically.
    """
    # Approximate rates as of early 2026 (EUR as base)
    eur_rates = {
        "EUR": 1.0,
        "USD": 1.08,
        "CAD": 1.47,
        "GBP": 0.85,
        "AUD": 1.65,
    }

    if base == "EUR":
        return eur_rates

    # Convert to different base if needed
    if base not in eur_rates:
        return eur_rates

    base_to_eur = 1 / eur_rates[base]
    return {curr: rate * base_to_eur for curr, rate in eur_rates.items()}


def convert_currency(
    amount: float,
    from_currency: str,
    to_currency: str,
    rates: dict[str, float]
) -> float:
    """
    Convert amount from one currency to another.

    Args:
        amount: Amount to convert
        from_currency: Source currency code
        to_currency: Target currency code
        rates: Dictionary of exchange rates (with EUR as base)

    Returns:
        Converted amount
    """
    if from_currency == to_currency:
        return amount

    # Rates are EUR-based
    if from_currency == "EUR":
        return amount * rates.get(to_currency, 1.0)
    elif to_currency == "EUR":
        return amount / rates.get(from_currency, 1.0)
    else:
        # Convert via EUR
        eur_amount = amount / rates.get(from_currency, 1.0)
        return eur_amount * rates.get(to_currency, 1.0)


async def get_rate_info() -> dict:
    """
    Get exchange rate information for display.

    Returns:
        Dictionary with rates and metadata
    """
    rates = await fetch_exchange_rates("EUR")

    return {
        "base": "EUR",
        "rates": rates,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "cached": _cache_timestamp is not None,
    }
