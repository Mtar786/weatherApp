const cityInput = document.getElementById("cityInput");
const getWeatherBtn = document.getElementById("getWeather");
const weatherDisplay = document.getElementById("weatherDisplay");

// Function to get weather data from Open-Meteo API
async function getWeatherData(city) {
    try {
        // Convert city name to latitude & longitude
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            weatherDisplay.innerHTML = "City not found. Please try again.";
            return;
        }

        const { latitude, longitude, name } = geoData.results[0];

        // Fetch weather data using latitude & longitude
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,weathercode,relative_humidity_2m,windspeed_10m`);
        const weatherData = await weatherResponse.json();

        const { temperature, weathercode, windspeed } = weatherData.current_weather;
        const humidity = weatherData.hourly.relative_humidity_2m[0]; // Get humidity from hourly data

        // Map weather codes to descriptions & icons
        const weatherDescriptions = {
            0: { text: "Clear sky", icon: "☀️", bg: "sunny.jpg" },
            1: { text: "Mainly clear", icon: "🌤️", bg: "clear.jpg" },
            2: { text: "Partly cloudy", icon: "⛅", bg: "cloudy.jpg" },
            3: { text: "Overcast", icon: "☁️", bg: "overcast.jpg" },
            45: { text: "Foggy", icon: "🌫️", bg: "fog.jpg" },
            61: { text: "Light rain", icon: "🌦️", bg: "rain.jpg" },
            63: { text: "Moderate rain", icon: "🌧️", bg: "rain.jpg" },
            65: { text: "Heavy rain", icon: "⛈️", bg: "storm.jpg" },
            80: { text: "Rain showers", icon: "🌦️", bg: "rain.jpg" },
            81: { text: "Heavy showers", icon: "🌧️", bg: "storm.jpg" }
        };

        const weatherDetails = weatherDescriptions[weathercode] || { text: "Unknown Weather", icon: "❓", bg: "default.jpg" };

        // Set dynamic background based on weather
        document.body.style.backgroundImage = `url(images/${weatherDetails.bg})`;

        // Display the weather data with new features
        weatherDisplay.innerHTML = `
            <h2>${name}</h2>
            <p style="font-size: 50px;">${weatherDetails.icon}</p>
            <p>Temperature: <span id="tempValue">${temperature}</span>°<span id="tempUnit">C</span></p>
            <p>Weather: ${weatherDetails.text}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windspeed} km/h</p>
            <button id="toggleTemp">Switch to °F</button>
        `;

        // Add event listener for temperature conversion
        document.getElementById("toggleTemp").addEventListener("click", () => {
            const tempSpan = document.getElementById("tempValue");
            const unitSpan = document.getElementById("tempUnit");
            let temp = parseFloat(tempSpan.innerText);

            if (unitSpan.innerText === "C") {
                temp = (temp * 9/5) + 32;
                unitSpan.innerText = "F";
            } else {
                temp = (temp - 32) * 5/9;
                unitSpan.innerText = "C";
            }
            tempSpan.innerText = temp.toFixed(1);
        });

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
