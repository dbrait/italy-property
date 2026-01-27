"""
Directory of English-speaking professionals for foreign property buyers in Italy.
Updated: January 2026

Categories:
- Lawyers (Avvocati) - Real estate and immigration law
- Notaries (Notai) - Required for property transactions
- Surveyors (Geometri) - Technical inspections and permits
- Architects (Architetti) - Design and renovation
- Real Estate Agents (Agenti Immobiliari) - Property search
- Accountants (Commercialisti) - Tax and financial advice
- Property Managers - Rental and maintenance
- Contractors - Renovation and construction

Note: This is seed data from publicly available sources. Users can suggest additions.
"""

from typing import Optional
import uuid

# Professional categories with descriptions
CATEGORIES = {
    "lawyer": {
        "id": "lawyer",
        "name_en": "Lawyer",
        "name_it": "Avvocato",
        "plural_en": "Lawyers",
        "plural_it": "Avvocati",
        "description": "Real estate lawyers help foreign buyers navigate Italian property law, review contracts, conduct due diligence, and can represent you with power of attorney.",
        "why_needed": "Italian property contracts favor sellers. A lawyer protects your interests and can identify issues before you commit.",
        "typical_fees": "€1,500 - €3,000 for a standard purchase, or 1-1.5% of property value",
        "icon": "scales",
    },
    "notary": {
        "id": "notary",
        "name_en": "Notary",
        "name_it": "Notaio",
        "plural_en": "Notaries",
        "plural_it": "Notai",
        "description": "Notaries are public officials required for all property transactions in Italy. They verify legal compliance and register the deed.",
        "why_needed": "Legally required. The notary ensures the transaction is valid and registers ownership transfer.",
        "typical_fees": "1-2.5% of declared property value (paid by buyer)",
        "icon": "stamp",
    },
    "geometra": {
        "id": "geometra",
        "name_en": "Surveyor/Geometra",
        "name_it": "Geometra",
        "plural_en": "Surveyors",
        "plural_it": "Geometri",
        "description": "Geometri are uniquely Italian professionals combining surveyor, inspector, and permit specialist roles. They verify property compliance and handle bureaucracy.",
        "why_needed": "Essential for checking building compliance, catasto accuracy, and managing renovation permits.",
        "typical_fees": "€300 - €1,500 depending on property complexity",
        "icon": "ruler",
    },
    "architect": {
        "id": "architect",
        "name_en": "Architect",
        "name_it": "Architetto",
        "plural_en": "Architects",
        "plural_it": "Architetti",
        "description": "Architects design renovations and new constructions, obtain permits, and oversee building work.",
        "why_needed": "Required for significant renovations or when design expertise is needed. Can manage the entire project.",
        "typical_fees": "8-15% of construction costs, or fixed fee for smaller projects",
        "icon": "drafting-compass",
    },
    "real_estate_agent": {
        "id": "real_estate_agent",
        "name_en": "Real Estate Agent",
        "name_it": "Agente Immobiliare",
        "plural_en": "Real Estate Agents",
        "plural_it": "Agenti Immobiliari",
        "description": "Licensed agents help find properties, arrange viewings, and facilitate negotiations between buyers and sellers.",
        "why_needed": "Access to listings, local market knowledge, and negotiation support. Some specialize in foreign buyers.",
        "typical_fees": "3-4% of purchase price + 22% VAT (paid by buyer)",
        "icon": "home",
    },
    "accountant": {
        "id": "accountant",
        "name_en": "Accountant",
        "name_it": "Commercialista",
        "plural_en": "Accountants",
        "plural_it": "Commercialisti",
        "description": "Commercialisti handle tax registration, annual declarations, rental income reporting, and tax optimization strategies.",
        "why_needed": "Italian tax obligations are complex. Essential for rental income, residency tax implications, and ongoing compliance.",
        "typical_fees": "€500 - €2,000/year for property tax management",
        "icon": "calculator",
    },
    "property_manager": {
        "id": "property_manager",
        "name_en": "Property Manager",
        "name_it": "Property Manager",
        "plural_en": "Property Managers",
        "plural_it": "Property Managers",
        "description": "Property managers handle rentals, maintenance, bill payments, and property oversight for absentee owners.",
        "why_needed": "Essential if you don't live in Italy full-time. Handles guests, emergencies, and regular maintenance.",
        "typical_fees": "15-25% of rental income, or fixed monthly fee",
        "icon": "key",
    },
    "contractor": {
        "id": "contractor",
        "name_en": "Contractor/Builder",
        "name_it": "Impresa Edile",
        "plural_en": "Contractors",
        "plural_it": "Imprese Edili",
        "description": "Building contractors handle renovation and construction work, from minor repairs to complete restorations.",
        "why_needed": "Quality contractors who understand foreign client expectations and communicate in English are valuable.",
        "typical_fees": "Varies by project scope. Get multiple quotes.",
        "icon": "hard-hat",
    },
}

# Seed data for professionals (from research)
PROFESSIONALS = [
    # =========================================================================
    # LAWYERS
    # =========================================================================
    {
        "id": "irel-001",
        "category": "lawyer",
        "name": "Italian Real Estate Lawyers (IREL)",
        "contact_person": "Marco",
        "regions": ["all"],
        "cities": [],
        "languages": ["English", "Spanish", "Italian"],
        "website": "https://italianrealestatelawyers.com/",
        "email": None,
        "phone": None,
        "description": "Specializes in Italian real estate, tax, and immigration law for international clients. Marco worked in New York with firms specializing in cross-border real estate transactions before joining.",
        "services": [
            "Property purchase assistance",
            "Due diligence",
            "Contract review",
            "Power of attorney representation",
            "Residency and visa support",
            "Tax planning",
        ],
        "highlights": [
            "US cross-border experience",
            "Can represent with power of attorney",
            "Full purchase transaction support",
        ],
        "verified": True,
        "featured": True,
        "source": "Website",
    },
    {
        "id": "ipl-001",
        "category": "lawyer",
        "name": "Italian Property Lawyers",
        "contact_person": None,
        "regions": ["all"],
        "cities": [],
        "languages": ["English", "Italian"],
        "website": "https://www.italianpropertylawyers.com/",
        "email": None,
        "phone": None,
        "description": "Team of lawyers, real estate agents, architects, and property managers with over 100 years combined experience working with international clients purchasing Italian real estate.",
        "services": [
            "Full purchase transaction support",
            "Due diligence",
            "Contract negotiation",
            "Property management referrals",
            "Architectural services coordination",
        ],
        "highlights": [
            "100+ years combined experience",
            "Multi-disciplinary team",
            "Nationwide coverage",
        ],
        "verified": True,
        "featured": True,
        "source": "Website",
    },
    {
        "id": "giambrone-001",
        "category": "lawyer",
        "name": "Giambrone & Partners",
        "contact_person": None,
        "regions": ["all"],
        "cities": ["Milan", "Rome", "Palermo", "London"],
        "languages": ["English", "Italian", "French", "German"],
        "website": "https://www.giambronelaw.com/",
        "email": None,
        "phone": None,
        "description": "International law firm with offices in Italy and UK. Extensive experience helping UK, Irish, US, and Scandinavian buyers purchase residential property in Italy.",
        "services": [
            "Property purchase",
            "Due diligence",
            "Tax advice",
            "Immigration",
            "Litigation",
        ],
        "highlights": [
            "UK and Italy offices",
            "Large international firm",
            "Multi-language support",
        ],
        "verified": True,
        "featured": True,
        "source": "Website",
    },
    {
        "id": "mli-001",
        "category": "lawyer",
        "name": "My Lawyer in Italy (MLI)",
        "contact_person": None,
        "regions": ["all"],
        "cities": [],
        "languages": ["English", "Italian"],
        "website": "https://www.mylawyerinitaly.com/",
        "email": None,
        "phone": None,
        "description": "Supports foreign purchasers/sellers and expat communities with strategic legal support. Experienced in both residential and investment properties.",
        "services": [
            "Property buying and selling",
            "Residency applications",
            "Contract review",
            "Legal consultations",
        ],
        "highlights": [
            "Expat community focus",
            "Clear communication style",
            "Residential and investment",
        ],
        "verified": True,
        "featured": False,
        "source": "Website",
    },
    {
        "id": "ilf-001",
        "category": "lawyer",
        "name": "ILF Law Firm",
        "contact_person": None,
        "regions": ["toscana"],
        "cities": ["Florence"],
        "languages": ["English", "Spanish", "Italian"],
        "website": "https://italylawfirms.com/en/",
        "email": None,
        "phone": None,
        "description": "Established in 2001 in Florence, recognized as a top firm for international transactions. Includes Italian lawyers fluent in English and English lawyers specialized in Italian affairs.",
        "services": [
            "Real estate transactions",
            "Notary coordination",
            "Accounting services",
            "Architectural referrals",
        ],
        "highlights": [
            "Tuscany specialist",
            "Established 2001",
            "Full-service for foreigners",
        ],
        "verified": True,
        "featured": False,
        "source": "Website",
    },
    {
        "id": "lrei-001",
        "category": "lawyer",
        "name": "Legal Real Estate Italy (Aliant)",
        "contact_person": "Claudia",
        "regions": ["all"],
        "cities": [],
        "languages": ["English", "Italian"],
        "website": "https://www.legalrealestateitaly.it/",
        "email": None,
        "phone": None,
        "description": "Founded by Claudia, an experienced real estate lawyer with 25+ years experience and background as an attorney in California. Part of Aliant international law firm network.",
        "services": [
            "Property acquisitions",
            "Due diligence",
            "International investor support",
        ],
        "highlights": [
            "California bar experience",
            "25+ years experience",
            "International law firm network",
        ],
        "verified": True,
        "featured": False,
        "source": "Website",
    },
    # =========================================================================
    # ACCOUNTANTS
    # =========================================================================
    {
        "id": "expath-001",
        "category": "accountant",
        "name": "EXPATH",
        "contact_person": None,
        "regions": ["all"],
        "cities": [],
        "languages": ["English", "Spanish", "German", "Italian"],
        "website": "https://www.expath.it/",
        "email": None,
        "phone": None,
        "description": "English-speaking team focused on international clients, providing tax services specifically targeted to expat needs in Italy.",
        "services": [
            "Expat tax returns",
            "Codice fiscale assistance",
            "Property tax management",
            "Rental income declarations",
            "Tax residency advice",
        ],
        "highlights": [
            "Expat specialist",
            "Multi-language team",
            "Online services available",
        ],
        "verified": True,
        "featured": True,
        "source": "Website",
    },
    {
        "id": "accbolla-001",
        "category": "accountant",
        "name": "Accounting Bolla",
        "contact_person": None,
        "regions": ["all"],
        "cities": [],
        "languages": ["English", "Italian"],
        "website": "https://accountingbolla.com/",
        "email": None,
        "phone": None,
        "description": "Provides expat tax and immigration resources with a streamlined 5-step tax return filing process.",
        "services": [
            "Expat tax filing",
            "Immigration support",
            "Business setup",
            "Ongoing compliance",
        ],
        "highlights": [
            "Simple 5-step process",
            "Expat resources",
            "Immigration support",
        ],
        "verified": True,
        "featured": False,
        "source": "Website",
    },
    {
        "id": "mia-001",
        "category": "accountant",
        "name": "My Italian Accountant",
        "contact_person": "Filippo",
        "regions": ["all"],
        "cities": [],
        "languages": ["English", "Italian"],
        "website": "https://myitalianaccountant.com/",
        "email": None,
        "phone": None,
        "description": "Filippo is an English-speaking Italian chartered accountant (Commercialista) who guides clients through Italian taxation in an easy-to-understand way.",
        "services": [
            "Business accounting",
            "Personal tax",
            "Property taxation",
            "Company formation",
        ],
        "highlights": [
            "Chartered accountant",
            "Clear explanations",
            "Business and personal",
        ],
        "verified": True,
        "featured": True,
        "source": "Website",
    },
    {
        "id": "cosmos-001",
        "category": "accountant",
        "name": "Cosmos International Services",
        "contact_person": None,
        "regions": ["lazio"],
        "cities": ["Rome"],
        "languages": ["English", "Italian"],
        "website": "https://www.accountantrome.com/",
        "email": None,
        "phone": None,
        "description": "Rome-based English-speaking accountancy specializing in helping foreigners conduct business in Italy. Full payroll services available.",
        "services": [
            "Business setup",
            "Payroll services",
            "Tax compliance",
            "Accounting",
        ],
        "highlights": [
            "Rome-based",
            "Business specialist",
            "Full payroll services",
        ],
        "verified": True,
        "featured": False,
        "source": "Website",
    },
    {
        "id": "vannucci-001",
        "category": "accountant",
        "name": "MGI Vannucci & Associati",
        "contact_person": None,
        "regions": ["toscana"],
        "cities": ["Florence", "Lucca"],
        "languages": ["English", "Italian"],
        "website": "https://www.vannuccieassociati.it/",
        "email": None,
        "phone": None,
        "description": "Established Tuscan firm active for over 30 years with offices in Florence and Lucca. English-speaking accountants available.",
        "services": [
            "Tax advisory",
            "Corporate accounting",
            "Property taxation",
            "Audit services",
        ],
        "highlights": [
            "30+ years established",
            "Two Tuscan offices",
            "Full-service firm",
        ],
        "verified": True,
        "featured": False,
        "source": "Website",
    },
    # =========================================================================
    # REAL ESTATE AGENTS
    # =========================================================================
    {
        "id": "norton-001",
        "category": "real_estate_agent",
        "name": "Norton Tanzarella",
        "contact_person": "Alex",
        "regions": ["puglia"],
        "cities": [],
        "languages": ["English", "Italian"],
        "website": "https://nortontanzarella.com/",
        "email": None,
        "phone": None,
        "description": "Italian real estate agency tailored towards foreigners looking to migrate to Italy. Alex (native English speaker) guides clients through Italian legislation requirements.",
        "services": [
            "Property search",
            "Viewing arrangement",
            "Purchase guidance",
            "Relocation support",
        ],
        "highlights": [
            "Native English speaker",
            "Puglia specialist",
            "Migration focus",
        ],
        "verified": True,
        "featured": True,
        "source": "Website",
    },
    {
        "id": "abode-001",
        "category": "real_estate_agent",
        "name": "Abode Italy",
        "contact_person": "Paul & Nick",
        "regions": ["toscana", "umbria"],
        "cities": [],
        "languages": ["English", "Italian"],
        "website": "https://www.abodeitaly.com/",
        "email": None,
        "phone": None,
        "description": "Co-founded by British expats Paul and Nick who relocated to Tuscany & Umbria. First-hand experience of challenges buying property as foreigners. 70+ years combined experience.",
        "services": [
            "Property search",
            "Purchase support",
            "Property management",
            "Renovation coordination",
        ],
        "highlights": [
            "British expat founders",
            "70+ years experience",
            "Also offer property management",
        ],
        "verified": True,
        "featured": True,
        "source": "Website",
    },
    {
        "id": "ihh-001",
        "category": "real_estate_agent",
        "name": "Italy House Hunting / Alba Toscana",
        "contact_person": "Kris Mahieu",
        "regions": ["toscana", "umbria", "marche", "abruzzo", "liguria", "puglia", "piemonte", "lazio", "sicilia", "sardegna"],
        "cities": [],
        "languages": ["English", "Italian", "Dutch", "French"],
        "website": "https://www.italyhousehunting.com/",
        "email": None,
        "phone": None,
        "description": "Kris Mahieu, originally from Belgium with 15+ years in Italy, has a university degree as English-Italian translator and Italian real estate license. Helps customers worldwide since 2009.",
        "services": [
            "Multi-region property search",
            "Translation services",
            "Purchase coordination",
            "Viewing trips",
        ],
        "highlights": [
            "Multi-region coverage",
            "Professional translator",
            "15+ years experience",
        ],
        "verified": True,
        "featured": True,
        "source": "Website",
    },
    {
        "id": "yri-001",
        "category": "real_estate_agent",
        "name": "Your Realtor in Italy",
        "contact_person": "Justin",
        "regions": ["all"],
        "cities": [],
        "languages": ["English", "Italian"],
        "website": "https://yourrealtorinitaly.com/",
        "email": None,
        "phone": None,
        "description": "Justin is a licensed realtor specializing in helping foreign-speaking clients buy, sell, or rent property in Italy.",
        "services": [
            "Buying assistance",
            "Selling assistance",
            "Rental search",
        ],
        "highlights": [
            "Licensed realtor",
            "Foreign client specialist",
            "Buy, sell, and rent",
        ],
        "verified": True,
        "featured": False,
        "source": "Website",
    },
    # =========================================================================
    # PROPERTY MANAGERS
    # =========================================================================
    {
        "id": "irecom-pm-001",
        "category": "property_manager",
        "name": "IRECOM Property Management",
        "contact_person": None,
        "regions": ["all"],
        "cities": [],
        "languages": ["English", "Italian"],
        "website": "https://italianrealestatecompany.com/management/",
        "email": None,
        "phone": None,
        "description": "Full-service property management for foreign investors. Team includes lawyers, accountants, architects, and surveyors to handle all aspects of rental property management.",
        "services": [
            "Vacation rental setup",
            "Guest management",
            "Maintenance coordination",
            "Legal compliance",
            "Financial reporting",
        ],
        "highlights": [
            "Full-service team",
            "Vacation rental specialists",
            "Legal and accounting included",
        ],
        "verified": True,
        "featured": True,
        "source": "Website",
    },
    {
        "id": "abode-pm-001",
        "category": "property_manager",
        "name": "Abode Italy Property Management",
        "contact_person": None,
        "regions": ["toscana", "umbria"],
        "cities": [],
        "languages": ["English", "Italian"],
        "website": "https://www.abodeitaly.com/italian-property-management",
        "email": None,
        "phone": None,
        "description": "Full professional property management from house cleaning to full restoration. Services include fiscal administration, bill payment, maintenance, gardening, security, and rental management.",
        "services": [
            "Bill payment",
            "Maintenance",
            "Gardening",
            "Security checks",
            "Arrival/departure services",
            "Rental management",
        ],
        "highlights": [
            "Tuscany & Umbria",
            "Comprehensive services",
            "Expat-run company",
        ],
        "verified": True,
        "featured": True,
        "source": "Website",
    },
    {
        "id": "wonderful-001",
        "category": "property_manager",
        "name": "Wonderful Italy",
        "contact_person": None,
        "regions": ["toscana", "umbria", "liguria", "puglia", "sicilia"],
        "cities": [],
        "languages": ["English", "Italian"],
        "website": "https://wonderfulitaly.eu/en/property-management",
        "email": None,
        "phone": None,
        "description": "Professional vacation rental management in Italy's top destinations. Handles everything from paperwork to property maintenance, partnering with Booking.com and Airbnb.",
        "services": [
            "Listing management",
            "Guest communication",
            "Cleaning coordination",
            "Maintenance",
            "Platform partnerships",
        ],
        "highlights": [
            "Airbnb/Booking.com partners",
            "Multiple tourist regions",
            "Full rental management",
        ],
        "verified": True,
        "featured": False,
        "source": "Website",
    },
    {
        "id": "lcv-001",
        "category": "property_manager",
        "name": "The Lake Como Villa",
        "contact_person": None,
        "regions": ["lombardia"],
        "cities": ["Lake Como", "Menaggio"],
        "languages": ["English", "Italian"],
        "website": "https://thelakecomovilla.com/property-management/",
        "email": None,
        "phone": None,
        "description": "Lake Como specialist offering 360-degree real estate services including professional property management from their Menaggio office. Custom management contracts.",
        "services": [
            "Holiday rental management",
            "Property maintenance",
            "Custom management plans",
            "Local representation",
        ],
        "highlights": [
            "Lake Como specialist",
            "Local Menaggio office",
            "Custom contracts",
        ],
        "verified": True,
        "featured": False,
        "source": "Website",
    },
    # =========================================================================
    # ARCHITECTS
    # =========================================================================
    {
        "id": "archit-001",
        "category": "architect",
        "name": "ARCHITECTINITALY",
        "contact_person": None,
        "regions": ["toscana", "all"],
        "cities": [],
        "languages": ["English", "Italian"],
        "website": "https://architectinitaly.com/",
        "email": None,
        "phone": None,
        "description": "Union of Italian architects, engineers, designers, and real estate lawyers. All team members speak English and specialize in assisting foreign clients with renovations and restorations.",
        "services": [
            "Renovation design",
            "Restoration projects",
            "Turn-key solutions",
            "Permit management",
            "Legal coordination",
        ],
        "highlights": [
            "Multi-disciplinary team",
            "Turn-key renovations",
            "Tuscany focus, Italy-wide",
        ],
        "verified": True,
        "featured": True,
        "source": "Website",
    },
    {
        "id": "pardini-001",
        "category": "architect",
        "name": "Pardini Hall Architecture",
        "contact_person": None,
        "regions": ["toscana"],
        "cities": ["Lucca", "London"],
        "languages": ["English", "Italian"],
        "website": "https://www.pardinihallarchitecture.com/",
        "email": None,
        "phone": None,
        "description": "International architecture office based in Lucca and London. 25+ years experience in luxury residential architecture, hospitality design, and sustainable retrofits.",
        "services": [
            "Luxury residential design",
            "Hospitality projects",
            "Sustainable retrofits",
            "Interior design",
        ],
        "highlights": [
            "Lucca + London offices",
            "25+ years experience",
            "Luxury specialist",
        ],
        "verified": True,
        "featured": True,
        "source": "Website",
    },
    {
        "id": "windsor-001",
        "category": "architect",
        "name": "WindsorPatania",
        "contact_person": None,
        "regions": ["lombardia"],
        "cities": ["Milan"],
        "languages": ["English", "Italian"],
        "website": "https://windsorpatania.com/locations/milan/",
        "email": None,
        "phone": None,
        "description": "Milan-based English-speaking team with extensive knowledge of Italian building regulations. Understands unique requirements of international clients for new builds and renovations.",
        "services": [
            "High-end interior design",
            "Residential architecture",
            "Renovation projects",
            "Building regulation navigation",
        ],
        "highlights": [
            "Milan specialist",
            "International client focus",
            "Regulation expertise",
        ],
        "verified": True,
        "featured": False,
        "source": "Website",
    },
    {
        "id": "this-001",
        "category": "architect",
        "name": "THIS Architecture",
        "contact_person": None,
        "regions": ["lazio", "toscana", "campania", "sicilia", "liguria", "veneto"],
        "cities": ["Rome", "Milan", "Turin", "Naples"],
        "languages": ["English", "Italian"],
        "website": "https://www.this.it/en/",
        "email": None,
        "phone": None,
        "description": "Rome-based professionals working directly with clients throughout purchase, renovation, and administrative practices. Serves main Italian cities and tourist areas.",
        "services": [
            "Purchase consulting",
            "Renovation design",
            "Permit handling",
            "Project management",
        ],
        "highlights": [
            "Multi-city presence",
            "Tourist area expertise",
            "End-to-end service",
        ],
        "verified": True,
        "featured": False,
        "source": "Website",
    },
    # =========================================================================
    # GEOMETRI
    # =========================================================================
    {
        "id": "hfni-geom-001",
        "category": "geometra",
        "name": "HouseFinders Northern Italy - Geometra Services",
        "contact_person": None,
        "regions": ["piemonte", "liguria"],
        "cities": [],
        "languages": ["English", "Italian"],
        "website": "https://housefindersnorthernitaly.com/geometra-services",
        "email": None,
        "phone": None,
        "description": "Works with licensed, professional, trusted, experienced, local, English-speaking geometras in Piedmont and Liguria regions.",
        "services": [
            "Technical surveys",
            "Catasto verification",
            "Building compliance checks",
            "Permit assistance",
        ],
        "highlights": [
            "Piedmont & Liguria",
            "Vetted local professionals",
            "English-speaking network",
        ],
        "verified": True,
        "featured": True,
        "source": "Website",
    },
    {
        "id": "puglia-geom-001",
        "category": "geometra",
        "name": "Michel Sozzo - Geometra",
        "contact_person": "Michel Sozzo",
        "regions": ["puglia"],
        "cities": ["Lecce"],
        "languages": ["English", "Italian"],
        "website": None,
        "email": None,
        "phone": None,
        "description": "Lecce-based geometra who acts as independent advisor throughout the entire buying journey in Puglia.",
        "services": [
            "Property surveys",
            "Purchase advice",
            "Technical due diligence",
        ],
        "highlights": [
            "Puglia specialist",
            "Independent advisor",
            "Buyer-focused",
        ],
        "verified": False,
        "featured": False,
        "source": "Puglia Everyday recommendation",
    },
    # =========================================================================
    # NOTARIES (English-friendly)
    # =========================================================================
    {
        "id": "notary-pirro-001",
        "category": "notary",
        "name": "Studio Notarile Pirro",
        "contact_person": None,
        "regions": ["lazio"],
        "cities": ["Rome"],
        "languages": ["English", "Italian"],
        "website": "https://www.notaiopirro.it/notary-for-foreigners/",
        "email": None,
        "phone": None,
        "description": "Rome-based notary office with dedicated services for foreigners. Website available in English with information specific to non-Italian buyers.",
        "services": [
            "Property deeds",
            "Company formation",
            "Inheritance matters",
            "Foreigner-specific guidance",
        ],
        "highlights": [
            "Rome-based",
            "Foreigner services page",
            "English website",
        ],
        "verified": True,
        "featured": True,
        "source": "Website",
    },
    {
        "id": "notary-rinaldi-001",
        "category": "notary",
        "name": "Notaio Rinaldi",
        "contact_person": None,
        "regions": [],
        "cities": [],
        "languages": ["English", "Italian"],
        "website": "https://www.notaiorinaldi.it/notary-for-foreigners.html",
        "email": None,
        "phone": None,
        "description": "Notary office with dedicated English page for foreigners, explaining the notarial process and services available to non-Italian clients.",
        "services": [
            "Property transactions",
            "Legal document certification",
            "Foreigner assistance",
        ],
        "highlights": [
            "English information available",
            "Foreigner-focused services",
        ],
        "verified": True,
        "featured": False,
        "source": "Website",
    },
    {
        "id": "notary-italy-001",
        "category": "notary",
        "name": "Notary in Italy",
        "contact_person": None,
        "regions": ["all"],
        "cities": [],
        "languages": ["English", "Italian"],
        "website": "https://www.notaryinitaly.com/",
        "email": None,
        "phone": None,
        "description": "Service helping foreign clients find and work with notaries across Italy. Provides English-language guidance on the notarial process.",
        "services": [
            "Notary matching",
            "Process guidance",
            "Document preparation",
        ],
        "highlights": [
            "Nationwide network",
            "English guidance",
            "Foreigner specialist",
        ],
        "verified": True,
        "featured": True,
        "source": "Website",
    },
    # =========================================================================
    # CONTRACTORS / RENOVATION SERVICES
    # =========================================================================
    {
        "id": "irecom-ren-001",
        "category": "contractor",
        "name": "IRECOM Renovation Services",
        "contact_person": None,
        "regions": ["all"],
        "cities": [],
        "languages": ["English", "Italian"],
        "website": "https://italianrealestatecompany.com/renovation-and-furnishing/",
        "email": None,
        "phone": None,
        "description": "Full renovation service with English-speaking architects, engineers, technicians, and surveyors. Helps foreign buyers overcome communication barriers with local contractors.",
        "services": [
            "Full renovations",
            "Project management",
            "Contractor coordination",
            "Furnishing",
        ],
        "highlights": [
            "End-to-end management",
            "English coordination",
            "Multi-disciplinary team",
        ],
        "verified": True,
        "featured": True,
        "source": "Website",
    },
    {
        "id": "gelso-001",
        "category": "contractor",
        "name": "Gelso Bianco",
        "contact_person": "Karina Prasad",
        "regions": ["puglia"],
        "cities": [],
        "languages": ["English", "Italian"],
        "website": None,
        "email": None,
        "phone": None,
        "description": "Puglia-based company specializing in property restoration and redevelopment. Led by Karina Prasad with team of expert craftsmen including surveyors, architects, engineers, and contractors.",
        "services": [
            "Property restoration",
            "Redevelopment",
            "Full renovation management",
        ],
        "highlights": [
            "Puglia specialist",
            "Full team of craftsmen",
            "Restoration expertise",
        ],
        "verified": False,
        "featured": False,
        "source": "Expat recommendation",
    },
]


def get_all_categories():
    """Return all professional categories."""
    return list(CATEGORIES.values())


def get_category(category_id: str):
    """Get a single category by ID."""
    return CATEGORIES.get(category_id)


def get_all_professionals():
    """Return all professionals."""
    return PROFESSIONALS


def get_professional_by_id(professional_id: str):
    """Get a single professional by ID."""
    for p in PROFESSIONALS:
        if p["id"] == professional_id:
            return p
    return None


def search_professionals(
    category: Optional[str] = None,
    region: Optional[str] = None,
    featured_only: bool = False,
    verified_only: bool = False,
) -> list[dict]:
    """Search professionals with filters."""
    results = PROFESSIONALS.copy()

    if category:
        results = [p for p in results if p["category"] == category]

    if region:
        results = [p for p in results if region in p["regions"] or "all" in p["regions"]]

    if featured_only:
        results = [p for p in results if p.get("featured", False)]

    if verified_only:
        results = [p for p in results if p.get("verified", False)]

    # Sort: featured first, then verified, then alphabetically
    results.sort(key=lambda p: (
        not p.get("featured", False),
        not p.get("verified", False),
        p["name"].lower()
    ))

    return results


def get_professionals_by_category():
    """Return professionals grouped by category."""
    grouped = {cat_id: [] for cat_id in CATEGORIES.keys()}
    for p in PROFESSIONALS:
        if p["category"] in grouped:
            grouped[p["category"]].append(p)
    return grouped


def get_regions_with_professionals():
    """Return list of regions that have professionals."""
    regions = set()
    for p in PROFESSIONALS:
        for r in p["regions"]:
            if r != "all":
                regions.add(r)
    return sorted(list(regions))
