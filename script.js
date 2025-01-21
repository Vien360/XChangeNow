const currencyToCountry = {
  USD: "us",
  EUR: "eu",
  MXN: "mx",
  CLP: "cl",
  ARS: "ar",
  GBP: "gb",
  JPY: "jp",
  CAD: "ca",
  AUD: "au",
  INR: "in",
  BRL: "br",
  CNY: "cn",
  ZAR: "za",
  RUB: "ru",
  KRW: "kr",
};

// Seleccionar los elementos
const currencySelectFrom = document.getElementById("from-currency");
const currencySelectTo = document.getElementById("to-currency");
const flagImageFrom = document.getElementById("flag-from");
const flagImageTo = document.getElementById("flag-to");

// Función para cargar el tipo de cambio desde una API confiable
async function getExchangeRate(fromCurrency, toCurrency) {
  const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
  const data = await response.json();
  return data.rates[toCurrency];
}

// Formatear moneda
function formatCurrency(amount, currencyCode) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount);
}

// Actualizar las banderas
function updateFlag(selectElement, flagImage) {
  const countryCode = currencyToCountry[selectElement.value];
  if (countryCode) {
    flagImage.src = `https://flagcdn.com/w40/${countryCode}.png`;
  }
}

// Llamadas iniciales al cargar
document.addEventListener('DOMContentLoaded', () => {
  // Actualizar las banderas al cargar la página
  updateFlag(currencySelectFrom, flagImageFrom);
  updateFlag(currencySelectTo, flagImageTo);
  updateLanguage();
});

// Llamada cuando se cambia la moneda "de"
currencySelectFrom.addEventListener('change', () => {
  updateFlag(currencySelectFrom, flagImageFrom); // Actualiza la bandera cuando se cambia la moneda "de"
});

// Llamada cuando se cambia la moneda "a"
currencySelectTo.addEventListener('change', () => {
  updateFlag(currencySelectTo, flagImageTo); // Actualiza la bandera cuando se cambia la moneda "a"
});

let lastConversion = {
  amount: null,
  fromCurrency: null,
  toCurrency: null,
  convertedAmount: null,
};
const resultElement = document.getElementById("result");

document.getElementById("currency-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const selectedLanguage = languageSelector.value;
  const amountInput = document.getElementById("amount");
  let amount = parseFloat(amountInput.value);
  const fromCurrency = currencySelectFrom.value;
  const toCurrency = currencySelectTo.value;

  if (isNaN(amount) || amount <= 0) {
    resultElement.textContent = translations[selectedLanguage].errorInvalidAmount;
    return;
  }

  if (fromCurrency === toCurrency) {
    resultElement.textContent = translations[selectedLanguage].errorSameCurrency;
    return;
  }

  try {
    resultElement.textContent = translations[selectedLanguage].calculating;
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = (amount * exchangeRate).toFixed(2);

    // Guardar los datos de la conversión en variables globales
    lastConversion = { amount, fromCurrency, toCurrency, convertedAmount };

    // Mostrar el resultado traducido
    resultElement.textContent = translations[selectedLanguage].resultText
      .replace("{amount}", formatCurrency(amount, fromCurrency))
      .replace("{from}", fromCurrency)
      .replace("{convertedAmount}", formatCurrency(convertedAmount, toCurrency))
      .replace("{to}", toCurrency);
  } catch (error) {
    console.error("Error de conversión:", error);
    resultElement.textContent = translations[selectedLanguage].conversionError;
  }
});

// Obtener el selector de idioma
const languageSelector = document.getElementById('language-selector');

const translations = {
  en: {
    title: "Currency Converter💰",
    inputPlaceholder: "Ex: 100",
    amountLabel: "Amount:",
    fromLabel: "From:",
    toLabel: "To:",
    convertButton: "Convert",
    errorInvalidAmount: "Please enter a valid amount greater than zero.",
    errorSameCurrency: "Please select different currencies.",
    calculating: "Calculating...",
    resultText: "{amount} {from} equals {convertedAmount} {to}.",
    conversionError: "Error converting. Please try again.",
  },
  es: {
    title: "Conversor de Monedas💰",
    inputPlaceholder: "Ej: 100",
    amountLabel: "Cantidad:",
    fromLabel: "De:",
    toLabel: "A:",
    convertButton: "Convertir",
    errorInvalidAmount: "Por favor, ingresa una cantidad válida mayor a cero.",
    errorSameCurrency: "Por favor, selecciona monedas distintas.",
    calculating: "Calculando...",
    resultText: "{amount} {from} son equivalentes a {convertedAmount} {to}.",
    conversionError: "Error al convertir. Intenta nuevamente.",
  }
};

function updateLanguage() {
  const selectedLanguage = languageSelector.value;

  // Actualizar textos visibles
  document.querySelector('.language-title').innerText = translations[selectedLanguage].title;
  document.querySelector('label[for="amount"]').innerText = translations[selectedLanguage].amountLabel;
  document.querySelector('label[for="from-currency"]').innerText = translations[selectedLanguage].fromLabel;
  document.querySelector('label[for="to-currency"]').innerText = translations[selectedLanguage].toLabel;
  document.querySelector('button[type="submit"]').innerText = translations[selectedLanguage].convertButton;

  // Actualizar placeholders
  document.getElementById('amount').placeholder = translations[selectedLanguage].inputPlaceholder;

  // Actualizar el texto del resultado si ya hay una conversión
  if (lastConversion.amount !== null) {
    resultElement.textContent = translations[selectedLanguage].resultText
      .replace("{amount}", formatCurrency(lastConversion.amount, lastConversion.fromCurrency))
      .replace("{from}", lastConversion.fromCurrency)
      .replace("{convertedAmount}", formatCurrency(lastConversion.convertedAmount, lastConversion.toCurrency))
      .replace("{to}", lastConversion.toCurrency);
  }
}

languageSelector.addEventListener('change', updateLanguage);

// Actualizar idioma al cargar la página
document.addEventListener('DOMContentLoaded', updateLanguage);

document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger");
  const navLinks = document.querySelector(".nav-links");

  burger.addEventListener("click", () => {
    // Alternar la clase 'active' para mostrar/ocultar los enlaces
    navLinks.classList.toggle("active");

    // Animar las líneas del menú burger
    burger.classList.toggle("toggle");
  });
});
