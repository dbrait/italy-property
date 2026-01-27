/**
 * Professional Finder - Main JavaScript
 * Handles category display, filtering, and professional cards
 */

// State
let categories = [];
let regions = [];
let professionals = [];
let currentFilters = {
    category: '',
    region: '',
    verified: false,
    featured: false,
};

// DOM Elements
const categoryLinksEl = document.getElementById('category-links');
const professionalsGrid = document.getElementById('professionals-grid');
const loadingIndicator = document.getElementById('loading-indicator');
const noResults = document.getElementById('no-results');
const resultsCount = document.getElementById('results-count');
const clearFiltersBtn = document.getElementById('clear-filters');
const clearFiltersLink = document.getElementById('clear-filters-link');
const categoryInfo = document.getElementById('category-info');

// Filter elements
const filterCategory = document.getElementById('filter-category');
const filterRegion = document.getElementById('filter-region');
const filterVerified = document.getElementById('filter-verified');
const filterFeatured = document.getElementById('filter-featured');

// Region name mapping
const REGION_NAMES = {
    'piemonte': 'Piedmont',
    'valle_daosta': 'Aosta Valley',
    'lombardia': 'Lombardy',
    'trentino_alto_adige': 'Trentino-Alto Adige',
    'veneto': 'Veneto',
    'friuli_venezia_giulia': 'Friuli Venezia Giulia',
    'liguria': 'Liguria',
    'emilia_romagna': 'Emilia-Romagna',
    'toscana': 'Tuscany',
    'umbria': 'Umbria',
    'marche': 'Marche',
    'lazio': 'Lazio',
    'abruzzo': 'Abruzzo',
    'molise': 'Molise',
    'campania': 'Campania',
    'puglia': 'Puglia',
    'basilicata': 'Basilicata',
    'calabria': 'Calabria',
    'sicilia': 'Sicily',
    'sardegna': 'Sardinia',
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadCategories(),
        loadRegions(),
    ]);
    setupEventListeners();
    checkUrlParams();
    await loadProfessionals();
});

// Load categories from API
async function loadCategories() {
    try {
        const response = await fetch('/api/professionals/categories');
        if (!response.ok) throw new Error('Failed to load categories');
        categories = await response.json();
        renderCategoryLinks();
        populateCategoryFilter();
    } catch (error) {
        console.error('Error loading categories:', error);
        categoryLinksEl.innerHTML = '<p class="error">Failed to load categories</p>';
    }
}

// Load regions from API
async function loadRegions() {
    try {
        const response = await fetch('/api/professionals/regions');
        if (!response.ok) throw new Error('Failed to load regions');
        const data = await response.json();
        regions = data.regions;
        populateRegionFilter();
    } catch (error) {
        console.error('Error loading regions:', error);
    }
}

// Load professionals from API
async function loadProfessionals() {
    loadingIndicator.style.display = 'block';
    professionalsGrid.innerHTML = '';
    noResults.style.display = 'none';

    try {
        const params = new URLSearchParams();
        if (currentFilters.category) params.append('category', currentFilters.category);
        if (currentFilters.region) params.append('region', currentFilters.region);
        if (currentFilters.verified) params.append('verified', 'true');
        if (currentFilters.featured) params.append('featured', 'true');

        const response = await fetch(`/api/professionals?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to load professionals');

        const data = await response.json();
        professionals = data.professionals;

        renderProfessionals();
        updateResultsCount(data.total);
        updateCategoryInfo();

    } catch (error) {
        console.error('Error loading professionals:', error);
        professionalsGrid.innerHTML = '<p class="error">Failed to load professionals. Please try again.</p>';
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// Render category quick links
function renderCategoryLinks() {
    categoryLinksEl.innerHTML = categories.map(cat => `
        <button class="category-link ${currentFilters.category === cat.id ? 'active' : ''}"
                data-category="${cat.id}">
            <span class="category-icon">${getCategoryIcon(cat.icon)}</span>
            <span class="category-name">${cat.plural_en}</span>
        </button>
    `).join('');

    // Add click handlers
    categoryLinksEl.querySelectorAll('.category-link').forEach(btn => {
        btn.addEventListener('click', () => {
            const catId = btn.dataset.category;
            if (currentFilters.category === catId) {
                currentFilters.category = '';
            } else {
                currentFilters.category = catId;
            }
            filterCategory.value = currentFilters.category;
            updateUrl();
            loadProfessionals();
            updateCategoryLinkStyles();
        });
    });
}

// Update category link active styles
function updateCategoryLinkStyles() {
    categoryLinksEl.querySelectorAll('.category-link').forEach(btn => {
        if (btn.dataset.category === currentFilters.category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Populate category filter dropdown
function populateCategoryFilter() {
    filterCategory.innerHTML = '<option value="">All Categories</option>' +
        categories.map(cat => `<option value="${cat.id}">${cat.plural_en}</option>`).join('');
}

// Populate region filter dropdown
function populateRegionFilter() {
    filterRegion.innerHTML = '<option value="">All Regions</option>' +
        regions.map(r => `<option value="${r}">${REGION_NAMES[r] || r}</option>`).join('');
}

// Render professionals
function renderProfessionals() {
    if (professionals.length === 0) {
        professionalsGrid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    professionalsGrid.innerHTML = professionals.map(prof => {
        const category = categories.find(c => c.id === prof.category);
        const categoryName = category ? category.name_en : prof.category;

        const regionDisplay = prof.regions.includes('all')
            ? 'All Italy'
            : prof.regions.slice(0, 2).map(r => REGION_NAMES[r] || r).join(', ') +
              (prof.regions.length > 2 ? ` +${prof.regions.length - 2}` : '');

        return `
            <article class="professional-card ${prof.featured ? 'featured' : ''}" data-id="${prof.id}">
                <div class="card-badges">
                    ${prof.featured ? '<span class="badge badge-featured">Featured</span>' : ''}
                    ${prof.verified ? '<span class="badge badge-verified">Verified</span>' : ''}
                </div>
                <div class="card-category">${categoryName}</div>
                <h3 class="card-name">${prof.name}</h3>
                ${prof.contact_person ? `<div class="card-contact-person">${prof.contact_person}</div>` : ''}
                <div class="card-regions">
                    <span class="region-icon">&#x1F4CD;</span> ${regionDisplay}
                </div>
                <div class="card-languages">
                    ${prof.languages.map(l => `<span class="language-tag">${l}</span>`).join('')}
                </div>
                <p class="card-description">${truncate(prof.description, 120)}</p>
                <div class="card-highlights">
                    ${prof.highlights.slice(0, 2).map(h => `<span class="highlight-tag">${h}</span>`).join('')}
                </div>
                <div class="card-actions">
                    <a href="/professionals/${prof.id}" class="btn-view-profile">View Profile</a>
                    ${prof.website ? `<a href="${prof.website}" target="_blank" class="btn-website" rel="noopener">Website</a>` : ''}
                </div>
            </article>
        `;
    }).join('');
}

// Update results count
function updateResultsCount(total) {
    const filterActive = currentFilters.category || currentFilters.region ||
                         currentFilters.verified || currentFilters.featured;

    resultsCount.textContent = `${total} professional${total !== 1 ? 's' : ''} found`;
    clearFiltersBtn.style.display = filterActive ? 'inline-block' : 'none';
}

// Update category info section
function updateCategoryInfo() {
    if (!currentFilters.category) {
        categoryInfo.style.display = 'none';
        return;
    }

    const category = categories.find(c => c.id === currentFilters.category);
    if (!category) {
        categoryInfo.style.display = 'none';
        return;
    }

    document.getElementById('category-info-title').textContent = `About ${category.plural_en}`;
    document.getElementById('category-info-description').textContent = category.description;
    document.getElementById('category-info-why').textContent = category.why_needed;
    document.getElementById('category-info-fees').textContent = category.typical_fees;
    categoryInfo.style.display = 'block';
}

// Setup event listeners
function setupEventListeners() {
    filterCategory.addEventListener('change', () => {
        currentFilters.category = filterCategory.value;
        updateUrl();
        updateCategoryLinkStyles();
        loadProfessionals();
    });

    filterRegion.addEventListener('change', () => {
        currentFilters.region = filterRegion.value;
        updateUrl();
        loadProfessionals();
    });

    filterVerified.addEventListener('change', () => {
        currentFilters.verified = filterVerified.checked;
        updateUrl();
        loadProfessionals();
    });

    filterFeatured.addEventListener('change', () => {
        currentFilters.featured = filterFeatured.checked;
        updateUrl();
        loadProfessionals();
    });

    clearFiltersBtn.addEventListener('click', clearAllFilters);
    clearFiltersLink.addEventListener('click', clearAllFilters);
}

// Clear all filters
function clearAllFilters() {
    currentFilters = {
        category: '',
        region: '',
        verified: false,
        featured: false,
    };

    filterCategory.value = '';
    filterRegion.value = '';
    filterVerified.checked = false;
    filterFeatured.checked = false;

    updateUrl();
    updateCategoryLinkStyles();
    loadProfessionals();
}

// Check URL params for initial filters
function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);

    if (params.get('category')) {
        currentFilters.category = params.get('category');
        filterCategory.value = currentFilters.category;
    }

    if (params.get('region')) {
        currentFilters.region = params.get('region');
        filterRegion.value = currentFilters.region;
    }

    if (params.get('verified') === 'true') {
        currentFilters.verified = true;
        filterVerified.checked = true;
    }

    if (params.get('featured') === 'true') {
        currentFilters.featured = true;
        filterFeatured.checked = true;
    }

    updateCategoryLinkStyles();
}

// Update URL with current filters
function updateUrl() {
    const params = new URLSearchParams();

    if (currentFilters.category) params.set('category', currentFilters.category);
    if (currentFilters.region) params.set('region', currentFilters.region);
    if (currentFilters.verified) params.set('verified', 'true');
    if (currentFilters.featured) params.set('featured', 'true');

    const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;

    window.history.replaceState({}, '', newUrl);
}

// Get icon for category
function getCategoryIcon(iconName) {
    const icons = {
        'scales': '&#x2696;&#xFE0F;',      // Scales (lawyer)
        'stamp': '&#x1F4DC;',               // Scroll (notary)
        'ruler': '&#x1F4D0;',               // Triangular ruler (geometra)
        'drafting-compass': '&#x1F3D7;&#xFE0F;', // Building construction (architect)
        'home': '&#x1F3E0;',                // House (real estate)
        'calculator': '&#x1F4B0;',          // Money bag (accountant)
        'key': '&#x1F511;',                 // Key (property manager)
        'hard-hat': '&#x1F477;',            // Construction worker (contractor)
    };
    return icons[iconName] || '&#x1F464;';
}

// Truncate text
function truncate(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}
