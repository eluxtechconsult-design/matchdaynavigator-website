(async function () {
  const map = L.map("map", {
    scrollWheelZoom: false,
    zoomControl: true
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const cities = await fetch("../data/cities.json").then(r => r.json());
  const stadiums = await fetch("../data/stadiums.json").then(r => r.json());

  const bounds = [];
  const cityById = {};

  function labelOffset(city) {
    if (city.lng < -120) return [8, -2];
    if (city.lng > -80) return [-8, -2];
    if (city.lat < 23) return [0, 8];
    return [8, -2];
  }

  cities.forEach(city => {
    const bullet = L.circleMarker([city.lat, city.lng], {
      radius: 3,
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

    bullet.on("click", () => activateCity(city.id));

    cityById[city.id] = city;
    bounds.push([city.lat, city.lng]);
  });

  function activateCity(cityId) {
    const city = cityById[cityId];
    map.setView([city.lat, city.lng], 6, { animate: true });

    document.querySelectorAll(".stadium-list").forEach(list => {
      list.innerHTML = "";
    });

    const container =
      document.querySelector(`[data-city="${cityId}"] .stadium-list`);

    stadiums
      .filter(s => s.cityId === cityId)
      .forEach(s => {
        const li = document.createElement("li");
        li.innerHTML =
          `<a href="/worldcup-2026/stadiums/?id=${s.id}">${s.name}</a>`;
        container.appendChild(li);
      });
  }

  function resetMap() {
    map.fitBounds(bounds, {
      padding: [100, 100],
      maxZoom: 4
    });
    document.querySelectorAll(".stadium-list").forEach(l => l.innerHTML = "");
  }

  resetMap();

  document.querySelectorAll("[data-city]").forEach(el => {
    el.addEventListener("click", () => activateCity(el.dataset.city));
  });

  document.getElementById("reset-map")
    .addEventListener("click", resetMap);
})();