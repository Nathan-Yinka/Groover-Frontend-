/**
 * Currency formatting utilities
 */

/**
 * Format a number as currency with proper commas and decimal places
 * @param {number|string} amount - The amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {boolean} showSymbol - Whether to show currency symbol (default: false)
 * @param {boolean} showCode - Whether to show currency code (default: true)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD', showSymbol = false, showCode = true) => {
    // Convert to number and handle invalid values
    const numAmount = parseFloat(amount) || 0;
    
    // Format number with commas and 2 decimal places
    const formattedNumber = numAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    // Build the currency string
    let result = '';
    
    if (showSymbol) {
        result += '$';
    }
    
    result += formattedNumber;
    
    if (showCode) {
        result += ` ${currency}`;
    }
    
    return result;
};

/**
 * Format currency for display without symbol or code (just the number)
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return numAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

/**
 * Format currency with symbol only (no code)
 * @param {number|string} amount - The amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string with symbol
 */
export const formatCurrencyWithSymbol = (amount, currency = 'USD') => {
    return formatCurrency(amount, currency, true, false);
};

/**
 * Format currency with code only (no symbol) - optimized for small spaces
 * @param {number|string} amount - The amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string with code
 */
export const formatCurrencyWithCode = (amount, currency = 'USD') => {
    const numAmount = parseFloat(amount) || 0;
    
    // For very large numbers, use compact format
    if (numAmount >= 1000000) {
        return `${(numAmount / 1000000).toFixed(1)} M ${currency}`;
    } else if (numAmount >= 10000) {
        return `${(numAmount / 1000).toFixed(1)} K ${currency}`;
    }
    
    // Regular formatting for smaller numbers
    const formattedNumber = numAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    return `${formattedNumber} ${currency}`;
};

/**
 * Format currency with full amount (no abbreviations) - for withdraw/deposit pages
 * @param {number|string} amount - The amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string with full amount
 */
export const formatCurrencyFullAmount = (amount, currency = 'USD') => {
    const numAmount = parseFloat(amount) || 0;
    
    // Always show full amount with commas and 2 decimal places
    const formattedNumber = numAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    return `${formattedNumber} ${currency}`;
};

/**
 * Format currency with both symbol and code
 * @param {number|string} amount - The amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string with symbol and code
 */
export const formatCurrencyFull = (amount, currency = 'USD') => {
    return formatCurrency(amount, currency, true, true);
};

/**
 * Parse a currency string back to a number
 * @param {string} currencyString - The currency string to parse
 * @returns {number} Parsed number
 */
export const parseCurrency = (currencyString) => {
    if (!currencyString) return 0;
    
    // Remove currency symbols and codes, keep only numbers and decimal point
    const cleaned = currencyString.replace(/[^\d.-]/g, '');
    return parseFloat(cleaned) || 0;
};
