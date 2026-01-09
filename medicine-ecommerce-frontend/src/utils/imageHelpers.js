/**
 * Gets image URL with fallback
 * @param {string} imageUrl - Original image URL
 * @param {string} fallback - Fallback URL (optional)
 * @returns {string} Valid image URL
 */
export function getImageUrl(imageUrl, fallback = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400') {
  if (imageUrl && imageUrl.trim()) {
    return imageUrl.trim();
  }
  return fallback;
}

/**
 * Checks if image URL is valid
 * @param {string} imageUrl - Image URL to check
 * @returns {boolean} True if valid
 */
export function hasValidImage(imageUrl) {
  return imageUrl && imageUrl.trim().length > 0;
}
