(async function () {
  const map = L.map("map", {
    scrollWheelZoom: false
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const cities = await fetch("../data/cities.json").then(r => r.json());

  const markers = {};
  const bounds = [];

  cities.forEach(city => {
    const marker = L.circleMarker([city.lat, city.lng], {
      radius: 7,
      color: "#16a34a",
      fillColor: "#16a34a",
      fillOpacity: 0.9
    }).addTo(map);

    marker.bindTooltip(city.name, { direction: "top", offset: [0, -8] });

    markers[city.id] = marker;
    bounds.push([city.lat, city.lng]);
  });

  map.fitBounds(bounds, { padding: [48, 48] });

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