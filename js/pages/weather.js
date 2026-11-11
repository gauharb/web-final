document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#weather-form");
  const cityInput = document.querySelector("#weather-city");
  const status = document.querySelector("#weather-status");
  const results = document.querySelector("#weather-results");
  const submitButton = document.querySelector("#weather-submit");

  function showStatus(message, type) {
    status.textContent = message;
    status.className = "alert mt-3 alert-" + type;
    status.hidden = false;
  }

  async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("HTTP error: " + response.status);
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.reason || "API error");
    }
    return data;
  }

  function weatherDescription(code) {
    if (code === 0) return "Clear sky";
    if ([1, 2, 3].includes(code)) return "Partly cloudy";
    if ([45, 48].includes(code)) return "Fog";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";
    return "Variable weather";
  }

  function addText(parent, tagName, value, cssClass) {
    const element = document.createElement(tagName);
    element.textContent = value;
    if (cssClass) element.className = cssClass;
    parent.appendChild(element);
    return element;
  }

  function showForecast(city, weather) {
    results.innerHTML = "";
    addText(results, "h3", city.name + ", " + city.country, "h4");

    const current = weather.current;
    addText(results, "p",
      "Now: " + current.temperature_2m + "°C · " + weatherDescription(current.weather_code) +
      " · Wind " + current.wind_speed_10m + " km/h · Humidity " + current.relative_humidity_2m + "%",
      "lead");

    const cards = document.createElement("div");
    cards.className = "weather-days";

    weather.daily.time.forEach(function (day, index) {
      const card = document.createElement("article");
      card.className = "feature-card p-3";
      addText(card, "strong", day);
      addText(card, "p", weatherDescription(weather.daily.weather_code[index]), "mb-1");
      addText(card, "p",
        weather.daily.temperature_2m_min[index] + "°C to " +
        weather.daily.temperature_2m_max[index] + "°C", "mb-1");

      const chances = weather.daily.precipitation_probability_max;
      const chance = Array.isArray(chances) ? chances[index] : null;
      addText(card, "small", "Precipitation chance: " + (chance == null ? "N/A" : chance + "%"));
      cards.appendChild(card);
    });
    results.appendChild(cards);
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const cityName = cityInput.value.trim();

    if (cityName.length < 2) {
      showStatus("Enter a city name (at least 2 characters).", "warning");
      cityInput.focus();
      return;
    }

    submitButton.disabled = true;
    results.innerHTML = "";
    showStatus("Loading city and weather data…", "info");

    try {
      const cityUrl = "https://geocoding-api.open-meteo.com/v1/search?name=" +
        encodeURIComponent(cityName) + "&count=1&language=en";
      const locations = await fetchJson(cityUrl);
      if (!locations.results || locations.results.length === 0) {
        showStatus("No city found. Check the spelling and try again.", "warning");
        return;
      }

      const city = locations.results[0];
      const forecastUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + city.latitude +
        "&longitude=" + city.longitude +
        "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m" +
        "&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code" +
        "&timezone=auto&forecast_days=5";
      const weather = await fetchJson(forecastUrl);

      if (!weather.current || !weather.daily || !Array.isArray(weather.daily.time) ||
          weather.daily.time.length === 0) {
        showStatus("No forecast data is available for this city.", "warning");
        return;
      }

      showForecast(city, weather);
      showStatus("Forecast loaded successfully. Weather forecasts are estimates.", "success");
    } catch (error) {
      showStatus("Could not load the forecast. Check your internet connection and try again.", "danger");
      console.error("Weather request failed:", error);
    } finally {
      submitButton.disabled = false;
    }
  });

  const cityFromTrip = new URLSearchParams(window.location.search).get("city");
  if (cityFromTrip) cityInput.value = cityFromTrip;
});
