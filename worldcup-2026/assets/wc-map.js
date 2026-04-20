(async function () {
  try {
    // ✅ FIXED PATHS
    const cities = await fetch("/worldcup-2026/data/cities.json").then(r => {
      if (!r.ok) throw new Error("Failed to load cities.json");
      return r.json();
    });

    const stadiums = await fetch("/worldcup-2026/data/stadiums.json").then(r => {
      if (!r.ok) throw new Error("Failed to load stadiums.json");
      return r.json();
    });

    // ✅ INIT MAP
    const map = L.map("map", {
      scrollWheelZoom: false,
      zoomControl: true
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    const bounds = [];

    // ✅ INDEX STADIUMS BY CITY
    const stadiumsByCity = {};
    stadiums.forEach(s => {
      stadiumsByCity[s.cityId] ??= [];
      stadiumsByCity[s.cityId].push(s);
    });

    const panelTitle = document.querySelector(".panel-title");
    const listRoot = document.getElementById("host-city-list");
    const resetBtn = document.querySelector(".reset-map");

    // ✅ RENDER CITY LIST
    function renderCities() {
      listRoot.innerHTML = "";
      panelTitle.textContent = "Select a host city";

      cities.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city.name;
        li.onclick = () => activateCity(city);
        listRoot.appendChild(li);
      });
    }

    // ✅ ACTIVATE CITY
    function activateCity(city) {
      panelTitle.textContent = city.name;
      map.setView([city.lat, city.lng], 6);

      listRoot.innerHTML = "";
      const ul = document.createElement("ul");

      (stadiumsByCity[city.id] || []).forEach(s => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${s.name}</strong><br>
          Capacity: ${s.capacity}
        `;
        ul.appendChild(li);
      });

      listRoot.appendChild(ul);
    }

    // ✅ MARKERS
    cities.forEach(city => {
      const marker = L.marker([city.lat, city.lng]).addTo(map);
      marker.on("click", () => activateCity(city));
      bounds.push([city.lat, city.lng]);
    });

    map.fitBounds(bounds, { padding: [90, 90], maxZoom: 4 });

    resetBtn.onclick = () => map.fitBounds(bounds, { padding: [90, 90], maxZoom: 4 });

    renderCities();

  } catch (e) {
    console.error("World Cup map failed to initialise:", e);
  }
})();
