(async function () {

  const map = L.map("map", {
    scrollWheelZoom: false,
    zoomControl: true
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const cities   = await fetch("/data/cities.json").then(r => r.json());
  const stadiums = await fetch("/data/stadiums.json").then(r => r.json());

  const cityById = {};
  const markerByCity = {};
  const initialBounds = [];

  cities.forEach(c => cityById[c.id] = c);

  const panelTitle = document.querySelector(".panel-title");

  /* ✅ RESET MAP + LIST */
  function resetMapView() {
    map.fitBounds(initialBounds, { padding: [90, 90], maxZoom: 4 });

    document.querySelectorAll("[data-city]").forEach(el => {
      el.classList.remove("active");
      el.querySelector(".stadium-list").innerHTML = "";
    });

    panelTitle.textContent = "Select a host city";
  }

  document.querySelector(".reset-map").addEventListener("click", resetMapView);

  /* ✅ WHATSAPP CTA */
  function whatsappLink(text) {
    return `
      <li>
        https://wa.me/?text=${encodeURIComponent(text)}
          📲 Get matchday updates on WhatsApp
        </a>
      </li>
    `;
  }

  /* ✅ CITY ACTIVATION */
  function activateCity(cityId) {
    const city = cityById[cityId];
    if (!city) return;

    map.setView([city.lat, city.lng], 6);
    panelTitle.textContent = city.name;

    document.querySelectorAll("[data-city]").forEach(el => {
      el.classList.remove("active");
      el.querySelector(".stadium-list").innerHTML = "";
    });

    const cityEl = document.querySelector(`[data-city="${cityId}"]`);
    cityEl.classList.add("active");
    const list = cityEl.querySelector(".stadium-list");

    stadiums
      .filter(s => s.cityId === cityId)
      .forEach(s => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${s.name}</strong><br>
          Capacity: ${s.capacity}<br>
          ${s.description?.en || ""}
        `;
        list.appendChild(li);

        if (s.whatsappIntent) {
          list.insertAdjacentHTML("beforeend", whatsappLink(s.whatsappIntent));
        }
      });
  }

  /* ✅ MAP MARKERS */
  cities.forEach(city => {
    const icon = L.divIcon({
      className: "football-marker",
      html: "⚽",
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const marker = L.marker([city.lat, city.lng], { icon })
      .addTo(map)
      .on("click", () => activateCity(city.id));

    L.marker([city.lat, city.lng], {
      icon: L.divIcon({
        className: "wc-city-label",
        html: city.name,
        iconAnchor: [0, -10]
      }),
      interactive: false
    }).addTo(map);

    markerByCity[city.id] = marker;
    initialBounds.push([city.lat, city.lng]);
  });

  map.fitBounds(initialBounds, { padding: [90, 90], maxZoom: 4 });

  /* ✅ CITY LIST CLICK */
  document.querySelectorAll("[data-city]").forEach(el => {
    el.addEventListener("click", () => activateCity(el.dataset.city));
  });

})();