const cityInput = document.getElementById("cityInput");
const getWeatherBtn = document.getElementById("getWeather");
const weatherDisplay = document.getElementById("weatherDisplay");

// Function to get weather data from Open-Meteo API
async function getWeatherData(city) {
    try {
        // Convert city name to latitude & longitude using Open-Meteo's geocoding
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            weatherDisplay.innerHTML = "City not found. Please try again.";
            return;
        }

        const { latitude, longitude, name } = geoData.results[0];

        // Fetch weather data using latitude & longitude
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherResponse.json();

        const { temperature, weathercode, windspeed } = weatherData.current_weather;

        // Map weather codes to descriptions
        const weatherDescriptions = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing rime fog",
            51: "Drizzle: Light",
            53: "Drizzle: Moderate",
            55: "Drizzle: Dense",
            61: "Rain: Slight",
            63: "Rain: Moderate",
            65: "Rain: Heavy",
            71: "Snow: Slight",
            73: "Snow: Moderate",
            75: "Snow: Heavy",
            80: "Rain showers: Slight",
            81: "Rain showers: Moderate",
            82: "Rain showers: Violent"
        };

        const weatherDescription = weatherDescriptions[weathercode] || "Unknown Weather";

        // Display the weather data
        weatherDisplay.innerHTML = `
            <h2>${name}</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weatherDescription}</p>
            <p>Wind Speed: ${windspeed} km/h</p>
        `;

    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherDisplay.innerHTML = "Error retrieving data. Please try again.";
    }
}

// Event listener for the button click
getWeatherBtn.addEventListener("click", () => {
    const city = cityInput.value;
    if (!city) {
        weatherDisplay.innerHTML = "Please enter a city name.";
        return;
    }
    getWeatherData(city);
});
