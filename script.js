const apiKey = "9a44d59d9bc56592b569b0b18eeca3a4"; // Replace with your actual API key
const searchButton = document.getElementById("search");
const cityInput = document.getElementById("city");
const weatherContainer = document.getElementById("weather-container");
const forecastContainer = document.getElementById("forecast-container");
const loader = document.getElementById("loader");
const errorContainer = document.getElementById("error-container");
const errorMessage = document.getElementById("error-message");
const emptyState = document.getElementById("empty-state");

// Initialize date
document.getElementById("current-date").textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// Event listeners
searchButton.addEventListener("click", searchWeather);
cityInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchWeather();
    }
});

function searchWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError("Please enter a city name");
        return;
    }
    
    // Show loader
    showLoader();
    
    // Get weather data
    getWeather(city)
        .then(() => getForecast(city))
        .catch(err => {
            console.error(err);
            showError("Error fetching weather data. Please try again.");
        });
}

function showLoader() {
    weatherContainer.classList.add("d-none");
    errorContainer.classList.add("d-none");
    emptyState.classList.add("d-none");
    loader.classList.remove("d-none");
}

function showWeather() {
    loader.classList.add("d-none");
    errorContainer.classList.add("d-none");
    emptyState.classList.add("d-none");
    weatherContainer.classList.remove("d-none");
}

function showError(message) {
    loader.classList.add("d-none");
    weatherContainer.classList.add("d-none");
    emptyState.classList.add("d-none");
    errorContainer.classList.remove("d-none");
    errorMessage.textContent = message;
}

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod === 200) {
            displayWeather(data);
        } else {
            showError(`City not found: ${data.message}`);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Error fetching weather data.");
    }
}

function displayWeather(data) {
    // Set city name
    document.getElementById("city-name").textContent = `${data.name}, ${data.sys.country}`;
    
    // Set weather icon
    const iconCode = data.weather[0].icon;
    const weatherDescription = data.weather[0].description;
    document.getElementById("weather-icon-container").innerHTML = `
        <img src="https://openweathermap.org/img/wn/${iconCode}@4x.png" alt="${weatherDescription}" class="weather-icon">
    `;
    
    // Set temperature and description
    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("weather-description").textContent = weatherDescription;
    
    // Set weather details
    document.getElementById("feels-like").textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("wind-speed").textContent = `${data.wind.speed} m/s`;
    document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;
    
    // Set dynamic background
    const backgroundClass = getBackgroundClass(data.weather[0].main);
    document.body.className = backgroundClass;
    
    // Show weather
    showWeather();
}

function getBackgroundClass(weather) {
    switch (weather) {
        case 'Clear': return 'bg-clear';
        case 'Clouds': return 'bg-cloudy';
        case 'Rain': return 'bg-rainy';
        case 'Snow': return 'bg-snowy';
        case 'Thunderstorm': return 'bg-thunderstorm';
        default: return '';
    }
}

async function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod === "200") {
            displayForecast(data);
        } else {
            console.error(`Forecast data not found: ${data.message}`);
        }
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        throw new Error("Error fetching forecast data.");
    }
}

function displayForecast(data) {
    // Clear previous forecast
    forecastContainer.innerHTML = "";
    
    // Get only one forecast per day (12:00 PM)
    const dailyForecasts = {};
    data.list.forEach(entry => {
        const date = entry.dt_txt.split(" ")[0]; // Extract date
        if (!dailyForecasts[date] && entry.dt_txt.includes("12:00:00")) {
            dailyForecasts[date] = entry;
        }
    });
    
    // Generate forecast items
    Object.values(dailyForecasts).forEach(day => {
        const date = new Date(day.dt * 1000);
        const formattedDate = date.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
        const iconCode = day.weather[0].icon;
        const description = day.weather[0].description;
        const temp = Math.round(day.main.temp);
        
        const forecastItem = document.createElement("div");
        forecastItem.className = "forecast-item";
        forecastItem.innerHTML = `
            <p class="forecast-date">${formattedDate}</p>
            <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${description}" class="forecast-icon">
            <p class="forecast-temp">${temp}°C</p>
            <p class="forecast-desc">${description}</p>
        `;
        
        forecastContainer.appendChild(forecastItem);
    });
}