/**
 * Formats a number as Indian Rupees
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "₹299")
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) {
    return '₹0';
  }
  return `₹${amount}`;
}

/**
 * Formats a date string to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatSimpleDate(dateString) {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN');
}

/**
 * Truncates text to specified length and adds ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength) {
  if (!text) {
    return '';
  }
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}
