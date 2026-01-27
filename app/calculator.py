"""
Core calculation logic for Italian property purchase costs.
"""

from typing import Optional
from app.models import (
    PropertyInput,
    CalculationResult,
    CostItem,
    CostCategory,
)
from app.data.rates import (
    CADASTRAL_MULTIPLIERS,
    REGISTRATION_TAX,
    VAT_RATES,
    LUXURY_CATEGORIES,
    MORTGAGE_TAX,
    CADASTRAL_TAX,
    NOTARY_FEE_SCHEDULE,
    AGENCY_COMMISSION,
    PROFESSIONAL_FEES,
    MORTGAGE_FEES,
    CURRENCY_CONVERSION_SPREAD,
    IMU_RATES,
    TARI_RATES,
    UTILITY_ESTIMATES,
)
from app.currency import convert_currency


def calculate_cadastral_value(
    cadastral_income: Optional[float],
    prima_casa: bool,
    purchase_price: float
) -> float:
    """
    Calculate cadastral value from cadastral income.
    If cadastral income not provided, estimate from purchase price.
    """
    if cadastral_income:
        multiplier = CADASTRAL_MULTIPLIERS["prima_casa"] if prima_casa else CADASTRAL_MULTIPLIERS["other"]
        return cadastral_income * multiplier

    # Estimate: cadastral value is typically 30-50% of market value
    # Using 40% as a reasonable estimate
    return purchase_price * 0.40


def calculate_notary_fee(purchase_price: float) -> float:
    """Calculate notary fee based on sliding scale."""
    for max_price, base_fee, rate in NOTARY_FEE_SCHEDULE:
        if purchase_price <= max_price:
            # Find the previous threshold
            prev_threshold = 0
            for mp, bf, _ in NOTARY_FEE_SCHEDULE:
                if mp < max_price:
                    prev_threshold = mp
                else:
                    break

            excess = purchase_price - prev_threshold
            return base_fee + (excess * rate)

    # Fallback for very high values
    return 12000 + (purchase_price - 1000000) * 0.005


def is_luxury_property(cadastral_category: Optional[str]) -> bool:
    """Check if property is in a luxury cadastral category."""
    if not cadastral_category:
        return False
    return cadastral_category.upper() in LUXURY_CATEGORIES


def calculate_one_time_costs(
    prop: PropertyInput,
    cadastral_value: float,
    rates: dict[str, float]
) -> tuple[list[CostItem], list[str]]:
    """
    Calculate all one-time purchase costs.

    Returns:
        Tuple of (list of cost items, list of notes)
    """
    items = []
    notes = []
    is_luxury = is_luxury_property(prop.cadastral_category)

    # Registration Tax / VAT
    if prop.seller_type.value == "developer":
        # Fixed registration tax
        items.append(CostItem(
            name="Registration Tax (Imposta di Registro)",
            amount_eur=REGISTRATION_TAX["from_developer"],
            description="Fixed fee when buying from developer"
        ))

        # VAT on purchase price
        if is_luxury:
            vat_rate = VAT_RATES["luxury"]
            vat_desc = "22% VAT on luxury property"
        elif prop.prima_casa:
            vat_rate = VAT_RATES["prima_casa"]
            vat_desc = "4% VAT (prima casa rate)"
        else:
            vat_rate = VAT_RATES["second_home"]
            vat_desc = "10% VAT (second home rate)"

        vat_amount = prop.purchase_price * vat_rate
        items.append(CostItem(
            name="VAT (IVA)",
            amount_eur=vat_amount,
            description=vat_desc
        ))
        notes.append(f"VAT applies because purchasing from developer/company")

        # Fixed mortgage and cadastral tax
        items.append(CostItem(
            name="Mortgage Tax (Imposta Ipotecaria)",
            amount_eur=MORTGAGE_TAX["from_developer"],
            description="Fixed fee when buying from developer"
        ))
        items.append(CostItem(
            name="Cadastral Tax (Imposta Catastale)",
            amount_eur=CADASTRAL_TAX["from_developer"],
            description="Fixed fee when buying from developer"
        ))

    else:  # Private seller
        # Registration tax based on cadastral value
        if prop.prima_casa:
            reg_tax = max(cadastral_value * REGISTRATION_TAX["prima_casa_private"], 1000)
            reg_desc = "2% of cadastral value (prima casa rate, min €1,000)"
        else:
            reg_tax = cadastral_value * REGISTRATION_TAX["second_home_private"]
            reg_desc = "9% of cadastral value (second home rate)"

        items.append(CostItem(
            name="Registration Tax (Imposta di Registro)",
            amount_eur=reg_tax,
            description=reg_desc
        ))
        notes.append(f"Registration tax calculated on cadastral value (€{cadastral_value:,.0f}), not purchase price")

        # Mortgage tax
        if prop.prima_casa:
            items.append(CostItem(
                name="Mortgage Tax (Imposta Ipotecaria)",
                amount_eur=MORTGAGE_TAX["prima_casa_private"],
                description="Fixed €50 for prima casa"
            ))
        else:
            mort_tax = cadastral_value * MORTGAGE_TAX["second_home_private"]
            items.append(CostItem(
                name="Mortgage Tax (Imposta Ipotecaria)",
                amount_eur=mort_tax,
                description="2% of cadastral value"
            ))

        # Cadastral tax
        if prop.prima_casa:
            items.append(CostItem(
                name="Cadastral Tax (Imposta Catastale)",
                amount_eur=CADASTRAL_TAX["prima_casa_private"],
                description="Fixed €50 for prima casa"
            ))
        else:
            cad_tax = cadastral_value * CADASTRAL_TAX["second_home_private"]
            items.append(CostItem(
                name="Cadastral Tax (Imposta Catastale)",
                amount_eur=cad_tax,
                description="1% of cadastral value"
            ))

    # Notary fees
    notary_fee = calculate_notary_fee(prop.purchase_price)
    items.append(CostItem(
        name="Notary Fees",
        amount_eur=notary_fee,
        description="Based on purchase price, includes deed and searches",
        is_estimate=True
    ))

    # Agency commission
    if prop.include_agency_fee:
        agency_rate = prop.agency_rate or AGENCY_COMMISSION["rate"]
        commission_base = prop.purchase_price * agency_rate
        commission_vat = commission_base * AGENCY_COMMISSION["vat_rate"]
        commission_total = commission_base + commission_vat
        items.append(CostItem(
            name="Agency Commission",
            amount_eur=commission_total,
            description=f"{agency_rate*100:.0f}% + 22% VAT = {(agency_rate * 1.22)*100:.2f}% effective",
            is_estimate=True
        ))

    # Geometra/surveyor
    if prop.include_geometra:
        items.append(CostItem(
            name="Geometra (Surveyor)",
            amount_eur=PROFESSIONAL_FEES["geometra_default"],
            description="Technical verification and documentation",
            is_estimate=True
        ))

    # Technical reports
    items.append(CostItem(
        name="Technical Reports",
        amount_eur=PROFESSIONAL_FEES["technical_reports_default"],
        description="Energy certificate, property checks",
        is_estimate=True
    ))

    # Translator
    if prop.include_translator:
        items.append(CostItem(
            name="Translator",
            amount_eur=PROFESSIONAL_FEES["translator_default"],
            description="For deed signing if needed",
            is_estimate=True
        ))

    # Mortgage-related costs
    if prop.using_mortgage:
        mortgage_amount = prop.mortgage_amount or (prop.purchase_price * 0.7)

        items.append(CostItem(
            name="Bank Fees",
            amount_eur=MORTGAGE_FEES["bank_fee_default"],
            description="Mortgage arrangement fee",
            is_estimate=True
        ))

        if prop.prima_casa:
            mort_reg_tax = mortgage_amount * MORTGAGE_FEES["registration_tax_prima_casa"]
            mort_desc = "0.25% of mortgage amount (prima casa rate)"
        else:
            mort_reg_tax = mortgage_amount * MORTGAGE_FEES["registration_tax_second_home"]
            mort_desc = "2% of mortgage amount"

        items.append(CostItem(
            name="Mortgage Registration Tax",
            amount_eur=mort_reg_tax,
            description=mort_desc
        ))

        items.append(CostItem(
            name="Property Valuation",
            amount_eur=MORTGAGE_FEES["valuation_fee_default"],
            description="Bank's property assessment",
            is_estimate=True
        ))

    # Currency conversion cost
    if prop.source_currency.value != "EUR":
        conversion_cost = prop.purchase_price * CURRENCY_CONVERSION_SPREAD["default"]
        items.append(CostItem(
            name="Currency Transfer Cost",
            amount_eur=conversion_cost,
            description=f"~{CURRENCY_CONVERSION_SPREAD['default']*100:.0f}% spread estimate",
            is_estimate=True
        ))
        notes.append("Currency transfer cost varies by provider. Specialist services may offer better rates than banks.")

    # Renovation costs (if any)
    if prop.renovation_budget:
        items.append(CostItem(
            name="Renovation Budget",
            amount_eur=prop.renovation_budget,
            description="User-specified renovation amount"
        ))

    # Convert to foreign currency
    if prop.source_currency.value != "EUR":
        for item in items:
            item.amount_foreign = convert_currency(
                item.amount_eur, "EUR", prop.source_currency.value, rates
            )

    return items, notes


def calculate_annual_costs(
    prop: PropertyInput,
    cadastral_value: float,
    rates: dict[str, float]
) -> tuple[list[CostItem], list[str]]:
    """
    Calculate ongoing annual costs.

    Returns:
        Tuple of (list of cost items, list of notes)
    """
    items = []
    notes = []
    is_luxury = is_luxury_property(prop.cadastral_category)
    property_size = prop.property_size_sqm or 100  # Default 100 sqm if not specified

    # IMU (Property Tax)
    if prop.prima_casa and not is_luxury:
        items.append(CostItem(
            name="IMU (Property Tax)",
            amount_eur=0,
            description="Exempt for prima casa (main residence)"
        ))
        notes.append("Primary residence is exempt from IMU (except luxury categories A/1, A/8, A/9)")
    else:
        if prop.prima_casa and is_luxury:
            imu_rate = IMU_RATES["prima_casa_luxury"]
            imu_desc = "0.5% of cadastral value (luxury main residence)"
        else:
            imu_rate = IMU_RATES["second_home_default"]
            imu_desc = f"~{imu_rate*100:.2f}% of cadastral value (varies by municipality)"

        imu_amount = cadastral_value * imu_rate
        items.append(CostItem(
            name="IMU (Property Tax)",
            amount_eur=imu_amount,
            description=imu_desc,
            is_estimate=True
        ))
        notes.append("IMU rate varies by municipality (0.76% - 1.06%). Using typical rate of 0.86%")

    # TARI (Waste Tax)
    tari_amount = property_size * TARI_RATES["default_per_sqm"]
    items.append(CostItem(
        name="TARI (Waste Tax)",
        amount_eur=tari_amount,
        description=f"~€{TARI_RATES['default_per_sqm']}/sqm/year estimate for {property_size:.0f}sqm",
        is_estimate=True
    ))

    # Condominium fees
    if prop.is_apartment:
        if prop.monthly_condo_fee:
            annual_condo = prop.monthly_condo_fee * 12
            items.append(CostItem(
                name="Condominium Fees",
                amount_eur=annual_condo,
                description=f"€{prop.monthly_condo_fee:.0f}/month × 12"
            ))
        else:
            # Estimate based on size
            monthly_estimate = 100 + (property_size * 0.5)
            annual_condo = monthly_estimate * 12
            items.append(CostItem(
                name="Condominium Fees",
                amount_eur=annual_condo,
                description=f"Estimated ~€{monthly_estimate:.0f}/month",
                is_estimate=True
            ))
            notes.append("Condominium fees vary widely by building and services. Verify with seller.")

    # Utilities estimate
    utilities = property_size * UTILITY_ESTIMATES["total_per_sqm"]
    items.append(CostItem(
        name="Utilities (Estimate)",
        amount_eur=utilities,
        description=f"Electricity, gas, water for {property_size:.0f}sqm",
        is_estimate=True
    ))

    # Convert to foreign currency
    if prop.source_currency.value != "EUR":
        for item in items:
            item.amount_foreign = convert_currency(
                item.amount_eur, "EUR", prop.source_currency.value, rates
            )

    return items, notes


def calculate_total(prop: PropertyInput, rates: dict[str, float]) -> CalculationResult:
    """
    Perform complete cost calculation.

    Args:
        prop: Property input parameters
        rates: Exchange rates dictionary

    Returns:
        Complete calculation result
    """
    # Calculate cadastral value
    cadastral_value = calculate_cadastral_value(
        prop.cadastral_income,
        prop.prima_casa,
        prop.purchase_price
    )

    # Calculate costs
    one_time_items, one_time_notes = calculate_one_time_costs(prop, cadastral_value, rates)
    annual_items, annual_notes = calculate_annual_costs(prop, cadastral_value, rates)

    # Calculate subtotals
    one_time_total_eur = sum(item.amount_eur for item in one_time_items)
    annual_total_eur = sum(item.amount_eur for item in annual_items)

    # Foreign currency totals
    one_time_total_foreign = None
    annual_total_foreign = None
    purchase_price_foreign = None
    exchange_rate = None

    if prop.source_currency.value != "EUR":
        exchange_rate = rates.get(prop.source_currency.value, 1.0)
        purchase_price_foreign = prop.purchase_price * exchange_rate
        one_time_total_foreign = one_time_total_eur * exchange_rate
        annual_total_foreign = annual_total_eur * exchange_rate

    # Grand total first year
    grand_total_eur = prop.purchase_price + one_time_total_eur + annual_total_eur
    grand_total_foreign = None
    if purchase_price_foreign:
        grand_total_foreign = grand_total_eur * exchange_rate

    # Percentage calculation
    one_time_percentage = (one_time_total_eur / prop.purchase_price) * 100

    # Create cost categories
    one_time_category = CostCategory(
        name="One-Time Purchase Costs",
        items=one_time_items,
        subtotal_eur=one_time_total_eur,
        subtotal_foreign=one_time_total_foreign
    )

    annual_category = CostCategory(
        name="Ongoing Annual Costs",
        items=annual_items,
        subtotal_eur=annual_total_eur,
        subtotal_foreign=annual_total_foreign
    )

    # Combine notes
    all_notes = one_time_notes + annual_notes
    all_notes.append("All calculations are estimates. Consult a notary or commercialista for exact figures.")
    if not prop.cadastral_income:
        all_notes.append("Cadastral value estimated at 40% of purchase price. Provide actual cadastral income for accuracy.")

    return CalculationResult(
        purchase_price_eur=prop.purchase_price,
        purchase_price_foreign=purchase_price_foreign,
        source_currency=prop.source_currency.value,
        exchange_rate=exchange_rate,
        property_type=prop.property_type.value,
        is_prima_casa=prop.prima_casa,
        seller_type=prop.seller_type.value,
        cadastral_value=cadastral_value,
        one_time_costs=one_time_category,
        ongoing_annual_costs=annual_category,
        total_one_time_eur=one_time_total_eur,
        total_one_time_foreign=one_time_total_foreign,
        total_annual_eur=annual_total_eur,
        total_annual_foreign=annual_total_foreign,
        grand_total_first_year_eur=grand_total_eur,
        grand_total_first_year_foreign=grand_total_foreign,
        one_time_percentage=one_time_percentage,
        notes=all_notes
    )
