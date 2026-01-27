/**
 * Italy Property Cost Calculator - Frontend JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calculator-form');
    const resultsSection = document.getElementById('results');
    const resultsContent = document.getElementById('results-content');
    const rateDisplay = document.getElementById('rate-display');

    // Load exchange rates on page load
    loadExchangeRates();

    // Form element references for conditional display
    const isApartmentCheckbox = document.getElementById('is_apartment');
    const condoFeeRow = document.querySelector('.condo-fee-row');
    const usingMortgageCheckbox = document.getElementById('using_mortgage');
    const mortgageAmountGroup = document.querySelector('.mortgage-amount-group');
    const includeAgencyCheckbox = document.getElementById('include_agency_fee');
    const agencyRateGroup = document.querySelector('.agency-rate-group');

    // Toggle condo fee input
    isApartmentCheckbox.addEventListener('change', function() {
        condoFeeRow.style.display = this.checked ? 'flex' : 'none';
    });

    // Toggle mortgage amount input
    usingMortgageCheckbox.addEventListener('change', function() {
        mortgageAmountGroup.style.display = this.checked ? 'block' : 'none';
    });

    // Toggle agency rate input
    includeAgencyCheckbox.addEventListener('change', function() {
        agencyRateGroup.style.display = this.checked ? 'block' : 'none';
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await calculateCosts();
    });

    // Form reset
    form.addEventListener('reset', function() {
        resultsSection.style.display = 'none';
        condoFeeRow.style.display = 'none';
        mortgageAmountGroup.style.display = 'none';
    });

    /**
     * Load current exchange rates from API
     */
    async function loadExchangeRates() {
        try {
            const response = await fetch('/api/rates');
            const data = await response.json();

            const rateStrings = Object.entries(data.rates)
                .filter(([curr]) => curr !== 'EUR')
                .map(([curr, rate]) => `1 EUR = ${rate.toFixed(4)} ${curr}`)
                .join(' | ');

            rateDisplay.textContent = `Exchange rates (${data.date}): ${rateStrings}`;
        } catch (error) {
            console.error('Failed to load exchange rates:', error);
            rateDisplay.textContent = 'Exchange rates unavailable - using estimates';
        }
    }

    /**
     * Collect form data and submit to API
     */
    async function calculateCosts() {
        const formData = collectFormData();

        // Show loading state
        resultsSection.style.display = 'block';
        resultsContent.innerHTML = '<div class="loading"></div>';

        try {
            const response = await fetch('/api/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Calculation failed');
            }

            const result = await response.json();
            displayResults(result);

            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Calculation error:', error);
            resultsContent.innerHTML = `
                <div class="error-message">
                    <strong>Error:</strong> ${error.message}
                </div>
            `;
        }
    }

    /**
     * Collect and validate form data
     */
    function collectFormData() {
        const getValue = (id) => document.getElementById(id).value;
        const getNumber = (id) => {
            const val = document.getElementById(id).value;
            return val ? parseFloat(val) : null;
        };
        const getChecked = (id) => document.getElementById(id).checked;

        const data = {
            purchase_price: getNumber('purchase_price'),
            source_currency: getValue('source_currency'),
            property_type: getValue('property_type'),
            seller_type: getValue('seller_type'),
            cadastral_category: getValue('cadastral_category') || null,
            cadastral_income: getNumber('cadastral_income'),
            property_size_sqm: getNumber('property_size_sqm'),
            is_apartment: getChecked('is_apartment'),
            monthly_condo_fee: getNumber('monthly_condo_fee'),
            prima_casa: getChecked('prima_casa'),
            resident_in_italy: getChecked('resident_in_italy'),
            using_mortgage: getChecked('using_mortgage'),
            mortgage_amount: getNumber('mortgage_amount'),
            include_agency_fee: getChecked('include_agency_fee'),
            agency_rate: getNumber('agency_rate') ? getNumber('agency_rate') / 100 : null,
            include_geometra: getChecked('include_geometra'),
            include_translator: getChecked('include_translator'),
            renovation_budget: getNumber('renovation_budget'),
        };

        return data;
    }

    /**
     * Display calculation results
     */
    function displayResults(result) {
        const currency = result.source_currency;
        const showForeign = currency !== 'EUR';

        let html = '';

        // Property Summary
        html += `
            <div class="property-summary">
                <h3>Property Summary</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <span class="label">Purchase Price</span>
                        <span class="value">${formatCurrency(result.purchase_price_eur, 'EUR')}</span>
                        ${showForeign ? `<span class="value">${formatCurrency(result.purchase_price_foreign, currency)}</span>` : ''}
                    </div>
                    <div class="summary-item">
                        <span class="label">Property Type</span>
                        <span class="value">${capitalizeFirst(result.property_type)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Buyer Status</span>
                        <span class="value">${result.is_prima_casa ? 'Prima Casa (First Home)' : 'Second Home'}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Seller Type</span>
                        <span class="value">${capitalizeFirst(result.seller_type)}</span>
                    </div>
                    ${result.cadastral_value ? `
                    <div class="summary-item">
                        <span class="label">Cadastral Value (Estimated)</span>
                        <span class="value">${formatCurrency(result.cadastral_value, 'EUR')}</span>
                    </div>
                    ` : ''}
                    ${showForeign ? `
                    <div class="summary-item">
                        <span class="label">Exchange Rate</span>
                        <span class="value">1 EUR = ${result.exchange_rate.toFixed(4)} ${currency}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        // One-Time Costs
        html += renderCostCategory(result.one_time_costs, currency, showForeign);

        // Annual Costs
        html += renderCostCategory(result.ongoing_annual_costs, currency, showForeign);

        // Grand Total
        html += `
            <div class="grand-total">
                <h3>Total First Year Cost</h3>
                <div class="total-breakdown">
                    <div class="total-row">
                        <span>Purchase Price</span>
                        <span>${formatCurrency(result.purchase_price_eur, 'EUR')}</span>
                    </div>
                    <div class="total-row">
                        <span>One-Time Costs</span>
                        <span>
                            ${formatCurrency(result.total_one_time_eur, 'EUR')}
                            <span class="percentage-badge">${result.one_time_percentage.toFixed(1)}%</span>
                        </span>
                    </div>
                    <div class="total-row">
                        <span>Annual Costs (Year 1)</span>
                        <span>${formatCurrency(result.total_annual_eur, 'EUR')}</span>
                    </div>
                    <div class="total-row final">
                        <span>Grand Total</span>
                        <span>${formatCurrency(result.grand_total_first_year_eur, 'EUR')}</span>
                    </div>
                    ${showForeign ? `
                    <div class="total-row final">
                        <span>In ${currency}</span>
                        <span>${formatCurrency(result.grand_total_first_year_foreign, currency)}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Notes
        if (result.notes && result.notes.length > 0) {
            html += `
                <div class="notes-section">
                    <h4>Important Notes</h4>
                    <ul>
                        ${result.notes.map(note => `<li>${note}</li>`).join('')}
                    </ul>
                    <p style="margin-top: 10px; font-size: 0.85rem;">* Indicates estimated values</p>
                </div>
            `;
        }

        resultsContent.innerHTML = html;
    }

    /**
     * Render a cost category (one-time or annual)
     */
    function renderCostCategory(category, currency, showForeign) {
        let html = `
            <div class="cost-category">
                <h3>${category.name}</h3>
                <div class="cost-items">
        `;

        for (const item of category.items) {
            const estimateClass = item.is_estimate ? 'is-estimate' : '';
            html += `
                <div class="cost-item ${estimateClass}">
                    <div class="item-info">
                        <span class="item-name">${item.name}</span>
                        ${item.description ? `<span class="item-description">${item.description}</span>` : ''}
                    </div>
                    <div class="item-amount">
                        <span class="amount-eur">${formatCurrency(item.amount_eur, 'EUR')}</span>
                        ${showForeign && item.amount_foreign ? `<span class="amount-foreign">${formatCurrency(item.amount_foreign, currency)}</span>` : ''}
                    </div>
                </div>
            `;
        }

        html += `
                </div>
                <div class="subtotal">
                    <span>Subtotal</span>
                    <div>
                        <span class="amount-eur">${formatCurrency(category.subtotal_eur, 'EUR')}</span>
                        ${showForeign ? `<span class="amount-foreign"> (${formatCurrency(category.subtotal_foreign, currency)})</span>` : ''}
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Format currency with symbol
     */
    function formatCurrency(amount, currency) {
        if (amount === null || amount === undefined) {
            return '-';
        }

        const symbols = {
            'EUR': '€',
            'USD': '$',
            'CAD': 'C$',
            'GBP': '£',
            'AUD': 'A$'
        };

        const symbol = symbols[currency] || currency + ' ';
        return `${symbol}${amount.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })}`;
    }

    /**
     * Capitalize first letter
     */
    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
