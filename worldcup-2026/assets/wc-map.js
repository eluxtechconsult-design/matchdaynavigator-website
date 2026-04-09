/**
 * World Cup 2026 Match Map
 * - Big landing view
 * - Numbered markers with city name above
 * - All 16 cities visible on load
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
  const markersById = {};

  cities.forEach((city, index) => {
    const number = index + 1;

    const icon = L.divIcon({
      className: "wc-city-marker",
      html: `
        <div class="city-label">${city.name}</div>
        <div class="city-number">${number}</div>
      `,
      iconSize: [120, 48],
      iconAnchor: [60, 48]
    });

    const marker = L.marker([city.lat, city.lng], { icon }).addTo(map);

    markersById[city.id] = marker;
    bounds.push([city.lat, city.lng]);
  });

  // ✅ Map now lands big and confident
  map.fitBounds(bounds, {
    padding: [100, 100],
    maxZoom: 4
  });

  // ✅ City list remains interactive
  document.querySelectorAll("[data-city]").forEach(item => {
    item.addEventListener("click", () => {
      const marker = markersById[item.dataset.city];
      if (!marker) return;

      map.setView(marker.getLatLng(), 6, { animate: true });
    });
  });
})();
