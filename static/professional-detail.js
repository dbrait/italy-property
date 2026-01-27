/**
 * Professional Detail Page - JavaScript
 * Loads and displays full professional profile
 */

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
    'all': 'All Italy',
};

// DOM Elements
const loadingIndicator = document.getElementById('loading-indicator');
const professionalDetails = document.getElementById('professional-details');
const headerBadges = document.getElementById('header-badges');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadProfessionalData();
});

// Load professional data from API
async function loadProfessionalData() {
    try {
        // Load professional and categories in parallel
        const [profResponse, catResponse] = await Promise.all([
            fetch(`/api/professionals/${professionalId}`),
            fetch('/api/professionals/categories')
        ]);

        if (!profResponse.ok) {
            if (profResponse.status === 404) {
                showError('Professional not found');
            } else {
                throw new Error('Failed to load professional data');
            }
            return;
        }

        const professional = await profResponse.json();
        const categories = await catResponse.json();

        renderProfessional(professional, categories);
    } catch (error) {
        console.error('Error loading professional:', error);
        showError('Failed to load professional data. Please try again.');
    }
}

// Show error message
function showError(message) {
    loadingIndicator.innerHTML = `<div class="error-message">${message}</div>`;
}

// Render professional data
function renderProfessional(prof, categories) {
    loadingIndicator.style.display = 'none';
    professionalDetails.style.display = 'block';

    // Find category info
    const category = categories.find(c => c.id === prof.category);

    // Header
    document.getElementById('professional-name').textContent = prof.name;
    document.getElementById('professional-category').textContent = category
        ? `${category.name_en} (${category.name_it})`
        : prof.category;
    document.title = `${prof.name} - Italy Property Tools`;

    // Header badges
    headerBadges.innerHTML = `
        ${prof.featured ? '<span class="badge badge-featured">Featured</span>' : ''}
        ${prof.verified ? '<span class="badge badge-verified">Verified</span>' : ''}
    `;

    // Quick info cards
    const regionsDisplay = prof.regions.includes('all')
        ? 'All Italy'
        : prof.regions.map(r => REGION_NAMES[r] || r).join(', ');
    document.getElementById('regions-value').textContent = regionsDisplay;
    document.getElementById('languages-value').textContent = prof.languages.join(', ');

    // Contact quick info
    if (prof.contact_person) {
        document.getElementById('contact-value').textContent = prof.contact_person;
    } else if (prof.website) {
        document.getElementById('contact-value').innerHTML = '<a href="' + prof.website + '" target="_blank">Website</a>';
    } else {
        document.getElementById('info-contact').style.display = 'none';
    }

    // Description
    document.getElementById('professional-description').textContent = prof.description;

    // Services
    const servicesList = document.getElementById('professional-services');
    servicesList.innerHTML = prof.services.map(s => `<li>${s}</li>`).join('');

    // Highlights
    const highlightsList = document.getElementById('professional-highlights');
    highlightsList.innerHTML = prof.highlights.map(h => `<li>${h}</li>`).join('');

    // Contact details
    const contactDetails = document.getElementById('contact-details');
    let contactHtml = '';

    if (prof.contact_person) {
        contactHtml += `<div class="contact-item"><strong>Contact:</strong> ${prof.contact_person}</div>`;
    }

    if (prof.website) {
        contactHtml += `<div class="contact-item"><strong>Website:</strong> <a href="${prof.website}" target="_blank" rel="noopener">${prof.website}</a></div>`;
        document.getElementById('website-btn').style.display = 'inline-block';
        document.getElementById('website-btn').href = prof.website;
    }

    if (prof.email) {
        contactHtml += `<div class="contact-item"><strong>Email:</strong> <a href="mailto:${prof.email}">${prof.email}</a></div>`;
    }

    if (prof.phone) {
        contactHtml += `<div class="contact-item"><strong>Phone:</strong> <a href="tel:${prof.phone}">${prof.phone}</a></div>`;
    }

    if (prof.cities && prof.cities.length > 0) {
        contactHtml += `<div class="contact-item"><strong>Cities:</strong> ${prof.cities.join(', ')}</div>`;
    }

    if (prof.source) {
        contactHtml += `<div class="contact-item source"><strong>Source:</strong> ${prof.source}</div>`;
    }

    contactDetails.innerHTML = contactHtml || '<p>Contact information not available. Please visit their website for details.</p>';

    // Category info
    if (category) {
        document.getElementById('category-section-title').textContent = `About ${category.plural_en}`;
        document.getElementById('category-description').textContent = category.description;
        document.getElementById('category-why').textContent = category.why_needed;
        document.getElementById('category-fees').textContent = category.typical_fees;
    } else {
        document.querySelector('.category-section').style.display = 'none';
    }
}
