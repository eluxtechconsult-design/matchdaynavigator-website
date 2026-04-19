(async function () {

  /* =============================
     DATA LOADING
     ============================= */
  const hostCities = await fetch("/worldcup-2026/data/host-cities.json").then(r => r.json());
  const stadiums   = await fetch("/worldcup-2026/data/stadiums.json").then(r => r.json());

  const stadiumsByCity = {};
  stadiums.forEach(s => {
    stadiumsByCity[s.hostCityId] ??= [];
    stadiumsByCity[s.hostCityId].push(s);
  });

  /* =============================
     MAP INITIALISATION
     ============================= */
  const map = L.map("map", {
    scrollWheelZoom: false,
    zoomControl: true
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const initialBounds = [];

  /* =============================
     UI REFERENCES
     ============================= */
  const panelTitle = document.querySelector(".panel-title");
  const panel      = document.getElementById("host-city-list");
  const resetBtn   = document.querySelector(".reset-map");

  /* =============================
     RENDER HOST CITY LIST ✅
     ============================= */
  function renderHostCityList() {
    panel.innerHTML = "";

    const byCountry = {};
    hostCities.forEach(c => {
      byCountry[c.country] ??= [];
      byCountry[c.country].push(c);
    });

    Object.entries(byCountry).forEach(([country, cities]) => {
      const h3 = document.createElement("h3");
      h3.textContent = country.toUpperCase();
      panel.appendChild(h3);

      const ul = document.createElement("ul");

      cities.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city.name;
        li.dataset.hostCity = city.id;

        const stadiumList = document.createElement("ul");
        stadiumList.className = "stadium-list";
        li.appendChild(stadiumList);

        li.addEventListener("click", () => activateHostCity(city.id));
        ul.appendChild(li);
      });

      panel.appendChild(ul);
    });

    panelTitle.textContent = "Select a host city";
  }

  /* =============================
     ACTIVATE HOST CITY ✅
     ============================= */
  function activateHostCity(cityId) {
    const city = hostCities.find(c => c.id === cityId);
    if (!city) return;

    panelTitle.textContent = city.name;
    map.setView([city.lat, city.lng], 6);

    document.querySelectorAll(".stadium-list").forEach(l => l.innerHTML = "");

    const li = document.querySelector(`[data-host-city="${cityId}"]`);
    const list = li.querySelector(".stadium-list");

    (stadiumsByCity[cityId] || []).forEach(stadium => {
      const sLi = document.createElement("li");
      sLi.innerHTML = `
        <strong>${stadium.name}</strong><br>
        Capacity: ${stadium.capacity}<br>
        ${stadium.whatsappIntent
          ? `<a target="_blank"
                href="https://wa.me/?text=${encodeURIComponent(stadium.whatsappIntent)}">
              📲 Get matchday updates on WhatsApp
            </a>` : ""}
      `;
      list.appendChild(sLi);
    });
  }

  /* =============================
     RESET MAP + LIST ✅
     ============================= */
  function resetMap() {
    map.fitBounds(initialBounds, { padding: [90, 90], maxZoom: 4 });
    renderHostCityList();
  }
  resetBtn.addEventListener("click", resetMap);

  /* =============================
     MAP MARKERS ✅
     ============================= */
  hostCities.forEach(city => {
    const icon = L.divIcon({
      className: "football-marker",
      html: "⚽",
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    L.marker([city.lat, city.lng], { icon })
      .addTo(map)
      .on("click", () => activateHostCity(city.id));

    L.marker([city.lat, city.lng], {
      icon: L.divIcon({
        className: "wc-city-label",
        html: city.name,
        iconAnchor: [0, -10]
      }),
      interactive: false
    }).addTo(map);

    initialBounds.push([city.lat, city.lng]);
  });

  map.fitBounds(initialBounds, { padding: [90, 90], maxZoom: 4 });

  renderHostCityList();

})();