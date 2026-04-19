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

  const cityById    = {};
  const stadiumById = {};

  cities.forEach(c => cityById[c.id] = c);
  stadiums.forEach(s => stadiumById[s.id] = s);

  const panel = document.querySelector(".wc-city-panel");

  /* =====================
     RENDER STADIUM DETAIL
     ===================== */
  function showStadium(stadiumId) {
    const stadium = stadiumById[stadiumId];
    if (!stadium) return;

    const city = cityById[stadium.cityId];

    panel.innerHTML = `
      <h2 class="panel-title">${stadium.name}</h2>
      <div class="panel-subtitle">
        ${city?.name || ""}
      </div>

      <p><strong>Capacity:</strong> ${stadium.capacity}</p>

      <p>${stadium.description?.en || ""}</p>

      ${stadium.matches?.length ? `
        <h3>World Cup matches</h3>
        <ul>
          ${stadium.matches.map(m => `
            <li>
              ${m.date} · ${m.stage}<br>
              ${m.homeTeam} vs ${m.awayTeam}
            </li>
          `).join("")}
        </ul>
      ` : ""}

      <p style="margin-top:16px">
        <a href="/worldcup-2026/" class="reset-map">
          ← Back to map
        </a>
      </p>
    `;

    if (city) map.setView([city.lat, city.lng], 6);
  }

  /* =====================
     EXISTING CITY LOGIC
     ===================== */
  function activateCity(cityId) {
    const city = cityById[cityId];
    if (!city) return;

    map.setView([city.lat, city.lng], 6);

    panel.innerHTML = `
      <h2 class="panel-title">${city.name}</h2>
      <div class="panel-subtitle">Select a stadium</div>
      <ul>
        ${stadiums
          .filter(s => s.cityId === cityId)
          .map(s => `
            <li>
              <a href="/worldcup-2026/?stadium=${s.id}">
                ${s.name}
              </a>
            </li>
          `).join("")}
      </ul>
    `;
  }

  /* =====================
     MAP MARKERS
     ===================== */
  cities.forEach(city => {
    const marker = L.marker([city.lat, city.lng]).addTo(map);
    marker.on("click", () => activateCity(city.id));
  });

  map.fitBounds(cities.map(c => [c.lat, c.lng]), { maxZoom: 4 });

  /* =====================
     URL MODE HANDLING ✅
     ===================== */
  const params = new URLSearchParams(location.search);

  if (params.get("stadium")) {
    showStadium(params.get("stadium"));
  } else if (params.get("city")) {
    activateCity(params.get("city"));
  }

})();