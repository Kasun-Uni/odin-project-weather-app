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

async function getWeather(location) {
  const rawData = await fetchWeatherData(location);
  if (!rawData) return;

  const weather = processWeatherData(rawData);
  console.log(weather);
}

const weatherForm = document.getElementById("weather-form");
const locationInput = document.getElementById("location-input");

weatherForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const location = locationInput.value.trim();
  if (location === "") return;

  getWeather(location);
});