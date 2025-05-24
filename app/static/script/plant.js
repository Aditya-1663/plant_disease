// Main script file for PlantGuard

document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()

  // Theme toggle functionality
  const themeToggle = document.getElementById("themeToggle")
  const htmlElement = document.documentElement

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    htmlElement.setAttribute("data-bs-theme", savedTheme)
    updateThemeIcon(savedTheme)
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = htmlElement.getAttribute("data-bs-theme")
      const newTheme = currentTheme === "dark" ? "light" : "dark"

      htmlElement.setAttribute("data-bs-theme", newTheme)
      localStorage.setItem("theme", newTheme)
      updateThemeIcon(newTheme)
    })
  }

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector("i")
    if (theme === "dark") {
      icon.classList.remove("fa-moon")
      icon.classList.add("fa-sun")
    } else {
      icon.classList.remove("fa-sun")
      icon.classList.add("fa-moon")
    }
  }

  // Language dropdown functionality
  const languageDropdown = document.getElementById("languageDropdown")
  if (languageDropdown) {
    const languageItems = document.querySelectorAll(".dropdown-item")
    languageItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault()
        // In a real app, this would change the language
        console.log("Language changed to:", this.textContent.trim())
      })
    })
  }
})
