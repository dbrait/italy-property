/**
 * Region Comparison Page - JavaScript
 * Handles region selection, comparison API calls, and table rendering
 */

// State
let allRegions = [];
let comparisonData = null;

// DOM Elements
const selectionSection = document.getElementById('selection-section');
const loadingIndicator = document.getElementById('loading-indicator');
const errorMessage = document.getElementById('error-message');
const comparisonResults = document.getElementById('comparison-results');
const compareBtn = document.getElementById('compare-btn');
const tableHeader = document.getElementById('table-header');
const tableBody = document.getElementById('table-body');
const comparisonActions = document.getElementById('comparison-actions');
const compareSubtitle = document.getElementById('compare-subtitle');

// Metrics configuration
const METRICS = [
    { key: 'market.avg_price_sqm', label: 'Average Price/sqm', format: 'currency', better: 'lower' },
    { key: 'market.price_trend_yoy', label: 'YoY Price Trend', format: 'percent', better: 'context' },
    { key: 'market.avg_days_on_market', label: 'Days on Market', format: 'number', better: 'lower' },
    { key: 'market.listings_count', label: 'Active Listings', format: 'number', better: 'higher' },
    { key: 'climate.climate_type', label: 'Climate Type', format: 'text', better: null },
    { key: 'climate.avg_summer_temp_c', label: 'Summer Temp', format: 'temp', better: null },
    { key: 'climate.avg_winter_temp_c', label: 'Winter Temp', format: 'temp', better: null },
    { key: 'climate.sunshine_hours_year', label: 'Sunshine Hours/Year', format: 'number', better: 'higher' },
    { key: 'lifestyle.expat_community_size', label: 'Expat Community', format: 'expat', better: 'higher' },
    { key: 'lifestyle.healthcare_rating', label: 'Healthcare Rating', format: 'rating', better: 'higher' },
    { key: 'lifestyle.english_proficiency', label: 'English Proficiency', format: 'proficiency', better: 'higher' },
    { key: 'lifestyle.international_schools', label: 'International Schools', format: 'number', better: 'higher' },
    { key: 'lifestyle.cost_of_living_index', label: 'Cost of Living Index', format: 'number', better: 'lower' },
];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadAllRegions();
    setupEventListeners();
    checkUrlParams();
});

// Load all regions for dropdowns
async function loadAllRegions() {
    try {
        const response = await fetch('/api/regions');
        if (!response.ok) throw new Error('Failed to load regions');
        allRegions = await response.json();
        populateDropdowns();
    } catch (error) {
        console.error('Error loading regions:', error);
        showError('Failed to load regions. Please refresh the page.');
    }
}

// Populate dropdown selects
function populateDropdowns() {
    const selects = document.querySelectorAll('.region-select');
    const options = allRegions
        .sort((a, b) => a.name_en.localeCompare(b.name_en))
        .map(r => `<option value="${r.id}">${r.name_en}</option>`)
        .join('');

    selects.forEach(select => {
        select.innerHTML = '<option value="">Select a region...</option>' + options;
    });
}

// Check URL params for pre-selected regions
function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const regionsParam = params.get('regions');

    if (regionsParam) {
        const ids = regionsParam.split(',').filter(id => id.trim());
        const selects = document.querySelectorAll('.region-select');

        ids.forEach((id, index) => {
            if (selects[index]) {
                selects[index].value = id.trim();
            }
        });

        // Auto-run comparison if we have valid selections
        if (ids.length >= 2) {
            runComparison();
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    compareBtn.addEventListener('click', runComparison);

    // Update URL when selections change
    document.querySelectorAll('.region-select').forEach(select => {
        select.addEventListener('change', updateUrl);
    });
}

// Update URL with current selections
function updateUrl() {
    const ids = getSelectedRegionIds();
    if (ids.length > 0) {
        const url = new URL(window.location);
        url.searchParams.set('regions', ids.join(','));
        window.history.replaceState({}, '', url);
    }
}

// Get selected region IDs
function getSelectedRegionIds() {
    const selects = document.querySelectorAll('.region-select');
    return Array.from(selects)
        .map(s => s.value)
        .filter(v => v);
}

// Run comparison
async function runComparison() {
    const ids = getSelectedRegionIds();

    if (ids.length < 2) {
        showError('Please select at least 2 regions to compare.');
        return;
    }

    hideError();
    loadingIndicator.style.display = 'block';
    comparisonResults.style.display = 'none';

    try {
        const response = await fetch(`/api/regions/compare?regions=${ids.join(',')}`);

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || 'Failed to compare regions');
        }

        comparisonData = await response.json();
        renderComparison();
    } catch (error) {
        console.error('Error comparing regions:', error);
        showError(error.message);
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// Render comparison table
function renderComparison() {
    const regions = comparisonData.regions;

    // Update subtitle
    const names = regions.map(r => r.name_en).join(' vs ');
    compareSubtitle.textContent = names;

    // Build header
    tableHeader.innerHTML = '<th class="metric-column">Metric</th>' +
        regions.map(r => `<th class="region-column">${r.name_en}</th>`).join('');

    // Build body
    tableBody.innerHTML = METRICS.map(metric => {
        const values = regions.map(r => getNestedValue(r, metric.key));
        const { bestIndex, worstIndex } = findBestWorst(values, metric.better, metric.format);

        return `
            <tr>
                <td class="metric-label">${metric.label}</td>
                ${regions.map((r, i) => {
                    const value = values[i];
                    const formatted = formatValue(value, metric.format);
                    let classes = 'metric-value';
                    if (i === bestIndex) classes += ' best-value';
                    if (i === worstIndex) classes += ' worst-value';
                    return `<td class="${classes}">${formatted}</td>`;
                }).join('')}
            </tr>
        `;
    }).join('');

    // Build action links
    comparisonActions.innerHTML = regions.map(r =>
        `<a href="/regions/${r.id}" class="btn-secondary">View ${r.name_en} Details</a>`
    ).join('');

    comparisonResults.style.display = 'block';
}

// Get nested value from object (e.g., "market.avg_price_sqm")
function getNestedValue(obj, path) {
    return path.split('.').reduce((o, k) => (o || {})[k], obj);
}

// Format value based on type
function formatValue(value, format) {
    if (value === null || value === undefined) return '-';

    switch (format) {
        case 'currency':
            return `€${value.toLocaleString()}`;
        case 'percent':
            return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
        case 'number':
            return value.toLocaleString();
        case 'temp':
            return `${value}°C`;
        case 'rating':
            return `${value}/10`;
        case 'expat':
            return capitalizeFirst(value);
        case 'proficiency':
            return capitalizeFirst(value.replace('_', ' '));
        case 'text':
        default:
            return value;
    }
}

// Find best and worst values
function findBestWorst(values, better, format) {
    if (!better) return { bestIndex: -1, worstIndex: -1 };

    // Convert text values to comparable numbers for some formats
    const numericValues = values.map(v => {
        if (format === 'expat') {
            const order = { tiny: 0, small: 1, medium: 2, large: 3 };
            return order[v] !== undefined ? order[v] : -1;
        }
        if (format === 'proficiency') {
            const order = { very_low: 0, low: 1, moderate: 2, high: 3 };
            return order[v] !== undefined ? order[v] : -1;
        }
        return typeof v === 'number' ? v : null;
    });

    const validValues = numericValues.filter(v => v !== null && v !== -1);
    if (validValues.length === 0) return { bestIndex: -1, worstIndex: -1 };

    let bestIndex = -1;
    let worstIndex = -1;

    if (better === 'lower') {
        const min = Math.min(...validValues);
        const max = Math.max(...validValues);
        bestIndex = numericValues.indexOf(min);
        worstIndex = numericValues.indexOf(max);
    } else if (better === 'higher') {
        const max = Math.max(...validValues);
        const min = Math.min(...validValues);
        bestIndex = numericValues.indexOf(max);
        worstIndex = numericValues.indexOf(min);
    }

    // Don't show worst if all values are the same
    if (bestIndex === worstIndex) {
        worstIndex = -1;
    }

    return { bestIndex, worstIndex };
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Hide error message
function hideError() {
    errorMessage.style.display = 'none';
}

// Utility
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
