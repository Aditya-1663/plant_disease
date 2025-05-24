// DOM Elements
const feedbackForm = document.getElementById("feedback-form")
const submitFeedbackBtn = document.getElementById("submit-feedback-btn")
const ratingLabels = document.querySelectorAll(".rating-label")
const feedbackList = document.getElementById("feedback-list")
const filterButtons = document.querySelectorAll(".filter-btn")
const prevPageBtn = document.getElementById("prev-page-btn")
const nextPageBtn = document.getElementById("next-page-btn")
const currentPageEl = document.getElementById("current-page")
const totalPagesEl = document.getElementById("total-pages")


let currentPage = 1
const itemsPerPage = 6
let currentFilter = "all"

const feedbackData = []


async function fetchFeedbackDataFromAPI() {
  try {
    const response = await fetch('/allfeedbacks') 
    // alert(response)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const data = await response.json()

    feedbackData.length = 0
    data.forEach(item => {
      feedbackData.push({
        id: item._id,
        name: item.name,
        email: item.email,
        rating: item.rating,
        feedbackType: item.feedbackType,
        message: item.message,
        date: item.timestamp, 
      })
    })

    loadFeedbackData()

  } catch (error) {
    console.error('Failed to fetch feedbacks:', error)
    showToast('Failed to load feedback data from server, loading cached data...', 3000)

    
    loadFeedbackFromLocalStorage()
    loadFeedbackData()
  }
}

function initFeedbackPage() {
  populateUserInfo()
  addFeedbackEventListeners()
}

// Mock functions for getCurrentUser and showToast
function getCurrentUser() {
  const userJson = localStorage.getItem("user")
  return userJson ? JSON.parse(userJson) : null
}

function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast")
  const toastMessage = document.querySelector(".toast-message")

  if (toast && toastMessage) {
    toastMessage.textContent = message
    toast.classList.add("show")
    setTimeout(() => {
      toast.classList.remove("show")
    }, duration)
  }
}

function populateUserInfo() {
  const user = getCurrentUser()
  if (!user) return

  const nameInput = document.getElementById("feedback-name")
  const emailInput = document.getElementById("feedback-email")

  if (nameInput && user.name) nameInput.value = user.name
  if (emailInput && user.email) emailInput.value = user.email
}

function addFeedbackEventListeners() {
  if (feedbackForm) feedbackForm.addEventListener("submit", handleFeedbackSubmit)

  ratingLabels.forEach(label => {
    label.addEventListener("click", () => {
      ratingLabels.forEach(l => l.classList.remove("active"))
      label.classList.add("active")
    })
  })

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"))
      button.classList.add("active")
      currentFilter = button.dataset.filter
      currentPage = 1
      loadFeedbackData()
    })
  })

  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--
        loadFeedbackData()
      }
    })
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      const filteredData = filterFeedbackData()
      const totalPages = Math.ceil(filteredData.length / itemsPerPage)
      if (currentPage < totalPages) {
        currentPage++
        loadFeedbackData()
      }
    })
  }
}

async function handleFeedbackSubmit(e) {
  // e.preventDefault()

  const loadingSpinner = submitFeedbackBtn.querySelector(".fa-spinner")
  const buttonText = submitFeedbackBtn.querySelector("span")
  buttonText.textContent = "Submitting..."
  loadingSpinner.classList.remove("hidden")
  submitFeedbackBtn.disabled = true

  const formData = new FormData(feedbackForm)
  const ratingValue = formData.get("rating")
  if (!ratingValue) {
    showToast("Please select a rating before submitting.", 3000)
    resetSubmitButton()
    return
  }

  const feedback = {
    id: Date.now(),
    name: formData.get("name") || "Anonymous",
    email: formData.get("email") || "",
    rating: Number(ratingValue),
    feedbackType: formData.get("feedbackType"),
    message: formData.get("message") || "",
    date: new Date().toISOString(),
  }

  try {
    // Simulate API delay or actual API call here
    await new Promise(resolve => setTimeout(resolve, 1500))

    feedbackData.unshift(feedback)
    saveFeedbackToLocalStorage()
    loadFeedbackData()
    showToast("Thank you for your feedback!", 3000)
    feedbackForm.reset()
    ratingLabels.forEach(l => l.classList.remove("active"))
  } catch (error) {
    console.error("Feedback submission error:", error)
    showToast("Submission failed. Please try again.", 3000)
  } finally {
    resetSubmitButton()
  }

  function resetSubmitButton() {
    buttonText.textContent = "Submit Feedback"
    loadingSpinner.classList.add("hidden")
    submitFeedbackBtn.disabled = false
  }
}

function filterFeedbackData() {
  if (currentFilter === "all") return feedbackData
  return feedbackData.filter(item => item.feedbackType === currentFilter)
}

function loadFeedbackData() {
  if (!feedbackList) return

  const filteredData = filterFeedbackData()
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  if (currentPage > totalPages && totalPages > 0) currentPage = totalPages

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  if (currentPageEl) currentPageEl.textContent = currentPage
  if (totalPagesEl) totalPagesEl.textContent = totalPages || 1
  if (prevPageBtn) prevPageBtn.disabled = currentPage === 1
  if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages || totalPages === 0

  feedbackList.innerHTML = ""

  if (paginatedData.length === 0) {
    feedbackList.innerHTML = `<div class="no-feedback"><p>No feedback found for this category.</p></div>`
    return
  }

  paginatedData.forEach(feedback => {
    const item = createFeedbackItem(feedback)
    feedbackList.appendChild(item)
  })
}

function createFeedbackItem(feedback) {
  const item = document.createElement("div")
  item.className = "feedback-item"

  const initials = feedback.name
    .split(" ")
    .map(n => n.charAt(0))
    .join("")
    .toUpperCase()

  const date = new Date(feedback.date)
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const stars = Array(5)
    .fill("")
    .map((_, i) => (i < feedback.rating ? '<i class="fas fa-star star"></i>' : '<i class="far fa-star star"></i>'))
    .join("")

  item.innerHTML = `
    <div class="feedback-header">
      <div class="feedback-user">
        <div class="user-avatar">${initials}</div>
        <div class="user-info">
          <h4>${escapeHTML(feedback.name)}</h4>
          <p>${escapeHTML(feedback.email)}</p>
        </div>
      </div>
      <div class="feedback-meta">
        <div class="feedback-date">${formattedDate}</div>
        <div class="feedback-type ${feedback.feedbackType}">${getFeedbackTypeName(feedback.feedbackType)}</div>
      </div>
    </div>
    <div class="feedback-rating">
      <div class="rating-stars">${stars}</div>
      <div class="rating-text">${getRatingText(feedback.rating)}</div>
    </div>
    <div class="feedback-content">
      <p>${escapeHTML(feedback.message)}</p>
    </div>
  `

  return item
}

function getFeedbackTypeName(type) {
  const types = {
    detection: "Detection Accuracy",
    usability: "Usability",
    features: "Feature Request",
    other: "Other",
  }
  return types[type] || "Other"
}

function getRatingText(rating) {
  const texts = {
    1: "Very Dissatisfied",
    2: "Dissatisfied",
    3: "Neutral",
    4: "Satisfied",
    5: "Very Satisfied",
  }
  return texts[rating] || ""
}

// Save/load feedback data to/from localStorage
function saveFeedbackToLocalStorage() {
  localStorage.setItem("feedbackData", JSON.stringify(feedbackData))
}

function loadFeedbackFromLocalStorage() {
  const saved = localStorage.getItem("feedbackData")
  if (saved) {
    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed)) {
      feedbackData.length = 0
      parsed.forEach(item => feedbackData.push(item))
    }
  }
}

// Simple HTML escaping to prevent XSS on user input display
function escapeHTML(str) {
  if (!str) return ""
  return str.replace(/[&<>"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m]
  })
}

// Initialize page on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  fetchFeedbackDataFromAPI()
  initFeedbackPage()
})
