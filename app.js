const sourceCurrencySelect = document.querySelector('[data-js="currency-one"]')
const targetCurrencySelect = document.querySelector('[data-js="currency-two"]')
const convertedValueParagraph = document.querySelector('[data-js="converted-value"]')
const currencyOneTimes = document.querySelector('[data-js="currency-one-times"]')
const precisionParagraph = document.querySelector('[data-js="conversion-precision"]')

const APIKey = '9e3a6fd942b2712ab9af7ee0'
let conversionRates = null

const generateOptionElement = (currency, isSelected) =>
  isSelected 
    ? `<option value="${currency}" selected>${currency}</option>`
    : `<option value="${currency}">${currency}</option>`


const generateUrl = (key, currency) => 
  `https://v6.exchangerate-api.com/v6/${key}/latest/${currency}`

const updateConversionRates = async (url) => {
  const request = await fetch(url)
  const data =  await request.json()

  conversionRates = data.conversion_rates
}

const insertCurrencyOptionIntoDOM = (currency) => {
  const isUSD = currency === 'USD'
  const isBRL = currency === 'BRL'
  
  sourceCurrencySelect.innerHTML += isUSD 
    ? generateOptionElement(currency, true) 
    : generateOptionElement(currency, false)
  
  targetCurrencySelect.innerHTML += isBRL 
    ? generateOptionElement(currency, true) 
    : generateOptionElement(currency, false)
}

const populateCurrencySelectors = (conversionRates) =>
  Object.keys(conversionRates).forEach(insertCurrencyOptionIntoDOM)


const updateDisplayedInfo = () => {
  const targetCurrency = targetCurrencySelect.value
  const sourceCurrency = sourceCurrencySelect.value
  const conversionRate = conversionRates[targetCurrency]
  const formattedConversionResult = conversionRate.toFixed(2)
  const multiplier = currencyOneTimes.value
  
  convertedValueParagraph.textContent = `
    ${multiplier * formattedConversionResult}`
  
    precisionParagraph.textContent = 
    `1 ${sourceCurrency} = ${conversionRate} ${targetCurrency}`
}

const showConversionInfo = async (currency) => {
  const url = generateUrl(APIKey, currency)
  await updateConversionRates(url)

  const isSourceCurrencySelectorEmpty = 
    sourceCurrencySelect.childElementCount === 0

  if (isSourceCurrencySelectorEmpty) {
    populateCurrencySelectors(conversionRates)
  }

  updateDisplayedInfo()
}

const handleConversionQuantityChange = event => {
  const multiplier = event.target.value
  const targetCurrency = targetCurrencySelect.value 
  const conversionRate = conversionRates[targetCurrency]
  const formattedConversionResult = (multiplier * conversionRate).toFixed(2)

  convertedValueParagraph.textContent = `${formattedConversionResult}`
}

const handleTargetCurrencyChange = () => {
  updateDisplayedInfo()
}

const handleSourceCurrencyChange = event => {
  const newCurrency = event.target.value
  showConversionInfo(newCurrency)
}

showConversionInfo('USD')

currencyOneTimes.addEventListener('input', handleConversionQuantityChange)

targetCurrencySelect.addEventListener('input', handleTargetCurrencyChange)

sourceCurrencySelect.addEventListener('input', handleSourceCurrencyChange)