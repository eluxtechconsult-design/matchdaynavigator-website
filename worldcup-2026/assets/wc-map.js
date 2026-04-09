/**
 * World Cup 2026 Match Map
 * - Big landing view
 * - Numbered markers (1–16)
 * - City name displayed above each number
 * - Clean fitBounds on load
 * - List remains clickable (list → zoom)
 */

(async function () {
  // Initialise map
  const map = L.map("map", {
    scrollWheelZoom: false,
    zoomControl: true
  });

  // Base tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  // Load cities
  const cities = await fetch("../data/cities.json").then(r => r.json());

  const bounds = [];
  const markersById = {};

  // Helper: adjust label anchor slightly by region to avoid collisions
  function labelAnchor(city) {
    if (city.lng < -120) return [60, 46];       // West Coast
    if (city.lng < -95) return [60, 46];        // Central USA
    if (city.lng > -80) return [60, 46];        // East Coast / Canada East
    if (city.lat < 23) return [60, 20];         // Mexico
    return [60, 46];
