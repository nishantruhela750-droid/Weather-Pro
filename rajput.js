const apiKey = "86324218206d7e974e1d70e633215234"; 

// 1. Page load hote hi User ki Location mangne ke liye
window.onload = function() {
    if (navigator.geolocation) {
        // Browser se current position mangna
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        console.log("Geolocation support nahi karti.");
        getWeatherData("Delhi"); // Default city
    }
};

// Agar user location 'Allow' kar deta hai
function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    
    // Coordinates ke base par API URL
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(err => console.error("Error:", err));
}

// Agar user location 'Block' kar deta hai
function error() {
    console.log("Location access denied by user.");
    getWeatherData("Delhi"); // Default city dikhao
}

// City Name se weather search karne ka function
function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if(data.cod === "404") {
                alert("City ka naam sahi likhein!");
                return;
            }
            displayWeather(data);
        })
        .catch(err => console.error("Error:", err));
}

// UI par weather data dikhane ka logic
function displayWeather(data) {
    // Note: Ye classes aapke index.html ki classes se match honi chahiye
    const cityElement = document.querySelector(".city-name") || document.querySelector(".location-name");
    const tempElement = document.querySelector(".temp") || document.querySelector(".temperature");
    const descElement = document.querySelector(".description") || document.querySelector(".weather-condition");
    const iconElement = document.querySelector(".weather-icon");

    if(cityElement) cityElement.innerText = data.name;
    if(tempElement) tempElement.innerText = Math.round(data.main.temp) + "°C";
    if(descElement) descElement.innerText = data.weather[0].description;
    
    if(iconElement) {
        const iconCode = data.weather[0].icon;
        iconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    }

    console.log("Weather updated for:", data.name);
}

// Search button aur input field ka logic
const searchBtn = document.querySelector(".search-btn") || document.querySelector("#searchBtn");
const searchInput = document.querySelector(".search-input") || document.querySelector("#cityInput");

if(searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
        const city = searchInput.value;
        if (city) {
            getWeatherData(city);
        }
    });
}
