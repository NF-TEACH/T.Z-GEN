document.addEventListener("DOMContentLoaded", () => {
  const countInput = document.getElementById("batchCount")
  const btn = document.getElementById("batchGenerateBtn")
  const resultDiv = document.getElementById("batchResult")

  function handleGenerate() {
    const count = Math.min(1000, Math.max(1, Number.parseInt(countInput.value) || 50))
    countInput.value = count

    btn.disabled = true
    btn.textContent = "מחשב..."

    setTimeout(() => {
      const sequences = []
      for (let i = 0; i < count; i++) {
        sequences.push(generateRandomID())
      }
      displayBatchResult(sequences)
      btn.disabled = false
      btn.textContent = "צור רשימה"
    }, 300)
  }

  function displayBatchResult(sequences) {
    resultDiv.classList.remove("hidden")

    const html = `
            <div class="card">
                <div class="card-body">
                    <div class="batch-header">
                        <div class="text-lg bold">נוצרו ${sequences.length} מספרי ת.ז</div>
                        <button onclick="downloadSequences()" class="btn btn-outline">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            <span style="margin-right: 0.5rem">הורד קובץ</span>
                        </button>
                    </div>
                    <div class="batch-list">
                        ${sequences
                          .map(
                            (seq, i) => `
                            <div class="batch-item">
                                <span class="index">${i + 1}.</span>
                                <span class="number" dir="ltr">
                                    ${seq.slice(0, -1)}<span class="check-digit">${seq.slice(-1)}</span>
                                </span>
                                <button onclick="copyToClipboard('${seq}')" class="copy-btn" title="העתק">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                    </svg>
                                </button>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
            </div>
        `

    resultDiv.innerHTML = html
    window.currentSequences = sequences
  }

  btn.addEventListener("click", handleGenerate)
})

function downloadSequences() {
  if (!window.currentSequences) return

  const content = window.currentSequences.join("\n")
  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `idgen-sequences-${Date.now()}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  if (typeof window.showAppAlert === "function") {
    window.showAppAlert("הקובץ הורד בהצלחה ונשמר בתיקיית ההורדות.", {
      title: "ההורדה הושלמה",
      type: "success",
      confirmText: "מעולה",
    })
  } else {
    window.alert("הקובץ הורד בהצלחה!")
  }
}

function generateRandomID() {
  if (typeof generateRandomSequence === "function") {
    return generateRandomSequence()
  }

  const digits = []
  for (let i = 0; i < 8; i++) {
    digits.push(Math.floor(Math.random() * 10))
  }

  if (typeof calculateCheckDigit === "function") {
    const { checkDigit } = calculateCheckDigit(digits)
    return digits.join("") + checkDigit
  }

  return digits.join("")
}
