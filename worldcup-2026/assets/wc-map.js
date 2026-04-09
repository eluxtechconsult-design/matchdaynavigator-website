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
  const cityIndex = {};

  function labelOffset(city) {
    if (city.lng < -120) return [14, -4];
    if (city.lng > -80) return [-14, -4];
    if (city.lat < 23) return [0, 12];
    return [14, -4];
  }

  cities.forEach(city => {
    const dot = L.circleMarker([city.lat, city.lng], {
      radius: 6,
      fillColor: "#15803d",
      color: "#15803d",
      fillOpacity: 1
    }).addTo(map);

    L.marker([city.lat, city.lng], {
      icon: L.divIcon({
        className: "wc-city-label",
        html: city.name,
        iconAnchor: labelOffset(city)
      }),
      interactive: false
    }).addTo(map);

    dot.on("click", () => zoomTo(city));
    cityIndex[city.id] = city;
    bounds.push([city.lat, city.lng]);
  });

  function zoomTo(city) {
    map.setView([city.lat, city.lng], 6, {
      animate: true,
      duration: 0.4
    });
  }

  function reset() {
    map.fitBounds(bounds, {
      padding: [100, 100],
      maxZoom: 4
    });
  }

  reset();

  document.querySelectorAll("[data-city]").forEach(el => {
    el.addEventListener("click", () => {
      zoomTo(cityIndex[el.dataset.city]);
    });
  });

  document.getElementById("reset-map")
    .addEventListener("click", reset);
})();