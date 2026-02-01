import { ref, readonly } from 'vue'

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

export function useWeather() {
  const weather = ref(null)
  const loading = ref(false)
  const error = ref('')

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

  // Validate API key on initialization
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.error('OpenWeatherMap API key is not configured. Please set VITE_OPENWEATHER_API_KEY in your .env file.')
  }

  async function fetchWeather(cityName) {
    const trimmedCity = cityName?.trim()

    if (!trimmedCity) {
      error.value = 'Please enter a city name'
      return false
    }

    if (!API_KEY || API_KEY === 'your_api_key_here') {
      error.value = 'API key is not configured. Please check your environment setup.'
      return false
    }

    loading.value = true
    error.value = ''
    weather.value = null

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      const response = await fetch(
        `${API_BASE_URL}?q=${encodeURIComponent(trimmedCity)}&appid=${API_KEY}&units=metric`,
        { signal: controller.signal }
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorMessages = {
          404: 'City not found. Please check the spelling and try again.',
          401: 'Invalid API key. Please check your configuration.',
          429: 'Too many requests. Please wait a moment and try again.',
          500: 'Weather service is temporarily unavailable.',
          503: 'Weather service is temporarily unavailable.'
        }
        throw new Error(errorMessages[response.status] || 'Failed to fetch weather data.')
      }

      const data = await response.json()

      weather.value = {
        cityName: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        tempMin: Math.round(data.main.temp_min),
        tempMax: Math.round(data.main.temp_max),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        visibility: data.visibility ? (data.visibility / 1000).toFixed(1) : 'N/A'
      }

      return true
    } catch (err) {
      if (err.name === 'AbortError') {
        error.value = 'Request timed out. Please check your connection and try again.'
      } else if (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) {
        error.value = 'Network error. Please check your internet connection.'
      } else {
        error.value = err.message
      }
      return false
    } finally {
      loading.value = false
    }
  }

  function clearWeather() {
    weather.value = null
    error.value = ''
  }

  function getIconUrl(iconCode) {
    if (!iconCode) return ''
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`
  }

  return {
    weather: readonly(weather),
    loading: readonly(loading),
    error: readonly(error),
    fetchWeather,
    clearWeather,
    getIconUrl
  }
}
