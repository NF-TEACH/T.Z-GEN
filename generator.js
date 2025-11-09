document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("generateBtn")
  const resultDiv = document.getElementById("generatorResult")

  function generateRandomSequence(length) {
    let result = ""
    const characters = "0123456789"
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    const checkDigit = calculateCheckDigit(result.split("").map(Number)).checkDigit
    return result + checkDigit
  }

  function calculateCheckDigit(digits) {
    let sum = 0
    const steps = []
    for (let i = 0; i < digits.length; i++) {
      sum += digits[i]
      steps.push(`Step ${i + 1}: ${sum}`)
    }
    const checkDigit = (10 - (sum % 10)) % 10
    steps.push(`Final sum: ${sum}`)
    steps.push(`Check digit: ${checkDigit}`)
    return { sum, checkDigit, steps }
  }

  function handleGenerate() {
    const sequence = generateRandomSequence(8)
    const digits = sequence.slice(0, -1).split("").map(Number)
    const calculation = calculateCheckDigit(digits)
    displayGeneratorResult(sequence, calculation)
  }

  function displayGeneratorResult(sequence, calculation) {
    resultDiv.classList.remove("hidden")

    const html = `
            <div class="result-display">
                <div class="result-number">
                    <span dir="ltr">${sequence.slice(0, -1)}<span class="check-digit">${sequence.slice(-1)}</span></span>
                    <button onclick="copyToClipboard('${sequence}')" class="copy-btn" title="העתק">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                    </button>
                </div>
                <div class="result-help">
                    נוצר רצף באורך 9 ספרות. הספרה האחרונה 
                    <span class="primary bold">(${sequence.slice(-1)})</span>
                    היא ספרת הביקורת.
                </div>
            </div>

            <div class="card">
                <div class="card-body">
                    <div class="calculation-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                            <line x1="8" y1="6" x2="16" y2="6"/>
                            <line x1="8" y1="10" x2="16" y2="10"/>
                            <line x1="8" y1="14" x2="12" y2="14"/>
                        </svg>
                        <span>סיכום החישוב</span>
                    </div>
                    <div class="calculation-steps">
                        ${calculation.steps.map((step) => `<div class="calc-step">${step}</div>`).join("")}
                    </div>
                    <div class="calc-summary">
                        <div class="calc-row">
                            <span>סכום כולל:</span>
                            <span class="value">${calculation.sum}</span>
                        </div>
                        <div class="calc-row primary">
                            <span>ספרת ביקורת:</span>
                            <span class="value">${calculation.checkDigit}</span>
                        </div>
                    </div>
                </div>
            </div>
        `

    resultDiv.innerHTML = html
  }

  btn.addEventListener("click", handleGenerate)
})

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("הרצף הועתק ללוח!")
  })
}
