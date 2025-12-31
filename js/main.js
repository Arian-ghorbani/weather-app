// ====== DOM ======
const htmlElem = document.documentElement;
// Header
const searchBtn = document.querySelector(".search-btn");
const inputCityName = document.querySelector("#input-city");
// City name section
const cityNameElem = document.querySelector(".city-wrapper");
// Search status section
const searchStatusElem = document.querySelector(".search-status");
const searchStatusTitleElem = document.querySelector(".status-title");
// Main data section
const mainContentElem = document.querySelector(".main-content");
const infoBtn = document.querySelector("#info-btn");
const infoContainer = document.querySelector(".info-container");
const dateElem = document.querySelector(".date");
const suggestionForUserElem = document.querySelector(".suggestion-for-user");
// AI section
const aiBtn = document.querySelector("#ai-btn");
const chatContainerElem = document.querySelector(".chat-container");
const closeChatBtn = document.querySelector(".closex-btn");
const chatBodyElem = document.querySelector(".chat-body");
const chatbotSendBtn = document.querySelector(".chatbot-send-btn");
const chatbotInput = document.querySelector("#chatbot-input");

// Weather info
const cityElem = document.querySelector("#city-name");
const tempElem = document.querySelector(".temp");
const humidityElem = document.querySelector(".humidity");
const windElem = document.querySelector(".wind");
const pressureElem = document.querySelector(".pressure");
const tempIconWrapper = document.querySelector(".temp-icon-wrapper");
let weatherData = null;

// API
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "f2a3b99194244950f22614868d9f6217";
const AI_BASE_URL = "https://router.huggingface.co/v1/chat/completions";

// Search loader
const showSearchLoading = () => {
  searchBtn.innerHTML = '<iconify-icon icon="mingcute:loading-fill" class="icon animate-spin"></iconify-icon>';
};

const hideSearchLoading = () => {
  searchBtn.innerHTML = '<iconify-icon icon="mingcute:search-3-line" class="icon"></iconify-icon>';
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

const showError = (message) => {
  searchStatusElem.classList.remove("hidden");
  searchStatusTitleElem.textContent = message;
  cityNameElem.classList.add("hidden");
  mainContentElem.classList.add("hidden");
};

const updateWeatherUI = async ({ city, temp, humidity, wind, pressure, condition }) => {
  const message = `بر اساس این اطلاعات، در چند کلمه، خیلی خلاصه و متن شکسته نباشه، به من پیشنهاد بده امروز چه نکاتی را رعایت کنم.`;
  const suggestionForTheUser = await getAIAPI(message);
  suggestionForUserElem.textContent = suggestionForTheUser;

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
  if (!navigator.onLine) return showError("You are offline");
  const city = inputCityName.value.trim();
  if (!city) return;

  showSearchLoading();

  try {
    const url = `${BASE_URL}?q=${city}&appid=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    weatherData = {
      city,
      temp: Math.round(data.main.temp - 273.15),
      humidity: data.main.humidity,
      wind: data.wind.speed,
      pressure: data.main.pressure,
      condition: data.weather[0].main.toLowerCase(),
    };

    await updateWeatherUI(weatherData);
    updateDate();
    hideError();
  } catch (err) {
    showError("Location not found");
  } finally {
    hideSearchLoading();
  }
};

// ====== Chatbot ======
const createMessageElem = (message, elemClass) => {
  const userMessage = `<div class="text-message">${message}</div>`;
  const divElem = document.createElement("div");
  divElem.classList.add(elemClass);
  divElem.innerHTML = userMessage;
  return divElem;
};

const addMessageElem = (element) => {
  chatBodyElem.appendChild(element);

  setTimeout(() => {
    const icons = {
      botIcon: '<iconify-icon icon="bxs:bot" class="ai-icon"></iconify-icon>',
      messageIcon: '<iconify-icon icon="svg-spinners:3-dots-scale" class="icon"></iconify-icon>',
    };
    const aiMessageElem = createMessageElem(icons.messageIcon, "ai-message");
    aiMessageElem.innerHTML += icons.botIcon;
    chatBodyElem.appendChild(aiMessageElem);
  }, 500);
};


// ====== AI API ======
const getAIAPI = async (userMessage) => {
  const messages = [
    {
      role: "system",
      content: `تو یک دستیار هواشناسی در یک برنامه هواشناسی هستی و بر اساس اطلاعات هواشناسی امروز: شهر: ${weatherData.city}، دما: ${weatherData.temp}°C، رطوبت: ${weatherData.humidity}%، سرعت باد: ${weatherData.wind} km/h، فشار هوا: ${weatherData.pressure} hpa، وضعیت هوا: ${weatherData.condition}. به فارسی جواب  میدهی و از اصطلاحات ساده، دوستانه و محاوره‌ای استفاده کن. از گفتن «سلام»، «درود» و هر نوع خوش‌آمدگویی در پاسخ‌ها خودداری کن مگر اینکه کاربر اولین پیام را ارسال کرده باشد.
      `
    },
    {
      role: "user",
      content: userMessage
    }
  ];

  const res = await fetch(AI_BASE_URL, {
    headers: {
			"Authorization": `Bearer ${AI_API_KEY}`,
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({
      messages,
      "model": "openai/gpt-oss-120b",
      "stream": false
    }),
  });

  try {
    const data = await res.json();
    responseMessage = data.choices[0].message.content;
    return responseMessage;
  } catch (error) {
    console.log(error);
  }
};

const showChatbotData = async (userMessage) => {
  if (!weatherData) return;
  const message = await getAIAPI(userMessage);
  chatBodyElem.lastElementChild.querySelector(".text-message").innerHTML = marked.parse(message);
};

const sentMessage = () => {
  const userMessage = chatbotInput.value.trim();
  if (userMessage) {
    const userElem = createMessageElem(userMessage, "user-message");
    addMessageElem(userElem);
    showChatbotData(userMessage);
    chatbotInput.value = "";
  }
};

// ====== Developer Info ======
infoBtn.addEventListener("click", () => infoContainer.classList.remove("hidden"));
infoContainer.addEventListener("click", (e) => {
  if (e.target === infoContainer) infoContainer.classList.add("hidden");
});

// ====== Chatbot ======
aiBtn.addEventListener("click", (e) => {
  // Show chatbot
  if (aiBtn && e.target.closest("#ai-btn")) chatContainerElem.classList.add("open");
});

closeChatBtn.addEventListener("click", (e) => {
  // Hide chatbot
  if (closeChatBtn && e.target.closest(".closex-btn")) chatContainerElem.classList.remove("open");
});

chatbotSendBtn.addEventListener("click", sentMessage);

chatbotInput.addEventListener("keyup", (e) => { if (e.key === "Enter") sentMessage() });

// ====== Events ======
searchBtn.addEventListener("click", getWeatherAPI);
inputCityName.addEventListener("keyup", (e) => e.key === "Enter" && getWeatherAPI());