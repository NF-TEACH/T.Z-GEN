// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light"
  document.documentElement.setAttribute("data-theme", savedTheme)
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"
  document.documentElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
}

// Initialize theme on page load
initTheme()

// Accessibility Menu

// Modal Management
const modalState = {
  container: null,
  dialog: null,
  title: null,
  message: null,
  confirm: null,
  icon: null,
  hideTimer: null,
  previousFocus: null,
}

const modalIcons = {
  success:
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  error:
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  info: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="8"/></svg>',
}

function ensureModal() {
  if (modalState.container) return modalState

  const container = document.createElement("div")
  container.id = "appModal"
  container.className = "app-modal hidden"
  container.innerHTML = `
        <div class="app-modal-overlay" data-action="close"></div>
        <div class="app-modal-dialog" role="alertdialog" aria-modal="true" aria-labelledby="appModalTitle">
            <div class="app-modal-body">
                <div class="app-modal-icon" aria-hidden="true"></div>
                <div class="app-modal-text">
                    <div class="app-modal-title" id="appModalTitle"></div>
                    <div class="app-modal-message" id="appModalMessage"></div>
                </div>
            </div>
            <div class="app-modal-actions">
                <button type="button" class="btn btn-primary app-modal-confirm">הבנתי</button>
            </div>
        </div>
    `

  document.body.appendChild(container)

  modalState.container = container
  modalState.dialog = container.querySelector(".app-modal-dialog")
  modalState.title = container.querySelector(".app-modal-title")
  modalState.message = container.querySelector(".app-modal-message")
  modalState.confirm = container.querySelector(".app-modal-confirm")
  modalState.icon = container.querySelector(".app-modal-icon")

  const overlay = container.querySelector(".app-modal-overlay")

  overlay.addEventListener("click", hideAppAlert)
  modalState.confirm.addEventListener("click", hideAppAlert)

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !container.classList.contains("hidden")) {
      hideAppAlert()
    }
  })

  return modalState
}

function hideAppAlert() {
  if (!modalState.container || modalState.container.classList.contains("hidden")) return

  modalState.container.classList.remove("open")
  modalState.dialog.setAttribute("aria-hidden", "true")

  if (modalState.hideTimer) {
    clearTimeout(modalState.hideTimer)
  }

  modalState.hideTimer = setTimeout(() => {
    modalState.container.classList.add("hidden")
    if (modalState.previousFocus && typeof modalState.previousFocus.focus === "function") {
      modalState.previousFocus.focus()
    }
    modalState.previousFocus = null
    modalState.hideTimer = null
  }, 200)
}

function showAppAlert(message, options = {}) {
  const { title = "הודעה", type = "info", confirmText = "סגור" } = options
  const modal = ensureModal()

  if (modal.hideTimer) {
    clearTimeout(modal.hideTimer)
    modal.hideTimer = null
  }

  modal.container.classList.remove("hidden")
  modal.container.classList.remove("open")
  requestAnimationFrame(() => modal.container.classList.add("open"))

  modal.dialog.setAttribute("data-type", type)
  modal.dialog.setAttribute("aria-hidden", "false")

  modal.title.textContent = title
  modal.message.textContent = message
  modal.confirm.textContent = confirmText
  modal.icon.innerHTML = modalIcons[type] || modalIcons.info

  modal.previousFocus = document.activeElement

  modal.confirm.focus()
}

window.showAppAlert = showAppAlert
window.hideAppAlert = hideAppAlert
window.alert = (message) => showAppAlert(String(message || ""))

// Attach theme toggle event and ensure modal is ready after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle")
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme)
  }

  ensureModal()
})
