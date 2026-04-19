(async function () {

  /* =============================
     LOAD DATA (HOST CITIES ONLY)
     ============================= */
  const hostCities = await fetch("/worldcup-2026/data/host-cities.json")
    .then(r => r.json());

  const stadiums = await fetch("/worldcup-2026/data/stadiums.json")
    .then(r => r.json());

  const stadiumsByHostCity = {};
  stadiums.forEach(s => {
    stadiumsByHostCity[s.hostCityId] ??= [];
    stadiumsByHostCity[s.hostCityId].push(s);
  });

  /* =============================
     INIT MAP
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
  const listRoot   = document.getElementById("host-city-list");
  const resetBtn   = document.querySelector(".reset-map");

  /* =============================
     RENDER HOST CITY LIST
     ============================= */
  function renderHostCities() {
    listRoot.innerHTML = "";
    panelTitle.textContent = "Select a host city";

    const byCountry = {};
    hostCities.forEach(c => {
      byCountry[c.country] ??= [];
      byCountry[c.country].push(c);
    });

    Object.entries(byCountry).forEach(([country, cities]) => {
      const h3 = document.createElement("h3");
      h3.textContent = country.toUpperCase();
      listRoot.appendChild(h3);

      const ul = document.createElement("ul");

      cities.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city.name;
        li.onclick = () => activateHostCity(city);
        ul.appendChild(li);
      });

      listRoot.appendChild(ul);
    });
  }

  /* =============================
     ACTIVATE HOST CITY
     ============================= */
  function activateHostCity(city) {
    panelTitle.textContent = city.name;
    map.setView([city.lat, city.lng], 6);

    listRoot.innerHTML = "";
    const ul = document.createElement("ul");

    (stadiumsByHostCity[city.id] || []).forEach(s => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${s.name}</strong><br>
        Capacity: ${s.capacity}<br>
        ${
          s.whatsappIntent
            ? `<a href="https://wa.me/?text=${encodeURIComponent(s.whatsappIntent)}"
                 target="_blank">
                 📲 Get matchday updates on WhatsApp
               </a>`
            : ""
        }
      `;
      ul.appendChild(li);
    });

    listRoot.appendChild(ul);
  }

  /* =============================
     RESET MAP
     ============================= */
  resetBtn.onclick = () => {
    map.fitBounds(initialBounds, { padding: [90, 90], maxZoom: 4 });
    renderHostCities();
  };

  /* =============================
     MAP MARKERS
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
      .on("click", () => activateHostCity(city));

    initialBounds.push([city.lat, city.lng]);
  });

  map.fitBounds(initialBounds, { padding: [90, 90], maxZoom: 4 });
  renderHostCities();

})();