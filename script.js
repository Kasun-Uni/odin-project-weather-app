const API_KEY = "123-123-456-456";

async function fetchWeatherData(location) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?key=${API_KEY}&unitGroup=us`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function processWeatherData(rawData) {
  const current = rawData.currentConditions;

  return {
    location: rawData.resolvedAddress,
    tempF: current.temp,
    tempC: Math.round(((current.temp - 32) * 5) / 9),
    conditions: current.conditions,
    icon: current.icon,
    humidity: current.humidity,
    windSpeed: current.windspeed,
    description: rawData.description,
  };
}

// ============ DISPLAY ============

let currentWeather = null;
let showCelsius = false;

const weatherResult = document.getElementById("weather-result");
const locationName = document.getElementById("location-name");
const conditionsEl = document.getElementById("conditions");
const temperatureEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("wind-speed");
const unitToggle = document.getElementById("unit-toggle");

function getBackgroundColor(conditions) {
  const lower = conditions.toLowerCase();
  if (lower.includes("rain")) return "#7ea3c9";
  if (lower.includes("snow")) return "#e0e8f0";
  if (lower.includes("cloud")) return "#b0b8c1";
  if (lower.includes("clear")) return "#87ceeb";
  return "#f3f4f6";
}

function renderWeather(weather) {
  locationName.textContent = weather.location;
  conditionsEl.textContent = weather.conditions;
  humidityEl.textContent = weather.humidity;
  windSpeedEl.textContent = weather.windSpeed;

  temperatureEl.textContent = showCelsius
    ? `${weather.tempC}°C`
    : `${weather.tempF}°F`;

  unitToggle.textContent = showCelsius ? "Show °F" : "Show °C";

  document.body.style.backgroundColor = getBackgroundColor(weather.conditions);

  weatherResult.classList.remove("hidden");
}

async function getWeather(location) {
  const rawData = await fetchWeatherData(location);
  if (!rawData) return;

  currentWeather = processWeatherData(rawData);
  renderWeather(currentWeather);
}

unitToggle.addEventListener("click", () => {
  showCelsius = !showCelsius;
  if (currentWeather) {
    renderWeather(currentWeather);
  }
});

const weatherForm = document.getElementById("weather-form");
const locationInput = document.getElementById("location-input");

weatherForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const location = locationInput.value.trim();
  if (location === "") return;

  getWeather(location);
});