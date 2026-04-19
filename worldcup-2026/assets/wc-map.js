(async function () {

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

  const cities   = await fetch("/data/cities.json").then(r => r.json());
  const stadiums = await fetch("/data/stadiums.json").then(r => r.json());

  const cityById    = {};
  const stadiumById = {};
  const markerByCity = {};
  const initialBounds = [];

  cities.forEach(c => cityById[c.id] = c);
  stadiums.forEach(s => stadiumById[s.id] = s);

  const panel = document.querySelector(".wc-city-panel");

  /* =============================
     RESET MAP VIEW ✅
     ============================= */
  function resetMapView() {
    map.fitBounds(initialBounds, { padding: [90, 90], maxZoom: 4 });

    document.querySelectorAll("[data-city]").forEach(el => {
      el.classList.remove("active");
      const ul = el.querySelector(".stadium-list");
      if (ul) ul.innerHTML = "";
    });

    panel.innerHTML = `
      <h2 class="panel-title">Select a host city</h2>
      <div class="panel-subtitle">
        Click a city name or map icon to view stadium details.
      </div>
    `;
  }

  document.querySelector(".reset-map").addEventListener("click", resetMapView);

  /* =============================
     STADIUM DETAIL VIEW ✅
     ============================= */
  function renderWhatsAppCTA(stadium) {
    if (!stadium.whatsappIntent) return "";
    const msg = encodeURIComponent(stadium.whatsappIntent);
    return `
      <p style="margin-top:16px">
        <a href="https://wa.me/?text=${msg}" target="_blank">
          📲 Get matchday updates on WhatsApp
        </a>
      </p>
    `;
  }

  function showStadium(stadiumId) {
    const stadium = stadiumById[stadiumId];
    if (!stadium) return;

    const city = cityById[stadium.cityId];

    panel.innerHTML = `
      <h2 class="panel-title">${stadium.name}</h2>
      <div class="panel-subtitle">${city?.name || ""}</div>

      <p><strong>Capacity:</strong> ${stadium.capacity}</p>
      <p>${stadium.description?.en || ""}</p>

      ${
        stadium.wcMatches?.length
          ? `
            <h3>World Cup 2026 matches</h3>
            <ul>
              ${stadium.wcMatches.map(m => `
                <li>
                  ${new Date(m.date).toDateString()} · ${m.stage} · ${m.kickoffLocal}<br>
                  ${m.homeTeam} vs ${m.awayTeam}
                </li>
              `).join("")}
            </ul>
          `
          : "<p><em>Match schedule to be confirmed.</em></p>"
      }

      ${renderWhatsAppCTA(stadium)}

      <p style="margin-top:16px">
        <a href="/worldcup-2026/">← Back to match map</a>
      </p>
    `;

    if (city) map.setView([city.lat, city.lng], 6);
  }

  /* =============================
     CITY ACTIVATION ✅
     ============================= */
  function activateCity(cityId) {
    const city = cityById[cityId];
    if (!city) return;

    map.setView([city.lat, city.lng], 6);

    document.querySelectorAll("[data-city]").forEach(el => {
      el.classList.remove("active");
      const ul = el.querySelector(".stadium-list");
      if (ul) ul.innerHTML = "";
    });

    const el = document.querySelector(`[data-city="${cityId}"]`);
    el.classList.add("active");

    const list = el.querySelector(".stadium-list");
    stadiums
      .filter(s => s.cityId === cityId)
      .forEach(s => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `/worldcup-2026/?stadium=${s.id}`;
        a.textContent = s.name;
        li.appendChild(a);
        list.appendChild(li);
      });

    panel.innerHTML = `
      <h2 class="panel-title">${city.name}</h2>
      <div class="panel-subtitle">Select a stadium</div>
    `;
  }

  /* =============================
     MAP MARKERS ✅
     ============================= */
  cities.forEach(city => {
    const footballIcon = L.divIcon({
      className: "football-marker",
      html: "⚽",
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const marker = L.marker([city.lat, city.lng], { icon: footballIcon })
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

  /* =============================
     CITY LIST CLICK ✅
     ============================= */
  document.querySelectorAll("[data-city]").forEach(el => {
    el.addEventListener("click", e => {
      if (e.target.tagName === "A") return;
      activateCity(el.dataset.city);
    });
  });

  /* =============================
     URL MODE HANDLING ✅
     ============================= */
  const params = new URLSearchParams(location.search);
  if (params.get("stadium")) {
    showStadium(params.get("stadium"));
  } else if (params.get("city")) {
    activateCity(params.get("city"));
  }

})();