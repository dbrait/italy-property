/**
 * Region Detail Page - JavaScript
 * Loads and displays full region data
 */

// DOM Elements
const loadingIndicator = document.getElementById('loading-indicator');
const regionDetails = document.getElementById('region-details');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadRegionData();
});

// Load region data from API
async function loadRegionData() {
    try {
        const response = await fetch(`/api/regions/${regionId}`);

        if (!response.ok) {
            if (response.status === 404) {
                showError('Region not found');
            } else {
                throw new Error('Failed to load region data');
            }
            return;
        }

        const region = await response.json();
        renderRegion(region);
    } catch (error) {
        console.error('Error loading region:', error);
        showError('Failed to load region data. Please try again.');
    }
}

// Show error message
function showError(message) {
    loadingIndicator.innerHTML = `<div class="error-message">${message}</div>`;
}

// Render region data
function renderRegion(region) {
    loadingIndicator.style.display = 'none';
    regionDetails.style.display = 'block';

    // Header
    document.getElementById('region-name').textContent = region.name_en;
    document.getElementById('region-subtitle').textContent =
        `${region.name_it} | Capital: ${region.capital}`;
    document.title = `${region.name_en} - Italy Property Guide`;

    // Update header background based on price tier
    const header = document.getElementById('region-header');
    if (region.market.avg_price_sqm < 1500) {
        header.classList.add('price-tier-low');
    } else if (region.market.avg_price_sqm > 2500) {
        header.classList.add('price-tier-high');
    }

    // Quick Stats
    document.getElementById('stat-price').textContent = `€${region.market.avg_price_sqm.toLocaleString()}`;
    document.getElementById('stat-trend').textContent =
        `${region.market.price_trend_yoy >= 0 ? '+' : ''}${region.market.price_trend_yoy.toFixed(1)}%`;
    document.getElementById('stat-days').textContent = region.market.avg_days_on_market;
    document.getElementById('stat-expat').textContent = capitalizeFirst(region.lifestyle.expat_community_size);

    // Description
    document.getElementById('region-description').textContent = region.description;

    // Highlights
    const highlightsList = document.getElementById('region-highlights');
    highlightsList.innerHTML = region.highlights.map(h => `<li>${h}</li>`).join('');

    // Considerations
    const considerationsList = document.getElementById('region-considerations');
    considerationsList.innerHTML = region.considerations.map(c => `<li>${c}</li>`).join('');

    // Market Data
    document.getElementById('market-price').textContent = `€${region.market.avg_price_sqm.toLocaleString()}/sqm`;
    document.getElementById('market-trend').textContent =
        `${region.market.price_trend_yoy >= 0 ? '+' : ''}${region.market.price_trend_yoy.toFixed(1)}%`;
    document.getElementById('market-days').textContent = `${region.market.avg_days_on_market} days`;
    document.getElementById('market-listings').textContent = `~${region.market.listings_count.toLocaleString()}`;

    // Climate Data
    document.getElementById('climate-type').textContent = region.climate.climate_type;
    document.getElementById('climate-summer').textContent = `${region.climate.avg_summer_temp_c}°C avg`;
    document.getElementById('climate-winter').textContent = `${region.climate.avg_winter_temp_c}°C avg`;
    document.getElementById('climate-rain').textContent = `${region.climate.annual_rainfall_mm}mm`;
    document.getElementById('climate-sun').textContent = `${region.climate.sunshine_hours_year} hrs`;

    // Lifestyle Data
    document.getElementById('life-expat').textContent = capitalizeFirst(region.lifestyle.expat_community_size);
    document.getElementById('life-health').textContent = `${region.lifestyle.healthcare_rating}/10`;
    document.getElementById('life-english').textContent = capitalizeFirst(region.lifestyle.english_proficiency.replace('_', ' '));
    document.getElementById('life-schools').textContent = region.lifestyle.international_schools;
    document.getElementById('life-cost').textContent = `${region.lifestyle.cost_of_living_index}/100`;

    // Popular Areas
    const areasList = document.getElementById('popular-areas');
    areasList.innerHTML = region.popular_areas.map(area =>
        `<li>${area}</li>`
    ).join('');

    // Update calculator link with price hint
    const calcLink = document.getElementById('calculator-link');
    calcLink.href = `/?price=${region.market.avg_price_sqm * 100}&region=${region.id}`;
}

// Utility
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
