"""
Italian regional data for property research.
Updated: January 2026

Data includes market information, climate, lifestyle factors, and expat-relevant details
for all 20 Italian regions.

Note: Market data is illustrative and based on general trends. For current prices,
consult local real estate agencies or official statistics (OMI - Osservatorio del Mercato Immobiliare).
"""

REGIONS = {
    "piemonte": {
        "id": "piemonte",
        "name_en": "Piedmont",
        "name_it": "Piemonte",
        "capital": "Turin",
        "capital_it": "Torino",
        "market": {
            "avg_price_sqm": 1800,
            "price_trend_yoy": 1.2,
            "avg_days_on_market": 120,
            "listings_count": 45000,
        },
        "climate": {
            "climate_type": "Continental",
            "avg_summer_temp_c": 26,
            "avg_winter_temp_c": 2,
            "annual_rainfall_mm": 900,
            "sunshine_hours_year": 1900,
        },
        "lifestyle": {
            "expat_community_size": "medium",
            "healthcare_rating": 8.0,
            "english_proficiency": "low",
            "international_schools": 8,
            "cost_of_living_index": 75,
        },
        "description": "Piedmont is a northwestern region known for its stunning Alpine scenery, world-class wines (Barolo, Barbaresco), and the elegant city of Turin. The region offers excellent value with lower property prices than neighboring Lombardy while maintaining high quality of life. Popular with food and wine enthusiasts, it's home to the Slow Food movement and numerous Michelin-starred restaurants.",
        "highlights": [
            "World-renowned wine regions (Langhe, Monferrato)",
            "UNESCO World Heritage sites",
            "Excellent skiing in the Alps",
            "Turin - historic royal capital with vibrant culture",
            "Lower property prices than major Italian cities",
        ],
        "popular_areas": ["Turin", "Alba", "Asti", "Lake Maggiore", "Langhe"],
        "considerations": [
            "Cold winters with snow",
            "Limited English outside Turin",
            "Distance from sea/beaches",
        ],
    },
    "valle_daosta": {
        "id": "valle_daosta",
        "name_en": "Aosta Valley",
        "name_it": "Valle d'Aosta",
        "capital": "Aosta",
        "capital_it": "Aosta",
        "market": {
            "avg_price_sqm": 2800,
            "price_trend_yoy": 0.8,
            "avg_days_on_market": 150,
            "listings_count": 3500,
        },
        "climate": {
            "climate_type": "Alpine",
            "avg_summer_temp_c": 22,
            "avg_winter_temp_c": -2,
            "annual_rainfall_mm": 600,
            "sunshine_hours_year": 2100,
        },
        "lifestyle": {
            "expat_community_size": "small",
            "healthcare_rating": 7.8,
            "english_proficiency": "low",
            "international_schools": 1,
            "cost_of_living_index": 85,
        },
        "description": "Italy's smallest and least populous region, Aosta Valley is a bilingual (Italian/French) Alpine paradise. Home to some of Europe's highest peaks including Mont Blanc and the Matterhorn, it's a haven for outdoor enthusiasts. Property here tends toward ski chalets and mountain homes, with premium prices in resort areas like Courmayeur.",
        "highlights": [
            "World-class skiing (Courmayeur, Cervinia)",
            "Spectacular Alpine scenery",
            "Unique Franco-Italian culture",
            "Special autonomous status with tax benefits",
            "Year-round outdoor activities",
        ],
        "popular_areas": ["Courmayeur", "Cervinia", "Aosta", "Gressoney"],
        "considerations": [
            "Very cold winters",
            "Limited services in remote areas",
            "Small job market",
            "Property premium in ski resorts",
        ],
    },
    "lombardia": {
        "id": "lombardia",
        "name_en": "Lombardy",
        "name_it": "Lombardia",
        "capital": "Milan",
        "capital_it": "Milano",
        "market": {
            "avg_price_sqm": 3200,
            "price_trend_yoy": 2.5,
            "avg_days_on_market": 85,
            "listings_count": 95000,
        },
        "climate": {
            "climate_type": "Continental",
            "avg_summer_temp_c": 28,
            "avg_winter_temp_c": 3,
            "annual_rainfall_mm": 1000,
            "sunshine_hours_year": 1900,
        },
        "lifestyle": {
            "expat_community_size": "large",
            "healthcare_rating": 8.5,
            "english_proficiency": "high",
            "international_schools": 25,
            "cost_of_living_index": 95,
        },
        "description": "Italy's economic powerhouse and most populous region, Lombardy centers on Milan - a global capital for fashion, finance, and design. The region offers everything from urban sophistication to the serene beauty of the Italian Lakes (Como, Garda, Maggiore). Property prices are among Italy's highest, especially in Milan and lakefront areas, but the job market and international connectivity are unmatched.",
        "highlights": [
            "Milan - Italy's business and fashion capital",
            "Famous Italian Lakes",
            "Excellent international connectivity",
            "Strong job market for professionals",
            "Top healthcare and education",
        ],
        "popular_areas": ["Milan", "Lake Como", "Bergamo", "Lake Garda", "Brescia"],
        "considerations": [
            "High property prices, especially Milan",
            "Continental climate with humid summers",
            "Traffic congestion in urban areas",
        ],
    },
    "trentino_alto_adige": {
        "id": "trentino_alto_adige",
        "name_en": "Trentino-Alto Adige",
        "name_it": "Trentino-Alto Adige",
        "capital": "Trento",
        "capital_it": "Trento",
        "market": {
            "avg_price_sqm": 3000,
            "price_trend_yoy": 1.8,
            "avg_days_on_market": 110,
            "listings_count": 12000,
        },
        "climate": {
            "climate_type": "Alpine",
            "avg_summer_temp_c": 24,
            "avg_winter_temp_c": 0,
            "annual_rainfall_mm": 850,
            "sunshine_hours_year": 2000,
        },
        "lifestyle": {
            "expat_community_size": "medium",
            "healthcare_rating": 8.8,
            "english_proficiency": "moderate",
            "international_schools": 5,
            "cost_of_living_index": 88,
        },
        "description": "A unique bilingual region (Italian/German) with autonomous status, Trentino-Alto Adige offers the best of both Italian and Austrian cultures. The Dolomites provide a stunning backdrop for world-class skiing and hiking. Known for exceptional quality of life, clean environment, and efficient public services, it's one of Italy's wealthiest regions.",
        "highlights": [
            "UNESCO Dolomites mountain range",
            "Exceptional quality of life",
            "Bilingual Italian-German culture",
            "Top-rated healthcare and schools",
            "Year-round outdoor activities",
        ],
        "popular_areas": ["Bolzano/Bozen", "Trento", "Merano", "Val Gardena", "Cortina d'Ampezzo"],
        "considerations": [
            "High property prices",
            "German often preferred in Alto Adige",
            "Cold, snowy winters",
        ],
    },
    "veneto": {
        "id": "veneto",
        "name_en": "Veneto",
        "name_it": "Veneto",
        "capital": "Venice",
        "capital_it": "Venezia",
        "market": {
            "avg_price_sqm": 2400,
            "price_trend_yoy": 1.5,
            "avg_days_on_market": 95,
            "listings_count": 55000,
        },
        "climate": {
            "climate_type": "Continental/Mediterranean",
            "avg_summer_temp_c": 27,
            "avg_winter_temp_c": 4,
            "annual_rainfall_mm": 850,
            "sunshine_hours_year": 2100,
        },
        "lifestyle": {
            "expat_community_size": "large",
            "healthcare_rating": 8.2,
            "english_proficiency": "moderate",
            "international_schools": 12,
            "cost_of_living_index": 80,
        },
        "description": "Veneto encompasses the magical city of Venice, the romantic Verona, and the university town of Padua. Beyond the famous cities, the region offers prosecco vineyards, Palladian villas, and the Dolomites foothills. Venice property is unique and expensive, but the mainland offers better value with easy access to the lagoon city.",
        "highlights": [
            "Venice - unique lagoon city",
            "Verona - city of Romeo and Juliet",
            "Prosecco wine region",
            "Palladian architecture",
            "Dolomites accessible for skiing",
        ],
        "popular_areas": ["Venice", "Verona", "Padua", "Treviso", "Vicenza"],
        "considerations": [
            "Venice: flooding, tourist crowds, high prices",
            "Mainland: less character but more practical",
            "Humid summers",
        ],
    },
    "friuli_venezia_giulia": {
        "id": "friuli_venezia_giulia",
        "name_en": "Friuli Venezia Giulia",
        "name_it": "Friuli Venezia Giulia",
        "capital": "Trieste",
        "capital_it": "Trieste",
        "market": {
            "avg_price_sqm": 1600,
            "price_trend_yoy": 1.0,
            "avg_days_on_market": 130,
            "listings_count": 15000,
        },
        "climate": {
            "climate_type": "Continental/Mediterranean",
            "avg_summer_temp_c": 26,
            "avg_winter_temp_c": 4,
            "annual_rainfall_mm": 1100,
            "sunshine_hours_year": 2000,
        },
        "lifestyle": {
            "expat_community_size": "small",
            "healthcare_rating": 8.0,
            "english_proficiency": "moderate",
            "international_schools": 3,
            "cost_of_living_index": 72,
        },
        "description": "A fascinating border region where Italian, Slavic, and Austrian cultures meet. Trieste, once the Habsburg Empire's main port, retains grand Central European architecture and a unique literary coffee culture. The region offers excellent value for money, beautiful Adriatic beaches, and access to Slovenia and Croatia.",
        "highlights": [
            "Trieste - cosmopolitan border city",
            "Affordable property prices",
            "Mix of cultures (Italian, Slovenian, Austrian)",
            "Beautiful Adriatic coastline",
            "Easy access to Slovenia and Croatia",
        ],
        "popular_areas": ["Trieste", "Udine", "Gorizia", "Grado"],
        "considerations": [
            "Bora wind can be intense",
            "Smaller expat community",
            "Economic challenges in some areas",
        ],
    },
    "liguria": {
        "id": "liguria",
        "name_en": "Liguria",
        "name_it": "Liguria",
        "capital": "Genoa",
        "capital_it": "Genova",
        "market": {
            "avg_price_sqm": 2600,
            "price_trend_yoy": 1.3,
            "avg_days_on_market": 100,
            "listings_count": 28000,
        },
        "climate": {
            "climate_type": "Mediterranean",
            "avg_summer_temp_c": 27,
            "avg_winter_temp_c": 9,
            "annual_rainfall_mm": 1200,
            "sunshine_hours_year": 2400,
        },
        "lifestyle": {
            "expat_community_size": "medium",
            "healthcare_rating": 7.8,
            "english_proficiency": "moderate",
            "international_schools": 4,
            "cost_of_living_index": 82,
        },
        "description": "The Italian Riviera stretches along Liguria's dramatic coastline, from the French border to Tuscany. Famous for Portofino, the Cinque Terre, and Sanremo, this narrow coastal strip offers mild winters and stunning sea views. Property is expensive in prime coastal locations but more affordable inland. Genoa, Italy's largest port, offers urban amenities at lower prices.",
        "highlights": [
            "Italian Riviera coastline",
            "Cinque Terre UNESCO site",
            "Mild Mediterranean climate",
            "Glamorous Portofino",
            "Fresh seafood and pesto cuisine",
        ],
        "popular_areas": ["Portofino", "Santa Margherita Ligure", "Cinque Terre", "Sanremo", "Genoa"],
        "considerations": [
            "Steep terrain limits accessibility",
            "Premium prices in coastal towns",
            "Crowded in summer tourist season",
        ],
    },
    "emilia_romagna": {
        "id": "emilia_romagna",
        "name_en": "Emilia-Romagna",
        "name_it": "Emilia-Romagna",
        "capital": "Bologna",
        "capital_it": "Bologna",
        "market": {
            "avg_price_sqm": 2200,
            "price_trend_yoy": 2.0,
            "avg_days_on_market": 90,
            "listings_count": 48000,
        },
        "climate": {
            "climate_type": "Continental",
            "avg_summer_temp_c": 28,
            "avg_winter_temp_c": 3,
            "annual_rainfall_mm": 700,
            "sunshine_hours_year": 2000,
        },
        "lifestyle": {
            "expat_community_size": "medium",
            "healthcare_rating": 8.6,
            "english_proficiency": "moderate",
            "international_schools": 8,
            "cost_of_living_index": 78,
        },
        "description": "The gastronomic heart of Italy, Emilia-Romagna is home to Parma ham, Parmigiano-Reggiano, balsamic vinegar, and Bolognese sauce. Bologna hosts Europe's oldest university and has a vibrant, youthful atmosphere. The region is prosperous, well-organized, and offers excellent value compared to Tuscany while sharing similar appeal.",
        "highlights": [
            "Italy's food capital",
            "Bologna - vibrant university city",
            "Ferrari, Lamborghini, Maserati country",
            "Well-organized public services",
            "Adriatic beach resorts (Rimini)",
        ],
        "popular_areas": ["Bologna", "Parma", "Modena", "Ravenna", "Rimini"],
        "considerations": [
            "Hot, humid summers; foggy winters",
            "Less famous than Tuscany (pro and con)",
            "Coastal areas very crowded in summer",
        ],
    },
    "toscana": {
        "id": "toscana",
        "name_en": "Tuscany",
        "name_it": "Toscana",
        "capital": "Florence",
        "capital_it": "Firenze",
        "market": {
            "avg_price_sqm": 3500,
            "price_trend_yoy": 2.1,
            "avg_days_on_market": 95,
            "listings_count": 65000,
        },
        "climate": {
            "climate_type": "Mediterranean",
            "avg_summer_temp_c": 28,
            "avg_winter_temp_c": 6,
            "annual_rainfall_mm": 800,
            "sunshine_hours_year": 2300,
        },
        "lifestyle": {
            "expat_community_size": "large",
            "healthcare_rating": 8.2,
            "english_proficiency": "moderate",
            "international_schools": 12,
            "cost_of_living_index": 85,
        },
        "description": "Tuscany needs little introduction - it's the iconic image of Italian countryside that draws buyers worldwide. Rolling hills, cypress trees, Renaissance art, world-famous wines, and historic hill towns create an irresistible package. The large expat community means English is widely spoken and services cater to international buyers, but prices reflect the demand.",
        "highlights": [
            "Florence - Renaissance art capital",
            "Iconic countryside landscapes",
            "World-famous Chianti wines",
            "Large, established expat community",
            "Historic hill towns (Siena, San Gimignano)",
        ],
        "popular_areas": ["Florence", "Siena", "Lucca", "Chianti", "Cortona"],
        "considerations": [
            "High property prices",
            "Tourist crowds in popular areas",
            "Can feel 'over-discovered'",
        ],
    },
    "umbria": {
        "id": "umbria",
        "name_en": "Umbria",
        "name_it": "Umbria",
        "capital": "Perugia",
        "capital_it": "Perugia",
        "market": {
            "avg_price_sqm": 1800,
            "price_trend_yoy": 1.5,
            "avg_days_on_market": 115,
            "listings_count": 18000,
        },
        "climate": {
            "climate_type": "Mediterranean/Continental",
            "avg_summer_temp_c": 28,
            "avg_winter_temp_c": 5,
            "annual_rainfall_mm": 850,
            "sunshine_hours_year": 2200,
        },
        "lifestyle": {
            "expat_community_size": "medium",
            "healthcare_rating": 7.8,
            "english_proficiency": "low",
            "international_schools": 3,
            "cost_of_living_index": 70,
        },
        "description": "Italy's 'green heart' - the only landlocked region in central Italy. Umbria offers Tuscan-style landscapes at lower prices, with medieval hill towns, olive groves, and a slower pace of life. Assisi, with its Franciscan heritage, draws pilgrims and tourists, while Orvieto and Spoleto offer culture without crowds. Popular with those seeking authentic Italy.",
        "highlights": [
            "Lower prices than neighboring Tuscany",
            "Assisi - spiritual center of St. Francis",
            "Authentic Italian lifestyle",
            "Beautiful medieval hill towns",
            "Excellent local food and wine",
        ],
        "popular_areas": ["Perugia", "Assisi", "Orvieto", "Spoleto", "Todi"],
        "considerations": [
            "Landlocked - no beaches",
            "Smaller expat community",
            "Limited international schools",
            "Less English spoken",
        ],
    },
    "marche": {
        "id": "marche",
        "name_en": "Marche",
        "name_it": "Marche",
        "capital": "Ancona",
        "capital_it": "Ancona",
        "market": {
            "avg_price_sqm": 1500,
            "price_trend_yoy": 1.0,
            "avg_days_on_market": 125,
            "listings_count": 22000,
        },
        "climate": {
            "climate_type": "Mediterranean/Continental",
            "avg_summer_temp_c": 27,
            "avg_winter_temp_c": 5,
            "annual_rainfall_mm": 750,
            "sunshine_hours_year": 2200,
        },
        "lifestyle": {
            "expat_community_size": "small",
            "healthcare_rating": 7.6,
            "english_proficiency": "low",
            "international_schools": 2,
            "cost_of_living_index": 68,
        },
        "description": "Often called 'the new Tuscany,' Marche offers similar landscapes and lifestyle at significantly lower prices. This Adriatic region has everything: beaches, rolling hills, mountains, and Renaissance towns like Urbino. Earthquake damage in 2016 affected some inland areas, creating both challenges and opportunities for renovation projects.",
        "highlights": [
            "Excellent value for money",
            "Adriatic beaches",
            "Urbino - Renaissance gem",
            "Less touristy than Tuscany",
            "Complete landscape variety",
        ],
        "popular_areas": ["Urbino", "Pesaro", "Ascoli Piceno", "Fermo", "San Benedetto del Tronto"],
        "considerations": [
            "Some areas affected by 2016 earthquake",
            "Small expat community",
            "Limited English",
            "Slower property market",
        ],
    },
    "lazio": {
        "id": "lazio",
        "name_en": "Lazio",
        "name_it": "Lazio",
        "capital": "Rome",
        "capital_it": "Roma",
        "market": {
            "avg_price_sqm": 3000,
            "price_trend_yoy": 1.8,
            "avg_days_on_market": 100,
            "listings_count": 75000,
        },
        "climate": {
            "climate_type": "Mediterranean",
            "avg_summer_temp_c": 30,
            "avg_winter_temp_c": 8,
            "annual_rainfall_mm": 800,
            "sunshine_hours_year": 2500,
        },
        "lifestyle": {
            "expat_community_size": "large",
            "healthcare_rating": 7.5,
            "english_proficiency": "moderate",
            "international_schools": 20,
            "cost_of_living_index": 85,
        },
        "description": "Dominated by the Eternal City, Lazio offers access to Rome's unparalleled history, culture, and international connectivity. Beyond Rome, the region has volcanic lakes, Etruscan heritage, and medieval towns. Property in Rome is expensive and bureaucratically complex, but surrounding areas offer better value with easy city access.",
        "highlights": [
            "Rome - the Eternal City",
            "Major international airport hub",
            "Large expat and diplomatic community",
            "Rich historical sites everywhere",
            "Coastal beaches at Ostia and beyond",
        ],
        "popular_areas": ["Rome (Centro)", "Rome (Trastevere)", "Frascati", "Viterbo", "Lake Bracciano"],
        "considerations": [
            "Rome traffic and bureaucracy",
            "High prices in desirable areas",
            "Hot summers",
            "Complex rental regulations",
        ],
    },
    "abruzzo": {
        "id": "abruzzo",
        "name_en": "Abruzzo",
        "name_it": "Abruzzo",
        "capital": "L'Aquila",
        "capital_it": "L'Aquila",
        "market": {
            "avg_price_sqm": 1200,
            "price_trend_yoy": 0.5,
            "avg_days_on_market": 140,
            "listings_count": 25000,
        },
        "climate": {
            "climate_type": "Mediterranean/Mountain",
            "avg_summer_temp_c": 26,
            "avg_winter_temp_c": 5,
            "annual_rainfall_mm": 700,
            "sunshine_hours_year": 2200,
        },
        "lifestyle": {
            "expat_community_size": "small",
            "healthcare_rating": 7.2,
            "english_proficiency": "low",
            "international_schools": 1,
            "cost_of_living_index": 65,
        },
        "description": "Abruzzo is Italy's hidden gem - with a third of its territory protected as national parks, it's one of Europe's greenest regions. The combination of Adriatic beaches and Apennine ski slopes means you can ski and swim in the same day. Property prices are among Italy's lowest, attracting adventurous buyers seeking authentic rural life.",
        "highlights": [
            "Extremely affordable property",
            "Mountains meet the sea",
            "One-third protected parkland",
            "Traditional, unspoiled villages",
            "Growing expat community",
        ],
        "popular_areas": ["Pescara", "L'Aquila", "Teramo", "Sulmona", "Vasto"],
        "considerations": [
            "L'Aquila still rebuilding after 2009 earthquake",
            "Limited services in rural areas",
            "Very limited English",
            "Slow bureaucracy",
        ],
    },
    "molise": {
        "id": "molise",
        "name_en": "Molise",
        "name_it": "Molise",
        "capital": "Campobasso",
        "capital_it": "Campobasso",
        "market": {
            "avg_price_sqm": 900,
            "price_trend_yoy": 0.2,
            "avg_days_on_market": 180,
            "listings_count": 5000,
        },
        "climate": {
            "climate_type": "Mediterranean/Continental",
            "avg_summer_temp_c": 26,
            "avg_winter_temp_c": 4,
            "annual_rainfall_mm": 700,
            "sunshine_hours_year": 2100,
        },
        "lifestyle": {
            "expat_community_size": "tiny",
            "healthcare_rating": 6.8,
            "english_proficiency": "very_low",
            "international_schools": 0,
            "cost_of_living_index": 60,
        },
        "description": "Italy's least-known region, Molise is sometimes jokingly said 'not to exist.' This tiny, mountainous region offers rock-bottom property prices - including famous €1 houses in depopulating villages. Perfect for those seeking total immersion in traditional Italian life, but requires self-sufficiency and acceptance of limited amenities.",
        "highlights": [
            "Italy's cheapest property",
            "Completely authentic Italy",
            "Beautiful unspoiled landscape",
            "No tourists",
            "Close-knit communities",
        ],
        "popular_areas": ["Campobasso", "Isernia", "Termoli"],
        "considerations": [
            "Very limited services",
            "No international schools",
            "Almost no English spoken",
            "Depopulation in many villages",
            "Limited job opportunities",
        ],
    },
    "campania": {
        "id": "campania",
        "name_en": "Campania",
        "name_it": "Campania",
        "capital": "Naples",
        "capital_it": "Napoli",
        "market": {
            "avg_price_sqm": 2200,
            "price_trend_yoy": 1.5,
            "avg_days_on_market": 105,
            "listings_count": 55000,
        },
        "climate": {
            "climate_type": "Mediterranean",
            "avg_summer_temp_c": 29,
            "avg_winter_temp_c": 9,
            "annual_rainfall_mm": 1000,
            "sunshine_hours_year": 2500,
        },
        "lifestyle": {
            "expat_community_size": "medium",
            "healthcare_rating": 6.5,
            "english_proficiency": "low",
            "international_schools": 5,
            "cost_of_living_index": 70,
        },
        "description": "Home to Naples, Pompeii, the Amalfi Coast, and Capri, Campania is southern Italy at its most intense and beautiful. Naples is chaotic, passionate, and the birthplace of pizza. The Amalfi Coast commands premium prices, while inland areas offer value. Not for the faint-hearted, but those who embrace it find nowhere else compares.",
        "highlights": [
            "Amalfi Coast - world-famous beauty",
            "Naples - vibrant, authentic culture",
            "Pompeii and Herculaneum",
            "Islands: Capri, Ischia, Procida",
            "Incredible food scene",
        ],
        "popular_areas": ["Amalfi Coast", "Naples", "Sorrento", "Capri", "Ischia"],
        "considerations": [
            "Naples can be challenging",
            "Amalfi Coast very expensive",
            "Traffic and parking problems",
            "Some areas have safety concerns",
        ],
    },
    "puglia": {
        "id": "puglia",
        "name_en": "Puglia",
        "name_it": "Puglia",
        "capital": "Bari",
        "capital_it": "Bari",
        "market": {
            "avg_price_sqm": 1600,
            "price_trend_yoy": 2.5,
            "avg_days_on_market": 90,
            "listings_count": 45000,
        },
        "climate": {
            "climate_type": "Mediterranean",
            "avg_summer_temp_c": 30,
            "avg_winter_temp_c": 9,
            "annual_rainfall_mm": 550,
            "sunshine_hours_year": 2600,
        },
        "lifestyle": {
            "expat_community_size": "medium",
            "healthcare_rating": 7.0,
            "english_proficiency": "low",
            "international_schools": 2,
            "cost_of_living_index": 68,
        },
        "description": "Puglia (Apulia) is the heel of Italy's boot - a sun-drenched region famous for whitewashed towns, ancient olive groves, and the unique trulli houses of Alberobello. Once overlooked, it's now one of Italy's hottest property markets. The combination of stunning coastline, affordable prices (outside hotspots), and authentic atmosphere attracts growing numbers of buyers.",
        "highlights": [
            "Unique trulli architecture",
            "Beautiful Adriatic and Ionian coasts",
            "Lecce - 'Florence of the South'",
            "Excellent value outside hotspots",
            "Great food and wine",
        ],
        "popular_areas": ["Lecce", "Ostuni", "Alberobello", "Polignano a Mare", "Bari"],
        "considerations": [
            "Hot, dry summers",
            "Limited public transport",
            "Prices rising in popular areas",
            "Water scarcity issues",
        ],
    },
    "basilicata": {
        "id": "basilicata",
        "name_en": "Basilicata",
        "name_it": "Basilicata",
        "capital": "Potenza",
        "capital_it": "Potenza",
        "market": {
            "avg_price_sqm": 950,
            "price_trend_yoy": 0.8,
            "avg_days_on_market": 160,
            "listings_count": 8000,
        },
        "climate": {
            "climate_type": "Mediterranean/Mountain",
            "avg_summer_temp_c": 27,
            "avg_winter_temp_c": 4,
            "annual_rainfall_mm": 650,
            "sunshine_hours_year": 2300,
        },
        "lifestyle": {
            "expat_community_size": "tiny",
            "healthcare_rating": 6.5,
            "english_proficiency": "very_low",
            "international_schools": 0,
            "cost_of_living_index": 62,
        },
        "description": "Basilicata's fame rests on Matera, whose ancient cave dwellings (Sassi) went from national shame to UNESCO World Heritage Site and European Capital of Culture. Beyond Matera, this mountainous region offers incredibly low property prices in dramatic landscapes. The Ionian coast near Metaponto provides beach access.",
        "highlights": [
            "Matera - extraordinary cave city",
            "Rock-bottom property prices",
            "Dramatic mountain landscapes",
            "Authentic, traditional life",
            "Growing tourism around Matera",
        ],
        "popular_areas": ["Matera", "Potenza", "Maratea", "Metaponto"],
        "considerations": [
            "Very limited services",
            "No international schools",
            "Poor transport links",
            "Depopulation outside Matera",
        ],
    },
    "calabria": {
        "id": "calabria",
        "name_en": "Calabria",
        "name_it": "Calabria",
        "capital": "Catanzaro",
        "capital_it": "Catanzaro",
        "market": {
            "avg_price_sqm": 950,
            "price_trend_yoy": 0.5,
            "avg_days_on_market": 170,
            "listings_count": 35000,
        },
        "climate": {
            "climate_type": "Mediterranean",
            "avg_summer_temp_c": 30,
            "avg_winter_temp_c": 10,
            "annual_rainfall_mm": 600,
            "sunshine_hours_year": 2700,
        },
        "lifestyle": {
            "expat_community_size": "small",
            "healthcare_rating": 5.8,
            "english_proficiency": "very_low",
            "international_schools": 0,
            "cost_of_living_index": 60,
        },
        "description": "The toe of Italy's boot, Calabria has 800km of coastline, including some of Italy's most beautiful and least crowded beaches. Property prices are among Italy's lowest, with stunning sea views available at a fraction of northern costs. However, infrastructure and services lag behind, and the economy is challenged. For adventurous buyers seeking sun and value.",
        "highlights": [
            "Beautiful, uncrowded beaches",
            "Lowest property prices in Italy",
            "Tropea - stunning cliff-top town",
            "Authentic southern culture",
            "Year-round mild climate",
        ],
        "popular_areas": ["Tropea", "Reggio Calabria", "Cosenza", "Soverato", "Scalea"],
        "considerations": [
            "Poor infrastructure",
            "Limited services and healthcare",
            "High unemployment",
            "Organized crime presence in some areas",
        ],
    },
    "sicilia": {
        "id": "sicilia",
        "name_en": "Sicily",
        "name_it": "Sicilia",
        "capital": "Palermo",
        "capital_it": "Palermo",
        "market": {
            "avg_price_sqm": 1300,
            "price_trend_yoy": 1.2,
            "avg_days_on_market": 130,
            "listings_count": 75000,
        },
        "climate": {
            "climate_type": "Mediterranean",
            "avg_summer_temp_c": 31,
            "avg_winter_temp_c": 12,
            "annual_rainfall_mm": 500,
            "sunshine_hours_year": 2700,
        },
        "lifestyle": {
            "expat_community_size": "medium",
            "healthcare_rating": 6.2,
            "english_proficiency": "low",
            "international_schools": 3,
            "cost_of_living_index": 65,
        },
        "description": "The Mediterranean's largest island, Sicily is a world unto itself. Greek temples, Norman cathedrals, Arab-influenced cuisine, and the ever-looming presence of Mount Etna create a unique culture. Property ranges from €1 houses in abandoned villages to restored palazzos. Taormina is the glamorous hotspot, while cities like Palermo and Catania offer urban options.",
        "highlights": [
            "Rich multicultural history",
            "Mount Etna - Europe's largest volcano",
            "Taormina - glamorous resort town",
            "Incredible food and wine",
            "Affordable property outside hotspots",
        ],
        "popular_areas": ["Taormina", "Palermo", "Catania", "Syracuse", "Cefalù"],
        "considerations": [
            "Hot, dry summers",
            "Services less reliable",
            "Island logistics (ferries, flights)",
            "Bureaucracy can be challenging",
        ],
    },
    "sardegna": {
        "id": "sardegna",
        "name_en": "Sardinia",
        "name_it": "Sardegna",
        "capital": "Cagliari",
        "capital_it": "Cagliari",
        "market": {
            "avg_price_sqm": 2400,
            "price_trend_yoy": 1.8,
            "avg_days_on_market": 120,
            "listings_count": 45000,
        },
        "climate": {
            "climate_type": "Mediterranean",
            "avg_summer_temp_c": 29,
            "avg_winter_temp_c": 11,
            "annual_rainfall_mm": 450,
            "sunshine_hours_year": 2800,
        },
        "lifestyle": {
            "expat_community_size": "medium",
            "healthcare_rating": 7.0,
            "english_proficiency": "low",
            "international_schools": 2,
            "cost_of_living_index": 75,
        },
        "description": "Sardinia offers some of the Mediterranean's most stunning beaches and clearest waters. The Costa Smeralda is a billionaire's playground with stratospheric prices, but the rest of the island offers good value. The interior is wild and traditional, with distinct Sardinian culture and language. Island life means slower pace but also isolation.",
        "highlights": [
            "World-class beaches and sea",
            "Distinct Sardinian culture",
            "Costa Smeralda glamour",
            "Nuragic archaeological sites",
            "Wild, unspoiled interior",
        ],
        "popular_areas": ["Costa Smeralda", "Alghero", "Cagliari", "Olbia", "Oristano"],
        "considerations": [
            "Expensive in coastal hotspots",
            "Island isolation",
            "Limited winter tourism",
            "Car essential",
        ],
    },
}


def get_all_regions():
    """Return all regions as a list."""
    return list(REGIONS.values())


def get_region_by_id(region_id: str):
    """Get a single region by its ID."""
    return REGIONS.get(region_id.lower())


def get_regions_by_ids(region_ids: list[str]):
    """Get multiple regions by their IDs."""
    return [REGIONS.get(rid.lower()) for rid in region_ids if rid.lower() in REGIONS]


def get_region_summaries():
    """Return summary data for all regions (for dashboard/list view)."""
    summaries = []
    for region in REGIONS.values():
        summaries.append({
            "id": region["id"],
            "name_en": region["name_en"],
            "name_it": region["name_it"],
            "capital": region["capital"],
            "avg_price_sqm": region["market"]["avg_price_sqm"],
            "price_trend_yoy": region["market"]["price_trend_yoy"],
            "expat_community_size": region["lifestyle"]["expat_community_size"],
            "climate_type": region["climate"]["climate_type"],
        })
    return summaries


def get_market_summary():
    """Get national market overview with rankings."""
    regions = list(REGIONS.values())

    # Calculate averages
    prices = [r["market"]["avg_price_sqm"] for r in regions]
    trends = [r["market"]["price_trend_yoy"] for r in regions]

    # Sort for rankings
    by_price_asc = sorted(regions, key=lambda r: r["market"]["avg_price_sqm"])
    by_price_desc = sorted(regions, key=lambda r: r["market"]["avg_price_sqm"], reverse=True)
    by_trend_desc = sorted(regions, key=lambda r: r["market"]["price_trend_yoy"], reverse=True)

    return {
        "national_avg_price_sqm": sum(prices) / len(prices),
        "national_avg_trend_yoy": sum(trends) / len(trends),
        "total_regions": len(regions),
        "cheapest_regions": [
            {"id": r["id"], "name_en": r["name_en"], "avg_price_sqm": r["market"]["avg_price_sqm"]}
            for r in by_price_asc[:5]
        ],
        "most_expensive_regions": [
            {"id": r["id"], "name_en": r["name_en"], "avg_price_sqm": r["market"]["avg_price_sqm"]}
            for r in by_price_desc[:5]
        ],
        "fastest_growing_regions": [
            {"id": r["id"], "name_en": r["name_en"], "price_trend_yoy": r["market"]["price_trend_yoy"]}
            for r in by_trend_desc[:5]
        ],
    }
