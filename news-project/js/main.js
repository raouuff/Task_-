/**
 * Main JavaScript for the News Dashboard
 * Contains functions for news loading and search functionality
 */

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize news sections with topics that match GNews API's supported topics
  loadNews("world", "politics-news");
  loadNews("business", "economy-news");
  loadNews("sports", "sports-news");

  // Update section titles to match the content
  document.querySelectorAll(".section-title")[0].textContent = "World News";
  document.querySelectorAll(".section-title")[1].textContent = "Business";
  document.querySelectorAll(".section-title")[2].textContent = "Sports";
});

/**
 * Load news articles from GNews API
 * @param {string} category - News category/topic
 * @param {string} elementId - DOM element ID for container
 */
async function loadNews(category, elementId) {
  try {
    // Use the top-headlines endpoint for more reliable results
    const response = await fetch(
      `https://gnews.io/api/v4/top-headlines?topic=${category}&lang=ar&max=6&apikey=${API.KEYS.news}`
    );
    const data = await response.json();

    // Log the API response for debugging
    console.log(`News API response for ${category}:`, data);

    if (data.errors) {
      console.error(`News API errors for ${category}:`, data.errors);
      throw new Error(data.errors);
    }

    displayNews(data.articles, elementId);
  } catch (error) {
    console.error(`${category} news API error:`, error);
    // Always fall back to mock data if the API fails
    mockNewsData(category, elementId);
  }
}

/**
 * Display news articles in the specified container
 * @param {Array} articles - Array of news articles
 * @param {string} elementId - DOM element ID for container
 */
function displayNews(articles, elementId) {
  const container = document.getElementById(elementId);

  if (!articles || articles.length === 0) {
    console.log(`No articles found for ${elementId}`);
    container.innerHTML = '<div class="error">No news available</div>';
    return;
  }

  const newsHTML = articles
    .slice(0, 6)
    .map((article) => {
      const publishedDate = API.formatDate(article.publishedAt);
      const icon = API.getNewsIcon(elementId);

      return `
            <div class="card" onclick="API.openArticle('${article.url}')">
                <div class="card-image">${icon}</div>
                <div class="card-title">${article.title}</div>
                <div class="card-meta">${
                  article.source.name
                } • ${publishedDate}</div>
                <div class="card-description">${article.description || ""}</div>
            </div>
        `;
    })
    .join("");

  container.innerHTML = newsHTML;
}

/**
 * Search for news articles
 * @param {Event} event - Keyboard event
 */
async function searchNews(event) {
  if (event.key === "Enter") {
    const query = event.target.value;
    if (query.trim()) {
      try {
        // Improved search endpoint with better parameters
        const response = await fetch(
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(
            query
          )}&lang=ar&max=10&apikey=${API.KEYS.news}`
        );
        const data = await response.json();

        console.log("Search API response:", data);

        if (data.articles && data.articles.length > 0) {
          displayNews(data.articles, "politics-news");
          document.querySelector(
            ".section-title"
          ).textContent = `Search Results: ${query}`;
        } else {
          document.getElementById(
            "politics-news"
          ).innerHTML = `<div class="error">No results found for "${query}"</div>`;
          document.querySelector(
            ".section-title"
          ).textContent = `Search Results: ${query}`;
        }
      } catch (error) {
        console.error("Search error:", error);
        document.getElementById("politics-news").innerHTML =
          '<div class="error">Search failed. Please try again later.</div>';
      }
    }
  }
}

/**
 * Load a specific section of the news website
 * @param {string} section - Section name to load
 */
function loadSection(section) {
  switch (section) {
    case "home":
      // Using topic parameters that match GNews API topics
      loadNews("world", "politics-news");
      loadNews("business", "economy-news");
      loadNews("sports", "sports-news");
      break;
    case "news":
      loadNews("breaking-news", "politics-news");
      document.querySelector(
        "#politics-news"
      ).previousElementSibling.textContent = "Breaking News";
      break;
    case "sports":
      loadNews("sports", "politics-news");
      document.querySelector(
        "#politics-news"
      ).previousElementSibling.textContent = "Sports";
      break;
    case "live":
      // Refresh live matches when live tab is clicked
      initLiveMatchesWidget();
      break;
  }
}

/**
 * Generate mock news data when API fails
 * @param {string} category - News category
 * @param {string} elementId - DOM element ID for container
 */
function mockNewsData(category, elementId) {
  const mockArticles = [
    {
      title: `${
        category === "world"
          ? "Global Summit Discusses Climate Change"
          : category === "business"
          ? "Stock Market Reaches All-Time High"
          : "Team Championship Victory"
      }`,
      source: { name: "News Source" },
      publishedAt: new Date().toISOString(),
      description: `Latest ${category} news and updates from around the world. This is a comprehensive coverage of the most important developments.`,
      url: "#",
    },
    {
      title: `${
        category === "world"
          ? "Peace Talks Resume in Middle East"
          : category === "business"
          ? "Business Leaders Discuss Future Investments"
          : "New Sports Infrastructure Projects Announced"
      }`,
      source: { name: "Daily News" },
      publishedAt: new Date().toISOString(),
      description: `Breaking ${category} developments and analysis from our expert reporters covering the latest trends.`,
      url: "#",
    },
    {
      title: `${
        category === "world"
          ? "International Aid Reaches Disaster Zone"
          : category === "business"
          ? "Currency Exchange Rate Updates"
          : "Sports Tournament Results"
      }`,
      source: { name: "News Today" },
      publishedAt: new Date().toISOString(),
      description: `Comprehensive ${category} coverage and insights with detailed analysis of recent events and their impact.`,
      url: "#",
    },
  ];

  displayNews(mockArticles, elementId);
}

// Make functions available globally
window.loadNews = loadNews;
window.searchNews = searchNews;
window.loadSection = loadSection;
