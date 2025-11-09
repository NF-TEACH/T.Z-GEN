// Israeli ID Check Digit Algorithm Implementation (Luhn Algorithm)

function calculateCheckDigit(digits) {
  const steps = []
  const weights = []
  const products = []
  const reducedProducts = []

  steps.push("שלב 1: הענקת משקלים לכל ספרה (1, 2, 1, 2...)")

  for (let i = 0; i < digits.length; i++) {
    const weight = (i % 2) + 1
    weights.push(weight)
    const product = digits[i] * weight
    products.push(product)

    let reduced = product
    if (product > 9) {
      reduced = Math.floor(product / 10) + (product % 10)
      steps.push(`${digits[i]} × ${weight} = ${product} → ${Math.floor(product / 10)} + ${product % 10} = ${reduced}`)
    } else {
      steps.push(`${digits[i]} × ${weight} = ${product}`)
    }
    reducedProducts.push(reduced)
  }

  const sum = reducedProducts.reduce((acc, val) => acc + val, 0)
  steps.push(`שלב 2: סיכום כל הערכים: ${reducedProducts.join(" + ")} = ${sum}`)

  const nextMultipleOfTen = Math.ceil(sum / 10) * 10
  steps.push(`שלב 3: המספר הקרוב שמתחלק ב-10: ${nextMultipleOfTen}`)

  const checkDigit = nextMultipleOfTen - sum
  steps.push(`שלב 4: ספרת הביקורת: ${nextMultipleOfTen} - ${sum} = ${checkDigit}`)

  return {
    originalDigits: digits,
    weights,
    products,
    reducedProducts,
    sum,
    nextMultipleOfTen,
    checkDigit,
    steps,
  }
}

function generateRandomSequence(length = 8) {
  const digits = []
  for (let i = 0; i < length; i++) {
    digits.push(Math.floor(Math.random() * 10))
  }
  const calculation = calculateCheckDigit(digits)
  return digits.join("") + calculation.checkDigit
}

function validateSequence(sequence) {
  const cleaned = sequence.replace(/\D/g, "")

  if (cleaned.length === 0) {
    return {
      isValid: false,
      message: "אנא הזן מספר תעודת זהות.",
    }
  }

  if (cleaned.length < 9) {
    return {
      isValid: false,
      message: `מספר ת.ז קצר מדי. נדרשות 9 ספרות (הזנת ${cleaned.length} ספרות).`,
    }
  }

  if (cleaned.length > 9) {
    return {
      isValid: false,
      message: `מספר ת.ז ארוך מדי. נדרשות 9 ספרות (הזנת ${cleaned.length} ספרות).`,
    }
  }

  const digits = cleaned.slice(0, -1).split("").map(Number)
  const providedCheckDigit = Number.parseInt(cleaned.slice(-1))

  const calculation = calculateCheckDigit(digits)
  const isValid = calculation.checkDigit === providedCheckDigit

  return {
    isValid,
    message: isValid
      ? "מספר ת.ז תקין! ✓"
      : `מספר ת.ז לא תקין. ספרת הביקורת הנכונה היא ${calculation.checkDigit}, אך ניתנה ${providedCheckDigit}.`,
    calculation,
  }
}
