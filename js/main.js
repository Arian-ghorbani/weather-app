const htmlElem = document.documentElement;
// Theme
const themeBtn = document.querySelector("#theme-btn");
let colorTheme = null;

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

const pageLoaded = () => {
  // Theme
  getThemeLocalStorage();
};

// Theme
themeBtn.addEventListener("click", changeTheme);
window.addEventListener("DOMContentLoaded", pageLoaded);