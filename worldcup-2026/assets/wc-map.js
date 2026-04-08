(async function () {
  const map = L.map("map", { scrollWheelZoom: false });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const cities = await fetch("../data/cities.json").then(r => r.json());

  const bounds = [];
  const markers = {};

  cities.forEach(city => {
    const marker = L.circleMarker([city.lat, city.lng], {
      radius: 7,
      color: "#2563eb",
      fillColor: "#2563eb",
      fillOpacity: 0.9
    }).addTo(map);

    marker.bindTooltip(city.name);
    markers[city.id] = marker;
    bounds.push([city.lat, city.lng]);
  });

  map.fitBounds(bounds, { padding: [40, 40] });

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
