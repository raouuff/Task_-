/**
 * API configuration and shared functions for the News Dashboard
 * Contains API keys and shared utility functions
 */

// API configurations
const API_KEYS = {
  weather: "c45fc8deb3723794e1bc99726fb209f2",
  news: "7f71d24aa0af28dde1ac82226f92ff56",
  sports: "77c914a6407c093415c969f29fc6fa29b367627359ed69fcd25b3a29f47d23fa",
  currency: "c6987797d35b398215dca945",
};

// Valid GNews API topics that can be used
const GNEWS_VALID_TOPICS = [
  "breaking-news",
  "world",
  "nation",
  "business",
  "technology",
  "entertainment",
  "sports",
  "science",
  "health",
];

/**
 * Format a date to locale string
 * @param {string} dateStr - ISO date string
 * @param {string} locale - Locale string (default: 'ar-EG')
 * @returns {string} Formatted date string
 */
function formatDate(dateStr, locale = "ar-EG") {
  return new Date(dateStr).toLocaleDateString(locale);
}

/**
 * Get news icon based on category
 * @param {string} category - News category
 * @returns {string} Emoji icon for the category
 */
function getNewsIcon(category) {
  const icons = {
    "politics-news": "🏛️",
    "world-news": "🌎",
    "economy-news": "📈",
    "business-news": "💼",
    "sports-news": "⚽",
  };
  return icons[category] || "📰";
}

/**
 * Open an article in a new tab
 * @param {string} url - Article URL
 */
function openArticle(url) {
  window.open(url, "_blank");
}

/**
 * Display error message
 * @param {string} message - Error message to display
 * @param {string} containerId - Container ID to display the error
 */
function displayError(message, containerId) {
  document.getElementById(
    containerId
  ).innerHTML = `<div class="error"><i class="fas fa-exclamation-circle me-2"></i>${message}</div>`;
}

// Export for use in other files
window.API = {
  KEYS: API_KEYS,
  GNEWS_TOPICS: GNEWS_VALID_TOPICS,
  formatDate,
  getNewsIcon,
  openArticle,
  displayError,
};
