(async function () {
  const map = L.map("map", {
    scrollWheelZoom: false,
    zoomControl: true
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const cities = await fetch("/data/cities.json").then(r => r.json());
  const stadiums = await fetch("/data/stadiums.json").then(r => r.json());

  const bounds = [];
  const cityById = {};

  function labelOffset(city) {
    if (city.lng < -120) return [10, -2];
    if (city.lng > -80) return [-10, -2];
    if (city.lat < 23) return [0, 10];
    return [10, -2];
  }

  /* ================= MAP MARKERS ================= */

  cities.forEach(city => {
    const footballIcon = L.divIcon({
      className: "football-marker",
      html: "⚽",
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const marker = L.marker([city.lat, city.lng], {
      icon: footballIcon
    }).addTo(map);

    // City name label
    L.marker([city.lat, city.lng], {
      icon: L.divIcon({
        className: "wc-city-label",
        html: city.name,
        iconAnchor: labelOffset(city)
      }),
      interactive: false
    }).addTo(map);

    marker.on("click", () => activateCity(city.id));

    cityById[city.id] = city;
    bounds.push([city.lat, city.lng]);
  });

  /* ================= CITY ACTIVATION ================= */

  function activateCity(cityId) {
    const city = cityById[cityId];
    if (!city) return;

    map.setView([city.lat, city.lng], 6, { animate: true });

    // Clear all stadium lists
    document.querySelectorAll(".stadium-list").forEach(list => {
      list.innerHTML = "";
    });

    const container =
      document.querySelector(`[data-city="${cityId}"] .stadium-list`);
    if (!container) return;

    stadiums
      .filter(s => s.cityId === cityId)
      .forEach(s => {
        const li = document.createElement("li");

        const link = document.createElement("a");
        link.href = `/worldcup-2026/stadiums/?id=${s.id}`;
        link.textContent = s.name;

        li.appendChild(link);
        container.appendChild(li);
      });
  }

  /* ================= CITY LIST CLICK (RESTORED ✅) ================= */
  document.querySelectorAll("[data-city]").forEach(cityItem => {
    cityItem.addEventListener("click", event => {
      // Allow stadium <a> links to work normally
      if (event.target.tagName === "A") return;

      activateCity(cityItem.dataset.city);
    });
  });

  /* ================= INITIAL VIEW ================= */

  map.fitBounds(bounds, {
    padding: [90, 90],
    maxZoom: 4
  });

})();