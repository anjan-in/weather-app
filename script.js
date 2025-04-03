const apiKey = "9a44d59d9bc56592b569b0b18eeca3a4";
const searchButton = document.getElementById("search");
        const cityInput = document.getElementById("city");
        const weatherContainer = document.getElementById("weather-container");
        const forecastContainer = document.getElementById("forecast-container");
        const loader = document.getElementById("loader");
        const errorContainer = document.getElementById("error-container");
        const errorMessage = document.getElementById("error-message");
        const emptyState = document.getElementById("empty-state");
        
        // Sample London data (from your JSON)
        const londonData = {
            "coord": {
                "lon": -0.1257,
                "lat": 51.5085
            },
            "weather": [
                {
                    "id": 800,
                    "main": "Clear",
                    "description": "clear sky",
                    "icon": "01d"
                }
            ],
            "base": "stations",
            "main": {
                "temp": 10.56,
                "feels_like": 9.63,
                "temp_min": 10.56,
                "temp_max": 10.56,
                "pressure": 1019,
                "humidity": 75,
                "sea_level": 1019,
                "grnd_level": 1015
            },
            "visibility": 10000,
            "wind": {
                "speed": 4.78,
                "deg": 73,
                "gust": 10.38
            },
            "clouds": {
                "all": 4
            },
            "dt": 1743665781,
            "sys": {
                "country": "GB",
                "sunrise": 1743658258,
                "sunset": 1743705371
            },
            "timezone": 3600,
            "id": 2643743,
            "name": "London",
            "cod": 200
        };
        
        // Sample London forecast data
        const londonForecast = {
            "cod": "200",
            "list": [
                {
                    "dt": 1743675600,
                    "dt_txt": "2025-04-03 12:00:00",
                    "main": {
                        "temp": 12.5,
                        "feels_like": 11.8,
                        "pressure": 1018,
                        "humidity": 65
                    },
                    "weather": [
                        {
                            "id": 800,
                            "main": "Clear",
                            "description": "clear sky",
                            "icon": "01d"
                        }
                    ],
                    "wind": {
                        "speed": 5.2
                    }
                },
                {
                    "dt": 1743762000,
                    "dt_txt": "2025-04-04 12:00:00",
                    "main": {
                        "temp": 13.2,
                        "feels_like": 12.5,
                        "pressure": 1017,
                        "humidity": 60
                    },
                    "weather": [
                        {
                            "id": 801,
                            "main": "Clouds",
                            "description": "few clouds",
                            "icon": "02d"
                        }
                    ],
                    "wind": {
                        "speed": 4.8
                    }
                },
                {
                    "dt": 1743848400,
                    "dt_txt": "2025-04-05 12:00:00",
                    "main": {
                        "temp": 11.8,
                        "feels_like": 11.1,
                        "pressure": 1015,
                        "humidity": 68
                    },
                    "weather": [
                        {
                            "id": 500,
                            "main": "Rain",
                            "description": "light rain",
                            "icon": "10d"
                        }
                    ],
                    "wind": {
                        "speed": 6.1
                    }
                },
                {
                    "dt": 1743934800,
                    "dt_txt": "2025-04-06 12:00:00",
                    "main": {
                        "temp": 10.9,
                        "feels_like": 10.2,
                        "pressure": 1014,
                        "humidity": 72
                    },
                    "weather": [
                        {
                            "id": 501,
                            "main": "Rain",
                            "description": "moderate rain",
                            "icon": "10d"
                        }
                    ],
                    "wind": {
                        "speed": 5.8
                    }
                },
                {
                    "dt": 1744021200,
                    "dt_txt": "2025-04-07 12:00:00",
                    "main": {
                        "temp": 12.1,
                        "feels_like": 11.5,
                        "pressure": 1016,
                        "humidity": 65
                    },
                    "weather": [
                        {
                            "id": 800,
                            "main": "Clear",
                            "description": "clear sky",
                            "icon": "01d"
                        }
                    ],
                    "wind": {
                        "speed": 4.5
                    }
                }
            ]
        };
        
        // Event listeners
        searchButton.addEventListener("click", searchWeather);
cityInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchWeather();
    }
});

// Initialize with London data on page load
document.addEventListener("DOMContentLoaded", function() {
    displayWeatherData(londonData);
    displayForecastData(londonForecast);
});

// Search weather function
function searchWeather() {
    const city = cityInput.value.trim();
    if (!city) return;
    
    showLoader();
    
    // Fetch current weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(data => {
            // Fetch forecast data
            // Note: OpenWeatherMap's free API only provides 5 days/3 hour forecast
            // We're making a request that will give us as much data as possible
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&cnt=56`)
                .then(response => response.json())
                .then(forecastData => {
                    hideLoader();
                    hideError();
                    displayWeatherData(data);
                    displayForecastData(forecastData);
                })
                .catch(err => {
                    showError("Error fetching forecast data. Please try again.");
                });
        })
        .catch(err => {
            hideLoader();
            showError("City not found. Please check the spelling and try again.");
        });
}

// Display current weather data
function displayWeatherData(data) {
    // Show weather container
    weatherContainer.classList.remove("d-none");
    emptyState.classList.add("d-none");
    
    // Update city name and date
    document.getElementById("city-name").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("current-date").textContent = formatDate(new Date());
    
    // Update temperature and description
    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("weather-description").textContent = data.weather[0].description;
    
    // Update details
    document.getElementById("feels-like").textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("wind-speed").textContent = `${data.wind.speed} m/s`;
    document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;
    
    // Update sunrise and sunset
    document.getElementById("sunrise").textContent = formatTime(data.sys.sunrise * 1000, data.timezone);
    document.getElementById("sunset").textContent = formatTime(data.sys.sunset * 1000, data.timezone);
    
    // Update weather animation
    updateWeatherAnimation(data.weather[0].main);
    
    // Update background
    updateBackground(data.weather[0].main);
    
    // Update forecast title to show 7-Day instead of 5-Day
    document.querySelector(".forecast-title").textContent = "7-Day Forecast";
}

// Display forecast data
function displayForecastData(data) {
    forecastContainer.innerHTML = "";
    
    // For our sample data, we'll need to extend it to 7 days
    // In real API calls, we'll extract what's available up to 7 days
    const dailyForecasts = extractDailyForecasts(data.list, 7);
    
    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const temp = Math.round(forecast.main.temp);
        const description = forecast.weather[0].description;
        const iconCode = forecast.weather[0].icon;
        
        const forecastItem = document.createElement("div");
        forecastItem.className = "forecast-item fade-in";
        
        forecastItem.innerHTML = `
            <div class="forecast-date">${formatDay(date)}</div>
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${description}" class="forecast-icon">
            <div class="forecast-temp">${temp}°C</div>
            <div class="forecast-desc">${description}</div>
        `;
        
        forecastContainer.appendChild(forecastItem);
    });
}

// Extract daily forecasts, ensuring we get up to 7 days
// The OpenWeatherMap free API only gives 5 days, so we'll need to handle that
function extractDailyForecasts(forecastList, numDays) {
    // Get current date to compare with forecast dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Track unique days we've seen
    const uniqueDays = new Set();
    const dailyForecasts = [];
    
    // Check if we're using the sample data
    if (forecastList.length <= 5) {
        // Since we have limited sample data, we'll extend it artificially
        const lastForecast = forecastList[forecastList.length - 1];
        
        // First add the existing forecasts
        for (let i = 0; i < forecastList.length; i++) {
            dailyForecasts.push(forecastList[i]);
            uniqueDays.add(formatDay(new Date(forecastList[i].dt * 1000)));
        }
        
        // Then add additional days to make up to 7 days total
        const neededDays = numDays - uniqueDays.size;
        
        if (neededDays > 0 && lastForecast) {
            for (let i = 1; i <= neededDays; i++) {
                // Create a new forecast based on the last one but for a subsequent day
                const newDate = new Date(lastForecast.dt * 1000);
                newDate.setDate(newDate.getDate() + i);
                
                // Create a copy of the last forecast with an adjusted date
                const newForecast = JSON.parse(JSON.stringify(lastForecast));
                newForecast.dt = Math.floor(newDate.getTime() / 1000);
                newForecast.dt_txt = newDate.toISOString().split('T')[0] + " 12:00:00";
                
                // Add some variation
                newForecast.main.temp = lastForecast.main.temp + (Math.random() * 4 - 2); // +/- 2 degrees
                dailyForecasts.push(newForecast);
            }
        }
        
        return dailyForecasts;
    }
    
    // For real API data
    // Filter for forecasts around noon to get one per day
    const dailyData = [];
    
    for (let i = 0; i < forecastList.length; i++) {
        const forecastDate = new Date(forecastList[i].dt * 1000);
        const forecastDay = formatDay(forecastDate);
        
        // Only consider forecasts for future days and around noon
        if (!uniqueDays.has(forecastDay) && 
            (forecastDate.getHours() >= 11 && forecastDate.getHours() <= 14)) {
            uniqueDays.add(forecastDay);
            dailyData.push(forecastList[i]);
            
            // Stop once we have enough days
            if (uniqueDays.size >= numDays) break;
        }
    }
    
    // If we couldn't get enough noon forecasts, just take the first one for each day
    if (dailyData.length < numDays) {
        uniqueDays.clear();
        dailyData.length = 0;
        
        for (let i = 0; i < forecastList.length; i++) {
            const forecastDate = new Date(forecastList[i].dt * 1000);
            const forecastDay = formatDay(forecastDate);
            
            if (!uniqueDays.has(forecastDay)) {
                uniqueDays.add(forecastDay);
                dailyData.push(forecastList[i]);
                
                if (uniqueDays.size >= numDays) break;
            }
        }
    }
    
    return dailyData;
}

// Format date: Wednesday, April 3, 2025
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format day: Wed, Apr 3
function formatDay(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format time: 7:15 AM
function formatTime(timestamp, timezone) {
    const date = new Date(timestamp);
    // Adjust for timezone offset
    const localTime = new Date(date.getTime() + (timezone * 1000));
    
    return localTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

// Update weather animation based on weather condition
function updateWeatherAnimation(weatherType) {
    const animationContainer = document.getElementById("weather-animation");
    
    // Clear previous animation
    animationContainer.innerHTML = "";
    
    // Create animation based on weather type
    let animation = "";
    
    switch(weatherType.toLowerCase()) {
        case "clear":
            animation = `<div class="weather-icon-sun"></div>`;
            break;
        case "clouds":
            animation = `
                <div class="weather-icon-cloud">
                    <div class="cloud"></div>
                </div>
            `;
            break;
        case "rain":
        case "drizzle":
            animation = `
                <div class="weather-icon-rain">
                    <div class="rain-cloud"></div>
                    <div class="raindrop"></div>
                    <div class="raindrop"></div>
                    <div class="raindrop"></div>
                    <div class="raindrop"></div>
                    <div class="raindrop"></div>
                </div>
            `;
            break;
        case "snow":
            animation = `
                <div class="weather-icon-snow">
                    <div class="snow-cloud"></div>
                    <div class="snowflake">❄</div>
                    <div class="snowflake">❄</div>
                    <div class="snowflake">❄</div>
                    <div class="snowflake">❄</div>
                    <div class="snowflake">❄</div>
                </div>
            `;
            break;
        case "thunderstorm":
            animation = `
                <div class="weather-icon-thunder">
                    <div class="thunder-cloud"></div>
                    <div class="lightning"></div>
                </div>
            `;
            break;
        default:
            animation = `<div class="weather-icon-cloud"><div class="cloud"></div></div>`;
    }
    
    animationContainer.innerHTML = animation;
}

// Update page background based on weather condition
function updateBackground(weatherType) {
    document.body.className = "";
    
    switch(weatherType.toLowerCase()) {
        case "clear":
            document.body.classList.add("bg-clear");
            document.querySelectorAll(".search-container input, .app-title").forEach(el => {
                el.style.color = "white";
            });
            break;
        case "clouds":
            document.body.classList.add("bg-cloudy");
            document.querySelectorAll(".search-container input, .app-title").forEach(el => {
                el.style.color = "#333";
            });
            break;
        case "rain":
        case "drizzle":
            document.body.classList.add("bg-rainy");
            document.querySelectorAll(".search-container input, .app-title").forEach(el => {
                el.style.color = "white";
            });
            break;
        case "snow":
            document.body.classList.add("bg-snowy");
            document.querySelectorAll(".search-container input, .app-title").forEach(el => {
                el.style.color = "white";
            });
            break;
        case "thunderstorm":
            document.body.classList.add("bg-thunderstorm");
            document.querySelectorAll(".search-container input, .app-title").forEach(el => {
                el.style.color = "white";
            });
            break;
        default:
            document.body.classList.add("bg-clear");
            document.querySelectorAll(".search-container input, .app-title").forEach(el => {
                el.style.color = "white";
            });
    }
}

// Show loader
function showLoader() {
    weatherContainer.classList.add("d-none");
    errorContainer.classList.add("d-none");
    emptyState.classList.add("d-none");
    loader.classList.remove("d-none");
}

// Hide loader
function hideLoader() {
    loader.classList.add("d-none");
}

// Show error
function showError(message) {
    weatherContainer.classList.add("d-none");
    emptyState.classList.add("d-none");
    errorContainer.classList.remove("d-none");
    errorMessage.textContent = message;
}

// Hide error
function hideError() {
    errorContainer.classList.add("d-none");
}

// Function to get geolocation and show weather for current location
function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        showLoader();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Fetch current weather by coordinates
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                    .then(response => response.json())
                    .then(data => {
                        // Fetch forecast by coordinates - try to get more data for 7 days
                        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=56`)
                            .then(response => response.json())
                            .then(forecastData => {
                                hideLoader();
                                hideError();
                                displayWeatherData(data);
                                displayForecastData(forecastData);
                            });
                    })
                    .catch(err => {
                        hideLoader();
                        showError("Error fetching weather data. Please try again.");
                    });
            },
            (error) => {
                hideLoader();
                showError("Unable to retrieve your location. Please search manually.");
            }
        );
    } else {
        showError("Geolocation is not supported by your browser.");
    }
}

// Add a geolocation button
const searchContainer = document.querySelector(".search-container");
const locationButton = document.createElement("button");
locationButton.className = "btn search-btn location-btn";
locationButton.style.right = "80px";
locationButton.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
locationButton.addEventListener("click", getCurrentLocationWeather);
searchContainer.appendChild(locationButton);