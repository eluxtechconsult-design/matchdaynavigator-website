(async function () {
  // Initialize map
  const map = L.map("map", {
    scrollWheelZoom: false
  }).setView([39.5, -98.35], 4);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  // Load data
  const cities = await fetch("../data/cities.json").then(r => r.json());
  const stadiums = await fetch("../data/stadiums.json").then(r => r.json());

  // Saved cities (My World Cup Map)
  const saved = JSON.parse(localStorage.getItem("wc26-saved") || "[]");

  function toggleSave(cityId) {
    const idx = saved.indexOf(cityId);
    if (idx >= 0) {
      saved.splice(idx, 1);
    } else {
      saved.push(cityId);
    }
    localStorage.setItem("wc26-saved", JSON.stringify(saved));
  }

  const panelTitle = document.getElementById("panel-title");
  const panelBody = document.getElementById("panel-body");

  function renderCity(city) {
    const isSaved = saved.includes(city.id);
    const cityStadiums = stadiums.filter(s =>
      city.stadiums.includes(s.id)
    );

    panelTitle.textContent = city.name;
    panelBody.innerHTML = `
      <button class="save-btn">
        ${isSaved ? "★ Saved" : "☆ Save this city"}
      </button>

      <p><strong>${city.country}</strong> · ${city.region}</p>

      <h3>Stadiums</h3>
      <ul>
        ${cityStadiums.map(s => `
          <li>
            <strong>${s.name}</strong><br/>
            Capacity: ${s.capacity.toLocaleString()}<br/>
            <a href="../stadiums/index.html?id=${s.id}">
              View stadium details
            </a>
          </li>
        `).join("")}
      </ul>

      <p class="cta">
        📲 Matchday details are delivered via WhatsApp once you have a booking.
      </p>
    `;

    panelBody.querySelector(".save-btn")
      .addEventListener("click", () => {
        toggleSave(city.id);
        renderCity(city);
      });
  }

  // Add city markers
  cities.forEach(city => {
    const marker = L.marker([city.lat, city.lng]).addTo(map);
    marker.bindTooltip(city.name);
    marker.on("click", () => renderCity(city));
  });
})();
