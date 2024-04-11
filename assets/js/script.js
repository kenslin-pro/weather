var APIKey = "d217e3b73f1e7ff0e4fe5a0df359759d";
let cityList = [];

// Get Geocode from API
function getCode(city) {
    const queryURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIKey + "&units=metric";

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            const lat = data[0].lat;
            const lon = data[0].lon;
            getWeatherData(lat, lon);
        })
        .catch(function (error) {
            console.error('Error fetching weather data:', error);
        });
}

// Use Geo code to get weather data from API
function getWeatherData(lat, lon) {
    const queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=metric";

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            displayWeatherToday(data);
            displayForecast(data);
        })
        .catch(function (error) {
            console.error('Error fetching weather data:', error);
        });
}

// Search for a city
$(document).ready(function () {
    $('#search-button').on('click', function (event) {
        event.preventDefault();
        const cityLocation = $('#search-input').val();
        console.log(cityLocation);
        cityList.push(cityLocation);
        renderInput();
        getCode(cityLocation);

        return false; // Prevent default form submission
    });
});

function renderInput() {
    $('#history-list').empty(); 

    for (var i = 0; i < cityList.length; i++) {
        const cityButton = $('<li>')
            .text(cityList[i])
            .addClass('list-group-item list-group-item-action ms-2')
            .on('click', function() {
                const cityName = $(this).text();
                getCode(cityName);
            });

        $('#history-list').append(cityButton);
    }

    storeCityList();
}
function storeCityList() {
    localStorage.setItem('city-names', JSON.stringify(cityList));
}

// Display today's weather
function displayWeatherToday(data) {
    const todaySection = $('#today');
    todaySection.empty(); // Clear previous content

    const locationName = data.city.name;
    const temperature = data.list[0].main.temp;
    const wind = data.list[0].wind.speed;
    const humidity = data.list[0].main.humidity;
    const weatherIcon = data.list[0].weather[0].icon;

    const content = `
        <div class="p-4 bg-dark text-white rounded-3">
            <h2 class="h2">${locationName}</h2><img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
            <p>Temperature: ${temperature}°C</p>
            <p>Wind Speed: ${wind} m/s</p>
            <p>Humidity: ${humidity}%</p>
        </div>
        <br>
    `;

    todaySection.append(content);
}

function displayForecast(data) {
    const forecastSection = $('#forecast');
    forecastSection.empty(); // Clear previous content

    const heading = `
    <div class="w-100 px-4">
    <h2 class="h2 text-white">5-days Forecast</h2>
    </div>
    `;
    forecastSection.append(heading);

    for (let i = 1; i < data.list.length; i += 8) {
        const forecastItem = data.list[i];
        const forecastDate = forecastItem.dt_txt;
        const forecastTemp = forecastItem.main.temp;
        const forecastHumidity = forecastItem.main.humidity;
        const weatherIcon = forecastItem.weather[0].icon;

        const forecastContent = `
        <div class="col mb-3">
        <div class="card text-white">
          <div class="card-body rounded-3">
            <h3 class="h3">${dayjs(forecastDate).format('DD/MM/YYYY')}</h3>
            <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
            <p>Temperature: ${forecastTemp}°C</p>
            <p>Humidity: ${forecastHumidity}%</p>
          </div>
        </div>
        </div>
        `;

        forecastSection.append(forecastContent);
    }
}