(async function () {

  const map = L.map("map", {
    scrollWheelZoom: false,
    zoomControl: true
  });

  const tileLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { attribution: "© OpenStreetMap contributors" }
  ).addTo(map);

  const cities   = await fetch("/data/cities.json").then(r => r.json());
  const stadiums = await fetch("/data/stadiums.json").then(r => r.json());

  const cityById = {};
  const markerByCity = {};
  const initialBounds = [];

  cities.forEach(c => cityById[c.id] = c);

  /* =====================
     RESET MAP VIEW ✅
     ===================== */
  function resetMapView() {
    map.fitBounds(initialBounds, { padding: [90, 90], maxZoom: 4 });

    document.querySelectorAll("[data-city]").forEach(el => {
      el.classList.remove("active");
      const list = el.querySelector(".stadium-list");
      if (list) list.innerHTML = "";
    });

    document.querySelector(".panel-title").textContent = "Select a host city";
  }

  document.querySelector(".reset-map").addEventListener("click", resetMapView);

  /* =====================
     CITY ACTIVATION ✅
     ===================== */
  function activateCity(cityId) {
    const city = cityById[cityId];
    if (!city) return;

    map.setView([city.lat, city.lng], 6, { animate: true });

    document.querySelectorAll("[data-city]").forEach(el => {
      el.classList.remove("active");
      const list = el.querySelector(".stadium-list");
      if (list) list.innerHTML = "";
    });

    const cityEl = document.querySelector(`[data-city="${cityId}"]`);
    cityEl.classList.add("active");

    const list = cityEl.querySelector(".stadium-list");
    stadiums
      .filter(s => s.cityId === cityId)
      .forEach(s => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `/worldcup-2026/?stadium=${s.id}`; // ✅ Stadium mode
        a.textContent = s.name;
        li.appendChild(a);
        list.appendChild(li);
      });

    document.querySelector(".panel-title").textContent = city.name;
  }

  /* =====================
     MAP MARKERS ✅
     ===================== */
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

  /* =====================
     CITY LIST CLICK ✅
     ===================== */
  document.querySelectorAll("[data-city]").forEach(el => {
    el.addEventListener("click", e => {
      if (e.target.tagName === "A") return;
      activateCity(el.dataset.city);
    });
  });

  /* =====================
     URL MODE HANDLING ✅
     ===================== */
  const params = new URLSearchParams(location.search);
  if (params.get("stadium")) {
    // Stadium rendering logic you already approved comes here
  } else if (params.get("city")) {
    activateCity(params.get("city"));
  }

})();