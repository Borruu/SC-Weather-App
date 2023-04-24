// const apiKey = "bc5ca568ee2d7c71357ca430a3ff8705";
const apiKey = "036182605aa974c0da6a0423afbb7cc0";

var units = "metric";
var unit_text = "°C";

// Get forecast using coordinates
function getForecast(coordinates) {
  console.log(coordinates);
  let forecastUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  //   let forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(forecastUrl).then(displayForecast);
}
//Show forecast for 6 days
function displayForecast(response) {
  console.log(response);
  let forecast = response.data.daily;
  var forecastElement = document.querySelector("#forecast");
  var forecastHTML = `<div class="row week">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2"><div class="forecast-day">${formatFCDay(
          forecastDay.dt
        )}</div><div>
                <img class="forecast-week-icon" src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png" width=60px/></div>
                
                <div class="forecast-temp"><span class="forecast-temp-max">${Math.round(
                  forecastDay.temp.max
                )}°</span> <span class="forecast-temp-min">${Math.round(
          forecastDay.temp.min
        )}°</span>
                </div>
              </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
//Turn timestamp into weekdays
function formatFCDay(timestamp) {
  let fcDate = new Date(timestamp * 1000);
  let fcDay = fcDate.getDay();
  let fcDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return fcDays[fcDay];
}
//City display from search bar input, then run function to search URL
function searchGo(city) {
  //   let apiKey = "c95d60a1e3adbeb286133f1ebebc2579";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  console.log(weatherUrl);
  axios.get(weatherUrl).then(showRealTemp);
}
// Event handler for search bar input
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchGo(city);
}
// Event listener search bar
let go = document.querySelector(".location");
go.addEventListener("submit", handleSubmit);

// Update HTML with current weather for searched city, then invoke getForecast with coordinates
function showRealTemp(response) {
  console.log(response);
  celTemp = response.data.main.temp;
  let currentTemp = Math.round(response.data.main.temp);
  //need to add an error message here when city is not found
  primaryTemp.innerHTML = `${currentTemp}${unit_text}`;
  document.querySelector("#city-in").innerHTML = `${response.data.name}`;
  document.querySelector(
    "#descr"
  ).innerHTML = `${response.data.weather[0].description}`;
  console.log(response.data.wind.speed);
  //   document.querySelector("#wind-sp").innerHTML = `Wind: ${Math.round(
  //     response.data.wind.speed
  //   ).toString()}km p/h`;
  let iconElementMain = document.querySelector("#main-img");
  iconElementMain.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  getForecast(response.data.coord);
}

let primaryTemp = document.querySelector("#right-now-temp");

// Celsius units selected
function updatePrimaryTempCel(event) {
  event.preventDefault();
  units = "metric";
  unit_text = "°C";
  if (celTemp === null) {
    alert("Try searching for a location or click Show Location button");
  } else {
    selectCelsius.classList.add("active");
    selectFahren.classList.remove("active");
    // primaryTemp.innerHTML = `${Math.round(celTemp)}°C`;
    let city = document.querySelector("#city-in").innerHTML;
    console.log(city);
    searchGo(city);
  }
}
// Farenheit units selected
function updatePrimaryTempFh(event) {
  event.preventDefault();
  units = "imperial";
  unit_text = "°F";
  if (celTemp === null) {
    alert("Try searching for a location or click Show Location button");
  } else {
    selectFahren.classList.add("active");
    selectCelsius.classList.remove("active");
    // let fhTemp = (celTemp * 9) / 5 + 32;
    // primaryTemp.innerHTML = `${Math.round(fhTemp)}°F`;
    let city = document.querySelector("#city-in").innerHTML;
    console.log(city);
    searchGo(city);
  }
}
// Event listeners for Celsius/Farenheit unit selected
let selectCelsius = document.querySelector("#cel-link");
selectCelsius.addEventListener("click", updatePrimaryTempCel);
let selectFahren = document.querySelector("#fh-link");
selectFahren.addEventListener("click", updatePrimaryTempFh);

// Display coordinates of current location and invoke
function showPosition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let showLat = document.querySelector("#response-lat");
  let showLong = document.querySelector("#response-long");
  showLat.innerHTML = `${lat}`;
  showLong.innerHTML = `${long}`;
  //   let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=${units}`;
  console.log(weatherUrl);
  axios.get(weatherUrl).then(showRealTempLocation);
}
// Event handler for 'Show my location' button
function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
// Event listener for 'Show my location' button
let showCoord = document.querySelector("#button-coord");
showCoord.addEventListener("click", getCurrentPosition);

// Update main deisplay with current location weather and invoke getForecast
function showRealTempLocation(response) {
  celTemp = response.data.main.temp;
  let currentTemp = Math.round(response.data.main.temp);
  primaryTemp.innerHTML = `${currentTemp}${unit_text}`;
  let h2City = document.querySelector("#city-in");
  h2City.innerHTML = `${response.data.name}`;
  document.querySelector(
    "#descr"
  ).innerHTML = `${response.data.weather[0].description}`;
  console.log(response.data.wind.speed);
  //   document.querySelector("#wind-sp").innerHTML = `Wind: ${Math.round(
  //     response.data.wind.speed
  //   )}km p/h`;
  let iconElementMain = document.querySelector("#main-img");
  iconElementMain.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  getForecast(response.data.coord);
}

let celTemp = null;
//
//Date & time
let now = new Date();
let hh = now.getHours();
if (hh < 10) {
  hh = `0${hh}`;
}
let mm = now.getMinutes();
if (mm < 10) {
  mm = `0${mm}`;
}
let date = now.getDate();
let year = now.getFullYear();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
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
let month = months[now.getMonth()];
let h3Time = document.querySelector("#time");
h3Time.innerHTML = `${day}, ${month} ${date}`;
let h4Hours = document.querySelector("#hours");
h4Hours.innerHTML = `${hh}:${mm}`;

// Default search on start up
searchGo("Cairo");
// displayForecast();
