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
  const markerByCity = {};

  function labelOffset(city) {
    if (city.lng < -120) return [10, -2];
    if (city.lng > -80) return [-10, -2];
    if (city.lat < 23) return [0, 10];
    return [10, -2];
  }

  /* ================= RESET ACTIVE STATES ================= */
  function clearActiveStates() {
    document.querySelectorAll(".football-marker").forEach(el =>
      el.classList.remove("active")
    );
    document.querySelectorAll("[data-city]").forEach(el =>
      el.classList.remove("active")
    );
  }

  /* ================= ACTIVATE CITY ================= */
  function activateCity(cityId) {
    const city = cityById[cityId];
    if (!city) return;

    map.setView([city.lat, city.lng], 6, { animate: true });

    clearActiveStates();

    // Highlight active city in list
    const cityListItem =
      document.querySelector(`[data-city="${cityId}"]`);
    if (cityListItem) cityListItem.classList.add("active");

    // Highlight active football
    if (markerByCity[cityId]) {
      markerByCity[cityId]
        .getElement()
        .classList.add("active");
    }

    // Clear stadium lists
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
        const a = document.createElement("a");
        a.href = `/worldcup-2026/stadiums/?id=${s.id}`;
        a.textContent = s.name;
        li.appendChild(a);
        container.appendChild(li);
      });
  }

  /* ================= MAP MARKERS ================= */
  cities.forEach(city => {
    const icon = L.divIcon({
      className: "football-marker",
      html: "⚽",
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const marker = L.marker([city.lat, city.lng], {
      icon
    }).addTo(map);

    marker.on("click", () => activateCity(city.id));

    // Label
    L.marker([city.lat, city.lng], {
      icon: L.divIcon({
        className: "wc-city-label",
        html: city.name,
        iconAnchor: labelOffset(city)
      }),
      interactive: false
    }).addTo(map);

    cityById[city.id] = city;
    markerByCity[city.id] = marker;
    bounds.push([city.lat, city.lng]);
  });

  /* ================= CITY LIST CLICK ================= */
  document.querySelectorAll("[data-city]").forEach(item => {
    item.addEventListener("click", e => {
      if (e.target.tagName === "A") return;
      activateCity(item.dataset.city);
    });
  });

  /* ================= INITIAL VIEW ================= */
  map.fitBounds(bounds, {
    padding: [90, 90],
    maxZoom: 4
  });

})();
