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
const ACCESSIBILITY_PREFS_KEY = "accessibilityPrefs"

const defaultAccessibilityPrefs = {
  highContrast: false,
  largeText: false,
  highlightLinks: false,
}

const accessibilityState = {
  trigger: null,
  panel: null,
  close: null,
  options: null,
  previousFocus: null,
  isOpen: false,
  prefs: { ...defaultAccessibilityPrefs },
}

accessibilityState.prefs = loadAccessibilityPrefs()
applyAccessibilityPrefs()

function loadAccessibilityPrefs() {
  try {
    const stored = localStorage.getItem(ACCESSIBILITY_PREFS_KEY)
    if (!stored) return { ...defaultAccessibilityPrefs }
    const parsed = JSON.parse(stored)
    return { ...defaultAccessibilityPrefs, ...parsed }
  } catch (error) {
    console.warn("שגיאה בטעינת העדפות נגישות", error)
    return { ...defaultAccessibilityPrefs }
  }
}

function saveAccessibilityPrefs() {
  try {
    localStorage.setItem(ACCESSIBILITY_PREFS_KEY, JSON.stringify(accessibilityState.prefs))
  } catch (error) {
    console.warn("שגיאה בשמירת העדפות נגישות", error)
  }
}

function applyAccessibilityPrefs() {
  const root = document.documentElement
  const body = document.body

  const { highContrast, largeText, highlightLinks } = accessibilityState.prefs

  root.classList.toggle("access-high-contrast", Boolean(highContrast))
  if (body) {
    body.classList.toggle("access-text-large", Boolean(largeText))
    body.classList.toggle("access-highlight-links", Boolean(highlightLinks))
  }

  if (accessibilityState.options) {
    accessibilityState.options.forEach((button) => {
      const feature = button.getAttribute("data-feature")
      const isActive = Boolean(accessibilityState.prefs[feature])
      button.setAttribute("aria-pressed", String(isActive))
      button.classList.toggle("is-active", isActive)
    })
  }
}

function toggleAccessibilityPanel(force) {
  const { panel, trigger } = accessibilityState
  if (!panel || !trigger) return

  const shouldOpen = typeof force === "boolean" ? force : !accessibilityState.isOpen

  if (shouldOpen === accessibilityState.isOpen) return

  accessibilityState.isOpen = shouldOpen

  panel.classList.toggle("open", shouldOpen)
  panel.setAttribute("aria-hidden", String(!shouldOpen))
  trigger.setAttribute("aria-expanded", String(shouldOpen))

  if (shouldOpen) {
    accessibilityState.previousFocus = document.activeElement
    panel.focus()
    document.addEventListener("keydown", handleAccessibilityKeyDown)
  } else {
    document.removeEventListener("keydown", handleAccessibilityKeyDown)
    if (accessibilityState.previousFocus && typeof accessibilityState.previousFocus.focus === "function") {
      accessibilityState.previousFocus.focus()
    } else {
      trigger.focus()
    }
    accessibilityState.previousFocus = null
  }
}

function handleAccessibilityKeyDown(event) {
  if (event.key === "Escape") {
    toggleAccessibilityPanel(false)
  }
}

function handleAccessibilityToggle(event) {
  const button = event.target.closest("[data-feature]")
  if (!button) return

  const feature = button.getAttribute("data-feature")
  if (!(feature in accessibilityState.prefs)) return

  accessibilityState.prefs[feature] = !accessibilityState.prefs[feature]
  saveAccessibilityPrefs()
  applyAccessibilityPrefs()
}

function ensureAccessibilityMenu() {
  if (accessibilityState.trigger && accessibilityState.panel) {
    return accessibilityState
  }

  const trigger = document.createElement("button")
  trigger.type = "button"
  trigger.className = "accessibility-launcher"
  trigger.id = "accessibilityToggle"
  trigger.setAttribute("aria-label", "תפריט נגישות")
  trigger.setAttribute("aria-haspopup", "dialog")
  trigger.setAttribute("aria-expanded", "false")
  trigger.innerHTML = `
    <span aria-hidden="true" class="accessibility-launcher-icon">♿</span>
    <span class="accessibility-launcher-text">נגישות</span>
  `

  const panel = document.createElement("div")
  panel.className = "accessibility-panel"
  panel.id = "accessibilityPanel"
  panel.setAttribute("role", "dialog")
  panel.setAttribute("aria-modal", "false")
  panel.setAttribute("aria-hidden", "true")
  panel.setAttribute("tabindex", "-1")
  panel.setAttribute("aria-labelledby", "accessibilityPanelTitle")
  panel.innerHTML = `
    <div class="accessibility-panel-header">
      <h2 id="accessibilityPanelTitle">תפריט נגישות</h2>
      <button type="button" class="accessibility-panel-close" aria-label="סגור תפריט נגישות">
        <span aria-hidden="true">×</span>
      </button>
    </div>
    <div class="accessibility-panel-body">
      <p class="accessibility-panel-description">בחרו את ההגדרה המתאימה לכם:</p>
      <div class="accessibility-panel-options">
        <button type="button" class="accessibility-option" data-feature="highContrast" aria-pressed="false">
          <span class="accessibility-option-title">קונטרסט גבוה</span>
          <span class="accessibility-option-desc">העצמת צבעים וחדות הטקסט</span>
        </button>
        <button type="button" class="accessibility-option" data-feature="largeText" aria-pressed="false">
          <span class="accessibility-option-title">הגדלת טקסט</span>
          <span class="accessibility-option-desc">הגדלת הטקסט באתר לכ-115%</span>
        </button>
        <button type="button" class="accessibility-option" data-feature="highlightLinks" aria-pressed="false">
          <span class="accessibility-option-title">הדגשת קישורים</span>
          <span class="accessibility-option-desc">הוספת מסגרת והדגשה לכל הקישורים</span>
        </button>
      </div>
    </div>
  `

  document.body.appendChild(trigger)
  document.body.appendChild(panel)

  accessibilityState.trigger = trigger
  accessibilityState.panel = panel
  accessibilityState.close = panel.querySelector(".accessibility-panel-close")
  accessibilityState.options = Array.from(panel.querySelectorAll(".accessibility-option"))

  trigger.addEventListener("click", () => toggleAccessibilityPanel())
  accessibilityState.close.addEventListener("click", () => toggleAccessibilityPanel(false))
  panel.addEventListener("click", handleAccessibilityToggle)

  document.addEventListener("click", (event) => {
    if (!accessibilityState.isOpen) return
    if (
      event.target === accessibilityState.trigger ||
      accessibilityState.panel.contains(event.target)
    ) {
      return
    }
    toggleAccessibilityPanel(false)
  })

  return accessibilityState
}

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
  info:
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="8"/></svg>',
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
  ensureAccessibilityMenu()
  applyAccessibilityPrefs()
})
