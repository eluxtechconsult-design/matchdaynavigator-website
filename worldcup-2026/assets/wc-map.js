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
  const markers = [];

  cities.forEach(city => {
    const marker = L.circleMarker([city.lat, city.lng], {
      radius: 7,
      color: "#16a34a",
      fillColor: "#16a34a",
      fillOpacity: 0.95
    }).addTo(map);

    /* ✅ City name visible on hover AND click */
    marker.bindTooltip(city.name, {
      permanent: false,
      direction: "top",
      offset: [0, -6]
    });

    markers.push(marker);
    bounds.push([city.lat, city.lng]);
  });

  /* ✅ Anchor map clearly on load */
  map.fitBounds(bounds, {
    paddingTopLeft: [60, 60],
    paddingBottomRight: [60, 60],
    maxZoom: 4
  });

  /* ✅ Selector interaction */
  document.querySelectorAll("[data-city]").forEach(item => {
    item.addEventListener("click", () => {
      const id = item.dataset.city;
      const city = cities.find(c => c.id === id);
      if (!city) return;

      map.setView([city.lat, city.lng], 6, {
        animate: true,
        duration: 0.5
      });
    });
  });
})();
