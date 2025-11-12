// Custom Accessibility Widget for Israeli Standards
;(() => {
  const AccessibilityWidget = {
    settings: {
      fontSize: 1,
      contrast: false,
      grayscale: false,
      highlightLinks: false,
      readableFont: false,
      imageDescriptions: false,
      largeCursor: false,
      stopAnimations: false,
    },

    init() {
      this.loadSettings()
      this.createWidget()
      this.attachEventListeners()
      this.applySettings()
    },

    loadSettings() {
      const saved = localStorage.getItem("accessibilitySettings")
      if (saved) {
        try {
          this.settings = { ...this.settings, ...JSON.parse(saved) }
        } catch (e) {
          console.error("Failed to load accessibility settings")
        }
      }
    },

    saveSettings() {
      localStorage.setItem("accessibilitySettings", JSON.stringify(this.settings))
    },

    createWidget() {
      const widgetHTML = `
        <div id="accessibilityWidget" class="accessibility-widget" aria-label="תפריט נגישות">
          <button id="accessibilityToggle" class="accessibility-toggle" aria-label="פתח תפריט נגישות" aria-expanded="false">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9H15V22H13V16H11V22H9V9H3V7H21V9Z"/>
            </svg>
          </button>
          
          <div id="accessibilityMenu" class="accessibility-menu hidden" role="dialog" aria-labelledby="accessibilityTitle" aria-hidden="true">
            <div class="accessibility-menu-container">
              <div class="accessibility-header">
                <h2 id="accessibilityTitle" class="accessibility-title">נגישות</h2>
                <button id="accessibilityClose" class="accessibility-close" aria-label="סגור תפריט נגישות">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div class="accessibility-content">
                <div class="accessibility-grid">
                  <button class="accessibility-option" data-action="contrast" aria-pressed="${this.settings.contrast}">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20V4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/>
                    </svg>
                    <span>ניגודיות צבעים</span>
                  </button>

                  <button class="accessibility-option" data-action="grayscale" aria-pressed="${this.settings.grayscale}">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"/>
                      <circle cx="12" cy="12" r="3"/>
                      <line x1="3" y1="3" x2="21" y2="21"/>
                    </svg>
                    <span>ללא צבעים</span>
                  </button>

                  <button class="accessibility-option" data-action="readableFont" aria-pressed="${this.settings.readableFont}">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M9.93 13.5H4.07L2 19H0L5.07 5H8.93L14 19H12L9.93 13.5M9 11.5L7 6L5 11.5H9M21 3V5H19V9H21V11H19V19H17V11H15V9H17V5H15V3H21Z"/>
                    </svg>
                    <span>גופן קריא</span>
                  </button>

                  <button class="accessibility-option" data-action="highlightLinks" aria-pressed="${this.settings.highlightLinks}">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                    <span>הדגשת קישורים</span>
                  </button>

                  <button class="accessibility-option" data-action="increaseFontSize">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M10 4L6 16H8.5L9.5 13H14.5L15.5 16H18L14 4H10M10 11L12 5.67L14 11H10Z"/>
                    </svg>
                    <span>הגדל גופן</span>
                  </button>

                  <button class="accessibility-option" data-action="decreaseFontSize">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M10 4L6 16H8.5L9.5 13H14.5L15.5 16H18L14 4H10M10 11L12 5.67L14 11H10Z" style="transform: scale(0.7); transform-origin: center;"/>
                    </svg>
                    <span>הקטן גופן</span>
                  </button>

                  <button class="accessibility-option" data-action="imageDescriptions" aria-pressed="${this.settings.imageDescriptions}">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span>תיאור לתמונות</span>
                  </button>

                  <button class="accessibility-option" data-action="largeCursor" aria-pressed="${this.settings.largeCursor}">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M11 1.07C7.05 1.56 4 4.92 4 9H11M13 0.56V9H21C21 4.03 16.97 0 13 0.56M4 11C4 15.08 7.05 18.44 11 18.93V11M13 11V21.44C16.97 21 21 16.97 21 11"/>
                    </svg>
                    <span>סמן גדול</span>
                  </button>

                  <button class="accessibility-option" data-action="stopAnimations" aria-pressed="${this.settings.stopAnimations}">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20M16 12H13V16H11V12H8V10H11V7H13V10H16V12Z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span>ביטול הבהובים</span>
                  </button>

                  <button class="accessibility-option accessibility-reset" data-action="reset">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                      <path d="M21 3v5h-5"/>
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                      <path d="M3 21v-5h5"/>
                    </svg>
                    <span>איפוס</span>
                  </button>
                </div>
              </div>

              <div class="accessibility-footer">
                <a href="accessibility-statement.html" class="accessibility-statement-link">
                  סרגל הנגישות של yAccessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      `

      document.body.insertAdjacentHTML("beforeend", widgetHTML)
    },

    attachEventListeners() {
      const toggle = document.getElementById("accessibilityToggle")
      const close = document.getElementById("accessibilityClose")
      const menu = document.getElementById("accessibilityMenu")
      const options = document.querySelectorAll(".accessibility-option")

      toggle.addEventListener("click", () => this.toggleMenu())
      close.addEventListener("click", () => this.closeMenu())

      options.forEach((option) => {
        option.addEventListener("click", (e) => {
          const action = e.currentTarget.dataset.action
          this.handleAction(action, e.currentTarget)
        })
      })

      // Close on escape
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !menu.classList.contains("hidden")) {
          this.closeMenu()
        }
      })

      // Close on outside click
      menu.addEventListener("click", (e) => {
        if (e.target === menu) {
          this.closeMenu()
        }
      })
    },

    toggleMenu() {
      const menu = document.getElementById("accessibilityMenu")
      const toggle = document.getElementById("accessibilityToggle")
      const isHidden = menu.classList.contains("hidden")

      if (isHidden) {
        menu.classList.remove("hidden")
        toggle.setAttribute("aria-expanded", "true")
        menu.setAttribute("aria-hidden", "false")
        setTimeout(() => menu.classList.add("open"), 10)
      } else {
        this.closeMenu()
      }
    },

    closeMenu() {
      const menu = document.getElementById("accessibilityMenu")
      const toggle = document.getElementById("accessibilityToggle")

      menu.classList.remove("open")
      toggle.setAttribute("aria-expanded", "false")
      menu.setAttribute("aria-hidden", "true")
      setTimeout(() => menu.classList.add("hidden"), 300)
    },

    handleAction(action, button) {
      switch (action) {
        case "contrast":
          this.toggleContrast(button)
          break
        case "grayscale":
          this.toggleGrayscale(button)
          break
        case "highlightLinks":
          this.toggleHighlightLinks(button)
          break
        case "readableFont":
          this.toggleReadableFont(button)
          break
        case "increaseFontSize":
          this.changeFontSize(0.1)
          break
        case "decreaseFontSize":
          this.changeFontSize(-0.1)
          break
        case "imageDescriptions":
          this.toggleImageDescriptions(button)
          break
        case "largeCursor":
          this.toggleLargeCursor(button)
          break
        case "stopAnimations":
          this.toggleStopAnimations(button)
          break
        case "reset":
          this.resetAll()
          break
      }
    },

    toggleContrast(button) {
      this.settings.contrast = !this.settings.contrast
      button.setAttribute("aria-pressed", this.settings.contrast)

      if (this.settings.contrast) {
        document.documentElement.classList.add("access-high-contrast")
      } else {
        document.documentElement.classList.remove("access-high-contrast")
      }

      this.saveSettings()
    },

    toggleGrayscale(button) {
      this.settings.grayscale = !this.settings.grayscale
      button.setAttribute("aria-pressed", this.settings.grayscale)

      if (this.settings.grayscale) {
        document.documentElement.style.filter = "grayscale(100%)"
      } else {
        document.documentElement.style.filter = "none"
      }

      this.saveSettings()
    },

    toggleHighlightLinks(button) {
      this.settings.highlightLinks = !this.settings.highlightLinks
      button.setAttribute("aria-pressed", this.settings.highlightLinks)

      if (this.settings.highlightLinks) {
        document.body.classList.add("access-highlight-links")
      } else {
        document.body.classList.remove("access-highlight-links")
      }

      this.saveSettings()
    },

    toggleReadableFont(button) {
      this.settings.readableFont = !this.settings.readableFont
      button.setAttribute("aria-pressed", this.settings.readableFont)

      if (this.settings.readableFont) {
        document.body.style.fontFamily = "Arial, sans-serif"
      } else {
        document.body.style.fontFamily = ""
      }

      this.saveSettings()
    },

    changeFontSize(delta) {
      this.settings.fontSize = Math.max(0.8, Math.min(1.5, this.settings.fontSize + delta))
      document.documentElement.style.fontSize = `${this.settings.fontSize * 16}px`
      this.saveSettings()
    },

    toggleImageDescriptions(button) {
      this.settings.imageDescriptions = !this.settings.imageDescriptions
      button.setAttribute("aria-pressed", this.settings.imageDescriptions)

      const images = document.querySelectorAll("img[alt]")
      images.forEach((img) => {
        if (this.settings.imageDescriptions) {
          if (!img.dataset.originalTitle) {
            img.dataset.originalTitle = img.title || ""
          }
          img.title = img.alt
          img.style.border = "2px solid var(--primary)"
        } else {
          img.title = img.dataset.originalTitle || ""
          img.style.border = ""
        }
      })

      this.saveSettings()
    },

    toggleLargeCursor(button) {
      this.settings.largeCursor = !this.settings.largeCursor
      button.setAttribute("aria-pressed", this.settings.largeCursor)

      if (this.settings.largeCursor) {
        document.body.style.cursor =
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='white' stroke='black' stroke-width='1' d='M2 2 L2 24 L8 18 L12 28 L16 26 L12 16 L20 16 Z'/%3E%3C/svg%3E\") 0 0, auto"
      } else {
        document.body.style.cursor = ""
      }

      this.saveSettings()
    },

    toggleStopAnimations(button) {
      this.settings.stopAnimations = !this.settings.stopAnimations
      button.setAttribute("aria-pressed", this.settings.stopAnimations)

      if (this.settings.stopAnimations) {
        const style = document.createElement("style")
        style.id = "stop-animations"
        style.textContent = "* { animation: none !important; transition: none !important; }"
        document.head.appendChild(style)
      } else {
        const style = document.getElementById("stop-animations")
        if (style) style.remove()
      }

      this.saveSettings()
    },

    resetAll() {
      this.settings = {
        fontSize: 1,
        contrast: false,
        grayscale: false,
        highlightLinks: false,
        readableFont: false,
        imageDescriptions: false,
        largeCursor: false,
        stopAnimations: false,
      }

      this.saveSettings()
      this.applySettings()

      // Update all button states
      document.querySelectorAll(".accessibility-option[aria-pressed]").forEach((btn) => {
        btn.setAttribute("aria-pressed", "false")
      })

      // Reload page to fully reset
      location.reload()
    },

    applySettings() {
      const btn = document.createElement("button") // Dummy button for method calls

      if (this.settings.contrast) {
        document.documentElement.classList.add("access-high-contrast")
      }

      if (this.settings.grayscale) {
        document.documentElement.style.filter = "grayscale(100%)"
      }

      if (this.settings.highlightLinks) {
        document.body.classList.add("access-highlight-links")
      }

      if (this.settings.readableFont) {
        document.body.style.fontFamily = "Arial, sans-serif"
      }

      if (this.settings.fontSize !== 1) {
        document.documentElement.style.fontSize = `${this.settings.fontSize * 16}px`
      }

      if (this.settings.imageDescriptions) {
        setTimeout(() => {
          const images = document.querySelectorAll("img[alt]")
          images.forEach((img) => {
            img.title = img.alt
            img.style.border = "2px solid var(--primary)"
          })
        }, 100)
      }

      if (this.settings.largeCursor) {
        document.body.style.cursor =
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='white' stroke='black' stroke-width='1' d='M2 2 L2 24 L8 18 L12 28 L16 26 L12 16 L20 16 Z'/%3E%3C/svg%3E\") 0 0, auto"
      }

      if (this.settings.stopAnimations) {
        const style = document.createElement("style")
        style.id = "stop-animations"
        style.textContent = "* { animation: none !important; transition: none !important; }"
        document.head.appendChild(style)
      }
    },
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => AccessibilityWidget.init())
  } else {
    AccessibilityWidget.init()
  }
})()
