const htmlElem = document.documentElement;
// Theme
const themeBtn = document.querySelector("#theme-btn");
let colorTheme = null;
// Weather API
const inputCityName = document.querySelector("#input-city");
const searchBtn = document.querySelector(".search-btn");
const baseURL = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "f2a3b99194244950f22614868d9f6217";

// Theme
const getThemeLocalStorage = () => {
  colorTheme = localStorage.getItem("color-theme");

  if (colorTheme === "dark") {
    htmlElem.classList.add("dark");
  } else {
    htmlElem.classList.remove("dark");
  }
};

const saveThemeLocalStorage = () => {
  localStorage.setItem("color-theme", colorTheme);
};

const changeTheme = () => {
  if (!htmlElem.className.includes("dark")) {
    htmlElem.classList.add("dark");
    colorTheme = "dark";
  } else {
    htmlElem.classList.remove("dark");
    colorTheme = "light";
  }

  saveThemeLocalStorage();
};

// Weather API
const inputDataWeather = (city, temp, humidity, wind, pressure) => {
  const cityElem = document.querySelector("#city-name");
  const tempElem = document.querySelector(".temp");
  const humidityElem = document.querySelector(".humidity");
  const windElem = document.querySelector(".wind");
  const pressureElem = document.querySelector(".pressure");

  cityElem.innerHTML = `${city}`;
  tempElem.innerHTML = `${temp}°C`;
  humidityElem.innerHTML = `${humidity}%`;
  windElem.innerHTML = `${wind} km/h`;
  pressureElem.innerHTML = `${pressure} hpa`;
};

const getWeatherAPI = async () => {
  const cityName = inputCityName.value.trim();
  const response = await fetch(`${baseURL}?q=${cityName}&appid=${apiKey}`);
  const data = await response.json();

  const city = data.name;
  const temp = Math.floor(data.main.temp - 273.15);
  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  const pressure = data.main.pressure;

  inputDataWeather(city, temp, humidity, wind, pressure);
};

const pageLoaded = () => {
  // Theme
  getThemeLocalStorage();
};

// Theme
themeBtn.addEventListener("click", changeTheme);
// Search API
searchBtn.addEventListener("click", getWeatherAPI);
inputCityName.addEventListener("keyup", (event) => {event.key === "Enter" && getWeatherAPI()});

window.addEventListener("DOMContentLoaded", pageLoaded);