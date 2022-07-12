//Date features
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let currentMonth = months[date.getMonth()];
  let currentYear = date.getFullYear();
  let currentDate = date.getDate();
  return `${day}, ${currentDate} ${currentMonth} ${currentYear}, ${hours}:${minutes}`;
}

//Days for forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

//Forecast engine
function displayForecast(response) {
  let forecast = response.data.daily;
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="card-deck" >`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="card shadow-sm" >
              <div class="card-body">
                <h5 class="card-title">${formatDay(forecastDay.dt)}</h5>
                <p class="card-text">
                  <span class="temperature-forecast-max">${Math.round(
                    forecastDay.temp.max
                  )} |</span>
                  <span class="temperature-forecast-min"> ${Math.round(
                    forecastDay.temp.min
                  )}</span>
                </p>
              </div>
              <img src="${displayImage(
                forecastDay.weather[0].icon
              )}" alt="" class="img-forecast" />
            </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//Get forecast from API
function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "85ede89f59356b77be6fb516773c248a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

//CangeImage
function displayImage(icon) {
  let iconPath = "";
  if (icon === `01d` || icon === "01n") {
    iconPath = "images/clearSky.png";
  } else if (icon === `02d` || icon === "02n") {
    iconPath = "images/fewClouds.png";
  } else if (icon === `03d` || icon === `03n`) {
    iconPath = "images/scatteredClouds.png";
  } else if (icon === `04d` || icon === `04n`) {
    iconPath = "images/brokenClouds.png";
  } else if (icon === `09d` || icon === `09n`) {
    iconPath = "images/showerRain.png";
  } else if (icon === `10d` || icon === `10n`) {
    iconPath = "images/rain.png";
  } else if (icon === `11d` || icon === `11n`) {
    iconPath = "images/thunderstorm.png";
  } else if (icon === `13d` || icon === `13n`) {
    iconPath = "images/snow.png";
  } else if (icon === `50d` || icon === `50n`) {
    iconPath = "images/mist.png";
  } else {
    iconPath = "images/clearSky.png";
  }

  return iconPath;
}

//Main functiom about temperature
function displayTemperature(response) {
  console.log(response.data);
  let temperatureElement = document.querySelector("#todayTemp");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let countryElement = document.querySelector("#country");
  let dateElement = document.querySelector("#date");

  let description = document.querySelector("#weather-description");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.ceil(response.data.wind.speed);
  countryElement.innerHTML = response.data.sys.country;
  description.innerHTML = response.data.weather["0"].main;
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  let image = document.querySelector("#icon");
  let icon = response.data.weather["0"].icon;

  image.setAttribute("src", displayImage(icon));

  getForecast(response.data.coord);
}

//City search form
function search(city) {
  let apiKey = "85ede89f59356b77be6fb516773c248a";

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayTemperature);
}
function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

//Change units
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#todayTemp");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;

  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}
function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#todayTemp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
}

//Current Location button

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
function searchLocation(position) {
  let apiKey = "85ede89f59356b77be6fb516773c248a";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayTemperature);
}

let celsiusTemperature = null;
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);
let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

search("Kyiv");
