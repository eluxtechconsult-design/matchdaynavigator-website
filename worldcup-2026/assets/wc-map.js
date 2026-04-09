/**
 * WC 2026 Match Map – FINAL (Adjusted bullet size & alignment)
 * - Half-size bullets
 * - City names aligned to bullets
 * - Fully interactive
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
  const cityById = {};

  /**
   * Label offsets so name visually "hits" bullet
   * Smaller offsets now that bullets are smaller
   */
  function labelOffset(city) {
    if (city.lng < -120) return [8, -2];   // West Coast
    if (city.lng > -80) return [-8, -2];   // East Coast
    if (city.lat < 23) return [0, 8];      // Mexico
    return [8, -2];                         // Default
  }

  cities.forEach(city => {
    // ✅ HALF-SIZE bullet
    const bullet = L.circleMarker([city.lat, city.lng], {
      radius: 3,                 // was 6
      fillColor: "#15803d",
      color: "#15803d",
      fillOpacity: 1
    }).addTo(map);

    // ✅ City name aligned tightly to bullet
    L.marker([city.lat, city.lng], {
      icon: L.divIcon({
        className: "wc-city-label",
        html: city.name,
        iconAnchor: labelOffset(city)
      }),
      interactive: false
    }).addTo(map);

    bullet.on("click", () => zoomTo(city));

    cityById[city.id] = city;
    bounds.push([city.lat, city.lng]);
  });

  function zoomTo(city) {
    map.setView([city.lat, city.lng], 6, {
      animate: true,
      duration: 0.4
    });
  }

  function resetMap() {
    map.fitBounds(bounds, {
      padding: [100, 100],
      maxZoom: 4
    });
  }

  // Initial landing state
  resetMap();

  // List → map interaction
  document.querySelectorAll("[data-city]").forEach(el => {
    el.addEventListener("click", () => {
      zoomTo(cityById[el.dataset.city]);
    });
  });

  // Reset control
  document.getElementById("reset-map")
    ?.addEventListener("click", resetMap);
})();