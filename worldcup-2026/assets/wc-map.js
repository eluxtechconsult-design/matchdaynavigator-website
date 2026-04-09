/**
 * WC 2026 Match Map – FINAL
 * Bullet points + city labels
 * Fully interactive
 * Resettable
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

  function labelOffset(city) {
    if (city.lng < -120) return [12, -2];
    if (city.lng > -80) return [-12, -2];
    if (city.lat < 23) return [0, 10];
    return [12, -2];
  }

  cities.forEach(city => {
    // ✅ Bullet marker
    const bullet = L.circleMarker([city.lat, city.lng], {
      radius: 6,
      fillColor: "#15803d",
      color: "#15803d",
      fillOpacity: 1
    }).addTo(map);

    // ✅ City name next to bullet
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

  // Initial landing
  resetMap();

  // List → map
  document.querySelectorAll("[data-city]").forEach(el => {
    el.addEventListener("click", () => {
      zoomTo(cityById[el.dataset.city]);
    });
  });

  // Reset control
  document.getElementById("reset-map")
    ?.addEventListener("click", resetMap);
})();
