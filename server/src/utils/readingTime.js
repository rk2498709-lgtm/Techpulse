/**
 * Calculate estimated reading time in minutes
 * @param {string} text - content to measure
 * @returns {number} minutes (minimum 1)
 */
function calculateReadingTime(text) {
  if (!text) return 1;
  const cleanText = text.replace(/<[^>]*>/g, '').replace(/```[\s\S]*?```/g, '');
  const words = cleanText.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

module.exports = calculateReadingTime;
