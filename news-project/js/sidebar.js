/**
 * Sidebar functionality for the News Dashboard
 * Contains functions for weather, currency, and sports widgets
 */

// Initialize sidebar widgets when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initWeatherWidget();
  initCurrencyWidget();
  initLiveMatchesWidget();
});

/**
 * Initialize Weather Widget using OpenWeatherMap API
 */
function initWeatherWidget() {
  const WEATHER_API_KEY = API.KEYS.weather;
  const CITY_NAME = "Cairo";

  // Using the standard Current Weather API
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&units=metric&appid=${WEATHER_API_KEY}`;

  // Fetch weather data
  $.ajax({
    url: weatherApiUrl,
    method: "GET",
    success: function (data) {
      // Update temperature and location
      const temp = Math.round(data.main.temp);
      $("#temperature").text(`${temp}°C`);
      $("#location").text(CITY_NAME);

      // Also update the navbar weather
      $("#nav-weather-temp").text(`${temp}°C`);
      $("#nav-weather-location").text(CITY_NAME);

      // Update weather icon based on the weather condition
      const weatherIconCode = data.weather[0].icon;
      const weatherDescription = data.weather[0].description;
      const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;

      // Replace icon with OpenWeatherMap icon
      $("#weather-icon").html(
        `<img src="${weatherIconUrl}" alt="${weatherDescription}" title="${weatherDescription}" class="weather-icon">`
      );

      // Add additional weather information
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const feelsLike = Math.round(data.main.feels_like);

      // Remove any existing additional info before appending
      $(".weather-additional-info").remove();

      const additionalInfo = `
                <div class="weather-additional-info d-flex justify-content-between mt-3 small text-muted">
                <div>
                    <i class="fas fa-tint me-1"></i> Humidity: ${humidity}%
                </div>
                <div>
                    <i class="fas fa-wind me-1"></i> Wind: ${windSpeed} m/s
                </div>
                </div>
                <div class="weather-additional-info small text-muted mt-1">
                <i class="fas fa-thermometer-half me-1"></i> Feels like: ${feelsLike}°C
                </div>
            `;

      // Append additional info to card body
      $(".weather-widget .card-body").append(additionalInfo);

      console.log("Weather data loaded successfully");
    },
    error: function (xhr, status, error) {
      console.error("Error fetching weather data:", error);
      $("#temperature").text("25°C"); // Fallback temperature
      $("#location").text("Cairo"); // Fallback location
      $("#weather-icon").html('<i class="fas fa-sun text-warning"></i>'); // Fallback icon

      // Also update the navbar weather with fallback
      $("#nav-weather-temp").text("25°C");
      $("#nav-weather-location").text("Cairo");
    },
  });
}

/**
 * Initialize Currency Exchange Widget using ExchangeRate API
 */
function initCurrencyWidget() {
  const API_KEY = API.KEYS.currency;
  const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

  const amountInput = $("#amount");
  const fromCurrency = $("#from-currency");
  const toCurrency = $("#to-currency");
  const resultElement = $("#conversion-result");

  // Default rates in case the API fails
  let rates = {
    USD: 1,
    SAR: 3.75,
    EGP: 15.73,
    EUR: 0.9,
    GBP: 0.77,
  };

  // Fetch the latest exchange rates
  $.ajax({
    url: API_URL,
    method: "GET",
    success: function (data) {
      if (data.result === "success") {
        // Update rates with the latest data
        rates = data.conversion_rates;

        // Update the displayed rates
        $("#usd-rate").text("1.00");
        $("#sar-rate").text(rates.SAR.toFixed(2));
        $("#egp-rate").text(rates.EGP.toFixed(2));

        // Update currency options in dropdowns
        updateCurrencyOptions(rates);

        // Show last update time
        const lastUpdate = new Date(
          data.time_last_update_unix * 1000
        ).toLocaleString();
        $(".currency-widget .card-body").append(`
                <div class="small text-muted text-center mt-3">
                    <i class="fas fa-sync-alt me-1"></i>Rates updated: ${lastUpdate}
                </div>
                `);

        console.log("Exchange rates loaded successfully");
      } else {
        console.error("API Error:", data["error-type"]);
        showApiError();
      }

      // Initial calculation
      updateConversion();
    },
    error: function (xhr, status, error) {
      console.error("Error fetching exchange rates:", error);
      showApiError();

      // Use default rates
      updateConversion();
    },
  });

  // Function to populate dropdowns with available currencies
  function updateCurrencyOptions(rates) {
    // Get current selections
    const fromValue = fromCurrency.val() || "USD";
    const toValue = toCurrency.val() || "SAR";

    // Clear existing options
    fromCurrency.empty();
    toCurrency.empty();

    // Add all available currencies
    Object.keys(rates)
      .sort()
      .forEach(function (currency) {
        // Add option to "from" dropdown
        const fromOption = $("<option>").val(currency).text(currency);

        if (currency === fromValue) {
          fromOption.attr("selected", true);
        }

        fromCurrency.append(fromOption);

        // Add option to "to" dropdown
        const toOption = $("<option>").val(currency).text(currency);

        if (currency === toValue) {
          toOption.attr("selected", true);
        }

        toCurrency.append(toOption);
      });
  }

  // Function to show API error
  function showApiError() {
    $(".currency-widget .card-body").append(`
        <div class="small text-danger text-center mt-3">
            <i class="fas fa-exclamation-circle me-1"></i>Could not update rates. Using stored rates.
        </div>
        `);
  }

  // Function to calculate and display conversion
  function updateConversion() {
    const amount = parseFloat(amountInput.val()) || 0;
    const from = fromCurrency.val();
    const to = toCurrency.val();

    // Check if rates exist
    if (!rates[from] || !rates[to]) {
      resultElement.text("N/A");
      return;
    }

    // Convert from source currency to USD first, then to target currency
    const inUSD = amount / rates[from];
    const result = inUSD * rates[to];

    // Format the result
    resultElement.text(`${result.toFixed(2)} ${to}`);
  }

  // Add event listeners
  amountInput.on("input", updateConversion);
  fromCurrency.on("change", updateConversion);
  toCurrency.on("change", updateConversion);
}

/**
 * Initialize Live Football Matches Widget using AllSportsAPI
 */
function initLiveMatchesWidget() {
  // AllSportsAPI configuration
  const API_KEY = API.KEYS.sports;
  const API_URL = `https://apiv2.allsportsapi.com/football/?met=Livescore&APIkey=${API_KEY}&timezone=Africa/Cairo`;

  // Show loading state
  $("#live-matches").html(`
        <li class="list-group-item text-center">
            <div class="spinner-border spinner-border-sm text-info me-2" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            Loading live matches...
        </li>
    `);

  // Fetch live football matches
  $.ajax({
    url: API_URL,
    method: "GET",
    success: function (response) {
      displayFootballMatches(response);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching football matches:", error);
      displayErrorMessage("Could not load football matches");
    },
  });
}

/**
 * Display football matches from API data
 * @param {Object} data - Football matches data from API
 */
function displayFootballMatches(data) {
  const matchesList = $("#live-matches");

  // Clear loading state
  matchesList.empty();

  // Check if we have matches to display
  if (!data || !data.result || data.result.length === 0) {
    displayErrorMessage("No live matches available at the moment");
    return;
  }

  // Sort matches by league and limit to first 5 matches
  const matches = data.result.slice(0, 5);

  // Loop through matches and add them to the list
  $.each(matches, function (index, match) {
    // Create match element
    const listItem = $("<li>").addClass("list-group-item");

    // League and country information with logos
    const leagueInfo = $("<div>").addClass("d-flex align-items-center mb-2");

    if (match.league_logo) {
      const leagueLogo = $("<img>")
        .addClass("me-2")
        .attr("src", match.league_logo)
        .attr("alt", match.league_name)
        .css({ width: "20px", height: "20px" });
      leagueInfo.append(leagueLogo);
    }

    const leagueName = $("<span>")
      .addClass("small fw-bold")
      .text(match.league_name);
    leagueInfo.append(leagueName);

    if (match.country_logo) {
      const countryLogo = $("<img>")
        .addClass("ms-auto")
        .attr("src", match.country_logo)
        .attr("alt", match.country_name)
        .css({ width: "16px", height: "12px" });
      leagueInfo.append(countryLogo);
    }

    // Home team row
    const homeTeamDiv = $("<div>").addClass(
      "d-flex justify-content-between align-items-center"
    );
    const homeTeamNameDiv = $("<div>").addClass("d-flex align-items-center");

    const homeTeamInitial = match.event_home_team.substring(0, 1);
    const homeTeamLogo = $("<div>")
      .addClass(
        "rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
      )
      .css({ width: "30px", height: "30px" })
      .text(homeTeamInitial);

    const homeTeamName = $("<span>").text(match.event_home_team);

    homeTeamNameDiv.append(homeTeamLogo, homeTeamName);

    // Use event_final_result if available, or default to "0"
    const homeScore = match.event_final_result
      ? match.event_final_result.split("-")[0].trim()
      : "0";

    const homeTeamScore = $("<span>")
      .addClass("badge bg-secondary")
      .text(homeScore);

    homeTeamDiv.append(homeTeamNameDiv, homeTeamScore);

    // Away team row
    const awayTeamDiv = $("<div>").addClass(
      "d-flex justify-content-between align-items-center mt-2"
    );
    const awayTeamNameDiv = $("<div>").addClass("d-flex align-items-center");

    const awayTeamInitial = match.event_away_team.substring(0, 1);
    const awayTeamLogo = $("<div>")
      .addClass(
        "rounded-circle bg-info text-white d-flex align-items-center justify-content-center me-2"
      )
      .css({ width: "30px", height: "30px" })
      .text(awayTeamInitial);

    const awayTeamName = $("<span>").text(match.event_away_team);

    awayTeamNameDiv.append(awayTeamLogo, awayTeamName);

    // Use event_final_result if available, or default to "0"
    const awayScore = match.event_final_result
      ? match.event_final_result.split("-")[1].trim()
      : "0";

    const awayTeamScore = $("<span>")
      .addClass("badge bg-secondary")
      .text(awayScore);

    awayTeamDiv.append(awayTeamNameDiv, awayTeamScore);

    // Match info row
    const matchInfoDiv = $("<div>").addClass("small text-muted mt-1");

    const footballIcon = $("<i>").addClass("fas fa-futbol me-1");

    // Get match status and time
    const matchStatus = getMatchStatus(match);
    const matchTime = match.event_status || match.event_time || "";

    const matchTimeSpan = $("<span>").text(matchTime);

    const statusBadge = $("<span>")
      .addClass("badge " + getStatusBadgeClass(matchStatus) + " ms-1")
      .text(matchStatus);

    matchInfoDiv.append(footballIcon, matchTimeSpan, " ", statusBadge);

    // Add stadium if available
    if (match.event_stadium) {
      const stadiumDiv = $("<div>").addClass("small text-muted mt-1");
      stadiumDiv.html(
        `<i class="fas fa-map-marker-alt me-1"></i>${match.event_stadium}`
      );
      matchInfoDiv.append("<br>", stadiumDiv);
    }

    // Recent goals section (if available)
    if (match.goalscorers && match.goalscorers.length > 0) {
      const recentGoalDiv = $("<div>").addClass("mt-2 small");

      // Get the most recent goal
      const recentGoal = match.goalscorers[match.goalscorers.length - 1];

      // Determine which team scored
      const isHomeGoal =
        recentGoal.home_scorer && recentGoal.home_scorer !== "";

      const goalIcon = $("<i>").addClass("fas fa-futbol text-info me-1");

      const goalInfo = $("<span>").html(
        `${recentGoal.time}' - ${
          isHomeGoal ? recentGoal.home_scorer : recentGoal.away_scorer
        } ` + `<span class="fw-bold">(${recentGoal.score})</span>`
      );

      recentGoalDiv.append(goalIcon, goalInfo);

      // Add goal indicator
      const goalIndicator = $("<span>")
        .addClass("badge bg-info ms-2")
        .text("GOAL!");
      recentGoalDiv.append(goalIndicator);

      // Add to match info
      matchInfoDiv.append("<br>", recentGoalDiv);
    }

    // Add match details button
    const matchDetailsBtn = $("<button>")
      .addClass("btn btn-sm btn-outline-info w-100 mt-2")
      .html('<i class="fas fa-info-circle me-1"></i>Match Details')
      .on("click", function (event) {
        // Prevent the click from bubbling up
        event.stopPropagation();

        // Here you would typically show more match details
        // For demonstration, we'll just show an alert with match information
        const matchInfo =
          `${match.event_home_team} vs ${match.event_away_team}\n` +
          `League: ${match.league_name}\n` +
          `Status: ${getMatchStatus(match)}\n` +
          `Score: ${match.event_final_result || "Not available"}\n` +
          `Stadium: ${match.event_stadium || "Not available"}`;

        alert(matchInfo);
      });

    // Add all elements to list item
    listItem.append(
      leagueInfo,
      homeTeamDiv,
      awayTeamDiv,
      matchInfoDiv,
      matchDetailsBtn
    );

    // Add to matches list
    matchesList.append(listItem);
  });

  // Add timestamp for last update
  const updateTime = new Date().toLocaleTimeString();
  const updateInfo = $("<div>")
    .addClass("small text-muted text-center mt-2")
    .html(`<i class="fas fa-sync-alt me-1"></i>Last updated: ${updateTime}`);

  matchesList.append(updateInfo);
}

/**
 * Display error message in the live matches section
 * @param {string} message - Error message to display
 */
function displayErrorMessage(message) {
  $("#live-matches").html(`
        <li class="list-group-item text-center text-muted">
            <i class="fas fa-exclamation-circle me-2"></i>${message}
        </li>
    `);
}

/**
 * Get match status based on API response
 * @param {Object} match - Match data from API
 * @returns {string} Match status
 */
function getMatchStatus(match) {
  const status = match.event_status || "";

  if (match.event_live === "1") {
    // If it's numeric, it's likely the minute of play
    if (!isNaN(parseInt(status))) {
      return "LIVE";
    }

    switch (status.toUpperCase()) {
      case "HT":
        return "HALF TIME";
      default:
        return "LIVE";
    }
  } else {
    switch (status.toUpperCase()) {
      case "FINISHED":
      case "FT":
        return "FINISHED";
      case "HT":
        return "HALF TIME";
      case "NS":
      case "NOT STARTED":
        return "SCHEDULED";
      default:
        return status || "UPCOMING";
    }
  }
}

/**
 * Get appropriate badge class based on match status
 * @param {string} status - Match status
 * @returns {string} Badge class
 */
function getStatusBadgeClass(status) {
  if (!status) return "bg-secondary";

  switch (status.toUpperCase()) {
    case "LIVE":
      return "bg-danger";
    case "HALF TIME":
    case "HT":
      return "bg-warning";
    case "FINISHED":
    case "FT":
      return "bg-secondary";
    case "SCHEDULED":
    case "UPCOMING":
    case "NOT STARTED":
      return "bg-info";
    default:
      return "bg-secondary";
  }
}

// Set up periodic refresh for live data
setInterval(function () {
  initLiveMatchesWidget();
}, 60000);
