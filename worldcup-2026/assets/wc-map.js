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

  cities.forEach((city, index) => {
    // Base marker
    L.circleMarker([city.lat, city.lng], {
      radius: 7,
      color: "#16a34a",
      fillColor: "#16a34a",
      fillOpacity: 0.95
    }).addTo(map);

    // Slight vertical offset for labels to reduce collisions
    const yOffset = -14 - (index % 3) * 4;

    // ✅ Permanent city labels
    L.marker([city.lat, city.lng], {
      icon: L.divIcon({
        className: "city-label",
        html: city.name,
        iconAnchor: [-6, yOffset]
      })
    }).addTo(map);

    bounds.push([city.lat, city.lng]);
  });

  // ✅ Anchor map cleanly around all cities
  map.fitBounds(bounds, {
    padding: [80, 80],
    maxZoom: 4
  });
})();