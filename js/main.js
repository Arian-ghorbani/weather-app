// ====== DOM ======
const htmlElem = document.documentElement;
const backgroundElem = document.querySelector(".background");
const mainElem = document.querySelector("#main");
const searchBtn = document.querySelector(".search-btn");
const inputCityName = document.querySelector("#input-city");
const cityNameElem = document.querySelector(".city-wrapper");
const searchStatusElem = document.querySelector(".search-status");
const searchStatusTitleElem = document.querySelector(".status-title");
const mainContentElem = document.querySelector(".main-content");
const infoBtn = document.querySelector("#info-btn");
const infoContainer = document.querySelector(".info-container");
const dateElem = document.querySelector(".date");

// Weather info
const cityElem = document.querySelector("#city-name");
const tempElem = document.querySelector(".temp");
const humidityElem = document.querySelector(".humidity");
const windElem = document.querySelector(".wind");
const pressureElem = document.querySelector(".pressure");
const tempIconWrapper = document.querySelector(".temp-icon-wrapper");

// API
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "f2a3b99194244950f22614868d9f6217";

// Animation
const addAnimation = () => {
  main.classList.add("opacity-100");
};

// ====== Theme ======
const backgroundChange = () => {
  const h = new Date().getHours();

  const theme = h >= 6 && h < 12
    ? ["#0084D1", "#00BCFF"]
    : h >= 12 && h < 20
      ? ["#f54a00", "#ff8904"]
      : h >= 20
        ? ["#030712", "#101828"]
        : ["#030712", "#101828"];

  htmlElem.style.setProperty("--color-primary", theme[0]);
  htmlElem.style.setProperty("--color-secondary", theme[1]);
};

// ====== Date ======
const updateDate = () => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const d = new Date();
  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];

  dateElem.textContent = `${day}, ${date} ${month}`;
};

// ====== Weather API ======
const hideError = () => {
  searchStatusElem.classList.add("hidden");
  cityNameElem.classList.remove("hidden");
  mainContentElem.classList.remove("hidden");
};

const showError = () => {
  searchStatusElem.classList.remove("hidden");
  searchStatusTitleElem.textContent = "Location not found";
  cityNameElem.classList.add("hidden");
  mainContentElem.classList.add("hidden");
};

const updateWeatherUI = ({ city, temp, humidity, wind, pressure, condition }) => {
  cityElem.textContent = city;
  tempElem.textContent = `${temp}`;
  humidityElem.textContent = `${humidity}%`;
  windElem.textContent = `${wind} km/h`;
  pressureElem.textContent = `${pressure} hpa`;

  const icons = {
    clear: '<iconify-icon icon="si:sun-fill" class="icon"></iconify-icon>',
    clouds: '<iconify-icon icon="ic:round-cloud" class="icon"></iconify-icon>',
    rain: '<iconify-icon icon="bi:cloud-rain-fill" class="icon"></iconify-icon>',
    snow: '<iconify-icon icon="bi:cloud-snow-fill" class="icon"></iconify-icon>',
    storm: '<iconify-icon icon="famicons:thunderstorm" class="icon"></iconify-icon>',
    wind: '<iconify-icon icon="fa-solid:wind" class="icon"></iconify-icon>',
  };

  tempIconWrapper.innerHTML = icons[condition] || icons["clear"];
};

const getWeatherAPI = async () => {
  const city = inputCityName.value.trim();
  if (!city) return;

  main.classList.remove("opacity-100");

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

    setTimeout(() => {
      updateWeatherUI(weatherData);
      updateDate();
      hideError();
    }, 200);
  } catch (err) {
    showError();
  } finally {
    setTimeout(() => { addAnimation() }, 200);
  }
};

// ====== Developer Info ======
infoBtn.addEventListener("click", () => infoContainer.classList.remove("hidden"));
infoContainer.addEventListener("click", (e) => {
  if (e.target === infoContainer) infoContainer.classList.add("hidden");
});

// ====== Init ======
window.addEventListener("DOMContentLoaded", () => {
  backgroundChange();
  addAnimation();
});

// ====== Events ======
searchBtn.addEventListener("click", getWeatherAPI);
inputCityName.addEventListener("keyup", (e) => e.key === "Enter" && getWeatherAPI());