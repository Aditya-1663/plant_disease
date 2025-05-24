// FAQ page functionality

// DOM Elements
const faqItems = document.querySelectorAll(".faq-item")
const categoryButtons = document.querySelectorAll(".category-btn")
const searchInput = document.getElementById("faq-search-input")
const searchClearBtn = document.getElementById("faq-search-clear")
const resetSearchBtn = document.getElementById("reset-search")
const faqNotFound = document.querySelector(".faq-not-found")
const faqCategories = document.querySelectorAll(".faq-category")

// Initialize the FAQ page
function initFaqPage() {
  // Add event listeners
  addFaqEventListeners()

  // Show all questions initially
  showAllQuestions()
}

// Add event listeners for the FAQ page
function addFaqEventListeners() {
  // Toggle FAQ answers
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question")
    question.addEventListener("click", () => {
      // Close other open items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active")
        }
      })

      // Toggle current item
      item.classList.toggle("active")
    })
  })

  // Category filtering
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      categoryButtons.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      button.classList.add("active")

      // Filter questions by category
      const category = button.dataset.category
      filterQuestionsByCategory(category)

      // Clear search input
      if (searchInput.value) {
        searchInput.value = ""
        searchClearBtn.classList.add("hidden")
      }
    })
  })

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch)

    // Clear search button
    if (searchClearBtn) {
      searchClearBtn.addEventListener("click", clearSearch)
    }

    // Reset search button
    if (resetSearchBtn) {
      resetSearchBtn.addEventListener("click", clearSearch)
    }
  }
}

// Filter questions by category
function filterQuestionsByCategory(category) {
  // Show/hide categories based on selection
  if (category === "all") {
    // Show all categories
    faqCategories.forEach((cat) => {
      cat.classList.remove("hidden")
    })

    // Show all items
    faqItems.forEach((item) => {
      item.classList.remove("hidden")
    })
  } else {
    // Show only the selected category
    faqCategories.forEach((cat) => {
      if (cat.id === category) {
        cat.classList.remove("hidden")
      } else {
        cat.classList.add("hidden")
      }
    })

    // Show only items in the selected category
    faqItems.forEach((item) => {
      if (item.dataset.category === category) {
        item.classList.remove("hidden")
      } else {
        item.classList.add("hidden")
      }
    })
  }

  // Hide "not found" message
  faqNotFound.classList.add("hidden")
}

// Handle search input
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase().trim()

  // Show/hide clear button
  if (searchTerm) {
    searchClearBtn.classList.remove("hidden")
  } else {
    searchClearBtn.classList.add("hidden")
    showAllQuestions()
    return
  }

  // Reset category buttons
  categoryButtons.forEach((btn) => {
    btn.classList.remove("active")
  })
  categoryButtons[0].classList.add("active") // Set "All Questions" as active

  // Show all categories
  faqCategories.forEach((cat) => {
    cat.classList.remove("hidden")
  })

  // Filter questions by search term
  let matchFound = false

  faqItems.forEach((item) => {
    const question = item.querySelector("h3").textContent.toLowerCase()
    const answer = item.querySelector(".faq-answer").textContent.toLowerCase()

    if (question.includes(searchTerm) || answer.includes(searchTerm)) {
      item.classList.remove("hidden")
      matchFound = true
    } else {
      item.classList.add("hidden")
    }
  })

  // Show/hide "not found" message
  if (matchFound) {
    faqNotFound.classList.add("hidden")
  } else {
    faqNotFound.classList.remove("hidden")
  }
}

// Clear search
function clearSearch() {
  searchInput.value = ""
  searchClearBtn.classList.add("hidden")
  faqNotFound.classList.add("hidden")

  // Reset category buttons
  categoryButtons.forEach((btn) => {
    btn.classList.remove("active")
  })
  categoryButtons[0].classList.add("active") // Set "All Questions" as active

  // Show all questions
  showAllQuestions()
}

// Show all questions
function showAllQuestions() {
  // Show all categories
  faqCategories.forEach((cat) => {
    cat.classList.remove("hidden")
  })

  // Show all items
  faqItems.forEach((item) => {
    item.classList.remove("hidden")
  })

  // Hide "not found" message
  faqNotFound.classList.add("hidden")
}

// Initialize the page when DOM is loaded
document.addEventListener("DOMContentLoaded", initFaqPage)
// Update the navigation in script.js to include the FAQ link

// Add this to your existing script.js file if it doesn't already handle the FAQ page
document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  const currentYearElement = document.getElementById("current-year")
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear()
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const mobileMenu = document.querySelector(".mobile-menu")

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("active")
    })
  }

  // Theme toggle
  const themeToggleBtn = document.getElementById("theme-toggle-btn")
  const htmlElement = document.documentElement

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    htmlElement.setAttribute("data-theme", savedTheme)
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = htmlElement.getAttribute("data-theme")
      const newTheme = currentTheme === "dark" ? "light" : "dark"

      htmlElement.setAttribute("data-theme", newTheme)
      localStorage.setItem("theme", newTheme)
    })
  }

  // Language selector
  const languageBtn = document.getElementById("language-btn")
  const languageDropdown = document.querySelector(".language-dropdown")
  const languageOptions = document.querySelectorAll("[data-lang]")

  if (languageBtn && languageDropdown) {
    languageBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      languageDropdown.classList.toggle("active")
    })

    document.addEventListener("click", (e) => {
      if (!languageDropdown.contains(e.target) && e.target !== languageBtn) {
        languageDropdown.classList.remove("active")
      }
    })
  }

  if (languageOptions.length > 0) {
    languageOptions.forEach((option) => {
      option.addEventListener("click", function (e) {
        e.preventDefault()
        const lang = this.getAttribute("data-lang")
        // In a real app, this would change the language
        console.log("Language changed to:", lang)

        // Close dropdown
        if (languageDropdown) {
          languageDropdown.classList.remove("active")
        }
      })
    })
  }

  // Toast functionality
  window.showToast = (message, duration = 3000) => {
    const toast = document.getElementById("toast")
    const toastMessage = document.querySelector(".toast-message")
    const toastClose = document.querySelector(".toast-close")

    if (toast && toastMessage) {
      toastMessage.textContent = message
      toast.classList.add("show")

      const hideToast = () => {
        toast.classList.remove("show")
      }

      // Auto hide after duration
      const timeoutId = setTimeout(hideToast, duration)

      // Close button
      if (toastClose) {
        toastClose.addEventListener("click", () => {
          clearTimeout(timeoutId)
          hideToast()
        })
      }
    }
  }
})
