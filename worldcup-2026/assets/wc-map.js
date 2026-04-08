(async function () {
  const map = L.map("map", { scrollWheelZoom: false })
    .setView([39.5, -98.35], 4);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const cities = await fetch("../data/cities.json").then(r => r.json());
  const stadiums = await fetch("../data/stadiums.json").then(r => r.json());

  const saved = JSON.parse(localStorage.getItem("wc26-saved") || "[]");

  function toggleSave(id) {
    const i = saved.indexOf(id);
    i >= 0 ? saved.splice(i, 1) : saved.push(id);
    localStorage.setItem("wc26-saved", JSON.stringify(saved));
  }

  const panelTitle = document.getElementById("panel-title");
  const panelBody = document.getElementById("panel-body");

  function renderCity(city) {
    panelTitle.textContent = city.name;
    panelBody.innerHTML = `
      <button class="save-btn">
        ${saved.includes(city.id) ? "★ Saved" : "☆ Save this city"}
      </button>

      <button class="export-btn">🖨 Export my World Cup map</button>

      <p><strong>${city.country}</strong> · ${city.region}</p>
    `;

    panelBody.querySelector(".save-btn").onclick = () => {
      toggleSave(city.id);
      renderCity(city);
    };

    panelBody.querySelector(".export-btn").onclick = () => {
      window.print();
    };
  }

  cities.forEach(city => {
    L.marker([city.lat, city.lng])
      .addTo(map)
      .on("click", () => renderCity(city));
  });
})();