const apiKey = "9a44d59d9bc56592b569b0b18eeca3a4";
const searchButton = document.getElementById("search");

searchButton.addEventListener("click", () => {
    const city = document.getElementById("city").value;
    if (city) {
        getWeather(city);
        getForecast(city);
    } else {
        alert("Please enter a city name.");
    }
});

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod === 200) {
            displayWeather(data);
        } else {
            alert(`City not found: ${data.message}`);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching weather data.");
    }
}

function displayWeather(data) {
    const weatherResult = document.getElementById("weather-result");
    weatherResult.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>🌡️ Temperature: ${data.main.temp}°C</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

async function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod === "200") {
            displayForecast(data);
        } else {
            alert(`Forecast data not found: ${data.message}`);
        }
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        alert("Error fetching forecast data.");
    }
}

function displayForecast(data) {
    const forecastResult = document.getElementById("forecast-result");
    forecastResult.innerHTML = "<h3>5-Day Forecast</h3>";

    // Get only one forecast per day (12:00 PM)
    const dailyForecasts = {};
    data.list.forEach(entry => {
        const date = entry.dt_txt.split(" ")[0]; // Extract date
        if (!dailyForecasts[date] && entry.dt_txt.includes("12:00:00")) {
            dailyForecasts[date] = entry;
        }
    });

    Object.values(dailyForecasts).forEach(day => {
        forecastResult.innerHTML += `
            <div class="forecast-item">
                <p><strong>${new Date(day.dt * 1000).toDateString()}</strong></p>
                <p>🌡️ Temp: ${day.main.temp}°C</p>
                <p>🌥️ ${day.weather[0].description}</p>
            </div>
        `;
    });
}
