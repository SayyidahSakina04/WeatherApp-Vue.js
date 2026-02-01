<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWeather } from './composables/useWeather'

// Weather composable
const { weather, loading, error, fetchWeather, getIconUrl } = useWeather()

// Local state
const city = ref('')
const inputRef = ref(null)

// Get current date formatted
const currentDate = computed(() => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date().toLocaleDateString('en-US', options)
})

// Handle search
async function handleSearch() {
  if (loading.value) return
  await fetchWeather(city.value)
}

// Handle Enter key press
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    handleSearch()
  }
}

// Focus input on mount
onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6">
    <main class="w-full max-w-lg" role="main">
      <!-- Main Card -->
      <article class="bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
        <!-- Header -->
        <header class="px-6 pt-6 pb-4">
          <div class="flex items-center justify-between mb-1">
            <h1 class="text-xl font-semibold text-white tracking-tight">Weather</h1>
            <time :datetime="new Date().toISOString()" class="text-xs text-slate-400">
              {{ currentDate }}
            </time>
          </div>

          <!-- Search Bar -->
          <search class="mt-4 relative" role="search">
            <label for="city-input" class="sr-only">Search for a city</label>
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" aria-hidden="true">
              <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="city-input"
              ref="inputRef"
              v-model="city"
              @keypress="handleKeyPress"
              type="text"
              placeholder="Search city..."
              autocomplete="off"
              autocapitalize="words"
              spellcheck="false"
              class="w-full pl-12 pr-24 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              :disabled="loading"
              :aria-busy="loading"
              aria-describedby="search-hint"
            />
            <span id="search-hint" class="sr-only">Press Enter or click Search to get weather information</span>
            <button
              @click="handleSearch"
              :disabled="loading"
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :aria-label="loading ? 'Searching...' : 'Search for weather'"
            >
              <span v-if="!loading">Search</span>
              <svg v-else class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </search>
        </header>

        <!-- Error Message -->
        <div
          v-if="error"
          class="mx-6 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
          role="alert"
          aria-live="polite"
        >
          <div class="flex items-center gap-2 text-red-400">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm">{{ error }}</span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="px-6 pb-8 pt-4" aria-live="polite" aria-busy="true">
          <div class="flex flex-col items-center justify-center py-12">
            <div class="w-12 h-12 border-3 border-slate-600 border-t-blue-500 rounded-full animate-spin" aria-hidden="true"></div>
            <p class="mt-4 text-slate-400 text-sm">Fetching weather data...</p>
          </div>
        </div>

        <!-- Weather Display -->
        <section v-else-if="weather" class="px-6 pb-6" aria-label="Weather information">
          <!-- Location -->
          <div class="flex items-center gap-2 text-slate-400 mb-4">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 class="text-sm font-medium">{{ weather.cityName }}, {{ weather.country }}</h2>
          </div>

          <!-- Main Weather Info -->
          <div class="flex items-center justify-between">
            <div>
              <p class="text-7xl font-light text-white tracking-tighter" aria-label="Current temperature">
                {{ weather.temperature }}<span class="text-4xl text-slate-400" aria-hidden="true">°</span>
                <span class="sr-only">degrees Celsius</span>
              </p>
              <p class="text-slate-400 text-sm mt-1">
                Feels like {{ weather.feelsLike }}°
              </p>
            </div>
            <div class="text-right">
              <img
                :src="getIconUrl(weather.icon)"
                :alt="`Weather icon: ${weather.description}`"
                class="w-24 h-24 -mr-2"
                width="96"
                height="96"
                loading="eager"
              />
              <p class="text-white font-medium capitalize -mt-2">{{ weather.condition }}</p>
              <p class="text-slate-400 text-sm capitalize">{{ weather.description }}</p>
            </div>
          </div>

          <!-- Temperature Range -->
          <div class="mt-4 flex items-center gap-4 text-sm" aria-label="Temperature range">
            <div class="flex items-center gap-1.5 text-slate-400">
              <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span>Low: {{ weather.tempMin }}°</span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-400">
              <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>High: {{ weather.tempMax }}°</span>
            </div>
          </div>

          <!-- Divider -->
          <hr class="my-5 border-slate-700" aria-hidden="true" />

          <!-- Weather Details Grid -->
          <dl class="grid grid-cols-2 gap-3">
            <div class="bg-slate-700/30 rounded-xl p-4">
              <dt class="flex items-center gap-2 text-slate-400 mb-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
                <span class="text-xs font-medium uppercase tracking-wide">Humidity</span>
              </dt>
              <dd class="text-2xl font-semibold text-white">{{ weather.humidity }}<span class="text-sm text-slate-400 ml-0.5">%</span></dd>
            </div>

            <div class="bg-slate-700/30 rounded-xl p-4">
              <dt class="flex items-center gap-2 text-slate-400 mb-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
                <span class="text-xs font-medium uppercase tracking-wide">Wind</span>
              </dt>
              <dd class="text-2xl font-semibold text-white">{{ weather.windSpeed }}<span class="text-sm text-slate-400 ml-1">m/s</span></dd>
            </div>

            <div class="bg-slate-700/30 rounded-xl p-4">
              <dt class="flex items-center gap-2 text-slate-400 mb-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span class="text-xs font-medium uppercase tracking-wide">Pressure</span>
              </dt>
              <dd class="text-2xl font-semibold text-white">{{ weather.pressure }}<span class="text-sm text-slate-400 ml-1">hPa</span></dd>
            </div>

            <div class="bg-slate-700/30 rounded-xl p-4">
              <dt class="flex items-center gap-2 text-slate-400 mb-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <span class="text-xs font-medium uppercase tracking-wide">Visibility</span>
              </dt>
              <dd class="text-2xl font-semibold text-white">{{ weather.visibility }}<span class="text-sm text-slate-400 ml-1">km</span></dd>
            </div>
          </dl>
        </section>

        <!-- Initial State -->
        <section v-else-if="!error && !loading" class="px-6 pb-8 pt-4" aria-label="Welcome message">
          <div class="flex flex-col items-center justify-center py-8 text-center">
            <div class="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
              <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
              </svg>
            </div>
            <p class="text-slate-400 text-sm">Enter a city name to get started</p>
            <p class="text-slate-500 text-xs mt-1">Search for any city worldwide</p>
          </div>
        </section>
      </article>

      <!-- Footer -->
      <footer class="text-center text-slate-500 text-xs mt-4">
        <p>Data provided by <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer" class="hover:text-slate-400 transition-colors">OpenWeatherMap</a></p>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.border-3 {
  border-width: 3px;
}
</style>
