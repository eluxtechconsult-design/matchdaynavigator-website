(async function () {
  // Initialize map
  const map = L.map("map", {
    scrollWheelZoom: false
  });

  // Base tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  // Load city data
  const cities = await fetch("../data/cities.json").then(r => r.json());

  const markers = {};
  const bounds = [];

  // Render city markers
  cities.forEach(city => {
    const marker = L.circleMarker([city.lat, city.lng], {
      radius: 7,
      color: "#16a34a",
      fillColor: "#16a34a",
      fillOpacity: 0.9
    }).addTo(map);

    marker.bindTooltip(city.name, {
      direction: "top",
      offset: [0, -8]
    });

    markers[city.id] = marker;
    bounds.push([city.lat, city.lng]);
  });

  // Fit map to all host cities
  map.fitBounds(bounds, {
    padding: [48, 48]
  });

  // City selector → map interaction
  document.querySelectorAll("[data-city]").forEach(item => {
    item.addEventListener("click", () => {
      const cityId = item.dataset.city;
      const city = cities.find(c => c.id === cityId);
      if (!city) return;

      map.setView([city.lat, city.lng], 6);
      markers[cityId].openTooltip();
    });
  });
})();
