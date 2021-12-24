const conversionSourceCurrencySelect = document.querySelector('[data-js="currency-one"]')
const conversionTargetCurrencySelect = document.querySelector('[data-js="currency-two"]')
const convertedValueParagraph = document.querySelector('[data-js="converted-value"]')
const currencyOneTimes = document.querySelector('[data-js="currency-one-times"]')
const conversionPrecisionParagraph = document.querySelector('[data-js="conversion-precision"]')

const APIKey = '9e3a6fd942b2712ab9af7ee0'
let conversionRates

const generateOptionElement = (currency, conversionRate, isSelected) =>
  isSelected 
    ? `<option value="${currency}"  data-conversion-rate="${conversionRate}" selected>${currency}</option>`
    : `<option value="${currency}" data-conversion-rate="${conversionRate}" >${currency}</option>`

const insertCurrencyOptionIntoDOM = ([currency, conversionRate]) => {
  const isUSD = currency === 'USD'
  const isBRL = currency === 'BRL'

  conversionSourceCurrencySelect.innerHTML += isUSD 
  ? generateOptionElement(currency, conversionRate, true) 
  : generateOptionElement(currency, conversionRate, false)
  
  conversionTargetCurrencySelect.innerHTML += isBRL 
  ? generateOptionElement(currency, conversionRate, true) 
  : generateOptionElement(currency, conversionRate, false)
}

const generateUrl = (key, currency) => 
  `https://v6.exchangerate-api.com/v6/${key}/latest/${currency}`

const updateConversionRates = async (url) => {
  const request = await fetch(url)
  const data =  await request.json()

  conversionRates = data.conversion_rates
}

const populateCurrencySelectors = (conversionRates) => {
  Object.entries(conversionRates).forEach(insertCurrencyOptionIntoDOM)
}

const updateDisplayedInfo = () => {
  const targetCurrency = conversionTargetCurrencySelect.value
  const sourceCurrency = conversionSourceCurrencySelect.value
  const conversionRate = conversionRates[targetCurrency]
  const formattedConversionResult = conversionRate.toFixed(2)
  
  convertedValueParagraph.textContent = `${formattedConversionResult}`
  conversionPrecisionParagraph.textContent = 
    `1 ${sourceCurrency} = ${conversionRate} ${targetCurrency}`
}

const showConversionInfo = async (currency) => {
  const url = generateUrl(APIKey, currency)
  await updateConversionRates(url)

  const isSourceCurrencySelectorEmpty = 
    conversionSourceCurrencySelect.childElementCount === 0

  if (isSourceCurrencySelectorEmpty) {
    populateCurrencySelectors(conversionRates)
  }

  updateDisplayedInfo()
}

showConversionInfo('USD')

currencyOneTimes.addEventListener('input', event => {
  const multiplier = event.target.value
  const targetCurrency = conversionTargetCurrencySelect.value 
  const conversionRate = conversionRates[targetCurrency]
  const formattedConversionResult = (multiplier * conversionRate).toFixed(2)

  convertedValueParagraph.textContent = `${formattedConversionResult}`
})

conversionTargetCurrencySelect.addEventListener('input', () => {
  updateDisplayedInfo()
})

conversionSourceCurrencySelect.addEventListener('input', event => {
  const newCurrency = event.target.value
  showConversionInfo(newCurrency)
})