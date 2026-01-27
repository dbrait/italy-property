/**
 * Italian Regional Dashboard - Main JavaScript
 * Handles map interactions, region cards, filtering, and comparison selection
 */

// State
let regions = [];
let selectedRegions = new Set();
let currentSort = 'name';
let filterExpat = 'all';
let filterClimate = 'all';

// DOM Elements
const regionCards = document.getElementById('region-cards');
const loadingIndicator = document.getElementById('loading-indicator');
const mapTooltip = document.getElementById('map-tooltip');
const compareBar = document.getElementById('compare-bar');
const compareCount = document.getElementById('compare-count');
const compareBtn = document.getElementById('compare-btn');
const clearCompareBtn = document.getElementById('clear-compare-btn');
const sortSelect = document.getElementById('sort-by');
const expatFilter = document.getElementById('filter-expat');
const climateFilter = document.getElementById('filter-climate');
const marketSummary = document.getElementById('market-summary');

// Price thresholds for color coding
const PRICE_LOW = 1500;
const PRICE_HIGH = 2500;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadRegions();
    await loadMarketSummary();
    setupEventListeners();
    setupMapInteractions();
});

// Load regions from API
async function loadRegions() {
    try {
        const response = await fetch('/api/regions');
        if (!response.ok) throw new Error('Failed to load regions');
        regions = await response.json();
        renderRegionCards();
        colorMapRegions();
    } catch (error) {
        console.error('Error loading regions:', error);
        regionCards.innerHTML = '<div class="error-message">Failed to load regions. Please refresh the page.</div>';
    }
}

// Load market summary
async function loadMarketSummary() {
    try {
        const response = await fetch('/api/regions/market-summary');
        if (!response.ok) throw new Error('Failed to load market summary');
        const data = await response.json();
        renderMarketSummary(data);
        marketSummary.style.display = 'block';
    } catch (error) {
        console.error('Error loading market summary:', error);
    }
}

// Render market summary section
function renderMarketSummary(data) {
    document.getElementById('avg-price').textContent = `€${Math.round(data.national_avg_price_sqm).toLocaleString()}`;
    document.getElementById('avg-trend').textContent = `${data.national_avg_trend_yoy > 0 ? '+' : ''}${data.national_avg_trend_yoy.toFixed(1)}%`;

    const cheapestList = document.getElementById('cheapest-list');
    cheapestList.innerHTML = data.cheapest_regions.map(r =>
        `<li><a href="/regions/${r.id}">${r.name_en}</a> <span class="rank-value">€${r.avg_price_sqm.toLocaleString()}</span></li>`
    ).join('');

    const expensiveList = document.getElementById('expensive-list');
    expensiveList.innerHTML = data.most_expensive_regions.map(r =>
        `<li><a href="/regions/${r.id}">${r.name_en}</a> <span class="rank-value">€${r.avg_price_sqm.toLocaleString()}</span></li>`
    ).join('');

    const growingList = document.getElementById('growing-list');
    growingList.innerHTML = data.fastest_growing_regions.map(r =>
        `<li><a href="/regions/${r.id}">${r.name_en}</a> <span class="rank-value">+${r.price_trend_yoy.toFixed(1)}%</span></li>`
    ).join('');
}

// Render region cards
function renderRegionCards() {
    loadingIndicator.style.display = 'none';

    let filtered = [...regions];

    // Apply filters
    if (filterExpat !== 'all') {
        filtered = filtered.filter(r => r.expat_community_size === filterExpat);
    }
    if (filterClimate !== 'all') {
        filtered = filtered.filter(r => r.climate_type.includes(filterClimate));
    }

    // Apply sort
    switch (currentSort) {
        case 'name':
            filtered.sort((a, b) => a.name_en.localeCompare(b.name_en));
            break;
        case 'price-low':
            filtered.sort((a, b) => a.avg_price_sqm - b.avg_price_sqm);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.avg_price_sqm - a.avg_price_sqm);
            break;
        case 'trend':
            filtered.sort((a, b) => b.price_trend_yoy - a.price_trend_yoy);
            break;
    }

    regionCards.innerHTML = filtered.map(region => `
        <div class="region-card ${selectedRegions.has(region.id) ? 'selected' : ''}"
             data-region="${region.id}">
            <div class="card-header">
                <h3 class="card-title">${region.name_en}</h3>
                <span class="card-capital">${region.capital}</span>
            </div>
            <div class="card-stats">
                <div class="card-price">€${region.avg_price_sqm.toLocaleString()}/sqm</div>
                <div class="card-trend ${region.price_trend_yoy >= 0 ? 'trend-up' : 'trend-down'}">
                    ${region.price_trend_yoy >= 0 ? '↑' : '↓'} ${Math.abs(region.price_trend_yoy).toFixed(1)}%
                </div>
            </div>
            <div class="card-meta">
                <span class="meta-expat" title="Expat community size">${capitalizeFirst(region.expat_community_size)}</span>
                <span class="meta-climate">${region.climate_type}</span>
            </div>
            <div class="card-actions">
                <button class="btn-select ${selectedRegions.has(region.id) ? 'selected' : ''}"
                        onclick="toggleSelection('${region.id}', event)">
                    ${selectedRegions.has(region.id) ? 'Selected' : 'Compare'}
                </button>
                <a href="/regions/${region.id}" class="btn-details">Details</a>
            </div>
        </div>
    `).join('');

    if (filtered.length === 0) {
        regionCards.innerHTML = '<div class="no-results">No regions match your filters.</div>';
    }

    // Add click handlers for cards
    document.querySelectorAll('.region-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.card-actions')) {
                window.location.href = `/regions/${card.dataset.region}`;
            }
        });
    });
}

// Color map regions based on price
function colorMapRegions() {
    document.querySelectorAll('.region-path').forEach(path => {
        const regionId = path.dataset.region;
        const region = regions.find(r => r.id === regionId);

        if (region) {
            path.classList.remove('price-low', 'price-mid', 'price-high');
            if (region.avg_price_sqm < PRICE_LOW) {
                path.classList.add('price-low');
            } else if (region.avg_price_sqm > PRICE_HIGH) {
                path.classList.add('price-high');
            } else {
                path.classList.add('price-mid');
            }
        }
    });
}

// Setup map interactions
function setupMapInteractions() {
    document.querySelectorAll('.region-path').forEach(path => {
        // Hover
        path.addEventListener('mouseenter', (e) => {
            const regionId = path.dataset.region;
            const region = regions.find(r => r.id === regionId);
            if (region) {
                showTooltip(e, region);
            }
            path.classList.add('hover');
        });

        path.addEventListener('mousemove', (e) => {
            moveTooltip(e);
        });

        path.addEventListener('mouseleave', () => {
            hideTooltip();
            path.classList.remove('hover');
        });

        // Click
        path.addEventListener('click', () => {
            const regionId = path.dataset.region;
            window.location.href = `/regions/${regionId}`;
        });
    });
}

// Tooltip functions
function showTooltip(e, region) {
    mapTooltip.querySelector('.tooltip-name').textContent = region.name_en;
    mapTooltip.querySelector('.tooltip-price').textContent = `€${region.avg_price_sqm.toLocaleString()}/sqm`;
    mapTooltip.querySelector('.tooltip-trend').textContent =
        `${region.price_trend_yoy >= 0 ? '↑' : '↓'} ${Math.abs(region.price_trend_yoy).toFixed(1)}% YoY`;
    mapTooltip.style.display = 'block';
    moveTooltip(e);
}

function moveTooltip(e) {
    const mapContainer = document.getElementById('italy-map');
    const rect = mapContainer.getBoundingClientRect();
    const x = e.clientX - rect.left + 10;
    const y = e.clientY - rect.top - 10;
    mapTooltip.style.left = `${x}px`;
    mapTooltip.style.top = `${y}px`;
}

function hideTooltip() {
    mapTooltip.style.display = 'none';
}

// Selection for comparison
function toggleSelection(regionId, event) {
    event.stopPropagation();

    if (selectedRegions.has(regionId)) {
        selectedRegions.delete(regionId);
    } else if (selectedRegions.size < 4) {
        selectedRegions.add(regionId);
    } else {
        alert('You can compare up to 4 regions at a time.');
        return;
    }

    updateCompareBar();
    renderRegionCards();
    updateMapSelection();
}

function updateCompareBar() {
    const count = selectedRegions.size;
    compareCount.textContent = count;

    if (count > 0) {
        compareBar.style.display = 'flex';
        compareBtn.disabled = count < 2;
    } else {
        compareBar.style.display = 'none';
    }
}

function updateMapSelection() {
    document.querySelectorAll('.region-path').forEach(path => {
        const regionId = path.dataset.region;
        if (selectedRegions.has(regionId)) {
            path.classList.add('selected');
        } else {
            path.classList.remove('selected');
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Sort
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderRegionCards();
    });

    // Filters
    expatFilter.addEventListener('change', (e) => {
        filterExpat = e.target.value;
        renderRegionCards();
    });

    climateFilter.addEventListener('change', (e) => {
        filterClimate = e.target.value;
        renderRegionCards();
    });

    // Compare button
    compareBtn.addEventListener('click', () => {
        if (selectedRegions.size >= 2) {
            const ids = Array.from(selectedRegions).join(',');
            window.location.href = `/regions/compare?regions=${ids}`;
        }
    });

    // Clear comparison
    clearCompareBtn.addEventListener('click', () => {
        selectedRegions.clear();
        updateCompareBar();
        renderRegionCards();
        updateMapSelection();
    });

    // Check URL for pre-selected regions
    const urlParams = new URLSearchParams(window.location.search);
    const preselected = urlParams.get('selected');
    if (preselected) {
        preselected.split(',').forEach(id => {
            if (id && regions.some(r => r.id === id)) {
                selectedRegions.add(id);
            }
        });
        updateCompareBar();
        updateMapSelection();
    }
}

// Utility
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Make toggleSelection available globally
window.toggleSelection = toggleSelection;
