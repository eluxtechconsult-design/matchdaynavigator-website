/**
 * WC 2026 Match Map – FINAL
 * Bullet markers + city names
 * Fully interactive
 * Resettable view
 */

(async function () {
  const map = L.map("map", {
    scrollWheelZoom: false,
    zoomControl: true
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const cities = await fetch("../data/cities.json").then(r => r.json());
  const bounds = [];
  const markers = {};

  function labelOffset(city) {
    if (city.lng < -120) return [14, -4]; // West
    if (city.lng < -95) return [14, -4];  // Central
    if (city.lng > -80) return [-14, -4]; // East
    if (city.lat < 23) return [0, 12];    // Mexico
    return [14, -4];
  }

  cities.forEach(city => {
    // Bullet marker
    const marker = L.circleMarker([city.lat, city.lng], {
      radius: 6,
      color: "#15803d",
      fillColor: "#15803d",
      fillOpacity: 1
    }).addTo(map);

    // City label next to bullet
    L.marker([city.lat, city.lng], {
      icon: L.divIcon({
        className: "wc-city-label",
        html: city.name,
        iconAnchor: labelOffset(city)
      }),
      interactive: false
    }).addTo(map);

    marker.on("click", () => {
      zoomToCity(city);
    });

    markers[city.id] = marker;
    bounds.push([city.lat, city.lng]);
  });

  function zoomToCity(city) {
    map.setView([city.lat, city.lng], 6, {
      animate: true,
      duration: 0.5
    });
  }

  function resetMap() {
    map.fitBounds(bounds, {
      padding: [100, 100],
      maxZoom: 4
    });
  }

  // Initial landing
  resetMap();

  // List → map interaction
  document.querySelectorAll("[data-city]").forEach(item => {
    item.addEventListener("click", () => {
      const city = cities.find(c => c.id === item.dataset.city);
      if (!city) return;
      zoomToCity(city);
    });
  });

