const WeatherApp = class {
    constructor(apikey, resultBlockSelector) {
        this.apikey = apikey;
        this.resultBlock = document.querySelector(resultBlockSelector);

        this.currentWeatherLink = `https://api.openweathermap.org/data/2.5/weather?q={query}&appid=${apikey}&units=metric&lang=pl`;
        this.forecastLink = `https://api.openweathermap.org/data/2.5/forecast?q={query}&appid=${apikey}&units=metric&lang=pl`;

        this.currentWeather = undefined;
        this.forecast = undefined;
    }

    getCurrentWeather(query) {
        let url = this.currentWeatherLink.replace("{query}", query);
        let req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.addEventListener("load", () => {
            if (req.status === 200) {
                this.currentWeather = JSON.parse(req.responseText);
                console.log(this.currentWeather);
                this.drawWeather();
            } else {
                alert("Błąd podczas pobierania danych aktualnej pogody.");
            }
        });
        req.send();
    }

    getForecast(query) {
        let url = this.forecastLink.replace("{query}", query);
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Błąd podczas pobierania prognozy pogody.");
                }
                return response.json();
            })
            .then((data) => {
                this.forecast = data; // Przypisujemy cały obiekt
                console.log(this.forecast);
                this.drawWeather();
            })
            .catch((error) => {
                console.error("Wystąpił błąd:", error.message);
            });
    }

    getWeather(query) {
        this.resultBlock.innerHTML = ""; 
        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    drawWeather() {
        if (this.currentWeather) {
            const date = new Date(this.currentWeather.dt * 1000);
            const weatherBlock = this.createWeatherBlock(
                `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`,
                this.currentWeather.main.temp,
                this.currentWeather.main.feels_like,
                this.currentWeather.weather[0].icon,
                this.currentWeather.weather[0].description
            );
            this.resultBlock.appendChild(weatherBlock);
        }
    
        if (this.forecast && this.forecast.list) { // Dodany warunek sprawdzający obecność listy
            this.forecast.list.forEach((item) => {
                const date = new Date(item.dt * 1000);
                const weatherBlock = this.createWeatherBlock(
                    `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`,
                    item.main.temp,
                    item.main.feels_like,
                    item.weather[0].icon,
                    item.weather[0].description
                );
                this.resultBlock.appendChild(weatherBlock);
            });
        }
    }

   

    createWeatherBlock(dataString, temp, feelslike, iconName, desc) {
        const weatherBlock = document.createElement("div");
        weatherBlock.className = "weather-block";

        const dateBlock = document.createElement("div");
        dateBlock.className = "weather-date";
        dateBlock.innerHTML = dataString;
        weatherBlock.appendChild(dateBlock);

        const tempBlock = document.createElement("div");
        tempBlock.className = "weather-temp";
        tempBlock.innerHTML = `${temp} &deg;C`;
        weatherBlock.appendChild(tempBlock);

        const feelsBlock = document.createElement("div");
        feelsBlock.className = "weather-feels";
        feelsBlock.innerHTML = `Feel: ${feelslike} &deg;C`;
        weatherBlock.appendChild(feelsBlock);

        const iconBlock = document.createElement("img");
        iconBlock.className = "weather-icon";
        iconBlock.src = `https://openweathermap.org/img/wn/${iconName}@2x.png`;
        weatherBlock.appendChild(iconBlock);

        const descriptionBlock = document.createElement("div");
        descriptionBlock.className = "weather-description";
        descriptionBlock.innerHTML = desc;
        weatherBlock.appendChild(descriptionBlock);

        return weatherBlock;
    }
};

document.weatherApp = new WeatherApp("jakiś alarm sie włączył jak udostepnilem klucz api haha", "#weather-results-container");
document.querySelector("#checkButton").addEventListener("click", function () {
    const query = document.querySelector("#locationInput").value;
    document.weatherApp.getWeather(query);
});
