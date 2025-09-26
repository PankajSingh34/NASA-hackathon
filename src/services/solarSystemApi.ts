// Solar System API service for real planet data
// Add your API key below when you receive it

const API_BASE = 'https://corsproxy.io/?https://api.le-systeme-solaire.net/rest';
// For browser projects, use a global variable or import from a config file
// Example: window.REACT_APP_SOLAR_API_KEY or import from .env via Vite
const API_KEY = 'b8499d94-89de-42b2-9edf-ef7a0d25fcd1';

export async function fetchPlanets() {
  const apiUrl = 'http://localhost:4000/api/planets';
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error('Network response was not ok');
  const data = await response.json();
  return data.bodies || [];
}

export async function fetchPlanetPosition(name: string, lon = 0, lat = 0, datetime = new Date().toISOString()) {
  const url = `${API_BASE}/positions?name=${encodeURIComponent(name)}&lon=${lon}&lat=${lat}&datetime=${encodeURIComponent(datetime)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch planet position');
  return await res.json();
}

// Usage:
// 1. Set REACT_APP_SOLAR_API_KEY in your .env file or pass directly.
// 2. Call fetchPlanets() to get all planet data.
// 3. Call fetchPlanetPosition(name, lon, lat, datetime) for real-time position.
