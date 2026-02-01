# Weather App

A modern, responsive weather application built with Vue 3 and Tailwind CSS. Get real-time weather information for any city worldwide.

## Features

- **Real-time Weather Data** - Current temperature, feels like, min/max temperatures
- **Detailed Metrics** - Humidity, wind speed, pressure, visibility
- **City Search** - Search for any city worldwide
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Theme** - Modern dark UI that's easy on the eyes
- **Accessible** - WCAG compliant with proper ARIA labels and semantic HTML
- **Production Ready** - Optimized build with code splitting and minification

## Tech Stack

- **Vue 3** - Composition API with `<script setup>`
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **OpenWeatherMap API** - Weather data provider

## Prerequisites

- Node.js v20.19.0+ or v22.12.0+
- npm or yarn
- OpenWeatherMap API key (free)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/weather-app.git
cd weather-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Add your OpenWeatherMap API key:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

> Get your free API key at [OpenWeatherMap](https://openweathermap.org/api)

### 4. Run the development server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

## Project Structure

```
src/
├── assets/
│   └── main.css            # Tailwind CSS import
├── composables/
│   └── useWeather.js       # Weather API logic (fetch, error handling)
├── App.vue                 # Main application component
└── main.js                 # App entry point
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_OPENWEATHER_API_KEY` | OpenWeatherMap API key | Yes |

## API Reference

This app uses the [OpenWeatherMap Current Weather API](https://openweathermap.org/current).

**Endpoint:** `https://api.openweathermap.org/data/2.5/weather`

**Parameters:**
- `q` - City name
- `appid` - API key
- `units` - Temperature units (metric)

## Deployment

Build the app for production:

```bash
npm run build
```

The `dist/` folder contains static files ready to deploy to any hosting service:

- [Netlify](https://netlify.com)
- [Vercel](https://vercel.com)
- [GitHub Pages](https://pages.github.com)
- [Cloudflare Pages](https://pages.cloudflare.com)

