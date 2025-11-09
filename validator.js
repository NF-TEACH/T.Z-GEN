document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("validatorInput")
  const btn = document.getElementById("validateBtn")
  const resultDiv = document.getElementById("validatorResult")

  function handleValidate() {
    const value = input.value.trim()
    if (!value) return

    const result = validateSequence(value)
    displayValidatorResult(result)
  }

  function displayValidatorResult(result) {
    resultDiv.classList.remove("hidden")

    const alertClass = result.isValid ? "success" : "error"
    const icon = result.isValid
      ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
      : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'

    let html = `
            <div class="alert ${alertClass}">
                ${icon}
                <div class="alert-content">${result.message}</div>
            </div>
        `

    if (result.calculation) {
      html += `
                <div class="card">
                    <div class="card-body">
                        <div class="calculation-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                                <line x1="8" y1="6" x2="16" y2="6"/>
                                <line x1="8" y1="10" x2="16" y2="10"/>
                                <line x1="8" y1="14" x2="12" y2="14"/>
                            </svg>
                            <span>פירוט החישוב</span>
                        </div>
                        <div class="calculation-steps">
                            ${result.calculation.steps.map((step) => `<div class="calc-step">${step}</div>`).join("")}
                        </div>
                        <div class="calc-summary">
                            <div class="calc-row">
                                <span>סכום כולל:</span>
                                <span class="value">${result.calculation.sum}</span>
                            </div>
                            <div class="calc-row">
                                <span>כפולה של 10 הבאה:</span>
                                <span class="value">${result.calculation.nextMultipleOfTen}</span>
                            </div>
                            <div class="calc-row primary">
                                <span>ספרת ביקורת:</span>
                                <span class="value">${result.calculation.checkDigit}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
    }

    resultDiv.innerHTML = html
  }

  btn.addEventListener("click", handleValidate)
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleValidate()
  })

  function validateSequence(value) {
    // Placeholder for the validateSequence function
    return {
      isValid: true,
      message: "Sequence is valid",
      calculation: {
        steps: ["Step 1", "Step 2"],
        sum: 10,
        nextMultipleOfTen: 20,
        checkDigit: 0,
      },
    }
  }
})
