const apiKey = "86324218206d7e974e1d70e633215234";

window.onload = function() {
    // Pehle browser se location mangega
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=metric&appid=${apiKey}`;
                fetch(url).then(res => res.json()).then(data => displayWeather(data));
            },
            () => getWeatherData("Delhi") // Agar user mana kare toh Delhi dikhao
        );
    } else {
        getWeatherData("Delhi");
    }
};

function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetch(url).then(res => res.json()).then(data => {
        if(data.cod === 200) displayWeather(data);
        else alert("City not found!");
    });
}

function displayWeather(data) {
    // Yahan undefined fix kiya gaya hai
    document.getElementById("cityName").innerText = data.name;
    document.getElementById("tempDisplay").innerText = Math.round(data.main.temp) + "°C";
    document.getElementById("description").innerText = data.weather[0].description;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

// Search button click karne par
document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityInput").value;
    if(city) getWeatherData(city);
});
