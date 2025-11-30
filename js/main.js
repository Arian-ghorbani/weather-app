// ====== Cache DOM ======
const htmlElem = document.documentElement;
const themeBtn = document.querySelector("#theme-btn");
const searchBtn = document.querySelector(".search-btn");
const inputCityName = document.querySelector("#input-city");
const cityNameElem = document.querySelector(".city-wrapper");
const searchStatusElem = document.querySelector(".search-status");
const searchStatusTitleElem = document.querySelector(".status-title");
const searchContentElem = document.querySelector(".search-content");
const infoBtn = document.querySelector("#info-btn");
const infoContainer = document.querySelector(".info-container");

// Weather elements cached once
const cityElem = document.querySelector("#city-name");
const tempElem = document.querySelector(".temp");
const humidityElem = document.querySelector(".humidity");
const windElem = document.querySelector(".wind");
const pressureElem = document.querySelector(".pressure");
const conditionImgElem = document.querySelector(".condition-weather-img");

// API
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "f2a3b99194244950f22614868d9f6217";

// ====== Theme System ======
const iconsTheme = {
  light: `<iconify-icon icon="tabler:sun" class="icon"></iconify-icon>`,
  dark: `<iconify-icon icon="tabler:moon-stars" class="icon"></iconify-icon>`,
};

const applyThemeIcon = (theme) => {
  themeBtn.innerHTML = theme === "dark" ? iconsTheme.light : iconsTheme.dark;
};

const loadTheme = () => {
  const saved = localStorage.getItem("color-theme") || "light";
  saved === "dark"
    ? htmlElem.classList.add("dark")
    : htmlElem.classList.remove("dark");

  applyThemeIcon(saved);
};

const toggleTheme = () => {
  const isDark = htmlElem.classList.toggle("dark");
  const theme = isDark ? "dark" : "light";
  localStorage.setItem("color-theme", theme);
  applyThemeIcon(theme);
};

// ====== Weather API ======

const hideError = () => {
  searchStatusElem.classList.add("hidden");
  cityNameElem.classList.remove("hidden");
  searchContentElem.classList.remove("hidden");
};

const showError = () => {
  searchStatusElem.classList.remove("hidden");
  searchStatusTitleElem.textContent = "Location not found";
  cityNameElem.classList.add("hidden");
  searchContentElem.classList.add("hidden");
};

const updateWeatherUI = ({ city, temp, humidity, wind, pressure, condition }) => {
  cityElem.textContent = city;
  tempElem.textContent = `${temp}°C`;
  humidityElem.textContent = `${humidity}%`;
  windElem.textContent = `${wind} km/h`;
  pressureElem.textContent = `${pressure} hpa`;

  const icons = {
    clear: "./assets/image/clearly.png",
    clouds: "./assets/image/cloudy.png",
    rain: "./assets/image/rainy.png",
    snow: "./assets/image/snowy.png",
    storm: "./assets/image/stormy.png",
    wind: "./assets/image/windy.png",
  };

  conditionImgElem.src = icons[condition] || icons["clouds"];
};

const getWeatherAPI = async () => {
  const city = inputCityName.value.trim();
  if (!city) return;

  try {
    const url = `${BASE_URL}?q=${city}&appid=${API_KEY}`;
    const res = await fetch(url);

    if (!res.ok) return showError();

    const data = await res.json();

    const weatherData = {
      city: data.name,
      temp: Math.round(data.main.temp - 273.15),
      humidity: data.main.humidity,
      wind: data.wind.speed,
      pressure: data.main.pressure,
      condition: data.weather[0].main.toLowerCase(),
    };

    updateWeatherUI(weatherData);
    hideError();
  } catch (err) {
    showError();
  }
};

// ====== Clock ======
const startClock = () => {
  setInterval(() => {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    const s = String(d.getSeconds()).padStart(2, "0");
    document.querySelector(".clock").textContent = `${h}:${m}:${s}`;
  }, 1000);
};

// ====== Developer Info ======
infoBtn.addEventListener("click", () => infoContainer.classList.remove("hidden"));
infoContainer.addEventListener("click", (e) => {
  if (e.target === infoContainer) infoContainer.classList.add("hidden");
});

// ====== Init ======
window.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  startClock();
});

// ====== Events ======
themeBtn.addEventListener("click", toggleTheme);
searchBtn.addEventListener("click", getWeatherAPI);
inputCityName.addEventListener("keyup", (e) => e.key === "Enter" && getWeatherAPI());