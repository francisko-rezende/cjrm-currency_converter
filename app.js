const sourceCurrencySelect = document.querySelector('[data-js="currency-one"]')
const targetCurrencySelect = document.querySelector('[data-js="currency-two"]')
const convertedValueParagraph = document.querySelector('[data-js="converted-value"]')
const currencyOneTimes = document.querySelector('[data-js="currency-one-times"]')
const precisionParagraph = document.querySelector('[data-js="conversion-precision"]')

const APIKey = '9e3a6fd942b2712ab9af7ee0'
let conversionRateData = null

const updateDisplayedInfo = () => {
  const sourceCurrency = sourceCurrencySelect.value
  const targetCurrency = targetCurrencySelect.value
  const conversionRate = conversionRateData[targetCurrency]
  const multiplier = currencyOneTimes.value
  const formattedConversionResult = (multiplier * conversionRate).toFixed(2)
  
  convertedValueParagraph.textContent = `${formattedConversionResult}`
  
  precisionParagraph.textContent = 
    `1 ${sourceCurrency} = ${conversionRate} ${targetCurrency}`
}

const generateOptionElement = (currency, isSelected) =>
  isSelected 
    ? `<option value="${currency}" selected>${currency}</option>`
    : `<option value="${currency}">${currency}</option>`

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

const populateCurrencySelectors = (conversionRateData) =>
  Object.keys(conversionRateData).forEach(insertCurrencyOptionIntoDOM)

const generateUrl = (key, currency) => 
  `https://v6.exchangerate-api.com/v6/${key}/latest/${currency}`

const updateConversionRateData = async (url) => {
  const request = await fetch(url)
  const data =  await request.json()

  conversionRateData = data.conversion_rates
}

const showConversionInfo = async (currency) => {
  const url = generateUrl(APIKey, currency)
  await updateConversionRateData(url)

  const isSourceCurrencySelectorEmpty = 
    sourceCurrencySelect.childElementCount === 0

  if (isSourceCurrencySelectorEmpty) {
    populateCurrencySelectors(conversionRateData)
  }

  updateDisplayedInfo()
}

const handleConversionQuantityChange = event => {
  const targetCurrency = targetCurrencySelect.value 
  const conversionRate = conversionRateData[targetCurrency]
  const multiplier = event.target.value
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