const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const mobileMenu = document.querySelector(".mobile-menu");
const themeToggleBtn = document.getElementById("theme-toggle-btn");

const languageOptions = document.querySelectorAll("[data-lang]");
const currentYearElements = document.querySelectorAll("#current-year");
const toast = document.getElementById("toast");
const toastMessage = document.querySelector(".toast-message");
const toastCloseBtn = document.querySelector(".toast-close");

function initApp() {
  addEventListeners();
}

function toggleMobileMenu() {
  mobileMenu.classList.toggle("active");
  document.body.classList.toggle("menu-open");
}

function showToast(message, duration = 3000) {
  toastMessage.textContent = message;
  toast.classList.add("show");
  setTimeout(hideToast, duration);
}

function hideToast() {
  toast.classList.remove("show");
}

function addEventListeners() {
  mobileMenuBtn?.addEventListener("click", toggleMobileMenu);

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      document.body.classList.remove("menu-open");
    });
  });

  toastCloseBtn?.addEventListener("click", hideToast);

  // Tab navigation
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = button.dataset.tab;
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      document
        .querySelectorAll(".tab-content")
        .forEach((content) => content.classList.remove("active"));
      document.getElementById(`${tabName}-tab`)?.classList.add("active");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initApp();
  
});
