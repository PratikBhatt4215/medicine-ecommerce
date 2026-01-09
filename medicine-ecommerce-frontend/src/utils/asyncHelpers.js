/**
 * Waits for specified milliseconds
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after delay
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Handles async errors consistently
 * @param {Function} asyncFn - Async function to execute
 * @param {Function} onError - Error handler (optional)
 * @returns {Promise} Result or null on error
 */
export async function handleAsync(asyncFn, onError = null) {
  try {
    return await asyncFn();
  } catch (error) {
    console.error('Async error:', error);
    if (onError) {
      onError(error);
    }
    return null;
  }
}
