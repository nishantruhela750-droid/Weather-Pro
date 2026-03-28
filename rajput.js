const apiKey = '86672f2f23b47daf317d0ffe8d2acbb0';

// App khulte hi automatic location mangega
window.onload = () => getMyLocation();

function getMyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            fetchData(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
        }, () => {
            document.getElementById('cityName').innerText = "Search City";
            document.getElementById('region').innerText = "Location Blocked";
        });
    }
}

function getWeather() {
    const city = document.getElementById('cityInput').value;
    if(city) fetchData(`q=${city}`);
}

async function fetchData(query) {
    try {
        const resW = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`);
        const dataW = await resW.json();
        
        const resF = await fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${apiKey}&units=metric`);
        const dataF = await resF.json();

        if(dataW.cod == 200) updateUI(dataW, dataF);
    } catch (err) {
        alert("Server error! Internet check karein.");
    }
}

function updateUI(current, forecast) {
    // Ab sheher ka naam API se aayega
    document.getElementById('cityName').innerText = current.name;
    document.getElementById('region').innerText = current.sys.country ? `${current.name} • ${current.sys.country}` : current.name;
    document.getElementById('temp').innerText = Math.round(current.main.temp) + "°";
    document.getElementById('mini-desc').innerText = current.weather[0].description;
    
    // Sun times update
    const sunrise = new Date(current.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const sunset = new Date(current.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    document.getElementById('sun-times').innerText = `☀️ ↑ ${sunrise}  ↓ ${sunset}`;

    const container = document.getElementById('forecastContainer');
    container.innerHTML = "";

    for (let i = 0; i < 10; i++) {
        const item = forecast.list[i];
        const time = new Date(item.dt * 1000).getHours() + ":00";
        const temp = Math.round(item.main.temp) + "°";
        const rain = Math.round(item.pop * 100);
        const icon = item.weather[0].icon;

        container.innerHTML += `
            <div class="hour-item">
                <p>${time}</p>
                <h3>${temp}</h3>
                <img src="https://openweathermap.org/img/wn/${icon}.png">
                <span class="rain-info">💧 ${rain}%</span>
            </div>
        `;
    }
}
